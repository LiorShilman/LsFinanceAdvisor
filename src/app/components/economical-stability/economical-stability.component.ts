import { Component, OnInit } from '@angular/core';
import { GeneralInfoService } from 'src/app/services/general-info.service';

declare var bootstrap: any;

@Component({
  selector: 'app-economical-stability',
  templateUrl: './economical-stability.component.html',
  styleUrls: ['./economical-stability.component.css']
})
export class EconomicalStabilityComponent implements OnInit {
  constructor(public generalInfoService: GeneralInfoService) {
  }

  ngOnInit(): void {
    // Bootstrap tooltip initialization
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });
  }

  CalcFamilyIncomes() {
    this.generalInfoService.AllInfo.EconomicalStabilityViewInfo.FamilyIncomes = (this.generalInfoService.AllInfo.IncomesViewInfo.SumNetIncomes.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.SumNetIncomes.toFixed(0).toString().replace(',', '')) : 0);

    return this.generalInfoService.AllInfo.EconomicalStabilityViewInfo.FamilyIncomes.toFixed(0).toString();
  }

  CalcTheNeeded() {
    this.generalInfoService.AllInfo.EconomicalStabilityViewInfo.TheNeed = (this.generalInfoService.AllInfo.PersonalDataViewInfo.Age1 != "" ? (((parseInt(this.generalInfoService.AllInfo.PersonalDataViewInfo.Age1) - 25) / 3.0) * this.generalInfoService.AllInfo.EconomicalStabilityViewInfo.FamilyIncomes) : 0);

    return this.generalInfoService.AllInfo.EconomicalStabilityViewInfo.TheNeed.toFixed(0).toString();
  }

  CalcHowMuchIsLeft2Saving() {
    this.generalInfoService.AllInfo.EconomicalStabilityViewInfo.HowMuchIsLeft2Saving = (this.generalInfoService.AllInfo.EconomicalStabilityViewInfo.CapitalTagged.replace(',', '') != "") ? (this.generalInfoService.AllInfo.EconomicalStabilityViewInfo.TheNeed - parseInt(this.generalInfoService.AllInfo.EconomicalStabilityViewInfo.CapitalTagged)) : 0;

    return this.generalInfoService.AllInfo.EconomicalStabilityViewInfo.HowMuchIsLeft2Saving.toFixed(0).toString();
  }

  CalcMonthlySavings() {
    this.generalInfoService.AllInfo.EconomicalStabilityViewInfo.MonthlySavings = (this.generalInfoService.AllInfo.EconomicalStabilityViewInfo.HowMuchIsLeft2Saving.toFixed(0).toString().replace(',', '') != "0") ? (this.generalInfoService.AllInfo.EconomicalStabilityViewInfo.HowMuchIsLeft2Saving / (parseInt(this.generalInfoService.AllInfo.EconomicalStabilityViewInfo.HowManyYears) * 12)) : 0;

    return this.generalInfoService.AllInfo.EconomicalStabilityViewInfo.MonthlySavings.toFixed(0).toString();
  }
}