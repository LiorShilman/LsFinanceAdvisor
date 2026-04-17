import { Component, OnInit } from '@angular/core';
import { ManagerInsuranceRowObj, OldPensionFundRowObj, PensionFundRowObj } from 'src/app/services/GeneralTypes/GeneralTypes';
import { GeneralInfoService } from 'src/app/services/general-info.service';
import { Chart } from 'chart.js/auto';

declare var bootstrap: any;

@Component({
  selector: 'app-pension2',
  templateUrl: './pension2.component.html',
  styleUrls: ['./pension.component.css']
})
export class Pension2Component implements OnInit {
  public chart: any;
  ColorArray: string[];
  Data: number[];
  constructor(public generalInfoService: GeneralInfoService) {
    this.ColorArray = new Array<string>(2);
    this.ColorArray[0] = "#5C2D8A";
    this.ColorArray[1] = "#8F49D6";
    this.Data = [];
  };

  ngOnInit(): void {

    // Bootstrap tooltip initialization
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    this.createChart();
  }

  updateChart() {
    this.chart.data.datasets[0].data = [];
    this.chart.data.datasets[0].data.push(this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[0].CalculatedMonthlyAllowances);
    this.chart.data.datasets[0].data.push(this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[0].DisabilityFund);
    this.chart.data.datasets[0].data.push(this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[0].WidowsAllowances);
    this.chart.update();
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

    return this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].ManagerInsuranceMonthlyAllowances.toFixed(0).toString() != "0" ? this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[num].ManagerInsuranceMonthlyAllowances.toFixed(0).toString() : "";
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
    this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].DisabilityFund  = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].PensionFundRows.length; i++) {
      this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].DisabilityFund += (this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].PensionFundRows[i].DisabilityFund.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[num].PensionFundRows[i].DisabilityFund.replace(',', '')) : 0);
    }

    this.updateChart();
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
        this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[num].AllowanceAmounts +
        //(this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[num].SocialSecurityBenefitsRows[0].Amount.replace(',', '') != "" ? parseInt(this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[num].SocialSecurityBenefitsRows[0].Amount.replace(',', '')) : 0) +
       // (this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[num].SocialSecurityBenefitsRows[1].Amount.replace(',', '') != "" ? parseInt(this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[num].SocialSecurityBenefitsRows[1].Amount.replace(',', '')) : 0) +
        (this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[num].SocialSecurityBenefitsRows[2].Amount.replace(',', '') != "" ? parseInt(this.generalInfoService.AllInfo.PensiaViewInfo.SocialSecurityBenefits[num].SocialSecurityBenefitsRows[2].Amount.replace(',', '')) : 0));


    return this.generalInfoService.AllInfo.PensiaViewInfo.SumMonthlyPensia[num];
  }

  CalcGapSumMonthlyPensia(num: number) {
    return this.generalInfoService.AllInfo.PensiaViewInfo.SumMonthlyPensia[num] - parseInt(this.generalInfoService.AllInfo.IncomesViewInfo.Income[num].replace(',',''));
  }


  AddRowOld() {
    this.generalInfoService.AllInfo.PensiaViewInfo.OldPensionFund[1].OldPensionFundRows.push(new OldPensionFundRowObj());
  }

  AddRowManagerInsurance() {
    this.generalInfoService.AllInfo.PensiaViewInfo.ManagerInsurance[1].ManagerInsuranceRows.push(new ManagerInsuranceRowObj());
  }

  AddRowPensia() {
    this.generalInfoService.AllInfo.PensiaViewInfo.PensionFund[1].PensionFundRows.push(new PensionFundRowObj());
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
            borderColor: 'black',
            backgroundColor: [
              'rgb(75, 192, 192)',
              'rgb(255, 205, 86)',
              'rgb(255, 99, 132)',
            ]
          }
        ],
      },
      options: {
        responsive: true,
        scales: {
          r: {
              ticks: {
                  stepSize: 1000,
                  color: 'white',
                  backdropColor: 'black',
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
    }});
  }
}
