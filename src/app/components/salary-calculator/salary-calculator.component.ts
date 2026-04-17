import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormattedMoneyComponent } from '../formatted-money/formatted-money.component';
import { FormulaDisplayComponent } from "../formula-display/formula-display.component";
import { CalculateEmbedComponent } from './calculate-embed.component';

interface FormulaLine {
  text: string;
  value?: number;
}

interface SalaryData {
  grossSalary: number;
  netSalary: number;
  employerCost: number;
  pensionEmployer: number;
  pensionEmployee: number;
  severance: number;
  healthInsurance: number;
  niiEmployee: number;
  niiEmployer: number;
  incomeTax: number;
  grossTax: number;
  taxCredits: number;
  taxAfterCredits: number;
  discountAmount: number;
  totalDeductions: number;
  hourlyRate: number;
  studyFundEmployer: number;
  studyFundEmployee: number;
  hasStudyFund: boolean;
  monthlyHours: number;
  creditPoints: number;
  taxDiscount: number;
}

interface YearlyValues {
  yearlyGrossSalary: number;
  yearlyPension: number;
  yearlySeverance: number;
  yearlyStudyFund: number;
  yearlyNetSalary: number;
  yearlyBenefits: number;
  totalPackageValue: number;
}

interface FormType {
  hourlyRate: FormControl<number>;
  monthlyHours: FormControl<number>;
  creditPoints: FormControl<number>;
  taxDiscount: FormControl<number>;
  hasStudyFund: FormControl<boolean>;
}


@Component({
  selector: 'app-salary-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormattedMoneyComponent, FormulaDisplayComponent,CalculateEmbedComponent],
  templateUrl: './salary-calculator.component.html',
  styleUrls: ['./salary-calculator.component.css']
})
export class SalaryCalculatorComponent implements OnInit {
  calculatorForm = this.fb.group({
    hourlyRate: this.fb.control<number>(32.3),
    monthlyHours: this.fb.control<number>(182),
    creditPoints: this.fb.control<number>(2.25),
    taxDiscount: this.fb.control<number>(0),
    hasStudyFund: this.fb.control<boolean>(false)
  });

  // Constants
  // Constants
  readonly PENSION_EMPLOYER = 0.065;         // 6.5% הפרשת מעסיק לפנסיה
  readonly PENSION_EMPLOYEE = 0.06;          // 6% הפרשת עובד לפנסיה
  readonly SEVERANCE = 0.06;                 // 6% פיצויים
  readonly NII_THRESHOLD = 7522;             // תקרת ביטוח לאומי
  readonly NII_EMPLOYEE_LOW = 0.01;          // ביטוח לאומי עובד - מופחת
  readonly NII_EMPLOYEE_HIGH = 0.07;         // ביטוח לאומי עובד - רגיל
  readonly NII_EMPLOYER_LOW = 0.0415;        // ביטוח לאומי מעסיק - מופחת
  readonly NII_EMPLOYER_HIGH = 0.076;        // ביטוח לאומי מעסיק - רגיל
  readonly HEALTH_INSURANCE_LOW = 0.031;     // ביטוח בריאות - מופחת
  readonly HEALTH_INSURANCE_HIGH = 0.05;     // ביטוח בריאות - רגיל
  readonly CREDIT_POINT_VALUE = 235;         // ערך נקודת זיכוי
  readonly STUDY_FUND_EMPLOYER = 0.075;      // קרן השתלמות מעסיק
  readonly STUDY_FUND_EMPLOYEE = 0.025;      // קרן השתלמות עובד

  // Data holders
  salaryData!: SalaryData;
  yearlyData!: YearlyValues;
  monthlyBenefits = 0;

  // הגדרת המשתנים כתכונות רגילות
  formulas: {
    gross: FormulaLine[];
    pension: FormulaLine[];
    insurance: FormulaLine[];
    tax: FormulaLine[];
    net: FormulaLine[];
    employer: FormulaLine[];
    total: FormulaLine[];
  } = {
      gross: [],
      pension: [],
      insurance: [],
      tax: [],
      net: [],
      employer: [],
      total: []
    };

  creditPointsValue: SafeHtml = '';
  taxDiscountValue: SafeHtml = '';


  constructor(
    private fb: NonNullableFormBuilder,
    private sanitizer: DomSanitizer
  ) {
    this.initializeValues();
  }


  public formatPercent(value: number): string {
    return new Intl.NumberFormat('he-IL', {
      style: 'percent',
      maximumFractionDigits: 2
    }).format(value);
  }

  // הוספת מתודה עזר לפורמוט בטוח של מספרים שליליים וחיוביים
  getFormattedMoney(number: number): { value: string; isNegative: boolean } {
    const amount = Math.abs(number).toLocaleString('he-IL', {
      style: 'currency',
      currency: 'ILS',
      maximumFractionDigits: 0
    });

    return {
      value: amount,
      isNegative: number < 0
    };
  }

  // עדכון נוסחת הביטוח
  get insuranceDisplay() {
    if (!this.salaryData) return [];

    return [
      {
        label: 'ביטוח לאומי מעסיק',
        ...this.getFormattedMoney(this.salaryData.niiEmployer)
      },
      {
        label: 'ביטוח לאומי עובד',
        ...this.getFormattedMoney(-this.salaryData.niiEmployee)
      },
      {
        label: 'ביטוח בריאות',
        ...this.getFormattedMoney(-this.salaryData.healthInsurance)
      }
    ];
  }



  get formValues() {
    return {
      hourlyRate: this.calculatorForm.controls.hourlyRate.value,
      monthlyHours: this.calculatorForm.controls.monthlyHours.value,
      creditPoints: this.calculatorForm.controls.creditPoints.value,
      taxDiscount: this.calculatorForm.controls.taxDiscount.value,
      hasStudyFund: this.calculatorForm.controls.hasStudyFund.value
    };
  }


  ngOnInit(): void {
    this.calculatorForm.valueChanges.subscribe(() => {
      this.calculateSalary();
    });
    this.calculateSalary();
  }

  private initializeValues(): void {
    const formValues = this.calculatorForm.getRawValue();
    this.calculateInitialSalary(formValues);
  }

  private calculateInitialSalary(values: typeof this.calculatorForm.value): void {
    const {
      hourlyRate,
      monthlyHours,
      creditPoints,
      taxDiscount,
      hasStudyFund
    } = this.formValues;

    // Initialize base salary data
    const grossSalary = hourlyRate * monthlyHours;
    const studyFundEmployer = hasStudyFund ? grossSalary * this.STUDY_FUND_EMPLOYER : 0;
    const studyFundEmployee = hasStudyFund ? grossSalary * this.STUDY_FUND_EMPLOYEE : 0;

    // Calculate pension values
    const pensionEmployer = grossSalary * this.PENSION_EMPLOYER;
    const pensionEmployee = grossSalary * this.PENSION_EMPLOYEE;
    const severance = grossSalary * this.SEVERANCE;

    // Calculate insurance values
    const { niiEmployer, niiEmployee, healthInsurance } = this.calculateInsurance(grossSalary);

    // Calculate tax values
    const taxCredits = creditPoints * this.CREDIT_POINT_VALUE;
    const grossTax = this.calculateIncomeTax(grossSalary);
    const taxAfterCredits = Math.max(0, grossTax - taxCredits);
    const discountAmount = taxAfterCredits * (taxDiscount / 100);
    const incomeTax = Math.max(0, taxAfterCredits - discountAmount);

    // Calculate final values
    const totalDeductions = pensionEmployee + healthInsurance + niiEmployee + incomeTax + studyFundEmployee;
    const netSalary = grossSalary - totalDeductions;
    const employerCost = grossSalary + pensionEmployer + severance + niiEmployer + studyFundEmployer;

    this.salaryData = {
      grossSalary,
      netSalary,
      employerCost,
      pensionEmployer,
      pensionEmployee,
      severance,
      healthInsurance,
      niiEmployee,
      niiEmployer,
      incomeTax,
      grossTax,
      taxCredits,
      taxAfterCredits,
      discountAmount,
      totalDeductions,
      hourlyRate,
      studyFundEmployer,
      studyFundEmployee,
      hasStudyFund,
      monthlyHours,
      creditPoints,
      taxDiscount
    };

    this.updateDisplayDetailed(this.salaryData);
  }

  private calculateInsurance(grossSalary: number) {
    let niiEmployer: number;
    let niiEmployee: number;
    let healthInsurance: number;

    if (grossSalary <= this.NII_THRESHOLD) {
      niiEmployer = grossSalary * this.NII_EMPLOYER_LOW;
      niiEmployee = grossSalary * this.NII_EMPLOYEE_LOW;
      healthInsurance = grossSalary * this.HEALTH_INSURANCE_LOW;
    } else {
      niiEmployer = this.NII_THRESHOLD * this.NII_EMPLOYER_LOW +
        (grossSalary - this.NII_THRESHOLD) * this.NII_EMPLOYER_HIGH;
      niiEmployee = this.NII_THRESHOLD * this.NII_EMPLOYEE_LOW +
        (grossSalary - this.NII_THRESHOLD) * this.NII_EMPLOYEE_HIGH;
      healthInsurance = this.NII_THRESHOLD * this.HEALTH_INSURANCE_LOW +
        (grossSalary - this.NII_THRESHOLD) * this.HEALTH_INSURANCE_HIGH;
    }

    return { niiEmployer, niiEmployee, healthInsurance };
  }


  formatMoney(number: number): SafeHtml {
    const amount = Math.abs(number).toLocaleString('he-IL', {
      style: 'currency',
      currency: 'ILS',
      maximumFractionDigits: 0
    });

    if (number < 0) {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<span class="negative">${amount}-</span>`
      );
    }
    return this.sanitizer.bypassSecurityTrustHtml(amount);
  }

  private updateFormulas(): void {
    const data = this.salaryData;

    // Gross Formula
    this.formulas.gross = [
      { text: 'שכר לשעה × שעות חודשיות = שכר ברוטו' },
      {
        text: `${data.hourlyRate} × ${data.monthlyHours} = `,
        value: data.grossSalary
      }
    ];

    // Pension Formula
    this.formulas.pension = [
      {
        text: `הפרשת מעסיק לפנסיה: `,
        value: data.pensionEmployer
      },
      { text: `(${this.formatPercent(this.PENSION_EMPLOYER)})` },
      {
        text: `הפרשת מעסיק לפיצויים: `,
        value: data.severance
      },
      { text: `(${this.formatPercent(this.SEVERANCE)})` },
      {
        text: `הפרשת עובד לפנסיה: `,
        value: -data.pensionEmployee
      },
      { text: `(${this.formatPercent(this.PENSION_EMPLOYEE)})` }
    ];

    // Insurance Formula
    this.formulas.insurance = [
      {
        text: 'ביטוח לאומי מעסיק: ',
        value: data.niiEmployer
      },
      {
        text: 'ביטוח לאומי עובד: ',
        value: -data.niiEmployee
      },
      {
        text: 'ביטוח בריאות: ',
        value: -data.healthInsurance
      }
    ];

    // Tax Formula
    this.formulas.tax = [
      {
        text: 'מס לפי מדרגות: ',
        value: -data.grossTax
      },
      {
        text: 'זיכוי ממס: ',
        value: data.taxCredits
      },
      {
        text: 'מס אחרי זיכוי: ',
        value: -data.taxAfterCredits
      },
      {
        text: `סכום הנחת אזור (${this.formatPercent(data.taxDiscount / 100)}): `,
        value: data.discountAmount
      },
      {
        text: 'מס סופי לתשלום: ',
        value: -data.incomeTax
      }
    ];

    // Net Formula
    this.formulas.net = [
      { text: 'ברוטו - ניכויים = נטו' },
      {
        text: 'ברוטו: ',
        value: data.grossSalary
      },
      {
        text: 'ניכויים: ',
        value: data.totalDeductions
      },
      {
        text: 'נטו: ',
        value: data.netSalary
      }
    ];

    // Employer Formula
    const totalEmployerContributions = data.pensionEmployer +
      data.severance +
      data.niiEmployer +
      data.studyFundEmployer;

    this.formulas.employer = [
      { text: 'ברוטו + הפרשות מעסיק = עלות מעסיק' },
      {
        text: 'ברוטו: ',
        value: data.grossSalary
      },
      {
        text: 'הפרשות מעסיק: ',
        value: totalEmployerContributions
      },
      {
        text: 'עלות מעסיק: ',
        value: data.employerCost
      }
    ];

    // Total Package Formula
    const yearlyValues = {
      yearlyNetSalary: data.netSalary * 12,
      yearlyPension: (data.pensionEmployer + data.pensionEmployee) * 12,
      yearlySeverance: data.severance * 12,
      yearlyStudyFund: (data.studyFundEmployer + data.studyFundEmployee) * 12
    };

    const totalBenefits = yearlyValues.yearlyPension +
      yearlyValues.yearlySeverance +
      (data.hasStudyFund ? yearlyValues.yearlyStudyFund : 0);

    const totalPackageValue = yearlyValues.yearlyNetSalary + totalBenefits;

    this.formulas.total = [
      { text: 'שכר נטו שנתי + תנאים סוציאליים = ערך חבילה כולל' },
      {
        text: 'שכר נטו שנתי: ',
        value: yearlyValues.yearlyNetSalary
      },
      {
        text: 'תנאים סוציאליים: ',
        value: totalBenefits
      },
      {
        text: 'ערך חבילה כולל: ',
        value: totalPackageValue
      },
      { text: 'פירוט שנתי:' },
      {
        text: 'פנסיה: ',
        value: yearlyValues.yearlyPension
      },
      {
        text: 'פיצויים: ',
        value: yearlyValues.yearlySeverance
      },
      ...(data.hasStudyFund ? [{
        text: 'קרן השתלמות: ',
        value: yearlyValues.yearlyStudyFund
      }] : [])
    ];

    // Additional displays
    this.creditPointsValue = `${data.creditPoints} (${this.formatMoney(data.taxCredits)})`;
    this.taxDiscountValue = this.formatPercent(data.taxDiscount / 100);

    // Update yearly data
    this.yearlyData = {
      yearlyGrossSalary: data.grossSalary * 12,
      yearlyPension: yearlyValues.yearlyPension,
      yearlySeverance: yearlyValues.yearlySeverance,
      yearlyStudyFund: yearlyValues.yearlyStudyFund,
      yearlyNetSalary: yearlyValues.yearlyNetSalary,
      yearlyBenefits: totalBenefits,
      totalPackageValue: totalPackageValue
    };

    // Update monthly benefits
    this.monthlyBenefits = data.pensionEmployer +
      data.pensionEmployee +
      data.severance +
      (data.hasStudyFund ?
        data.studyFundEmployer + data.studyFundEmployee : 0);
  }

  private calculateIncomeTax(salary: number): number {
    const brackets = [
      { limit: 7010, rate: 0.1 },
      { limit: 10060, rate: 0.14 },
      { limit: 16150, rate: 0.2 },
      { limit: 22440, rate: 0.31 },
      { limit: 46690, rate: 0.35 },
      { limit: 60130, rate: 0.47 },
      { limit: Infinity, rate: 0.5 }
    ];

    let remainingSalary = salary;
    let totalTax = 0;
    let previousLimit = 0;

    for (const bracket of brackets) {
      if (remainingSalary <= 0) break;

      const taxableInBracket = Math.min(bracket.limit - previousLimit, remainingSalary);
      totalTax += taxableInBracket * bracket.rate;
      remainingSalary -= taxableInBracket;
      previousLimit = bracket.limit;
    }

    return totalTax;
  }

  updateDisplayDetailed(data: SalaryData): void {
    // Calculate yearly values
    const yearlyGrossSalary = data.grossSalary * 12;
    const yearlyPension = (data.pensionEmployer + data.pensionEmployee) * 12;
    const yearlySeverance = data.severance * 12;
    const yearlyStudyFund = (data.studyFundEmployer + data.studyFundEmployee) * 12;
    const yearlyNetSalary = data.netSalary * 12;

    // Calculate monthly and yearly benefits
    this.monthlyBenefits = data.pensionEmployer + data.pensionEmployee + data.severance +
      (data.hasStudyFund ? data.studyFundEmployer + data.studyFundEmployee : 0);
    const yearlyBenefits = this.monthlyBenefits * 12;

    // Calculate total package value
    const totalPackageValue = yearlyNetSalary + yearlyBenefits;

    // Update yearly data
    this.yearlyData = {
      yearlyGrossSalary,
      yearlyPension,
      yearlySeverance,
      yearlyStudyFund,
      yearlyNetSalary,
      yearlyBenefits,
      totalPackageValue
    };
  }

  calculateSalary(): void {
    const formValues = this.calculatorForm.getRawValue(); // Now TypeScript knows these values cannot be null
    const { hourlyRate, monthlyHours, creditPoints, taxDiscount, hasStudyFund } = formValues;

    // Gross salary calculation
    const grossSalary = hourlyRate * monthlyHours;

    // Study fund calculation
    const studyFundEmployer = hasStudyFund ? grossSalary * this.STUDY_FUND_EMPLOYER : 0;
    const studyFundEmployee = hasStudyFund ? grossSalary * this.STUDY_FUND_EMPLOYEE : 0;

    // Pension calculations
    const pensionEmployer = grossSalary * this.PENSION_EMPLOYER;
    const pensionEmployee = grossSalary * this.PENSION_EMPLOYEE;
    const severance = grossSalary * this.SEVERANCE;

    // Insurance calculations
    let niiEmployer = 0;
    let niiEmployee = 0;
    let healthInsurance = 0;

    if (grossSalary <= this.NII_THRESHOLD) {
      niiEmployer = grossSalary * this.NII_EMPLOYER_LOW;
      niiEmployee = grossSalary * this.NII_EMPLOYEE_LOW;
      healthInsurance = grossSalary * this.HEALTH_INSURANCE_LOW;
    } else {
      niiEmployer = this.NII_THRESHOLD * this.NII_EMPLOYER_LOW +
        (grossSalary - this.NII_THRESHOLD) * this.NII_EMPLOYER_HIGH;
      niiEmployee = this.NII_THRESHOLD * this.NII_EMPLOYEE_LOW +
        (grossSalary - this.NII_THRESHOLD) * this.NII_EMPLOYEE_HIGH;
      healthInsurance = this.NII_THRESHOLD * this.HEALTH_INSURANCE_LOW +
        (grossSalary - this.NII_THRESHOLD) * this.HEALTH_INSURANCE_HIGH;
    }

    // Tax calculations
    const taxCredits = creditPoints * this.CREDIT_POINT_VALUE;
    const grossTax = this.calculateIncomeTax(grossSalary);
    const taxAfterCredits = Math.max(0, grossTax - taxCredits);
    const discountAmount = taxAfterCredits * (taxDiscount / 100);
    const incomeTax = Math.max(0, taxAfterCredits - discountAmount);

    // Final calculations
    const totalDeductions = pensionEmployee + healthInsurance + niiEmployee + incomeTax + studyFundEmployee;
    const netSalary = grossSalary - totalDeductions;
    const employerCost = grossSalary + pensionEmployer + severance + niiEmployer + studyFundEmployer;

    this.salaryData = {
      grossSalary,
      netSalary,
      employerCost,
      pensionEmployer,
      pensionEmployee,
      severance,
      healthInsurance,
      niiEmployee,
      niiEmployer,
      incomeTax,
      grossTax,
      taxCredits,
      taxAfterCredits,
      discountAmount,
      totalDeductions,
      hourlyRate,
      studyFundEmployer,
      studyFundEmployee,
      hasStudyFund,
      monthlyHours,
      creditPoints,
      taxDiscount
    };

    // After setting salaryData
    this.updateDisplayDetailed(this.salaryData);
    this.updateFormulas();
  }
}