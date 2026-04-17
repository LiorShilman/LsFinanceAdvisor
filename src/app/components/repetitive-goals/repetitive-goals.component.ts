import { Component, OnInit } from '@angular/core';
import { RepetitiveGoalsRowObj } from 'src/app/services/GeneralTypes/GeneralTypes';
import { GeneralInfoService } from 'src/app/services/general-info.service';

declare var bootstrap: any;

@Component({
  selector: 'app-repetitive-goals',
  templateUrl: './repetitive-goals.component.html',
  styleUrls: ['./repetitive-goals.component.css']
})
export class RepetitiveGoalsComponent implements OnInit {

  constructor(public generalInfoService: GeneralInfoService) {
  };

  ngOnInit(): void {

    // Bootstrap tooltip initialization
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });
  }

  CalcMonthlySavingsRequired() {

    this.generalInfoService.AllInfo.RepetitiveGoalsViewInfo.Amounts = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.RepetitiveGoalsViewInfo.RepetitiveGoalsRows.length; i++) {
      this.generalInfoService.AllInfo.RepetitiveGoalsViewInfo.Amounts += (this.generalInfoService.AllInfo.RepetitiveGoalsViewInfo.RepetitiveGoalsRows[i].MonthlySavingsRequired.toFixed(0).toString().replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.RepetitiveGoalsViewInfo.RepetitiveGoalsRows[i].MonthlySavingsRequired.toFixed(0).toString().replace(',', '')) : 0);
    }

    return this.generalInfoService.AllInfo.RepetitiveGoalsViewInfo.Amounts.toFixed(0).toString();


  }

  AddRow() {
    this.generalInfoService.AllInfo.RepetitiveGoalsViewInfo.RepetitiveGoalsRows.push(new RepetitiveGoalsRowObj());
  }

}
