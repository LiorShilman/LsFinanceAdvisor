import { Component, OnInit } from '@angular/core';
import { LifeLongCareInsurancesInInsuranceCompany4ChildrensRowObj, LifeLongCareInsurancesInInsuranceCompanyRowObj } from 'src/app/services/GeneralTypes/GeneralTypes';
import { GeneralInfoService } from 'src/app/services/general-info.service';

declare var bootstrap: any;

@Component({
  selector: 'app-long-term-care-insurance',
  templateUrl: './long-term-care-insurance.component.html',
  styleUrls: ['./long-term-care-insurance.component.css']
})
export class LongTermCareInsuranceComponent implements OnInit {
  constructor(public generalInfoService: GeneralInfoService) {
  }

  ngOnInit(): void {
    // Bootstrap tooltip initialization
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });
  }


  CalcFirst5YearHomeAmount(num: number) {
    this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.First5YearHomeAmounts[num] = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[num].length; i++) {
      this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.First5YearHomeAmounts[num] += (this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[num][i].First5YearHomeAmount.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[num][i].First5YearHomeAmount.replace(',', '')) : 0);
    }

    if (this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInHealthFund[num].HomeAmount != "")
      this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.First5YearHomeAmounts[num] += parseInt(this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInHealthFund[num].HomeAmount.replace(',',''));
    
    return this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.First5YearHomeAmounts[num].toFixed(0).toString() != "0" ? this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.First5YearHomeAmounts[num].toFixed(0).toString() : "";
  }

  CalcOver6YearHomeAmount(num: number) {
    this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.Over6YearHomeAmounts[num] = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[num].length; i++) {
      this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.Over6YearHomeAmounts[num] += (this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[num][i].Over6YearHomeAmount.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[num][i].Over6YearHomeAmount.replace(',', '')) : 0);
    }

    return this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.Over6YearHomeAmounts[num].toFixed(0).toString() != "0" ? this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.Over6YearHomeAmounts[num].toFixed(0).toString() : "";
  }

  CalcFirst5YearSeudiAmount(num: number) {
    this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.First5YearSeudiAmounts[num] = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[num].length; i++) {
      this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.First5YearSeudiAmounts[num] += (this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[num][i].First5YearSeudiAmount.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[num][i].First5YearSeudiAmount.replace(',', '')) : 0);
    }

    
    if (this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInHealthFund[num].SeudiAmount != "")
      this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.First5YearSeudiAmounts[num] += parseInt(this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInHealthFund[num].SeudiAmount.replace(',',''));


    return this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.First5YearSeudiAmounts[num].toFixed(0).toString() != "0" ? this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.First5YearSeudiAmounts[num].toFixed(0).toString() : "";
  }

  CalcOver6YearSeudiAmount(num: number) {
    this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.Over6YearSeudiAmounts[num] = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[num].length; i++) {
      this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.Over6YearSeudiAmounts[num] += (this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[num][i].Over6YearSeudiAmount.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[num][i].Over6YearSeudiAmount.replace(',', '')) : 0);
    }

    return this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.Over6YearSeudiAmounts[num].toFixed(0).toString() != "0" ? this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.Over6YearSeudiAmounts[num].toFixed(0).toString() : "";
  }

  CalcGapFirst5YearHomeAmount(num: number) {
    return this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.First5YearHomeAmounts[num] - parseInt(this.generalInfoService.AllInfo.PersonalDataViewInfo.SaudiInsuranceInHome.replace(',',''));
  }

  CalcGapOver6YearHomeAmount(num: number) {
    return this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.Over6YearHomeAmounts[num] - parseInt(this.generalInfoService.AllInfo.PersonalDataViewInfo.SaudiInsuranceInHome.replace(',',''));
  }

  CalcGapFirst5YearSeudiAmount(num: number) {
    return this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.First5YearSeudiAmounts[num] - parseInt(this.generalInfoService.AllInfo.PersonalDataViewInfo.SaudiinsuranceInMossad.replace(',',''));
  }

  CalcGapOver6YearSeudiAmount(num: number) {
    return this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.Over6YearSeudiAmounts[num] - parseInt(this.generalInfoService.AllInfo.PersonalDataViewInfo.SaudiinsuranceInMossad.replace(',',''));
  }

  AddRowChildren() {
    this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompany4ChildrensRows.push(new LifeLongCareInsurancesInInsuranceCompany4ChildrensRowObj());
  }

  
  AddRowCompany1() {
    this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[0].push(new LifeLongCareInsurancesInInsuranceCompanyRowObj());
  }

  AddRowCompany2() {
    this.generalInfoService.AllInfo.LifeLongCareInsurancesViewInfo.LifeLongCareInsurancesInInsuranceCompanyRows[1].push(new LifeLongCareInsurancesInInsuranceCompanyRowObj());
  }
}
