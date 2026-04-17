import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { GoogleSsoComponent } from '../google-sso/google-sso.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,GoogleSsoComponent]
})
export class LoginComponent {
  apiUrl = 'http://localhost:5000/api'; // החלף עם ה-API שלך
  googleClientId = environment.googleID; // החלף עם Google Client ID שלך
  
  isLoginLoading = false;
  isGoogleLoading = false;

  constructor(
    private router: Router
    // הוסף כאן את השירותים הקיימים שלך
  ) {}

  // הטופס הקיים שלך
  onLogin(form: any): void {
    if (form.valid) {
      this.isLoginLoading = true;
      // הלוגיקה הקיימת שלך להתחברות
      console.log('Regular login:', form.value);
      
      // דמה התחברות (החלף עם הקוד שלך)
      setTimeout(() => {
        this.isLoginLoading = false;
        this.router.navigate(['/dashboard']);
      }, 2000);
    }
  }

  // טיפול בהתחברות Google מוצלחת
  handleGoogleSuccess(result: any): void {
    console.log('Google login success:', result);
    
    // שמור מה שאתה צריך
    localStorage.setItem('authToken', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));
    
    // עבור למסך הבא
    this.router.navigate(['/UsersList'], {
      queryParams: {
        fromGoogle: 'true',
        userName: result.user?.firstName,
        email: result.user?.email
      }
    });
  }

  private showSuccessMessage(message: string): void {
    // אפשרות 1: Console log פשוט
    console.log('SUCCESS:', message);
    
    // אפשרות 2: Alert פשוט
    // alert(message);
    
    // אפשרות 3: אם יש לך Toast/Notification service
    // this.toastr.success(message);
    
    // אפשרות 4: אם יש לך Angular Material Snackbar
    // this.snackBar.open(message, 'סגור', { duration: 3000 });
  }

  private showErrorMessage(message: string): void {
    // אפשרות 1: Console error פשוט
    console.error('ERROR:', message);
    
    // אפשרות 2: Alert פשוט
    // alert(message);
    
    // אפשרות 3: אם יש לך Toast/Notification service
    // this.toastr.error(message);
    
    // אפשרות 4: אם יש לך Angular Material Snackbar
    // this.snackBar.open(message, 'סגור', { duration: 5000, panelClass: ['error-snackbar'] });
  }


  // טיפול בשגיאת Google
  handleGoogleError(error: string): void {
    console.error('Google SSO Error:', error);
    
    // הצג הודעת שגיאה (השתמש במערכת הקיימת שלך)
    // this.toastr.error(error, 'שגיאה בהתחברות');
    alert(`שגיאה: ${error}`); // זמנית - החלף עם המערכת שלך
  }

  // טיפול במצב טעינה של Google
  handleGoogleLoading(isLoading: boolean): void {
    this.isGoogleLoading = isLoading;
  }
}