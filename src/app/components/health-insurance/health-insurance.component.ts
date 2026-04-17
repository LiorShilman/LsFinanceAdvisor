import { Component, OnInit } from '@angular/core';
import { HealthInsuranceRowObj } from 'src/app/services/GeneralTypes/GeneralTypes';
import { GeneralInfoService } from 'src/app/services/general-info.service';

declare var bootstrap: any;

@Component({
  selector: 'app-health-insurance',
  templateUrl: './health-insurance.component.html',
  styleUrls: ['./health-insurance.component.css']
})
export class HealthInsuranceComponent implements OnInit {
  constructor(public generalInfoService: GeneralInfoService) {
  }

  ngOnInit(): void {
    // Bootstrap tooltip initialization
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });
  }

  AddRow() {
    this.generalInfoService.AllInfo.HealthInsuranceViewInfo.HealthInsuranceRows.push(new HealthInsuranceRowObj());
  }

  // Calculate how many people have supplementary insurance
  GetSupplementaryInsuranceCount(): number {
    return this.generalInfoService.AllInfo.HealthInsuranceViewInfo.HealthInsuranceRows
      .filter(row => row.SupplementaryInsurance === true).length;
  }

  // Calculate how many people have private insurance
  GetPrivateInsuranceCount(): number {
    return this.generalInfoService.AllInfo.HealthInsuranceViewInfo.HealthInsuranceRows
      .filter(row => row.PrivateInsurancDescription && row.PrivateInsurancDescription.trim() !== '').length;
  }

  // Calculate total health fund coverage (if needed for future enhancements)
  GetHealthFundCoverage(): string[] {
    const uniqueHealthFunds = new Set<string>();
    this.generalInfoService.AllInfo.HealthInsuranceViewInfo.HealthInsuranceRows.forEach(row => {
      if (row.NameOfHealthInsurance && row.NameOfHealthInsurance.trim() !== '') {
        uniqueHealthFunds.add(row.NameOfHealthInsurance.trim());
      }
    });
    return Array.from(uniqueHealthFunds);
  }

  // Get coverage percentage (if needed for future analytics)
  GetCoveragePercentage(): { supplementary: number, private: number } {
    const totalRows = this.generalInfoService.AllInfo.HealthInsuranceViewInfo.HealthInsuranceRows.length;
    if (totalRows === 0) {
      return { supplementary: 0, private: 0 };
    }

    const supplementaryCount = this.GetSupplementaryInsuranceCount();
    const privateCount = this.GetPrivateInsuranceCount();

    return {
      supplementary: Math.round((supplementaryCount / totalRows) * 100),
      private: Math.round((privateCount / totalRows) * 100)
    };
  }
}