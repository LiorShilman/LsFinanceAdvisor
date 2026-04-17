import { Component, OnInit } from '@angular/core';
import { GeneralInfoService } from 'src/app/services/general-info.service';
import { Chart } from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OneOffFamilyGoalsEmbedComponent } from './one-off-family-goals-embed.component';


declare var bootstrap: any;

@Component({
  selector: 'app-one-off-family-goals',
  templateUrl: './one-off-family-goals.component.html',
  styleUrls: ['./one-off-family-goals.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule,OneOffFamilyGoalsEmbedComponent]
})
export class OneOffFamilyGoalsComponent implements OnInit {

  public chart: any;
  public chartF: any;
  ColorArray: string[];
  Data: number[];

  constructor(public generalInfoService: GeneralInfoService) {
    this.ColorArray = new Array<string>(14);
    this.ColorArray[0] = "#5C2D8A";
    this.ColorArray[1] = "#8F49D6";
    this.ColorArray[2] = "#AB71EE";
    this.ColorArray[3] = "#B6A0EC";
    this.ColorArray[4] = "#D2B0EA";
    this.ColorArray[5] = "#D9E1F2";
    this.ColorArray[6] = "#B4C6E7";
    this.ColorArray[7] = "#8EA9DB";
    this.ColorArray[8] = "#4472C4";
    this.ColorArray[9] = "#4472C4";
    this.ColorArray[10] = "#4472C4";
    this.ColorArray[11] = "#305496";
    this.ColorArray[12] = "#305496";
    this.ColorArray[13] = "#1E328F";
    this.ColorArray[14] = "#1E328F";
    /*     this.ColorArray[11] = "#203764";
    this.ColorArray[12] = "#203764"; */
    this.Data = [];
  }

  ngOnInit(): void {
    // Bootstrap tooltip initialization
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    Chart.register(annotationPlugin);

    this.createChart();
    this.createChartF();
  }

  GetYear(cnt: number) {
    return new Date().getFullYear() + cnt;
  }

  MaxYear() {
    return parseInt(this.generalInfoService.AllInfo.PersonalDataViewInfo.RetirementAge1) - parseInt(this.generalInfoService.AllInfo.PersonalDataViewInfo.Age1) + 1;
  }

  CalcYear(cnt: number) {
    this.generalInfoService.AllInfo.IncomesGoalsViewInfo.AmountInYear[cnt] = 0;

    this.generalInfoService.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows.forEach((element: any) => {
      this.generalInfoService.AllInfo.IncomesGoalsViewInfo.AmountInYear[cnt] += element.AmountInYear[cnt] != undefined ? parseInt(element.AmountInYear[cnt].toString().replace(',', '')) : 0;
    });

    return this.generalInfoService.AllInfo.IncomesGoalsViewInfo.AmountInYear[cnt].toString();
  }

  CalcCategory(cnt: number) {

    this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[cnt].SumOfCategory = 0;

    this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[cnt].AmountInYear.forEach((element: any) => {
      this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[cnt].SumOfCategory += (element != undefined && element != "") ? parseInt(element.toString().replace(',', '')) : 0;
    });

    return this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[cnt].SumOfCategory.toString() != "0" ? this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows[cnt].SumOfCategory.toString() : "0";

  }

  //C32*(1+$D$35)+D31+D27
  GetCumulativeByIdx(generalInfoService: GeneralInfoService, cnt: number, additionalDeposit: number) {
    //console.log(cnt);
    var array2Check = [];
    array2Check = new Array<number>(cnt + 1);
    for (let i = 0; i <= cnt; i++) {
      /*       console.log("i = " + i);
       */
      if (i == 0) {
        let b = generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeReturnOnInvestmentOneOffFamilyGoalsRow.CumulativeReturnOnInvestment != "";
        let c = generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeReturnOnInvestmentOneOffFamilyGoalsRow.CumulativeReturnOnInvestment.replace(',', '');
        //console.log(this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.Exist);
        array2Check[0] = (parseInt(additionalDeposit.toString().replace(',', '')) * 12) + (parseInt(generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.Exist.toString().replace(',', '')) * (1 + (b ? (parseFloat(c) / 100) : 0)));
      }
      else {
        /*       console.log(cnt);
              console.log(this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.AmountInYear);
         */
        let a = array2Check[i - 1];
        let b = generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeReturnOnInvestmentOneOffFamilyGoalsRow.CumulativeReturnOnInvestment != "";
        let c = generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeReturnOnInvestmentOneOffFamilyGoalsRow.CumulativeReturnOnInvestment.replace(',', '');
        let d = (generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.DepositFromFundsOneOffFamilyGoalsRow.AmountInYear[i] + additionalDeposit) * 12;
        //console.log(generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.DepositFromFundsOneOffFamilyGoalsRow.AmountInYear[i]);
        //console.log(additionalDeposit);
        //console.log(d);
        let sumNeed = 0;

        generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows.forEach((element: any) => {
          sumNeed -= ((element.AmountInYear[i] != undefined && element.AmountInYear[i] != "") ? parseInt(element.AmountInYear[i].toString().replace(',', '')) : 0);
        });

        let e = sumNeed;

        // console.log("a = " + a);
        //console.log(b);
        //console.log("c - " + c);
        //console.log("d - " + d);
        //console.log("e - " + e);
        //console.log(((a * (1 + (b ? (parseFloat(c) / 100) : 0)) + d + e)));
        array2Check[i] =
          parseInt(((a * (1 + (b ? (parseFloat(c) / 100) : 0)) + d + e)).toFixed(0).toString().replace(',', ''));
        // console.log(array2Check);
      }
    }
    //console.log(array2Check);
    return array2Check[cnt];
  }

  GoalSeek(
    objectiveFunction: (generalInfoService: GeneralInfoService, cnt: number, additionalDeposit: number) => number,
    startVal: number,
    idx: number,
    target: number,
    tolerance: number,
    maxIterations: number
  ): number | null {
    var x = parseInt(startVal.toString()); // Initial guess
    //console.log("x startVal = " + x);
    let iteration = 0;

    while (iteration < maxIterations) {
      const result = objectiveFunction(this.generalInfoService, idx, x);
      //console.log("result - " + result);

      //console.log(`result = ${result} , target = ${target}`);
      if (/*Math.abs(result - target) < tolerance ||*/ result > target) {
        //console.log("x = " + x);
        return x; // Goal met within tolerance
      }

      if (target - result > 1000)
        // Adjust x based on the difference between result and target
        x = x + 100; // Adjust factor can vary
      else
        x = x + 5; // Adjust factor can vary
      //console.log("x111 = " + x);
      //console.log("x - " + x);

      iteration++;
    }

    //console.log("return null");
    return null; // Goal not met within maxIterations
  }

  CalcNeedOnYear(cnt: number) {

    //const result = this.GoalSeek(this.GetCumulativeByIdx, 6000, 6, 2000, 0.001, 20);
    //console.log(result); / / Output: 5(approximately)

    this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.NeedOneOffFamilyGoalsRow.AmountInYear[cnt] = 0;

    this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.OneOffFamilyGoalsRows.forEach((element: any) => {
      this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.NeedOneOffFamilyGoalsRow.AmountInYear[cnt] -= ((element.AmountInYear[cnt] != undefined && element.AmountInYear[cnt] != "") ? parseInt(element.AmountInYear[cnt].toString().replace(',', '')) : 0);
    });

    return this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.NeedOneOffFamilyGoalsRow.AmountInYear[cnt].toString() != "0" ? this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.NeedOneOffFamilyGoalsRow.AmountInYear[cnt].toString().replace(',', '') : "0";
  }

  CalcTotalMonthlySavings(cnt: number) {
    this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.TotalMonthlySavingsOneOffFamilyGoalsRow.AmountInYear[cnt] = parseInt(this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.DepositFromFundsOneOffFamilyGoalsRow.AmountInYear[cnt].toString().replace(',', '')) + (this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.AdditionalDepositOneOffFamilyGoalsRow.AmountInYear[cnt].toString().replace(',', '') != "" ? parseInt(this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.AdditionalDepositOneOffFamilyGoalsRow.AmountInYear[cnt].toString().replace(',', '')) : 0);
    //console.log("Monthly = " + this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.TotalMonthlySavingsOneOffFamilyGoalsRow.AmountInYear[cnt]);
    return ((this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.DepositFromFundsOneOffFamilyGoalsRow.AmountInYear[cnt].toString().replace(',', '') != "" ? parseInt(this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.DepositFromFundsOneOffFamilyGoalsRow.AmountInYear[cnt].toString().replace(',', '')) : 0) + (this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.AdditionalDepositOneOffFamilyGoalsRow.AmountInYear[cnt].toString().replace(',', '') != "" ? parseInt(this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.AdditionalDepositOneOffFamilyGoalsRow.AmountInYear[cnt].toString().replace(',', '')) : 0));
  }

  CalcTotalYearlySavings(cnt: number) {
    this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.TotalYearlySavingsOneOffFamilyGoalsRow.AmountInYear[cnt] = this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.TotalMonthlySavingsOneOffFamilyGoalsRow.AmountInYear[cnt] * 12;
    //if (cnt == 0) {
    //  console.log(this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.TotalMonthlySavingsOneOffFamilyGoalsRow.AmountInYear[cnt]);
    //  console.log(12 * this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.TotalMonthlySavingsOneOffFamilyGoalsRow.AmountInYear[cnt]);
    //  console.log(this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.TotalYearlySavingsOneOffFamilyGoalsRow.AmountInYear[cnt]);
    //}
    return this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.TotalYearlySavingsOneOffFamilyGoalsRow.AmountInYear[cnt];
  }

  Calc72Rule()
  {
    return `${(72 / parseInt(this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeReturnOnInvestmentOneOffFamilyGoalsRow.CumulativeReturnOnInvestment)).toFixed(1).toString()} שנים להכפלת הכסף `;
  }

  //C32*(1+$D$35)+D31+D27
  CalcCumulative(cnt: number) {
    if (cnt == 0) {
      let b = this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeReturnOnInvestmentOneOffFamilyGoalsRow.CumulativeReturnOnInvestment != "";
      let c = this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeReturnOnInvestmentOneOffFamilyGoalsRow.CumulativeReturnOnInvestment.replace(',', '');
      //console.log(this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.Exist);
      this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.AmountInYear[cnt] = parseInt(this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.TotalYearlySavingsOneOffFamilyGoalsRow.AmountInYear[cnt].toString().replace(',', '')) + parseInt(this.generalInfoService.AllInfo.IncomesGoalsViewInfo.AmountInYear[cnt].toString().replace(',', '')) + (parseInt(this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.Exist.toString().replace(',', '')) * (1 + (b ? (parseFloat(c) / 100) : 0)));
      return parseInt(this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.AmountInYear[cnt].toString().replace(',', ''));
    }
    else {
      //console.log(cnt);
      //console.log(this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.AmountInYear);

      let a = this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.AmountInYear[cnt - 1];
      let b = this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeReturnOnInvestmentOneOffFamilyGoalsRow.CumulativeReturnOnInvestment != "";
      let c = this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeReturnOnInvestmentOneOffFamilyGoalsRow.CumulativeReturnOnInvestment.replace(',', '');
      let d = this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.TotalYearlySavingsOneOffFamilyGoalsRow.AmountInYear[cnt] + parseInt(this.generalInfoService.AllInfo.IncomesGoalsViewInfo.AmountInYear[cnt].toString().replace(',', ''));
      let e = this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.NeedOneOffFamilyGoalsRow.AmountInYear[cnt];


      //console.log(a);
      //console.log(b);
      //console.log(c);
      //console.log(d);
      //console.log(e);
      //console.log(((a * (1 + (b ? (parseFloat(c) / 100) : 0)) + d + e)));
      this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.AmountInYear[cnt] =
        parseInt(((a * (1 + (b ? (parseFloat(c) / 100) : 0)) + d + e)).toFixed(0).toString().replace(',', ''));
      //console.log(this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.AmountInYear[cnt]);

      //console.log(cnt);
      //console.log(this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.AmountInYear.length);


      if (cnt == this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.AmountInYear.length - 1) {
        //console.log("BOOM");
        this.CalcRecomended();
        this.updateChart();
        this.CalcCumulativeF();
      }
      return this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.AmountInYear[cnt];
    }
  }

  CalcCumulativeF() {
    this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.AmountInYearF = new Array<number>(this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.AmountInYear.length);
    let amountInYearF = this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.AdditionalDepositOneOffFamilyGoalsRow.Recomanded - this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.AdditionalDepositOneOffFamilyGoalsRow.AmountInYear[0];
    //console.log("amountInYearF - " + amountInYearF);

    for (let cnt = 0; cnt < this.MaxYear(); cnt++) {
      if (cnt == 0) {
        let b = this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeReturnOnInvestmentOneOffFamilyGoalsRow.CumulativeReturnOnInvestment != "";
        let c = this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeReturnOnInvestmentOneOffFamilyGoalsRow.CumulativeReturnOnInvestment.replace(',', '');
        //console.log(this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.Exist);
        if (this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.AdditionalDepositOneOffFamilyGoalsRow.Recomanded >= this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.AdditionalDepositOneOffFamilyGoalsRow.AmountInYear[0]) {
          this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.AmountInYearF[cnt] = (parseInt(this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.TotalYearlySavingsOneOffFamilyGoalsRow.AmountInYear[cnt].toString().replace(',', '')) + (amountInYearF * 12)) + parseInt(this.generalInfoService.AllInfo.IncomesGoalsViewInfo.AmountInYear[cnt].toString().replace(',', '')) + (parseInt(this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.Exist.toString().replace(',', '')) * (1 + (b ? (parseFloat(c) / 100) : 0)));
        } else {
          this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.AmountInYearF[cnt] = parseInt(this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.TotalYearlySavingsOneOffFamilyGoalsRow.AmountInYear[cnt].toString().replace(',', '')) + parseInt(this.generalInfoService.AllInfo.IncomesGoalsViewInfo.AmountInYear[cnt].toString().replace(',', '')) + (parseInt(this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.Exist.toString().replace(',', '')) * (1 + (b ? (parseFloat(c) / 100) : 0)));
        }
        //console.log("AmountInYearF[cnt] - " + this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.AmountInYearF[cnt]);
      }
      else {
        let a = this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.AmountInYearF[cnt - 1];
        let b = this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeReturnOnInvestmentOneOffFamilyGoalsRow.CumulativeReturnOnInvestment != "";
        let c = this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeReturnOnInvestmentOneOffFamilyGoalsRow.CumulativeReturnOnInvestment.replace(',', '');
        let d = (this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.TotalYearlySavingsOneOffFamilyGoalsRow.AmountInYear[cnt] + parseInt(this.generalInfoService.AllInfo.IncomesGoalsViewInfo.AmountInYear[cnt].toString().replace(',', '')) + (amountInYearF * 12));
        let e = this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.NeedOneOffFamilyGoalsRow.AmountInYear[cnt];

        this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.AmountInYearF[cnt] =
          parseInt(((a * (1 + (b ? (parseFloat(c) / 100) : 0)) + d + e)).toFixed(0).toString().replace(',', ''));

        if (cnt == this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.AmountInYearF.length - 1) {
          this.updateChartF();
        }
      }
    }
  }


  CalcSumNeed() {
    this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.TotalNominalCapitalNeededForAllGoalsOneOffFamilyGoalsRow.TotalNominalCapitalNeededForAllGoals = 0;

    this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.NeedOneOffFamilyGoalsRow.AmountInYear.forEach((element: any) => {
      this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.TotalNominalCapitalNeededForAllGoalsOneOffFamilyGoalsRow.TotalNominalCapitalNeededForAllGoals += element != undefined ? parseInt(element.toString().replace(',', '')) : 0;
    });

    return this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.TotalNominalCapitalNeededForAllGoalsOneOffFamilyGoalsRow.TotalNominalCapitalNeededForAllGoals.toString() != "0" ? this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.TotalNominalCapitalNeededForAllGoalsOneOffFamilyGoalsRow.TotalNominalCapitalNeededForAllGoals.toString() : "0";
  }

  CalcExist() {
    this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.Exist = ((this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.PutAsideOneOffFamilyGoalsRow.PutAside != "" ? parseInt(this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.PutAsideOneOffFamilyGoalsRow.PutAside.replace(',', '')) : 0) + (this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.SavingsExistForChildrenOneOffFamilyGoalsRow.SavingsExistForChildren.replace(',', '') != "" ? parseInt(this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.SavingsExistForChildrenOneOffFamilyGoalsRow.SavingsExistForChildren.replace(',', '')) : 0));
    //console.log(this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.Exist);
    return this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.Exist;
  }

  CalcRecomended() {
    let minCumulative = 0;
    let idxMin = -1;

    this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.AmountInYear.forEach((element: any, idx: number) => {
      if (idx != 0 && element < minCumulative) {
        idxMin = idx;
        minCumulative = element;
      }
    });

    if (idxMin != -1) {
      //console.log("minCumulative - " + minCumulative);
      const result = this.GoalSeek(this.GetCumulativeByIdx, this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.AdditionalDepositOneOffFamilyGoalsRow.AmountInYear[0], idxMin, 3000, 0.001, 500);
      //console.log("Result = " + result)
      this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.AdditionalDepositOneOffFamilyGoalsRow.Recomanded = result ?? 0;
      return result ?? 0;
    }
    else {
      //console.log("GOOD = " + this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.AdditionalDepositOneOffFamilyGoalsRow.AmountInYear[0])
      this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.AdditionalDepositOneOffFamilyGoalsRow.Recomanded = this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.AdditionalDepositOneOffFamilyGoalsRow.AmountInYear[0];
      return this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.AdditionalDepositOneOffFamilyGoalsRow.AmountInYear[0];
    }
  }

  updateChart() {
    this.chart.data.datasets[0].data = [];
    //this.chart.data.datasets[1].data = [];
    //this.chart.data.datasets[2].data = [];
    for (let i = 0; i < this.MaxYear(); i++) {
      this.chart.data.datasets[0].data.push(this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.AmountInYear[i]);
      //this.chart.data.datasets[1].data.push(this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.TotalYearlySavingsOneOffFamilyGoalsRow.AmountInYear[i]);
      //this.chart.data.datasets[2].data.push(this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.NeedOneOffFamilyGoalsRow.AmountInYear[i]);
    }

    //console.log("AmountInYear = " + this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.AmountInYear);
    this.chart.update();
  }

  updateChartF() {
    let amountInYearF = this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.AdditionalDepositOneOffFamilyGoalsRow.Recomanded - this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.AdditionalDepositOneOffFamilyGoalsRow.AmountInYear[0];

    this.chartF.data.datasets[0].data = [];
    //this.chartF.data.datasets[1].data = [];
    //this.chartF.data.datasets[2].data = [];
    for (let i = 0; i < this.MaxYear(); i++) {
      this.chartF.data.datasets[0].data.push(this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.AmountInYearF[i]);
      //this.chartF.data.datasets[1].data.push((this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.TotalYearlySavingsOneOffFamilyGoalsRow.AmountInYear[i]) + (amountInYearF * 12));
      //this.chartF.data.datasets[2].data.push(this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.NeedOneOffFamilyGoalsRow.AmountInYear[i]);
    }

    //console.log("AmountInYearF = " + this.generalInfoService.AllInfo.OneOffFamilyGoalsViewInfo.CumulativeOneOffFamilyGoalsRow.AmountInYearF);
    this.chartF.update();
  }


  CalculateYearsToFinancialIndependence(

    monthlyIncome: number,

    fixedExpenses: number,

    variableExpenses: number,

    alimonyPayment: number,

    liquidAssets: number,

    illiquidAssets: number,

    desiredWithdrawalRate: number,

    investmentReturnRate: number

  ): { NumberOfYears: number, Amount: number ,Year: number} {

    const yearlyFixedAndVariableExpenses = (fixedExpenses - alimonyPayment) + variableExpenses;

    console.log("yearlyFixedAndVariableExpenses = " + yearlyFixedAndVariableExpenses);

    const targetTotalSavings = (yearlyFixedAndVariableExpenses * 12) / desiredWithdrawalRate;

    console.log("targetTotalSavings = " + targetTotalSavings);

    let totalSavings = liquidAssets + illiquidAssets;

    console.log("totalSavings = " + totalSavings);

    let numberOfYears = 2; // Starting with 20 years, you can adjust this value if needed

    let amount = 0;

    console.log(parseInt(this.generalInfoService.AllInfo.PersonalDataViewInfo.RetirementAge1));
    while (totalSavings < targetTotalSavings && numberOfYears <= parseInt(this.generalInfoService.AllInfo.PersonalDataViewInfo.RetirementAge1)) {

      totalSavings = ((totalSavings * (1 + investmentReturnRate)) + ((monthlyIncome - yearlyFixedAndVariableExpenses) * 12));

      console.log("totalSavings = " + totalSavings);

      numberOfYears++;

      console.log("numberOfYears = " + numberOfYears);

    }


    amount = targetTotalSavings;
    console.log(targetTotalSavings);

    let year = new Date().getFullYear() + numberOfYears;

    console.log("year - " + year);
    if (numberOfYears > parseInt(this.generalInfoService.AllInfo.PersonalDataViewInfo.RetirementAge1))
      return { NumberOfYears: 999, Amount: amount ,Year: year};
    else
      return { NumberOfYears: numberOfYears, Amount: amount ,Year: year};
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

  CalcSumExpenses() {
    this.generalInfoService.AllInfo.CalculateData.SumExpenses = (this.generalInfoService.AllInfo.FixedExpensesViewInfo.Expenses.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.FixedExpensesViewInfo.Expenses.replace(',', '')) : 0).toFixed(0).toString();
    return (this.generalInfoService.AllInfo.FixedExpensesViewInfo.Expenses.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.FixedExpensesViewInfo.Expenses.replace(',', '')) : 0).toFixed(0).toString();
  }

  CalcSumVariableExpenses() {
    this.generalInfoService.AllInfo.CalculateData.SumVariableExpenses = (this.generalInfoService.AllInfo.VariableExpensesViewInfo.SatisfactionExpenses.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.VariableExpensesViewInfo.SatisfactionExpenses.toFixed(0).toString().replace(',', '')) : 0).toFixed(0).toString();
    return (this.generalInfoService.AllInfo.VariableExpensesViewInfo.SatisfactionExpenses.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.VariableExpensesViewInfo.SatisfactionExpenses.toFixed(0).toString().replace(',', '')) : 0).toFixed(0).toString();
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

  CalcYearsToFinancialFreedomCalculated() {
    //return this.CalculateYearsToFinancialIndependence(parseInt(this.CalcSumNetIncomes().replace(',', '')) + parseInt(this.CalcIncomesEx().replace(',', '')), parseInt(this.CalcSumExpenses().replace(',', '')), parseInt(this.CalcSumVariableExpenses().replace(',', '')), this.CalcPaymentOfAlimony(), parseInt(this.CalcFinanceLiquidityAssets().replace(',', '')), parseInt(this.CalcFinanceUnliquidityAssets().replace(',', '')), 0.04, 0.07);
    return this.CalculateYearsToFinancialIndependence(parseInt(this.CalcSumNetIncomes().replace(',', '')) + parseInt(this.CalcIncomesEx().replace(',', '')), parseInt(this.CalcSumExpenses().replace(',', '')), parseInt(this.CalcSumVariableExpenses().replace(',', '')), 0, parseInt(this.CalcFinanceLiquidityAssets().replace(',', '')), parseInt(this.CalcFinanceUnliquidityAssets().replace(',', '')), 0.04, 0.07);
  }

  createChart() {

    const labels = [];
    for (let i = 0; i < this.MaxYear(); i++) {
      labels.push(this.GetYear(i));
    }

    const down = (ctx: any, value: any) => ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined;
    const up = (ctx: any, value: any) => ctx.p0.parsed.y <= ctx.p1.parsed.y ? value : undefined;

    const nf = new Intl.NumberFormat("en-US", {
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

    const formatter = new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',

      // These options are needed to round to whole numbers if that's what you want.
      //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
      //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });
    this.chart?.destroy();

    let delayed = false;
    this.chart = new Chart('MyChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'סה"כ חיסכון',
          data: this.Data,
          cubicInterpolationMode: 'monotone',
          segment: {
            borderColor: (ctx: any) => up(ctx, 'limegreen') || down(ctx, '#710019') || 'black'
          },
          fill: { above: 'transparent', below: '#710019', target: { value: 0 } },
          backgroundColor: 'white',
          order: 2
        }/* ,
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
        } */],
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
          annotation: {
            annotations: {
              line1: {
                type: 'line',
                 yMin: this.CalcYearsToFinancialFreedomCalculated().Amount,
                yMax: this.CalcYearsToFinancialFreedomCalculated().Amount,
                xMax: this.CalcYearsToFinancialFreedomCalculated().Year,
                borderColor: 'limegreen',
                borderWidth: 3,
                label: {
                  display: true,
                  backgroundColor: 'lightGreen',
                  borderRadius: 0,
                  color: 'black',
                  font: {
                    family: 'Comic Sans MS',
                    size: 16,
                    weight: 'bold',
                    lineHeight: 1.2,
                  },
                  content: `יציאה לעצמאות כלכלית ${nf.format(this.CalcYearsToFinancialFreedomCalculated().Amount)}`
                },
                arrowHeads: {
                /*   start: {
                    display: true,
                    borderColor: 'green'
                  }, */
                  end: {
                    display: true,
                    borderColor: 'green'
                  }
                },
              },
            }
          },
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
            } */
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
  }

  createChartF() {

    const labels = [];
    for (let i = 0; i < this.MaxYear(); i++) {
      labels.push(this.GetYear(i));
    }
    const down = (ctx: any, value: any) => ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined;
    const up = (ctx: any, value: any) => ctx.p0.parsed.y <= ctx.p1.parsed.y ? value : undefined;

    const nf = new Intl.NumberFormat("he-IL", {
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

    let amount = this.CalcYearsToFinancialFreedomCalculated().Amount;
    console.log("amount - " + amount);

    this.chartF?.destroy();

    let delayed = false;
    this.chartF = new Chart('MyChartF', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'סה"כ חיסכון',
          data: this.Data,
          cubicInterpolationMode: 'monotone',
          segment: {
            borderColor: (ctx: any) => up(ctx, 'limegreen') || down(ctx, '#710019')
          },
          fill: { above: 'transparent', below: '#710019', target: { value: 0 } },
          backgroundColor: 'white',
          order: 2
        }/* ,
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
          order: 0
        } */],
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
          annotation: {
            annotations: {
              line1: {
                type: 'line',
                 yMin: this.CalcYearsToFinancialFreedomCalculated().Amount,
                yMax: this.CalcYearsToFinancialFreedomCalculated().Amount,
                xMax: this.CalcYearsToFinancialFreedomCalculated().Year,
                borderColor: 'limegreen',
                borderWidth: 3,
                label: {
                  display: true,
                  backgroundColor: 'lightGreen',
                  borderRadius: 0,
                  color: 'black',
                  font: {
                    family: 'Comic Sans MS',
                    size: 16,
                    weight: 'bold',
                    lineHeight: 1.2,
                  },
                  content: `יציאה לעצמאות כלכלית ${nf.format(this.CalcYearsToFinancialFreedomCalculated().Amount)}`
                },
                arrowHeads: {
/*                   start: {
                    display: true,
                    borderColor: 'green'
                  }, */
                  end: {
                    display: true,
                    borderColor: 'green'
                  }
                },
              }
            }
          },
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
            } */
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
  }
}
