import { Component, OnInit } from '@angular/core';
import { LifeInsuranceRow } from 'src/app/services/GeneralTypes/GeneralTypes';
import { GeneralInfoService } from 'src/app/services/general-info.service';

declare var bootstrap: any;

@Component({
  selector: 'app-life-insurance',
  templateUrl: './life-insurance.component.html',
  styleUrls: ['./life-insurance.component.css']
})
export class LifeInsuranceComponent implements OnInit {
  constructor(public generalInfoService: GeneralInfoService) {
  }

  ngOnInit(): void {
    // Bootstrap tooltip initialization
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });
  }

  CalcCapitalAmounts(num: number) {
    this.generalInfoService.AllInfo.LifeInsurancesViewInfo.CapitalAmounts[num] = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[num].length; i++) {
      this.generalInfoService.AllInfo.LifeInsurancesViewInfo.CapitalAmounts[num] += (this.generalInfoService.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[num][i].CapitalAmount.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[num][i].CapitalAmount.replace(',', '')) : 0);
    }

    return this.generalInfoService.AllInfo.LifeInsurancesViewInfo.CapitalAmounts[num].toFixed(0).toString();
  }

  CalcMonthlyAllowances(num: number) {
    this.generalInfoService.AllInfo.LifeInsurancesViewInfo.MonthlyAllowances[num] = 0;
    console.log(this.generalInfoService.AllInfo.LifeInsurancesViewInfo.MonthlyAllowances[num]);

    for (let i = 0; i < this.generalInfoService.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[num].length; i++) {
      console.log(this.generalInfoService.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[num][i].MonthlyAllowance.toFixed(0).toString().replace(',', ''));
      this.generalInfoService.AllInfo.LifeInsurancesViewInfo.MonthlyAllowances[num] += (this.generalInfoService.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[num][i].MonthlyAllowance.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[num][i].MonthlyAllowance.toFixed(0).toString().replace(',', '')) : 0);
    }
    console.log(this.generalInfoService.AllInfo.LifeInsurancesViewInfo.MonthlyAllowances[num]);

    console.log(this.generalInfoService.AllInfo.LifeInsurancesViewInfo.MonthlyAllowances[num].toFixed(0).toString());
    return this.generalInfoService.AllInfo.LifeInsurancesViewInfo.MonthlyAllowances[num].toFixed(0).toString();
  }

  AddRowLifeInsurance1() {
    this.generalInfoService.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[0].push(new LifeInsuranceRow());
  }

  AddRowLifeInsurance2() {
    this.generalInfoService.AllInfo.LifeInsurancesViewInfo.LifeInsuranceRows[1].push(new LifeInsuranceRow());
  }

}
