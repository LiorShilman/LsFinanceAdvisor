// formatted-money.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-formatted-money',
  standalone: true,
  template: `
    <span [class.negative]="isNegative">
      {{formattedValue}}{{isNegative ? '-' : ''}}
    </span>
  `,
  styles: [`
    .negative {
      color: #ef4444 !important;
    }
  `]
})
export class FormattedMoneyComponent {
  @Input() value: number = 0;
  @Input() decimals: number = 2;
  
  get isNegative(): boolean {
    return this.value < 0;
  }
  
  get formattedValue(): string {
    return Math.abs(this.value).toLocaleString('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: this.decimals,
      maximumFractionDigits: this.decimals
    });
  }
}