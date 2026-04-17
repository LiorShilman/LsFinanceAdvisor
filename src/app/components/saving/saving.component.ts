import { Component, OnInit } from '@angular/core';
import { SavingRowObj } from 'src/app/services/GeneralTypes/GeneralTypes';
import { GeneralInfoService } from 'src/app/services/general-info.service';

declare var bootstrap: any;

@Component({
  selector: 'app-saving',
  templateUrl: './saving.component.html',
  styleUrls: ['./saving.component.css']
})
export class SavingComponent implements OnInit {

  constructor(public generalInfoService: GeneralInfoService) {
  };

  ngOnInit(): void {

    // Bootstrap tooltip initialization
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });
  }

  CalcMonthlyInterimAverage() {

    this.generalInfoService.AllInfo.SavingViewInfo.SavingMonthly = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.SavingViewInfo.SavingRows.length; i++) {
      this.generalInfoService.AllInfo.SavingViewInfo.SavingMonthly += (this.generalInfoService.AllInfo.SavingViewInfo.SavingRows[i].FixedMonthly.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.SavingViewInfo.SavingRows[i].FixedMonthly.replace(',', '')) : 0);
    }

    return this.generalInfoService.AllInfo.SavingViewInfo.SavingMonthly.toFixed(0).toString();
  }

  CalcCurrAmounts() {

    this.generalInfoService.AllInfo.SavingViewInfo.CurrAmounts = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.SavingViewInfo.SavingRows.length; i++) {
      this.generalInfoService.AllInfo.SavingViewInfo.CurrAmounts += (this.generalInfoService.AllInfo.SavingViewInfo.SavingRows[i].CurrentAmount.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.SavingViewInfo.SavingRows[i].CurrentAmount.replace(',', '')) : 0);
    }
    return this.generalInfoService.AllInfo.SavingViewInfo.CurrAmounts.toFixed(0).toString();
  }


  CalcSumSaving() {

    return (this.generalInfoService.AllInfo.SavingViewInfo.CurrAmounts != 0 ? this.generalInfoService.AllInfo.SavingViewInfo.CurrAmounts : 0).toFixed(0).toString();
  }

  /*   GetClass(type: string, num: number) {
      switch (type) {
        case 'FixedMonthly':
          if (this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[num].MonthlyExpense1 != "" ||
            this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[num].MonthlyExpense2 != "" ||
            this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[num].MonthlyExpense3 != "") {
            return 'disabled';
          }
          else
            return '';
      }
  
      return '';
    } */

    AddRow() {
      this.generalInfoService.AllInfo.SavingViewInfo.SavingRows.push(new SavingRowObj());
    }

}

