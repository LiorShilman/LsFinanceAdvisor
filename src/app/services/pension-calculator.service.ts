import { Injectable } from '@angular/core';
import * as Highcharts from 'highcharts';

  // 🎨 פלטת צבעים לשימוש בגרף
  const AGE_IMPACT_PALETTE = {
    monthly: '#60a5fa',      // אזור חודשי (כחול)
    cumulative: '#22c55e',   // קו ערך כולל (ירוק)
    bandCritical: 'rgba(239,68,68,.06)',
    bandOptimal:  'rgba(16,185,129,.06)',
    bandRetire:   'rgba(245,158,11,.06)'
  };

  
/** ===== Types ===== */
export type MaritalStatus =
  | 'married'
  | 'single-no-children'
  | 'single-with-children'
  | 'divorced-with-children'
  | 'divorced-no-children';

export interface CalcInput {
  maritalStatus: MaritalStatus;
  age: number;
  salary: number;
  yearsInsured: number;
  pensionFund: number;
  children: number;
  childrenAges: number[];
  spouseAge?: number; // בשדה זה השתמשות טבלאות אלמן/ה
}

export interface SimulationResult {
  labels: (string|number)[];
  monthlySeries: number[];
  cumulativeSeries: number[];
  breakdown: { btl: number; fund: number; kids: number; };
  meta?: {
    eligibleChildren: number;
    doubleOrphan: boolean;
    category: string;
    yearsReceiving: number;
  };
}

/** ===== Constants (copied from your main.js) ===== */
export const AVERAGE_WAGE_2025 = 13316; // השכר הממוצע במשק – 2025

// === BTL Survivors fixed table (as of 01.01.2025) ===
export const BTL_SURVIVOR_TABLE_2025 = {
  widowWidower: {
    noChildren: {
      age40to49: 1348,   // אלמן/ה בגיל 50–40 בלי ילדים
      age50plus: 1795,   // אלמן/ה בגיל 50+ בלי ילדים
      age80plus: 1896    // אלמן/ה בגיל 80+ בלי ילדים
    },
    withChildren: {
      oneChild: 2637,    // אלמן/ה עם ילד אחד
      twoChildren: 3479, // אלמן/ה עם שני ילדים
      perAdditional: 842 // לכל ילד נוסף
    }
  },
  orphansOnly: {
    singleOrphan: 1115,       // יתום יחיד כשאין הורה זכאי
    perChildMulti: 842,       // לכל ילד כשיש יותר מילד אחד
    doubleOrphanPerChild: 2230 // יתום משני הורים (לכל ילד) – אם רלוונטי
  }
} as const;

/** ===== Utility / Business functions (ported) ===== */
// === Helpers ported from main.js ===
export function hasEligibleChildren(childrenAges: number[], childrenCount: number): boolean {
  if (childrenAges && childrenAges.length > 0) {
    return childrenAges.some(age => age < 18);
  }
  return (childrenCount || 0) > 0;
}

export function hasEligibleSurvivorsTS(status: MaritalStatus, childrenAges: number[], childrenCount: number): boolean {
  if (status === 'married') return true;
  if (status === 'divorced-with-children' || status === 'single-with-children') {
    return hasEligibleChildren(childrenAges || [], childrenCount || 0);
  }
  return false;
}

export function calculateYearsToReceiveTS(status: MaritalStatus, spouseAge: number | undefined, childrenAges: number[], childrenCount: number): number {
  if (status === 'married') {
    const sp = typeof spouseAge === 'number' ? spouseAge : 42; // ברירת מחדל אם אין שדה קלט
    return Math.max(0, 85 - sp);
  } else if (hasEligibleChildren(childrenAges || [], childrenCount || 0)) {
    if (childrenAges && childrenAges.length > 0) {
      const youngest = Math.min(...childrenAges);
      return Math.max(0, 18 - youngest);
    }
    return 10; // הערכה כמו במקור
  }
  return 0;
}


export function getEligibleChildrenCount(childrenAges: number[], childrenCountFallback: number): number {
  if (childrenAges && childrenAges.length > 0) {
    return childrenAges.filter(a => a < 18).length;
  }
  return childrenCountFallback;
}

export function getSeniorityPercent(yearsInsured: number): number {
  const p = Math.max(0, Math.min(yearsInsured * 0.02, 0.50));
  return p;
}

export function inferDoubleOrphanFromStatus(status: MaritalStatus | string): boolean {
  const s = String(status || '').toLowerCase().trim();
  return s === 'divorced-with-children' || s === 'single-with-children';
}

export function resolveDoubleOrphan(status: MaritalStatus | string): boolean {
  // אם קיימת סימון גלובלי באפליקציה המקורית – לא קיים באנגולר, נשען על האינפרנס
  return inferDoubleOrphanFromStatus(status);
}

/** טבלת אלמן/ה – מחזיר סכום וקטגוריה בהתאם לגיל/ילדים */
export function getWidowAmountFromTable(spouseAge: number, eligibleChildrenCount: number): { amount: number; category: string } {
  if (eligibleChildrenCount > 0) {
    const { oneChild, twoChildren, perAdditional } = BTL_SURVIVOR_TABLE_2025.widowWidower.withChildren;
    if (eligibleChildrenCount === 1) return { amount: oneChild, category: 'אלמן/ה עם ילד אחד' };
    if (eligibleChildrenCount === 2) return { amount: twoChildren, category: 'אלמן/ה עם שני ילדים' };
    const base = twoChildren + (eligibleChildrenCount - 2) * perAdditional;
    return { amount: base, category: `אלמן/ה עם ${eligibleChildrenCount} ילדים (כולל ${perAdditional} ₪ לכל ילד נוסף)` };
  }
  // בלי ילדים – לפי גיל בן/בת הזוג
  const a80 = BTL_SURVIVOR_TABLE_2025.widowWidower.noChildren.age80plus;
  const a50 = BTL_SURVIVOR_TABLE_2025.widowWidower.noChildren.age50plus;
  const a40 = BTL_SURVIVOR_TABLE_2025.widowWidower.noChildren.age40to49;
  if (spouseAge >= 80) return { amount: a80, category: 'אלמן/ה בלי ילדים (80+)' };
  if (spouseAge >= 50) return { amount: a50, category: 'אלמן/ה בלי ילדים (50+)' };
  return { amount: a40, category: 'אלמן/ה בלי ילדים (50–40)' };
}

/** טבלת יתומים – מחזיר סכום וקטגוריה בהתאם למספר הילדים וזכאות יתום כפול */
export function getOrphansAmount(eligibleChildrenCount: number, doubleOrphan = false): { amount: number; category: string } {
  if (eligibleChildrenCount <= 0) return { amount: 0, category: 'אין יתומים זכאים' };
  if (doubleOrphan) {
    return {
      amount: eligibleChildrenCount * BTL_SURVIVOR_TABLE_2025.orphansOnly.doubleOrphanPerChild,
      category: `יתומים משני הורים (${eligibleChildrenCount} ילדים)`
    };
  }
  if (eligibleChildrenCount === 1) {
    return { amount: BTL_SURVIVOR_TABLE_2025.orphansOnly.singleOrphan, category: 'יתום יחיד כשאין הורה זכאי' };
  }
  return {
    amount: eligibleChildrenCount * BTL_SURVIVOR_TABLE_2025.orphansOnly.perChildMulti,
    category: `יתומים (${eligibleChildrenCount} ילדים, ${BTL_SURVIVOR_TABLE_2025.orphansOnly.perChildMulti} ₪ לכל ילד)`
  };
}

/** שנות קבלה משוערות – תוחלת פשוטה: בן/בת הזוג עד 85, ילדים עד גיל 23 (צעיר) */
export function calculateYearsReceiving(ageAtDeath: number, formData: { currentMaritalStatus: MaritalStatus; spouseAge?: number; childrenAges: number[] }): number {
  const { currentMaritalStatus, spouseAge = 42, childrenAges } = formData;

  const eligibleChildren = getEligibleChildrenCount(childrenAges, childrenAges?.length ?? 0);
  if (currentMaritalStatus !== 'married' && eligibleChildren === 0) {
    return 0;
  }

  if (currentMaritalStatus === 'married') {
    const spouseYears = Math.max(0, 85 - spouseAge);
    const childrenYears = eligibleChildren > 0
      ? Math.max(...childrenAges.map(c => Math.max(0, 23 - c)))
      : 0;
    return Math.max(spouseYears, childrenYears);
  }

  if (eligibleChildren > 0) {
    return Math.max(...childrenAges.map(c => Math.max(0, 23 - c)));
  }

  return 0;
}

// ==== הקרנת צבירה (נטו) עם/בלי הפקדות, חישוב חודשי ====
export function projectFundBalanceTS(
  currentFund: number,
  baseAge: number,
  targetAge: number,
  netAnnual: number,          // לדוגמה: (avgAnnualReturn - annualFee)/100
  monthly: number             // הפקדה חודשית (₪)
): number {
  const years = Math.max(0, Math.round(targetAge - baseAge));
  if (years === 0) return Math.round(currentFund);

  if (!monthly || monthly <= 0) {
    // בלי הפקדות - ריבית שנתית נטו
    return Math.round(currentFund * Math.pow(1 + netAnnual, years));
  }

  // עם הפקדות - ריבית חודשית נטו
  const i = netAnnual / 12;
  const n = years * 12;
  const fvPrincipal = currentFund * Math.pow(1 + i, n);
  const fvContrib   = (i === 0) ? (monthly * n) : (monthly * ((Math.pow(1 + i, n) - 1) / i));
  return Math.round(fvPrincipal + fvContrib);
}

// ==== סימולציית השפעת גיל המוות (20→85, צעד=2) ====
export interface AgeImpactInput extends CalcInput {
  baseAge: number;            // גיל “היום” בטופס
  monthlyContribution: number;
  annualFeePct: number;       // לדוגמה 1 => 1%
  avgAnnualReturnPct: number; // לדוגמה 5 => 5%
  minAge?: number;            // ברירת מחדל 20
  maxAge?: number;            // ברירת מחדל 85
  step?: number;              // ברירת מחדל 2
}

export interface AgeImpactSeries {
  labels: number[];           // גילאים
  monthly: number[];          // ₪ לחודש
  cumulative: number[];       // אלפי ₪ (לתצוגה בציר ימין)
}


/** ===== Highcharts base options ===== */
@Injectable({ providedIn: 'root' })
export class PensionCalculatorService {

  computeAgeImpactSeries(input: AgeImpactInput): AgeImpactSeries {
    const minAge = input.minAge ?? 20;
    const maxAge = input.maxAge ?? 85;
    const step   = input.step   ?? 2;
  
    const labels: number[] = [];
    const monthly: number[] = [];
    const cumulativeK: number[] = [];
  
    const net = ((input.avgAnnualReturnPct ?? 0) - (input.annualFeePct ?? 0)) / 100;
  
    for (let age = minAge; age <= maxAge; age += step) {
      const delta = age - input.baseAge;
  
      // עדכון גילים “לפי גיל מוות היפותטי” (כמו במקור)
      const spouseAge = (input.spouseAge ?? 42) + delta;
      const childrenAgesAdj = (input.childrenAges || []).map(a => a + delta);
  
      // הקרנת צבירה עד אותו גיל
      const projectedFund = projectFundBalanceTS(
        input.pensionFund || 0,
        input.baseAge,
        age,
        net,
        input.monthlyContribution || 0
      );
  
      // חישוב התשלום החודשי באותו גיל
      const sim = this.calculateAllPensionsAdapter({
        maritalStatus: input.maritalStatus,
        age,                                   // גיל המוות ההיפותטי
        salary: input.salary,
        yearsInsured: input.yearsInsured,
        pensionFund: projectedFund,
        children: input.children,
        childrenAges: childrenAgesAdj,
        spouseAge
      });
  
      const monthlyTotal =
        (sim.breakdown.btl  || 0) +
        (sim.breakdown.fund || 0) +
        (sim.breakdown.kids || 0);
  
      // שנות קבלה לפי הכללים (בן/בת הזוג עד 85; ילדים עד גיל 23 וכו')
      const yrs = calculateYearsReceiving(age, {
        currentMaritalStatus: input.maritalStatus,
        spouseAge,
        childrenAges: childrenAgesAdj
      });
  
      const totalValue = monthlyTotal * Math.max(0, yrs) * 12; // ₪ מצטבר
  
      labels.push(age);
      monthly.push(Math.round(monthlyTotal));
      cumulativeK.push(Math.round(totalValue / 1000)); // אלפי ₪ לציר הימני
    }
  
    return { labels, monthly, cumulative: cumulativeK };
  }


buildAgeImpactBaseOptions(): Highcharts.Options {
  const opts: Highcharts.Options = {
    chart: {
      backgroundColor: 'transparent',
      style: { fontFamily: 'Assistant, Heebo, system-ui' }
    },
    title: {
      text: 'השפעת גיל המוות על פנסיית השאירים',
      align: 'center',
      margin: 20,
      style: { color: '#e8ecff' }
    },
    credits: { enabled: false },
    legend: {
      rtl: true,
      itemStyle: { color: '#dbeafe' },
      itemHoverStyle: { color: '#ffffff' }
    },
    tooltip: {
      shared: true,
      useHTML: true,
      formatter: function () {
        const cat = this.x as string;
        const pts = this.points || [];
        const rows = pts.map(p => {
          const name = p.series.name;
          const color = p.color as string;
          const val = Highcharts.numberFormat(p.y as number, 0, '.', ',');
          return `<div><span style="color:${color};font-weight:700">●</span><span style="color:#FFFFFF;">${name}: ${val}</span></div>`;
        }).join('');
        return `<div dir="rtl" style="text-align:right">${cat}<br>${rows}</div>`;
      }
    } as Highcharts.TooltipOptions,
    xAxis: [{
      categories: [],          // נמלא בעדכון
      reversed: true,          // ← ציר מימין לשמאל (20 מימין → 85 משמאל)
      tickInterval: undefined, // נגדיר tickPositions ידנית לפי כל 5 שנים
      labels: { style: { color: '#cbd5e1' } },
      title:  { text: 'גיל', style: { color: '#cbd5e1' } },
      plotBands: [],
      plotLines: []
    }],
    yAxis: [{
      title:  { text: 'פנסיה חודשית (₪)', style: { color: '#93c5fd' } },
      labels: {
        style: { color: '#93c5fd' },
        formatter: function () { return Highcharts.numberFormat(this.value as number, 0, '.', ','); }
      },
      gridLineColor: 'rgba(255,255,255,.07)'
    }, {
      title:  { text: 'ערך כולל (אלפי ₪)', style: { color: '#86efac' } },
      labels: {
        style: { color: '#86efac' },
        formatter: function () { return Highcharts.numberFormat(this.value as number, 0, '.', ','); }
      },
      gridLineColor: 'rgba(255,255,255,.03)',
      opposite: true
    }],
    plotOptions: {
      series: {
        animation: { duration: 350 },
        marker: { enabled: false },
        states: { hover: { halo: { size: 6 } } }
      },
      areaspline: { fillOpacity: 0.18 }
    },
    series: [
      {
        type: 'areaspline',
        name: 'פנסיה חודשית (₪)',
        color: AGE_IMPACT_PALETTE.monthly,
        yAxis: 0,
        data: [],
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, Highcharts.color(AGE_IMPACT_PALETTE.monthly)!.setOpacity(0.15).get('rgba') as string],
            [1, Highcharts.color(AGE_IMPACT_PALETTE.monthly)!.setOpacity(0).get('rgba') as string]
          ]
        }
      },
      {
        type: 'line',
        name: 'ערך כולל (אלפי ₪)',
        color: AGE_IMPACT_PALETTE.cumulative,
        yAxis: 1,
        data: [],
        lineWidth: 2
      }
    ]
  };
  return opts;
}


  buildBenefitSplitBaseOptions(): Highcharts.Options {
    return {
      chart: { type: 'pie', backgroundColor: 'transparent' },
      lang: { thousandsSep: ',', numericSymbols: [] },
      credits: { enabled: false },
      title: { text: 'פירוט רכיבי הקצבה',style:{color:'#fff'} },
      tooltip: { pointFormat: '<b>₪{point.y:,.0f}</b> ({point.percentage:.1f}%)',style:{color:'#fff'} },
      plotOptions: {
        pie: {
          allowPointSelect: true, cursor: 'pointer',
          dataLabels: { enabled: true, format: '{point.name}: ₪{point.y:,.0f}' }
        }
      },
      series: [{
        type: 'pie',
        name: '₪ לחודש',
        data: [
          { name: 'ביטוח לאומי', y: 0 },
          { name: 'קרן פנסיה',  y: 0 },
          { name: 'ילדים',      y: 0 }
        ]
      }]
    };
  }

  // === NEW: קו/Area לפי מקור לאורך זמן ===
buildSourcesOverTimeOptions(): Highcharts.Options {
  return {
    chart: { type: 'line', backgroundColor: 'transparent' },
    title: { text: 'פירוט לפי מקור לאורך זמן' },
    lang: { thousandsSep: ',', numericSymbols: [] },
    xAxis: {
      title: { text: 'חודש תשלום' },
      tickInterval: 12, // שנה
      categories: []
    },
    yAxis: {
      title: { text: '₪ לחודש' },
      labels: { formatter() { return '₪' + Highcharts.numberFormat(this.value as number, 0); } }
    },
    tooltip: {
      shared: true,
      pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>₪{point.y:,.0f}</b><br/>'
    },
    credits: { enabled: false },
    plotOptions: { series: { marker: { enabled: false } } },
    series: [
      { type: 'line', name: 'ביטוח לאומי', data: [] },
      { type: 'line', name: 'קרן פנסיה',  data: [] },
      { type: 'line', name: 'ילדים',      data: [] }
    ]
  };
}

/** דונאט: השוואה מהירה לפי מקור (כמו comparisonChart במקור) */
buildComparisonChartOptions(): Highcharts.Options {
  return {
    chart: { type: 'pie', backgroundColor: 'transparent' },
    title: { text: 'השוואה מהירה: מקורות התשלום',style:{color:'#fff'}  },
    lang: { thousandsSep: ',', numericSymbols: [] },
    credits: { enabled: false },
    tooltip: {
      shared: true,
      useHTML: true,
      formatter: function () {
        return `<b>${this.x}</b><br/>₪${Highcharts.numberFormat(this.y as number, 0, '.', ',')}`;
      },
      style: { color: '#fff' }
    },
    plotOptions: {
      pie: {
        innerSize: '60%',
        allowPointSelect: true,
        cursor: 'pointer',
        showInLegend: true,
        dataLabels: { enabled: true, formatter: function () {
          return `${this.point.name}: ₪${Highcharts.numberFormat(this.y as number, 0, '.', ',')}`;
        } ,style:{color:'#fff'} }
      }
    },
    series: [{
      type: 'pie',
      name: '₪ לחודש',
      data: [] // ימולא דינמית
    }]
  };
}

// === INSIGHTS: ערך מצטבר לאורך זמן ===
buildInsightsOptions(): Highcharts.Options {
  return {
    chart: { type: 'areaspline', backgroundColor: 'transparent' },
    title: { text: 'ערך מצטבר לאורך זמן' ,style:{color:'#fff'} },
    lang: { thousandsSep: ',', numericSymbols: [] },
    credits: { enabled: false },
    xAxis: { categories: [], title: { text: 'חודש',style:{color:'#fff'}  },tickColor: 'rgba(255,255,255,.15)',labels: {style:{color:'#fff'}} , tickInterval: 12 },
    yAxis: {
      title: { text: 'אלפי ₪' },
      labels: { formatter: function () { return Highcharts.numberFormat(this.value as number, 0, '.', ','); },style:{color:'#fff'} }
    },
    tooltip: {
      shared: true,
      pointFormatter() {
        const v = (this as any).y;
        return `<span style="color:${(this as any).color}">●</span><span style="color:#FFFFFF;">${ (this as any).series.name }: <b>₪${Highcharts.numberFormat(this.y as number, 0, '.', ',')}</b></span><br/>`;
      }
    },
    plotOptions: {
      areaspline: { marker: { enabled: false } }
    },
    series: [{
      type: 'areaspline',
      name: 'ערך מצטבר (אלפי ₪)',
      data: [] as number[],
      color: 'rgba(0, 123, 255, 1)',       // צבע הקו
      fillColor: 'rgba(0, 123, 255, 0.3)'  // צבע המילוי עם שקיפות 0.3
    }]
  };
}

updateInsightsSeries(opts: Highcharts.Options, labels: (string|number)[], cumulative: number[]) {
  // מציגים באלפים לתצוגה נקייה
  const inThousands = cumulative.map(v => Math.round((v || 0) / 1000));
  (opts.xAxis as Highcharts.XAxisOptions).categories = labels as string[];
  const s = opts.series![0] as Highcharts.SeriesAreasplineOptions;
  s.data = inThousands;
}
/** מילוי נתונים לדונאט (כולל “ירושה (באלפים)” כמו במקור) */
updateComparisonChartSeries(
  opts: Highcharts.Options,
  btlMonthly: number,
  fundMonthly: number,
  kidsMonthly: number,
  inheritanceValue: number // סכום חד־פעמי — מוצג באלפים
) {
  const s = opts.series![0] as Highcharts.SeriesPieOptions;
  const data: Highcharts.PointOptionsObject[] = [];

  if (btlMonthly > 0)  data.push({ name: 'ביטוח לאומי',    y: btlMonthly,  color: '#4ECDC4' });
  if (fundMonthly > 0) data.push({ name: 'קרן פנסיה',      y: fundMonthly, color: '#4A90E2' });
  if (kidsMonthly > 0) data.push({ name: 'פנסיית ילדים',   y: kidsMonthly, color: '#9B59B6' });
  if (inheritanceValue > 0) {
    data.push({ name: 'ירושה (באלפים)', y: Math.round(inheritanceValue / 1000), color: '#E67E22' });
  }
  if (data.length === 0) data.push({ name: 'אין זכאות', y: 1, color: '#FF6B6B' });

  s.data = data;
}


updateSourcesOverTimeSeries(
  opts: Highcharts.Options,
  labels: (string|number)[],
  btlMonthly: number,
  fundMonthly: number,
  kidsMonthly: number
) {
  const n = labels.length;
  const fill = (v: number) => Array.from({ length: n }, () => v);

  const s = opts.series as Highcharts.SeriesOptionsType[];
  (s[0] as Highcharts.SeriesLineOptions).data = fill(btlMonthly);
  (s[1] as Highcharts.SeriesLineOptions).data = fill(fundMonthly);
  (s[2] as Highcharts.SeriesLineOptions).data = fill(kidsMonthly);

  (opts.xAxis as Highcharts.XAxisOptions).categories = labels as string[];
}


  /** עדכון הדאטה + PlotBands/PlotLine לפי הגיל הנוכחי */
  updateAgeImpactSeries(
    opts: Highcharts.Options,
    monthly: number[],          // ₪ לחודש, בסדר 20→85
    cumulativeK: number[],      // אלפי ₪, בסדר 20→85
    labels: number[],           // [20,21,...,85] או [20,22,...,85]
    currentAge: number,         // למשל this.age
    bands?: {
      critical?: [number, number];
      optimal?:  [number, number];
      retire?:   [number, number];
    }
  ) {
    if (!opts.xAxis || !opts.series) return;
  
    const xa = (Array.isArray(opts.xAxis) ? opts.xAxis[0] : opts.xAxis) as Highcharts.XAxisOptions;
    const series = opts.series as Highcharts.SeriesOptionsType[];
  
    // 1) קטגוריות + כיוון ימין→שמאל
    xa.categories = labels.map(String);
    xa.reversed = true;
  
    // 2) טיקים כל 5 שנים (על ציר קטגוריות — לפי אינדקסים)
    xa.tickPositions = labels
      .map((age, idx) => (age % 5 === 0 ? idx : -1))
      .filter(i => i >= 0);
  
    // 3) סדרות
    if (series[0]) (series[0] as Highcharts.SeriesAreasplineOptions).data = monthly;
    if (series[1]) (series[1] as Highcharts.SeriesLineOptions).data = cumulativeK;
  
    // 4) קו גיל נוכחי
    const currIdx = labels.indexOf(currentAge);
    xa.plotLines = [];
    if (currIdx >= 0) {
      xa.plotLines.push({
        value: currIdx,
        color: '#f59e0b',
        width: 2,
        dashStyle: 'Dash',
        zIndex: 5,
        label: {
          text: `גיל נוכחי (${currentAge})`,
          align: 'center',
          rotation: 0,
          style: { color: '#f59e0b', fontWeight: '600' }
        }
      });
    }
  
    // 5) אזורי רקע (plotBands): קריטי / אופטימלי / פרישה
    // ברירת־מחדל סבירה; שנה לפי הצורך/רגולציה
    const defaults = {
      critical: [20, 30] as [number, number],
      optimal:  [30, 55] as [number, number],
      retire:   [67, 85] as [number, number]
    };
    const cfg = { ...defaults, ...(bands || {}) };
  
    const idx = (age: number) => Math.max(0, labels.indexOf(age));
    const safeBand = (from: number, to: number, color: string, text: string) => {
      const iFrom = idx(from), iTo = idx(to);
      if (iFrom === -1 || iTo === -1 || iTo <= iFrom) return null;
      return {
        from: iFrom,
        to: iTo,
        color,
        label: { text, style: { color: '#94a3b8' } },
        zIndex: 0
      } as Highcharts.XAxisPlotBandsOptions;
    };
  
    xa.plotBands = [];
    const b1 = safeBand(cfg.critical[0], cfg.critical[1], AGE_IMPACT_PALETTE.bandCritical, 'תקופה קריטית');
    const b2 = safeBand(cfg.optimal[0],  cfg.optimal[1],  AGE_IMPACT_PALETTE.bandOptimal,  'תקופה אופטימלית');
    const b3 = safeBand(cfg.retire[0],   cfg.retire[1],   AGE_IMPACT_PALETTE.bandRetire,   'תקופת פרישה');
    [b1, b2, b3].forEach(b => b && xa.plotBands!.push(b));
  }
  

  updateBenefitSplitSeries(opts: Highcharts.Options, btl: number, fund: number, kids: number) {
    const s = opts.series![0] as Highcharts.SeriesPieOptions;
    s.data = [
      { name: 'ביטוח לאומי', y: btl },
      { name: 'קרן פנסיה',  y: fund },
      { name: 'ילדים',      y: kids }
    ];
  }

  /** ===== Adapter: מחבר את הלוגיקה שלך לגרפים =====
   * כאן שמים 1:1 את הפונקציות מה-JS שלך.
   * כדי להשאיר שליטה מלאה: שמתי TODOים היכן להדביק כללי חלוקה/זכאויות ספציפיים.
   */
  
  calculateAllPensionsAdapter(input: CalcInput): SimulationResult {
    const eligibleChildrenCount = getEligibleChildrenCount(input.childrenAges, input.children);
    const survivors = hasEligibleSurvivorsTS(input.maritalStatus, input.childrenAges, input.children);
    const doubleOrphan = resolveDoubleOrphan(input.maritalStatus);

    // === ביטוח לאומי (BTL) ===
    let btlSpouseMonthly = 0;
    let btlKidsMonthly = 0;
    let btlCategory = 'אין שאירים זכאים';
    let seniorityPercent = 0;

    if (survivors) {
      seniorityPercent = getSeniorityPercent(input.yearsInsured);

      if (input.maritalStatus === 'married') {
        // סכום בסיסי לפי טבלת אלמן/ה עם/בלי ילדים
        const withKids = getWidowAmountFromTable(input.spouseAge ?? 42, eligibleChildrenCount);
        const noKids   = getWidowAmountFromTable(input.spouseAge ?? 42, 0);
        btlCategory = withKids.category;

        const spouseBase = noKids.amount;
        const kidsBase   = Math.max(0, withKids.amount - noKids.amount);

        btlSpouseMonthly = Math.round(spouseBase * (1 + seniorityPercent));
        btlKidsMonthly   = Math.round(kidsBase   * (1 + seniorityPercent));
      } else {
        // יתומים בלבד (רווק/גרוש עם ילדים)
        const orphans = getOrphansAmount(eligibleChildrenCount, doubleOrphan);
        btlCategory = orphans.category;
        btlSpouseMonthly = 0;
        btlKidsMonthly   = Math.round(orphans.amount * (1 + seniorityPercent));
      }
    }

    // === קרן פנסיה לשאירים – פיצול בן/בת זוג / ילדים ===
    let fundSpouseMonthly = 0;
    let fundKidsMonthly   = 0;

    if (survivors && (input.pensionFund || 0) > 0) {
      const oldAgePension = (input.pensionFund || 0) / 200;

      if (input.maritalStatus === 'married') {
        // בן/בת זוג 60% + לכל ילד 20%
        fundSpouseMonthly = oldAgePension * 0.60;
        fundKidsMonthly   = (eligibleChildrenCount > 0)
          ? oldAgePension * 0.20 * eligibleChildrenCount
          : 0;
      } else {
        // אין בן/בת זוג – לילד 40% מהפנסיית זקנה
        fundSpouseMonthly = 0;
        fundKidsMonthly   = oldAgePension * 0.40 * eligibleChildrenCount;
      }

      fundSpouseMonthly = Math.round(fundSpouseMonthly);
      fundKidsMonthly   = Math.round(fundKidsMonthly);
    }

    // בניית הפירוק והסכום הכולל
    const btlMonthly  = btlSpouseMonthly + btlKidsMonthly;
    const fundMonthly = fundSpouseMonthly;              // רק בן/בת הזוג לעמודת "קרן פנסיה"
    const kidsMonthly = btlKidsMonthly + fundKidsMonthly; // כל הילדים (ב"ל + קרן)
    const totalMonthly = Math.max(0, btlMonthly + fundMonthly + kidsMonthly);

    const yearsToReceive = calculateYearsToReceiveTS(
      input.maritalStatus,
      input.spouseAge,
      input.childrenAges,
      input.children
    );

    // גרפים: פיזור חודשי קבוע (עד 20 שנה לתצוגה)
    const labels: number[] = [];
    const monthly: number[] = [];
    const cumulative: number[] = [];
    let cum = 0;
    const months = Math.max(1, yearsToReceive * 12);
    const cap = Math.min(months, 240);
    for (let i = 1; i <= cap; i++) {
      labels.push(i);
      monthly.push(totalMonthly);
      cum += totalMonthly;
      cumulative.push(cum);
    }

    return {
      labels,
      monthlySeries: monthly,
      cumulativeSeries: cumulative,
      breakdown: { 
        btl: Math.round(btlSpouseMonthly),
        fund: Math.round(fundSpouseMonthly),
        kids: Math.round(btlKidsMonthly + fundKidsMonthly)
      },
      meta: {
        eligibleChildren: eligibleChildrenCount,
        doubleOrphan,
        category: btlCategory,
        yearsReceiving: yearsToReceive
      }
    };
  }

}
