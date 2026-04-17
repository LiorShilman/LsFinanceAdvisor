import { Component, OnInit } from '@angular/core';
import { CommitmentsRowObj } from 'src/app/services/GeneralTypes/GeneralTypes';
import { GeneralInfoService } from 'src/app/services/general-info.service';

declare var bootstrap: any;

@Component({
  selector: 'app-commitments',
  templateUrl: './commitments.component.html',
  styleUrls: ['./commitments.component.css']
})
export class CommitmentsComponent implements OnInit {


  constructor(public generalInfoService: GeneralInfoService) {

  }

  ngOnInit(): void {
    // Bootstrap tooltip initialization
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });
  }

  CalcAmounts() {
    this.generalInfoService.AllInfo.CommitmentsViewInfo.CurrentAmount = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.CommitmentsViewInfo.CommitmentsRows.length; i++) {
      this.generalInfoService.AllInfo.CommitmentsViewInfo.CurrentAmount += (this.generalInfoService.AllInfo.CommitmentsViewInfo.CommitmentsRows[i].CurrAmount.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.CommitmentsViewInfo.CommitmentsRows[i].CurrAmount.replace(',', '')) : 0);
    }

    return this.generalInfoService.AllInfo.CommitmentsViewInfo.CurrentAmount.toFixed(0).toString();

  }

  CalcMonthlyPayments() {

    this.generalInfoService.AllInfo.CommitmentsViewInfo.MonthlyPayment = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.CommitmentsViewInfo.CommitmentsRows.length; i++) {
      this.generalInfoService.AllInfo.CommitmentsViewInfo.MonthlyPayment += (this.generalInfoService.AllInfo.CommitmentsViewInfo.CommitmentsRows[i].MonthlyPayment.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.CommitmentsViewInfo.CommitmentsRows[i].MonthlyPayment.replace(',', '')) : 0);
    }

    return this.generalInfoService.AllInfo.CommitmentsViewInfo.MonthlyPayment.toFixed(0).toString();
  }

  CalcMaxYearsPayments() {
    this.generalInfoService.AllInfo.CommitmentsViewInfo.MaxYearsPayment = 0;
    let maxYearsPayment = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.CommitmentsViewInfo.CommitmentsRows.length; i++) {
      maxYearsPayment = (this.generalInfoService.AllInfo.CommitmentsViewInfo.CommitmentsRows[i].EndDate != 0 ? parseFloat(this.generalInfoService.AllInfo.CommitmentsViewInfo.CommitmentsRows[i].EndDate.toString()) : 0);
      if (maxYearsPayment > this.generalInfoService.AllInfo.CommitmentsViewInfo.MaxYearsPayment) {
        this.generalInfoService.AllInfo.CommitmentsViewInfo.MaxYearsPayment = maxYearsPayment;
      }
    }

    return this.generalInfoService.AllInfo.CommitmentsViewInfo.MaxYearsPayment.toFixed(1).toString();
  }

  AddRow() {
    this.generalInfoService.AllInfo.CommitmentsViewInfo.CommitmentsRows.push(new CommitmentsRowObj());
  }

}

