import { Component } from '@angular/core';
import { RealEstateRowObj } from 'src/app/services/GeneralTypes/GeneralTypes';
import { GeneralInfoService } from 'src/app/services/general-info.service';


declare var bootstrap: any;

@Component({
  selector: 'app-real-estate',
  templateUrl: './real-estate.component.html',
  styleUrls: ['./real-estate.component.css']
})
export class RealEstateComponent {
 

  constructor(public generalInfoService: GeneralInfoService) {
  
  }

  ngOnInit(): void {
    // Bootstrap tooltip initialization
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    
  }

  

  CalcAssetValues() {

    var assetValue = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.RealEstateViewInfo.RealEstateRows.length; i++) {
      assetValue += (this.generalInfoService.AllInfo.RealEstateViewInfo.RealEstateRows[i].AssetValue.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.RealEstateViewInfo.RealEstateRows[i].AssetValue.replace(',', '')) : 0);
    }

    this.generalInfoService.AllInfo.RealEstateViewInfo.AssetValues = assetValue.toFixed(0).toString();

    return assetValue.toFixed(0).toString();
  }

  CalcNortgageBalances() {

    var nortgageBalances = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.RealEstateViewInfo.RealEstateRows.length; i++) {
      nortgageBalances += (this.generalInfoService.AllInfo.RealEstateViewInfo.RealEstateRows[i].NortgageBalance.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.RealEstateViewInfo.RealEstateRows[i].NortgageBalance.replace(',', '')) : 0);
    }

    this.generalInfoService.AllInfo.RealEstateViewInfo.NortgageBalances = nortgageBalances.toFixed(0).toString();

    return nortgageBalances.toFixed(0).toString();
  }

  CalcNetWorths() {

    this.generalInfoService.AllInfo.RealEstateViewInfo.NetWorths = (this.generalInfoService.AllInfo.RealEstateViewInfo.AssetValues.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.RealEstateViewInfo.AssetValues.replace(',', '')) : 0) -
      (this.generalInfoService.AllInfo.RealEstateViewInfo.NortgageBalances.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.RealEstateViewInfo.NortgageBalances.replace(',', '')) : 0);
    /* 
        for (let i = 0; i < 10; i++) {
          netWorths += (this.generalInfoService.AllInfo.RealEstateViewInfo.RealEstateRows[i].NetWorth.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.RealEstateViewInfo.RealEstateRows[i].NetWorth.replace(',', '')) : 0);
        }
     */
    //this.generalInfoService.AllInfo.FixedExpensesViewInfo.MonthlyExpense1Avg = expenses.toFixed(0).toString();

    return this.generalInfoService.AllInfo.RealEstateViewInfo.NetWorths.toFixed(0).toString();
  }

  AddRow() {
    this.generalInfoService.AllInfo.RealEstateViewInfo.RealEstateRows.push(new RealEstateRowObj());
  }

}
