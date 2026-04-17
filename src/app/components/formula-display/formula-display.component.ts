import { Component, Input } from '@angular/core';
import { FormattedMoneyComponent } from "../formatted-money/formatted-money.component";
import { CommonModule } from '@angular/common';

// formula-display.component.ts
@Component({
  selector: 'app-formula-display',
  standalone: true,
  template: `
    <div class="formula-lines">
      <div class="formula-line" *ngFor="let line of formula">
        <span>{{line.text}}</span>
        <app-formatted-money 
          *ngIf="line.value !== undefined" 
          [value]="line.value"
          [decimals]="line.decimals || 2">
        </app-formatted-money>
      </div>
    </div>
  `,
  styles: [`
    .formula-lines {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .formula-line {
      display: flex;
      align-items: center;
      gap: 4px;
      white-space: pre-line;
    }
  `],
  imports: [CommonModule,FormattedMoneyComponent]
})
export class FormulaDisplayComponent {
  @Input() formula: {
    text: string;
    value?: number;
    decimals?: number;
  }[] = [];
}