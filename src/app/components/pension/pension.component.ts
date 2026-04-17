import { AfterViewInit, Component, OnInit } from '@angular/core';
import { GemelRowObj, ManagerInsuranceRowObj, OldPensionFundRowObj, PensionFundRowObj } from 'src/app/services/GeneralTypes/GeneralTypes';
import { GeneralInfoService } from 'src/app/services/general-info.service';
import { Chart } from 'chart.js/auto';
import * as Highcharts from 'highcharts';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PensionCalculatorComponent } from '../pension/pension-calculator_component';
import { Form161dEmbedComponent } from '../pension/form161d-embed.component';
import { RetirementRaceEmbedComponent } from '../pension/retirement-race-embed.component';

declare var bootstrap: any;

// קבועים למערכת הביטוח הלאומי 2025
const AVERAGE_WAGE_2025 = 13316; // השכר הממוצע במשק
const CHILD_ALLOWANCE_FIRST = 800; // תוספת ילד ראשון
const CHILD_ALLOWANCE_ADDITIONAL = 600; // תוספת ילדים נוספים
const DIRECT_CHILDREN_PENSION = 1200; // פנסיית ילדים ישירה לגרושים/רווקים

interface SurvivorsData {
  age: number;
  salary: number;
  spouseAge: number;
  yearsMarried: number;
  yearsInsured: number;
  children: number;
  childrenAges: string;
  pensionFund: number;
}


interface SurvivorsResults {
  show: boolean;
  monthlyNationalInsurance: number;
  monthlyPensionFund: number;
  childrenPension: number;
  totalPresentValue: number;
  totalFutureValue: number;
  inheritanceValue: number;
  lostAmount: number;
  totalMonthly: number;
  yearsToReceive: number;
  calculationBreakdown: string;
  explanations: {
    nationalInsurance: string;
    pensionFund: string;
    children: string;
    presentValue: string;
    futureValue: string;
  };
  recommendations: string;
  smartQuestion: string;
}

interface SurvivorsTestScenario {
  status: string;
  age: number;
  salary: number;
  spouseAge?: number;
  yearsMarried?: number;
  yearsInsured: number;
  children: number;
  childrenAges: string;
  pensionFund: number;
  description?: string;
  isLossScenario?: boolean;
}


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
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule, FormsModule ,PensionCalculatorComponent,Form161dEmbedComponent,RetirementRaceEmbedComponent],
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

   // משתנים חדשים לפנסיית שאירים
   survivorsMaritalStatus: string = 'single-no-children';
   survivorsMaritalStatusInfo: string = '';
   survivorsEligibilityVisible: boolean = false;
   survivorsEligibilityStatus: string = '';
   survivorsEligibilityExplanations: string = '';
   
   survivorsData: SurvivorsData = {
     age: 35,
     salary: 12000,
     spouseAge: 42,
     yearsMarried: 15,
     yearsInsured: 7,
     children: 0,
     childrenAges: '',
     pensionFund: 220000
   };

   
 
   survivorsResults: SurvivorsResults = {
     show: false,
     monthlyNationalInsurance: 0,
     monthlyPensionFund: 0,
     childrenPension: 0,
     totalPresentValue: 0,
     totalFutureValue: 0,
     inheritanceValue: 0,
     lostAmount: 0,
     totalMonthly: 0,
     yearsToReceive: 0,
     calculationBreakdown: '',
     explanations: {
       nationalInsurance: '',
       pensionFund: '',
       children: '',
       presentValue: '',
       futureValue: ''
     },
     recommendations: '',
     smartQuestion: ''
   };
 
   // גרפי פנסיית שאירים
   survivorsChartOptions: Highcharts.Options = {};
   survivorsComparisonChartOptions: Highcharts.Options = {};

  // תרחישי בדיקה - מלא ומעודכן
survivorsTestScenarios: { [key: number]: SurvivorsTestScenario } = {
  1: {
    status: 'single-no-children',
    age: 35,
    salary: 12000,
    yearsInsured: 7,
    children: 0,
    childrenAges: '',
    pensionFund: 220000,
    description: 'רווק ללא ילדים - אין זכאות לפנסיה'
  },
  2: {
    status: 'divorced-with-children',
    age: 45,
    salary: 15000,
    yearsInsured: 10,
    children: 1,
    childrenAges: '10',
    pensionFund: 400000,
    description: 'גרוש עם ילד - זכאות מוגבלת'
  },
  3: {
    status: 'married',
    age: 50,
    spouseAge: 45,
    salary: 18000,
    yearsInsured: 20,
    children: 2,
    childrenAges: '8,12',
    pensionFund: 600000,
    yearsMarried: 15,
    description: 'נשוי עם ילדים - זכאות מלאה'
  },
  4: {
    status: 'single-with-children',
    age: 30,
    salary: 10000,
    yearsInsured: 6,
    children: 3,
    childrenAges: '5,9,16',
    pensionFund: 300000,
    description: 'הורה יחידני עם ילדים'
  },
  5: {
    status: 'married',
    age: 68,
    spouseAge: 62,
    salary: 16000,
    yearsInsured: 30,
    children: 0,
    childrenAges: '',
    pensionFund: 950000,
    yearsMarried: 25,
    description: 'פנסיונר נשוי ללא ילדים'
  },
  6: {
    status: 'married',
    age: 67,
    spouseAge: 63,
    salary: 18000,
    yearsInsured: 30,
    children: 2,
    childrenAges: '25,28',
    pensionFund: 800000,
    yearsMarried: 35,
    description: 'פנסיונר עם ילדים בוגרים - אובדן 40%',
    isLossScenario: true
  },
  7: {
    status: 'divorced-no-children',
    age: 39,
    salary: 14000,
    yearsInsured: 3,
    children: 0,
    childrenAges: '',
    pensionFund: 180000,
    description: 'גרוש צעיר ללא ילדים - חוסר זכאות'
  },
  8: {
    status: 'single-with-children',
    age: 42,
    salary: 12000,
    yearsInsured: 15,
    children: 2,
    childrenAges: '7,14',
    pensionFund: 380000,
    description: 'הורה יחידני בגיל בינוני'
  },
  9: {
    status: 'married',
    age: 47,
    spouseAge: 45,
    salary: 13000,
    yearsInsured: 15,
    children: 0,
    childrenAges: '',
    pensionFund: 450000,
    yearsMarried: 10,
    description: 'נשוי ללא ילדים בגיל בינוני'
  },
  10: {
    status: 'divorced-no-children',
    age: 60,
    salary: 14000,
    yearsInsured: 20,
    children: 1,
    childrenAges: '25',
    pensionFund: 520000,
    description: 'גרוש עם ילדים בוגרים - אין זכאות'
  },
  11: {
    status: 'single-with-children',
    age: 28,
    salary: 11000,
    yearsInsured: 6,
    children: 1,
    childrenAges: '4',
    pensionFund: 240000,
    description: 'אם צעירה עם ילד קטן'
  },
  12: {
    status: 'married',
    age: 72,
    spouseAge: 68,
    salary: 20000,
    yearsInsured: 35,
    children: 2,
    childrenAges: '45,42',
    pensionFund: 1200000,
    yearsMarried: 40,
    description: 'פנסיונר מבוגר עם ילדים בוגרים'
  },
  13: {
    status: 'divorced-with-children',
    age: 45,
    spouseAge: 42,
    salary: 18000,
    yearsInsured: 20,
    children: 2,
    childrenAges: '8,12',
    pensionFund: 600000,
    yearsMarried: 15,
    description: 'גירושין אחרי 15 שנות נישואין - אובדן זכויות שאירים'
  },
  14: {
    status: 'divorced-no-children',
    age: 58,
    spouseAge: 55,
    salary: 25000,
    yearsInsured: 30,
    children: 2,
    childrenAges: '25,28',
    pensionFund: 1200000,
    yearsMarried: 25,
    description: 'גירושין מאוחרים - אובדן מלא של זכויות שאירים'
  },
  15: {
    status: 'married',
    age: 55,
    spouseAge: 50,
    salary: 30000,
    yearsInsured: 25,
    children: 1,
    childrenAges: '22',
    pensionFund: 1500000,
    yearsMarried: 20,
    description: 'שכר גבוה - בדיקת מיסוי פנסיה מעל הפטור'
  }
};


// משתנים נוספים לתמיכה בכל הפיצ'רים החדשים
survivorsFlowDiagramHtml: string = '';
survivorsAdvancedAnalysisHtml: string = '';
survivorsDivorceResultsHtml: string = '';
survivorsScenariosTableData: any[] = [];

// ביטוח חיים
lifeInsuranceAge: number = 35;
lifeInsuranceCoverage: number = 1000000;
healthStatus: string = 'good';
isSmoker: boolean = false;
lifeInsuranceResults = {
  show: false,
  monthlyPremium: 0,
  annualPremium: 0,
  totalCost: 0
};

// הגדרות מתקדמות
showAdvancedSettings: boolean = false;
advancedSettings = {
  inflationRate: 2.0,
  realReturn: 3.0,
  retirementAge: 67,
  lifeExpectancy: 85
};

    // טיימר לעיכוב חישוב
    private survivorsCalculationTimer: any;


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
    /* setTimeout(() => {
      this.createSurvivorsChart();
      this.calculateSurvivorsPension(); // חישוב ראשוני
    }, 300); */

    setTimeout(() => {
      this.createSurvivorsCharts();
    }, 500);


  }

  ngOnInit(): void {

    // Bootstrap tooltip initialization
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    //this.createChart();
/*     this.createSurvivorsChart();
    this.calculateSurvivorsPension();
 */
    this.initializeSurvivorsDefaults();


  }

  initializeSurvivorsDefaults(): void {
    this.selectSurvivorsMaritalStatus('single-no-children');
  }

  // בחירת מצב משפחתי
  selectSurvivorsMaritalStatus(status: string): void {
    this.survivorsMaritalStatus = status;
    this.updateSurvivorsMaritalStatusInfo();
    this.calculateSurvivorsPensionDelayed();
  }

  // עדכון מידע מצב משפחתי
  updateSurvivorsMaritalStatusInfo(): void {
    switch (this.survivorsMaritalStatus) {
      case 'married':
        this.survivorsMaritalStatusInfo = '';
        break;
      case 'single-no-children':
        this.survivorsMaritalStatusInfo = `
          <div class="survivors-warning-message">
            <h4>👤 רווק/ה ללא ילדים</h4>
            <p>אין שאירים זכאים לפנסיה. הצבירה בקרן הפנסיה תועבר ליורשים לפי צוואה או חוק הירושה.</p>
            <p><strong>חשוב:</strong> מומלץ לערוך צוואה ולשקול ביטוח חיים</p>
          </div>
        `;
        break;
      case 'single-with-children':
        this.survivorsMaritalStatusInfo = `
          <div class="survivors-warning-message">
            <h4>👤👶 רווק/ה עם ילדים</h4>
            <p>הילדים זכאים לפנסיית שאירים. חשוב לתכנן מראש אפוטרופסות ומימון לילדים.</p>
          </div>
        `;
        break;
      case 'divorced-with-children':
        this.survivorsMaritalStatusInfo = `
          <div class="survivors-warning-message">
            <h4>📋 גרוש/ה עם ילדים</h4>
            <p>זכויות הפנסיה יעברו לילדים בלבד. ייתכנו זכויות מוגבלות לבן/בת זוג לשעבר.</p>
          </div>
        `;
        break;
      case 'divorced-no-children':
        this.survivorsMaritalStatusInfo = `
          <div class="survivors-error-message">
            <h4>📋 גרוש/ה ללא ילדים</h4>
            <p>אין שאירים זכאים. הצבירה נשארת בקרן ועוברת ליורשים לפי צוואה או חוק הירושה.</p>
          </div>
        `;
        break;
    }
  }

  // בדיקה אם להציג שדות ילדים
  shouldShowChildrenSection(): boolean {
    return ['married', 'single-with-children', 'divorced-with-children'].includes(this.survivorsMaritalStatus);
  }

  // חישוב עם עיכוב
  calculateSurvivorsPensionDelayed(): void {
    if (this.survivorsCalculationTimer) {
      clearTimeout(this.survivorsCalculationTimer);
    }
    this.survivorsCalculationTimer = setTimeout(() => {
      this.calculateSurvivorsPension();
    }, 300);
  }

  // החישוב הראשי
  calculateSurvivorsPension(): void {
    // בדיקת זכאות
    const eligibilityResult = this.checkSurvivorsEligibility();
    this.displaySurvivorsEligibilityStatus(eligibilityResult);

    let results: any = {
      monthlyNationalInsurance: 0,
      monthlyPensionFund: 0,
      childrenPension: 0,
      totalPresentValue: 0,
      totalFutureValue: 0,
      inheritanceValue: 0,
      lostAmount: 0,
      totalMonthly: 0,
      yearsToReceive: 0
    };

    if (eligibilityResult.eligible) {
      results = this.calculateAllSurvivorsPensions();
    } else {
      // אם לא זכאי, הצבירה עוברת ליורשים
      if (['single-no-children', 'divorced-no-children'].includes(this.survivorsMaritalStatus)) {
        results.inheritanceValue = this.survivorsData.pensionFund;
      }
    }

    // עדכון תוצאות
    this.updateSurvivorsResults(results);

    // עדכון גרפים
    this.updateSurvivorsCharts();
  }

  // בדיקת זכאות
  checkSurvivorsEligibility(): { eligible: boolean; reason: string } {
    const age = this.survivorsData.age;
    const yearsInsured = this.survivorsData.yearsInsured;

    if (age >= 67) return { eligible: true, reason: 'age-67' };
    if (age >= 40) return { eligible: true, reason: 'age-40' };
    if (age < 40 && yearsInsured >= 5) return { eligible: true, reason: 'years-5' };
    return { eligible: false, reason: 'not-eligible' };
  }

  // הצגת סטטוס זכאות
  displaySurvivorsEligibilityStatus(eligibilityResult: { eligible: boolean; reason: string }): void {
    const { eligible, reason } = eligibilityResult;
    const age = this.survivorsData.age;
    const yearsInsured = this.survivorsData.yearsInsured;

    let statusText = '';
    let explanations: string[] = [];

    if (eligible) {
      statusText = `<div class="survivors-success-message"><h4>✅ זכאי לפנסיית שאירים</h4>`;
      switch (reason) {
        case 'age-67':
          statusText += '<p>מוות לאחר גיל הפנסיה (67) - זכאות אוטומטית</p>';
          break;
        case 'age-40':
          statusText += '<p>מוות בגיל 40 ומעלה - עמידה בתנאי הגיל</p>';
          break;
        case 'years-5':
          statusText += `<p>צבירת ${yearsInsured} שנות ביטוח (60+ חודשים) - עמידה בתנאי הוותק</p>`;
          break;
      }
    } else {
      statusText = `<div class="survivors-error-message"><h4>❌ לא זכאי לפנסיית שאירים</h4>`;
      const yearsNeeded = Math.max(0, 5 - yearsInsured);
      const ageNeeded = Math.max(0, 40 - age);
      statusText += `<p>גיל ${age} (נדרש 40+) ו-${yearsInsured} שנות ביטוח (נדרשות 5+ מתחת לגיל 40)</p>`;
      explanations.push(`נדרש לחכות ${ageNeeded} שנים נוספות או לצבור ${yearsNeeded} שנות ביטוח נוספות`);
    }

    statusText += '</div>';

    // הסברים קריטיים לפי מצב משפחתי
    if (!this.hasEligibleSurvivors()) {
      explanations.push('🚨 <strong>חשוב:</strong> אין שאירים זכאים - אין פנסיה מביטוח לאומי!');
      explanations.push('💰 הצבירה בקרן הפנסיה תעבור ליורשים לפי צוואה או חוק הירושה');
      explanations.push('📋 <strong>המלצה:</strong> ערוך צוואה ושקול ביטוח חיים פרטי');
    } else {
      switch (this.survivorsMaritalStatus) {
        case 'single-with-children':
        case 'divorced-with-children':
          explanations.push('👶 הילדים זכאים לפנסיית שאירים עד גיל 18');
          explanations.push('💡 ילדים יתומים זכאים ל-40% מפנסיית הקרן (במקום 20%)');
          break;
        case 'married':
          explanations.push('👫 בן/בת הזוג והילדים זכאים לפנסיית שאירים');
          break;
      }
    }

    this.survivorsEligibilityStatus = statusText;
    this.survivorsEligibilityVisible = true;

    if (explanations.length > 0) {
      this.survivorsEligibilityExplanations = '<ul>' + explanations.map(exp => `<li>${exp}</li>`).join('') + '</ul>';
    } else {
      this.survivorsEligibilityExplanations = '';
    }
  }

  // בדיקה אם יש שאירים זכאים
  hasEligibleSurvivors(): boolean {
    // נשוי = יש זוג (שאיר זכאי)
    if (this.survivorsMaritalStatus === 'married') {
      return true;
    }

    // בדיקה אם יש ילדים זכאים (מתחת לגיל 18)
    if (['divorced-with-children', 'single-with-children'].includes(this.survivorsMaritalStatus)) {
      const childrenAges = this.parseChildrenAges();
      if (childrenAges.length > 0) {
        return childrenAges.some(age => age < 18);
      } else {
        return this.survivorsData.children > 0;
      }
    }

    return false;
  }

  // פונקציות תמיכה נוספות
showSurvivorsFlowDiagram(): void {
  if (!this.survivorsResults.show || this.survivorsResults.totalMonthly <= 0) {
    this.survivorsFlowDiagramHtml = `
      <div style="text-align: center; padding: 50px; color: var(--text-secondary);">
        <div style="font-size: 4em; margin-bottom: 20px;">❌</div>
        <h3>אין זכאות לפנסיית שאירים</h3>
        <p><strong>מצב:</strong> ${this.getMaritalStatusText()}</p>
        <p><strong>סיבה:</strong> אין שאירים זכאים</p>
      </div>
    `;
    return;
  }

  const results = this.survivorsResults;
  this.survivorsFlowDiagramHtml = `
    <div class="survivors-flow-diagram">
      <div class="survivors-flow-container" style="display: grid; gap: 20px; margin: 30px 0;">
        ${results.monthlyNationalInsurance > 0 ? `
          <div class="survivors-flow-source" style="background: linear-gradient(135deg, rgba(78, 205, 196, 0.2), rgba(78, 205, 196, 0.1)); border: 2px solid #4ECDC4; border-radius: 15px; padding: 25px; text-align: center;">
            <div style="font-size: 3em; margin-bottom: 15px;">🏦</div>
            <h4>ביטוח לאומי</h4>
            <div style="font-size: 1.8em; font-weight: bold; color: #4ECDC4;">${Math.round(results.monthlyNationalInsurance).toLocaleString('he-IL')} ש"ח</div>
            <small>פנסיית שאירים</small>
          </div>
        ` : ''}
        
        ${results.monthlyPensionFund > 0 ? `
          <div class="survivors-flow-source" style="background: linear-gradient(135deg, rgba(74, 144, 226, 0.2), rgba(74, 144, 226, 0.1)); border: 2px solid #4A90E2; border-radius: 15px; padding: 25px; text-align: center; position: relative;">
            ${results.lostAmount > 0 ? `<div style="position: absolute; top: -10px; right: -10px; background: #E74C3C; color: white; padding: 5px 10px; border-radius: 15px; font-size: 0.8em; font-weight: bold;">🚨 ${results.lostAmount.toLocaleString('he-IL')} נמחק</div>` : ''}
            <div style="font-size: 3em; margin-bottom: 15px;">💼</div>
            <h4>קרן פנסיה</h4>
            <div style="font-size: 1.8em; font-weight: bold; color: #4A90E2;">${Math.round(results.monthlyPensionFund).toLocaleString('he-IL')} ש"ח</div>
            <small>פנסיית שאירים מקרן</small>
          </div>
        ` : ''}
        
        ${results.childrenPension > 0 ? `
          <div class="survivors-flow-source" style="background: linear-gradient(135deg, rgba(155, 89, 182, 0.2), rgba(155, 89, 182, 0.1)); border: 2px solid #9B59B6; border-radius: 15px; padding: 25px; text-align: center;">
            <div style="font-size: 3em; margin-bottom: 15px;">👶</div>
            <h4>פנסיית ילדים</h4>
            <div style="font-size: 1.8em; font-weight: bold; color: #9B59B6;">${Math.round(results.childrenPension).toLocaleString('he-IL')} ש"ח</div>
            <small>תשלום ישיר לילדים</small>
          </div>
        ` : ''}
        
        <div style="text-align: center; font-size: 4em; color: #4A90E2;">⬇️</div>
        
        <div class="survivors-flow-target" style="background: linear-gradient(135deg, rgba(155, 89, 182, 0.2), rgba(155, 89, 182, 0.1)); border: 2px solid #9B59B6; border-radius: 15px; padding: 25px; text-align: center; position: relative;">
          ${results.totalMonthly > 9430 ? `<div style="position: absolute; top: -10px; right: -10px; background: #F39C12; color: white; padding: 5px 10px; border-radius: 15px; font-size: 0.8em; font-weight: bold;">💰 חייב במס</div>` : ''}
          <div style="font-size: 3em; margin-bottom: 15px;">👨‍👩‍👧‍👦</div>
          <h4>השאירים</h4>
          <div style="font-size: 2.2em; color: #4ECDC4; font-weight: bold;">${Math.round(results.totalMonthly).toLocaleString('he-IL')} ש"ח</div>
          <small>סה"כ חודשי</small>
        </div>
      </div>
    </div>
  `;
}

calculateLifeInsurance(): void {
  if (!this.lifeInsuranceAge  || !this.lifeInsuranceCoverage) return;
  
  // חישוב בסיסי של דמי ביטוח (הערכה)
  let baseRate = 0.5; // 0.5% מהכיסוי בשנה
  
  // התאמות לפי גיל
  if (this.lifeInsuranceAge > 50) baseRate += 0.3;
  else if (this.lifeInsuranceAge > 40) baseRate += 0.2;
  else if (this.lifeInsuranceAge > 30) baseRate += 0.1;
  
  // התאמות לפי מצב בריאותי
  switch(this.healthStatus) {
    case 'excellent': baseRate -= 0.1; break;
    case 'good': break;
    case 'average': baseRate += 0.2; break;
    case 'poor': baseRate += 0.5; break;
  }
  
  // התאמה למעשנים
  if (this.isSmoker) baseRate += 0.3;
  
  const annualPremium = (this.lifeInsuranceCoverage * baseRate) / 100;
  const monthlyPremium = annualPremium / 12;
  const totalCost = annualPremium * 20; // 20 שנים
  
  this.lifeInsuranceResults = {
    show: true,
    monthlyPremium: Math.round(monthlyPremium),
    annualPremium: Math.round(annualPremium),
    totalCost: Math.round(totalCost)
  };
}

simulateDivorceImpact(): void {
  if (!this.survivorsMaritalStatus.includes('divorced')) return;
  
  // יצירת תרחיש "נשוי" לצורך השוואה
  const marriedScenario = {
    ...this.survivorsData,
    status: 'married'
  };
  
  const marriedResults = this.calculateScenarioResults(marriedScenario);
  const divorcedResults = this.survivorsResults;
  
  const monthlyLoss = marriedResults.totalMonthly - divorcedResults.totalMonthly;
  const totalLoss = marriedResults.totalPresentValue - divorcedResults.totalPresentValue;
  
  this.survivorsDivorceResultsHtml = `
    <div style="margin-top: 20px;">
      <h4>💔 השפעת הגירושין על זכויות הפנסיה</h4>
      <div style="background: rgba(255, 107, 107, 0.15); padding: 20px; border-radius: 10px; margin: 15px 0;">
        <div style="font-size: 1.5em; font-weight: bold; color: #FF6B6B; text-align: center;">
          הפסד חודשי: ${Math.round(monthlyLoss).toLocaleString('he-IL')} ש"ח
        </div>
        <div style="font-size: 1.3em; font-weight: bold; color: #FF6B6B; text-align: center; margin-top: 10px;">
          הפסד כולל: ${Math.round(totalLoss).toLocaleString('he-IL')} ש"ח
        </div>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background: #E74C3C; color: white;">
            <th style="padding: 10px; border: 1px solid #fff;">מדד</th>
            <th style="padding: 10px; border: 1px solid #fff;">לפני גירושין</th>
            <th style="padding: 10px; border: 1px solid #fff;">אחרי גירושין</th>
            <th style="padding: 10px; border: 1px solid #fff;">הפסד</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">פנסיה חודשית</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${Math.round(marriedResults.totalMonthly).toLocaleString('he-IL')} ש"ח</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${Math.round(divorcedResults.totalMonthly).toLocaleString('he-IL')} ש"ח</td>
            <td style="padding: 8px; border: 1px solid #ddd; color: #FF6B6B; font-weight: bold;">${Math.round(monthlyLoss).toLocaleString('he-IL')} ש"ח</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">ערך כולל</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${Math.round(marriedResults.totalPresentValue).toLocaleString('he-IL')} ש"ח</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${Math.round(divorcedResults.totalPresentValue).toLocaleString('he-IL')} ש"ח</td>
            <td style="padding: 8px; border: 1px solid #ddd; color: #FF6B6B; font-weight: bold;">${Math.round(totalLoss).toLocaleString('he-IL')} ש"ח</td>
          </tr>
        </tbody>
      </table>
      
      <div style="margin-top: 20px;">
        <h5>💡 פתרונות מומלצים:</h5>
        <ul style="margin-right: 20px;">
          <li><strong>ביטוח חיים:</strong> ${Math.round(totalLoss).toLocaleString('he-IL')} ש"ח לפיצוי</li>
          <li><strong>הסכם גירושין:</strong> פיצוי כספי או מזונות מוגדלים</li>
          <li><strong>פיצול לא שווה:</strong> 70-30% במקום 50-50% בקרן הפנסיה</li>
          <li><strong>זכויות מוגבלות:</strong> שמירת זכויות שאירים זמניות</li>
        </ul>
      </div>
    </div>
  `;
}

// ===== פונקציות מתוקנות ללא שגיאות פורמט =====

generateAdvancedScenarios(): void {
  const scenarios = [
    { name: 'תרחיש אופטימי', multiplier: 1.2, description: 'הגדלת פנסיה ב-20%' },
    { name: 'תרחיש פסימי', multiplier: 0.8, description: 'הקטנת פנסיה ב-20%' },
    { name: 'תרחיש אינפלציה גבוהה', multiplier: 0.9, description: 'השפעת אינפלציה 4%' },
    { name: 'תרחיש שינוי חקיקה', multiplier: 1.1, description: 'שיפור תנאי פנסיה' }
  ];
  
  let html = '<h4>🔮 תרחישים עתידיים</h4><div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">';
  
  scenarios.forEach(scenario => {
    const adjustedMonthly = this.survivorsResults.totalMonthly * scenario.multiplier;
    const adjustedTotal = this.survivorsResults.totalPresentValue * scenario.multiplier;
    
    html += `
      <div style="background: rgba(74, 144, 226, 0.1); padding: 15px; border-radius: 10px; border: 1px solid rgba(74, 144, 226, 0.3);">
        <h5 style="color: #4A90E2;">${scenario.name}</h5>
        <p style="font-size: 0.9em; color: #B0B0D0;">${scenario.description}</p>
        <div style="font-size: 1.3em; font-weight: bold; color: #4ECDC4;">${Math.round(adjustedMonthly).toLocaleString('he-IL')} ש"ח</div>
        <div style="font-size: 0.9em; color: #B0B0D0;">ערך כולל: ${Math.round(adjustedTotal).toLocaleString('he-IL')} ש"ח</div>
      </div>
    `;
  });
  
  html += '</div>';
  this.survivorsAdvancedAnalysisHtml = html;
}

// פונקציות עזר (נפרדות וללא שגיאות)
hasEligibleChildren(): boolean {
  const childrenAges = this.parseChildrenAges();
  if (childrenAges.length > 0) {
    return childrenAges.some(age => age < 18);
  }
  return this.survivorsData.children > 0;
}

getEligibleChildrenCount(): number {
  const childrenAges = this.parseChildrenAges();
  if (childrenAges.length > 0) {
    return childrenAges.filter(age => age < 18).length;
  }
  return this.survivorsData.children;
}

calculateYearsToReceive(): number {
  if (this.survivorsMaritalStatus === 'married') {
    return Math.max(0, 85 - this.survivorsData.spouseAge);
  } else if (this.hasEligibleChildren()) {
    const childrenAges = this.parseChildrenAges();
    if (childrenAges.length > 0) {
      const youngestChild = Math.min(...childrenAges);
      return Math.max(0, 18 - youngestChild);
    }
    return 10; // הערכה
  }
  return 0;
}

// עדכון תוצאות (מתוקן)
updateSurvivorsResults(results: any): void {
  this.survivorsResults = {
    show: true,
    monthlyNationalInsurance: results.monthlyNationalInsurance,
    monthlyPensionFund: results.monthlyPensionFund,
    childrenPension: results.childrenPension,
    totalPresentValue: results.totalPresentValue,
    totalFutureValue: results.totalFutureValue,
    inheritanceValue: results.inheritanceValue,
    lostAmount: results.lostAmount,
    totalMonthly: results.totalMonthly,
    yearsToReceive: results.yearsToReceive,
    calculationBreakdown: this.createSurvivorsCalculationBreakdown(results),
    explanations: this.createSurvivorsExplanations(results),
    recommendations: this.generateSurvivorsRecommendations(),
    smartQuestion: this.getSurvivorsSmartQuestion()
  };
}

// יצירת פירוט חישוב (מתוקן)
createSurvivorsCalculationBreakdown(results: any): string {
  let breakdown = `
    <div class="survivors-calculation-breakdown">
      <h3>🧮 פירוט חישוב פנסיית שאירים - לפי השכר הממוצע במשק</h3>
      <div style="background: rgba(54, 209, 220, 0.15); padding: 15px; border-radius: 10px; border-right: 4px solid #36D1DC; margin: 15px 0;">
        <p><strong>📊 השכר הממוצע במשק 2025:</strong> ${AVERAGE_WAGE_2025.toLocaleString('he-IL')} ש"ח</p>
        <p><strong>⚠️ חשוב:</strong> פנסיית שאירים מחושבת לפי השכר הממוצע במשק, לא לפי השכר האישי!</p>
      </div>
  `;

  if (!this.hasEligibleSurvivors()) {
    breakdown += `
      <div style="background: rgba(255, 107, 107, 0.2); padding: 15px; border-radius: 10px; border-right: 4px solid #FF6B6B; margin: 15px 0;">
        <h4 style="color: #FF6B6B;">❌ אין זכאות לפנסיית ביטוח לאומי</h4>
        <p><strong>הסיבה:</strong> אין שאירים זכאים (אלמן/ה או ילדים מתחת ל-18)</p>
        <p><strong>מה קורה:</strong> הצבירה בקרן הפנסיה עוברת ליורשים לפי צוואה או חוק הירושה</p>
      </div>
    `;
  } else {
    // פירוט מפורט לשאירים זכאים
    breakdown += `
      <table class="survivors-comparison-table">
        <thead>
          <tr>
            <th>מרכיב</th>
            <th>סכום חודשי (₪)</th>
            <th>הסבר</th>
          </tr>
        </thead>
        <tbody>
    `;

    if (results.monthlyNationalInsurance > 0) {
      const baseAmount = AVERAGE_WAGE_2025 * 0.28;
      breakdown += `
        <tr>
          <td>פנסיה בסיסית (28%)</td>
          <td>${Math.round(baseAmount).toLocaleString('he-IL')}</td>
          <td>${AVERAGE_WAGE_2025.toLocaleString('he-IL')} × 28%</td>
        </tr>
      `;

      if (this.survivorsMaritalStatus === 'married') {
        const spouseAmount = AVERAGE_WAGE_2025 * 0.14;
        breakdown += `
          <tr>
            <td>פנסיית בן/בת זוג (14%)</td>
            <td>${Math.round(spouseAmount).toLocaleString('he-IL')}</td>
            <td>${AVERAGE_WAGE_2025.toLocaleString('he-IL')} × 14%</td>
          </tr>
        `;
      }

      if (this.survivorsData.children > 0) {
        breakdown += `
          <tr>
            <td>תוספת ילד ראשון</td>
            <td>${CHILD_ALLOWANCE_FIRST.toLocaleString('he-IL')}</td>
            <td>סכום קבוע</td>
          </tr>
        `;

        if (this.survivorsData.children > 1) {
          const additionalChildren = this.survivorsData.children - 1;
          breakdown += `
            <tr>
              <td>תוספת ${additionalChildren} ילדים נוספים</td>
              <td>${(additionalChildren * CHILD_ALLOWANCE_ADDITIONAL).toLocaleString('he-IL')}</td>
              <td>${additionalChildren} × ${CHILD_ALLOWANCE_ADDITIONAL}</td>
            </tr>
          `;
        }
      }

      breakdown += `
        <tr style="background: rgba(54, 209, 220, 0.2);">
          <td><strong>סה"כ ביטוח לאומי</strong></td>
          <td><strong>${Math.round(results.monthlyNationalInsurance).toLocaleString('he-IL')}</strong></td>
          <td>כולל תוספת ותק</td>
        </tr>
      `;
    }

    if (results.monthlyPensionFund > 0) {
      breakdown += `
        <tr>
          <td>קרן פנסיה</td>
          <td>${Math.round(results.monthlyPensionFund).toLocaleString('he-IL')}</td>
          <td>${this.survivorsData.pensionFund.toLocaleString('he-IL')} ÷ 200</td>
        </tr>
      `;
    }

    if (results.childrenPension > 0) {
      const eligibleChildren = this.getEligibleChildrenCount();
      breakdown += `
        <tr>
          <td>פנסיית ילדים ישירה</td>
          <td>${Math.round(results.childrenPension).toLocaleString('he-IL')}</td>
          <td>${eligibleChildren} × ${DIRECT_CHILDREN_PENSION.toLocaleString('he-IL')}</td>
        </tr>
      `;
    }

    breakdown += `
        <tr style="background: rgba(78, 205, 196, 0.2); font-weight: bold;">
          <td><strong>סה"כ חודשי</strong></td>
          <td><strong>${Math.round(results.totalMonthly).toLocaleString('he-IL')}</strong></td>
          <td>כל המקורות</td>
        </tr>
      </tbody>
    </table>
    `;
  }

  breakdown += `</div>`;
  return breakdown;
}

  // יצירת הסברים
  createSurvivorsExplanations(results: any): any {
    return {
      nationalInsurance: !this.hasEligibleSurvivors() ?
        `<strong style="color: #FF6B6B;">אין זכאות לביטוח לאומי</strong><br>סיבה: אין שאירים זכאים (${this.getMaritalStatusText()})` :
        `מבוסס על השכר הממוצע במשק: ${AVERAGE_WAGE_2025.toLocaleString('he-IL')} ש"ח<br>מצב: ${this.getMaritalStatusText()}<br>${this.survivorsData.yearsInsured > 0 ? `תוספת ותק: ${Math.round(Math.min(this.survivorsData.yearsInsured * 2, 50))}%` : 'ללא תוספת ותק'}`,
      
      pensionFund: !this.hasEligibleSurvivors() ?
        `<strong style="color: #FF6B6B;">אין זכאות מקרן הפנסיה</strong><br>הצבירה ${this.survivorsData.pensionFund.toLocaleString('he-IL')} ש"ח עוברת ליורשים` :
        results.monthlyPensionFund > 0 ?
          `צבירה: ${this.survivorsData.pensionFund.toLocaleString('he-IL')} ש"ח ÷ 200 = ${Math.round(this.survivorsData.pensionFund / 200).toLocaleString('he-IL')} ש"ח<br>${this.survivorsMaritalStatus === 'married' ? 'זוג: 60%, ילדים: 20%' : 'ילדים יתומים: 40%'}${results.lostAmount > 0 ? `<br><strong style="color: #E74C3C;">⚠️ ${results.lostAmount.toLocaleString('he-IL')} ש"ח נמחקים!</strong>` : ''}` :
          'אין צבירה בקרן פנסיה',
      
      children: results.childrenPension > 0 ?
        `פנסיה ישירה מביטוח לאומי: ${this.getEligibleChildrenCount()} ילדים × 1,200 ש"ח` :
        'אין פנסיית ילדים ישירה',
      
      presentValue: `ערך כל התשלומים לאורך ${results.yearsToReceive} שנים ללא היוון`,
      
      futureValue: `ערך עם הצמדה למדד 2% שנתי לאורך ${results.yearsToReceive} שנים`
    };
  }

  // יצירת המלצות
  generateSurvivorsRecommendations(): string {
    let recommendations = `<strong>המלצות ל${this.getMaritalStatusText()}:</strong><br><br>`;

    if (this.survivorsMaritalStatus.includes('single')) {
      recommendations += `
        🔴 <strong>עדיפות גבוהה:</strong> ביטוח חיים ותכנון ירושה<br>
        📋 <strong>מסמכים:</strong> צוואה מעודכנת ומוטבים בקרנות<br>
        💰 <strong>השקעות:</strong> גיוון תיק השקעות לבניית עושר<br>
      `;
    } else if (this.survivorsMaritalStatus.includes('divorced')) {
      recommendations += `
        ⚖️ <strong>משפטי:</strong> ברר זכויות בקרנות פנסיה<br>
        📋 <strong>עדכונים:</strong> מוטבים חדשים בכל הפוליסות<br>
        🎯 <strong>עצמאות:</strong> בניית תכנית פיננסית עצמאית<br>
      `;
    } else if (this.survivorsMaritalStatus === 'married') {
      recommendations += `
        👫 <strong>תכנון משותף:</strong> סנכרון מטרות פיננסיות<br>
        🏠 <strong>ביטוח משכנתא:</strong> כיסוי מלא למשכנתא<br>
        👶 <strong>ילדים:</strong> קרנות חינוך והשקעות לעתיד<br>
      `;
    }

    return recommendations;
  }

  // שאלה חכמה
  getSurvivorsSmartQuestion(): string {
    if (this.survivorsMaritalStatus.includes('divorced')) {
      return '💭 בהתחשב במצבך כגרוש/ה, האם עדכנת את מוטבי קרן הפנסיה ושקלת ביטוח חיים נוסף לכיסוי הילדים?';
    } else if (this.survivorsMaritalStatus === 'single-with-children') {
      return '💭 כהורה יחידני/ת, האם קבעת אפוטרופס לילדים ובחנת את הצרכים הפיננסיים המיוחדים במצבך?';
    } else if (!this.hasEligibleSurvivors()) {
      return '💭 בהתחשב בכך שאינך זכאי לפנסיית שאירים מביטוח לאומי, האם שקלת פוליסת ביטוח חיים נפרדת כדי להבטיח את עתיד המשפחה?';
    } else if (this.survivorsData.children > 0) {
      return '💭 עם הילדים שלך, האם שקלת פתיחת קרן חינוך או חיסכון ייעודי נוסף לצרכים העתידיים שלהם?';
    } else {
      return '💭 האם תרצה לבחון תרחישי "מה אם" נוספים או אסטרטגיות מיטוב מס וירושה?';
    }
  }

  // טקסט מצב משפחתי
  getMaritalStatusText(): string {
    switch (this.survivorsMaritalStatus) {
      case 'married': return 'נשוי/נשואה';
      case 'divorced-with-children': return 'גרוש/ה עם ילדים';
      case 'divorced-no-children': return 'גרוש/ה ללא ילדים';
      case 'single-with-children': return 'רווק/ה עם ילדים';
      case 'single-no-children': return 'רווק/ה ללא ילדים';
      default: return 'לא מוגדר';
    }
  }

  // טעינת תרחיש בדיקה
  loadSurvivorsScenario(scenarioNumber: number): void {
    const scenario = this.survivorsTestScenarios[scenarioNumber];
    if (!scenario) return;

    // עדכון מצב משפחתי
    this.selectSurvivorsMaritalStatus(scenario.status);

    // עדכון שדות
    this.survivorsData.age = scenario.age;
    this.survivorsData.salary = scenario.salary;
    this.survivorsData.yearsInsured = scenario.yearsInsured;
    this.survivorsData.children = scenario.children;
    this.survivorsData.childrenAges = scenario.childrenAges;
    this.survivorsData.pensionFund = scenario.pensionFund;

    if (scenario.spouseAge) {
      this.survivorsData.spouseAge = scenario.spouseAge;
    }
    if (scenario.yearsMarried) {
      this.survivorsData.yearsMarried = scenario.yearsMarried;
    }

    // חישוב מיידי
    setTimeout(() => {
      this.calculateSurvivorsPension();
    }, 300);
  }

  // יצירת גרפים
  createSurvivorsCharts(): void {
    this.createSurvivorsChart();
    this.createSurvivorsComparisonChart();
  }

  // גרף פיצול מקורות הכנסה
  createSurvivorsChart(): void {
    this.survivorsChartOptions = {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        style: {
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        }
      },
      title: {
        text: 'פיצול מקורות הכנסה',
        style: {
          color: '#f8fafc',
          fontSize: '18px',
          fontWeight: 'bold'
        }
      },
      tooltip: {
        pointFormat: '<b>{point.y:.0f} ₪</b>',
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        borderColor: '#4A90E2',
        style: {
          color: '#f8fafc'
        }
      },
      accessibility: { 
        point: { 
          valueSuffix: '₪' 
        } 
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '{point.name}: {point.y:.0f} ₪',
            color: 'white',
            style: { 
              fontSize: '14px', 
              fontWeight: 'bold',
              textOutline: '1px #000000'
            }
          },
          colors: ['#4ECDC4', '#4A90E2', '#9B59B6', '#E67E22']
        }
      },
      series: [{
        type: 'pie',
        name: 'פנסיית שאירים',
        data: []
      }]
    };
  }

  // גרף השוואת תרחישים
  createSurvivorsComparisonChart(): void {
    this.survivorsComparisonChartOptions = {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        style: {
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        }
      },
      title: {
        text: 'השוואת תרחישים',
        style: {
          color: '#f8fafc',
          fontSize: '18px',
          fontWeight: 'bold'
        }
      },
      xAxis: {
        categories: ['תרחיש נוכחי', 'ממוצע', 'אופטימי', 'פסימי'],
        labels: {
          style: {
            color: '#B0B0D0'
          }
        }
      },
      yAxis: {
        title: {
          text: 'סכום חודשי (₪)',
          style: {
            color: '#B0B0D0'
          }
        },
        labels: {
          style: {
            color: '#B0B0D0'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        borderColor: '#4A90E2',
        style: {
          color: '#f8fafc'
        }
      },
      series: [{
        type: 'column',
        name: 'פנסיה חודשית',
        data: [],
        color: '#4ECDC4'
      }]
    };
  }

  // עדכון גרפים
  updateSurvivorsCharts(): void {
    if (!this.survivorsResults.show) return;

    // עדכון גרף פיצול
    const pieData = [];
    if (this.survivorsResults.monthlyNationalInsurance > 0) {
      pieData.push({ name: 'ביטוח לאומי', y: this.survivorsResults.monthlyNationalInsurance });
    }
    if (this.survivorsResults.monthlyPensionFund > 0) {
      pieData.push({ name: 'קרן פנסיה', y: this.survivorsResults.monthlyPensionFund });
    }
    if (this.survivorsResults.childrenPension > 0) {
      pieData.push({ name: 'פנסיית ילדים', y: this.survivorsResults.childrenPension });
    }
    if (this.survivorsResults.inheritanceValue > 0) {
      pieData.push({ name: 'ירושה', y: this.survivorsResults.inheritanceValue / 1000 });
    }

    if (pieData.length === 0) {
      pieData.push({ name: 'אין זכאות', y: 1 });
    }

    this.survivorsChartOptions.series = [{
      type: 'pie',
      name: 'פנסיית שאירים',
      data: pieData
    }];

    // עדכון גרף השוואה
    const currentAmount = this.survivorsResults.totalMonthly;
    const averageAmount = currentAmount * 1.0;
    const optimisticAmount = currentAmount * 1.2;
    const pessimisticAmount = currentAmount * 0.8;

    this.survivorsComparisonChartOptions.series = [{
      type: 'column',
      name: 'פנסיה חודשית',
      data: [currentAmount, averageAmount, optimisticAmount, pessimisticAmount],
      color: '#4ECDC4'
    }];

    // רענון הגרפים ב-DOM
    this.updateFlag = true;
  }




  // 1. פונקציות מיוחדות לתרחישי גירושין
loadDivorceScenario(scenarioNumber: number): void {
  const scenario = this.survivorsTestScenarios[scenarioNumber];
  if (!scenario || !scenario.description?.includes('גירושין')) return;
  
  // טעינת התרחיש הרגיל
  this.loadSurvivorsScenario(scenarioNumber);
  
  setTimeout(() => {
    // הצגת סימולציית הגירושין
    this.displayDivorceSimulation(scenario);
  }, 500);
}

// 2. סימולציית השפעת גירושין
displayDivorceSimulation(scenario: any): void {
  // חישוב מצב "לפני" (כנשוי) VS "אחרי" (כגרוש)
  const marriedScenario = { ...scenario, status: 'married' };
  const marriedResults = this.calculateScenarioResults(marriedScenario);
  const divorcedResults = this.calculateScenarioResults(scenario);
  
  const monthlyLoss = marriedResults.totalMonthly - divorcedResults.totalMonthly;
  const totalLoss = marriedResults.totalPresentValue - divorcedResults.totalPresentValue;
  
  const divorceHtml = `
    <div class="survivors-divorce-simulation" style="margin-top: 20px;">
      <h4>💔 סימולציית השפעת גירושין</h4>
      <div class="survivors-loss-amount">הפסד חודשי: ${Math.round(monthlyLoss).toLocaleString('he-IL')} ש"ח</div>
      
      <table class="survivors-comparison-table">
        <thead>
          <tr>
            <th>מדד</th>
            <th>לפני גירושין (נשוי)</th>
            <th>אחרי גירושין</th>
            <th>הפסד</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>פנסיה חודשית</td>
            <td>${Math.round(marriedResults.totalMonthly).toLocaleString('he-IL')} ש"ח</td>
            <td>${Math.round(divorcedResults.totalMonthly).toLocaleString('he-IL')} ש"ח</td>
            <td style="color: #FF6B6B;">${Math.round(monthlyLoss).toLocaleString('he-IL')} ש"ח</td>
          </tr>
          <tr>
            <td>ערך כולל</td>
            <td>${Math.round(marriedResults.totalPresentValue).toLocaleString('he-IL')} ש"ח</td>
            <td>${Math.round(divorcedResults.totalPresentValue).toLocaleString('he-IL')} ש"ח</td>
            <td style="color: #FF6B6B;">${Math.round(totalLoss).toLocaleString('he-IL')} ש"ח</td>
          </tr>
        </tbody>
      </table>
      
      <div style="margin-top: 15px;">
        <h5>💡 פתרונות לפיצוי:</h5>
        <ul>
          <li><strong>ביטוח חיים:</strong> ${Math.round(totalLoss).toLocaleString('he-IL')} ש"ח</li>
          <li><strong>הסכם גירושין:</strong> פיצוי כספי או מזונות מוגדלים</li>
          <li><strong>פיצול לא שווה:</strong> 70-30% במקום 50-50%</li>
        </ul>
      </div>
    </div>
  `;
  
  // הוספה לתוצאות
  this.survivorsResults.calculationBreakdown += divorceHtml;
}

// 3. חישוב תוצאות תרחיש (חסר!)
calculateScenarioResults(scenario: any): any {
  const originalStatus = this.survivorsMaritalStatus;
  this.survivorsMaritalStatus = scenario.status;

  const eligibilityResult = this.checkSurvivorsEligibility();
  let results = {
    monthlyNationalInsurance: 0,
    monthlyPensionFund: 0,
    childrenPension: 0,
    totalMonthly: 0,
    totalPresentValue: 0,
    inheritanceValue: 0,
    lostAmount: 0
  };

  if (eligibilityResult.eligible) {
    // שמירת נתונים מקוריים
    const originalData = { ...this.survivorsData };
    
    // עדכון זמני עם נתוני התרחיש
    this.survivorsData = {
      age: scenario.age,
      salary: scenario.salary,
      spouseAge: scenario.spouseAge || 42,
      yearsMarried: scenario.yearsMarried || 15,
      yearsInsured: scenario.yearsInsured,
      children: scenario.children,
      childrenAges: scenario.childrenAges,
      pensionFund: scenario.pensionFund
    };

    results = this.calculateAllSurvivorsPensions();
    
    // החזרת נתונים מקוריים
    this.survivorsData = originalData;
  } else {
    if (['single-no-children', 'divorced-no-children'].includes(scenario.status)) {
      results.inheritanceValue = scenario.pensionFund;
    }
  }

  this.survivorsMaritalStatus = originalStatus;
  return results;
}

// 4. פונקציות מתקדמות לחישוב פיצול גירושין
calculateDivorceSplit(scenario: any): any {
  const marriageYears = (scenario.divorceYear || 2025) - (scenario.marriageStart || 2010);
  const totalPension = scenario.pensionFund;
  const pensionBeforeMarriage = scenario.pensionBeforeMarriage || 0;
  const jointAccumulation = totalPension - pensionBeforeMarriage;
  const splitAmount = jointAccumulation / 2;
  
  return {
    marriageYears,
    jointAccumulation,
    splitAmount,
    husband: {
      before: pensionBeforeMarriage,
      joint: splitAmount,
      total: pensionBeforeMarriage + splitAmount
    },
    wife: {
      before: 0,
      joint: splitAmount,
      total: splitAmount
    },
    lostSurvivorRights: true
  };
}

// 5. פונקציות חסרות לניהול UI מתקדם
showFlowDiagram(): void {
  // יצירת דיאגרמת זרימה ויזואלית
  const results = this.survivorsResults;
  
  const flowHtml = `
    <div class="survivors-flow-diagram">
      <h3>🌊 זרימת הכסף לשאירים</h3>
      <div class="survivors-flow-container">
        ${results.monthlyNationalInsurance > 0 ? `
          <div class="survivors-flow-source">
            <div style="font-size: 3em;">🏦</div>
            <h4>ביטוח לאומי</h4>
            <div class="survivors-flow-amount">${Math.round(results.monthlyNationalInsurance).toLocaleString('he-IL')} ש"ח</div>
          </div>
        ` : ''}
        
        ${results.monthlyPensionFund > 0 ? `
          <div class="survivors-flow-source">
            <div style="font-size: 3em;">💼</div>
            <h4>קרן פנסיה</h4>
            <div class="survivors-flow-amount">${Math.round(results.monthlyPensionFund).toLocaleString('he-IL')} ש"ח</div>
            ${results.lostAmount > 0 ? `<div class="survivors-loss-indicator">🚨 ${results.lostAmount.toLocaleString('he-IL')} נמחק</div>` : ''}
          </div>
        ` : ''}
        
        ${results.childrenPension > 0 ? `
          <div class="survivors-flow-source">
            <div style="font-size: 3em;">👶</div>
            <h4>פנסיית ילדים</h4>
            <div class="survivors-flow-amount">${Math.round(results.childrenPension).toLocaleString('he-IL')} ש"ח</div>
          </div>
        ` : ''}
        
        <div class="survivors-flow-target">
          <div style="font-size: 3em;">👨‍👩‍👧‍👦</div>
          <h4>השאירים</h4>
          <div class="survivors-flow-total">${Math.round(results.totalMonthly).toLocaleString('he-IL')} ש"ח</div>
          ${results.totalMonthly > 9430 ? '<div class="survivors-tax-indicator">💰 חייב במס</div>' : ''}
        </div>
      </div>
    </div>
  `;
  
  this.survivorsResults.calculationBreakdown += flowHtml;
}

// 6. מערכת ניקוד וציוני איכות
calculateQualityScore(): { score: number; level: string; recommendations: string[] } {
  let score = 0;
  const recommendations: string[] = [];
  
  // ניקוד זכאות (40 נקודות)
  const eligibility = this.checkSurvivorsEligibility();
  if (eligibility.eligible) {
    score += 40;
  } else {
    recommendations.push('🔴 השג זכאות לפנסיית שאירים');
  }
  
  // ניקוד כיסוי שאירים (30 נקודות)
  if (this.hasEligibleSurvivors()) {
    score += 30;
  } else {
    recommendations.push('🔴 אין שאירים זכאים - שקול ביטוח חיים');
  }
  
  // ניקוד גובה פנסיה (20 נקודות)
  const totalMonthly = this.survivorsResults.totalMonthly;
  if (totalMonthly > 15000) score += 20;
  else if (totalMonthly > 10000) score += 15;
  else if (totalMonthly > 5000) score += 10;
  else recommendations.push('🟡 פנסיה נמוכה - שקול הגדלת חיסכון');
  
  // ניקוד תכנון מיסוי (10 נקודות)
  if (totalMonthly <= 9430) {
    score += 10;
  } else {
    recommendations.push('🟡 פנסיה חייבת במס - תכנן מיסוי');
  }
  
  let level = 'גרוע';
  if (score >= 80) level = 'מעולה';
  else if (score >= 60) level = 'טוב';
  else if (score >= 40) level = 'בינוני';
  
  return { score, level, recommendations };
}

// 7. יצירת דו"ח מקצועי מלא
generateProfessionalReport(): string {
  const qualityScore = this.calculateQualityScore();
  const results = this.survivorsResults;
  
  return `
    <div class="survivors-professional-report">
      <h2>📋 דו"ח מקצועי - פנסיית שאירים</h2>
      
      <div class="survivors-report-section">
        <h3>🎯 ציון איכותי: ${qualityScore.score}/100 (${qualityScore.level})</h3>
        <div class="survivors-score-bar" style="background: linear-gradient(to right, 
          ${qualityScore.score >= 80 ? '#4ECDC4' : qualityScore.score >= 60 ? '#FFE66D' : '#FF6B6B'} ${qualityScore.score}%, 
          #ddd ${qualityScore.score}%);">
        </div>
      </div>
      
      <div class="survivors-report-section">
        <h3>💰 סיכום פיננסי</h3>
        <p><strong>פנסיה חודשית:</strong> ${results.totalMonthly.toLocaleString('he-IL')} ש"ח</p>
        <p><strong>ערך נוכחי:</strong> ${results.totalPresentValue.toLocaleString('he-IL')} ש"ח</p>
        <p><strong>ערך עתידי:</strong> ${results.totalFutureValue.toLocaleString('he-IL')} ש"ח</p>
      </div>
      
      <div class="survivors-report-section">
        <h3>⚠️ המלצות דחופות</h3>
        <ul>${qualityScore.recommendations.map(rec => `<li>${rec}</li>`).join('')}</ul>
      </div>
      
      <div class="survivors-report-section">
        <h3>📊 פילוח מקורות</h3>
        <p><strong>ביטוח לאומי:</strong> ${Math.round((results.monthlyNationalInsurance / results.totalMonthly) * 100)}%</p>
        <p><strong>קרן פנסיה:</strong> ${Math.round((results.monthlyPensionFund / results.totalMonthly) * 100)}%</p>
        <p><strong>פנסיית ילדים:</strong> ${Math.round((results.childrenPension / results.totalMonthly) * 100)}%</p>
      </div>
    </div>
  `;
}

// 8. פונקציות הדפסה ושמירה
printReport(): void {
  const reportContent = this.generateProfessionalReport();
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>דו"ח פנסיית שאירים</title>
          <style>
            body { font-family: Arial, sans-serif; direction: rtl; }
            .survivors-score-bar { height: 20px; border-radius: 10px; margin: 10px 0; }
            .survivors-report-section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
          </style>
        </head>
        <body>${reportContent}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
}

// 9. ייצוא נתונים ל-Excel/CSV
exportToCSV(): void {
  const results = this.survivorsResults;
  const csvContent = `
פרט,ערך
מצב משפחתי,${this.getMaritalStatusText()}
גיל הנפטר,${this.survivorsData.age}
שנות ביטוח,${this.survivorsData.yearsInsured}
צבירה בקרן,${this.survivorsData.pensionFund}
פנסיה מביטוח לאומי,${results.monthlyNationalInsurance}
פנסיה מקרן,${results.monthlyPensionFund}
פנסיית ילדים,${results.childrenPension}
סה״כ חודשי,${results.totalMonthly}
ערך נוכחי,${results.totalPresentValue}
ערך עתידי,${results.totalFutureValue}
  `;
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'pension_survivors_report.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 10. השוואה עם ממוצע השוק
compareWithMarketAverage(): any {
  const marketAverage = {
    totalMonthly: 8500,
    presentValue: 1200000,
    nationalInsurancePercentage: 65,
    pensionFundPercentage: 30,
    childrenPensionPercentage: 5
  };
  
  const myResults = this.survivorsResults;
  const comparison = {
    monthlyVsMarket: ((myResults.totalMonthly - marketAverage.totalMonthly) / marketAverage.totalMonthly) * 100,
    valueVsMarket: ((myResults.totalPresentValue - marketAverage.presentValue) / marketAverage.presentValue) * 100
  };
  
  return {
    isAboveAverage: comparison.monthlyVsMarket > 0,
    monthlyDifference: Math.abs(comparison.monthlyVsMarket),
    valueDifference: Math.abs(comparison.valueVsMarket),
    recommendation: comparison.monthlyVsMarket > 10 ? 'מצב מעולה' : 
                   comparison.monthlyVsMarket > -10 ? 'מצב סביר' : 'מצב מתחת לממוצע'
  };
}

updateScenariosTable(): void {
  this.survivorsScenariosTableData = [];
  
  Object.entries(this.survivorsTestScenarios).forEach(([num, scenario]) => {
    const results = this.calculateScenarioResults(scenario);
    const eligibilityResult = this.checkSurvivorsEligibility();
    
    let inheritanceText = '-';
    let rowClass = '';
    let buttonStyle = {};
    let risk = 'נמוך';
    
    if (results.lostAmount > 0) {
      inheritanceText = `🚨 ${results.lostAmount.toLocaleString('he-IL')} ש"ח נמחק`;
      rowClass = 'survivors-loss-row';
      buttonStyle = { background: 'linear-gradient(135deg, #E74C3C, #C0392B)', color: 'white' };
      risk = 'גבוה - אובדן כסף';
    } else if (scenario.description?.includes('גירושין')) {
      const marriedScenario = { ...scenario, status: 'married' };
      const marriedResults = this.calculateScenarioResults(marriedScenario);
      const loss = Math.round(marriedResults.totalPresentValue - results.totalPresentValue);
      inheritanceText = `⚠️ אובדן זכויות: ${loss.toLocaleString('he-IL')} ש"ח`;
      rowClass = 'survivors-divorce-row';
      buttonStyle = { background: 'linear-gradient(135deg, #FFE66D, #F39C12)', color: 'black' };
      risk = 'בינוני - גירושין';
    } else if (results.inheritanceValue > 0) {
      inheritanceText = results.inheritanceValue.toLocaleString('he-IL') + ' ש"ח';
      risk = 'בינוני - ירושה';
    } else if (results.totalMonthly > 0) {
      inheritanceText = 'לשאירים זכאים';
      risk = 'נמוך';
    }

    this.survivorsScenariosTableData.push({
      id: parseInt(num),
      name: `תרחיש ${num}`,
      eligibility: eligibilityResult.eligible ? '✅' : '❌',
      nationalInsurance: results.monthlyNationalInsurance,
      pensionFund: results.monthlyPensionFund,
      childrenPension: results.childrenPension,
      totalMonthly: results.totalMonthly,
      inheritance: inheritanceText,
      risk: risk,
      rowClass: rowClass,
      buttonStyle: buttonStyle
    });
  });
}

compareDivorceScenarios(): void {
  const currentScenario = this.survivorsData;
  const scenarios = [
    { ...currentScenario, status: 'married', name: 'נשוי (לפני גירושין)' },
    { ...currentScenario, status: 'divorced-with-children', name: 'גרוש עם ילדים' },
    { ...currentScenario, status: 'divorced-no-children', name: 'גרוש ללא ילדים' },
    { ...currentScenario, status: 'single-with-children', name: 'רווק עם ילדים' }
  ];
  
  let html = '<h4>📊 השוואת מצבים משפחתיים</h4>';
  html += '<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">';
  html += '<thead><tr style="background: #9B59B6; color: white;">';
  html += '<th style="padding: 10px;">מצב</th><th style="padding: 10px;">פנסיה חודשית</th><th style="padding: 10px;">ערך כולל</th><th style="padding: 10px;">הערות</th>';
  html += '</tr></thead><tbody>';
  
  scenarios.forEach(scenario => {
    const results = this.calculateScenarioResults(scenario);
    const notes = this.getScenarioNotes(scenario.status);
    
    html += `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${scenario.name}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${Math.round(results.totalMonthly).toLocaleString('he-IL')} ש"ח</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${Math.round(results.totalPresentValue).toLocaleString('he-IL')} ש"ח</td>
        <td style="padding: 8px; border: 1px solid #ddd; font-size: 0.9em;">${notes}</td>
      </tr>
    `;
  });
  
  html += '</tbody></table>';
  this.survivorsDivorceResultsHtml += html;
}

getScenarioNotes(status: string): string {
  switch(status) {
    case 'married': return 'זכאות מלאה - זוג + ילדים';
    case 'divorced-with-children': return 'זכאות חלקית - רק ילדים';
    case 'divorced-no-children': return 'אין זכאות - רק ירושה';
    case 'single-with-children': return 'זכאות לילדים בלבד';
    default: return '';
  }
}

calculatePensionSplit(): void {
  const totalPension = this.survivorsData.pensionFund;
  const yearsMarried = this.survivorsData.yearsMarried || 15;
  const yearsInsured = this.survivorsData.yearsInsured || 20;
  
  // חישוב פיצול בסיסי 50-50
  const basicSplit = totalPension / 2;
  
  // חישוב פיצול יחסי לפי שנות נישואין
  const marriageRatio = yearsMarried / yearsInsured;
  const proportionalSplit = totalPension * marriageRatio / 2;
  
  // חישוב פיצול עם הגנה על ילדים
  const childrenProtection = this.survivorsData.children > 0 ? totalPension * 0.1 : 0;
  const protectedSplit = Math.max(basicSplit - childrenProtection, proportionalSplit);
  
  const html = `
    <div style="margin-top: 20px;">
      <h4>⚖️ אפשרויות פיצול קרן הפנסיה</h4>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin: 20px 0;">
        <div style="background: rgba(74, 144, 226, 0.1); padding: 15px; border-radius: 10px;">
          <h5 style="color: #4A90E2;">פיצול שווה (50-50)</h5>
          <div style="font-size: 1.3em; font-weight: bold;">${Math.round(basicSplit).toLocaleString('he-IL')} ש"ח</div>
          <p style="font-size: 0.9em;">לכל צד מחצית מהקרן</p>
        </div>
        
        <div style="background: rgba(155, 89, 182, 0.1); padding: 15px; border-radius: 10px;">
          <h5 style="color: #9B59B6;">פיצול יחסי</h5>
          <div style="font-size: 1.3em; font-weight: bold;">${Math.round(proportionalSplit).toLocaleString('he-IL')} ש"ח</div>
          <p style="font-size: 0.9em;">לפי יחס שנות נישואין (${Math.round(marriageRatio * 100)}%)</p>
        </div>
        
        <div style="background: rgba(78, 205, 196, 0.1); padding: 15px; border-radius: 10px;">
          <h5 style="color: #4ECDC4;">פיצול עם הגנת ילדים</h5>
          <div style="font-size: 1.3em; font-weight: bold;">${Math.round(protectedSplit).toLocaleString('he-IL')} ש"ח</div>
          <p style="font-size: 0.9em;">שמירה על ${Math.round(childrenProtection).toLocaleString('he-IL')} ש"ח לילדים</p>
        </div>
      </div>
      
      <div style="background: rgba(255, 230, 109, 0.15); padding: 15px; border-radius: 10px; margin: 15px 0;">
        <h5>💡 המלצות משפטיות:</h5>
        <ul style="margin-right: 20px;">
          <li><strong>הסכם קדם נישואין:</strong> קביעת כללי פיצול מראש</li>
          <li><strong>תיעוד תרומות:</strong> הוכחת תרומה לפני הנישואין</li>
          <li><strong>הגנת ילדים:</strong> ביטוח חיים או קרן נפרדת</li>
          <li><strong>ייעוץ משפטי:</strong> עורך דין מומחה בדיני משפחה</li>
        </ul>
      </div>
    </div>
  `;
  
  this.survivorsDivorceResultsHtml += html;
}

toggleAdvancedSettings(): void {
  this.showAdvancedSettings = !this.showAdvancedSettings;
}

updateAdvancedCalculations(): void {
  // עדכון החישובים לפי ההגדרות המתקדמות
  this.calculateSurvivorsPension();
}

resetAdvancedSettings(): void {
  this.advancedSettings = {
    inflationRate: 2.0,
    realReturn: 3.0,
    retirementAge: 67,
    lifeExpectancy: 85
  };
  this.updateAdvancedCalculations();
}

// פונקציות שמירה וייצוא
saveCalculation(): void {
  const calculationData = {
    timestamp: new Date().toISOString(),
    maritalStatus: this.survivorsMaritalStatus,
    data: this.survivorsData,
    results: this.survivorsResults,
    settings: this.advancedSettings
  };
  
  localStorage.setItem('survivors_calculation', JSON.stringify(calculationData));
  
  // הצגת הודעת הצלחה
  this.showNotification('החישוב נשמר בהצלחה', 'success');
}

exportToPDF(): void {
  // יצירת תוכן PDF
  const pdfContent = this.generatePDFContent();
  
  // יצירת קובץ PDF (דורש ספרייה נוספת)
  this.showNotification('ייצוא ל-PDF יתווסף בגרסה הבאה', 'info');
}

exportToExcel(): void {
  const data = [
    ['פרט', 'ערך'],
    ['מצב משפחתי', this.getMaritalStatusText()],
    ['גיל הנפטר', this.survivorsData.age],
    ['שנות ביטוח', this.survivorsData.yearsInsured],
    ['צבירה בקרן', this.survivorsData.pensionFund],
    ['פנסיה מביטוח לאומי', this.survivorsResults.monthlyNationalInsurance],
    ['פנסיה מקרן', this.survivorsResults.monthlyPensionFund],
    ['פנסיית ילדים', this.survivorsResults.childrenPension],
    ['סה״כ חודשי', this.survivorsResults.totalMonthly],
    ['ערך נוכחי', this.survivorsResults.totalPresentValue],
    ['ערך עתידי', this.survivorsResults.totalFutureValue]
  ];
  
  let csvContent = data.map(row => row.join(',')).join('\n');
  csvContent = '\uFEFF' + csvContent; // BOM for Hebrew support
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'survivors_pension_report.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  this.showNotification('הקובץ יוצא בהצלחה', 'success');
}

printDetailedReport(): void {
  const reportContent = this.generateDetailedReport();
  const printWindow = window.open('', '_blank');
  
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
        <head>
          <title>דו"ח מפורט - פנסיית שאירים</title>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              direction: rtl; 
              margin: 20px;
              line-height: 1.6;
            }
            .header { 
              text-align: center; 
              border-bottom: 2px solid #333; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
            }
            .section { 
              margin: 20px 0; 
              padding: 15px; 
              border: 1px solid #ddd; 
              border-radius: 5px; 
            }
            .metric { 
              display: inline-block; 
              margin: 10px; 
              padding: 10px; 
              background: #f5f5f5; 
              border-radius: 5px; 
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 15px 0; 
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 8px; 
              text-align: center; 
            }
            th { 
              background: #f0f0f0; 
              font-weight: bold; 
            }
            .footer { 
              margin-top: 40px; 
              font-size: 0.9em; 
              color: #666; 
              text-align: center; 
            }
          </style>
        </head>
        <body>
          ${reportContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
}

generateDetailedReport(): string {
  const currentDate = new Date().toLocaleDateString('he-IL');
  const qualityScore = this.calculateQualityScore();
  
  return `
    <div class="header">
      <h1>דו"ח מפורט - פנסיית שאירים</h1>
      <p>תאריך: ${currentDate} | מצב משפחתי: ${this.getMaritalStatusText()}</p>
    </div>
    
    <div class="section">
      <h2>📊 נתונים בסיסיים</h2>
      <div class="metric">גיל הנפטר: ${this.survivorsData.age}</div>
      <div class="metric">שנות ביטוח: ${this.survivorsData.yearsInsured}</div>
      <div class="metric">צבירה בקרן: ${this.survivorsData.pensionFund.toLocaleString('he-IL')} ש"ח</div>
      <div class="metric">מספר ילדים: ${this.survivorsData.children}</div>
    </div>
    
    <div class="section">
      <h2>💰 תוצאות חישוב</h2>
      <table>
        <tr>
          <th>מקור</th>
          <th>סכום חודשי</th>
          <th>אחוז מהכלל</th>
        </tr>
        <tr>
          <td>ביטוח לאומי</td>
          <td>${this.survivorsResults.monthlyNationalInsurance.toLocaleString('he-IL')} ש"ח</td>
          <td>${Math.round((this.survivorsResults.monthlyNationalInsurance / this.survivorsResults.totalMonthly) * 100)}%</td>
        </tr>
        <tr>
          <td>קרן פנסיה</td>
          <td>${this.survivorsResults.monthlyPensionFund.toLocaleString('he-IL')} ש"ח</td>
          <td>${Math.round((this.survivorsResults.monthlyPensionFund / this.survivorsResults.totalMonthly) * 100)}%</td>
        </tr>
        <tr>
          <td>פנסיית ילדים</td>
          <td>${this.survivorsResults.childrenPension.toLocaleString('he-IL')} ש"ח</td>
          <td>${Math.round((this.survivorsResults.childrenPension / this.survivorsResults.totalMonthly) * 100)}%</td>
        </tr>
        <tr style="font-weight: bold; background: #e8f4f8;">
          <td>סה"כ</td>
          <td>${this.survivorsResults.totalMonthly.toLocaleString('he-IL')} ש"ח</td>
          <td>100%</td>
        </tr>
      </table>
    </div>
    
    <div class="section">
      <h2>🎯 ציון איכות</h2>
      <p><strong>ציון כולל:</strong> ${qualityScore.score}/100 (${qualityScore.level})</p>
      <h3>המלצות:</h3>
      <ul>
        ${qualityScore.recommendations.map(rec => `<li>${rec}</li>`).join('')}
      </ul>
    </div>
    
    <div class="section">
      <h2>📈 ערכים עתידיים</h2>
      <p><strong>ערך נוכחי:</strong> ${this.survivorsResults.totalPresentValue.toLocaleString('he-IL')} ש"ח</p>
      <p><strong>ערך עתידי (עם הצמדה):</strong> ${this.survivorsResults.totalFutureValue.toLocaleString('he-IL')} ש"ח</p>
      <p><strong>תקופת תשלום:</strong> ${this.survivorsResults.yearsToReceive} שנים</p>
    </div>
    
    ${this.survivorsResults.lostAmount > 0 ? `
      <div class="section" style="border-color: #E74C3C; background: #ffeaea;">
        <h2 style="color: #E74C3C;">⚠️ אזהרה: אובדן כסף</h2>
        <p><strong>סכום שנמחק:</strong> ${this.survivorsResults.lostAmount.toLocaleString('he-IL')} ש"ח</p>
        <p><strong>סיבה:</strong> ילדים מעל גיל 21 אינם זכאים לפנסיית שאירים מקרן הפנסיה</p>
      </div>
    ` : ''}
    
    <div class="footer">
      <p><strong>הסתייגות:</strong> דו"ח זה מספק הערכה בלבד ואינו מהווה ייעוץ פיננסי או משפטי מקצועי.</p>
      <p>נוצר במערכת ייעוץ פיננסי מתקדמת | עודכן אוגוסט 2025</p>
    </div>
  `;
}

shareResults(): void {
  const shareData = {
    title: 'תוצאות חישוב פנסיית שאירים',
    text: `פנסיה חודשית: ${this.survivorsResults.totalMonthly.toLocaleString('he-IL')} ש"ח\nערך כולל: ${this.survivorsResults.totalPresentValue.toLocaleString('he-IL')} ש"ח`,
    url: window.location.href
  };
  
  if (navigator.share) {
    navigator.share(shareData).catch(err => console.log('Error sharing:', err));
  } else {
    // Fallback - copy to clipboard
    navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`)
      .then(() => this.showNotification('הועתק ללוח', 'success'))
      .catch(() => this.showNotification('שגיאה בהעתקה', 'error'));
  }
}

showNotification(message: string, type: 'success' | 'error' | 'info'): void {
  // יצירת הודעת Toast פשוטה
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    z-index: 10000;
    background: ${type === 'success' ? '#4ECDC4' : type === 'error' ? '#E74C3C' : '#4A90E2'};
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);
}

generatePDFContent(): string {
  // תוכן בסיסי ל-PDF
  return this.generateDetailedReport();
}

  // חישוב כל הפנסיות
  calculateAllSurvivorsPensions(): any {
    let monthlyNationalInsurance = 0;
    let monthlyPensionFund = 0;
    let childrenPension = 0;
    let lostAmount = 0;

    // ביטוח לאומי - רק אם יש שאירים זכאים
    if (this.hasEligibleSurvivors()) {
      const seniorityBonus = Math.min(this.survivorsData.yearsInsured * 0.02, 0.50);

      if (this.survivorsMaritalStatus === 'married') {
        const baseAmount = AVERAGE_WAGE_2025 * 0.28;
        const spouseAmount = AVERAGE_WAGE_2025 * 0.14;
        monthlyNationalInsurance = baseAmount + spouseAmount;
        monthlyNationalInsurance = monthlyNationalInsurance * (1 + seniorityBonus);

        if (this.survivorsData.children > 0) {
          monthlyNationalInsurance += CHILD_ALLOWANCE_FIRST + 
            (this.survivorsData.children > 1 ? (this.survivorsData.children - 1) * CHILD_ALLOWANCE_ADDITIONAL : 0);
        }
      } else if (['divorced-with-children', 'single-with-children'].includes(this.survivorsMaritalStatus)) {
        if (this.hasEligibleChildren()) {
          const baseAmount = AVERAGE_WAGE_2025 * 0.28;
          monthlyNationalInsurance = baseAmount * (1 + seniorityBonus);
          monthlyNationalInsurance += CHILD_ALLOWANCE_FIRST + 
            (this.survivorsData.children > 1 ? (this.survivorsData.children - 1) * CHILD_ALLOWANCE_ADDITIONAL : 0);
        }
      }
    }

    // פנסיית ילדים ישירה
    if (['divorced-with-children', 'single-with-children'].includes(this.survivorsMaritalStatus)) {
      const eligibleChildrenCount = this.getEligibleChildrenCount();
      childrenPension = eligibleChildrenCount * DIRECT_CHILDREN_PENSION;
    }

    // קרן פנסיה
    if (this.survivorsData.pensionFund > 0 && this.hasEligibleSurvivors()) {
      const oldAgePension = this.survivorsData.pensionFund / 200;
      const eligibleChildrenCount = this.getEligibleChildrenCount();

      if (this.survivorsMaritalStatus === 'married') {
        monthlyPensionFund = oldAgePension * 0.60;
        
        if (eligibleChildrenCount === 0) {
          lostAmount = oldAgePension * 0.40;
        } else {
          monthlyPensionFund += oldAgePension * 0.20 * eligibleChildrenCount;
        }
      } else if (['divorced-with-children', 'single-with-children'].includes(this.survivorsMaritalStatus)) {
        monthlyPensionFund = oldAgePension * 0.40 * eligibleChildrenCount;
      }
    }

    const totalMonthly = monthlyNationalInsurance + monthlyPensionFund + childrenPension;
    const yearsToReceive = this.calculateYearsToReceive();
    const totalPresentValue = totalMonthly * yearsToReceive * 12;
    const totalFutureValue = totalPresentValue * Math.pow(1.02, yearsToReceive);

    return {
      monthlyNationalInsurance,
      monthlyPensionFund,
      childrenPension,
      totalMonthly,
      totalPresentValue,
      totalFutureValue,
      inheritanceValue: this.hasEligibleSurvivors() ? 0 : this.survivorsData.pensionFund,
      lostAmount,
      yearsToReceive
    };
  }

  // פונקציות עזר
  parseChildrenAges(): number[] {
    if (!this.survivorsData.childrenAges) return [];
    return this.survivorsData.childrenAges
      .split(',')
      .map(age => parseInt(age.trim()))
      .filter(age => !isNaN(age));
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
