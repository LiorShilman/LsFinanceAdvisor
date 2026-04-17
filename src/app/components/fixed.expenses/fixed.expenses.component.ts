import { Component, OnInit } from '@angular/core';
import { FixedExpensesRowObj } from 'src/app/services/GeneralTypes/GeneralTypes';
import { GeneralInfoService } from 'src/app/services/general-info.service';
import { FixedExpensesEmbedComponent } from './fixed-expenses-embed.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormattedMoneyComponent } from '../formatted-money/formatted-money.component';
import { FormulaDisplayComponent } from '../formula-display/formula-display.component';

declare var bootstrap: any;

@Component({
  selector: 'app-fixed-expenses',
  templateUrl: './fixed.expenses.component.html',
  styleUrls: ['./fixed.expenses.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormattedMoneyComponent   ,FormsModule, FormulaDisplayComponent,FixedExpensesComponent,FixedExpensesEmbedComponent],
})
export class FixedExpensesComponent implements OnInit {
  constructor(public generalInfoService: GeneralInfoService) {
  }

  ngOnInit(): void {
    // Bootstrap tooltip initialization
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });
    
  }

  CalcMonthlyInterimAverage() {

    var expenses = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedExpenseRows.length; i++) {
      expenses += (this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[i].FixedMonthly.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[i].FixedMonthly.replace(',', '')) : 0);
    }

    this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedMonthlyAvg = expenses.toFixed(0).toString();

    return expenses.toFixed(0).toString();
  }

  CalcMonthly1Average() {

    var expenses = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedExpenseRows.length; i++) {
      expenses += (this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[i].MonthlyExpense1.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[i].MonthlyExpense1.replace(',', '')) : 0);
    }

    this.generalInfoService.AllInfo.FixedExpensesViewInfo.MonthlyExpense1Avg = expenses.toFixed(0).toString();

    return expenses.toFixed(0).toString();
  }

  CalcMonthly2Average() {

    var expenses = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedExpenseRows.length; i++) {
      expenses += (this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[i].MonthlyExpense2.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[i].MonthlyExpense2.replace(',', '')) : 0);
    }

    this.generalInfoService.AllInfo.FixedExpensesViewInfo.MonthlyExpense2Avg = expenses.toFixed(0).toString();

    return expenses.toFixed(0).toString();
  }

  CalcMonthly3Average() {

    var expenses = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedExpenseRows.length; i++) {
      expenses += (this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[i].MonthlyExpense3.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedExpenseRows[i].MonthlyExpense3.replace(',', '')) : 0);
    }

    this.generalInfoService.AllInfo.FixedExpensesViewInfo.MonthlyExpense3Avg = expenses.toFixed(0).toString();

    return expenses.toFixed(0).toString();
  }

  CalcMonthlyAvgAverage() {

    /*     var expenses = 0;
    
        for (let i = 0 ; i < 20 ; i++)
        {
          expenses += (this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedMonthlyAvg.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedMonthlyAvg.replace(',', '')) : 0)
    
        }
     */

    this.generalInfoService.AllInfo.FixedExpensesViewInfo.Expenses = ((this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedMonthlyAvg.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedMonthlyAvg.replace(',', '')) : 0) +
      (((this.generalInfoService.AllInfo.FixedExpensesViewInfo.MonthlyExpense1Avg.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.FixedExpensesViewInfo.MonthlyExpense1Avg.replace(',', '')) : 0) +
        (this.generalInfoService.AllInfo.FixedExpensesViewInfo.MonthlyExpense2Avg.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.FixedExpensesViewInfo.MonthlyExpense2Avg.replace(',', '')) : 0) +
        (this.generalInfoService.AllInfo.FixedExpensesViewInfo.MonthlyExpense3Avg.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.FixedExpensesViewInfo.MonthlyExpense3Avg.replace(',', '')) : 0)) / 3)).toFixed(0).toString();

    return ((this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedMonthlyAvg.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedMonthlyAvg.replace(',', '')) : 0) +
      (((this.generalInfoService.AllInfo.FixedExpensesViewInfo.MonthlyExpense1Avg.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.FixedExpensesViewInfo.MonthlyExpense1Avg.replace(',', '')) : 0) +
        (this.generalInfoService.AllInfo.FixedExpensesViewInfo.MonthlyExpense2Avg.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.FixedExpensesViewInfo.MonthlyExpense2Avg.replace(',', '')) : 0) +
        (this.generalInfoService.AllInfo.FixedExpensesViewInfo.MonthlyExpense3Avg.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.FixedExpensesViewInfo.MonthlyExpense3Avg.replace(',', '')) : 0)) / 3)).toFixed(0).toString();
  }

  CalcSumExpenses() {

    return (this.generalInfoService.AllInfo.FixedExpensesViewInfo.Expenses.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.FixedExpensesViewInfo.Expenses.replace(',', '')) : 0).toFixed(0).toString();
  }

  CalcPercent() {
    //let sumNetIncomes = this.generalInfoService.AllInfo.IncomesViewInfo.SumNetIncomes; 
    let incomes = this.generalInfoService.AllInfo.IncomesViewInfo.TotalIncomes;
    //console.log(sumNetIncomes);
    //console.log(incomeEx);
    //console.log(sumIncomes);
    //console.log(this.generalInfoService.AllInfo.IncomesViewInfo.Income[num]);
    if (this.generalInfoService.AllInfo.FixedExpensesViewInfo.Expenses != "")
      return parseInt(this.generalInfoService.AllInfo.FixedExpensesViewInfo.Expenses) / incomes;
    else
      return 0;
  }

  AddRow() {
    this.generalInfoService.AllInfo.FixedExpensesViewInfo.FixedExpenseRows.push(new FixedExpensesRowObj());
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
}
