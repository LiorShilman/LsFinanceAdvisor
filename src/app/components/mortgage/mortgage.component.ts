import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MortgagesRowObj } from 'src/app/services/GeneralTypes/GeneralTypes';
import { GeneralInfoService } from 'src/app/services/general-info.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormattedMoneyComponent } from '../formatted-money/formatted-money.component';
import { FormulaDisplayComponent } from '../formula-display/formula-display.component';
import { MortgageEmbedComponent } from '../mortgage/mortgage-embed.component';
import more from 'highcharts/highcharts-more';
//import calculatedWrap from './calculated-wrap';
//calculatedWrap(Highcharts);
import patternFill from "highcharts/modules/pattern-fill";
patternFill(Highcharts);


more(Highcharts);
import Accessibility from 'highcharts/modules/accessibility';
Accessibility(Highcharts);
//import { Chart } from 'chart.js/auto';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
//import { Chart } from 'chart.js/auto';
/* import HC_drilldown from 'highcharts/modules/drilldown';
HC_drilldown(Highcharts); */
let threeD = require('highcharts/highcharts-3d')
threeD(Highcharts);

declare var bootstrap: any;

@Component({
  selector: 'app-mortgage',
  templateUrl: './mortgage.component.html',
  styleUrls: ['./mortgage.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormattedMoneyComponent, HighchartsChartModule   ,FormsModule, FormulaDisplayComponent,MortgageEmbedComponent],
})
export class MortgageComponent implements OnInit, OnChanges {
  public chart: any;
  /*  ColorArray: string[]; */
  /*  Data: number[]; */

  public LastCostOfFinancings: string;
  updateFlag = false;
  highcharts = Highcharts;

  chartOptions: Highcharts.Options = {
    chart: {
      type: 'column',
      styledMode: false,
      backgroundColor: 'black',
      borderColor: 'white',
      options3d: {
        enabled: true,
        alpha: 5,
        beta: 10,
        depth: 130,
        viewDistance: 90
      },
    },
    xAxis: {
      categories: [],
      labels: {
        skew3d: false,
        style: {
          color: 'white',
          fontSize: '20px'
        },
      },
      title: {
        text: 'מסלול',
        skew3d: false,
        style: {
          color: 'white',
          fontSize: '20px'
        }

      }
    },
    legend: {
      itemStyle: {
        color: '#A0A0A0'
      },
      itemHoverStyle: {
        color: '#FFF'
      },
      itemHiddenStyle: {
        color: '#444'
      }

    },
    yAxis: {
      allowDecimals: false,
      color: 'white',
      min: 0,
      gridLineColor: 'white',
      minorTicks: true,
      minorTickColor: 'white',
      title: {
        text: 'סכום',
        skew3d: false,
        style: {
          color: 'white',
          fontSize: '20px'
        }
      },
      labels: {
        style: {
          color: 'white'
        }
      }
    },
    title: {
      text: 'קרן מול עלות מימון',
      style: { "color": 'white' }
    },
    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.value}</b><br/>'
    },
    plotOptions: {
      column: {
        allowPointSelect: true,
        cursor: 'pointer',
        depth: 35,
        stacking: 'normal',
        colors: ['#32cd32', '#FF0000'],
        dataLabels: {
          enabled: false,
          format: `<b>{point.name}</b>:  {point.value}`,
          color: 'white',
        },
      }
    },
    series: []
  }

  constructor(public generalInfoService: GeneralInfoService) {
    /*     this.ColorArray = new Array<string>(2);
        this.ColorArray[0] = "#5C2D8A";
        this.ColorArray[1] = "#8F49D6";
        this.Data = []; */
        this.LastCostOfFinancings = "";
  }

  ngOnInit(): void {
    // Bootstrap tooltip initialization
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });
    //this.createChart();
    this.UpdateChart();
  }

  UpdateChart() {

    let colorDataCurr = ['#336699', '#669933', '#7D3C98', '#FFFF00', '#336699', '#A93226', '#F4D03F', '#996666'];
    //    let colorDataCost =  ['#6699CC', '#99CC66', '#C39BD3', '#CCCC66', '#6699CC','#F5B7B1','#FAD7A0', '#CC9999'];
    let colorDataCost = ['red', 'red', 'red', 'red', 'red', 'red', 'red', 'red'];

    const dictionaryColorDataCurr = new Map<string, string>();
    const dictionaryColorDataCost = new Map<string, string>();

    const series: Highcharts.SeriesOptionsType[] = [];
    let idx = -1;
    let dataCurr: Highcharts.PointOptionsObject[] = [];
    let stack: string[] = [];
    let xAxis: string[] = [];
    let dataCost: Highcharts.PointOptionsObject[] = [];
    for (let i = 0; i < this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows.length; i++) {
      xAxis.push(this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].Route);
      if (!dictionaryColorDataCurr.has(this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].Route)) {
        idx++;
        dictionaryColorDataCurr.set(this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].Route, colorDataCurr[idx]);
        dictionaryColorDataCost.set(this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].Route, colorDataCost[idx]);
      }
      else {
        dictionaryColorDataCurr.set(this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].Route, colorDataCurr[idx]);
        dictionaryColorDataCost.set(this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].Route, colorDataCost[idx]);
      }
      dataCurr.push({ color: colorDataCurr[idx], value: parseInt(this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].CurrAmount.replace(',', '')), y: parseInt(this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].CurrAmount.replace(',', '')), name: this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].Route });
      dataCost.push({ color: colorDataCost[idx], value: parseInt(this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].calculateLoanDetails().financingCost.replace(',', '')), y: parseInt(this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].calculateLoanDetails().financingCost.replace(',', '')), name: this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].Route });
      stack.push(this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].Route);
    };

    let s1: Highcharts.SeriesOptionsType = {
      type: 'column', // Add the type property here
      name: 'קרן שנשארה',
      data: dataCurr,
      stack: 'קרן שנשארה',
      colors: Array.from(dictionaryColorDataCurr.values())
    };
    series.push(s1);

    let s2: Highcharts.SeriesOptionsType = {
      type: 'column', // Add the type property here
      name: 'עלות מימון',
      data: dataCost,
      stack: 'עלות מימון',
      colors: Array.from(dictionaryColorDataCost.values())

    };

    series.push(s2);
    console.log(series);

    this.chartOptions.series = series;
    (this.chartOptions.xAxis as Highcharts.XAxisOptions).categories = xAxis;


    threeD(Highcharts);
    //this.chart.update();

    this.updateFlag = true;

    /*   this.chart.data.datasets[0].data = [];
      this.chart.data.datasets[1].data = [];
      for (let i = 0; i < this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows.length; i++) {
        this.chart.data.datasets[0].data.push(this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].CurrAmount);
        this.chart.data.datasets[1].data.push(this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].calculateLoanDetails().financingCost);
      }
      this.chart.update(); */
  }

  /*   createChart() {
   
      const labels = [];
      for (let i = 0; i < this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows.length; i++) {
        labels.push(this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].Route);
      }
   
      const nf = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "ILS",
        maximumFractionDigits: 0
      });
   
      const footer = (tooltipItems: any) => { */
  /*       let sum = 0;
        //console.log(tooltipItems);
        if (tooltipItems[0].raw.length == 2)
          return `${nf.format(tooltipItems[0].raw[1] - tooltipItems[0].raw[0])} `;
        else
          return `${nf.format(tooltipItems[0].raw)}`;
   */
  /*  return `${nf.format(tooltipItems[0].raw)}`
  };
  
  this.chart?.destroy();
  
  let delayed = false;
  this.chart = new Chart('MyChart', {
  type: 'bar',
  data: {
   labels: labels,
   datasets: [{
     label: 'קרן שנשארה',
     data: this.Data,
     backgroundColor: 'orange'
   },
   {
     label: 'עלות המימון',
     data: this.Data,
     backgroundColor: 'red'
   } *//* ,
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
} *//* ],
     },
     options: {
     animation: {
       onComplete: () => {
         delayed = true;
       },
       delay: (context) => {
         let delay = 0;
         if (context.type === 'data' && context.mode === 'default' && !delayed) {
           delay = context.dataIndex * 300 + context.datasetIndex * 100;
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
     },
     interaction: {
       intersect: true,
     },
     scales: {
       x: {
         ticks: { color: 'white' }
         /* grid: {
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
     },
     responsive: true,
     maintainAspectRatio: false,
     }
     })
     } */

  OnModelChange(event: any) {
    console.log("sdsds");
    this.UpdateChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("sdsdssdsdsd");
    this.UpdateChart();
  }

  CalcCurrAmounts() {
    this.generalInfoService.AllInfo.MortgagesViewInfo.CurrentAmounts = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows.length; i++) {
      this.generalInfoService.AllInfo.MortgagesViewInfo.CurrentAmounts += (this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].CurrAmount.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].CurrAmount.replace(',', '')) : 0);
    }

    return this.generalInfoService.AllInfo.MortgagesViewInfo.CurrentAmounts.toFixed(0).toString();

  }

  CalcMonthlyPayments() {

    this.generalInfoService.AllInfo.MortgagesViewInfo.MonthlyPayments = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows.length; i++) {
      this.generalInfoService.AllInfo.MortgagesViewInfo.MonthlyPayments += (this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].calculateLoanDetails().monthlyPayment).replace(',', '') != "" ? parseInt(this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].calculateLoanDetails().monthlyPayment.replace(',', '')) : 0;
    }

    return this.generalInfoService.AllInfo.MortgagesViewInfo.MonthlyPayments.toFixed(0).toString();

  }

  CalcMaxMonthlyPayments() {

    this.generalInfoService.AllInfo.MortgagesViewInfo.MaxMonthlyPayments = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows.length; i++) {
      this.generalInfoService.AllInfo.MortgagesViewInfo.MaxMonthlyPayments += (this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].calculateLoanDetails().maxMonthlyPayment).replace(',', '') != "" ? parseInt(this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].calculateLoanDetails().maxMonthlyPayment.replace(',', '')) : 0;
    }

    return this.generalInfoService.AllInfo.MortgagesViewInfo.MaxMonthlyPayments.toFixed(0).toString();

  }


  CalcRemainingMortgages() {

    this.generalInfoService.AllInfo.MortgagesViewInfo.RemainingMortgages = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows.length; i++) {
      this.generalInfoService.AllInfo.MortgagesViewInfo.RemainingMortgages += (this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].calculateLoanDetails().totalPrincipalWithLinkage).replace(',', '') != "" ? parseInt(this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].calculateLoanDetails().totalPrincipalWithLinkage.replace(',', '')) : 0;
    }

    return this.generalInfoService.AllInfo.MortgagesViewInfo.RemainingMortgages.toFixed(0).toString();

  }

  CalcCostOfFinancings() {

    this.generalInfoService.AllInfo.MortgagesViewInfo.CostOfFinancings = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows.length; i++) {
      this.generalInfoService.AllInfo.MortgagesViewInfo.CostOfFinancings += (this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].calculateLoanDetails().financingCost).replace(',', '') != "" ? parseInt(this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].calculateLoanDetails().financingCost.replace(',', '')) : 0;
    }

    if (this.LastCostOfFinancings != this.generalInfoService.AllInfo.MortgagesViewInfo.CostOfFinancings.toFixed(0).toString())
    {
      this.UpdateChart();
      this.LastCostOfFinancings = this.generalInfoService.AllInfo.MortgagesViewInfo.CostOfFinancings.toFixed(0).toString()
    }
    return this.generalInfoService.AllInfo.MortgagesViewInfo.CostOfFinancings.toFixed(0).toString();
  }

  CalcReturn2Shekel() {
    if (this.generalInfoService.AllInfo.MortgagesViewInfo.RemainingMortgages != 0)
      return (this.generalInfoService.AllInfo.MortgagesViewInfo.RemainingMortgages / this.generalInfoService.AllInfo.MortgagesViewInfo.CurrentAmounts).toFixed(2).toString();
    else
      return "";
  }

  CalcSumMortgages() {
    //this.UpdateChart();
    //console.log(this.generalInfoService.AllInfo.MortgagesViewInfo.CurrentAmounts.toFixed(0).toString().replace(',', ''));
    return (this.generalInfoService.AllInfo.MortgagesViewInfo.RemainingMortgages.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.MortgagesViewInfo.RemainingMortgages.toFixed(0).toString().replace(',', '')) : 0).toFixed(0).toString();
  }

  AddRow() {
    this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows.push(new MortgagesRowObj());
  }
}
