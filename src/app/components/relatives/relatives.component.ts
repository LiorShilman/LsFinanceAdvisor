import { Component, OnDestroy, OnInit } from '@angular/core';
import { GeneralInfoService } from 'src/app/services/general-info.service';

@Component({
  selector: 'app-relatives',
  templateUrl: './relatives.component.html',
  styleUrls: ['./relatives.component.css']
})
export class RelativesComponent implements OnInit, OnDestroy {
  constructor(public generalInfoService: GeneralInfoService) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }

  CalcGetF() {
    return ((this.generalInfoService.AllInfo.RelativeViewInfo.FatherGetF1.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.RelativeViewInfo.FatherGetF1.replace(',', '')) : 0) +
      (this.generalInfoService.AllInfo.RelativeViewInfo.MotherGetF1.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.RelativeViewInfo.MotherGetF1.replace(',', '')) : 0) +
      (this.generalInfoService.AllInfo.RelativeViewInfo.FatherGetF2.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.RelativeViewInfo.FatherGetF2.replace(',', '')) : 0) +
      (this.generalInfoService.AllInfo.RelativeViewInfo.MotherGetF2.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.RelativeViewInfo.MotherGetF2.replace(',', '')) : 0)).toFixed(0).toString();
  }

}
