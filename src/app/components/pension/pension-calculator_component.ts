import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import Accessibility from 'highcharts/modules/accessibility';
import {
  PensionCalculatorService, CalcInput, SimulationResult, AVERAGE_WAGE_2025,
  getSeniorityPercent,
  calculateYearsReceiving
} from './../../services/pension-calculator.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { ElementRef, ViewChild } from '@angular/core';

Exporting(Highcharts);
Accessibility(Highcharts);

export interface ScenarioRow {
  id: number;
  eligible: boolean;
  btl: number;        // ביטוח לאומי (בן/בת זוג בלבד)
  fund: number;       // קרן פנסיה (בן/בת זוג בלבד)
  kids: number;       // סך כל הילדים (ב"ל + קרן)
  total: number;      // סה"כ חודשי (ברוטו)
  net: number;        // נטו (אחרי applySimpleTax או אומדן אחר)
  perChild: string;   // “-” או סכום לכל ילד (מחרוזה מוצגת)
  inheritance: string; // “לשאירים זכאים” / “🚨 X ש"ח נמחק” / “⚠️ אובדן זכויות …” / “-”
}

export interface Scenario {
  status: CalcInput['maritalStatus'];
  age: number;
  salary: number;
  yearsInsured: number;
  children: number;
  childrenAges: string | number[];
  pensionFund: number;
  spouseAge?: number;
  yearsMarried?: number;
  occupation?: string;
  hasEarlyRetirement?: boolean;
  description?: string;
  expectedResults?: any;
  isLossScenario?: boolean;
  isDivorceScenario?: boolean;
  isTaxScenario?: boolean;
  expectedHighTax?: boolean;
  hasDisability?: boolean;
  marriageStart?: number;
  divorceYear?: number;
  pensionBeforeMarriage?: number;
}

interface SummaryVM {
  statusText: string;
  eligible: boolean;
  totalMonthly: number;
  presentValue: number;
  yearsToReceive: number;
  inheritanceValue: number;
  tips: string[];
}



// Keep original structure and comments
export const SCENARIOS: Record<number, Scenario> = (
  {
    1: {
      status: 'single-no-children',
      age: 35,
      salary: 12000,
      yearsInsured: 7,
      children: 0,
      childrenAges: '',
      pensionFund: 220000,
      expectedResults: {
        eligible: true,
        monthlyPension: 0, // אין שאירים!
        fundPension: 0,    // אין שאירים!
        childrenPension: 0,
        inheritanceValue: 220000 // הצבירה ליורשים
      }
    },
    2: {
      status: 'divorced-with-children',
      age: 45,
      salary: 15000,
      yearsInsured: 10,
      children: 1,
      childrenAges: '10',
      pensionFund: 400000,
      expectedResults: {
        eligible: true,
        monthlyPension: 5000,    // 15000 * 0.28 + 800 = 4200 + 800
        fundPension: 800,        // (400000/200) * 0.40 * 1 = 2000 * 0.40
        childrenPension: 1200,   // 1200 * 1 ילד
        totalMonthly: 7000
      }
    },
    3: { status: 'married', age: 50, spouseAge: 45, salary: 18000, yearsInsured: 20, children: 2, childrenAges: '8,12', pensionFund: 600000, yearsMarried: 15 },
    4: { status: 'single-with-children', age: 30, salary: 10000, yearsInsured: 6, children: 3, childrenAges: '5,9,16', pensionFund: 300000 },
    5: { status: 'married', age: 68, spouseAge: 62, salary: 16000, yearsInsured: 30, children: 0, childrenAges: '', pensionFund: 950000, yearsMarried: 25 },
    6: { status: 'divorced-no-children', age: 39, salary: 14000, yearsInsured: 3, children: 0, childrenAges: '', pensionFund: 180000 },
    7: { status: 'single-with-children', age: 42, salary: 12000, yearsInsured: 15, children: 2, childrenAges: '7,14', pensionFund: 380000 },
    8: { status: 'married', age: 47, spouseAge: 45, salary: 13000, yearsInsured: 15, children: 0, childrenAges: '', pensionFund: 450000, yearsMarried: 10 },
    9: { status: 'divorced-no-children', age: 60, salary: 14000, yearsInsured: 20, children: 1, childrenAges: '25', pensionFund: 520000 },
    10: { status: 'single-with-children', age: 28, salary: 11000, yearsInsured: 6, children: 1, childrenAges: '4', pensionFund: 240000 },
    11: {
      status: 'married',
      age: 72,
      spouseAge: 68,
      salary: 20000,
      yearsInsured: 35,
      children: 2,
      childrenAges: '45,42', // ילדים בוגרים מעל גיל 21
      pensionFund: 1200000,
      yearsMarried: 40,
      expectedResults: {
        eligible: true, // זכאי - מעל גיל 67
        monthlyPension: 8400, // 20000 * 0.28 + 20000 * 0.14 = 5600 + 2800 (ללא תוספות ילדים)
        fundPension: 3600,    // (1200000/200) * 0.60 = 6000 * 0.60 לבת הזוג
        childrenPension: 0,   // ילדים מעל גיל 21 - לא זכאים
        totalMonthly: 12000,
        inheritanceValue: 0   // יש שאירים זכאים (בת הזוג)
      },
      description: "פנסיונר רגיל - מעל גיל הפנסיה, נשוי עם ילדים בוגרים"
    },
    12: {
      status: 'married',
      age: 67,
      spouseAge: 63,
      salary: 18000,
      yearsInsured: 30,
      children: 2,
      childrenAges: '25,28', // ילדים בוגרים מעל גיל 21
      pensionFund: 800000,
      yearsMarried: 35,
      expectedResults: {
        eligible: true,
        monthlyPension: 8960,
        fundPension: 2400,    // 60% לאלמנה
        childrenPension: 0,   // ילדים מעל גיל 21
        totalMonthly: 11360,
        lostAmount: 320000,   // 40% מהצבירה שנמחק!
        inheritanceValue: 0
      },
      description: "מת בגיל הפנסיה עם ילדים בוגרים - 40% מהקרן נמחק",
      isLossScenario: true
    },
    13: {
      status: 'divorced-with-children',  // ✅ משנה ל"גרוש" מיד!
      age: 45,
      spouseAge: 42,
      salary: 18000,
      yearsInsured: 20,
      children: 2,
      childrenAges: '8,12',
      pensionFund: 600000,
      yearsMarried: 15,
      marriageStart: 2010,
      divorceYear: 2025,
      pensionBeforeMarriage: 150000,
      description: "גירושין אחרי 15 שנות נישואין - מציג מצב אחרי גירושין",
      isDivorceScenario: true
    },
    14: {
      status: 'divorced-no-children',   // ✅ גרוש ללא ילדים זכאים
      age: 58,
      spouseAge: 55,
      salary: 25000,
      yearsInsured: 30,
      children: 2,
      childrenAges: '25,28',  // ילדים מבוגרים
      pensionFund: 1200000,
      yearsMarried: 25,
      marriageStart: 2000,
      divorceYear: 2025,
      pensionBeforeMarriage: 200000,
      description: "גירושין מאוחרים - אובדן מלא של זכויות שאירים",
      isDivorceScenario: true
    },
    15: {
      status: 'married',
      age: 55,
      spouseAge: 50,
      salary: 30000,  // שכר גבוה = פנסיה מעל הפטור
      yearsInsured: 25,
      children: 1,
      childrenAges: '22',
      pensionFund: 1500000,
      yearsMarried: 20,
      description: "בדיקת מיסוי - פנסיה מעל הפטור",
      isTaxScenario: true
    },
    16: {
      status: 'married',
      age: 70,
      spouseAge: 67,
      salary: 6000,   // שכר נמוך = יקבל זקנה
      yearsInsured: 15,
      children: 2,
      childrenAges: '45,42',
      pensionFund: 200000,
      yearsMarried: 40,
      description: "פנסיונר עני - יקבל קצבת זקנה נוספת",
      expectedResults: {
        oldAge: 1800,      // ✅ זקנה כי השכר נמוך
        disability: 0,     // ✅ ללא נכות אוטומטית
        incomeSupport: 0,  // לא זכאי כנשוי עם פנסיה
        childAllowance: 0  // ילדים בוגרים
      }
    },
    17: {
      status: 'single-with-children',
      age: 32,
      salary: 6000,   // הכנסה נמוכה
      yearsInsured: 8,
      children: 3,
      childrenAges: '5,8,12', // 3 ילדים קטנים
      pensionFund: 150000,
      description: "הורה יחיד עני - יקבל הבטחת הכנסה",
      expectedResults: {
        oldAge: 0,         // לא בגיל פנסיה
        disability: 0,     // צעיר יחסית
        incomeSupport: 1700, // השלמה ל-4200 מההכנסה של 2500 (פנסיה + ילדים)
        childAllowance: 0  // לא נספר כפל עם פנסיית יתומים
      }
    },
    18: {
      status: 'married',
      age: 55,
      spouseAge: 52,
      salary: 15000,
      yearsInsured: 25,
      children: 2,
      childrenAges: '14,16', // ילדים קטנים עדיין
      pensionFund: 800000,
      yearsMarried: 20,
      description: "משפחה נשואה עם ילדים - יקבלו קצבת ילדים רגילה",
      expectedResults: {
        oldAge: 0,         // לא בגיל פנסיה
        disability: 800,   // נכות חלקית לגיל 55+
        incomeSupport: 0,  // הכנסה גבוהה מדי
        childAllowance: 380 // 2 ילדים × 190 ש"ח
      }
    },
    19: {
      status: 'married',
      age: 45,
      spouseAge: 42,
      salary: 8000,
      yearsInsured: 20,
      children: 2,
      childrenAges: '10,14',
      pensionFund: 300000,
      yearsMarried: 18,
      hasDisability: true, // 🔥 וודא שזה true
      description: "נכה בפועל - מקבל נכות כללית 2,800 ש\"ח"
    },
    20: {
      status: 'married',
      age: 55,
      spouseAge: 50,
      salary: 18000,
      yearsInsured: 25,
      children: 4,
      childrenAges: '12,16,22,25', // ערבוב: קטנים + בוגרים
      pensionFund: 900000,
      yearsMarried: 20,
      description: "משפחה מורכבת - חלק מהילדים זכאים וחלק לא",
      expectedResults: {
        childrenEligible: 2, // רק 2 הקטנים זכאים
        lostRights: "ילדים בוגרים לא זכאים"
      }
    },

    21: {
      status: 'divorced-with-children',
      age: 38,
      salary: 25000,
      yearsInsured: 15,
      children: 2,
      childrenAges: '8,14',
      pensionFund: 450000,
      description: "גירושין + שכר גבוה - מס על פנסיה",
      expectedHighTax: true
    },

    // 2. 🏥 תרחישי מצבים רפואיים
    22: {
      status: 'single-with-children',
      age: 42,
      salary: 7000,
      yearsInsured: 18,
      children: 3,
      childrenAges: '6,10,15',
      pensionFund: 280000,
      hasDisability: true,
      description: "אם חד-הורית נכה עם 3 ילדים - הבטחת הכנסה + נכות",
      expectedResults: {
        disability: 2800,
        incomeSupport: 1500, // השלמה להבטחת הכנסה
        specialNeed: "זקוקה לתמיכה מרבית"
      }
    },

    // 3. 💰 תרחישי עושר/עוני קיצוניים
    23: {
      status: 'married',
      age: 45,
      spouseAge: 42,
      salary: 80000, // עשיר מאוד
      yearsInsured: 20,
      children: 2,
      childrenAges: '10,14',
      pensionFund: 3500000, // צבירה ענקית
      yearsMarried: 18,
      description: "משפחה עשירה - מס גבוה, אין קצבאות נוספות",
      expectedResults: {
        heavyTax: true,
        noOtherBenefits: true
      }
    },

    24: {
      status: 'single-with-children',
      age: 28,
      salary: 4500, // עני קיצוני
      yearsInsured: 4,
      children: 2,
      childrenAges: '3,6',
      pensionFund: 45000, // צבירה מינימלית
      description: "עוני קיצוני - הבטחת הכנסה מלאה",
      expectedResults: {
        maxIncomeSupport: true,
        lowPensionFund: true
      }
    },

    // 4. 🎓 תרחישי מקצועות מיוחדים
    25: {
      status: 'married',
      age: 55,
      spouseAge: 52,
      salary: 35000,
      yearsInsured: 30,
      children: 1,
      childrenAges: '20',
      pensionFund: 2200000,
      occupation: 'pilot', // מקצוע מסוכן
      hasEarlyRetirement: true,
      description: "טייס - פרישה מוקדמת בגיל 55",
      expectedResults: {
        earlyRetirementBonus: 15000
      }
    }
  } as Record<number, Scenario>);

  const SIMPLE_TAX_BRACKETS: Array<{ upTo: number; rate: number }> = [
    { upTo: 6500,  rate: 0.00 },
    { upTo: 10000, rate: 0.10 },
    { upTo: 16000, rate: 0.20 },
    { upTo: Infinity, rate: 0.30 },
  ];


@Component({
  selector: 'app-pension-calculator',
  templateUrl: './pension-calculator.component.html',
  styleUrls: ['./pension-calculator.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HighchartsChartModule],
  encapsulation: ViewEncapsulation.None
})
export class PensionCalculatorComponent implements AfterViewInit, OnInit {
  @ViewChild('mermaidContainer') mermaidContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('mermaidSvgContainer') mermaidSvgContainer!: ElementRef<HTMLDivElement>;
  // ====== טופס/סטייט בסיסי (התאם לשדות שלך) ======
  maritalStatus: CalcInput['maritalStatus'] = 'single-no-children';
  age = 35;
  salary = 12000;                     // הערך המספרי “האמיתי”
  salaryInput = this.fmt(this.salary); // המחרוזת שמוצגת בשדה
  yearsInsured = 7;
  pensionFund = 220000;
  pensionFundInput = this.fmt(this.pensionFund); // המחרוזת שמוצגת בשדה
  children = 0;
  childrenAges = ''; // מחרוזת פסיקים "10, 7, 3"
  spouseAge = 42; // חדש: דרוש לטבלת אלמן/הo = false;
  yearsMarried = 15;
  occupation = 'pilot';
  hasEarlyRetirement = true;
  description = '';
  expectedResults = {};
  isLossScenario = false;
  isDivorceScenario = false;
  isTaxScenario = false;
  expectedHighTax = false;
  hasDisability = false;
  marriageStart = 2000;
  divorceYear = 2025;
  pensionBeforeMarriage = 200000;
  monthlyContribution = 0;
  annualFee = 1
  avgAnnualReturn = 5;
  private ageSliderEnabled = true;      // כמו במקור – מאפשר לכבות אם צריך
  private prevAgeForSlider = this.age;  // הגיל הקודם לצורך חישוב הדלתא


  // מדיניות תשלום חודשי
  totalMonthly = 0;
  flowPulse = false;
  flowTick = 0;

  // 1) שדה לתצוגת הפירוט
  survivorsBreakdownHtml = '';

  BeneficiarySplitHtml = '';

  // ===== Metrics state =====
  monthlyPension = 0;                // BTL
  fundPension = 0;                   // FUND
  childrenPension = 0;               // KIDS
  perChildAmount: number | null = null;

 kidsAges = (this.childrenAges || '')
  .split(',')
  .map(s => parseInt(s.trim(), 10))
  .filter(n => !Number.isNaN(n));

input: CalcInput = {
  maritalStatus: this.maritalStatus,
  age: this.age,
  spouseAge: this.spouseAge,
  salary: this.salary,
  yearsInsured: this.yearsInsured,
  pensionFund: this.pensionFund,
  children: this.children,
  childrenAges: this.kidsAges
};

  // שמור את הסיכום כאן
  summary?: SummaryVM;
  totalValue = 0;                    // סכום תשלומים נוכחי (ללא היוון)
  futureValue = 0;                   // הצמדה
  inheritanceValue = 0;

  monthlyPensionExplanation = '';
  fundPensionExplanation = '';
  childrenPensionExplanation = '';
  perChildExplanation = '';
  totalValueExplanation = '';
  futureValueExplanation = '';
  inheritanceExplanation = '';

  // הגדרות כלליות לחישוב הערכים המצטברים כשאין סדרה מפורשת
  private horizonYears = 8;          // כמו במקור שלך בטקסט
  private annualIndexRate = 0.02;    // 2% הצמדה


  ageMin = 20;
  ageMax = 85;
  ageTicks = [20, 30, 40, 50, 60, 67, 75, 85];

  scenarioIds: number[] = Object.keys(SCENARIOS).map(Number).sort((a, b) => a - b);

  // ====== Highcharts ======
  Highcharts: typeof Highcharts = Highcharts;
  updateAgeImpact = false;
  updateInsights = false;
  updateComparison = false;

  private bump(ref: 'updateAgeImpact'|'updateInsights'|'updateComparison') {
    // ודא שתמיד תהיה עליה ל-true (rising edge)
    this[ref] = false;                // איפוס מיידי (לא גורם לעדכון)
    Promise.resolve().then(() => {    // מיקרוטסק: אחרי שמוטציות ה־options הסתיימו
      this[ref] = true;               // ↑ טריגר לעדכון
      // החזרה ל-false כדי שהפעם הבאה שוב תהיה עליה
      setTimeout(() => (this[ref] = false), 0);
    });
  }


  // מונע חישובים כפולים בזמן טעינת תרחיש
  private isLoadingScenario = false;

  // גרפים קיימים
  ageImpactOptions: Highcharts.Options = this.svc.buildAgeImpactBaseOptions();
  benefitSplitOptions: Highcharts.Options = this.svc.buildBenefitSplitBaseOptions();

  // גרפים חדשים
  insightsOptions: Highcharts.Options = this.svc.buildInsightsOptions();
  comparisonOptions: Highcharts.Options = this.svc.buildComparisonChartOptions();

  /** ---------------- סימון תרחיש נבחר: שדות ---------------- */
  selectedScenarioId: number | null = null;
  selectedScenarioLabel = '';

  /** (לא חובה) סימון תרחיש גירושין נבחר */
  selectedDivorceScenarioId: number | null = null;

  // -------- Death Distribution table state --------
  dd = {
    btl: { monthly: 0, lump: 0, note: '' },
    fund: { monthly: 0, lump: 0, note: '' },
    children: { monthly: 0, lump: 0, note: '' },
    total: { monthly: 0, lump: 0, note: '' },
  };



  constructor(private svc: PensionCalculatorService) { }

  // מבנה שורה לטבלה
  scenarioRows: ScenarioRow[] = [];

  ngOnInit(): void {
    this.recomputeScenarioTable();
  }

  ngAfterViewInit(): void {
    // ריצה ראשונית
    //this.recalculateAndRender();
    this.loadScenario(3,'נשוי 50 עם ילדים');
  }
  
  // מפה לטקסט מצב (כמו בקוד המקורי)
private maritalStatusText(ms: CalcInput['maritalStatus']): string {
  switch (ms) {
    case 'single-no-children':   return 'רווק/ה ללא ילדים';
    case 'single-with-children': return 'רווק/ה עם ילדים';
    case 'divorced-no-children': return 'גרוש/ה ללא ילדים';
    case 'divorced-with-children': return 'גרוש/ה עם ילדים';
    case 'married':              return 'נשוי/אה';
    default:                     return 'מצב משפחתי';
  }
}

// המלצות לפי מצב
private buildTips(ms: CalcInput['maritalStatus']): string[] {
  switch (ms) {
    case 'single-no-children':
      return [
        'ערוך צוואה מעודכנת לחלוקת הנכסים',
        'שקול ביטוח חיים לכיסוי חובות והוצאות',
        'בחן השקעות נוספות לבניית עושר',
      ];
    case 'single-with-children':
      return [
        'קבע אפוטרופס לילדים במקרה הצורך',
        'פתח קרן חינוך לילדים',
        'שקול ביטוח חיים מוגדל לכיסוי הילדים',
        'ודא שמוטבי הקרן מעודכנים',
      ];
    case 'divorced-with-children':
      return [
        'עדכן מוטבים בקרן הפנסיה לטובת הילדים',
        'ברר זכויות בן/בת הזוג לשעבר בקרן',
        'שקול ביטוח חיים נפרד לילדים',
        'תכנן מסלול פיננסי עצמאי',
      ];
    case 'divorced-no-children':
      return [
        'עדכן צוואה לאחר הגירושין',
        'ברר זכויות בן/בת הזוג לשעבר בקרן',
        'שקול השקעות נוספות לעצמאות פיננסית',
        'עדכן מוטבים בכל הפוליסות',
      ];
    case 'married':
      return [
        'ודא שבן/בת הזוג מוגדר/ת כמוטב/ת',
        'שקול ביטוח חיים נוסף למשכנתא',
        'תכנן מסלול פרישה משותף',
        'פתח קרנות חינוך לילדים',
      ];
    default:
      return [];
  }
}

/**
 * בונה סיכום דינמי מתוך תוצאת הסימולציה והקלט הנוכחי
 * @param sim תוצאת הסימולטור (calculateAllPensionsAdapter)
 * @param input הקלט הנוכחי (this.input)
 */
private refreshSummaryFromSim(sim: any, input: CalcInput) {
  if (!sim || !input) { this.summary = undefined; return; }

  // סה"כ חודשי מתוך הפירוק
  const totalMonthly =
    Math.max(0,
      (sim?.breakdown?.btl  || 0) +
      (sim?.breakdown?.fund || 0) +
      (sim?.breakdown?.kids || 0)
    );

  // שנות תשלום (מהשירות) — אם חסר, נניח 8 כדי לא להשאיר ריק
  const yearsToReceive = Number(sim?.meta?.yearsReceiving ?? 8);

  // אומדן ערך כולל (PV פשוט — כמו בקוד המקורי)
  const presentValue = Math.round(totalMonthly * yearsToReceive * 12);

  // ירושה חד-פעמית אם אין קצבה חודשית
  const inheritanceValue = totalMonthly > 0 ? 0 : Math.max(0, Number(input.pensionFund || 0));

  // זכאות: אם יש תשלום חודשי או צבירה שעוברת בירושה
  const eligible = (totalMonthly > 0) || (inheritanceValue > 0);

  this.summary = {
    statusText: this.maritalStatusText(input.maritalStatus),
    eligible,
    totalMonthly,
    presentValue,
    yearsToReceive,
    inheritanceValue,
    tips: this.buildTips(input.maritalStatus),
  };
}

  get mermaidTransform(): string {
    return `translate(${this.tx}px, ${this.ty}px) scale(${this.zoom})`;
  }
  
  private clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)); }
  private setZoom(newZoom: number, center?: { x: number; y: number }) {
    const cont = this.mermaidContainer?.nativeElement;
    const prev = this.zoom;
    this.zoom = this.clamp(newZoom, this.minZoom, this.maxZoom);
  
    // שומר פוקוס סביב נקודת הזום (סמן/מרכז פינץ’)
    if (center && cont) {
      const rect = cont.getBoundingClientRect();
      const cx = center.x - rect.left;
      const cy = center.y - rect.top;
      this.tx = cx - ((cx - this.tx) * (this.zoom / prev));
      this.ty = cy - ((cy - this.ty) * (this.zoom / prev));
    }
  }
  
  /** כפתורים */
  zoomIn()  { this.setZoom(this.zoom * 1.15); }
  zoomOut() { this.setZoom(this.zoom / 1.15); }
  resetZoom() { this.zoom = 1; this.tx = 0; this.ty = 0; }
  
  fitToScreen() {
    const cont = this.mermaidContainer?.nativeElement;
    const svg  = this.mermaidSvgContainer?.nativeElement;
    if (!cont || !svg) return;
  
    const contentW = svg.scrollWidth || svg.offsetWidth || 1;
    const contentH = svg.scrollHeight || svg.offsetHeight || 1;
    const scaleX = (cont.clientWidth  - 32) / contentW;
    const scaleY = (cont.clientHeight - 32) / contentH;
    const target = Math.min(scaleX, scaleY);
  
    this.zoom = this.clamp(target, this.minZoom, this.maxZoom);
    // מרכז למסגרת
    this.tx = (cont.clientWidth  - contentW * this.zoom) / 2;
    this.ty = (cont.clientHeight - contentH * this.zoom) / 2;
  }
  
  /** פאן בעכבר */
  isPanning = false;
  private panStartX = 0;
  private panStartY = 0;
  private startTx = 0;
  private startTy = 0;
  
  onPanStart(ev: MouseEvent) {
    // לוחצים רק על כפתור שמאלי
    if (ev.button !== 0) return;
    this.isPanning = true;
    this.panStartX = ev.clientX;
    this.panStartY = ev.clientY;
    this.startTx = this.tx;
    this.startTy = this.ty;
  }
  
  onPanMove(ev: MouseEvent) {
    if (!this.isPanning) return;
    this.tx = this.startTx + (ev.clientX - this.panStartX);
    this.ty = this.startTy + (ev.clientY - this.panStartY);
  }
  
  onPanEnd() { this.isPanning = false; }
  
  /** זום בגלגלת */
  onWheel(ev: WheelEvent) {
    ev.preventDefault();
    const factor = ev.deltaY > 0 ? (1 / 1.1) : 1.1;
    this.setZoom(this.zoom * factor, { x: ev.clientX, y: ev.clientY });
  }
  
  /** מגע: פאן/פינץ' */
  private pinchStartDist = 0;
  private pinchStartZoom = 1;
  private pinchCenter = { x: 0, y: 0 };
  private touchStartX = 0;
  private touchStartY = 0;

  /** מצב זום/פאן */
  zoom = 1;
  minZoom = 0.4;
  maxZoom = 2.5;
  tx = 0;  // translateX של התוכן
  ty = 0;  // translateY של התוכן


  
  onTouchStart(ev: TouchEvent) {
    if (ev.touches.length === 2) {
      const [t1, t2] = [ev.touches[0], ev.touches[1]];
      this.pinchStartDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      this.pinchStartZoom = this.zoom;
      this.pinchCenter = { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 };
      this.isPanning = false;
    } else if (ev.touches.length === 1) {
      this.isPanning = true;
      this.touchStartX = ev.touches[0].clientX;
      this.touchStartY = ev.touches[0].clientY;
      this.startTx = this.tx;
      this.startTy = this.ty;
    }
  }
  
  onTouchMove(ev: TouchEvent) {
    if (ev.touches.length === 2 && this.pinchStartDist) {
      const [t1, t2] = [ev.touches[0], ev.touches[1]];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const scale = dist / this.pinchStartDist;
      this.setZoom(this.pinchStartZoom * scale, this.pinchCenter);
    } else if (ev.touches.length === 1 && this.isPanning) {
      const dx = ev.touches[0].clientX - this.touchStartX;
      const dy = ev.touches[0].clientY - this.touchStartY;
      this.tx = this.startTx + dx;
      this.ty = this.startTy + dy;
    }
  }
  
  onTouchEnd() {
    this.isPanning = false;
    this.pinchStartDist = 0;
  }

  // 2) פונקציית עזר – כמה ילדים זכאים בפועל (אפשר להחליף בישירות מה-Service אם יש לך)
  private countEligibleChildren(childrenAges: number[], declared: number): number {
    const n = (childrenAges ?? []).filter(a => Number.isFinite(a)).length;
    // אם יש לך כללי זכאות מדויקים בשירות — החלף כאן לקריאה ישירה אליו.
    try {
      // אם ה-Service כולל getEligibleChildrenCount (לפי המתאם שלך), עדיף:
      // return getEligibleChildrenCount(childrenAges, declared);
      return Math.max(0, Math.min(declared || 0, (childrenAges || []).filter(a => a < 18).length));
    } catch {
      return Math.max(0, Math.min(declared || 0, (childrenAges || []).filter(a => a < 18).length));
    }
  }

  btnClassFor(row: ScenarioRow): string {
    if (!row?.inheritance) return '';
    if (row.inheritance.includes('נמחק') || row.inheritance.includes('🚨')) return 'btn-loss';
    if (row.inheritance.includes('אובדן זכויות') || row.inheritance.includes('⚠️')) return 'btn-rights';
    return '';
  }


  // 3) בניית ה-HTML של פירוט החישוב (Port מה-JS)
  private buildSurvivorsBreakdownHtml(
    sim: {
      monthlyPension?: number;
      childrenPension?: number;
      fundPension?: number;
      btlCategory?: string;
      lostAmount?: number;
    },
    input: CalcInput
  ): string {
    const maritalText = this.getMaritalStatusText(input.maritalStatus);
    const eligibleChildren = this.eligibleChildrenCount(input.childrenAges, input.children);
    const hasSurvivors = (input.maritalStatus === 'married') || (eligibleChildren > 0);

    // קצבת אלמן/ה (בלבד) וקצבת יתומים (בלבד)
    const widowPension = Math.round(sim.monthlyPension || 0);
    const orphansPension = Math.round(sim.childrenPension || 0);

    // האם יש אלמן/ה? רק אז יש תוספת ותק
    const applySeniority = widowPension > 0;

    // אחוז ותק (2% לשנה עד 50%), ואם ה-Service בעתיד מחזיר — תעדיף אותו:
    const seniorityPct =
      typeof (sim as any)?.seniorityPercent === 'number'
        ? Math.max(0, Math.min(0.5, (sim as any).seniorityPercent))
        : (applySeniority ? Math.max(0, Math.min(0.5, (input.yearsInsured || 0) * 0.02)) : 0);

    // מפרקים את קצבת האלמן/ה לבסיס + תוספת ותק
    let baseBeforeSeniority = 0;
    let seniorityBonus = 0;
    if (applySeniority) {
      baseBeforeSeniority = Math.round(widowPension / (1 + seniorityPct));
      seniorityBonus = Math.max(0, widowPension - baseBeforeSeniority);
    }

    // סה״כ מב״ל לשורה המסכמת: אלמן/ה + יתומים (אם קיימים)
    const monthlyBL = widowPension + orphansPension;

    // אומדן פנסיית זקנה מהקרן (להסבר בלבד)
    const oldAgePensionApprox = Math.round((input.pensionFund || 0) / 200);

    let html = `
  <div class="breakdown-section" dir="rtl">
    <h3 class="breakdown-title">🧮 פירוט חישוב פנסיית ביטוח לאומי – לפי טבלת סכומים רשמית (01.01.2025)</h3>

    <div class="info-card">
      <div><strong>מצב משפחתי:</strong> ${maritalText}</div>
      <div><strong>יש שאירים זכאים:</strong> ${hasSurvivors ? 'כן ✅' : 'לא ❌'}</div>
    </div>
  `;

    if (!hasSurvivors) {
      html += `
      <div class="warn-card">
        <h4>❌ אין זכאות לפנסיית ביטוח לאומי</h4>
        <p><strong>הסיבה:</strong> אין בן/בת זוג זכאי ואין ילדים מתחת לגיל הזכאות.</p>
      </div>
    </div>`;
      return html;
    }

    // קטגוריה (אם יש)
    if (sim.btlCategory) {
      html += `
      <div class="breakdown-subtitle">קטגוריית טבלת ב"ל</div>
      <div class="breakdown-list">
        <div class="breakdown-row">
          <div class="label">קטגוריה:</div>
          <div class="value">${sim.btlCategory}</div>
        </div>
      </div>`;
    }

    // בסיס + ותק (רק לאלמן/ה)
    html += `
    <div class="breakdown-subtitle">בסיס ותוספת ותק</div>
    <div class="breakdown-list">
      <div class="breakdown-row">
        <div class="label">בסיס (לפני ותק) — נגזר מקצבת אלמן/ה:</div>
        <div class="value">${applySeniority ? `${this.fmtPublic(baseBeforeSeniority)}` : '—'}</div>
      </div>
      <div class="breakdown-row">
        <div class="label">תוספת ותק ${applySeniority ? `(${input.yearsInsured} שנים × 2% = ${Math.round(seniorityPct * 100)}%)` : ''}</div>
        <div class="value">${applySeniority ? `${this.fmtPublic(seniorityBonus)}` : '—'}</div>
      </div>
    </div>
  `;

    // פירוט סכומים
    html += `
    <div class="breakdown-subtitle">סכומי קצבה</div>
    <div class="breakdown-list">
      ${widowPension > 0 ? `
      <div class="breakdown-row">
        <div class="label"><strong>קצבת אלמן/ה</strong> (כולל רכיבי ילדים אם משולבים במסלול)</div>
        <div class="value"><strong>${this.fmtPublic(widowPension)}</strong></div>
      </div>` : ''}

      ${orphansPension > 0 ? `
      <div class="breakdown-row">
        <div class="label"><strong>קצבת יתומים</strong> (ללא בן/בת זוג)</div>
        <div class="value"><strong>${this.fmtPublic(orphansPension)}</strong></div>
      </div>
      ${eligibleChildren > 0 ? `
      <div class="breakdown-row">
        <div class="label">חלק משוער לכל ילד (${eligibleChildren} ילדים):</div>
        <div class="value">~${this.fmtPublic(Math.floor(orphansPension / eligibleChildren))}</div>
      </div>` : ''}` : ''}

      <div class="breakdown-row total">
        <div class="label"><strong>סה"כ חודשי מביטוח לאומי (שאירים)</strong></div>
        <div class="value"><strong>${this.fmtPublic(monthlyBL)}</strong></div>
      </div>
    </div>
  `;

    // כרטיס הסבר על חלוקת הקרן (כמו קודם)
    if ((sim.fundPension || 0) > 0 || oldAgePensionApprox > 0) {
      if (input.maritalStatus === 'married') {
        html += `
      <div class="fund-card">
        <h4>💼 חלוקת קרן פנסיה (נשוי/אה)</h4>
        <p>אומדן פנסיית זקנה: ${this.fmtPublic(oldAgePensionApprox)}.</p>
        <p>חלוקה מקובלת: ~60% לבן/בת זוג${eligibleChildren > 0 ? ` + ~40% לילדים (${eligibleChildren})` : ''} (תלוי תקנון).</p>
        <p><strong>שולם כעת לשאירים (הערכה):</strong> ${this.fmtPublic(Math.round(sim.fundPension || 0))} /חודש</p>
      </div>`;
      } else if (['divorced-with-children', 'single-with-children'].includes(input.maritalStatus)) {
        const totalChildShare = Math.round(oldAgePensionApprox * 0.40);
        const perChildFund = (eligibleChildren > 0) ? Math.round(totalChildShare / eligibleChildren) : 0;
        html += `
      <div class="fund-card">
        <h4>💼 חלוקת קרן פנסיה (יתומים בלבד)</h4>
        <p>אומדן פנסיית זקנה: ${this.fmtPublic(oldAgePensionApprox)}.</p>
        <p>זכאות יתומים (הערכה): ~40% = ${this.fmtPublic(totalChildShare)} ${eligibleChildren > 0 ? ` • ~${this.fmtPublic(perChildFund)} ש"ח לכל ילד` : ''}.</p>
        <p><strong>שולם כעת לשאירים (הערכה):</strong> ${this.fmtPublic(Math.round(sim.fundPension || 0))} /חודש</p>
      </div>`;
      }
    }

    html += `</div>`;
    return html;
  }


  private getMaritalStatusText(status: CalcInput['maritalStatus']): string {
    switch (status) {
      case 'married': return 'נשוי/אה';
      case 'single-no-children': return 'רווק/ה ללא ילדים';
      case 'single-with-children': return 'רווק/ה עם ילדים';
      case 'divorced-with-children': return 'גרוש/ה עם ילדים';
      case 'divorced-no-children': return 'גרוש/ה ללא ילדים';
      default: return '—';
    }
  }




  // עוזר קצר ל-notes מנוסחים
  private dashIfEmpty(s: string): string { return s && s.trim() ? s : '—'; }

  /** מעדכן את טבלת "חלוקה לאחר המוות" לפי הפלט של הסימולציה */
  private updateDeathDistributionTable(input: CalcInput, sim: any, months: number, inheritanceForChart: number): void {
    const btlMonthly = Math.round(sim?.breakdown?.btl ?? 0);
    const fundMonthly = Math.round(sim?.breakdown?.fund ?? 0);
    const kidsMonthly = Math.round(sim?.breakdown?.kids ?? 0);

    // ברירת מחדל: אין סכום חד-פעמי בב"ל וילדים; בקרן – ירושה רק כשאין קצבה חודשית
    const lumpBTL = 0;
    const lumpKids = 0;
    const lumpFund = fundMonthly > 0 ? 0 : Math.round(inheritanceForChart || 0);

    // הערות — מנוסחות "כמו במקור"
    const avgWage = 13316; // אם בשירות קיים ערך עדכני – משוך משם במקום מספר קשיח
    const btlParts: string[] = [];
    btlParts.push(`נגזר מהשכר הממוצע במשק (≈ ₪${new Intl.NumberFormat('he-IL').format(avgWage)})`);
    if (input.yearsInsured > 0) btlParts.push(`כולל תוספת ותק אפשרית (2% לשנה, עד 50%)`);
    if (input.maritalStatus === 'married') btlParts.push(`התייחסות לבן/בת זוג לפי הכללים`);
    if ((input.childrenAges?.length || 0) > 0) btlParts.push(`תוספות ילדים לפי טבלת ב״ל`);
    const btlNote = this.dashIfEmpty(btlParts.join(' · '));

    let fundNote = 'קרן מקיפה: תשלום חודשי לשאירים לפי התקנון; לרוב אין ירושה.';
    if (fundMonthly === 0 && lumpFund > 0) {
      fundNote = 'קרן כללית/קופת גמל: אין פנסיית שארים; הצבירה עוברת כמענק חד־פעמי למוטבים/ירושה.';
    }

    const kidsNote = kidsMonthly > 0
      ? 'קצבה ישירה לילדים עד גילי הזכאות (18/21/23/נכות) — אינה חלק מהירושה.'
      : '—';

    // כתיבה ל-state
    this.dd.btl.monthly = btlMonthly;
    this.dd.btl.lump = lumpBTL;
    this.dd.btl.note = btlNote;

    this.dd.fund.monthly = fundMonthly;
    this.dd.fund.lump = lumpFund;
    this.dd.fund.note = fundNote;

    this.dd.children.monthly = kidsMonthly;
    this.dd.children.lump = lumpKids;
    this.dd.children.note = kidsNote;

    this.dd.total.monthly = btlMonthly + fundMonthly + kidsMonthly;
    this.dd.total.lump = lumpBTL + lumpFund + lumpKids;
    const yrs = (months / 12).toFixed(1).replace(/\.0$/, '');
    this.dd.total.note = this.dd.total.monthly > 0
      ? `סה״כ חודשי לשאירים × כ-${yrs} שנים; חד־פעמי ליורשים במקרה של קופה ללא פנסיית שארים.`
      : `אין קצבה חודשית; בדוק זכויות ירושה/מוטבים לפי סוג המכשיר.`;
  }


  /** ---------------- עוזרים ---------------- */
  private scenarioLabelFrom(n: number, fallback?: string): string {
    const sc: any = (SCENARIOS as any)[n];
    return sc?.label || fallback || `תרחיש ${n}`;
  }

  private parseMoney(v: unknown, fallback: number): number {
    if (v == null) return fallback;
    if (typeof v === 'number' && isFinite(v)) return v;
    if (typeof v === 'string') {
      const cleaned = v.replace(/[^\d.]/g, '').replace(/(\..*?)\..*/, '$1');
      return cleaned ? Number(cleaned) : fallback;
    }
    return fallback;
  }

  // עוזר קטן להעריך ירושה לגרף (פשטני: אין קצבה חודשית => ירושה = צבירה)
  private estimateInheritanceForChart(input: CalcInput, sim: SimulationResult): number {
    const monthlyTotal = (sim.breakdown.btl || 0) + (sim.breakdown.fund || 0) + (sim.breakdown.kids || 0);
    return monthlyTotal > 0 ? 0 : (input.pensionFund || 0);
  }


  fmtPublic(n: number): string {
    return new Intl.NumberFormat('he-IL').format(Math.round(n || 0)) + ' ש״ח';
  }

  private eligibleChildrenCount(ages: number[], declaredCount: number): number {
    // פשטני: מתחת לגיל 18. (אם יש לך לוגיקה מפורטת יותר – החלף)
    const e = ages.filter(a => a < 18).length;
    return e > 0 ? e : Math.max(0, declaredCount || 0);
  }

  private computeIndexedFutureValue(monthly: number, months: number): number {
    const r = Math.pow(1 + this.annualIndexRate, 1 / 12) - 1; // ריבית חודשית משוערת
    let fv = 0;
    for (let t = 0; t < months; t++) {
      // תשלום היום צובר עד סוף התקופה
      fv += monthly * Math.pow(1 + r, months - 1 - t);
    }
    return fv;
  }

  private parseAges(v: string | number[] | undefined): number[] {
    if (Array.isArray(v)) return v.map(x => +x).filter(n => !Number.isNaN(n));
    return String(v ?? '')
      .split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !Number.isNaN(n));
  }

  // עוזרים קצרים
  private buildDefaultChildrenAges(parentAge: number, count: number): number[] {
    // כמו המקור: התחלה ב-parentAge-25 ובהפרשים של 3 שנים
    return Array.from({ length: count }, (_, i) =>
      Math.max(1, parentAge - 25 - i * 3)
    );
  }
  private parseChildrenAges(str: string): number[] {
    return (str || '')
      .split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !Number.isNaN(n));
  }

  // --- עדכון גילאי הילדים בעת גרירת הסליידר (1:1 מהלוגיקה במקור) ---
  private updateChildrenAgesFromSlider(newParentAge: number): void {
    if (!this.ageSliderEnabled) return;

    const numChildren = +this.children || 0;
    if (numChildren === 0) {
      this.childrenAges = '';
      this.prevAgeForSlider = newParentAge;
      return;
    }

    const previousAge = this.prevAgeForSlider ?? newParentAge;
    const ageDifference = newParentAge - previousAge;

    let ages = this.parseChildrenAges(this.childrenAges);

    // אם אין גילאים או שהכמות לא תואמת -> ברירת מחדל
    if (ages.length !== numChildren) {
      ages = this.buildDefaultChildrenAges(newParentAge, numChildren);
    } else if (ageDifference !== 0) {
      // הזזה יחסית לכל ילד + מגבלות היגיון (0..newParentAge-15)
      ages = ages.map(a => {
        let next = a + ageDifference;
        next = Math.max(0, next);
        next = Math.min(next, newParentAge - 15);
        return next;
      });
    }

    this.childrenAges = ages.join(',');
    this.prevAgeForSlider = newParentAge;
  }



  // החלף את הפונקציה הקיימת
  private computeInheritanceText(
    status: CalcInput['maritalStatus'],
    fund: number,
    eligibleKids: number,
    totalMonthly: number,
    isDivorceScenario = false,
    divorceLoss = 0
  ): string {
    const fundAmount = Math.round(fund || 0);

    // 1) תרחיש גירושין – אובדן זכויות (אומדן PV פשוט)
    if (isDivorceScenario && divorceLoss > 0) {
      return `⚠️ אובדן זכויות: ${this.fmt(divorceLoss)} ש"ח`;
    }

    // 2) נשוי/ה בלי ילדים זכאים – 40% מה"צבירה" נמחק (לא מהקצבה!)
    if (status === 'married' && (eligibleKids || 0) === 0 && fundAmount > 0) {
      const lost = Math.round(fundAmount * 0.40);
      return `🚨 ${this.fmt(lost)} ש"ח נמחק`;
    }

    // 3) אין קצבה חודשית – כל הצבירה עוברת כיורשה/מענק חד־פעמי
    if ((totalMonthly || 0) <= 0 && fundAmount > 0) {
      return `${this.fmt(fundAmount)} ש"ח`;
    }

    // 4) אחרת: יש תשלום חודשי לשאירים
    return 'לשאירים זכאים';
  }


  private fmt(n: number | string, min = 0, max = 0): string {
    const v = typeof n === 'string' ? Number(n) : n;
    if (!isFinite(v as number)) return '';
    return new Intl.NumberFormat('he-IL', {
      minimumFractionDigits: min,
      maximumFractionDigits: max,
    }).format(v as number);
  }

  onSalaryInput(raw: string): void {
    if (this.isLoadingScenario) return;
    // מסירים כל תו שאינו ספרה (גם הדבקה עם מפרידים)
    const digits = (raw || '').replace(/[^\d]/g, '');
    this.salary = digits ? Number(digits) : 0;

    // מעדכנים את הטקסט המוצג עם מפרידי אלפים
    this.salaryInput = digits ? this.fmt(this.salary) : '';

    // ממשיכים כרגיל – מחשבים מחדש גרפים/תוצאות
    this.recalculateAndRender();
  }

  onPensionFundChange(raw: string): void {
    if (this.isLoadingScenario) return;
    // מסירים כל תו שאינו ספרה (גם הדבקה עם מפרידים)
    const digits = (raw || '').replace(/[^\d]/g, '');
    this.pensionFund = digits ? Number(digits) : 0;

    // מעדכנים את הטקסט המוצג עם מפרידי אלפים
    this.pensionFundInput = digits ? this.fmt(this.pensionFund) : '';

    // ממשיכים כרגיל – מחשבים מחדש גרפים/תוצאות
    this.recalculateAndRender();
  }









  /** בונה קלט מלא לחישוב לפי תרחיש */
  private toInputFromScenario(id: number): CalcInput {
    const sc: any = (SCENARIOS as any)[id] || {};
    const ages = this.parseAges(sc.childrenAges);

    return {
      maritalStatus: sc.status ?? 'single-no-children',
      age: Number(sc.age ?? 35),
      salary: Number(sc.salary ?? 0),
      yearsInsured: Number(sc.yearsInsured ?? 0),
      pensionFund: Number(sc.pensionFund ?? 0),
      children: Number(sc.children ?? 0),
      childrenAges: ages,
      spouseAge: Number(sc.spouseAge ?? 0)
    };
  }

  /** מחשב מחדש את כל 25 השורות */
  recomputeScenarioTable(): void {
    const rows: typeof this.scenarioRows = [];

    for (const id of this.scenarioIds) {
      const input = this.toInputFromScenario(id);
      const sim = this.svc.calculateAllPensionsAdapter(input);

      const eligibleKids = this.eligibleChildrenCount(input.childrenAges, input.children);
      const total = (sim.breakdown.btl || 0) + (sim.breakdown.fund || 0) + (sim.breakdown.kids || 0);

      const sc = (SCENARIOS as any)[id] || {};
      const isDiv = !!sc.isDivorceScenario;

      // חישוב אומדן PV נוכחי
      const currentPV = Math.round(total * (sim.meta?.yearsReceiving || 0) * 12);

      // אם זה תרחיש גירושין – נריץ סימולציית "נשוי" להשוואה
      let divorceLoss = 0;
      if (isDiv) {
        const marriedInput: CalcInput = { ...input, maritalStatus: 'married' };
        const marriedSim = this.svc.calculateAllPensionsAdapter(marriedInput);
        const marriedTotal =
          (marriedSim?.breakdown?.btl || 0) +
          (marriedSim?.breakdown?.fund || 0) +
          (marriedSim?.breakdown?.kids || 0);
        const marriedPV = Math.round(marriedTotal * (marriedSim?.meta?.yearsReceiving || 0) * 12);
        divorceLoss = Math.max(0, marriedPV - currentPV);
      }

      let perChild: string | number = '-';
        if (eligibleKids > 0) {
          // כל החלק של הילדים מתוך הפירוק
          const kidsTotal = sim.breakdown.kids || 0;

          // חלוקה שווה בין כולם (זה המודל הפשוט)
          const perKidAmount = Math.round(kidsTotal / eligibleKids);

          perChild = `${this.fmt(perKidAmount)} ש"ח`;
        }


      // עכשיו נעביר גם totalMonthly וגם הדגל/הפסד גירושין
      rows.push({
        id,
        eligible: total > 0 || (input.pensionFund || 0) > 0,
        btl: Math.round(sim.breakdown.btl || 0),
        fund: Math.round(sim.breakdown.fund || 0),
        kids: Math.round(sim.breakdown.kids || 0),
        total: Math.round(total),
        net: Math.round(this.applySimpleTax(total)), // אם יש לך
        perChild,
        inheritance: this.computeInheritanceText(
          input.maritalStatus, input.pensionFund, eligibleKids, total, isDiv, divorceLoss
        ),
      });
    }

    this.scenarioRows = rows;
  }

    // אומדן מס בסיסי – מדרגה אחת של 10% מעל 6,500 ₪
    /**
   * אומדן מס פשוט: מחזיר סכום נטו חודשי לאחר "מס" לפי מדרגות אומדן.
   * זהו חישוב הדגמה לצרכי השוואה בטבלת התרחישים — לא חישוב מס רשמי.
   */
  applySimpleTax(grossMonthly: number): number {
    const g = Number(grossMonthly) || 0;
    if (g <= 0) return 0;

    let remaining = g;
    let net = g;
    let lastLimit = 0;

    for (const b of SIMPLE_TAX_BRACKETS) {
      const bracketSpan = Math.min(remaining, b.upTo - lastLimit);
      if (bracketSpan > 0) {
        net -= bracketSpan * b.rate;
        remaining -= bracketSpan;
        lastLimit = b.upTo;
      }
      if (remaining <= 0) break;
    }

    // עיגול לש"ח וודא אי-שליליות
    return Math.max(0, Math.round(net));
  }



  /** ===== Helper: בונה אובייקט קלט מהסטייט הנוכחי ===== */
  private buildCalcInput(): CalcInput {
    const kidsAges = (this.childrenAges || '')
      .split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !Number.isNaN(n));

    return {
      maritalStatus: this.maritalStatus,
      age: this.age,
      salary: this.salary,
      yearsInsured: this.yearsInsured,
      pensionFund: this.pensionFund,
      children: this.children,
      childrenAges: kidsAges,
      spouseAge: this.spouseAge
    };
  }

  /** alias כדי להתאים ל-HTML: <button (click)="loadDivorceScenario(13)">... */
  loadDivorceScenario(id: number): void {
    this.selectedDivorceScenarioId = id;
    this.loadScenario(id); // משתמש בפונקציה שקיימת כבר בקומפוננט
  }

  /** כפתורי "גיל מהיר" בסקשן הסליידר */
  setSliderAge(v: number): void {
    this.age = v;
    // אם רוצים לעדכן גם את הסליידר/תצוגה הסטטיים ב-HTML:
    const slider = document.getElementById('ageSlider') as HTMLInputElement | null;
    if (slider) slider.value = String(v);
    const currentAge = document.getElementById('currentAge');
    if (currentAge) currentAge.textContent = String(v);
    this.recalculateAndRender();
  }

  private bumpPending: Record<'updateAgeImpact'|'updateInsights'|'updateComparison', boolean> = {
    updateAgeImpact: false, updateInsights: false, updateComparison: false,
  };


  /** בחירת מצב משפחתי דרך תוויות/radios */
  selectMaritalStatus(status: CalcInput['maritalStatus']): void {
    if (this.isLoadingScenario) return;
    this.maritalStatus = status;
    this.recalculateAndRender();
  }

  /** כפתור "חשב פנסיית שאירים" */
  calculatePension(): void {
    this.recalculateAndRender();
  }

  /** ===== אזור יצירת פרומפט AI ===== */
  private lastGeneratedPrompt = '';

  generateAIPrompt(): void {
    // מחשב סימולציה עדכנית כדי לשלב מספרים בפרומפט
    const input = this.buildCalcInput();
    const sim = this.svc.calculateAllPensionsAdapter(input);

    const pretty = (n: number) => new Intl.NumberFormat('he-IL').format(Math.round(n));
    const totalMonthly =
      (sim?.breakdown?.btl || 0) + (sim?.breakdown?.fund || 0) + (sim?.breakdown?.kids || 0);

    this.lastGeneratedPrompt =
      `את/ה פועל/ת כיועץ/ת פיננסי/ת מומחה/ית. נתח/י והצע/י תכנית פעולה.
נתוני לקוח:
• מצב משפחתי: ${input.maritalStatus}
• גיל פטירה בסימולציה: ${input.age}
• גיל/ת זוג: ${input.spouseAge ?? '—'}
• שכר חודשי: ${pretty(input.salary)} ₪
• שנות ביטוח: ${input.yearsInsured}
• צבירה בקרן פנסיה: ${pretty(input.pensionFund)} ₪
• ילדים: ${input.children} (גילים: ${this.childrenAges || '—'})

תוצאות חישוב נוכחיות (אמדן):
• ביטוח לאומי לשאירים: ${pretty(sim.breakdown.btl)} ₪
• פנסיית קרן לשאירים: ${pretty(sim.breakdown.fund)} ₪
• רכיב ילדים: ${pretty(sim.breakdown.kids)} ₪
• סה״כ חודשי: ${pretty(totalMonthly)} ₪

מטרות:
1) לאשר זכאויות, תוספות ותק/יתמות, ומיסוי.
2) להמליץ על צעדים פרקטיים (עדכון מוטבים, ביטוח חיים, תכנון מס/פרישה).
3) להציג תרחישים חלופיים (גיל פטירה/מספר ילדים/שכר).
השב/י בעברית תמציתית עם סעיפים.`;

    // מציגים את האזור בדף (לפי ה-HTML המקורי שמשתמש ב-id קיים)
    const box = document.getElementById('ai-prompt-result');
    const target = document.getElementById('generated-prompt');
    if (box && target) {
      target.textContent = this.lastGeneratedPrompt;
      (box as HTMLElement).style.display = 'block';
    }
  }

  copyPromptToClipboard(): void {
    const text = this.lastGeneratedPrompt || '';
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  }

  downloadPrompt(): void {
    const blob = new Blob([this.lastGeneratedPrompt || ''], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-prompt.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  closeAIPrompt(): void {
    const box = document.getElementById('ai-prompt-result');
    if (box) (box as HTMLElement).style.display = 'none';
  }

  /** ---------------- טעינת תרחיש + סימון נבחר ---------------- */
  loadScenario(n: number, label?: string) {
    const sc: any = (SCENARIOS as any)[n];
    if (!sc) return;

    this.isLoadingScenario = true;

    // סימון נבחר
    this.selectedScenarioId = n;
    this.selectedScenarioLabel = this.scenarioLabelFrom(n, label);

    // מיפוי 1:1 משדות התרחיש ל-state
    this.maritalStatus = sc.status ?? this.maritalStatus;
    this.age = Number(sc.age ?? this.age);
    this.spouseAge = Number(sc.spouseAge ?? this.spouseAge);
    this.salary = this.parseMoney(sc.salary, this.salary);
    this.yearsInsured = Number(sc.yearsInsured ?? this.yearsInsured);
    this.pensionFund = this.parseMoney(sc.pensionFund, this.pensionFund);
    this.children = Number(sc.children ?? 0);

    // גילאי ילדים — מקבלים גם מערך וגם מחרוזת
    if (Array.isArray(sc.childrenAges)) {
      this.childrenAges = sc.childrenAges.join(', ');
    } else if (typeof sc.childrenAges === 'string') {
      this.childrenAges = sc.childrenAges;
    } else {
      this.childrenAges = '';
    }

    // (לא חובה) אם יש לך שדות תצוגה formatted ל-inputs – עדכן אותם
    if ((this as any).salaryInput !== undefined) {
      (this as any).salaryInput = new Intl.NumberFormat('he-IL').format(this.salary);
    }
    if ((this as any).pensionFundInput !== undefined) {
      (this as any).pensionFundInput = new Intl.NumberFormat('he-IL').format(this.pensionFund);
    }

    // חישוב ורענון
    this.recalculateAndRender();
    
    const sim = this.svc.calculateAllPensionsAdapter(this.input);
    this.refreshSummaryFromSim(sim, this.input);

    this.isLoadingScenario = false;
  }

  // מחשב את האחוז מהמסילה כדי למקם את התוויות
  tickLeftPct(val: number): number {
    return ((val - this.ageMin) / (this.ageMax - this.ageMin)) * 100;
  }

  private computeIndexedFutureValueFromSeries(series: number[]): number {
    // FV של זרם חודשי, עם הצמדה אפקטיבית חודשית (נגזרת מ-2% שנתי)
    const r = Math.pow(1 + this.annualIndexRate, 1 / 12) - 1;
    const n = series.length;
    let fv = 0;
    for (let t = 0; t < n; t++) {
      fv += (series[t] || 0) * Math.pow(1 + r, n - 1 - t);
    }
    return fv;
  }

  // --- בוני הסברים מפורטים ---

  private buildMonthlyPensionExplanation(input: CalcInput, eligibleKids: number): string {
    // לפי ההיגיון מהמקור: בסיס ב"ל + תוספות בן/בת זוג/ילדים + ותק
    // מספרי ב"ל לדוגמה (התאם לערכים שאתה משתמש בשירות):
    const avgWage = 13316; // שכר ממוצע במשק 2025 (מהמקור)
    const basePct = 28;    // 28% בסיס
    const base = Math.round(avgWage * basePct / 100);

    const hasSpouse = input.maritalStatus === 'married';
    const parts: string[] = [];
    parts.push(`בסיס: ${basePct}% × ₪${new Intl.NumberFormat('he-IL').format(avgWage)} = ${this.fmtPublic(base)}`);
    if (hasSpouse) parts.push(`תוספות בן/בת זוג לפי מצב (ילדים/גיל)`);
    if (eligibleKids > 0) parts.push(`תוספות ילדים (${eligibleKids}) לפי טבלת ב"ל`);
    if (input.yearsInsured > 0) parts.push(`תוספת ותק: 2% לשנה, עד 50% (שנות ביטוח: ${input.yearsInsured})`);

    return `סטטוס: ${input.maritalStatus}, גיל: ${input.age}. ` + parts.join(' · ');
  }

  private buildFundPensionExplanation(input: CalcInput): string {
    // אומדן כללי מקובל: צבירה / 200; אם בשירות כבר מחושב אחרת, הסבר יתעדכן מהשירות
    const est = Math.round((input.pensionFund || 0) / 200);
    return `אומדן קצבת קרן: צבירה ÷ 200 ≈ ${this.fmtPublic(est)} · צבירה נוכחית: ${this.fmtPublic(input.pensionFund)} · התקנון עשוי להשפיע (מקיפה/כללית).`;
  }

  private buildChildrenPensionExplanation(eligibleKids: number): string {
    // לפי המקור: יתום יחיד ~1,115₪; כל ילד נוסף ~842₪; יתום משני הורים ~2,230₪ לכל ילד
    if (eligibleKids <= 0) return 'אין ילדים זכאים לפי הגיל/סטטוס.';
    const tip = `יתום יחיד ≈ 1,115₪ · כל ילד נוסף ≈ 842₪ · יתום משני הורים ≈ 2,230₪ לילד.`;
    return `מס׳ ילדים זכאים: ${eligibleKids}. ${tip}`;
  }

  private buildTotalsExplanation(months: number, usedSeries: boolean): { total: string; future: string } {
    const yrs = (months / 12).toFixed(1).replace(/\.0$/, '');
    const total = usedSeries
      ? `סכימת כל התשלומים החודשיים האמיתיים לאורך כ-${yrs} שנים (ללא היוון).`
      : `אומדן: תשלום חודשי קבוע לאורך כ-${yrs} שנים (ללא היוון).`;

    const rMonthly = (Math.pow(1 + this.annualIndexRate, 1 / 12) - 1) * 100;
    const future = usedSeries
      ? `אותם תשלומים (לפי סדרה משתנה) עם הצמדה חודשית שקולה ~${rMonthly.toFixed(3)}% (${Math.round(this.annualIndexRate * 100)}% שנתי), לתקופה של כ-${yrs} שנים.`
      : `אותו תשלום חודשי קבוע עם הצמדה חודשית שקולה ~${rMonthly.toFixed(3)}% (${Math.round(this.annualIndexRate * 100)}% שנתי), לתקופה של כ-${yrs} שנים.`;

    return { total, future };
  }

  recalculateAndRender(): void {
    // --- 1) פירוק קלטים ---
    const kidsAges = (this.childrenAges || '')
      .split(',')
      .map(s => parseInt(s.trim(), 10))
      .filter(n => !Number.isNaN(n));

    const input: CalcInput = {
      maritalStatus: this.maritalStatus,
      age: this.age,
      spouseAge: this.spouseAge,
      salary: this.salary,
      yearsInsured: this.yearsInsured,
      pensionFund: this.pensionFund,
      children: this.children,
      childrenAges: kidsAges
    };

    // --- 2) סימולציה עיקרית (מתאם לשירות/לוגיקה מקורית) ---
    const sim = this.svc.calculateAllPensionsAdapter(input);

    // --- 3) גרפים ---
    this.svc.updateAgeImpactSeries(
      this.ageImpactOptions,
      sim.monthlySeries,
      sim.cumulativeSeries,
      sim.labels.map(Number),   // ← להבטיח number[]
      this.age,
      // אופציונלי: קונפיג טווחים משלך
      { critical: [20, 32], optimal: [32, 58], retire: [67, 85] }
    );


const ageImpact = this.svc.computeAgeImpactSeries({
  baseAge: this.age,
  maritalStatus: this.maritalStatus,
  age: this.age,
  salary: this.salary,
  yearsInsured: this.yearsInsured,
  pensionFund: this.pensionFund,
  children: this.children,
  childrenAges: kidsAges,
  spouseAge: this.spouseAge,
  monthlyContribution: Number(this.monthlyContribution) || 0,
  annualFeePct: Number(this.annualFee) || 0,
  avgAnnualReturnPct: Number(this.avgAnnualReturn) || 0
});

    // ממלאים את ה־options ומעדכנים את הקו האנכי של “גיל נוכחי”
    this.svc.updateAgeImpactSeries(
      this.ageImpactOptions,
      ageImpact.monthly,
      ageImpact.cumulative,
      ageImpact.labels,
      this.age
    );
    this.bump('updateAgeImpact');

    // “תובנות” — אם קיים ב־Service
    this.svc.updateInsightsSeries?.(
      this.insightsOptions,
      sim.labels,
      sim.cumulativeSeries
    );
    this.bump('updateInsights');

    // דונאט השוואתי: אם אין זרם חודשי — הראה ירושה (צבירה)
    const monthlyTotal =
      (sim.breakdown.btl || 0) + (sim.breakdown.fund || 0) + (sim.breakdown.kids || 0);
    const inheritanceForChart = monthlyTotal > 0 ? 0 : (input.pensionFund || 0);

    this.svc.updateComparisonChartSeries?.(
      this.comparisonOptions,
      sim.breakdown.btl || 0,
      sim.breakdown.fund || 0,
      sim.breakdown.kids || 0,
      inheritanceForChart
    );
    this.bump('updateComparison');

    // --- 4) מדדים מספריים ---
    this.monthlyPension = Math.round(sim.breakdown.btl || 0);
    this.fundPension = Math.round(sim.breakdown.fund || 0);
    this.childrenPension = Math.round(sim.breakdown.kids || 0);



    // 7) עדכון "השאירים" בלוח הזרימה + פולס אנימציה (אם רלוונטי)
    this.totalMonthly =
      Math.round((sim?.breakdown?.btl || 0) + (sim?.breakdown?.kids || 0) + (sim?.breakdown?.fund || 0));
    this.flowPulse = this.totalMonthly > 0;
    this.flowTick = (this.flowTick || 0) + 1;



    // ילדים זכאים בפועל (לכרטיס "כל ילד מקבל")
    const eligibleKids =
      sim?.meta?.eligibleChildren ??
      this.eligibleChildrenCount(input.childrenAges, input.children);

    this.perChildAmount =
      (eligibleKids > 0 && this.childrenPension > 0)
        ? Math.round(this.childrenPension / eligibleKids)
        : null;

    // כמה זמן מקבלים? העדפה לערכים "חיים" אם קיימים; אחרת חישוב שירות/ברירת-מחדל
    const yearsReceiving =
      sim?.meta?.yearsReceiving ??
      calculateYearsReceiving(input.age, {
        currentMaritalStatus: input.maritalStatus,
        spouseAge: input.spouseAge,
        childrenAges: input.childrenAges
      });

    // מספר חודשי תשלום:
    const months =
      Array.isArray(sim.cumulativeSeries) && sim.cumulativeSeries.length > 0
        ? sim.cumulativeSeries.length
        : Math.max(0, Math.round((yearsReceiving || this.horizonYears) * 12));

    // סכום מצטבר: אם קיימת סדרה מצטברת — קח את האחרון; אחרת אומדן “חודשי קבוע × חודשים”
    const usedSeries =
      Array.isArray(sim.cumulativeSeries) && sim.cumulativeSeries.length > 0;

    this.totalValue = usedSeries
      ? sim.cumulativeSeries[sim.cumulativeSeries.length - 1]
      : monthlyTotal * months;

    // ערך עתידי עם הצמדה: אם יש סדרת תשלומים חודשית — השתמש בה; אחרת חודשי קבוע
    if (Array.isArray(sim.monthlySeries) && sim.monthlySeries.length > 0) {
      this.futureValue = this.computeIndexedFutureValueFromSeries(sim.monthlySeries);
    } else {
      this.futureValue = this.computeIndexedFutureValue(monthlyTotal, months);
    }

    // ירושה חד־פעמית: רק כשאין קצבה חודשית לשאירים
    this.inheritanceValue = monthlyTotal > 0 ? 0 : (input.pensionFund || 0);

    // --- 5) טקסטי הסבר מפורטים (כמו במקור) ---
    this.monthlyPensionExplanation = this.buildMonthlyPensionExplanation(input, eligibleKids);
    this.fundPensionExplanation = this.buildFundPensionExplanation(input);
    this.childrenPensionExplanation = this.buildChildrenPensionExplanation(eligibleKids);

    const totalsExpl = this.buildTotalsExplanation(months, usedSeries);

    const agesArr =
    Array.isArray(this.childrenAges)
      ? (this.childrenAges as number[])
      : this.parseChildrenAges(String(this.childrenAges ?? ''));
  
    const yrsFull = calculateYearsReceiving(this.age, {
      currentMaritalStatus: this.maritalStatus,
      spouseAge: this.spouseAge,
      childrenAges: agesArr,
    });

    this.totalValueExplanation  = `ערך כל התשלומים לאורך ${Math.round(yrsFull)} שנים ללא היוון`;
    this.futureValueExplanation = `ערך עם הצמדה למדד 2% שנתי לאורך ${Math.round(yrsFull)} שנים`;

    this.inheritanceExplanation =
      this.inheritanceValue > 0
        ? 'אין קצבה חודשית לשאירים; הצבירה משולמת כמענק חד־פעמי לפי מוטבים/ירושה.'
        : '';

    if (this.perChildAmount !== null) {
      this.perChildExplanation = `חלוקה שווה בין ${eligibleKids} ילדים זכאים.`;
    } else {
      this.perChildExplanation = '';
    }

    // לפני בלוק ה-breakdown
    const btlCat = sim?.meta?.category ?? '';
    const lost = this.estimateLostAmount(input, sim?.meta?.eligibleChildren ?? 0);

    // ילדים לפירוט: רק כשאין בן/בת זוג (במקור יתומים משולמים ישירות רק אז)
    const childrenForBreakdown =
      this.maritalStatus === 'married' ? 0 : this.childrenPension;

    // --- 6) פירוט חישוב עשיר (HTML) לתיבת breakdown ---
    this.survivorsBreakdownHtml = this.buildSurvivorsBreakdownHtml(
      {
        monthlyPension: this.monthlyPension,
        childrenPension: childrenForBreakdown,
        fundPension: this.fundPension,
        btlCategory: btlCat,
        lostAmount: lost
      },
      input
    );

    // 6) פירוט חלוקת מוטבים – HTML מלא ל-[innerHTML]
    this.renderBeneficiarySplit(sim, input);


    // --- 7) טבלת "שאירים (חודשי) מול יורשים (חד־פעמי)" ---
    this.updateDeathDistributionTable(input, sim, months, inheritanceForChart);

    this.refreshSummaryFromSim(sim, this.input);

  }

  private estimateLostAmount(input: CalcInput, eligibleKids: number): number {
    if (input.maritalStatus !== 'married' || eligibleKids > 0) return 0;
    const fundAmount = Math.max(0, Number(input.pensionFund || 0));
    return Math.round(fundAmount * 0.40);
  }

  /** מייצר HTML מפורט של חלוקת מוטבים: "בפועל" + פירוק אנליטי של ב"ל (בסיס/וותק) */
private computeBeneficiarySplitHtml(sim: {
  monthlyPension?: number;   // BTL: אלמן/ה
  childrenPension?: number;  // BTL: ילדים
  fundPension?: number;      // קרן פנסיה לשאירים (אם חישבת)
}, input: CalcInput): string {

  const kids = Math.max(0, Number(this.eligibleChildrenCount(input.childrenAges, input.children)));
  const status = String(input.maritalStatus || '');
  const childOnlyStatuses = ['divorced-with-children', 'single-with-children'];
  const isChildOnly = childOnlyStatuses.includes(status);

  // אומדן "פנסיית זקנה" מהקרן (צבירה/200)
  const pf = Number(input.pensionFund || 0);
  const oldAge = pf / 200;

  // ותק: 2% לשנה עד 50% (להעדיף getSeniorityPercent מהשירות אם קיים)
  const yearsInsured = Number(input.yearsInsured || 0);
  const senPct = Math.max(0, Math.min(0.5, getSeniorityPercent?.(yearsInsured) ?? (yearsInsured * 0.02)));

  // BTL – פירוק בסיס/וותק לאלמן/ה
  const widowPension = Math.round(sim.monthlyPension || 0);
  const spouseHasSeniority = (status === 'married') && widowPension > 0;
  const blSpouseBase = spouseHasSeniority ? Math.round(widowPension / (1 + senPct)) : (status === 'married' ? widowPension : 0);
  const blSpouseSen  = spouseHasSeniority ? Math.max(0, widowPension - blSpouseBase) : 0;
  const blSpouseTotal = blSpouseBase + blSpouseSen;

  // לייבלים לילדים
  const labels = (input.childrenAges ?? []).length === kids
    ? (input.childrenAges as number[]).slice(0, kids).map((age, i) => `ילד ${i+1} (${age})`)
    : Array.from({ length: kids }, (_, i) => `ילד ${i + 1}`);

  // כלל "יתמות משני הורים" (לפי הכלל שציינת: ילדים ללא אלמן/ה)
  const isDoubleOrphan = isChildOnly;

  // פונקציית BTL לילד בודד (בסיס + ותק)
  const childBL = (idx: number) => {
    if (isDoubleOrphan) {
      const base = 2230;
      const sen  = Math.round(base * senPct);
      return { base, sen, total: base + sen };
    }
    const base = (kids === 1 ? 1115 : 842);
    const sen  = Math.round(base * senPct);
    return { base, sen, total: base + sen };
  };

  // חלוקת קרן פנסיה "בפועל" (כלל מקובל — יתכנו הבדלים בתקנונים)
  let fundSpouse = 0, fundPerChild = 0;
  if (status === 'married') {
    fundSpouse = Math.round(oldAge * 0.60);
    fundPerChild = Math.round(oldAge * 0.20);
  } else if (isChildOnly) {
    // ~40% מתחלקים בין הילדים (אם אין ילדים – 0)
    const totalChildShare = Math.round(oldAge * 0.40);
    fundSpouse = 0;
    fundPerChild = kids > 0 ? Math.round(totalChildShare / kids) : 0;
  }

  // טבלת "בפועל"
  let sumBLBase = blSpouseBase;
  let sumBLSen  = blSpouseSen;
  let sumFund   = fundSpouse;

  let actualRows = `
    <tr>
      <td class="beneficiary">אלמן/ה</td>
      <td class="num">${this.fmtPublic(blSpouseBase)}</td>
      <td class="num">${this.fmtPublic(blSpouseSen)}</td>
      <td class="num">${this.fmtPublic(fundSpouse)}</td>
      <td class="num"><strong>${this.fmtPublic(blSpouseTotal + fundSpouse)}</strong></td>
    </tr>
  `;

  for (let i = 0; i < kids; i++) {
    const c = childBL(i);
    sumBLBase += c.base;
    sumBLSen  += c.sen;
    sumFund   += fundPerChild;

    actualRows += `
      <tr>
        <td class="beneficiary">${labels[i] || `ילד ${i + 1}`}</td>
        <td class="num">${this.fmtPublic(c.base)}</td>
        <td class="num">${this.fmtPublic(c.sen)}</td>
        <td class="num">${this.fmtPublic(fundPerChild)}</td>
        <td class="num"><strong>${this.fmtPublic(c.total + fundPerChild)}</strong></td>
      </tr>
    `;
  }

  // טבלת אנליטית (ב"ל בלבד)
  const analyticSpouse = (status === 'married' || widowPension > 0) ? `
    <tr>
      <td class="beneficiary">אלמן/ה</td>
      <td class="num">${this.fmtPublic(blSpouseBase)}</td>
      <td class="num">${this.fmtPublic(blSpouseSen)}</td>
      <td class="num"><strong>${this.fmtPublic(blSpouseBase + blSpouseSen)}</strong></td>
    </tr>` : '';

  let analyticKids = '';
  for (let i = 0; i < kids; i++) {
    const c = childBL(i);
    analyticKids += `
      <tr>
        <td class="beneficiary">${labels[i] || `ילד ${i + 1}`}</td>
        <td class="num">${this.fmtPublic(c.base)}</td>
        <td class="num">${this.fmtPublic(c.sen)}</td>
        <td class="num"><strong>${this.fmtPublic(c.base + c.sen)}</strong></td>
      </tr>`;
  }

  const analyticBaseSum = Math.round(sumBLBase);
  const analyticSenSum  = Math.round(sumBLSen);
  const analyticTotalBL = analyticBaseSum + analyticSenSum;

  return `
    <div class="bene-grid">
      <!-- בפועל -->
      <div class="section-card">
        <div class="section-header">
          <h3>חלוקה לפי מוטבים – בפועל 👥</h3>
        </div>
        <table class="pro-table">
          <thead>
            <tr>
              <th>מוטב</th>
              <th>ב"ל – בסיס</th>
              <th>ב"ל – ותק</th>
              <th>קרן פנסיה</th>
              <th>סה"כ</th>
            </tr>
          </thead>
          <tbody>${actualRows}</tbody>
          <tfoot>
            <tr>
              <td>סיכום</td>
              <td class="num">${this.fmtPublic(analyticBaseSum)}</td>
              <td class="num">${this.fmtPublic(analyticSenSum)}</td>
              <td class="num">${this.fmtPublic(Math.round(sumFund))}</td>
              <td class="num"><strong>${this.fmtPublic(Math.round(analyticTotalBL + sumFund))}</strong></td>
            </tr>
          </tfoot>
        </table>
        <div class="note">בביטוח לאומי, במצב "אלמן/ה" – התשלום בפועל לאלמן/ה; הפירוק לבסיס/וותק הוא לשקיפות.</div>
      </div>

      <!-- אנליטי -->
      <div class="section-card">
        <div class="section-header">
          <h3>פירוק אנליטי של ביטוח לאומי 🔎</h3>
          <span class="section-sub">(להמחשה בלבד)</span>
        </div>
        <table class="pro-table">
          <thead>
            <tr>
              <th>מוטב</th>
              <th>בסיס (לפני ותק)</th>
              <th>תוספת ותק</th>
              <th>סה"כ (ב"ל)</th>
            </tr>
          </thead>
          <tbody>
            ${analyticSpouse}
            ${analyticKids}
          </tbody>
          <tfoot>
            <tr>
              <td>סיכום</td>
              <td class="num">${this.fmtPublic(analyticBaseSum)}</td>
              <td class="num">${this.fmtPublic(analyticSenSum)}</td>
              <td class="num"><strong>${this.fmtPublic(analyticTotalBL)}</strong></td>
            </tr>
          </tfoot>
        </table>
        <div class="note">וותק לילדים מחושב פר־ילד מול בסיס (2,230 ביתמות משני הורים; אחרת 1,115/842 לפי מספר הילדים).</div>
      </div>
    </div>
  `;
}

/** מרנדר לתוך ה־state ומפעיל את ה־binding ב־HTML */
private renderBeneficiarySplit(sim: any, input: CalcInput): void {
  this.BeneficiarySplitHtml = this.computeBeneficiarySplitHtml(sim ?? {}, input);
}



  // מאזיני UI
  onAgeChange(v: number): void {
    if (this.isLoadingScenario) return;
    this.age = +v;
    this.updateChildrenAgesFromSlider(this.age);  // ⬅️ כאן הקסם
    this.recalculateAndRender();
  }

  onInputChange() { 
    if (this.isLoadingScenario) return;
    this.recalculateAndRender(); }


}
