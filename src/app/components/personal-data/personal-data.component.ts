import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GeneralInfoService } from "../../services/general-info.service";
//import { FormBuilder } from '@angular/forms';
import { ChildObj } from 'src/app/services/GeneralTypes/GeneralTypes';
import more from 'highcharts/highcharts-more';
//import calculatedWrap from './calculated-wrap';
//calculatedWrap(Highcharts);
import patternFill from "highcharts/modules/pattern-fill";
patternFill(Highcharts);

more(Highcharts);
import Accessibility from 'highcharts/modules/accessibility';
Accessibility(Highcharts);
//import { Chart } from 'chart.js/auto';
import * as Highcharts from 'highcharts';
import * as DiagramHighcharts from 'highcharts';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
/* import HC_drilldown from 'highcharts/modules/drilldown';
HC_drilldown(Highcharts); */
let threeD = require('highcharts/highcharts-3d')
threeD(Highcharts);

declare var bootstrap: any;

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.css']
})
export class PersonalDataComponent implements OnInit {

  updateFlag = false;
  highcharts = Highcharts;

  chartOptions: Highcharts.Options = {
    chart: {
      type: 'gauge',
      styledMode: false,
      backgroundColor: 'transparent',
      plotBackgroundColor: 'transparent',
      plotBackgroundImage: undefined,
      plotBorderWidth: 0,
      plotShadow: false,
      height: 500,
      width: null,
      spacing: [20, 20, 20, 20],
      margin: [20, 20, 60, 20]
    },
    title: {
      text: 'דירוג אשראי',
      style: {
        color: '#ffffff',
        fontSize: '24px',
        fontWeight: '700',
        textShadow: '0 0 15px rgba(0, 212, 255, 0.8)',
        fontFamily: 'Inter, sans-serif'
      },
      y: 30
    },
    credits: {
      enabled: false
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      borderColor: '#00d4ff',
      borderRadius: 12,
      borderWidth: 2,
      style: {
        color: '#ffffff',
        fontSize: '16px',
        fontWeight: '600'
      }
    },
    pane: {
      startAngle: -90,
      endAngle: 89.9,
      background: [{
        backgroundColor: 'transparent',
        borderWidth: 0,
        outerRadius: '100%'
      }],
      center: ['50%', '70%'],
      size: '100%'
    },
    yAxis: {
      min: 0,
      max: 1000,
      tickPixelInterval: 200,
      tickPosition: 'outside',
      tickColor: '#00d4ff',
      tickLength: 20,
      tickWidth: 2,
      minorTickInterval: null,
      minorTickColor: 'rgba(0, 212, 255, 0.4)',
      minorTickLength: 10,
      minorTickWidth: 1,
      minorTickPosition: 'outside',
      labels: {
        distance: 25,
        style: {
          color: '#ffffff',
          fontSize: '12px',
          fontWeight: '600',
          textShadow: '0 0 5px rgba(0, 212, 255, 0.5)'
        }
      },
      lineWidth: 0,
      plotBands: [{
        from: 0,
        to: 320,
        color: '#ff4757',
        thickness: 30,
        innerRadius: '80%',
        outerRadius: '105%'
      }, {
        from: 320,
        to: 570,
        color: '#ff8c39',
        thickness: 30,
        innerRadius: '80%',
        outerRadius: '105%'
      }, {
        from: 570,
        to: 730,
        color: '#ffca39',
        thickness: 30,
        innerRadius: '80%',
        outerRadius: '105%'
      }, {
        from: 730,
        to: 850,
        color: '#00d2c3',
        thickness: 30,
        innerRadius: '80%',
        outerRadius: '105%'
      }, {
        from: 850,
        to: 1000,
        color: '#00d27a',
        thickness: 30,
        innerRadius: '80%',
        outerRadius: '105%'
      }]
    },
    series: [{
      type: 'gauge' as any,
      name: 'דירוג',
      data: [750],
      tooltip: {
        valueSuffix: ' נקודות'
      },
      dataLabels: {
        format: '<div style="text-align: center;"><span style="font-size: 28px; font-weight: bold; color: #00d4ff; text-shadow: 0 0 15px rgba(0, 212, 255, 1);">{y}</span><br><span style="font-size: 14px; color: #ffffff; opacity: 0.9; font-weight: 600;">נקודות אשראי</span></div>',
        borderWidth: 0,
        y: 10,
        useHTML: true
      },
      dial: {
        radius: '75%',
        backgroundColor: '#00d4ff',
        borderColor: '#ffffff',
        borderWidth: 3,
        baseWidth: 10,
        baseLength: '0%',
        rearLength: '15%',
        topWidth: 3
      },
      pivot: {
        backgroundColor: '#00d4ff',
        radius: 12,
        borderColor: '#ffffff',
        borderWidth: 3
      }
    }],
    legend: {
      enabled: false
    }
  };

  constructor(public generalInfoService: GeneralInfoService) {
    // Initialize chart options with current credit rating
    this.updateChartData();
  };

  ngOnInit(): void {
    // Bootstrap tooltip initialization with enhanced styling
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl, {
        customClass: 'custom-tooltip',
        trigger: 'hover focus'
      });
    });

    this.UpdateChart();
    this.initializeDefaultValues();
  }

  private initializeDefaultValues(): void {
    // Set default values if empty
    if (!this.generalInfoService.AllInfo.PersonalDataViewInfo.RetirementAge1) {
      this.generalInfoService.AllInfo.PersonalDataViewInfo.RetirementAge1 = "67";
    }
    if (!this.generalInfoService.AllInfo.PersonalDataViewInfo.SaudiInsuranceInHome) {
      this.generalInfoService.AllInfo.PersonalDataViewInfo.SaudiInsuranceInHome = "10,000";
    }
    if (!this.generalInfoService.AllInfo.PersonalDataViewInfo.SaudiinsuranceInMossad) {
      this.generalInfoService.AllInfo.PersonalDataViewInfo.SaudiinsuranceInMossad = "15,000";
    }
    if (!this.generalInfoService.AllInfo.PersonalDataViewInfo.AnnualInterest) {
      this.generalInfoService.AllInfo.PersonalDataViewInfo.AnnualInterest = "3.74";
    }
    if (!this.generalInfoService.AllInfo.PersonalDataViewInfo.Unplanned) {
      this.generalInfoService.AllInfo.PersonalDataViewInfo.Unplanned = "5";
    }
    if (!this.generalInfoService.AllInfo.PersonalDataViewInfo.CreditRating) {
      this.generalInfoService.AllInfo.PersonalDataViewInfo.CreditRating = "750";
    }
  }

  private updateChartData(): void {
    const creditRating = parseInt(this.generalInfoService.AllInfo.PersonalDataViewInfo.CreditRating) || 750;
    
    if (this.chartOptions && this.chartOptions.series) {
      (this.chartOptions.series[0] as any).data = [creditRating];
    }
  }

  UpdateChart() {
    let dataCurr: Highcharts.PointOptionsObject[] = [];

    if (this.chartOptions && this.chartOptions.series) {
      console.log("update");

      dataCurr.push({
        y: parseInt(this.generalInfoService.AllInfo.PersonalDataViewInfo.CreditRating),
      });

      console.log(this.generalInfoService.AllInfo.PersonalDataViewInfo.CreditRating);
      
      this.chartOptions.series[0] = {
        type: 'gauge' as any,
        name: 'דירוג',
        data: dataCurr,
        tooltip: {
          valueSuffix: ' נקודות'
        },
        dataLabels: {
          format: '<div style="text-align: center;"><span style="font-size: 28px; font-weight: bold; color: #00d4ff; text-shadow: 0 0 15px rgba(0, 212, 255, 1);">{y}</span><br><span style="font-size: 14px; color: #ffffff; opacity: 0.9; font-weight: 600;">נקודות אשראי</span></div>',
          borderWidth: 0,
          y: 10,
          useHTML: true
        },
        dial: {
          radius: '75%',
          backgroundColor: '#00d4ff',
          borderColor: '#ffffff',
          borderWidth: 3,
          baseWidth: 10,
          baseLength: '0%',
          rearLength: '15%',
          topWidth: 3
        },
        pivot: {
          backgroundColor: '#00d4ff',
          radius: 12,
          borderColor: '#ffffff',
          borderWidth: 3
        }
      };

      console.log("update2");
      this.updateFlag = true;
    }
  }

  private getColorFromCreditRating(rating: number): string {
    if (rating <= 320) return '#ff4757';
    if (rating <= 570) return '#ff8c39';
    if (rating <= 730) return '#ffca39';
    if (rating <= 850) return '#00d2c3';
    return '#00d27a';
  }

  BDIDescription(): string {
    const val = parseInt(this.generalInfoService.AllInfo.PersonalDataViewInfo.CreditRating) || 0;

    if (val <= 320) {
      return '🔴 דירוג נמוך - התנהלות פיננסית הדורשת שיפור מיידי';
    } else if (val <= 570) {
      return '🟠 דירוג מתחת לממוצע - התנהלות פיננסית הזקוקה להתייעלות';
    } else if (val <= 730) {
      return '🟡 דירוג ממוצע - התנהלות פיננסית סבירה עם מקום לשיפור';
    } else if (val <= 850) {
      return '🟢 דירוג טוב - התנהלות פיננסית איכותית';
    } else {
      return '⭐ דירוג מצויין - התנהלות פיננסית מושלמת';
    }
  }

  getStyleFromVal(credit: string): string {
    const val = parseInt(credit) || 0;

    if (val <= 320) return '#ff4757';
    if (val <= 570) return '#ff8c39';
    if (val <= 730) return '#ffca39';
    if (val <= 850) return '#00d2c3';
    return '#00d27a';
  }

  ValidateIsraeliID(id: string): boolean {
    if (!/^\d{9}$/.test(id)) {
      return false;
    }

    const digits = id.split('').map(Number);
    const checksum = digits.reduce((accum, digit, index) => {
      const doubledDigit = digit * ((index % 2) + 1);
      return accum + (doubledDigit > 9 ? doubledDigit - 9 : doubledDigit);
    }, 0);

    return checksum % 10 === 0;
  }

  OnModelChange(event: any, type: string): void {
    if (type === 'CreditRating') {
      this.UpdateChart();
    }
  }

  GetClassValidation(val: string): string {
    switch (val) {
      case 'Name1':
        return this.generalInfoService.AllInfo.PersonalDataViewInfo.Name1 ? 'is-valid' : 'is-invalid';
      
      case 'Age1':
        return this.generalInfoService.AllInfo.PersonalDataViewInfo.Age1 ? 'is-valid' : 'is-invalid';
      
      case 'Sex1':
        return (this.generalInfoService.AllInfo.PersonalDataViewInfo.SelectedSex1 && 
                this.generalInfoService.AllInfo.PersonalDataViewInfo.SelectedSex1 !== "בחר ...") ? 'is-valid' : 'is-invalid';
      
      case 'Status1':
        return (this.generalInfoService.AllInfo.PersonalDataViewInfo.SelectedStatus1 && 
                this.generalInfoService.AllInfo.PersonalDataViewInfo.SelectedStatus1 !== "בחר ...") ? 'is-valid' : 'is-invalid';
      
      case 'RetirementAge1':
        return this.generalInfoService.AllInfo.PersonalDataViewInfo.RetirementAge1 ? 'is-valid' : 'is-invalid';
      
      case 'Name2':
        if (this.generalInfoService.AllInfo.PersonalDataViewInfo.Marride) {
          return this.generalInfoService.AllInfo.PersonalDataViewInfo.Name2 ? 'is-valid' : 'is-invalid';
        }
        return '';
      
      case 'Age2':
        if (this.generalInfoService.AllInfo.PersonalDataViewInfo.Marride) {
          return this.generalInfoService.AllInfo.PersonalDataViewInfo.Age2 ? 'is-valid' : 'is-invalid';
        }
        return '';
      
      case 'Sex2':
        if (this.generalInfoService.AllInfo.PersonalDataViewInfo.Marride) {
          return (this.generalInfoService.AllInfo.PersonalDataViewInfo.SelectedSex2 && 
                  this.generalInfoService.AllInfo.PersonalDataViewInfo.SelectedSex2 !== "בחר ...") ? 'is-valid' : 'is-invalid';
        }
        return '';
      
      case 'RetirementAge2':
        if (this.generalInfoService.AllInfo.PersonalDataViewInfo.Marride) {
          return this.generalInfoService.AllInfo.PersonalDataViewInfo.RetirementAge2 ? 'is-valid' : 'is-invalid';
        }
        return '';
      
      case 'SaudiInsuranceInHome':
        return this.generalInfoService.AllInfo.PersonalDataViewInfo.SaudiInsuranceInHome ? 'is-valid' : 'is-invalid';
      
      case 'SaudiinsuranceInMossad':
        return this.generalInfoService.AllInfo.PersonalDataViewInfo.SaudiinsuranceInMossad ? 'is-valid' : 'is-invalid';
      
      case 'AnnualInterest':
        return this.generalInfoService.AllInfo.PersonalDataViewInfo.AnnualInterest ? 'is-valid' : 'is-invalid';
      
      case 'Unplanned':
        return this.generalInfoService.AllInfo.PersonalDataViewInfo.Unplanned ? 'is-valid' : 'is-invalid';
      
      case 'Mail':
        return emailRegex.test(this.generalInfoService.AllInfo.PersonalDataViewInfo.Mail) ? 'is-valid' : 'is-invalid';
      
      case 'Id':
        return this.ValidateIsraeliID(this.generalInfoService.AllInfo.PersonalDataViewInfo.Id) ? 'is-valid' : 'is-invalid';
      
      case 'CreditRating':
        const rating = parseInt(this.generalInfoService.AllInfo.PersonalDataViewInfo.CreditRating);
        return (rating >= 0 && rating <= 1000) ? 'is-valid' : 'is-invalid';
    }

    return '';
  }

  onNumberOfChildrenChange(numberOfChildren: number): void {
    const currentChildrenCount = this.generalInfoService.AllInfo.PersonalDataViewInfo.Child.length;
    
    if (currentChildrenCount > numberOfChildren) {
      // Remove excess children
      for (let i = numberOfChildren; i < currentChildrenCount; i++) {
        this.generalInfoService.AllInfo.PersonalDataViewInfo.Child.pop();
      }
    } else {
      // Add new children
      for (let i = currentChildrenCount; i < numberOfChildren; i++) {
        const child = new ChildObj();
        this.generalInfoService.AllInfo.PersonalDataViewInfo.Child.push(child);
      }
    }
  }

  onStatusOfPartner1Change(statusOfPartner1: string): void {
    this.generalInfoService.AllInfo.PersonalDataViewInfo.Marride = (statusOfPartner1 === "נשוי");
    
    // Reset partner 2 data if not married
    if (!this.generalInfoService.AllInfo.PersonalDataViewInfo.Marride) {
      this.generalInfoService.AllInfo.PersonalDataViewInfo.Name2 = "";
      this.generalInfoService.AllInfo.PersonalDataViewInfo.Age2 = "";
      this.generalInfoService.AllInfo.PersonalDataViewInfo.SelectedSex2 = "";
      this.generalInfoService.AllInfo.PersonalDataViewInfo.RetirementAge2 = "";
    }
  }
}