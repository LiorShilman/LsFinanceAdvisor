import { AfterViewInit, Component, OnInit } from '@angular/core';
import { GemelRowObj, ManagerInsuranceRowObj, OldPensionFundRowObj, PensionFundRowObj } from 'src/app/services/GeneralTypes/GeneralTypes';
import { GeneralInfoService } from 'src/app/services/general-info.service';
import { Chart } from 'chart.js/auto';
import * as Highcharts from 'highcharts';


declare var bootstrap: any;


// הוספת אינטרפייסים חדשים לפנסיית שאירים
export interface SurvivorsInsuranceRow {
  nameOfInsurance: string;
  currentCapitalAmount: string;
  monthlyDepositAmount: string;
  lumpSumDeath: string;
  monthlyPensionCoefficient: string;
  capitalForDeath: number;
  capitalForRetirement: number;
  monthlyPension: number;
  survivorsMonthlyPension: number;
}

export interface MaritalStatusInfo {
  status: 'married' | 'divorced-with-children' | 'divorced-no-children' | 'single-parent';
  spouseAge?: number;
  yearsMarried?: number;
  childrenAges: number[];
}


@Component({
  selector: 'app-pension',
  templateUrl: './pension.component.html',
  styleUrls: ['./pension.component.css']
})
export class PensionComponent implements OnInit , AfterViewInit {
  public chart: any;
  public survivorsChart: any;
  ColorArray: string[];
  Data: number[];
  updateFlag: boolean = false;
  Highcharts: typeof Highcharts = Highcharts;
  survivorsChartOptions!: Highcharts.Options;


  
  // נתונים לפנסיית שאירים
  survivorsInsuranceData: SurvivorsInsuranceRow[] = [];
  maritalStatus: MaritalStatusInfo = {
    status: 'married',
    spouseAge: 42,
    yearsMarried: 15,
    childrenAges: [8, 12]
  };
  
  // נתונים בסיסיים
  deceasedAge: number = 45;
  averageSalary: number = 15000;
  yearsInsured: number = 20;
  pensionFundAccumulation: number = 800000;
  
  // תוצאות חישובים
  calculationResults = {
    monthlyNationalInsurance: 0,
    monthlyPensionFund: 0,
    childrenPension: 0,
    totalPresentValue: 0,
    totalFutureValue: 0,
    divorceImpact: 0
  };

  constructor(public generalInfoService: GeneralInfoService) {
    this.ColorArray = new Array<string>(2);
    this.ColorArray[0] = "#5C2D8A";
    this.ColorArray[1] = "#8F49D6";
    this.Data = [];

     // אתחול נתוני פנסיית שאירים
     this.initializeSurvivorsData();
  };

  ngAfterViewInit(): void {
    // המתן קצת כדי לוודא שה-DOM מוכן
    setTimeout(() => {
      this.createSurvivorsChart();
      this.calculateSurvivorsPension(); // חישוב ראשוני
    }, 300);
  }

  ngOnInit(): void {

    // Bootstrap tooltip initialization
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    //this.createChart();
    this.createSurvivorsChart();
    this.calculateSurvivorsPension();
  }

  // אתחול נתוני פנסיית שאירים
  initializeSurvivorsData(): void {
    this.survivorsInsuranceData = [
      {
        nameOfInsurance: '',
        currentCapitalAmount: '',
        monthlyDepositAmount: '',
        lumpSumDeath: '',
        monthlyPensionCoefficient: '220',
        capitalForDeath: 0,
        capitalForRetirement: 0,
        monthlyPension: 0,
        survivorsMonthlyPension: 0
      }
    ];
  }

  // הוספת שורה חדשה לביטוח שאירים
  addSurvivorsInsuranceRow(): void {
    this.survivorsInsuranceData.push({
      nameOfInsurance: '',
      currentCapitalAmount: '',
      monthlyDepositAmount: '',
      lumpSumDeath: '',
      monthlyPensionCoefficient: '220',
      capitalForDeath: 0,
      capitalForRetirement: 0,
      monthlyPension: 0,
      survivorsMonthlyPension: 0
    });
  }

  updateChart() {
    this.chart.data.datasets[0].data = [];
    this.chart.data.datasets[0].data.push(this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[0].CalculatedMonthlyAllowances);
    this.chart.data.datasets[0].data.push(this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[0].DisabilityFund);
    this.chart.data.datasets[0].data.push(this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[0].WidowsAllowances);
    this.chart.update();
  }

  // בדיקת זכאות לפנסיית שאירים
  checkEligibility(): boolean {
    if (this.deceasedAge >= 67) return true;
    if (this.deceasedAge >= 40) return true;
    if (this.deceasedAge < 40 && this.yearsInsured >= 5) return true;
    return false;
  }

  getCoverageGap(): number {
    const pension = this.calculationResults?.monthlyPensionFund || 0;
    const children = this.calculationResults?.childrenPension || 0;
    const bituach = this.calculationResults?.monthlyNationalInsurance || 0;
    const total = pension + children + bituach;
    return Math.max(0, this.averageSalary - total);
  }

  // קבלת הסבר לזכאות
  getEligibilityReason(): string {
    const eligible = this.checkEligibility();
    
    if (!eligible) {
      const yearsNeeded = Math.max(0, 5 - this.yearsInsured);
      return `לא עומד בתנאי הזכאות: גיל ${this.deceasedAge} (נדרש 40+) ו-${this.yearsInsured} שנות ביטוח (נדרשות 5+ מתחת לגיל 40)`;
    } else if (this.deceasedAge >= 67) {
      return 'מוות לאחר גיל הפנסיה (67) - זכאות אוטומטית';
    } else if (this.deceasedAge >= 40) {
      return 'מוות בגיל 40 ומעלה - עמידה בתנאי הגיל';
    } else {
      return `צבירת ${this.yearsInsured} שנות ביטוח (60+ חודשים) - עמידה בתנאי הוותק למרות גיל צעיר`;
    }
  }

  // שינוי מצב משפחתי
  selectMaritalStatus(status: 'married' | 'divorced-with-children' | 'divorced-no-children' | 'single-parent'): void {
    this.maritalStatus.status = status;
    this.calculateSurvivorsPension();
  }

  // חישוב פנסיית שאירים מביטוח לאומי
  calculateNationalInsurancePension(): number {
    if (!this.checkEligibility()) return 0;

    const basePension = this.averageSalary * 0.28;
    const spousePension = this.maritalStatus.status === 'married' ? this.averageSalary * 0.14 : 0;
    
    // חישוב תוספות ילדים
    const eligibleChildren = this.maritalStatus.childrenAges.filter(age => age < 18).length;
    const firstChildBonus = eligibleChildren > 0 ? 800 : 0;
    const additionalChildrenBonus = eligibleChildren > 1 ? (eligibleChildren - 1) * 600 : 0;
    
    return basePension + spousePension + firstChildBonus + additionalChildrenBonus;
  }

  // חישוב פנסיית ילדים
  calculateChildrenPension(): number {
    if (this.maritalStatus.status.includes('divorced') || this.maritalStatus.status === 'single-parent') {
      const eligibleChildren = this.maritalStatus.childrenAges.filter(age => age < 18).length;
      return eligibleChildren * 1200; // שיעור גבוה יותר לילדים יתומים
    }
    return 0;
  }

  // חישוב השפעת גירושין
  calculateDivorceImpact(): number {
    if (this.maritalStatus.status.includes('divorced') && this.maritalStatus.yearsMarried) {
      const marriageRatio = Math.min(this.maritalStatus.yearsMarried / this.yearsInsured, 1);
      return marriageRatio * 50; // עד 50% עלולים לעבור לבן/בת זוג לשעבר
    }
    return 0;
  }

  // חישוב תקופת קבלת פנסיה
  calculatePensionPeriod(): { years: number; months: number } {
    let years = 0;
    
    if (this.maritalStatus.status === 'married' && this.maritalStatus.spouseAge) {
      years = Math.max(0, 85 - this.maritalStatus.spouseAge);
    } else if (this.maritalStatus.childrenAges.length > 0) {
      const youngestChild = Math.min(...this.maritalStatus.childrenAges);
      years = Math.max(0, 18 - youngestChild);
    } else {
      years = 10; // הערכה ברירת מחדל
    }
    
    return { years, months: years * 12 };
  }

  // חישוב מקיף של פנסיית שאירים
  calculateSurvivorsPension(): void {
    // חישוב פנסיה מביטוח לאומי
    this.calculationResults.monthlyNationalInsurance = this.calculateNationalInsurancePension();
    
    // חישוב פנסיה מקרן פנסיה
    this.calculationResults.monthlyPensionFund = this.pensionFundAccumulation * 0.003;
    
    // חישוב פנסיית ילדים
    this.calculationResults.childrenPension = this.calculateChildrenPension();
    
    // חישוב השפעת גירושין
    this.calculationResults.divorceImpact = this.calculateDivorceImpact();
    
    // חישוב ערכים נוכחיים ועתידיים
    const period = this.calculatePensionPeriod();
    const totalMonthly = this.calculationResults.monthlyNationalInsurance + 
                        this.calculationResults.monthlyPensionFund + 
                        this.calculationResults.childrenPension;
    
    this.calculationResults.totalPresentValue = totalMonthly * period.months;
    this.calculationResults.totalFutureValue = this.calculationResults.totalPresentValue * Math.pow(1.02, period.years);
    
    // עדכון גרפים
    this.updateSurvivorsChart();
  }

  // חישוב סיכומי ביטוח מנהלים לפנסיית שאירים
  calculateSurvivorsInsuranceSummary(): any {
    let totalCapital = 0;
    let totalMonthly = 0;
    let totalLumpSum = 0;
    let totalCapitalDeath = 0;
    let totalCapitalRetirement = 0;
    let totalMonthlyPension = 0;
    let totalSurvivorsMonthly = 0;

    this.survivorsInsuranceData.forEach(row => {
      totalCapital += this.parseNumber(row.currentCapitalAmount);
      totalMonthly += this.parseNumber(row.monthlyDepositAmount);
      totalLumpSum += this.parseNumber(row.lumpSumDeath);
      
      // חישוב הון למקרה מוות
      const currentCapital = this.parseNumber(row.currentCapitalAmount);
      const lumpSum = this.parseNumber(row.lumpSumDeath);
      row.capitalForDeath = currentCapital + lumpSum;
      totalCapitalDeath += row.capitalForDeath;
      
      // חישוב הון לגיל פנסיה
      const yearsToRetirement = Math.max(0, 67 - this.deceasedAge);
      const monthlyDeposit = this.parseNumber(row.monthlyDepositAmount);
      const futureValueDeposits = monthlyDeposit * 12 * yearsToRetirement * Math.pow(1.04, yearsToRetirement);
      const futureValueCurrent = currentCapital * Math.pow(1.04, yearsToRetirement);
      row.capitalForRetirement = futureValueCurrent + futureValueDeposits;
      totalCapitalRetirement += row.capitalForRetirement;
      
      // חישוב קצבה חודשית
      const coefficient = this.parseNumber(row.monthlyPensionCoefficient) || 220;
      row.monthlyPension = row.capitalForRetirement / coefficient;
      totalMonthlyPension += row.monthlyPension;
      
      // חישוב קצבת שאירים
      const spouseAge = this.maritalStatus.spouseAge || 42;
      const monthsToAge90 = Math.max(0, (90 - spouseAge) * 12);
      row.survivorsMonthlyPension = monthsToAge90 > 0 ? row.capitalForDeath / monthsToAge90 : 0;
      totalSurvivorsMonthly += row.survivorsMonthlyPension;
    });

    return {
      totalCapital,
      totalMonthly,
      totalLumpSum,
      totalCapitalDeath,
      totalCapitalRetirement,
      totalMonthlyPension,
      totalSurvivorsMonthly
    };
  }

  // פונקציית עזר לחישוב מספרים
  parseNumber(value: string): number {
    if (!value) return 0;
    return parseFloat(value.replace(/,/g, '')) || 0;
  }

  updateChildrenAges(value: string): void {
    if (value && value.trim()) {
      this.maritalStatus.childrenAges = value
        .split(',')
        .map(age => parseInt(age.trim()))
        .filter(age => !isNaN(age) && age >= 0 && age <= 25);
    } else {
      this.maritalStatus.childrenAges = [];
    }
    
    // חישוב מיידי
    this.calculateSurvivorsPension();
  }

  // עדכון גרף פנסיית שאירים
  updateSurvivorsChart(): void {
    if (!this.survivorsChartOptions) return;
  
    this.survivorsChartOptions.series = [{
      type: 'pie',
      name: 'פנסיית שארים',
      data: [
        { name: 'ביטוח לאומי', y: this.calculationResults.monthlyNationalInsurance },
        { name: 'קרן פנסיה', y: this.calculationResults.monthlyPensionFund },
        { name: 'פנסיית ילדים', y: this.calculationResults.childrenPension }
      ]
    }];
  
    this.updateFlag = true;
  }

  generateSurvivorsChartData(): { labels: string[], values: number[] } {
    return {
      labels: ['קצבת שארים', 'קצבת ילדים', 'סה״כ'],
      values: [
        this.calculationResults.monthlyPensionFund || 0,
        this.calculationResults.childrenPension || 0,
        (this.calculationResults.monthlyPensionFund || 0) + (this.calculationResults.childrenPension || 0)
      ]
    };
  }

  // יצירת גרף פנסיית שאירים
  createSurvivorsChart(): void {
    this.survivorsChartOptions = {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
      },
      title: { text: undefined },
      tooltip: {
        pointFormat: '<b>{point.y:.0f} ₪</b>'
      },
      accessibility: { point: { valueSuffix: '₪' } },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.y:.0f} ₪',
            color: 'white',
            style: { fontSize: '16px', fontWeight: 'bold' }
          },
          colors: ['#4ECDC4', '#4A90E2', '#9B59B6']
        }
      },
      series: [{
        type: 'pie',
        name: 'פנסיית שארים',
        data: [
          { name: 'ביטוח לאומי', y: this.calculationResults.monthlyNationalInsurance },
          { name: 'קרן פנסיה', y: this.calculationResults.monthlyPensionFund },
          { name: 'פנסיית ילדים', y: this.calculationResults.childrenPension }
        ]
      }]
    };
  
    this.updateFlag = true;
  }

  // יצירת תרחישים לטבלה
  generateSurvivorsScenarios(): any[] {
    const baseMonthly = this.calculationResults.monthlyNationalInsurance + 
                       this.calculationResults.monthlyPensionFund + 
                       this.calculationResults.childrenPension;
    
    const period = this.calculatePensionPeriod();
    
    return [
      {
        name: `תרחיש בסיסי (${this.getMaritalStatusText()})`,
        monthly: baseMonthly,
        childrenPension: this.calculationResults.childrenPension,
        period: `${period.years} שנים`,
        presentValue: baseMonthly * period.months,
        futureValue: baseMonthly * period.months * Math.pow(1.02, period.years),
        risk: this.maritalStatus.status.includes('divorced') ? 'בינוני-גבוה' : 'נמוך',
        flexibility: this.maritalStatus.status.includes('divorced') ? 'בינונית' : 'גבוהה'
      },
      {
        name: 'תרחיש אופטימי (+20%)',
        monthly: baseMonthly * 1.2,
        childrenPension: this.calculationResults.childrenPension * 1.2,
        period: `${period.years} שנים`,
        presentValue: baseMonthly * 1.2 * period.months,
        futureValue: baseMonthly * 1.2 * period.months * Math.pow(1.02, period.years),
        risk: 'נמוך',
        flexibility: 'גבוהה'
      },
      {
        name: 'תרחיש פסימי (-20%)',
        monthly: baseMonthly * 0.8,
        childrenPension: this.calculationResults.childrenPension * 0.8,
        period: `${period.years} שנים`,
        presentValue: baseMonthly * 0.8 * period.months,
        futureValue: baseMonthly * 0.8 * period.months * Math.pow(1.02, period.years),
        risk: 'בינוני-גבוה',
        flexibility: 'בינונית'
      },
      {
        name: 'ללא זכאות ב"ל',
        monthly: this.calculationResults.monthlyPensionFund,
        childrenPension: 0,
        period: `${period.years} שנים`,
        presentValue: this.calculationResults.monthlyPensionFund * period.months,
        futureValue: this.calculationResults.monthlyPensionFund * period.months * Math.pow(1.02, period.years),
        risk: 'גבוה',
        flexibility: 'נמוכה'
      }
    ];
  }


  getChildrenPensionLabel(): string {
    if (this.calculationResults.childrenPension > 0) {
      const numChildren = this.maritalStatus.childrenAges?.filter(age => age < 18).length || 0;
      return `פנסיה ישירה לילדים (${numChildren} ילדים)`;
    }
    return 'אין פנסיית ילדים נפרדת';
  }



  getChildrenPensionText(): string {
    if (this.calculationResults.childrenPension > 0) {
      const count = this.maritalStatus.childrenAges?.filter(age => age < 18).length || 0;
      return `פנסיה ישירה לילדים (${count} ילדים)`;
    }
    return 'אין פנסיית ילדים נפרדת';
  }

  getYearsToAge40(): number {
    return Math.max(0, 40 - this.deceasedAge);
  }
  
  getYearsTo5Insurance(): number {
    return Math.max(0, 5 - this.yearsInsured);
  }

  // קבלת טקסט מצב משפחתי
  getMaritalStatusText(): string {
    switch(this.maritalStatus.status) {
      case 'married': return 'נשוי/נשואה';
      case 'divorced-with-children': return 'גרוש/ה עם ילדים';
      case 'divorced-no-children': return 'גרוש/ה ללא ילדים';
      case 'single-parent': return 'הורה יחידני/ת';
      default: return 'לא מוגדר';
    }
  }

  // חישוב המלצות
  generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const eligible = this.checkEligibility();
    
    if (!eligible) {
      recommendations.push('⚠️ חוסר זכאות קריטי: ללא פנסיית שאירים מביטוח לאומי!');
    }

    if (this.maritalStatus.status.includes('divorced')) {
      recommendations.push('🔴 עדכון מוטבים: וודא שמוטבי קרן הפנסיה עדכניים ומתאימים למצבך החדש.');
      recommendations.push('📋 ביטוח חיים נוסף: שקול פוליסת ביטוח חיים נפרדת לכיסוי הילדים.');
      recommendations.push('⚖️ ייעוץ משפטי: התייעץ עם עורך דין לבירור זכויות בקרן הפנסיה.');
      
      if (this.calculationResults.divorceImpact > 0) {
        recommendations.push(`💸 השפעת הגירושין: עד ${Math.round(this.calculationResults.divorceImpact)}% מהקרן עלולים לעבור לבן/בת זוג לשעבר.`);
      }
    } else if (this.maritalStatus.status === 'single-parent') {
      recommendations.push('🔴 כיסוי מוגדל: כהורה יחידני, הכיסוי הביטוחי צריך להיות גבוה יותר.');
      recommendations.push('🎯 קרן חינוך: שקול פתיחת קרן חינוך או חיסכון ייעודי לילדים.');
      recommendations.push('👨‍👩‍👧‍👦 אפוטרופסות: קבע מראש אפוטרופס לילדים ולרכוש.');
    }

    if (this.calculationResults.childrenPension > 0) {
      recommendations.push(`👶 פנסיית ילדים: הילדים זכאים לקבל ${this.calculationResults.childrenPension.toLocaleString('he-IL')} ש"ח חודשי עד גיל 18.`);
    }

    recommendations.push('💡 עדכן צוואה בהתאם למצב המשפחתי החדש');
    recommendations.push('🛡️ שקול ביטוח חיים פוחת עם המשכנתא');
    recommendations.push('📈 בחן קרנות השתלמות כאלטרנטיבה לחיסכון');
    recommendations.push('🎯 תכנן מסלול פנסיה אישי נוסף');

    return recommendations;
  }

  // קבלת שאלה חכמה
  getSmartQuestion(): string {
    if (this.maritalStatus.status.includes('divorced')) {
      return '💭 בהתחשב במצבך כגרוש/ה, האם עדכנת את מוטבי קרן הפנסיה ושקלת ביטוח חיים נוסף לכיסוי הילדים?';
    } else if (this.maritalStatus.status === 'single-parent') {
      return '💭 כהורה יחידני/ת, האם קבעת אפוטרופס לילדים ובחנת את הצרכים הפיננסיים המיוחדים במצבך?';
    } else if (!this.checkEligibility()) {
      return '💭 בהתחשב בכך שאינך זכאי לפנסיית שאירים מביטוח לאומי, האם שקלת פוליסת ביטוח חיים נפרדת כדי להבטיח את עתיד המשפחה?';
    } else if (this.maritalStatus.childrenAges.length > 0) {
      return '💭 עם הילדים שלך, האם שקלת פתיחת קרן חינוך או חיסכון ייעודי נוסף לצרכים העתידיים שלהם?';
    } else {
      return '💭 האם תרצה לבחון תרחישי "מה אם" נוספים או אסטרטגיות מיטוב מס וירושה?';
    }
  }



  CalcManagerInsuranceCurrentCapitalAmounts(num: number) {
    this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].CurrentCapitalAmounts = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].ManagerInsuranceRows.length; i++) {
      this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].CurrentCapitalAmounts += (this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].ManagerInsuranceRows[i].CurrentCapitalAmount.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].ManagerInsuranceRows[i].CurrentCapitalAmount.replace(',', '')) : 0);
    }

    return this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].CurrentCapitalAmounts.toFixed(0).toString() != "0" ? this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].CurrentCapitalAmounts.toFixed(0).toString() : "";
  }

  CalcManagerInsuranceMonthlyDepositAmounts(num: number) {
    this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].MonthlyDepositAmounts = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].ManagerInsuranceRows.length; i++) {
      this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].MonthlyDepositAmounts += (this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].ManagerInsuranceRows[i].MonthlyDepositAmount.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].ManagerInsuranceRows[i].MonthlyDepositAmount.replace(',', '')) : 0);
    }

    return this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].MonthlyDepositAmounts.toFixed(0).toString() != "0" ? this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].MonthlyDepositAmounts.toFixed(0).toString() : "";
  }

  CalcManagerInsuranceLumpSums(num: number) {
    this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].LumpSums = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].ManagerInsuranceRows.length; i++) {
      this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].LumpSums += (this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].ManagerInsuranceRows[i].LumpSum.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].ManagerInsuranceRows[i].LumpSum.replace(',', '')) : 0);
    }

    return this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].LumpSums.toFixed(0).toString() != "0" ? this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].LumpSums.toFixed(0).toString() : "";
  }

  CalcManagerInsuranceCapitalAmountInCaseOfDeaths(num: number) {
    this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].CapitalAmountInCaseOfDeaths = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].ManagerInsuranceRows.length; i++) {
      this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].CapitalAmountInCaseOfDeaths += (this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].ManagerInsuranceRows[i].CapitalAmountInCaseOfDeath.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].ManagerInsuranceRows[i].CapitalAmountInCaseOfDeath.toFixed(0).toString().replace(',', '')) : 0);
    }

    return this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].CapitalAmountInCaseOfDeaths.toFixed(0).toString() != "0" ? this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].CapitalAmountInCaseOfDeaths.toFixed(0).toString() : "";
  }

  CalcManagerInsuranceCapitalAmountInCasePensions(num: number) {
    this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].CapitalAmountInCasePensions = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].ManagerInsuranceRows.length; i++) {
      this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].CapitalAmountInCasePensions += (this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].ManagerInsuranceRows[i].CapitalAmountInCasePension.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].ManagerInsuranceRows[i].CapitalAmountInCasePension.toFixed(0).toString().replace(',', '')) : 0);
    }

    return this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].CapitalAmountInCasePensions.toFixed(0).toString() != "0" ? this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].CapitalAmountInCasePensions.toFixed(0).toString() : "";
  }

  CalcManagerInsuranceMonthlyAllowances(num: number) {
    this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].MonthlyAllowances = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].ManagerInsuranceRows.length; i++) {
      this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].MonthlyAllowances += (this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].ManagerInsuranceRows[i].MonthlyAllowance.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].ManagerInsuranceRows[i].MonthlyAllowance.toFixed(0).toString().replace(',', '')) : 0);
    }

    return this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].MonthlyAllowances.toFixed(0).toString() != "0" ? this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].MonthlyAllowances.toFixed(0).toString() : "";
  }


  CalcManagerInsuranceManagerInsuranceMonthlyAllowances(num: number) {
    this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].ManagerInsuranceMonthlyAllowances = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].ManagerInsuranceRows.length; i++) {
      this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].ManagerInsuranceMonthlyAllowances += (this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].ManagerInsuranceRows[i].ManagerInsuranceMonthlyAllowance.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].ManagerInsuranceRows[i].ManagerInsuranceMonthlyAllowance.toFixed(0).toString().replace(',', '')) : 0);
    }

    return this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].ManagerInsuranceMonthlyAllowances.toFixed(0).toString() != "0" ? this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].ManagerInsuranceMonthlyAllowances.toFixed(0).toString() : "0";
  }

  CalcPensionCurrentCapitalAmounts(num: number) {
    this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].CurrentCapitalAmounts = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].PensionFundRows.length; i++) {
      this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].CurrentCapitalAmounts += (this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].PensionFundRows[i].CurrentCapitalAmount.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].PensionFundRows[i].CurrentCapitalAmount.replace(',', '')) : 0);
    }

    return this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].CurrentCapitalAmounts.toFixed(0).toString() != "0" ? this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].CurrentCapitalAmounts.toFixed(0).toString() : "";
  }

  CalcPensionMonthlyDepositAmounts(num: number) {
    this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].MonthlyDepositAmounts = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].PensionFundRows.length; i++) {
      this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].MonthlyDepositAmounts += (this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].PensionFundRows[i].MonthlyDepositAmount.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].PensionFundRows[i].MonthlyDepositAmount.replace(',', '')) : 0);
    }

    return this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].MonthlyDepositAmounts.toFixed(0).toString() != "0" ? this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].MonthlyDepositAmounts.toFixed(0).toString() : "";
  }

  CalcPensionMonthlyAllowances(num: number) {
    this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].FutureAmounts = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].PensionFundRows.length; i++) {
      this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].FutureAmounts += (this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].PensionFundRows[i].FutureAmount.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].PensionFundRows[i].FutureAmount.toFixed(0).toString().replace(',', '')) : 0);
    }

    return this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].FutureAmounts.toFixed(0).toString() != "0" ? this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].FutureAmounts.toFixed(0).toString() : "";
  }


  CalcPensionManagerInsuranceMonthlyAllowances(num: number) {
    this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].CalculatedMonthlyAllowances = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].PensionFundRows.length; i++) {
      this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].CalculatedMonthlyAllowances += (this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].PensionFundRows[i].CalculatedMonthlyAllowance.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].PensionFundRows[i].CalculatedMonthlyAllowance.toFixed(0).toString().replace(',', '')) : 0);
    }

    return this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].CalculatedMonthlyAllowances.toFixed(0).toString() != "0" ? this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].CalculatedMonthlyAllowances.toFixed(0).toString() : "";
  }

  CalcPensionWidowsAllowances(num: number) {
    this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].WidowsAllowances = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].PensionFundRows.length; i++) {
      this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].WidowsAllowances += (this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].PensionFundRows[i].WidowsAllowance.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].PensionFundRows[i].WidowsAllowance.replace(',', '')) : 0);
    }

    return this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].WidowsAllowances.toFixed(0).toString() != "0" ? this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].WidowsAllowances.toFixed(0).toString() : "";
  }


  CalcPensionOrphanAllowances(num: number) {
    this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].OrphanAllowances = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].PensionFundRows.length; i++) {
      this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].OrphanAllowances += (this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].PensionFundRows[i].OrphanAllowance.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].PensionFundRows[i].OrphanAllowance.replace(',', '')) : 0);
    }

    return this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].OrphanAllowances.toFixed(0).toString() != "0" ? this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].OrphanAllowances.toFixed(0).toString() : "";
  }

  CalcPensionDisabilityFund(num: number) {
    this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].DisabilityFund = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].PensionFundRows.length; i++) {
      this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].DisabilityFund += (this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].PensionFundRows[i].DisabilityFund.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].PensionFundRows[i].DisabilityFund.replace(',', '')) : 0);
    }

    //this.updateChart();
    return this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].DisabilityFund.toFixed(0).toString() != "0" ? this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].DisabilityFund.toFixed(0).toString() : "";
  }

  CalcOldPensionAllowanceAmount(num: number) {
    this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[num].AllowanceAmounts = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[num].OldPensionFundRows.length; i++) {
      this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[num].AllowanceAmounts += (this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[num].OldPensionFundRows[i].AllowanceAmount.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[num].OldPensionFundRows[i].AllowanceAmount.replace(',', '')) : 0);
    }

    return this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[num].AllowanceAmounts.toFixed(0).toString() != "0" ? this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[num].AllowanceAmounts.toFixed(0).toString() : "";
  }

  CalcOldPensionWidowsAllowances(num: number) {
    this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[num].WidowsAllowances = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[num].OldPensionFundRows.length; i++) {
      this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[num].WidowsAllowances += (this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[num].OldPensionFundRows[i].WidowsAllowance.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[num].OldPensionFundRows[i].WidowsAllowance.replace(',', '')) : 0);
    }

    return this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[num].WidowsAllowances.toFixed(0).toString() != "0" ? this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[num].WidowsAllowances.toFixed(0).toString() : "";
  }


  CalcOldPensionOrphanAllowances(num: number) {
    this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[num].OrphanAllowances = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[num].OldPensionFundRows.length; i++) {
      this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[num].OrphanAllowances += (this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[num].OldPensionFundRows[i].OrphanAllowance.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[num].OldPensionFundRows[i].OrphanAllowance.replace(',', '')) : 0);
    }

    return this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[num].OrphanAllowances.toFixed(0).toString() != "0" ? this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[num].OrphanAllowances.toFixed(0).toString() : "";
  }

  CalcSocialSecurityBenefitsAmounts(num: number) {
    this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[num].Amounts = 0;

    for (let i = 0; i < 3; i++) {
      this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[num].Amounts += (this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[num].SocialSecurityBenefitsRows[i].Amount.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[num].SocialSecurityBenefitsRows[i].Amount.replace(',', '')) : 0);
    }

    return this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[num].Amounts.toFixed(0).toString() != "0" ? this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[num].Amounts.toFixed(0).toString() : "";
  }

  CalcSumMonthlyPensia(num: number) {
    this.generalInfoService.AllInfo.PensiaViewInfo.SumMonthlyPensia[num] = 0;
    this.generalInfoService.AllInfo.PensiaViewInfo.SumMonthlyPensia[num] =
      (this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].MonthlyAllowances +
        this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].CalculatedMonthlyAllowances +
        this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[num].CalculatedMonthlyAllowances + // הוספת קופת גמל
        this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[num].AllowanceAmounts +
        (this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[num].SocialSecurityBenefitsRows[2].Amount.replace(',', '') != "" ? parseInt(this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[num].SocialSecurityBenefitsRows[2].Amount.replace(',', '')) : 0));
  
    return this.generalInfoService.AllInfo.PensiaViewInfo.SumMonthlyPensia[num];
  }

  CalcGapSumMonthlyPensia(num: number) {
    return this.generalInfoService.AllInfo.PensiaViewInfo.SumMonthlyPensia[num] - parseInt(this.generalInfoService.AllInfo.IncomesViewInfo.Income[num].replace(',', ''));
  }

  AddRowOld() {
    this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[0].OldPensionFundRows.push(new OldPensionFundRowObj());
  }

  AddRowManagerInsurance() {
    this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[0].ManagerInsuranceRows.push(new ManagerInsuranceRowObj());
  }

  AddRowPensia() {
    this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[0].PensionFundRows.push(new PensionFundRowObj());
  }

  
CalcGemelCurrentCapitalAmounts(num: number) {
  this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[num].CurrentCapitalAmounts = 0;

  for (let i = 0; i < this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[num].GemelRows.length; i++) {
    this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[num].CurrentCapitalAmounts += (this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[num].GemelRows[i].CurrentCapitalAmount.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[num].GemelRows[i].CurrentCapitalAmount.replace(',', '')) : 0);
  }

  return this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[num].CurrentCapitalAmounts.toFixed(0).toString() != "0" ? this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[num].CurrentCapitalAmounts.toFixed(0).toString() : "";
}

CalcGemelMonthlyDepositAmounts(num: number) {
  this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[num].MonthlyDepositAmounts = 0;

  for (let i = 0; i < this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[num].GemelRows.length; i++) {
    this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[num].MonthlyDepositAmounts += (this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[num].GemelRows[i].MonthlyDepositAmount.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[num].GemelRows[i].MonthlyDepositAmount.replace(',', '')) : 0);
  }

  return this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[num].MonthlyDepositAmounts.toFixed(0).toString() != "0" ? this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[num].MonthlyDepositAmounts.toFixed(0).toString() : "";
}

CalcGemelFutureAmounts(num: number) {
  this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[num].FutureAmounts = 0;

  for (let i = 0; i < this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[num].GemelRows.length; i++) {
    this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[num].FutureAmounts += (this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[num].GemelRows[i].FutureAmount.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[num].GemelRows[i].FutureAmount.toFixed(0).toString().replace(',', '')) : 0);
  }

  return this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[num].FutureAmounts.toFixed(0).toString() != "0" ? this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[num].FutureAmounts.toFixed(0).toString() : "";
}

CalcGemelCalculatedMonthlyAllowances(num: number) {
  this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[num].CalculatedMonthlyAllowances = 0;

  for (let i = 0; i < this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[num].GemelRows.length; i++) {
    this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[num].CalculatedMonthlyAllowances += (this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[num].GemelRows[i].CalculatedMonthlyAllowance.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[num].GemelRows[i].CalculatedMonthlyAllowance.toFixed(0).toString().replace(',', '')) : 0);
  }

  return this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[num].CalculatedMonthlyAllowances.toFixed(0).toString() != "0" ? this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[num].CalculatedMonthlyAllowances.toFixed(0).toString() : "";
}

  AddRowGemel() {
    this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[0].GemelRows.push(new GemelRowObj());
  }

  createChart() {
    const nf = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ILS",
      maximumFractionDigits: 0
    });

    const footer = (tooltipItems: any) => {
      /*       let sum = 0;
            //console.log(tooltipItems);
            if (tooltipItems[0].raw.length == 2)
              return `${nf.format(tooltipItems[0].raw[1] - tooltipItems[0].raw[0])} `;
            else
              return `${nf.format(tooltipItems[0].raw)}`;
       */
      return `${nf.format(tooltipItems[0].raw)}`
    };

    this.chart?.destroy();

    let delayed = false;
    this.chart = new Chart('MyChart', {
      type: 'polarArea',
      data: {
        labels: ['קיצבה חודשית', 'נכות', 'שאירים'],
        datasets: [
          {
            data: [],
            backgroundColor: ['LimeGreen','Yellow','Red']
          }
        ],
      },
      options: {
        responsive: true,
        scales: {
          r: {
            ticks: {
              z: 3,
              stepSize: 1000,
              color: 'white',
              backdropColor: 'transparent',
              font: {
                weight: 'bold', 
                size: 16
              },
              major: {
                enabled: false
              }
            },
            pointLabels: {
              display: true,
              centerPointLabels: true,
              color: 'white',
              font: {
                size: 18
              }
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: "#FFFFFF",
              font: {
                family: 'Comic Sans MS',
                size: 14,
                weight: 'bold',
                lineHeight: 1.2,
              }
            },
            title: {
              display: true,
              text: 'מסלולי פנסיה',
              color: "#FFFFFF",
              font: {
                family: 'Comic Sans MS',
                size: 28,
                weight: 'bold',
                lineHeight: 1.2,
              },
            },
          },
        },
      }
    });
  }
}
