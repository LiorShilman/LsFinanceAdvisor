// google-sso.component.ts - Custom styled button with transparent Google overlay

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';

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

  @ViewChild('googleBtnContainer') googleBtnContainer!: ElementRef;

  @Output() onSuccess = new EventEmitter<SSOResponse>();
  @Output() onError = new EventEmitter<string>();
  @Output() onLoading = new EventEmitter<boolean>();

  isLoading: boolean = false;
  errorMessage: string = '';
  isGoogleLoaded: boolean = false;

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
        cancel_on_tap_outside: true
      });

      this.isGoogleLoaded = true;

      // Render real Google button inside the overlay (transparent, on top of custom button)
      setTimeout(() => {
        if (this.googleBtnContainer?.nativeElement) {
          google.accounts.id.renderButton(
            this.googleBtnContainer.nativeElement,
            {
              type: 'standard',
              theme: 'outline',
              size: 'large',
              width: 400,
              text: 'continue_with',
              locale: 'he'
            }
          );
        }
      }, 200);

    } catch (error) {
      console.error('Google Identity Services initialization failed:', error);
      this.handleError('אתחול שירותי Google נכשל');
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
    } catch (error) {
      this.setLoading(false);
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
      return null;
    }
  }

  private setLoading(loading: boolean): void {
    this.isLoading = loading;
    this.onLoading.emit(loading);
  }

  public clearError(): void {
    this.errorMessage = '';
  }

  private handleError(message: string): void {
    this.errorMessage = message;
    this.isLoading = false;
    this.onError.emit(message);
  }
}
