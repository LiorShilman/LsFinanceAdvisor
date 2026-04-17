import { Component, OnInit } from '@angular/core';
import { IncomesGoalsRowObj } from 'src/app/services/GeneralTypes/GeneralTypes';
import { GeneralInfoService } from 'src/app/services/general-info.service';

declare var bootstrap: any;

@Component({
  selector: 'app-income-goals',
  templateUrl: './income-goals.component.html',
  styleUrls: ['./income-goals.component.css']
})
export class IncomeGoalsComponent implements OnInit {

  constructor(public generalInfoService: GeneralInfoService) {
  }

  ngOnInit(): void {
    // Bootstrap tooltip initialization
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });
  }

  GetYear(cnt: number) {
    return new Date().getFullYear() + cnt;
  }

  GetAge(cnt: number) {
    return parseInt(this.generalInfoService.AllInfo.PersonalDataViewInfo.Age1) + cnt;
  }

  MaxYear() {
    return parseInt(this.generalInfoService.AllInfo.PersonalDataViewInfo.RetirementAge1) - parseInt(this.generalInfoService.AllInfo.PersonalDataViewInfo.Age1) + 1;
  }

  CalcYear(cnt: number) {
    this.generalInfoService.AllInfo.IncomesGoalsViewInfo.AmountInYear[cnt] = 0;

    this.generalInfoService.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows.forEach((element: any) => {
      this.generalInfoService.AllInfo.IncomesGoalsViewInfo.AmountInYear[cnt] += (element.AmountInYear[cnt] != undefined && element.AmountInYear[cnt] != "") ? parseInt(element.AmountInYear[cnt].toString().replace(',', '')) : 0;
    });

    return this.generalInfoService.AllInfo.IncomesGoalsViewInfo.AmountInYear[cnt].toString();
  }

  AddRow() {
    this.generalInfoService.AllInfo.IncomesGoalsViewInfo.IncomesGoalsRows.push(new IncomesGoalsRowObj());
  }

}
