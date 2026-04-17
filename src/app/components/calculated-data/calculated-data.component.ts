import { Component, OnInit } from '@angular/core';
import { GeneralInfoService } from 'src/app/services/general-info.service';
//import { ChartOptions, Chart } from 'chart.js/auto';
import { ManagerInsuranceRowObj, OldPensionFundRowObj, PensionFundRowObj } from 'src/app/services/GeneralTypes/GeneralTypes';
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
import * as DiagramHighcharts from 'highcharts';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
/* import HC_drilldown from 'highcharts/modules/drilldown';
HC_drilldown(Highcharts); */
let threeD = require('highcharts/highcharts-3d')
threeD(Highcharts);

declare var bootstrap: any;


@Component({
  selector: 'app-calculated-data',
  templateUrl: './calculated-data.component.html',
  styleUrls: ['./calculated-data.component.css']
})

export class CalculatedDataComponent implements OnInit {
  public template: string;
  //public chart: any;
  subscription: Subscription;
  /*  ColorArray: string[]; */
  /*  Data: number[]; */

  updateFlag = false;
  updateDiagramFlag = false;
  highcharts = Highcharts;
  diagramHighcharts = DiagramHighcharts;


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

  diagramChartOptions: DiagramHighcharts.Options = {
    chart: {
      backgroundColor: "transparent",
      styledMode: true,
      style: {
        fontSize: "12px"
      },
      events: {
        load: (event) => {
          const chart: any = event.target;
          const ren = chart.renderer;

          if (parseInt(this.generalInfoService.AllInfo.CalculateData.SumIncomes.replace(',', '')) < parseInt(this.generalInfoService.AllInfo.CalculateData.SumExpenses.replace(',', ''))) {
            // הכנסות 1

            ren.label('הכנסות', 10, 112)
              .attr({
                fill: "blue",
                stroke: 'white',
                'stroke-width': 2,
                padding: 5,
                r: 5,
                height: 70,
                width: 60
              })
              .css({
                color: 'white',
                height: 200
              })
              .add()
              .shadow(true);
            // הוצאות 1
            ren.label('הוצאות', 70, 82)
              .attr({
                fill: 'blue',
                stroke: 'white',
                'stroke-width': 2,
                padding: 5,
                r: 5,
                height: 100,
                width: 80
              })
              .css({
                color: 'white'
              })
              .add()
              .shadow(true);

            if (parseInt(this.generalInfoService.AllInfo.CalculateData.CommitmentAmounts.replace(',', '')) > 0) {
              // התחייבות 1
              ren.label('התחייבויות', 200, 132)
                .attr({
                  fill: 'red',
                  stroke: 'white',
                  'stroke-width': 2,
                  padding: 5,
                  r: 5
                })
                .css({
                  color: 'white'
                })
                .add()
                .shadow(true);

              // התחייבות 1
              ren.label('התחייבויות', 150, 162)
                .attr({
                  fill: 'blue',
                  stroke: 'white',
                  'stroke-width': 2,
                  padding: 5,
                  r: 5
                })
                .css({
                  color: 'white'
                })
                .add()
                .shadow(true);
              // התחייבות התחייבות 1
              ren
                .path(['M', 230, 160,
                  'L', 230, 175,
                  'H', 210, 230,
                  'M', 95, 235,
                  'V', 235, 200,
                  'M', 210, 175, 'L', 215, 170, 'M', 210, 175, 'L', 215, 180] as any)
                .attr({
                  'stroke-width': 3,
                  stroke: 'red'
                })
                .add();
              // התחייבות הוצאות 1
              ren
                .path([
                  'M', 180, 190,
                  'L', 180, 235,
                  'H', 95, 160,
                  'M', 95, 235,
                  'V', 235, 200,
                  'M', 95, 200, 'L', 90, 205, 'M', 95, 200, 'L', 100, 205
                ] as any)
                .attr({
                  'stroke-width': 3,
                  stroke: 'red'
                })
                .add();
              // הוצאות התחייבות 1
              ren
                .path([
                  'M', 170, 100,
                  'H', 170, 180,
                  'V', 100, 155,
                  'M', 180, 155, 'L', 175, 150, 'M', 180, 155, 'L', 185, 150
                ] as any)
                .attr({
                  'stroke-width': 2,
                  stroke: 'LightSkyBlue'
                })
                .add();

            }

            if (parseInt(this.generalInfoService.AllInfo.CalculateData.CommitmentAmounts.replace(',', '')) > 0) {

              // הלוואות 1
              ren.label('הלוואות', 70, 45)
                .attr({
                  fill: 'red',
                  stroke: 'white',
                  'stroke-width': 2,
                  padding: 5,
                  r: 5,
                  height: 20,
                  width: 80
                })
                .css({
                  color: 'white',
                  height: 200
                })
                .add()
                .shadow(true);

              // הוצאות הלוואות 1
              ren
                .path([
                  'M', 60, 100,
                  'H', 60, 40,
                  'V', 65, 65,
                  'H', 60, 60,
                  'M', 60, 65, 'L', 55, 60, 'M', 60, 65, 'L', 55, 70
                ] as any)
                .attr({
                  'stroke-width': 2,
                  stroke: 'LightSkyBlue'
                })
                .add();
              // הלוואות התחייבות 1
              ren
                .path([
                  'M', 170, 65,
                  'H', 170, 230,
                  'V', 65, 125,
                  'M', 230, 125, 'L', 225, 120, 'M', 230, 125, 'L', 235, 120
                ] as any)
                .attr({
                  'stroke-width': 3,
                  stroke: 'red'
                })
                .add();
            }
          }
          else {
            // הכנסות 2
            ren.label('הכנסות', 10, 82)
              .attr({
                fill: 'blue',
                stroke: 'white',
                'stroke-width': 2,
                padding: 5,
                r: 5,
                height: 100,
                width: 60
              })
              .css({
                color: 'white',
                height: 200
              })
              .add()
              .shadow(true);

            // הכנסות 2
            ren.label('הכנסות', 10, 45)
              .attr({
                fill: 'limegreen',
                stroke: 'white',
                'stroke-width': 2,
                padding: 5,
                r: 5,
                height: 20,
                width: 60
              })
              .css({
                color: 'black',
                height: 200
              })
              .add()
              .shadow(true);
            // הוצאוצ 2
            ren.label('הוצאות', 90, 122)
              .attr({
                fill: 'blue',
                stroke: 'white',
                'stroke-width': 2,
                padding: 5,
                r: 5,
                height: 60,
                width: 80
              })
              .css({
                color: 'white'
              })
              .add()
              .shadow(true);

            if (parseInt(this.generalInfoService.AllInfo.CalculateData.FutureExpenses.replace(',', '')) > 0 ||
              parseInt(this.generalInfoService.AllInfo.CalculateData.General.replace(',', '')) > 0) {

              // חיסכון נכסים 2

              ren
                .path([
                  'M', 180, 65,
                  'H', 180, 280,
                  'V', 65, 125,
                  'M', 280, 125, 'L', 275, 120, 'M', 280, 125, 'L', 285, 120
                ] as any)
                .attr({
                  'stroke-width': 3,
                  stroke: 'limegreen'
                })
                .add();

              //  חיסכון 2  
              ren.label('חיסכון', 90, 45)
                .attr({
                  fill: 'limegreen',
                  stroke: 'white',
                  'stroke-width': 2,
                  padding: 5,
                  r: 5,
                  height: 20,
                  width: 80
                })
                .css({
                  color: 'black',
                  height: 200
                })
                .add()
                .shadow(true);
            }

            // חיסכון 2
            ren.label('חיסכון', 90, 82)
              .attr({
                fill: 'blue',
                stroke: 'white',
                'stroke-width': 2,
                padding: 5,
                r: 5,
                height: 25,
                width: 80
              })
              .css({
                color: 'white'
              })
              .add()
              .shadow(true);


            // נכסים 2

            ren.label('נכסים', 250, 132)
              .attr({
                fill: 'limegreen',
                stroke: 'white',
                'stroke-width': 2,
                padding: 5,
                r: 5
              })
              .css({
                color: 'black'
              })
              .add()
              .shadow(true);

            // נכסים 2

            ren.label('נכסים', 250, 162)
              .attr({
                fill: 'blue',
                stroke: 'white',
                'stroke-width': 2,
                padding: 5,
                r: 5
              })
              .css({
                color: 'white'
              })
              .add()
              .shadow(true);

            if (parseInt(this.generalInfoService.AllInfo.CalculateData.CommitmentAmounts.replace(',', '')) > 0) {
              // התחייבות 2

              ren.label('התחייבויות', 150, 162)
                .attr({
                  fill: 'blue',
                  stroke: 'white',
                  'stroke-width': 2,
                  padding: 5,
                  r: 5
                })
                .css({
                  color: 'white'
                })
                .add()
                .shadow(true);

              // התחייבות הוצאות 2

              ren
                .path([
                  'M', 180, 190,
                  'L', 180, 225,
                  'H', 95, 160,
                  'M', 95, 225,
                  'V', 225, 200,
                  'M', 95, 200, 'L', 90, 205, 'M', 95, 200, 'L', 100, 205
                ] as any)
                .attr({
                  'stroke-width': 3,
                  stroke: 'red'
                })
                .add();

              // הוצאות התחייבויות 2
              ren
                .path([
                  'M', 170, 135,
                  'H', 170, 180,
                  'V', 155, 135,
                  'M', 180, 155, 'L', 175, 150, 'M', 180, 155, 'L', 185, 150
                ] as any)
                .attr({
                  'stroke-width': 2,
                  stroke: 'LightSkyBlue'
                })
                .add();



            }

            if (parseInt(this.generalInfoService.AllInfo.CalculateData.FinanceLiquidityAssets.replace(',', '')) > 0 || parseInt(this.generalInfoService.AllInfo.CalculateData.FinanceUnliquidityAssets.replace(',', ''))) {
              //  נכסים הכנסות 2

              ren
                .path([
                  'M', 280, 200,
                  'L', 280, 235,
                  'H', 35, 150,
                  'M', 35, 235,
                  'V', 235, 200,
                  'M', 35, 200, 'L', 30, 205, 'M', 35, 200, 'L', 40, 205
                ] as any)
                .attr({
                  'stroke-width': 2,
                  stroke: 'LightSkyBlue'
                })
                .add();



              // חיסכון נכסים 2

              ren
                .path([
                  'M', 180, 100,
                  'H', 180, 260,
                  'V', 100, 125,
                  'M', 260, 125, 'L', 255, 120, 'M', 260, 125, 'L', 265, 120
                ] as any)
                .attr({
                  'stroke-width': 2,
                  stroke: 'LightSkyBlue'
                })
                .add();

            }


          }



        }
      }
    },
    title: {
      text: "",//(parseInt(this.generalInfoService.AllInfo.CalculateData.SumIncomes.replace(',','')) < parseInt(this.generalInfoService.AllInfo.CalculateData.SumExpenses.replace(',',''))) ? 'אסטרטגיה של עני' : 'אסטרטגיה של עשיר',
      style: {
        color: 'white',
        fontSize: '22px'
      },
      align: 'center'
    },
    accessibility: {
      typeDescription: 'Waterfall'
    }
  };


  constructor(public generalInfoService: GeneralInfoService, public router: Router) {
    this.template = "";
    this.subscription = this.router.events.subscribe(event => {
      //console.log("event - " + this.browserRefresh);
      if (event instanceof NavigationEnd) {
        if (event.url == '/CalculatedData') {
          console.log("/CalculatedData");
          this.UpdateDiagramChart();
        }
      }
    });
  }

  ngOnInit(): void {
    // Bootstrap tooltip initialization
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    //this.createChart();
    this.UpdateChart();

    //this.loadDraft();
    
    // שמירה אוטומטית כל 30 שניות
    setInterval(() => {
      this.autoSave();
    }, 30000);
  }

  UpdateDiagramChart() {
    let title = (parseInt(this.generalInfoService.AllInfo.CalculateData.SumIncomes.replace(',', '')) < parseInt(this.generalInfoService.AllInfo.CalculateData.SumExpenses.replace(',', ''))) ? 'אסטרטגיה של עני' : 'אסטרטגיה של עשיר';
    (this.diagramChartOptions.title as Highcharts.TitleOptions).text = title;

    this.updateDiagramFlag = true;
  }

  UpdateChart() {


    const series: Highcharts.SeriesOptionsType[] = [];
    let dataCurr: Highcharts.PointOptionsObject[] = [];

    let labels = ["הכנסה משותפת", "הפרשות בתלוש", "הכנסות נוספות"/* ,'סה"כ הכנסות' */, "הפקדות לפנסיה", "הפקדנה לקרנות"];
    let backgroundColors = ['green', 'green', 'green', 'pink', 'pink'];

    //const data = [];
    let total = 0;
    //var vStart = total;
    total += this.generalInfoService.AllInfo.IncomesViewInfo.SumNetIncomes;
    dataCurr.push({
      name: 'הכנסה משותפת',
      y: this.generalInfoService.AllInfo.IncomesViewInfo.SumNetIncomes,
      color: 'green'
    });

    //data.push([vStart, total]);
    //vStart = total

    var excretions1 = 0;
    var excretions2 = 0;
    excretions1 = this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '') != "" ? parseInt(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '')) : 0;
    //console.log(excretions1);
    excretions2 = this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '') != "" ? parseInt(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '')) : 0;
    //console.log(excretions2);
    total += (excretions1 + excretions2 > 0 ? excretions1 + excretions2 : 0);

    dataCurr.push({
      name: 'הפרשות בתלוש',
      y: (excretions1 + excretions2 > 0 ? excretions1 + excretions2 : 0),
      color: 'green'
    });


    //console.log(excretions1 + excretions2);
    //data.push([vStart, total]);
    //vStart = total
    total += this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '') != "" ? parseInt(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '')) - excretions1 - excretions2 : 0;
    //console.log(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',','') != "" ? parseInt(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',','')) - excretions1 - excretions2 : 1);
    dataCurr.push({
      name: 'הכנסות נוספות',
      y: (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '') != "" ? parseInt(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '')) - excretions1 - excretions2 : 0),
      color: 'green'
    });
    //data.push([vStart, total]);
    //vStart = total
    total -= (excretions1 > 0 ? excretions1 : 0);
    /* 
        dataCurr.push({
          name: 'סה"כ הכנסות',
          isIntermediateSum: true,
          color: '#7B68EE'
        }); */

    dataCurr.push({
      name: 'הפקדות לפנסיה',
      y: 0 - (excretions1 > 0 ? excretions1 : 0),
      color: 'pink'
    });
    //data.push([vStart, total]);
    //vStart = total
    total -= (excretions2 > 0 ? excretions2 : 0);
    dataCurr.push({
      name: 'הפקדנה לקרנות',
      y: 0 - (excretions2 > 0 ? excretions2 : 0),
      color: 'pink'
    });
    //data.push([vStart, total]);

    for (let i = 0; i < this.generalInfoService.AllInfo.SavingViewInfo.SavingRows.length; i++) {

      if (this.generalInfoService.AllInfo.SavingViewInfo.SavingRows[i].FixedMonthly != "") {
        backgroundColors.push("Cyan");
        //vStart = total
        total -= parseFloat(this.generalInfoService.AllInfo.SavingViewInfo.SavingRows[i].FixedMonthly.replace(',', ''));
        dataCurr.push({
          name: this.generalInfoService.AllInfo.SavingViewInfo.SavingRows[i].Type,
          y: 0 - parseFloat(this.generalInfoService.AllInfo.SavingViewInfo.SavingRows[i].FixedMonthly.replace(',', '')),
          color: 'Cyan'
        });
        //data.push([vStart, total]);
        labels = labels.concat(this.generalInfoService.AllInfo.SavingViewInfo.SavingRows[i].Type);
      }
    }

    for (let i = 0; i < this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedExpenseRows.length; i++) {
      if (this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[i].FixedMonthly != "") {
        //vStart = total
        total -= parseFloat(this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[i].FixedMonthly.replace(',', ''));
        dataCurr.push({
          name: this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[i].Type,
          y: 0 - parseFloat(this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[i].FixedMonthly.replace(',', '')),
          color: total >= 0 ? 'yellow' : 'red'
        });
        //data.push([vStart, total]);
        if (total >= 0)
          backgroundColors = backgroundColors.concat('yellow');
        else
          backgroundColors = backgroundColors.concat('red');
        labels = labels.concat(this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[i].Type);
      }
    }

    for (let i = 0; i < this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj.length; i++) {
      if (this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].CalcSum() != "0") {
        //vStart = total
        total -= parseFloat(this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].CalcSum());
        dataCurr.push({
          name: this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].CategoryName,
          y: 0 - parseFloat(this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].CalcSum()),
          color: total >= 0 ? 'orange' : 'red'
        });
        //data.push([vStart, total]);
        if (total >= 0)
          backgroundColors = backgroundColors.concat('orange');
        else
          backgroundColors = backgroundColors.concat('red');
        labels = labels.concat(this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].CategoryName);
      }
    }

    if (total >= 0)
      backgroundColors = backgroundColors.concat('limegreen');
    else
      backgroundColors = backgroundColors.concat('red');

    labels = labels.concat('יתרה')
    /*     for (let i = 0; i < baseData.length; i++) {
          const vStart = total;
          total += baseData[i].value;
          data.push([vStart, total]);
        }
     */

    dataCurr.push({
      name: 'יתרה',
      isSum: true,
      color: total >= 0 ? 'limegreen' : 'red'
    });

    //data.push(total, total);

    /* const series: Highcharts.SeriesOptionsType[] = [];

    let dataCurr: Highcharts.PointOptionsObject[] = [];
    let stack: string[] = [];
    let xAxis: string[] = [];
    let dataCost: Highcharts.PointOptionsObject[] = [];
    for (let i = 0; i < this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows.length; i++) {
      xAxis.push(this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].Route);
      dataCurr.push({ value: parseInt(this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].CurrAmount.replace(',', '')), y: parseInt(this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].CurrAmount.replace(',', '')), name: this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].Route });
      dataCost.push({ value: parseInt(this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].calculateLoanDetails().financingCost.replace(',', '')), y: parseInt(this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].calculateLoanDetails().financingCost.replace(',', '')), name: this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].Route });
      stack.push(this.generalInfoService.AllInfo.MortgagesViewInfo.MortgagesRows[i].Route);
    };

    let s1: Highcharts.SeriesOptionsType = {
      type: 'column', // Add the type property here
      name: 'קרן שנשארה',
      data: dataCurr,
      stack: 'קרן שנשארה',
      color: '#32cd32'
    };
    series.push(s1);

    let s2: Highcharts.SeriesOptionsType = {
      type: 'column', // Add the type property here
      name: 'עלות מימון',
      data: dataCost,
      stack: 'עלות מימון',
      color: '#FF0000'

    };
    
    series.push(s2);
    console.log(series);


    this.generalInfoService.AllInfo.IncomesViewInfo.SumNetIncomes

    */


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

    //let title = (parseInt(this.generalInfoService.AllInfo.CalculateData.SumIncomes.replace(',','')) < parseInt(this.generalInfoService.AllInfo.CalculateData.SumExpenses.replace(',',''))) ? 'אסטרטגיה של עני' : 'אסטרטגיה של עשיר';
    //(this.diagramChartOptions.title as Highcharts.TitleOptions).text = title;

    //console.log(title );
    //more(Highcharts);
    //threeD(Highcharts);
    //Accessibility(Highcharts);
    //patternFill(Highcharts);
    //calculatedWrap(Highcharts);

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

  getStyleFromVal(credit:string)
  {
    let val = parseInt(credit);

    if (val <= 320)
      return '#ff808d';
    else if (val <= 570)
      return '#ff8c39';
    else if (val <= 730)
      return '#ffca39';
    else if (val <= 850)
      return '#00d2c3';
    else
      return '#00d27a';
  }

  CalcYearsLeftFor90Retirement2() {
    return (90 - parseInt(this.generalInfoService.AllInfo.PersonalDataViewInfo.Age2)).toString();
  }

  CalcYearsLeftFor90Retirement1() {
    return (90 - parseInt(this.generalInfoService.AllInfo.PersonalDataViewInfo.Age1)).toString();
  }

  CalcMonthlyInterestRate() {
    return (parseFloat(this.generalInfoService.AllInfo.PersonalDataViewInfo.AnnualInterest) / 12 / 100).toFixed(8).toString();
  }

  CalcYearlyInterestRate() {
    return parseFloat(this.generalInfoService.AllInfo.PersonalDataViewInfo.AnnualInterest) / 100;
  }

    // מונה תווים
    getCharacterCount(): number {
      return this.generalInfoService.AllInfo.GptAIQuestion ? 
             this.generalInfoService.AllInfo.GptAIQuestion.length : 0;
    }
  
    // עדכון מונה תווים
    updateCharacterCount(event: any): void {
      const charCount = event.target.value.length;
      const charCountElement = document.getElementById('charCount');
      if (charCountElement) {
        charCountElement.textContent = charCount.toLocaleString('he-IL');
        
        // שינוי צבע בהתאם לכמות התווים
        if (charCount > 45000) {
          charCountElement.style.color = '#ef4444'; // אדום
        } else if (charCount > 35000) {
          charCountElement.style.color = '#f59e0b'; // כתום
        } else {
          charCountElement.style.color = '#94a3b8'; // אפור
        }
      }
    }
  
    // העתקה ללוח
    async copyToClipboard(): Promise<void> {
      try {
        const text = this.generalInfoService.AllInfo.GptAIQuestion || '';
        await navigator.clipboard.writeText(text);
        
        // הצגת הודעת הצלחה
        this.showNotification('הטקסט הועתק בהצלחה ללוח', 'success');
      } catch (err) {
        console.error('שגיאה בהעתקה:', err);
        this.showNotification('שגיאה בהעתקת הטקסט', 'error');
      }
    }
  
    // הורדת הניתוח כקובץ טקסט
    downloadAnalysis(): void {
      try {
        const text = this.generalInfoService.AllInfo.GptAIQuestion || '';
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `financial-analysis-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(url);
        this.showNotification('הקובץ הורד בהצלחה', 'success');
      } catch (err) {
        console.error('שגיאה בהורדה:', err);
        this.showNotification('שגיאה בהורדת הקובץ', 'error');
      }
    }
  
    // הדפסת הניתוח
    printAnalysis(): void {
      try {
        const text = this.generalInfoService.AllInfo.GptAIQuestion || '';
        const printWindow = window.open('', '_blank');
        
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html dir="rtl" lang="he">
            <head>
              <meta charset="UTF-8">
              <title>ניתוח פיננסי מתקדם</title>
              <style>
                body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  direction: rtl;
                  text-align: right;
                  line-height: 1.8;
                  color: #333;
                  max-width: 800px;
                  margin: 0 auto;
                  padding: 2rem;
                }
                h1 {
                  color: #1e40af;
                  border-bottom: 3px solid #3b82f6;
                  padding-bottom: 1rem;
                  margin-bottom: 2rem;
                }
                .content {
                  white-space: pre-wrap;
                  font-size: 14px;
                  line-height: 1.6;
                }
                .header {
                  text-align: center;
                  margin-bottom: 3rem;
                }
                .date {
                  color: #666;
                  font-size: 12px;
                  margin-top: 1rem;
                }
                @media print {
                  body { margin: 0; padding: 1rem; }
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>ניתוח פיננסי מתקדם</h1>
                <div class="date">תאריך הדוח: ${new Date().toLocaleDateString('he-IL')}</div>
              </div>
              <div class="content">${text}</div>
            </body>
            </html>
          `);
          
          printWindow.document.close();
          printWindow.focus();
          
          // חכה שהתוכן ייטען ואז הדפס
          setTimeout(() => {
            printWindow.print();
            printWindow.close();
          }, 500);
          
          this.showNotification('הניתוח נשלח להדפסה', 'success');
        }
      } catch (err) {
        console.error('שגיאה בהדפסה:', err);
        this.showNotification('שגיאה בהדפסת הניתוח', 'error');
      }
    }
  
    // רענון הניתוח
    refreshAnalysis(): void {
      try {
        // כאן תוכל לקרוא לפונקציה שמרעננת את הניתוח
        this.generalInfoService.DoReportEnglish();
        this.showNotification('הניתוח רוענן בהצלחה', 'success');
      } catch (err) {
        console.error('שגיאה ברענון:', err);
        this.showNotification('שגיאה ברענון הניתוח', 'error');
      }
    }
  
    // הצגת הודעות למשתמש
    private showNotification(message: string, type: 'success' | 'error' | 'info'): void {
      // יצירת אלמנט הודעה
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        min-width: 300px;
        text-align: right;
        direction: rtl;
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        transform: translateX(400px);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      `;
  
      // צבעים לפי סוג ההודעה
      switch (type) {
        case 'success':
          notification.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
          notification.innerHTML = `<i class="bi bi-check-circle me-2"></i>${message}`;
          break;
        case 'error':
          notification.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
          notification.innerHTML = `<i class="bi bi-exclamation-triangle me-2"></i>${message}`;
          break;
        case 'info':
          notification.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
          notification.innerHTML = `<i class="bi bi-info-circle me-2"></i>${message}`;
          break;
      }
  
      document.body.appendChild(notification);
  
      // אנימציה של כניסה
      setTimeout(() => {
        notification.style.transform = 'translateX(0)';
      }, 10);
  
      // הסרה אוטומטית אחרי 3 שניות
      setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }, 3000);
    }
  
    // פונקציה לשמירה אוטומטית (אופציונלי)
    autoSave(): void {
      const textarea = document.getElementById('floatingTextarea') as HTMLTextAreaElement;
      if (textarea) {
        // שמירה ב-localStorage
        localStorage.setItem('financial-analysis-draft', textarea.value);
        
        // עדכון סטטוס
        const statusText = document.querySelector('.status-text');
        if (statusText) {
          statusText.textContent = 'נשמר אוטומטית';
          setTimeout(() => {
            statusText.textContent = 'הניתוח מוכן לצפייה ועריכה';
          }, 2000);
        }
      }
    }
  
    // פונקציה לטעינת טיוטה שמורה
    loadDraft(): void {
      const draft = localStorage.getItem('financial-analysis-draft');
      if (draft && draft !== this.generalInfoService.AllInfo.GptAIQuestion) {
        const shouldLoad = confirm('נמצאה טיוטה שמורה. האם ברצונך לטעון אותה?');
        if (shouldLoad) {
          this.generalInfoService.AllInfo.GptAIQuestion = draft;
          this.showNotification('טיוטה שמורה נטענה בהצלחה', 'info');
        }
      }
    }

  CalcYearsLeftForRetirement1() {
    return (parseInt(this.generalInfoService.AllInfo.PersonalDataViewInfo.RetirementAge1) - parseInt(this.generalInfoService.AllInfo.PersonalDataViewInfo.Age1)).toString();
  }

  CalcYearsLeftForRetirement2() {
    return (parseInt(this.generalInfoService.AllInfo.PersonalDataViewInfo.RetirementAge2) - parseInt(this.generalInfoService.AllInfo.PersonalDataViewInfo.Age2)).toString();
  }

  CalcSumIncomes() {

    let incomes = ((this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
      (this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0));

    let netIncomes = ((this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
      (this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0) +
      (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '')) : 0) -
      (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '')) : 0) -
      (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '')) : 0));

    let allIncomes = ((this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
      (this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0) +
      (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '')) : 0));


    this.generalInfoService.AllInfo.CalculateData.SumIncomes = (allIncomes - (netIncomes - incomes)).toFixed(0).toString();
    return (allIncomes - (netIncomes - incomes)).toFixed(0).toString();

    /* let incomes = ((this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
    (this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0));

    let netIncomes = ((this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
    (this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0) +
    (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '')) : 0) -
    (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '')) : 0) -
    (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '')) : 0));


    return ((this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
      (this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0) +
      (netIncomes - incomes)).toFixed(0).toString(); */
  }

  CalcSumNetIncomes() {

    /* return ((this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
      (this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0) +
      (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '')) : 0) -
      (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '')) : 0) -
      (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '')) : 0)).toFixed(0).toString(); */

    this.generalInfoService.AllInfo.CalculateData.SumNetIncomes = ((this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
      (this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0)).toFixed(0).toString();

    return ((this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
      (this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0)).toFixed(0).toString();

  }


  CalcIncomesEx() {
    let incomes = ((this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
      (this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0));

    let netIncomes = ((this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
      (this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0) +
      (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '')) : 0) -
      (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '')) : 0) -
      (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '')) : 0));

    this.generalInfoService.AllInfo.CalculateData.IncomesEx = (netIncomes - incomes).toFixed(0).toString();
    return (netIncomes - incomes).toFixed(0).toString();
  }


  CalcSumAllIncomes() {
    return (parseInt(this.CalcSumNetIncomes()) + parseInt(this.CalcIncomesEx()))
  }

  CalcSumExpenses() {
    this.generalInfoService.AllInfo.CalculateData.SumExpenses = (this.generalInfoService.AllInfo.FixedExpensesViewInfo.Expenses.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.FixedExpensesViewInfo.Expenses.replace(',', '')) : 0).toFixed(0).toString();
    return (this.generalInfoService.AllInfo.FixedExpensesViewInfo.Expenses.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.FixedExpensesViewInfo.Expenses.replace(',', '')) : 0).toFixed(0).toString();
  }

  CalcSumAllExpenses() {
    return parseInt(this.CalcSumExpenses()) + parseInt(this.CalcSumVariableExpenses());
  }

  CalcSumExpensesPercents() {
    let sumIncomes = this.CalcSumAllIncomes();
    //console.log(sumNetIncomes);

    //console.log("Expenses Calc - " + sumNetIncomes);
    //console.log(incomeEx);
    //console.log(sumIncomes);
    //console.log(this.generalInfoService.AllInfo.IncomesViewInfo.Income[num]);
    if (this.generalInfoService.AllInfo.FixedExpensesViewInfo.Expenses.replace(',', '') != "" && this.generalInfoService.AllInfo.VariableExpensesViewInfo.SatisfactionExpenses != 0)
      return (parseInt(this.generalInfoService.AllInfo.FixedExpensesViewInfo.Expenses.replace(',', '')) + this.generalInfoService.AllInfo.VariableExpensesViewInfo.SatisfactionExpenses) / sumIncomes;
    else
      return 0;
  }

  CalcSumVariableExpenses() {
    this.generalInfoService.AllInfo.CalculateData.SumVariableExpenses = (this.generalInfoService.AllInfo.VariableExpensesViewInfo.SatisfactionExpenses.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.VariableExpensesViewInfo.SatisfactionExpenses.toFixed(0).toString().replace(',', '')) : 0).toFixed(0).toString();
    return (this.generalInfoService.AllInfo.VariableExpensesViewInfo.SatisfactionExpenses.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.VariableExpensesViewInfo.SatisfactionExpenses.toFixed(0).toString().replace(',', '')) : 0).toFixed(0).toString();
  }

  CalcSumSaving() {

    //this.generalInfoService.AllInfo.CalculateData.Saving   = (this.generalInfoService.AllInfo.SavingViewInfo.CurrAmounts != 0 ? this.generalInfoService.AllInfo.SavingViewInfo.CurrAmounts : 0).toFixed(0).toString(); 
    return (this.generalInfoService.AllInfo.SavingViewInfo.CurrAmounts != 0 ? this.generalInfoService.AllInfo.SavingViewInfo.CurrAmounts : 0).toFixed(0).toString();
  }

  CalcNetWorths() {

    this.generalInfoService.AllInfo.RealEstateViewInfo.NetWorths = (this.generalInfoService.AllInfo.RealEstateViewInfo.AssetValues.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.RealEstateViewInfo.AssetValues.replace(',', '')) : 0) -
      (this.generalInfoService.AllInfo.RealEstateViewInfo.NortgageBalances.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.RealEstateViewInfo.NortgageBalances.replace(',', '')) : 0);
    /* 
        for (let i = 0; i < 10; i++) {
          netWorths += (this.generalInfoService.AllInfo.RealEstateViewInfo.RealEstateRows[i].NetWorth.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.RealEstateViewInfo.RealEstateRows[i].NetWorth.replace(',', '')) : 0);
        }
     */
    //this.generalInfoService.AllInfo.FixedExpensesViewInfo.MonthlyExpense1Avg = expenses.toFixed(0).toString();

    this.generalInfoService.AllInfo.CalculateData.NetWorths = this.generalInfoService.AllInfo.RealEstateViewInfo.NetWorths.toFixed(0).toString();
    return this.generalInfoService.AllInfo.RealEstateViewInfo.NetWorths.toFixed(0).toString();
  }

  GetRentCost() {
    let sumRentCost = 0;
    this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedExpenseRows.forEach(element => {
      if (element.Type == "שכר דירה") {
        sumRentCost += parseInt(element.FixedMonthly.replace(',', ''));
      }
    });

    this.generalInfoService.AllInfo.CalculateData.RentCost = sumRentCost.toFixed(0).toString().replace(',', '');
    return sumRentCost;
  }

  cSocialSecurityBenefitsAmounts(num: number) {
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
        this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[num].CalculatedMonthlyAllowances +
        (this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[num].SocialSecurityBenefitsRows[0].Amount.replace(',', '') != "" ? parseInt(this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[num].SocialSecurityBenefitsRows[0].Amount.replace(',', '')) : 0) +
        (this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[num].SocialSecurityBenefitsRows[1].Amount.replace(',', '') != "" ? parseInt(this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[num].SocialSecurityBenefitsRows[1].Amount.replace(',', '')) : 0) +
        (this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[num].SocialSecurityBenefitsRows[2].Amount.replace(',', '') != "" ? parseInt(this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[num].SocialSecurityBenefitsRows[2].Amount.replace(',', '')) : 0));


    return this.generalInfoService.AllInfo.PensiaViewInfo.SumMonthlyPensia[num];
  }

  CalcManagerInsurance() {

    let sumManagerInsurance = 0;
    sumManagerInsurance += this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[0].MonthlyAllowances != 0 ? this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[0].MonthlyAllowances : 0;
    sumManagerInsurance += this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[1].MonthlyAllowances != 0 ? this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[1].MonthlyAllowances : 0;

    this.generalInfoService.AllInfo.CalculateData.ManagerInsurance = sumManagerInsurance.toFixed(0).toString().replace(',', '')
    return sumManagerInsurance;
  }

  CalcPensia() {
    let sumPensia = 0;
    sumPensia += this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[0].CalculatedMonthlyAllowances != 0 ? this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[0].CalculatedMonthlyAllowances : 0;
    sumPensia += this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[1].CalculatedMonthlyAllowances != 0 ? this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[1].CalculatedMonthlyAllowances : 0;

    this.generalInfoService.AllInfo.CalculateData.Pensia = sumPensia.toFixed(0).toString().replace(',', '')
    return sumPensia;
  }

  CalcGemel() {
    let sumGemel = 0;
    sumGemel += this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[0].CalculatedMonthlyAllowances != 0 ? this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[0].CalculatedMonthlyAllowances : 0;
    sumGemel += this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[1].CalculatedMonthlyAllowances != 0 ? this.generalInfoService.AllInfo.PensiaViewInfo.Gemel[1].CalculatedMonthlyAllowances : 0;

    this.generalInfoService.AllInfo.CalculateData.Gemel = sumGemel.toFixed(0).toString().replace(',', '')
    return sumGemel;
  }


  CalcOld() {
    let sumOld = 0;
    sumOld += this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[0].AllowanceAmounts != 0 ? this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[0].AllowanceAmounts : 0;
    sumOld += this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[1].AllowanceAmounts != 0 ? this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[1].AllowanceAmounts : 0;

    this.generalInfoService.AllInfo.CalculateData.Old = sumOld.toFixed(0).toString().replace(',', '') != "0" ? sumOld.toFixed(0).toString().replace(',', '') : "";
    return sumOld;
  }

  CalcSumSource(num: number) {

    this.generalInfoService.AllInfo.LossOfWorkingCapacity.MaximumAmount[num] = (this.generalInfoService.AllInfo.LossOfWorkingCapacity.GrossForPension[num] != "") ? (parseInt(this.generalInfoService.AllInfo.LossOfWorkingCapacity.GrossForPension[num]) * 0.75).toFixed(0).toString() : "";

    let sumSource = 0;

    sumSource += this.generalInfoService.AllInfo.LossOfWorkingCapacity.SocialSecurity[num] != "" ? parseInt(this.generalInfoService.AllInfo.LossOfWorkingCapacity.SocialSecurity[num]) : 0;
    sumSource += this.generalInfoService.AllInfo.LossOfWorkingCapacity.PensionFund[num] != "" ? parseInt(this.generalInfoService.AllInfo.LossOfWorkingCapacity.PensionFund[num]) : 0;
    sumSource += this.generalInfoService.AllInfo.LossOfWorkingCapacity.ManagerInsurance[num] != "" ? parseInt(this.generalInfoService.AllInfo.LossOfWorkingCapacity.ManagerInsurance[num]) : 0;
    sumSource += this.generalInfoService.AllInfo.LossOfWorkingCapacity.PrivateInsurance[num] != "" ? parseInt(this.generalInfoService.AllInfo.LossOfWorkingCapacity.PrivateInsurance[num]) : 0;

    this.generalInfoService.AllInfo.LossOfWorkingCapacity.SumSource[num] = sumSource
    return Math.min(this.generalInfoService.AllInfo.LossOfWorkingCapacity.SumSource[num], parseInt(this.generalInfoService.AllInfo.LossOfWorkingCapacity.MaximumAmount[num] != "" ? this.generalInfoService.AllInfo.LossOfWorkingCapacity.MaximumAmount[num] : "0"));
  }

  CalcSocialSecurityBenefits() {
    let sumSocialSecurityBenefits = 0;
    sumSocialSecurityBenefits += this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[0].Amounts != 0 ? this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[0].Amounts : 0;
    sumSocialSecurityBenefits += this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[1].Amounts != 0 ? this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[1].Amounts : 0;

    this.generalInfoService.AllInfo.CalculateData.SocialSecurityBenefits = sumSocialSecurityBenefits.toFixed(0).toString().replace(',', '')
    return sumSocialSecurityBenefits;
  }


  CalcPensionProvisions() {
    this.generalInfoService.AllInfo.CalculateData.PensionProvisions = this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '');
    return this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '') != "" ? parseInt(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '')) : 0;
  }

  CalcProvisionsForFunds() {
    this.generalInfoService.AllInfo.CalculateData.ProvisionsForFunds = this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '');
    return this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '') != "" ? parseInt(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '')) : 0;
  }

  CalcBaltam() {
    for (let element of this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows) {
      if (element.Comment.includes("בלתי מתוכנן")) {
        this.generalInfoService.AllInfo.CalculateData.Baltam = element.CurrentAmount.replace(',', '');
        return parseInt(element.CurrentAmount.replace(',', ''));
      }
    }
    this.generalInfoService.AllInfo.CalculateData.Baltam = "";
    return 0; // Return a default value if the condition is not met
  }

  CalcSecurityFund() {
    let sum = 0;
    for (let element of this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows) {
      if (element.Comment.includes("קרן חירום")) {
        sum += parseInt(element.CurrentAmount.replace(',', ''));
      }
    }
    this.generalInfoService.AllInfo.CalculateData.SecurityFund = sum.toFixed(0).toString().replace(',', '');
    return sum; // Return a default value if the condition is not met
  }


  CalcFutureExpenses() {
    for (let element of this.generalInfoService.AllInfo.SavingViewInfo.SavingRows) {
      if (element.Type == "הוצאות עתידיות") {
        this.generalInfoService.AllInfo.CalculateData.FutureExpenses = element.CurrentAmount.replace(',', '');
        return parseInt(element.CurrentAmount.replace(',', ''));
      }
    }
    this.generalInfoService.AllInfo.CalculateData.FutureExpenses = "";
    return 0; // Return a default value if the condition is not met
  }

  CalcGeneral() {
    for (let element of this.generalInfoService.AllInfo.SavingViewInfo.SavingRows) {
      if (element.Type == "חסכון כללי") {
        this.generalInfoService.AllInfo.CalculateData.General = element.CurrentAmount.replace(',', '');
        return parseInt(element.CurrentAmount.replace(',', ''));
      }
    }
    this.generalInfoService.AllInfo.CalculateData.General = "";
    return 0; // Return a default value if the condition is not met
  }

  CalcLifeInsurances1() {
    this.generalInfoService.AllInfo.CalculateData.LifeInsurances1 = this.generalInfoService.AllInfo.LifeInsurancesViewInfo.CapitalAmounts[0].toFixed(0);
    return parseInt(this.generalInfoService.AllInfo.LifeInsurancesViewInfo.CapitalAmounts[0].toFixed(0));
  }

  CalcLifeInsurances2() {
    this.generalInfoService.AllInfo.CalculateData.LifeInsurances2 = this.generalInfoService.AllInfo.LifeInsurancesViewInfo.CapitalAmounts[1].toFixed(0);
    return parseInt(this.generalInfoService.AllInfo.LifeInsurancesViewInfo.CapitalAmounts[1].toFixed(0));
  }

  CalcLongTermCareCompany1() {
    this.generalInfoService.AllInfo.CalculateData.LongTermCareCompany1 = this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.First5YearHomeAmounts[0].toFixed(0);
    return parseInt(this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.First5YearHomeAmounts[0].toFixed(0));
  }

  CalcLongTermCareCompany2() {
    this.generalInfoService.AllInfo.CalculateData.LongTermCareCompany2 = this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.First5YearHomeAmounts[1].toFixed(0);
    return parseInt(this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.First5YearHomeAmounts[1].toFixed(0));
  }

  CalcPaymentOfAlimony() {
    for (let element of this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedExpenseRows) {
      if (element.Type == "מזונות") {
        this.generalInfoService.AllInfo.CalculateData.PaymentOfAlimony = element.FixedMonthly.replace(',', '');
        return parseInt(element.FixedMonthly.replace(',', ''));
      }
    }
    this.generalInfoService.AllInfo.CalculateData.PaymentOfAlimony = "";
    return 0; // Return a default value if the condition is not met
  }

  /*   CalculateYearsToFinancialIndependence(
      monthlyIncome: number,
      fixedExpenses: number,
      variableExpenses: number,
      alimonyPayment: number,
      liquidAssets: number,
      illiquidAssets: number,
      desiredWithdrawalRate: number,
      investmentReturnRate: number
    ): number {
      const yearlyFixedAndVariableExpenses = (fixedExpenses - alimonyPayment) + variableExpenses;
      const targetTotalSavings = yearlyFixedAndVariableExpenses / desiredWithdrawalRate;
      let totalSavings = liquidAssets + illiquidAssets;
      let numberOfYears = 2; // Starting with 20 years, you can adjust this value if needed
      while (totalSavings < targetTotalSavings) {
        totalSavings = (totalSavings * (1 + investmentReturnRate)) + (monthlyIncome - yearlyFixedAndVariableExpenses) * numberOfYears;
        numberOfYears++;
      }
      return numberOfYears;
    } */

  CalculateYearsToFinancialIndependence(

    monthlyIncome: number,

    fixedExpenses: number,

    variableExpenses: number,

    alimonyPayment: number,

    liquidAssets: number,

    illiquidAssets: number,

    desiredWithdrawalRate: number,

    investmentReturnRate: number

  ): { NumberOfYears: number, Amount: number } {

    const yearlyFixedAndVariableExpenses = (fixedExpenses - alimonyPayment) + variableExpenses;

    //console.log("yearlyFixedAndVariableExpenses = " + yearlyFixedAndVariableExpenses);

    const targetTotalSavings = (yearlyFixedAndVariableExpenses * 12) / desiredWithdrawalRate;

    //console.log("targetTotalSavings = " + targetTotalSavings);

    let totalSavings = liquidAssets + illiquidAssets;

    //console.log("totalSavings = " + totalSavings);

    let numberOfYears = 2; // Starting with 20 years, you can adjust this value if needed

    let amount = 0;

    //console.log(parseInt(this.generalInfoService.AllInfo.PersonalDataViewInfo.RetirementAge1));
    while (totalSavings < targetTotalSavings && numberOfYears <= parseInt(this.generalInfoService.AllInfo.PersonalDataViewInfo.RetirementAge1)) {

      totalSavings = ((totalSavings * (1 + investmentReturnRate)) + ((monthlyIncome - yearlyFixedAndVariableExpenses) * 12));

      //console.log("totalSavings = " + totalSavings);

      numberOfYears++;

      //console.log("numberOfYears = " + numberOfYears);

    }



    //console.log(targetTotalSavings);

    amount = targetTotalSavings;

    if (numberOfYears > parseInt(this.generalInfoService.AllInfo.PersonalDataViewInfo.RetirementAge1))
      return { NumberOfYears: 999, Amount: amount };
    else
      return { NumberOfYears: numberOfYears, Amount: amount };
  }

  /*   CalcYearsToFinancialFreedom() {
      let a = (parseInt(this.CalcSumExpenses().replace(',', '')) + parseInt(this.CalcSumVariableExpenses().replace(',', '')))
      let b = this.generalInfoService.AllInfo.IncomesViewInfo.SumNetIncomes;
  
      //console.log("CalculateYearsToFinancialIndependence - " + this.CalculateYearsToFinancialIndependence(parseInt(this.CalcSumNetIncomes().replace(',','')) + parseInt(this.CalcIncomesEx().replace(',','')) ,parseInt(this.CalcSumExpenses().replace(',','')),parseInt(this.CalcSumVariableExpenses().replace(',','')) ,this.CalcPaymentOfAlimony(),this.CalcFutureExpenses(),this.CalcGeneral(),0.04,0.07 ));
  
      return ((Math.log(((a / b) * (1 / 0.04) * 0.07 / ((b - a) / b)) + 1)) / (Math.log(1 + 0.07))).toFixed(2);
    } */

  //CalculateYearsToFinancialIndependence(24800,12000,5800,5550,330000,112000,0.04,0.07)

  CalcYearsToFinancialFreedomCalculated() {
    return this.CalculateYearsToFinancialIndependence(parseInt(this.CalcSumNetIncomes().replace(',', '')) + parseInt(this.CalcIncomesEx().replace(',', '')), parseInt(this.CalcSumExpenses().replace(',', '')), parseInt(this.CalcSumVariableExpenses().replace(',', '')), this.CalcPaymentOfAlimony(), parseInt(this.CalcFinanceLiquidityAssets().replace(',', '')), parseInt(this.CalcFinanceUnliquidityAssets().replace(',', '')), 0.04, 0.07);
  }

  CalcYearsToFinancialFreedomWAlimonyCalculated() {
    return this.CalculateYearsToFinancialIndependence(parseInt(this.CalcSumNetIncomes().replace(',', '')) + parseInt(this.CalcIncomesEx().replace(',', '')), parseInt(this.CalcSumExpenses().replace(',', '')), parseInt(this.CalcSumVariableExpenses().replace(',', '')), 0, parseInt(this.CalcFinanceLiquidityAssets().replace(',', '')), parseInt(this.CalcFinanceUnliquidityAssets().replace(',', '')), 0.04, 0.07);
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


  CalcVehiclesNetWorths() {

    this.generalInfoService.AllInfo.VehiclesViewInfo.VehicleWorths = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.VehiclesViewInfo.VehiclesRows.length; i++) {
      this.generalInfoService.AllInfo.VehiclesViewInfo.VehicleWorths += (this.generalInfoService.AllInfo.VehiclesViewInfo.VehiclesRows[i].VehicleWorth.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.VehiclesViewInfo.VehiclesRows[i].VehicleWorth.replace(',', '')) : 0);
    }

    this.generalInfoService.AllInfo.CalculateData.VehiclesNetWorths = this.generalInfoService.AllInfo.VehiclesViewInfo.VehicleWorths.toFixed(0).toString() != "0" ? this.generalInfoService.AllInfo.VehiclesViewInfo.VehicleWorths.toFixed(0).toString() : "";
    return this.generalInfoService.AllInfo.VehiclesViewInfo.VehicleWorths.toFixed(0).toString();
  }

  CalcFinanceLiquidityAssets() {

    this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceLiquidityAssets = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows.length; i++) {
      this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceLiquidityAssets += (this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[i].CurrentAmount.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[i].CurrentAmount.replace(',', '')) : 0);
    }

    this.generalInfoService.AllInfo.CalculateData.FinanceLiquidityAssets = this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceLiquidityAssets.toFixed(0).toString() != "0" ? this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceLiquidityAssets.toFixed(0).toString() : "";
    return this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceLiquidityAssets.toFixed(0).toString();
  }

  CalcFinanceUnliquidityAssets() {

    this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssets = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows.length; i++) {
      this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssets += (this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows[i].CurrentAmount.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows[i].CurrentAmount.replace(',', '')) : 0);
    }


    this.generalInfoService.AllInfo.CalculateData.FinanceUnliquidityAssets = this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssets.toFixed(0).toString() != "0" ? this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssets.toFixed(0).toString() : "";
    return this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssets.toFixed(0).toString();
  }

  CalcSumFinance() {
    return parseInt(this.generalInfoService.AllInfo.CalculateData.FinanceLiquidityAssets.replace(',', '')) + parseInt(this.generalInfoService.AllInfo.CalculateData.FinanceUnliquidityAssets.replace(',', ''));
  }

  CalcSumFinancePercents() {
    let sumAllAsserts = (this.generalInfoService.AllInfo.RealEstateViewInfo.NetWorths != 0 ? this.generalInfoService.AllInfo.RealEstateViewInfo.NetWorths : 0) +
      (this.generalInfoService.AllInfo.VehiclesViewInfo.VehicleWorths != 0 ? this.generalInfoService.AllInfo.VehiclesViewInfo.VehicleWorths : 0) +
      parseInt(this.generalInfoService.AllInfo.CalculateData.FinanceLiquidityAssets.replace(',', '')) +
      parseInt(this.generalInfoService.AllInfo.CalculateData.FinanceUnliquidityAssets.replace(',', ''));

    //console.log(sumAllAsserts);
    return (parseInt(this.generalInfoService.AllInfo.CalculateData.FinanceLiquidityAssets.replace(',', '')) + parseInt(this.generalInfoService.AllInfo.CalculateData.FinanceUnliquidityAssets.replace(',', ''))) / sumAllAsserts;

  }

  CalcAmounts() {
    this.generalInfoService.AllInfo.CommitmentsViewInfo.CurrentAmount = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.CommitmentsViewInfo.CommitmentsRows.length; i++) {
      this.generalInfoService.AllInfo.CommitmentsViewInfo.CurrentAmount += (this.generalInfoService.AllInfo.CommitmentsViewInfo.CommitmentsRows[i].CurrAmount.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.CommitmentsViewInfo.CommitmentsRows[i].CurrAmount.replace(',', '')) : 0);
    }

    this.generalInfoService.AllInfo.CalculateData.CommitmentAmounts = (this.generalInfoService.AllInfo.CommitmentsViewInfo.CurrentAmount.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.CommitmentsViewInfo.CurrentAmount.toFixed(0).toString().replace(',', '')) : 0).toFixed(0).toString();
    return this.generalInfoService.AllInfo.CommitmentsViewInfo.CurrentAmount.toFixed(0).toString();

  }

  CalcSumMortgages() {
    this.generalInfoService.AllInfo.CalculateData.SumMortgages = (this.generalInfoService.AllInfo.MortgagesViewInfo.CostOfFinancings.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.MortgagesViewInfo.CostOfFinancings.toFixed(0).toString().replace(',', '')) : 0).toFixed(0).toString();
    return (this.generalInfoService.AllInfo.MortgagesViewInfo.CostOfFinancings.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.MortgagesViewInfo.CostOfFinancings.toFixed(0).toString().replace(',', '')) : 0).toFixed(0).toString();
  }

  /*   async TranslateSimple(sourceText: string,to:string) {
      console.log(`Translating: ${sourceText}`);
      const { text } = await translate(sourceText, { to: to });
      console.log(`Result: ${text}`);
    } */


  DoReport() {
    let currTemplate = "";
    currTemplate = `אתה יועץ מומחה לכלכלת המשפחה , מצרף לך נתונים פיננסים מלאים על משפחה מסויימת ומבקש ממך לתת ניתוח פיננסי מקסימלי לנתונים הפיננסים המצורפים.`;
    if (this.generalInfoService.AllInfo.PersonalDataViewInfo.SelectedStatus1 == "נשוי") {
      currTemplate += `משפחה עם הכנסה נטו של ${parseInt(this.generalInfoService.AllInfo.CalculateData.SumNetIncomes).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })}.`;
    }
    else {
      currTemplate += `
            
${this.generalInfoService.AllInfo.PersonalDataViewInfo.SelectedStatus1} בן ${this.generalInfoService.AllInfo.PersonalDataViewInfo.Age1}`;

    }

    if (parseInt(this.generalInfoService.AllInfo.PersonalDataViewInfo.NumberOfChildren1) >= 2) {
      currTemplate += ` עם ${this.generalInfoService.AllInfo.PersonalDataViewInfo.NumberOfChildren1} ילדים בני `;
      for (let child of this.generalInfoService.AllInfo.PersonalDataViewInfo.Child) {
        currTemplate += `${child.Age} ,`;
      }
      currTemplate = currTemplate.slice(0, -1);
      currTemplate += ".";
    }
    else if (parseInt(this.generalInfoService.AllInfo.PersonalDataViewInfo.NumberOfChildren1) == 1) {
      currTemplate += `עם ילד בן ${this.generalInfoService.AllInfo.PersonalDataViewInfo.Child[0].Age}.`;
    }


    currTemplate += `הכנסה נטו של ${parseInt(this.generalInfoService.AllInfo.CalculateData.SumNetIncomes).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })}.`;

    if (this.generalInfoService.AllInfo.CalculateData.IncomesEx != "")
      currTemplate += `הכנסות נוספות של ${parseInt(this.generalInfoService.AllInfo.CalculateData.IncomesEx).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })}.`;
    if (this.generalInfoService.AllInfo.CalculateData.PensionProvisions != "0" && this.generalInfoService.AllInfo.CalculateData.ProvisionsForFunds != "0") {
      currTemplate += `הפרשות פנסיוניות מעבר להכנסה נטו בסך של ${parseInt(this.generalInfoService.AllInfo.CalculateData.PensionProvisions).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })} `;
      currTemplate += `והפרשות לקרנות השתלמות בסך של ${parseInt(this.generalInfoService.AllInfo.CalculateData.ProvisionsForFunds).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })}.`;
    }
    else if (this.generalInfoService.AllInfo.CalculateData.ProvisionsForFunds != "0" && this.generalInfoService.AllInfo.CalculateData.ProvisionsForFunds == "0")
      currTemplate += `הפרשות לקרנות השתלמות מעבר להכנסה נטו בסך של ${parseInt(this.generalInfoService.AllInfo.CalculateData.ProvisionsForFunds).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })}.`;
    else if (this.generalInfoService.AllInfo.CalculateData.ProvisionsForFunds == "0" && this.generalInfoService.AllInfo.CalculateData.ProvisionsForFunds != "0")
      currTemplate += `הפרשות פנסיוניות מעבר להכנסה נטו בסך של ${parseInt(this.generalInfoService.AllInfo.CalculateData.PensionProvisions).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })}.`;
    else
      currTemplate += `אין הפרשות פנסיוניות או לקרנות השתלמות כלל.`;

    if (this.generalInfoService.AllInfo.CalculateData.ManagerInsurance != "")
      currTemplate += `יש ביטוח מנהלים בסך של ${parseInt(this.generalInfoService.AllInfo.CalculateData.ManagerInsurance).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })}.`;

    if (this.generalInfoService.AllInfo.CalculateData.Pensia != "")
      currTemplate += `יש קרן פנסיה בסך של ${parseInt(this.generalInfoService.AllInfo.CalculateData.Pensia).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })}.`;

    if (this.generalInfoService.AllInfo.CalculateData.SocialSecurityBenefits != "")
      currTemplate += `קצבת הביטוח לאומי העתידית היא בסך של ${parseInt(this.generalInfoService.AllInfo.CalculateData.SocialSecurityBenefits).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })}.`;

    if (this.generalInfoService.AllInfo.CalculateData.SumExpenses != "")
      currTemplate += `הוצאות קבועות בסך של ${parseInt(this.generalInfoService.AllInfo.CalculateData.SumExpenses).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })}.`;
    if (this.generalInfoService.AllInfo.CalculateData.SumVariableExpenses != "")
      currTemplate += `הוצאות שוטפות בסך של ${parseInt(this.generalInfoService.AllInfo.CalculateData.SumVariableExpenses).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })}.`;
    if (this.generalInfoService.AllInfo.CalculateData.CommitmentAmounts != '0')
      currTemplate += `חובות בסך של ${parseInt(this.generalInfoService.AllInfo.CalculateData.CommitmentAmounts).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })}.`;
    else
      currTemplate += `אין חובות,`;

    if (this.generalInfoService.AllInfo.CalculateData.SumMortgages != "")
      currTemplate += `משכנתה בסך של ${parseInt(this.generalInfoService.AllInfo.CalculateData.SumMortgages).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })}.`;
    else
      currTemplate += `אין משכנתה,`;

    if (this.generalInfoService.AllInfo.CalculateData.RentCost != "")
      currTemplate += `תשלום שכר דירה בסך של ${parseInt(this.generalInfoService.AllInfo.CalculateData.RentCost).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })}.`;
    else
      currTemplate += `לא משלם שכירות,`;

    if (this.generalInfoService.AllInfo.CalculateData.Baltam != "")
      currTemplate += `יש חיסכון לבלת"מ בסך של ${parseInt(this.generalInfoService.AllInfo.CalculateData.Baltam).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })}.`;

    if (this.generalInfoService.AllInfo.CalculateData.SecurityFund != "")
      currTemplate += `יש קרן חירום בסך של ${parseInt(this.generalInfoService.AllInfo.CalculateData.SecurityFund).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })}.`;

    if (this.generalInfoService.AllInfo.CalculateData.FutureExpenses != "")
      currTemplate += `יש חיסכון להוצאות עתידיות בסך של ${parseInt(this.generalInfoService.AllInfo.CalculateData.FutureExpenses).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })}.`;

    if (this.generalInfoService.AllInfo.CalculateData.General != "")
      currTemplate += `יש חיסכון כללי בסך של ${parseInt(this.generalInfoService.AllInfo.CalculateData.General).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })}.`;

    if (this.generalInfoService.AllInfo.CalculateData.NetWorths != "")
      currTemplate += `יש נכסים נדל"נים בסך של ${parseInt(this.generalInfoService.AllInfo.CalculateData.NetWorths).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })}.`;

    if (this.generalInfoService.AllInfo.CalculateData.VehiclesNetWorths != "")
      currTemplate += `מחזיק רכב בשווי נוכחי של ${parseInt(this.generalInfoService.AllInfo.CalculateData.VehiclesNetWorths).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })}.`;

    if (this.generalInfoService.AllInfo.CalculateData.FinanceLiquidityAssets != "")
      currTemplate += `יש נכסים פיננסים נזילים בסך של ${parseInt(this.generalInfoService.AllInfo.CalculateData.FinanceLiquidityAssets).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })}.`;

    if (this.generalInfoService.AllInfo.CalculateData.FinanceUnliquidityAssets != "")
      currTemplate += `יש נכסים פיננסים לא נזילים בסך של ${parseInt(this.generalInfoService.AllInfo.CalculateData.FinanceUnliquidityAssets).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })}.`;

    if (this.generalInfoService.AllInfo.CalculateData.LifeInsurances1 != "")
      currTemplate += `יש ביטוח חיים בסך של ${parseInt(this.generalInfoService.AllInfo.CalculateData.LifeInsurances1).toLocaleString('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0 })}.`;

    currTemplate = currTemplate.slice(0, -1);

    currTemplate += `

בבקשה תיתן את הניתוח בצורה מעוצבת ,עם חלוקת לקטגוריות שונות.`;

    this.generalInfoService.AllInfo.GptAIQuestion = currTemplate;//.replace(/\t/g, '');






  }

  /*

   chart: {
        type: 'waterfall',
      backgroundColor: 'black'
 
    },

    title: {
        text: 'לאן זורם הכסף',
      style: { "color": 'white' }
    },

    xAxis: {
        type: 'קטגוריות',
        categories: ['הכנסה משותפת','הכנסה משותפת','הכנסה משותפת','הכנסה משותפת','הכיתרה','הכנסה משותפת'],
      labels: {
      style: {
        color: 'white'
      }
    }
    },

    yAxis: {
        title: {
            text: 'ש"ח'
        },
      labels: {
      style: {
        color: 'white'
      }
    }
    },

    legend: {
        enabled: false
    },

    tooltip: {
        pointFormat: '<b>${point.y:,.2f}</b> ש"ח'
    },

    series: [{
        upColor: Highcharts.getOptions().colors[2],
        color: Highcharts.getOptions().colors[3],
        data: [{
            name: 'הכנסה משותפת',
            y: 24800
        }, {
            name: 'הפרשות בתלוש',
            y: 8580
        }, {
            name: 'הכנסות נוספות',
            y: 800
        }, {
            name: 'הפקדות לפנסיה',
            y: -6145
        }, {
            name: 'חסכון כללי',
            y: -2000
        }, {
            name: 'Balance',
            isSum: true,
            color: Highcharts.getOptions().colors[1]
        }],
        dataLabels: {
            enabled: true,
            format: '{divide y 1000}k'
        },
        pointPadding: 0
    }]

    */
  /*  createChart() {
 
     let labels = ["הכנסה משותפת", "הפרשות בתלוש", "הכנסות נוספות", "הפקדות לפנסיה", "הפקדנה לקרנות"];
     let backgroundColors = ['green', 'green', 'green', 'pink', 'pink'];
 
     const data = [];
     let total = 0;
     var vStart = total;
     total += this.generalInfoService.AllInfo.IncomesViewInfo.SumNetIncomes;
     data.push([vStart, total]);
     vStart = total
 
     var excretions1 = 0;
     var excretions2 = 0;
     excretions1 = this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '') != "" ? parseInt(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '')) : 0;
     //console.log(excretions1);
     excretions2 = this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '') != "" ? parseInt(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '')) : 0;
     //console.log(excretions2);
     total += (excretions1 + excretions2 > 0 ? excretions1 + excretions2 : 50);
     //console.log(excretions1 + excretions2);
     data.push([vStart, total]);
     vStart = total
     total += this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '') != "" ? parseInt(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '')) - excretions1 - excretions2 : 50;
     //console.log(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',','') != "" ? parseInt(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',','')) - excretions1 - excretions2 : 1);
     data.push([vStart, total]);
     vStart = total
     total -= (excretions1 > 0 ? excretions1 : 50);
     data.push([vStart, total]);
     vStart = total
     total -= (excretions2 > 0 ? excretions2 : 50);
     data.push([vStart, total]);
 
     for (let i = 0; i < this.generalInfoService.AllInfo.SavingViewInfo.SavingRows.length; i++) {
 
       if (this.generalInfoService.AllInfo.SavingViewInfo.SavingRows[i].FixedMonthly != "") {
         backgroundColors.push("Cyan");
         vStart = total
         total -= parseFloat(this.generalInfoService.AllInfo.SavingViewInfo.SavingRows[i].FixedMonthly.replace(',', ''));
         data.push([vStart, total]);
         labels = labels.concat(this.generalInfoService.AllInfo.SavingViewInfo.SavingRows[i].Type);
       }
     }
 
     for (let i = 0; i < this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedExpenseRows.length; i++) {
       if (this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[i].FixedMonthly != "") {
         vStart = total
         total -= parseFloat(this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[i].FixedMonthly.replace(',', ''));
         data.push([vStart, total]);
         if (total >= 0)
           backgroundColors = backgroundColors.concat('yellow');
         else
           backgroundColors = backgroundColors.concat('red');
         labels = labels.concat(this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[i].Type);
       }
     }
 
     for (let i = 0; i < this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj.length; i++) {
       if (this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].CalcSum() != "0") {
         vStart = total
         total -= parseFloat(this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].CalcSum());
         data.push([vStart, total]);
         if (total >= 0)
           backgroundColors = backgroundColors.concat('orange');
         else
           backgroundColors = backgroundColors.concat('red');
         labels = labels.concat(this.generalInfoService.AllInfo.VariableExpensesViewInfo.VariableExpensesCategoryRowObj[i].CategoryName);
       }
     }
 
     if (total >= 0)
       backgroundColors = backgroundColors.concat('limegreen');
     else
       backgroundColors = backgroundColors.concat('red');
 
     labels = labels.concat('יתרה')
     /*     for (let i = 0; i < baseData.length; i++) {
           const vStart = total;
           total += baseData[i].value;
           data.push([vStart, total]);
         }
      */

  //data.push(total, total);
  //const backgroundColors = data.map((o, i) => 'rgba(255, 99, 132, ' + (i + (11 - data.length)) * 0.1 + ')');

  /*  const nf = new Intl.NumberFormat("en-US", {
     style: "currency",
     currency: "ILS",
     maximumFractionDigits: 0
   });

   const footer = (tooltipItems: any) => {
     let sum = 0;
     //console.log(tooltipItems);
     if (tooltipItems[0].raw.length == 2)
       return `${nf.format(tooltipItems[0].raw[1] - tooltipItems[0].raw[0])} `;
     else
       return `${nf.format(tooltipItems[0].raw)}`;
   };
*/

  /* this.chart?.destroy();

  let delayed = false;
  this.chart = new Chart('MyChart', {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: '',
        data: data,
        backgroundColor: backgroundColors,
        barPercentage: 1,
      }],
    },
    options: {
      animation: {
        onComplete: () => {
          delayed = true;
        },
        delay: (context) => {
          let delay = 0;
          if (context.type === 'data' && context.mode === 'default' && !delayed) {
            delay = context.dataIndex * 200 + context.datasetIndex * 50;
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
          display: false,
          labels: {
            // This more specific font property overrides the global property
            font: {
              size: 20
            },
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
            color: function (context) {
              if (context.tick.value == 0) {
                return 'red';
              } else
                return 'transparent';
            }
          },
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    }
  }) */

  /*   this.chart = new Chart("MyChart", {
      type: 'bar', //this denotes tha type of chart
 
      data: {// values on X-Axis
        labels: ['2022-05-10', '2022-05-11', '2022-05-12', '2022-05-13',
          '2022-05-14', '2022-05-15', '2022-05-16', '2022-05-17',],
        datasets: [
          {
            label: "Sales",
            data: ['467', '576', '572', '79', '92',
              '574', '573', '576'],
            backgroundColor: 'blue'
          },
          {
            label: "Profit",
            data: ['542', '542', '536', '327', '17',
              '0.00', '538', '541'],
            backgroundColor: 'limegreen'
          }
        ]
      },
      options: {
        aspectRatio: 2.5
      }
 
    });
  } 
} */
}
