import { Component, OnInit } from '@angular/core';
import { IncomeExRowObj, IncomeRowObj } from 'src/app/services/GeneralTypes/GeneralTypes';
import { GeneralInfoService } from 'src/app/services/general-info.service';
import { CalculateEmbedComponent } from '../salary-calculator/calculate-embed.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-incomes',
  templateUrl: './incomes.component.html',
  styleUrls: ['./incomes.component.scss'],
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class IncomesComponent implements OnInit {

  constructor(public generalInfoService: GeneralInfoService) {
  }

  ngOnInit(): void {
    // Bootstrap tooltip initialization
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });
  }

  ngOnDestroy() {

  }

  CalcMonthlyInterimAverage(num: number) {

    let fixedMonthlyAvg = 0;
    this.generalInfoService.AllInfo.IncomesViewInfo.IncomeRows[num].forEach(element => {
      fixedMonthlyAvg += (element.FixedMonthly.replace(',', '') != "" ? parseFloat(element.FixedMonthly.replace(',', '')) : 0);
    });
    this.generalInfoService.AllInfo.IncomesViewInfo.FixedMonthlyAvg[num] = fixedMonthlyAvg.toFixed(0).toString();

    return this.generalInfoService.AllInfo.IncomesViewInfo.FixedMonthlyAvg[num];
  }

  CalcMonthly1Average(num: number) {

    let monthlyRevenue1Avg = 0;
    this.generalInfoService.AllInfo.IncomesViewInfo.IncomeRows[num].forEach(element => {
      monthlyRevenue1Avg += (element.MonthlyRevenue1.replace(',', '') != "" ? parseFloat(element.MonthlyRevenue1.replace(',', '')) : 0);
    });
    this.generalInfoService.AllInfo.IncomesViewInfo.MonthlyRevenue1Avg[num] = monthlyRevenue1Avg.toFixed(0).toString();

    return this.generalInfoService.AllInfo.IncomesViewInfo.MonthlyRevenue1Avg[num];
  }

  CalcMonthly2Average(num: number) {

    let monthlyRevenue2Avg = 0;
    this.generalInfoService.AllInfo.IncomesViewInfo.IncomeRows[num].forEach(element => {
      monthlyRevenue2Avg += (element.MonthlyRevenue2.replace(',', '') != "" ? parseFloat(element.MonthlyRevenue2.replace(',', '')) : 0);
    });
    this.generalInfoService.AllInfo.IncomesViewInfo.MonthlyRevenue2Avg[num] = monthlyRevenue2Avg.toFixed(0).toString();

    return this.generalInfoService.AllInfo.IncomesViewInfo.MonthlyRevenue2Avg[num];
  }

  CalcMonthly3Average(num: number) {

    let monthlyRevenue3Avg = 0;
    this.generalInfoService.AllInfo.IncomesViewInfo.IncomeRows[num].forEach(element => {
      monthlyRevenue3Avg += (element.MonthlyRevenue3.replace(',', '') != "" ? parseFloat(element.MonthlyRevenue3.replace(',', '')) : 0);
    });
    this.generalInfoService.AllInfo.IncomesViewInfo.MonthlyRevenue3Avg[num] = monthlyRevenue3Avg.toFixed(0).toString();

    return this.generalInfoService.AllInfo.IncomesViewInfo.MonthlyRevenue3Avg[num];
  }

  CalcMonthlyAvgAverage(num: number) {
    this.generalInfoService.AllInfo.IncomesViewInfo.Income[num] = ((this.generalInfoService.AllInfo.IncomesViewInfo.FixedMonthlyAvg[num].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.FixedMonthlyAvg[num].replace(',', '')) : 0) +
      (((this.generalInfoService.AllInfo.IncomesViewInfo.MonthlyRevenue1Avg[num].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.MonthlyRevenue1Avg[num].replace(',', '')) : 0) +
        (this.generalInfoService.AllInfo.IncomesViewInfo.MonthlyRevenue2Avg[num].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.MonthlyRevenue2Avg[num].replace(',', '')) : 0) +
        (this.generalInfoService.AllInfo.IncomesViewInfo.MonthlyRevenue3Avg[num].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.MonthlyRevenue3Avg[num].replace(',', '')) : 0)) / 3)).toFixed(0).toString();
    return ((this.generalInfoService.AllInfo.IncomesViewInfo.FixedMonthlyAvg[num].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.FixedMonthlyAvg[num].replace(',', '')) : 0) +
      (((this.generalInfoService.AllInfo.IncomesViewInfo.MonthlyRevenue1Avg[num].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.MonthlyRevenue1Avg[num].replace(',', '')) : 0) +
        (this.generalInfoService.AllInfo.IncomesViewInfo.MonthlyRevenue2Avg[num].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.MonthlyRevenue2Avg[num].replace(',', '')) : 0) +
        (this.generalInfoService.AllInfo.IncomesViewInfo.MonthlyRevenue3Avg[num].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.MonthlyRevenue3Avg[num].replace(',', '')) : 0)) / 3)).toFixed(0).toString();
  }

  CalcPercent(num: number) {
    let sumNetIncomes = this.generalInfoService.AllInfo.IncomesViewInfo.SumNetIncomes; 

    let incomes = ((this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
    (this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0));

    let netIncomes = ((this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
    (this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0) +
    (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '')) : 0) -
    (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '')) : 0) -
    (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '')) : 0));

    let incomeEx = (netIncomes - incomes); 
    let sumIncomes = sumNetIncomes + incomeEx; 

    if (this.generalInfoService.AllInfo.IncomesViewInfo.Income[num] != "")
      return parseInt(this.generalInfoService.AllInfo.IncomesViewInfo.Income[num]) / sumIncomes;
    else
      return 0;
  }

  CalcMonthlyAverage() {

    let incomeExIdx = 0;
    this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows.forEach((incomeEx: any) => {
      incomeExIdx += ((incomeEx.MonthlyAvg.replace(',', '') != "" ? parseFloat(incomeEx.MonthlyAvg.replace(',', '')) : 0))
    });

    this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx = incomeExIdx.toFixed(0).toString();

    return this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx;
  }

  CalcPercentEx() 
  {
    let sumNetIncomes = this.generalInfoService.AllInfo.IncomesViewInfo.SumNetIncomes; 

    let incomes = ((this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
    (this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0));

    let netIncomes = ((this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
    (this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0) +
    (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '')) : 0) -
    (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '')) : 0) -
    (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '')) : 0));

    let incomeEx = (netIncomes - incomes); 
    let sumIncomes = sumNetIncomes + incomeEx; 

    if (incomeEx != 0)
      return incomeEx / sumIncomes;
    else
      return 0;

  }

  CalcSumIncomes() {

    let incomes = ((this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
    (this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0));

    let netIncomes = ((this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
    (this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0) +
    (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '')) : 0) -
    (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '')) : 0) -
    (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '')) : 0));

    let allIncomes =  ((this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
    (this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0) +
    (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '')) : 0));

    return (allIncomes - (netIncomes - incomes)).toFixed(0).toString();
  }

  CalcSumNetIncomes() {
    this.generalInfoService.AllInfo.IncomesViewInfo.SumNetIncomes =((this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
    (this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0));
    
    return this.generalInfoService.AllInfo.IncomesViewInfo.SumNetIncomes.toFixed(0).toString();
  }

  CalcIncomesEx() {
    let incomes = ((this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
    (this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0));

    let netIncomes = ((this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[0].replace(',', '')) : 0) +
    (this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.Income[1].replace(',', '')) : 0) +
    (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeEx.replace(',', '')) : 0) -
    (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[0].MonthlyAvg.replace(',', '')) : 0) -
    (this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows[1].MonthlyAvg.replace(',', '')) : 0));

    return (netIncomes - incomes).toFixed(0).toString();
  }

  // פונקציה חדשה לחישוב סה"כ הכנסות (נטו לבנק + הכנסות נוספות)
  CalcTotalIncomes() {
    let netToBank = parseFloat(this.CalcSumNetIncomes()) || 0;
    let additionalIncomes = parseFloat(this.CalcIncomesEx()) || 0;
    
    this.generalInfoService.AllInfo.IncomesViewInfo.TotalIncomes = netToBank + additionalIncomes;

    return (netToBank + additionalIncomes).toFixed(0).toString();
  }

  AddRowIncomes1() {
    this.generalInfoService.AllInfo.IncomesViewInfo.IncomeRows[0].push(new IncomeRowObj());
  }

  AddRowIncomes2() {
    this.generalInfoService.AllInfo.IncomesViewInfo.IncomeRows[1].push(new IncomeRowObj());
  }

  AddRowIncomesEx() {
    this.generalInfoService.AllInfo.IncomesViewInfo.IncomeExRows.push(new IncomeExRowObj());
  }

}