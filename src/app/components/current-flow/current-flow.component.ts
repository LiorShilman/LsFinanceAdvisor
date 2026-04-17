import { Component, OnInit } from '@angular/core';
import { itemsRowObj } from 'src/app/services/GeneralTypes/GeneralTypes';
import { GeneralInfoService } from 'src/app/services/general-info.service';
import more from 'highcharts/highcharts-more';
import patternFill from "highcharts/modules/pattern-fill";
patternFill(Highcharts);

more(Highcharts);
import Accessibility from 'highcharts/modules/accessibility';
Accessibility(Highcharts);
import * as Highcharts from 'highcharts';
import * as DiagramHighcharts from 'highcharts';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

let threeD = require('highcharts/highcharts-3d')
threeD(Highcharts);

declare var bootstrap: any;

// Interfaces for MAPE Calculator
interface MapeExpense {
  name: string;
  amount: number;
  date: number;
  type: string;
  comment: string;
  isCredit?: boolean;
}

interface AdditionalExpense {
  name: string;
  amount: number;
  date: number;
}

interface MapeCalculatorData {
  currentBalance: number;
  monthlyIncome: number;
  incomeDay: number;
  safetyBuffer: number;
  purchaseFullDate: Date | null; // 🆕 במקום purchaseDate
  installments: number;
  planningHorizon: number;
  autoExpenses: MapeExpense[];
  additionalExpenses: AdditionalExpense[];
}

interface MapeResult {
  showResults: boolean;
  mape: number;
  maxPurchase: number;
  statusColor: string;
  statusText: string;
  recommendation: string;
  riskLevel: string;
  availableAmount: number;
  cashflowDetails: string[];
  projectedBalance: number;
  actualInstallments: number;
}

@Component({
  selector: 'app-current-flow',
  templateUrl: './current-flow.component.html',
  styleUrls: ['./current-flow.component.css']
})
export class CurrentFlowComponent implements OnInit {

  updateFlag = false;
  highcharts = Highcharts;

  // MAPE Calculator Data
  mapeCalculator: MapeCalculatorData = {
    currentBalance: 0,
    monthlyIncome: 0,
    incomeDay: 9,
    safetyBuffer: 3000,
    purchaseFullDate: null, // 🆕
    installments: 4,
    planningHorizon: 4,
    autoExpenses: [],
    additionalExpenses: []
  };

  mapeResult: MapeResult = {
    showResults: false,
    mape: 0,
    maxPurchase: 0,
    statusColor: '#e74c3c',
    statusText: 'לא חושב',
    recommendation: 'לחץ על חישוב להתחלת התהליך',
    riskLevel: 'לא ידוע',
    availableAmount: 0,
    cashflowDetails: [],
    projectedBalance: 0,
    actualInstallments: 0
  };

  chartOptions: Highcharts.Options = {
    chart: {
      animation: false,
      type: 'waterfall',
      inverted: false,
      styledMode: false,
      backgroundColor: '#250101'
    },
    plotOptions: {
      series: {
        stacking: 'normal',
        lineWidth: 0
      },
      waterfall: {
        lineColor: 'transparent',
        stacking: 'normal',
        lineWidth: 0
      }
    },
    xAxis: {
      categories: [],
      labels: {
        style: {
          color: 'white',
          fontSize: '16'
        },
      },
    },
    yAxis: {
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold',
          color: 'white'
        }
      },
      title: {
        text: 'ש"ח',
        style: {
          color: 'white'
        }
      },
      labels: {
        style: {
          color: 'white'
        }
      }
    },
    title: {
      text: '',
      style: { "color": 'white' }
    },
    legend: {
      enabled: false
    },
    tooltip: {
      enabled: true,
      shared: true,
      useHTML: true,
      headerFormat: '<table><tr><th colspan="2">{point.key}</th></tr>',
      pointFormat: '<tr><td style="text-align: right"><b>{point.y} ש"ח</b></td></tr>',
      footerFormat: '</table>',
      valueDecimals: 0,
      backgroundColor: '#2C3E50',
      style: {
        textAlign: 'right',
        color: 'white',
        fontWeight: 'bold',
        fontSize: "12px"
      },
    },
    series: []
  }

  constructor(public generalInfoService: GeneralInfoService) {
  }

  ngOnInit(): void {
    // Bootstrap tooltip initialization
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    this.UpdateChart();
    this.syncMapeCalculator();
  }

  // ===== MAPE Calculator Methods =====

  /**
   * סנכרון אוטומטי של נתוני המחשבון עם הטבלה הקיימת
   */
  syncMapeCalculator(): void {
    // איפוס הרשימה הקיימת
    this.mapeCalculator.autoExpenses = [];

    // המרת הנתונים מהטבלה למבנה המחשבון
    this.generalInfoService.AllInfo.CurrentFlowViewInfo.itemsRows.forEach(item => {
      if (item.Date && item.Type && item.CurrAmount) {
        const cleanAmount = this.parseAmountString(item.CurrAmount);
        const cleanDate = parseInt(item.Date) || 1;
        
        if (cleanAmount > 0 && cleanDate >= 1 && cleanDate <= 31) {
          this.mapeCalculator.autoExpenses.push({
            name: item.Comment || item.Type,
            amount: cleanAmount,
            date: cleanDate,
            type: item.Type,
            comment: item.Comment || '',
            isCredit: item.Type.toLowerCase().includes('אשראי')
          });
        }
      }
    });

    // מיון לפי תאריך
    this.mapeCalculator.autoExpenses.sort((a, b) => a.date - b.date);

    // עדכון יתרה נוכחית אם קיימת
    if (this.generalInfoService.AllInfo.CurrentFlowViewInfo.CurrCash) {
      const currentCash = this.parseAmountString(this.generalInfoService.AllInfo.CurrentFlowViewInfo.CurrCash);
      if (currentCash > 0) {
        this.mapeCalculator.currentBalance = currentCash;
      }
    }

    // ניחוש הכנסה חודשית מההוצאות (הערכה אוטומטית)
    this.estimateMonthlyIncome();
  }

  /**
   * הערכה אוטומטית של הכנסה חודשית על בסיס הוצאות
   */
  private estimateMonthlyIncome(): void {
    const incomeItems = this.mapeCalculator.autoExpenses.filter(expense => 
      expense.type === 'הכנסה'
    );

    if (incomeItems.length > 0) {
      // סכום כל ההכנסות
      const totalIncome = incomeItems.reduce((sum, item) => sum + item.amount, 0);
      this.mapeCalculator.monthlyIncome = totalIncome;
      
      // חיפוש יום משכורת ספציפית
      const salaryItem = incomeItems.find(item => 
        item.comment && item.comment.toLowerCase().includes('משכורת')
      );
      
      if (salaryItem) {
        this.mapeCalculator.incomeDay = salaryItem.date;
      } else {
        // יום הכנסה ממוצע אם לא נמצאה משכורת
        const avgIncomeDay = Math.round(
          incomeItems.reduce((sum, item) => sum + item.date, 0) / incomeItems.length
        );
        this.mapeCalculator.incomeDay = avgIncomeDay;
      }
    } else if (this.mapeCalculator.monthlyIncome === 0) {
      // הערכה לפי הוצאות - בדרך כלל הכנסה גבוהה ב-20-30% מהוצאות
      const totalExpenses = this.mapeCalculator.autoExpenses
        .filter(expense => expense.type === 'הוצאה' || expense.type === 'השקעה')
        .reduce((sum, item) => sum + item.amount, 0);
      
      if (totalExpenses > 0) {
        this.mapeCalculator.monthlyIncome = Math.round(totalExpenses * 1.25); // הוספת 25%
      }
    }
  }

  /**
   * ניקוי מחרוזת סכום להמרה למספר
   */
  private parseAmountString(amountStr: string): number {
    if (!amountStr) return 0;
    
    // הסרת פסיקים, רווחים וסימני מטבע
    const cleanStr = amountStr.toString()
      .replace(/,/g, '')
      .replace(/\s/g, '')
      .replace(/[^\d.-]/g, '');
    
    const parsed = parseFloat(cleanStr);
    return isNaN(parsed) ? 0 : Math.abs(parsed); // תמיד חיובי
  }

  /**
   * הוספת הוצאה נוספת למחשבון
   */
  addAdditionalExpense(): void {
    this.mapeCalculator.additionalExpenses.push({
      name: '',
      amount: 0,
      date: 1
    });
  }

  /**
   * הסרת הוצאה נוספת
   */
  removeAdditionalExpense(index: number): void {
    this.mapeCalculator.additionalExpenses.splice(index, 1);
  }

  /**
   * חישוב MAPE המרכזי
   */
  calculateMAPE(): void {
    if (this.mapeCalculator.currentBalance <= 0) {
      alert('אנא הכנס יתרת עו"ש נוכחית');
      return;
    }

    if (!this.mapeCalculator.purchaseFullDate) {
      alert("אנא בחר תאריך קנייה מתוכננת");
      return;
    }

    const today = new Date();
    const purchaseDate = new Date(this.mapeCalculator.purchaseFullDate);
    const purchaseDay = purchaseDate.getDate();
    const purchaseMonth = purchaseDate.getMonth();
    const purchaseYear = purchaseDate.getFullYear();

    const isNextMonth =
      (purchaseYear === today.getFullYear() && purchaseMonth > today.getMonth()) ||
      (purchaseYear > today.getFullYear());

    const isNextYear = purchaseYear > today.getFullYear();

    const cutoffMonth = isNextMonth ? (today.getMonth() + 1) % 12 : today.getMonth();
    const cutoffYear = isNextYear ? today.getFullYear() + 1 : today.getFullYear();

    const allExpenses: MapeExpense[] = [...this.mapeCalculator.autoExpenses];
    this.mapeCalculator.additionalExpenses.forEach(expense => {
      if (expense.name.trim() && expense.amount > 0 && expense.date >= 1 && expense.date <= 31) {
        allExpenses.push({
          name: expense.name,
          amount: expense.amount,
          date: expense.date,
          type: 'הוצאה',
          comment: 'הוצאה נוספת',
          isCredit: false
        });
      }
    });

    allExpenses.sort((a, b) => a.date - b.date);

    let projectedBalance = this.mapeCalculator.currentBalance;
    let cashflowDetails: string[] = [];
    let hasNegativeBalance = false;
    const allEvents: any[] = [];

    cashflowDetails.unshift(`
      <div class="info-banner">
        <div class="info-icon">ℹ️</div>
        <div class="info-content">
          <h3>תזכורת:</h3>
          <p>יום הקנייה שבחרת הוא ב־${purchaseDay}/${purchaseMonth + 1}/${purchaseYear} — 
          <strong>${isNextYear ? 'שנה הבאה' : isNextMonth ? 'חודש הבא' : 'החודש הנוכחי'}</strong>. 
          החישוב מתחשב בהתאם.</p>
        </div>
      </div>
    `);

    // יצירת תאריך של היום ללא שעות
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // טיפול בהוצאות קבועות עד תאריך הקנייה (כולל היום והלאה)
    this.mapeCalculator.autoExpenses.forEach(expense => {
      let year = today.getFullYear();   // מתחילים מהיום
      let month = today.getMonth();

      while (true) {
        const expenseDate = new Date(year, month, expense.date);
        if (expenseDate > purchaseDate) break;
        if (expenseDate < todayDateOnly) {
          // מדלגים רק על תאריכים שעברו באמת
          month++;
          if (month > 11) { month = 0; year++; }
          continue;
        }

        const eventType = expense.type === 'הכנסה' ? 'income' : 'expense';
        const icon = expense.type === 'הכנסה' ? '💰' :
          (expense.isCredit ? '💳' : (expense.type === 'השקעה' ? '📈' : '💸'));

        allEvents.push({
          date: expense.date,
          type: eventType,
          name: expense.name,
          amount: expense.amount,
          icon: icon,
          expenseType: expense.type,
          fullDate: expenseDate
        });

        month++;
        if (month > 11) { month = 0; year++; }
      }
    });

    this.mapeCalculator.additionalExpenses.forEach(expense => {
      if (expense.name.trim() && expense.amount > 0 && expense.date >= 1 && expense.date <= 31) {
        const expenseDate = new Date(purchaseYear, purchaseMonth, expense.date);
        if (expenseDate < today || expenseDate > purchaseDate) return;

        allEvents.push({
          date: expense.date,
          type: 'expense',
          name: expense.name,
          amount: expense.amount,
          icon: '💸',
          expenseType: 'הוצאה',
          fullDate: expenseDate
        });
      }
    });

    allEvents.sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());

    const formatNumber = (amount: number, isNegative: boolean = false): string => {
      const absAmount = Math.abs(amount);
      const formattedAmount = absAmount.toLocaleString();
      const sign = isNegative ? '−' : (amount > 0 ? '+' : '');
      const colorClass = isNegative || amount < 0 ? 'negative-number' : 'positive-number';
      return `<span class="${colorClass} ltr-number" style="direction: ltr !important; unicode-bidi: embed !important;">${sign}${formattedAmount}</span>`;
    };

    let runningBalance = projectedBalance;
    let horizontalFlow = `<div class="cashflow-horizontal-container">`;
    horizontalFlow += `
      <div class="cashflow-step starting-step">
        <div class="step-icon">💼</div>
        <div class="step-title">התחלה</div>
        <div class="step-amount positive">${formatNumber(runningBalance)}</div>
      </div>
    `;

    allEvents.forEach((event, index) => {
      horizontalFlow += `<div class="flow-arrow ${event.type === 'income' ? 'arrow-up' : 'arrow-down'}">←</div>`;

      const isIncome = event.type === 'income';
      const stepClass = isIncome ? 'income-step' : 'expense-step';
      const amountClass = isIncome ? 'positive' : 'negative-number';
      const balanceClass = runningBalance < 0 ? 'negative-number' : 'positive-number';
      const dateStr = `${event.fullDate.getDate()}/${event.fullDate.getMonth() + 1}`;

      if (isIncome) {
        runningBalance += event.amount;
      } else {
        runningBalance -= event.amount;
        if (runningBalance < 0) hasNegativeBalance = true;
      }

      horizontalFlow += `
        <div class="cashflow-step ${stepClass}">
          <div class="step-icon">${event.icon}</div>
          <div class="step-title">${event.name}</div>
          <div class="step-date">${dateStr}</div>
          <div class="step-amount ${amountClass}">${formatNumber(event.amount, !isIncome)}</div>
          <div class="step-balance">יתרה : ${formatNumber(runningBalance, runningBalance < 0)}</div>
          ${runningBalance < 0 ? '<div class="step-warning">⚠️ מינוס!</div>' : ''}
        </div>
      `;
    });
    

    horizontalFlow += `<div class="flow-arrow final-arrow">←</div>`;
    const availableAmount = runningBalance - this.mapeCalculator.safetyBuffer;
    const finalClass = availableAmount < 0 ? 'critical-step' : 
                   (availableAmount < 5000 ? 'warning-step' : 'excellent-step');
    horizontalFlow += `
      <div class="cashflow-step final-step ${finalClass}">
        <div class="step-icon">🛒</div>
        <div class="step-title">יום הקנייה ${isNextMonth ? '<span title="קנייה בחודש הבא">🟠</span>' : '<span title="קנייה בחודש נוכחי">🟢</span>'}</div>
        <div class="step-date">${purchaseDay}/${purchaseMonth + 1}</div>
        <div class="step-balance ${runningBalance < 0 ? 'negative' : 'positive'}">${formatNumber(runningBalance, runningBalance < 0)}</div>
        ${runningBalance < 0 ? '<div class="step-critical">🚨 אסור לקנות!</div>' : '<div class="step-success">✅ זמין לקנייה</div>'}
      </div>
    `;

    horizontalFlow += `</div>`;
    cashflowDetails.push(`
      <div class="cashflow-horizontal-header">
        <h4>📊 תזרים כספי חודשי - סימולציה עד תאריך הקנייה</h4>
      </div>
    `);
    cashflowDetails.push(horizontalFlow);
    projectedBalance = runningBalance;

    if (hasNegativeBalance || projectedBalance < 0) {
      cashflowDetails.unshift(`
        <div class="critical-warning-banner">
          <div class="warning-icon">🚨</div>
          <div class="warning-content">
            <h3>אזהרה קיצונית!</h3>
            <p>התזרים נכנס למינוס לפני הקנייה - קנייה כלשהי מסוכנת ביותר!</p>
          </div>
          <div class="warning-icon">🚨</div>
        </div>
      `);
      this.generalInfoService.AllInfo.CurrentFlowViewInfo.CurrCash = this.mapeCalculator.currentBalance.toString();
      this.onCurrentCashChange();
      this.generalInfoService.AllInfo.CurrentFlowViewInfo.CheckExistCash();
    }

    let mape = 0;
    let maxPurchase = 0;
    let actualInstallments = this.mapeCalculator.installments;

    if (availableAmount > 0) {
      const maxAllowedInstallments = Math.min(this.mapeCalculator.installments, this.mapeCalculator.planningHorizon);
      mape = availableAmount / maxAllowedInstallments;
      maxPurchase = mape * maxAllowedInstallments;
      actualInstallments = maxAllowedInstallments;
    }

    let statusColor = '#e74c3c';
    let statusText = 'מצב סיכון גבוה';
    let recommendation = 'לא מומלץ לבצע קנייה - יתרה לא מספיקה';
    let riskLevel = 'גבוה';

    if (projectedBalance < 0 || hasNegativeBalance) {
      statusColor = '#8b0000';
      statusText = '🚨 מצב קיצוני 🚨';
      recommendation = 'אסור לבצע קנייה! התזרים כבר במינוס לפני הקנייה!';
      riskLevel = 'קיצוני - סכנה ממשית';
    } else if (availableAmount < 0) {
      statusColor = '#e74c3c';
      statusText = 'מצב שלילי';
      recommendation = 'אסור לבצע קנייה - תיכנס למינוס!';
      riskLevel = 'קיצוני';
    } else if (availableAmount < 2000) {
      statusColor = '#e74c3c';
      statusText = 'מצב סיכון';
      recommendation = 'מומלץ לחכות או לבחור תזמון אחר';
      riskLevel = 'גבוה';
    } else if (availableAmount < 5000) {
      statusColor = '#f39c12';
      statusText = 'מצב זהיר';
      recommendation = 'ניתן לבצע קנייה קטנה בזהירות';
      riskLevel = 'בינוני';
    } else if (availableAmount < 10000) {
      statusColor = '#f39c12';
      statusText = 'מצב מתקבל';
      recommendation = 'ניתן לבצע קנייה מתונה';
      riskLevel = 'נמוך-בינוני';
    } else {
      statusColor = '#27ae60';
      statusText = 'מצב מצוין';
      recommendation = 'ניתן לבצע קנייה בביטחון מלא';
      riskLevel = 'נמוך';
    }

    this.mapeResult = {
      showResults: true,
      mape: mape,
      maxPurchase: maxPurchase,
      statusColor: statusColor,
      statusText: statusText,
      recommendation: recommendation,
      riskLevel: riskLevel,
      availableAmount: availableAmount,
      cashflowDetails: cashflowDetails,
      projectedBalance: projectedBalance,
      actualInstallments: actualInstallments
    };
  }


  /**
   * פונקציות עזר לעיצוב
   */
  getExpenseRowClass(type: string): string {
    switch (type) {
      case 'הכנסה': return 'income-row';
      case 'הוצאה': return 'expense-row';
      case 'השקעה': return 'investment-row';
      default: return 'neutral-row';
    }
  }

  /**
   * Event handlers לסנכרון אוטומטי
   */
  onDataChange(): void {
    // עדכון אוטומטי של המחשבון כשמשתנים נתונים בטבלה
    setTimeout(() => {
      this.syncMapeCalculator();
    }, 100);
  }

  onCurrentCashChange(): void {
    // עדכון יתרה נוכחית במחשבון
    if (this.generalInfoService.AllInfo.CurrentFlowViewInfo.CurrCash) {
      const currentCash = this.parseAmountString(this.generalInfoService.AllInfo.CurrentFlowViewInfo.CurrCash);
      this.mapeCalculator.currentBalance = currentCash;
    }
  }

  // ===== Original Methods =====

  UpdateChart() {
    const series: Highcharts.SeriesOptionsType[] = [];
    let dataCurr: Highcharts.PointOptionsObject[] = [];

    let labels: string[] = [`עו"ש מומלץ`];
    let backgroundColors = ['blue'];

    let total = 0;
    total += this.generalInfoService.AllInfo.CurrentFlowViewInfo.CalcNeedInFirstDay();
    dataCurr.push({
      name: 'עו"ש מומלץ',
      y: this.generalInfoService.AllInfo.CurrentFlowViewInfo.CalcNeedInFirstDay(),
      color: 'blue'
    });

    for (let i = 0; i < this.generalInfoService.AllInfo.CurrentFlowViewInfo.itemsRows.length; i++)
      this.generalInfoService.AllInfo.CurrentFlowViewInfo.CalcNetSum(i)

    this.generalInfoService.AllInfo.CurrentFlowViewInfo.itemsRows.forEach(element => {
      {
        labels.push(element.Date);
        console.log(element);
        if (element.Type == "הוצאה") {
          total -= parseInt(element.CurrAmount.replace(',', ''));
          backgroundColors.push('red');
          dataCurr.push({
            name: element.Comment,
            y: 0 - parseInt(element.CurrAmount.replace(',', '')),
            color: 'red'
          });
        }
        else if (element.Type == "הכנסה") {
          total += parseInt(element.CurrAmount.replace(',', ''));
          backgroundColors.push('green');
          dataCurr.push({
            name: element.Comment,
            y: parseInt(element.CurrAmount.replace(',', '')),
            color: 'green'
          });
        }
        else {
          total -= parseInt(element.CurrAmount.replace(',', ''));
          backgroundColors.push('orange');
          dataCurr.push({
            name: element.Comment,
            y: 0 - parseInt(element.CurrAmount.replace(',', '')),
            color: 'orange'
          });
        }
      }
    });

    dataCurr[0] = {
      name: 'עו"ש מומלץ',
      y: this.generalInfoService.AllInfo.CurrentFlowViewInfo.CalcNeedInFirstDay(),
      color: 'blue'
    };

    labels = labels.concat('יתרה')
    backgroundColors.push('blue');
    dataCurr.push({
      name: 'יתרה לחודש הבא',
      isSum: true,
      color: 'blue'
    },);

    console.log(labels);
    console.log(dataCurr);

    let s1: Highcharts.SeriesOptionsType = {
      type: 'waterfall',
      data: dataCurr,
      color: 'black',
      dataLabels: {
        enabled: false,
        format: '{y} ש"ח',
        style: {
          fontWeight: 'normal'
        },
      },
      lineWidth: 0,
      pointPadding: 0
    };
    series.push(s1);

    this.chartOptions.series = series;
    (this.chartOptions.xAxis as Highcharts.XAxisOptions).categories = labels;

    this.updateFlag = true;
  }

  getStyleFromVal(type: string) {
    if (type === "הוצאה")
      return 'red';
    else if (type === "הכנסה")
      return 'limegreen';
    else
      return '#ffc107';
  }

  getStyleFromValBG(sum: number) {
    if (sum < 0)
      return 'white';
    else
      return 'black';
  }

  AddRow() {
    this.generalInfoService.AllInfo.CurrentFlowViewInfo.itemsRows.push(new itemsRowObj());
    // סנכרון אוטומטי של המחשבון אחרי הוספת שורה
    setTimeout(() => {
      this.syncMapeCalculator();
    }, 100);
  }
}