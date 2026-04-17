// google-sso.component.ts - Google Identity Services with custom styled button

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';

// Interfaces
interface SSOResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    profilePicture?: string;
    role: string;
    isNewUser: boolean;
  };
  token?: string;
  expiresIn?: number;
  error?: string;
}

interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
  client_id?: string;
}

declare const google: any;

@Component({
  selector: 'app-google-sso',
  templateUrl: './google-sso.component.html',
  styleUrls: ['./google-sso.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class GoogleSsoComponent implements OnInit, OnDestroy {

  @Input() googleClientId: string = '';
  @Input() title: string = 'התחברות עם Google';
  @Input() subtitle: string = 'השתמש בחשבון Google שלך להתחברות מהירה';
  @Input() showTitle: boolean = true;
  @Input() buttonText: string = 'התחבר עם Google';
  @Input() buttonSize: 'sm' | 'md' | 'lg' = 'md';
  @Input() buttonVariant: 'primary' | 'outline' | 'light' = 'outline';
  @Input() showIcon: boolean = true;
  @Input() fullWidth: boolean = false;

  @ViewChild('hiddenGoogleBtn') hiddenGoogleBtn!: ElementRef;

  @Output() onSuccess = new EventEmitter<SSOResponse>();
  @Output() onError = new EventEmitter<string>();
  @Output() onLoading = new EventEmitter<boolean>();

  isLoading: boolean = false;
  errorMessage: string = '';
  isGoogleLoaded: boolean = false;
  isButtonDisabled: boolean = false;

  private destroy$ = new Subject<void>();

  constructor() {}

  ngOnInit(): void {
    this.loadGoogleIdentityServices();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadGoogleIdentityServices(): void {
    if (typeof google !== 'undefined' && google.accounts) {
      this.initializeGoogleSignIn();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => this.initializeGoogleSignIn();
    script.onerror = () => this.handleError('טעינת שירותי Google נכשלה');
    document.head.appendChild(script);
  }

  private initializeGoogleSignIn(): void {
    if (!this.googleClientId) {
      this.handleError('Google Client ID חסר');
      return;
    }

    try {
      google.accounts.id.initialize({
        client_id: this.googleClientId,
        callback: (response: GoogleCredentialResponse) => this.handleGoogleResponse(response),
        auto_select: false,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: false
      });

      this.isGoogleLoaded = true;
      this.isButtonDisabled = false;

      // Render hidden Google button for click delegation
      setTimeout(() => {
        if (this.hiddenGoogleBtn?.nativeElement) {
          google.accounts.id.renderButton(
            this.hiddenGoogleBtn.nativeElement,
            { type: 'standard', theme: 'outline', size: 'large', width: 300 }
          );
        }
      }, 100);

      console.log('Google Identity Services initialized successfully');
    } catch (error) {
      console.error('Google Identity Services initialization failed:', error);
      this.handleError('אתחול שירותי Google נכשל');
    }
  }

  // Custom button click -> trigger hidden Google button
  startGoogleSignIn(): void {
    if (!this.isGoogleLoaded || this.isButtonDisabled || this.isLoading) return;

    const hiddenBtn = this.hiddenGoogleBtn?.nativeElement;
    if (hiddenBtn) {
      const innerBtn = hiddenBtn.querySelector('[role="button"]') || hiddenBtn.querySelector('div[style]');
      if (innerBtn) {
        innerBtn.click();
        return;
      }
    }

    // Fallback: use prompt
    try {
      google.accounts.id.prompt();
    } catch (error) {
      console.error('Google Sign-In failed:', error);
      this.handleError('שגיאה בהתחברות עם Google');
    }
  }

  private handleGoogleResponse(response: GoogleCredentialResponse): void {
    if (!response.credential) {
      this.handleError('לא התקבל token מGoogle');
      return;
    }

    this.setLoading(true);
    this.clearError();

    try {
      const payload = this.parseJwtPayload(response.credential);
      if (!payload) throw new Error('לא ניתן לפענח את מידע המשתמש');

      const result: SSOResponse = {
        success: true,
        message: 'התחברות הצליחה',
        user: {
          id: payload.sub,
          email: payload.email,
          firstName: payload.given_name || '',
          lastName: payload.family_name || '',
          fullName: payload.name || `${payload.given_name || ''} ${payload.family_name || ''}`.trim(),
          profilePicture: payload.picture,
          role: 'user',
          isNewUser: false
        },
        token: response.credential,
        expiresIn: payload.exp ? payload.exp - Math.floor(Date.now() / 1000) : 3600
      };

      this.setLoading(false);
      this.onSuccess.emit(result);
      console.log(`התחברות הצליחה: ${result.user?.firstName}`);
    } catch (error) {
      this.setLoading(false);
      console.error('Error processing Google response:', error);
      this.handleError('שגיאה בעיבוד מידע המשתמש');
    }
  }

  private parseJwtPayload(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('JWT parsing error:', error);
      return null;
    }
  }

  private setLoading(loading: boolean): void {
    this.isLoading = loading;
    this.isButtonDisabled = loading;
    this.onLoading.emit(loading);
  }

  public clearError(): void {
    this.errorMessage = '';
  }

  private handleError(message: string): void {
    console.error('Google SSO Error:', message);
    this.errorMessage = message;
    this.isLoading = false;
    this.isButtonDisabled = false;
    this.onError.emit(message);
  }

  public retryAuthentication(): void {
    this.clearError();
    this.startGoogleSignIn();
  }

  public get buttonClasses(): string {
    const baseClasses = ['google-sso-btn'];
    if (this.buttonSize === 'sm') baseClasses.push('btn-sm');
    if (this.buttonSize === 'lg') baseClasses.push('btn-lg');
    if (this.buttonVariant === 'primary') baseClasses.push('btn-primary');
    if (this.buttonVariant === 'outline') baseClasses.push('btn-outline-primary');
    if (this.buttonVariant === 'light') baseClasses.push('btn-light');
    if (this.fullWidth) baseClasses.push('w-100');
    if (this.isLoading) baseClasses.push('loading');
    return baseClasses.join(' ');
  }
}
