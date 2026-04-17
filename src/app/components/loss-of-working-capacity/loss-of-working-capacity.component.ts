import { Component, OnInit } from '@angular/core';
import { GeneralInfoService } from 'src/app/services/general-info.service';

declare var bootstrap: any;

@Component({
  selector: 'app-loss-of-working-capacity',
  templateUrl: './loss-of-working-capacity.component.html',
  styleUrls: ['./loss-of-working-capacity.component.css']
})
export class LossOfWorkingCapacityComponent implements OnInit {
  constructor(public generalInfoService: GeneralInfoService) {
  }

  ngOnInit(): void {
    // Bootstrap tooltip initialization
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });
  }

  Calc75Percents(num: number) {
    this.generalInfoService.AllInfo.LossOfWorkingCapacity.MaximumAmount[num] = (this.generalInfoService.AllInfo.LossOfWorkingCapacity.GrossForPension[num] != "") ? (parseInt(this.generalInfoService.AllInfo.LossOfWorkingCapacity.GrossForPension[num]) * 0.75).toFixed(0).toString() : "";

    return parseInt(this.generalInfoService.AllInfo.LossOfWorkingCapacity.MaximumAmount[num]);
  }

  CalcSumSource(num: number) {
    let sumSource = 0;

    sumSource += this.generalInfoService.AllInfo.LossOfWorkingCapacity.SocialSecurity[num] != "" ? parseInt(this.generalInfoService.AllInfo.LossOfWorkingCapacity.SocialSecurity[num]) : 0;
    sumSource += this.generalInfoService.AllInfo.LossOfWorkingCapacity.PensionFund[num] != "" ? parseInt(this.generalInfoService.AllInfo.LossOfWorkingCapacity.PensionFund[num]) : 0;
    sumSource += this.generalInfoService.AllInfo.LossOfWorkingCapacity.ManagerInsurance[num] != "" ? parseInt(this.generalInfoService.AllInfo.LossOfWorkingCapacity.ManagerInsurance[num]) : 0;
    sumSource += this.generalInfoService.AllInfo.LossOfWorkingCapacity.PrivateInsurance[num] != "" ? parseInt(this.generalInfoService.AllInfo.LossOfWorkingCapacity.PrivateInsurance[num]) : 0;

    this.generalInfoService.AllInfo.LossOfWorkingCapacity.SumSource[num] = sumSource
    return this.generalInfoService.AllInfo.LossOfWorkingCapacity.SumSource[num];
  }

  CalcGap(num: number) {
    let sumGapSource = 0;

    if (this.generalInfoService.AllInfo.LossOfWorkingCapacity.SumSource[num] != 0) {
      sumGapSource = this.generalInfoService.AllInfo.LossOfWorkingCapacity.SumSource[num] - parseInt(this.generalInfoService.AllInfo.LossOfWorkingCapacity.MaximumAmount[num]);
      this.generalInfoService.AllInfo.LossOfWorkingCapacity.SumGapSource[num] = sumGapSource
      return this.generalInfoService.AllInfo.LossOfWorkingCapacity.SumGapSource[num];
    }
    else {
      return 0;
    }
  }
}