import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FinanceAssetRowObj } from 'src/app/services/GeneralTypes/GeneralTypes';
import { GeneralInfoService } from 'src/app/services/general-info.service';
import { FormattedMoneyComponent } from '../formatted-money/formatted-money.component';
import { FormulaDisplayComponent } from '../formula-display/formula-display.component';
import { InvestmentEmbedComponent } from './investment-embed.component';

declare var bootstrap: any;

@Component({
  selector: 'app-financial-assets',
  templateUrl: './financial-assets.component.html',
  styleUrls: ['./financial-assets.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormattedMoneyComponent   ,FormsModule, FormulaDisplayComponent,InvestmentEmbedComponent],
})
export class FinancialAssetsComponent implements OnInit {
  constructor(public generalInfoService: GeneralInfoService) {
  }

  ngOnInit(): void {
    // Bootstrap tooltip initialization
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });
  }

  CalcFinanceLiquidityAssets() {

    this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceLiquidityAssets = 0;

    //console.log(this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows);
    for (let i = 0; i < this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows.length; i++) {
      this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceLiquidityAssets += (this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[i].CurrentAmount.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows[i].CurrentAmount.replace(',', '')) : 0);
    }

    return this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceLiquidityAssets.toFixed(0).toString();
  }

  CalcFinanceUnliquidityAssets() {

    this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssets = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows.length; i++) {
      this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssets += (this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows[i].CurrentAmount.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows[i].CurrentAmount.replace(',', '')) : 0);
    }

    return this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssets.toFixed(0).toString();
  }

  CalcSumFinanceAssets() {
    this.generalInfoService.AllInfo.FinanceAssetsViewInfo.SumFinance =
      (this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceLiquidityAssets || 0) +
      (this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssets || 0);
  
    return (
      (this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceLiquidityAssets.toFixed(0).toString().replace(',', '') != "" 
        ? parseFloat(this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceLiquidityAssets.toFixed(0).toString().replace(',', '')) 
        : 0) +
      (this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssets.toFixed(0).toString().replace(',', '') != "" 
        ? parseFloat(this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssets.toFixed(0).toString().replace(',', '')) 
        : 0)
    ).toFixed(0).toString();
  }

  AddRowLiquidity() {
    this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceliquidityAssetsRows.push(new FinanceAssetRowObj());
  }

  AddRowUnliquidity() {
    this.generalInfoService.AllInfo.FinanceAssetsViewInfo.FinanceUnliquidityAssetsRows.push(new FinanceAssetRowObj());
  }
  
}
