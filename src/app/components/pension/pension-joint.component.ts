import { Component, OnInit } from '@angular/core';
import { PensionJointRowObj } from 'src/app/services/GeneralTypes/GeneralTypes';
import { GeneralInfoService } from 'src/app/services/general-info.service';

declare var bootstrap: any;

@Component({
  selector: 'app-pension-joint',
  templateUrl: './pension-joint.component.html',
  styleUrls: ['./pension.component.css']
})
export class PensionJointComponent implements OnInit {

  constructor(public generalInfoService: GeneralInfoService) {
  };

  ngOnInit(): void {

    // Bootstrap tooltip initialization
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });
  }

  CalcAmounts() {
    this.generalInfoService.AllInfo.PensiaViewInfo.PensionJoint.Amounts = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.PensiaViewInfo.PensionJoint.PensionJointRows.length; i++) {
      this.generalInfoService.AllInfo.PensiaViewInfo.PensionJoint.Amounts += (this.generalInfoService.AllInfo.PensiaViewInfo.PensionJoint.PensionJointRows[i].Amount.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.PensiaViewInfo.PensionJoint.PensionJointRows[i].Amount.replace(',', '')) : 0);
    }

    return this.generalInfoService.AllInfo.PensiaViewInfo.PensionJoint.Amounts.toFixed(0).toString() != "0" ? this.generalInfoService.AllInfo.PensiaViewInfo.PensionJoint.Amounts.toFixed(0).toString() : "";
  }

  AddRow() {
    this.generalInfoService.AllInfo.PensiaViewInfo.PensionJoint.PensionJointRows.push(new PensionJointRowObj());
  }

}

