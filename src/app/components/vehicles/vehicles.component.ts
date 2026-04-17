import { Component } from '@angular/core';
import { VehiclesRowObj } from 'src/app/services/GeneralTypes/GeneralTypes';
import { GeneralInfoService } from 'src/app/services/general-info.service';

declare var bootstrap: any;

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent {
  constructor(public generalInfoService: GeneralInfoService) {
  }

  ngOnInit(): void {
    // Bootstrap tooltip initialization
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });
  }

  

  CalcNetWorths() {

    this.generalInfoService.AllInfo.VehiclesViewInfo.VehicleWorths = 0;

    for (let i = 0; i < this.generalInfoService.AllInfo.VehiclesViewInfo.VehiclesRows.length; i++) {
      this.generalInfoService.AllInfo.VehiclesViewInfo.VehicleWorths += (this.generalInfoService.AllInfo.VehiclesViewInfo.VehiclesRows[i].VehicleWorth.replace(',', '') != "" ? parseFloat(this.generalInfoService.AllInfo.VehiclesViewInfo.VehiclesRows[i].VehicleWorth.replace(',', '')) : 0);
    }

    return this.generalInfoService.AllInfo.VehiclesViewInfo.VehicleWorths.toFixed(0).toString();
  }


  AddRow() {
    this.generalInfoService.AllInfo.VehiclesViewInfo.VehiclesRows.push(new VehiclesRowObj());
  }
}