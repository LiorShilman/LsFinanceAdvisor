import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GeneralInfoService } from 'src/app/services/general-info.service';

@Component({
  selector: 'app-relative',
  templateUrl: './relative.component.html',
  styleUrls: ['./relative.component.css']
})

export class RelativeComponent {
  @Input() Num = 1;
  @Output() NumChange = new EventEmitter<number>();
  @Input() Name = "";
  @Output() NameChange = new EventEmitter<string>();
  @Input() FatherAge = "";
  @Output() FatherAgeChange = new EventEmitter<string>();
  @Input() MotherAge = "";
  @Output() MotherAgeChange = new EventEmitter<string>();
  @Input() FatherCanHelp = 1;
  @Output() FatherCanHelpChange = new EventEmitter<number>();
  @Input() MotherCanHelp = 1;
  @Output() MotherCanHelpChange = new EventEmitter<number>();
  @Input() FatherNeedHelp = 1;
  @Output() FatherNeedHelpChange = new EventEmitter<number>();
  @Input() MotherNeedHelp = 1;
  @Output() MotherNeedHelpChange = new EventEmitter<number>();
  @Input() FatherGetF = "";
  @Output() FatherGetFChange = new EventEmitter<string>();
  @Input() MotherGetF = "";
  @Output() MotherGetFChange = new EventEmitter<string>();
  @Input() CommentFather = "";
  @Output() CommentFatherChange = new EventEmitter<string>();
  @Input() CommentMother = "";
  @Output() CommentMotherChange = new EventEmitter<string>();

  constructor(private personaDataBuilder: FormBuilder, public generalInfoService: GeneralInfoService) {
  }

  /**
   * מחזיר קלאס CSS לוולידציה של שדות
   * @param val - שם השדה לבדיקה
   * @returns string - קלאס CSS מתאים
   */
  GetClassValidation(val: string): string {
    // בדיקת תקינות בסיסית לפי סוג השדה
    switch (val) {
      case 'Age1':
      case 'FatherAge1':
        return this.validateAge(this.FatherAge);
      
      case 'MotherAge2':
      case 'MotherAge':
        return this.validateAge(this.MotherAge);
      
      case 'FatherGetF1':
      case 'FatherGetF':
        return this.validateInheritance(this.FatherGetF);
      
      case 'MotherGetF2':
      case 'MotherGetF':
        return this.validateInheritance(this.MotherGetF);
      
      case 'CommentFather1':
      case 'CommentFather':
        return this.validateComment(this.CommentFather, this.FatherAge);
      
      case 'CommentMother2':
      case 'CommentMother':
        return this.validateComment(this.CommentMother, this.MotherAge);
      
      default:
        return '';
    }
  }

  /**
   * מאמת גיל - צריך להיות מספר בין 0-120
   * @param age - הגיל לבדיקה
   * @returns string - קלאס CSS
   */
  private validateAge(age: string): string {
    if (!age || age.trim() === '') {
      return 'is-invalid';
    }
    
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
      return 'is-invalid';
    }
    
    return 'is-valid';
  }

  /**
   * מאמת סכום ירושה - צריך להיות מספר חיובי או ריק
   * @param amount - הסכום לבדיקה
   * @returns string - קלאס CSS
   */
  private validateInheritance(amount: string): string {
    // אם השדה ריק - זה תקין (לא חובה)
    if (!amount || amount.trim() === '') {
      return '';
    }
    
    // הסרת פסיקים ובדיקה שזה מספר חיובי
    const cleanAmount = amount.replace(/,/g, '');
    const amountNum = parseFloat(cleanAmount);
    
    if (isNaN(amountNum) || amountNum < 0) {
      return 'is-invalid';
    }
    
    return 'is-valid';
  }

  /**
   * מאמת הערה - חובה רק אם הוזן גיל
   * @param comment - ההערה לבדיקה
   * @param age - הגיל של הקרוב
   * @returns string - קלאס CSS
   */
  private validateComment(comment: string, age: string): string {
    // אם לא הוזן גיל - הערה לא חובה
    if (!age || age.trim() === '') {
      return '';
    }
    
    // אם הוזן גיל אבל לא הערה - זה לא תקין
    if (!comment || comment.trim() === '') {
      return 'is-invalid';
    }
    
    // אם ההערה קצרה מדי
    if (comment.trim().length < 2) {
      return 'is-invalid';
    }
    
    return 'is-valid';
  }

  /**
   * מטפל בשינויים במודל ופולט את הערך החדש
   * @param event - הערך החדש
   * @param type - סוג השדה שהשתנה
   */
  OnModelChange(event: any, type: string): void {
    // וידוא שהפונקציה קיימת לפני הקריאה
    const emitterName = `${type}Change`;
    const emitter = (this as any)[emitterName];
    
    if (emitter && typeof emitter.emit === 'function') {
      emitter.emit(event);
    } else {
      console.warn(`Emitter ${emitterName} not found or not a function`);
    }
  }

  /**
   * מחזיר טקסט הסבר לסליידר לפי הערך
   * @param value - ערך הסליידר (1-10)
   * @param type - סוג הסליידר ('help' או 'need')
   * @returns string - טקסט הסבר
   */
  getSliderText(value: number, type: 'help' | 'need'): string {
    if (type === 'help') {
      if (value <= 2) return 'לא יכול בכלל';
      if (value <= 4) return 'יכול מעט';
      if (value <= 6) return 'יכול בינוני';
      if (value <= 8) return 'יכול הרבה';
      return 'יכול מאוד';
    } else {
      if (value <= 2) return 'לא צריך';
      if (value <= 4) return 'צריך מעט';
      if (value <= 6) return 'צריך בינוני';
      if (value <= 8) return 'צריך הרבה';
      return 'צריך מאוד';
    }
  }

  /**
   * מחזיר צבע לסליידר לפי הערך
   * @param value - ערך הסליידר (1-10)
   * @param type - סוג הסליידר ('help' או 'need')
   * @returns string - מחלקת CSS לצבע
   */
  getSliderColor(value: number, type: 'help' | 'need'): string {
    if (type === 'help') {
      if (value <= 3) return 'slider-red';
      if (value <= 6) return 'slider-yellow';
      return 'slider-green';
    } else {
      if (value <= 3) return 'slider-green';
      if (value <= 6) return 'slider-yellow';
      return 'slider-red';
    }
  }

  /**
   * מנקה ומעצב מספר לתצוגה
   * @param value - הערך לעיצוב
   * @returns string - הערך המעוצב
   */
  formatNumber(value: string): string {
    if (!value || value.trim() === '') {
      return '';
    }
    
    // הסרת פסיקים קיימים
    const cleanValue = value.replace(/,/g, '');
    
    // בדיקה שזה מספר תקין
    const num = parseFloat(cleanValue);
    if (isNaN(num)) {
      return value;
    }
    
    // החזרה עם פסיקים
    return num.toLocaleString('he-IL');
  }

  /**
   * בדיקה האם השדה חובה
   * @param fieldType - סוג השדה
   * @returns boolean - האם השדה חובה
   */
  isFieldRequired(fieldType: string): boolean {
    switch (fieldType) {
      case 'age':
        return true;
      case 'inheritance':
        return false;
      case 'comment':
        // הערה חובה רק אם הוזן גיל
        return (this.FatherAge !== '' || this.MotherAge !== '');
      default:
        return false;
    }
  }

  /**
   * מחזיר הודעת שגיאה מתאימה לשדה
   * @param fieldType - סוג השדה
   * @param value - הערך הנוכחי
   * @returns string - הודעת השגיאה
   */
  getErrorMessage(fieldType: string, value: string): string {
    switch (fieldType) {
      case 'age':
        if (!value || value.trim() === '') {
          return 'יש להזין גיל';
        }
        const age = parseInt(value);
        if (isNaN(age)) {
          return 'יש להזין מספר תקין';
        }
        if (age < 0 || age > 120) {
          return 'גיל צריך להיות בין 0-120';
        }
        return '';
      
      case 'inheritance':
        if (value && value.trim() !== '') {
          const amount = parseFloat(value.replace(/,/g, ''));
          if (isNaN(amount) || amount < 0) {
            return 'יש להזין סכום חיובי';
          }
        }
        return '';
      
      case 'comment':
        if (!value || value.trim() === '') {
          return 'יש להזין הערה';
        }
        if (value.trim().length < 2) {
          return 'הערה צריכה להכיל לפחות 2 תווים';
        }
        return '';
      
      default:
        return '';
    }
  }
}