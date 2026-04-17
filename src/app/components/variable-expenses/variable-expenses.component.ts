import { Component, OnInit } from '@angular/core';
import { VariableExpensesRowObj } from 'src/app/services/GeneralTypes/GeneralTypes';
import { GeneralInfoService } from 'src/app/services/general-info.service';
import * as Highcharts from 'highcharts';
import HC_drilldown from 'highcharts/modules/drilldown';
HC_drilldown(Highcharts);
let threeD = require('highcharts/highcharts-3d')
threeD(Highcharts);
import { Chart } from 'chart.js/auto';

const CHART_COLORS = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  green2: 'rgb(0, 204, 102)'
};

declare var bootstrap: any;

@Component({
  selector: 'app-variable-expenses',
  templateUrl: './variable-expenses.component.html',
  styleUrls: ['./variable-expenses.component.css']
})
export class VariableExpensesComponent implements OnInit {
  public LastPercent:number;
  updateFlag = false;
  highcharts = Highcharts;

  chartOptions: Highcharts.Options = {
    chart: {
      type: 'pie',
      styledMode: true,
      backgroundColor: 'black',
      options3d: {
        enabled: true,
        alpha: 45,
        beta: 0,
      },
    },
    title: {
      text: 'חלוקת הוצאות משתנות',
      style: { "color": 'white' }
    },
    accessibility: {
      enabled: false,
      point: {
        valueSuffix: '%'
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.1f}%</b><br/>'
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        depth: 35,
        dataLabels: {
          enabled: true,
          format: `<b>{point.name}</b>:  {point.percentage:.1f}%`,
          color: 'white',
        }
      }
    },
    series: [{
      type: 'pie',
      name: 'Most popular cars',
      data: []
    }],
    drilldown: {
      activeAxisLabelStyle: {
        textDecoration: 'none',
        fontStyle: 'regular',
        color:'#ffffff',
      },
      series: []
    }
  }

  //public chart: any;
  //Data: number[];
  //delayed: Boolean;
  constructor(public generalInfoService: GeneralInfoService) {
    //this.ColorArray = new Array<string>(2);
    //this.ColorArray[0] = "#5C2D8A";
    //this.ColorArray[1] = "#8F49D6";
    //this.Data = [];
    //this.delayed = false;
    this.LastPercent = 0;
  }

  ngOnInit(): void {
    // Bootstrap tooltip initialization
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    //this.CreateChart();
    this.UpdateData();
  }

  CalcDifference(numCategory: number, numType: number) {

    this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[numCategory].VariableExpensesRowObj[numType].DefferenceExpense = (this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[numCategory].VariableExpensesRowObj[numType].CurrExpense.replace(',', '') != "" && this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[numCategory].VariableExpensesRowObj[numType].SatisfactionExpense.replace(',', '') != "") ?
      (parseFloat(this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[numCategory].VariableExpensesRowObj[numType].CurrExpense.replace(',', '')) -
        parseFloat(this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[numCategory].VariableExpensesRowObj[numType].SatisfactionExpense.replace(',', ''))) : 0;


    return (this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[numCategory].VariableExpensesRowObj[numType].CurrExpense.replace(',', '') != "" && this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[numCategory].VariableExpensesRowObj[numType].SatisfactionExpense.replace(',', '') != "") ?
      (parseFloat(this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[numCategory].VariableExpensesRowObj[numType].CurrExpense.replace(',', '')) -
        parseFloat(this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[numCategory].VariableExpensesRowObj[numType].SatisfactionExpense.replace(',', ''))) : "";
  }

  CalcSumCurr() {

    var currExpenses = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj.length; i++) {
      for (let j = 0; j < this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].VariableExpensesRowObj.length; j++) {
        currExpenses += (this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].VariableExpensesRowObj[j].CurrExpense.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].VariableExpensesRowObj[j].CurrExpense.replace(',', '')) : 0);
      }
    }

    //this.generalInfoService.AllInfo.FixedExpensesViewInfo.MonthlyExpense2Avg = currExpenses.toFixed(0).toString();

    return currExpenses.toFixed(0).toString();
  }

  CalcSumSatisfaction() {

    this.generalInfoService.AllInfo.VariableExpensesViewInfo.SatisfactionExpenses = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj.length; i++) {
      for (let j = 0; j < this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].VariableExpensesRowObj.length; j++) {
        this.generalInfoService.AllInfo.VariableExpensesViewInfo.SatisfactionExpenses += ((this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].VariableExpensesRowObj[j].SatisfactionExpense.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].VariableExpensesRowObj[j].SatisfactionExpense.replace(',', '')) : 0));
      }
    }

    //this.generalInfoService.AllInfo.FixedExpensesViewInfo.MonthlyExpense2Avg = satisfactionExpenses.toFixed(0).toString();

    return this.generalInfoService.AllInfo.VariableExpensesViewInfo.SatisfactionExpenses.toFixed(0).toString();
  }

  CalcAnchorPercent() {
    let sumVariableExpenses = this.generalInfoService.AllInfo.VariableExpensesViewInfo.DiffExpenses + this.generalInfoService.AllInfo.VariableExpensesViewInfo.SatisfactionExpenses;
    let sumAnchor = 0;
    for (let i = 0; i < this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj.length; i++) {
      for (let j = 0; j < this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].VariableExpensesRowObj.length; j++) {
        if (this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].VariableExpensesRowObj[j].Anchor) {
          sumAnchor += this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].VariableExpensesRowObj[j].CurrExpense != "" ? parseInt(this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].VariableExpensesRowObj[j].CurrExpense.replace(',', '')) : 0;
        }
      }
    }
    return sumAnchor / sumVariableExpenses;
  }

  CalcFlexiblePercent() {
    let sumVariableExpenses = this.generalInfoService.AllInfo.VariableExpensesViewInfo.DiffExpenses + this.generalInfoService.AllInfo.VariableExpensesViewInfo.SatisfactionExpenses;
    let sumFlexible = 0;
    for (let i = 0; i < this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj.length; i++) {
      for (let j = 0; j < this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].VariableExpensesRowObj.length; j++) {
        if (this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].VariableExpensesRowObj[j].Flexible) {
          sumFlexible += this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].VariableExpensesRowObj[j].CurrExpense != "" ? parseInt(this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].VariableExpensesRowObj[j].CurrExpense.replace(',', '')) : 0;
        }
      }
    }
    return sumFlexible / sumVariableExpenses;
  }

  CalcGoodToBePercent() {
    let sumVariableExpenses = this.generalInfoService.AllInfo.VariableExpensesViewInfo.DiffExpenses + this.generalInfoService.AllInfo.VariableExpensesViewInfo.SatisfactionExpenses;
    let sumGoodToBe = 0;
    for (let i = 0; i < this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj.length; i++) {
      for (let j = 0; j < this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].VariableExpensesRowObj.length; j++) {
        if (this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].VariableExpensesRowObj[j].GoodToBe) {
          sumGoodToBe += this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].VariableExpensesRowObj[j].CurrExpense != "" ? parseInt(this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].VariableExpensesRowObj[j].CurrExpense.replace(',', '')) : 0;
        }
      }
    }
    return sumGoodToBe / sumVariableExpenses;
  }

  CalcSumDiff() {


    this.generalInfoService.AllInfo.VariableExpensesViewInfo.DiffExpenses = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj.length; i++) {
      for (let j = 0; j < this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].VariableExpensesRowObj.length; j++) {
        this.generalInfoService.AllInfo.VariableExpensesViewInfo.DiffExpenses += ((this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].VariableExpensesRowObj[j].CurrExpense.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].VariableExpensesRowObj[j].CurrExpense.replace(',', '')) : 0) -
          (this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].VariableExpensesRowObj[j].SatisfactionExpense.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].VariableExpensesRowObj[j].SatisfactionExpense.replace(',', '')) : 0));
      }
    }

    return this.generalInfoService.AllInfo.VariableExpensesViewInfo.DiffExpenses.toFixed(0).toString();
  }

  CalcPercent() {
    //let sumNetIncomes = this.generalInfoService.AllInfo.IncomesViewInfo.SumNetIncomes;
    let incomes = this.generalInfoService.AllInfo.IncomesViewInfo.TotalIncomes;    //console.log(sumNetIncomes);
    //console.log(incomeEx);
    //console.log(sumIncomes);
    //console.log(this.generalInfoService.AllInfo.IncomesViewInfo.Income[num]);

    if (this.LastPercent != this.generalInfoService.AllInfo.VariableExpensesViewInfo.SatisfactionExpenses / incomes)
    {
      this.UpdateData();
      this.LastPercent = this.generalInfoService.AllInfo.VariableExpensesViewInfo.SatisfactionExpenses / incomes;
    }


    return this.generalInfoService.AllInfo.VariableExpensesViewInfo.SatisfactionExpenses / incomes;
  }

  CalcPercentRow(row: VariableExpensesRowObj) {
    //let sumNetIncomes = this.generalInfoService.AllInfo.IncomesViewInfo.SumNetIncomes;
    let incomes = this.generalInfoService.AllInfo.IncomesViewInfo.TotalIncomes;    
    //this.UpdateData();
    return parseInt(row.SatisfactionExpense.replace(',', '')) / incomes;
  }

  UpdateData() {
    const data3d: Highcharts.PointOptionsObject[] = [];
    const drilldownData: Highcharts.SeriesOptionsType[] = [];
    let maxPercent = -1;
    let maxPercentName = "";

    this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj.forEach(element => {
      if (element.CalcSum() != '0') {
        let sumPercent = (parseInt(element.CalcSum().replace(',', '')) * 100 / this.generalInfoService.AllInfo.VariableExpensesViewInfo.SatisfactionExpenses).toFixed(2);
        if (maxPercent < parseFloat(sumPercent)) {
          maxPercent = parseFloat(sumPercent);
          maxPercentName = element.CategoryName;
        }
      }
    });


    //this.chart.data.datasets[0].data = [];
    this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj.forEach(element => {
      if (element.CalcSum() != '0') {
        let sumPercent = (parseInt(element.CalcSum().replace(',', '')) * 100 / this.generalInfoService.AllInfo.VariableExpensesViewInfo.SatisfactionExpenses).toFixed(2);
        //this.chart.data.datasets[0].data.push(parseFloat(sumPercent).toFixed(2));
        if (element.CategoryName == maxPercentName)
          data3d.push({ name: element.CategoryName, y: parseFloat(sumPercent), sliced: true,  drilldown: element.CategoryName });
        else
          data3d.push({ name: element.CategoryName, y: parseFloat(sumPercent), sliced: false, drilldown: element.CategoryName });

        let drilldownDataItem: any[][] = [];
        element.VariableExpensesRowObj.forEach(element2 => {
          if (element2.CurrExpense != "") {
            let sum = ((parseInt(element2.CurrExpense.replace(',', '')) * 100) / this.generalInfoService.AllInfo.VariableExpensesViewInfo.SatisfactionExpenses)
            drilldownDataItem.push([element2.Type, sum])
          }
        });

        drilldownData.push({ name: element.CategoryName, id: element.CategoryName, data: drilldownDataItem, type: 'pie' });
        console.log(drilldownData);
        //drilldownData.push({ name: element.CategoryName,id:element.CategoryName,data:drilldownDataItem});
      }
    });

    this.chartOptions.drilldown = {
      activeAxisLabelStyle: {
        textDecoration: 'none',
        fontStyle: 'regular',
        color:'#ffffff',
        textOutline: '0px #000000'
      },
      series: drilldownData
    };

    console.log(this.chartOptions.drilldown);

    this.chartOptions.series = [{
      type: 'pie',
      name: 'קטגוריה',
      data: data3d
    }];

    threeD(Highcharts);
    //this.chart.update();

    this.updateFlag = true;
  }

  /* CreateChart() {

    let labels: any = [];
    this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj.forEach(element => {
      if (element.CalcSum() != '0') {
        labels.push(element.CategoryName);
      }
    });

    //this.chart?.destroy();

    const nf = new Intl.NumberFormat("en-US", {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    const footer = (tooltipItems: any) => { */
  //      let sum = 0;
  /*       //console.log(tooltipItems);
        if (tooltipItems[0].raw.length == 2)
          return `${nf.format(tooltipItems[0].raw[1] - tooltipItems[0].raw[0])} `;
        else
   */
  /*     return `${tooltipItems[0].raw}%`;
    };

    this.chart = new Chart('MyChart', {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: this.Data,
          backgroundColor: Object.values(CHART_COLORS)
        }] *//* ,
{ 
label: 'סה"כ חיסכון שנתי',
data: this.Data,
backgroundColor: 'limegreen',
barPercentage: 1,
type: 'bar',
order: 1
},
{
label: 'צורך',
data: this.Data,
backgroundColor: '#710019',
barPercentage: 1,
type: 'bar',
order: 0,
} ],*/
  /*   },
    options: {
      animation: {
        onComplete: () => {
          this.delayed = true;
        },
        delay: (context) => {
          let delay = 0;
          if (context.type === 'data' && context.mode === 'default' && !this.delayed) {
            delay = 20;
          }
          return delay;
        },
      },
      plugins: {
        tooltip: {
          textDirection: 'ltr',
          titleFont: {
            size: 16
          },
          callbacks: {
            label: function (context) {
              return "";
            },
            title: footer,
          }
        },
        legend: {
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
            display: false,
            text: 'לאן זורם הכסף',
            color: "#FFFFFF",
            font: {
              family: 'Comic Sans MS',
              size: 28,
              weight: 'bold',
              lineHeight: 1.2,
            },
          }
        }
      }, *//* 
interaction: {
intersect: true,
} ,
/*scales: {
 x: {
  ticks: { color: 'white' }
  grid: {
    color: 'rgba(255,255,255,255.1)',
  } 
},
y: {
  beginAtZero: true,
  ticks: { color: 'white' },
  grid: {
    color: 'rgba(255,255,255,255.1)',
  } 
}
},*/
  /*   responsive: true,
    maintainAspectRatio: false,
  }
})
}
*/

}
