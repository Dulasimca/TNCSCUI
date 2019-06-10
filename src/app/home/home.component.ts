import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared-services/auth.service';
import { RestAPIService } from '../shared-services/restAPI.service';
import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { PathConstants } from '../constants/path.constants';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  date: any;
  canShowMenu: boolean;
  notifications: any;
  errMessage: string;
  godownCount: any;
  mrmCount: any;
  aadsCount: any;
  fciCount: any;
  regionCount: any;
  crsCount: any;
  hullingAgencies: any;
  suppliersCount: any;
  schemeCount: any;
  Highcharts = Highcharts;
  options: any;
  riceData: any;
  dhallAndOilData: any;
  wheatAndSugarData: any;
  chartLabels: any[];
  ricePB: any;
  dhallPB: any;
  pOilPB: any;
  wheatPB: any;
  sugarPB: any;
  constructor(private authService: AuthService, private restApiService: RestAPIService, private datePipe: DatePipe,
    private router: Router) {}

    ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    const date = new Date();
    this.date = this.datePipe.transform(date, 'mm/dd/yyyy');
    let params = new HttpParams().set('Date', this.date);
    this.restApiService.get(PathConstants.DASHBOARD).subscribe(res => {
      if (res !== undefined) {
        this.godownCount = res[0];
        this.mrmCount = res[1];
        this.aadsCount = res[2];
        this.fciCount = res[3];
        this.regionCount = res[4];
        this.crsCount = res[5];
        this.hullingAgencies = res[6];
        this.suppliersCount = res[7];
        this.schemeCount = res[8];
        this.notifications = res[9];
      } else {
        this.errMessage = 'Record not found';
      }
    })
    this.restApiService.get(PathConstants.REGION).subscribe(data => data);
    this.restApiService.getByParameters(PathConstants.CHART, params).subscribe((response: any[]) => {
      if (response !== undefined) {
        this.chartLabels = response[1];
        this.riceData = {
          title: {
            text: 'Rice chart'
          },
          series: [{ data: response[2], name: 'BOILED COMMON', color: '#00ff00' },
          { data: response[3], name: 'BOILED GRADEA', color: '#00cc00' },
          { data: response[4], name: 'RAW COMMON', color: '#ffff1a' },
          { data: response[5], name: 'RAW GRADEA', color: '#ffcc00' }],
          plotOptions: {
            bar: {
              dataLabels: {
                enabled: true
              }
            },
            series: {
              stacking: 'normal',
              pointWidth: '25',
              pointPadding: 0,
              borderWidth: 0
            }
          },
          chart: {
            type: "column"
          },
          credits: {
            enabled: false
          },
          xAxis: {
            categories: this.chartLabels
          },
          yAxis: {
            min: 0,
            title: {
              text: 'Total Quantity in Mts (thousands)',
              align: 'high'
            },
            stackLabels: {
              enabled: true,
              style: {
                overflow: 'justify'
              }
            }
          },
          legend: {
            align: 'right',
            x: -30,
            verticalAlign: 'top',
            y: 5,
            floating: false,
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
          },
        };
        this.dhallAndOilData = {
          title: {
            text: 'Dhall & Oil chart'
          },
          series: [{ data: response[6], name: 'DHALL', color: '#00ff00' },
          { data: response[7], name: 'PAMOLIEN OIL', color: '#00cc00' },
          { data: response[8], name: 'PAMOLIEN POUCH', color: '#ffff1a' }],
          plotOptions: {
            bar: {
              dataLabels: {
                enabled: true
              }
            },
            series: {
              stacking: 'normal',
              pointWidth: '25',
              pointPadding: 0,
              borderWidth: 0
            }
          },
          chart: {
            type: "column"
          },
          credits: {
            enabled: false
          },
          xAxis: {
            categories: this.chartLabels
          },
          yAxis: {
            min: 0,
            title: {
              text: 'Total Quantity in Mts (thousands)',
              align: 'high'
            },

            stackLabels: {
              enabled: true,
              style: {
                overflow: 'justify'
              }
            }
          },
          legend: {
            align: 'right',
            x: -30,
            verticalAlign: 'top',
            y: 5,
            floating: false,
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
          },
        };
        this.wheatAndSugarData = {
          title: {
            text: 'Wheat & Sugar chart'
          },
          series: [{ data: response[9], name: 'WHEAT', color: '#00ff00' },
          { data: response[10], name: 'SUGAR', color: '#FFA824' }],
          plotOptions: {
            line: {
              dataLabels: {
                enabled: true
              },
              enableMouseTracking: false
            }
          },
          chart: {
            type: "line"
          },
          xAxis: {
            categories: this.chartLabels
          },
          yAxis: {
            min: 0,
            title: {
              text: 'Total Quantity in Mts (thousands)',
              align: 'high'
            },
            stackLabels: {
              enabled: true,
              style: {
                overflow: 'justify'
              }
            },
          },
          legend: {
            align: 'right',
            x: -30,
            verticalAlign: 'top',
            y: 5,
            floating: false,
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
          },
          credits: {
            enabled: false
          },
        };
      }
    });
    this.restApiService.get(PathConstants.DASHBOARD_COMMODITY_PB).subscribe(data => {
      if (data !== undefined) {
        this.ricePB = data.Rice;
        this.dhallPB = data.Dhall;
        this.pOilPB = data.POil;
        this.wheatPB = data.Wheat;
        this.sugarPB = data.Sugar;
      }
    })
  }

  onGridClicked(param) {
    switch (param) {
      case 'godown':
        this.router.navigate(['godownData']);
        break;
      case 'mrm':
        this.router.navigate(['mrmData']);
        break;
      case 'crs':
        this.router.navigate(['crsData']);
        break;
      case 'aads':
        this.router.navigate(['aadsData']);
        break;
      case 'fci':
        this.router.navigate(['fciData']);
        break;
      case 'regions':
        this.router.navigate(['regions']);
        break;
      case 'hullingAgencies':
        this.router.navigate(['hullingAgencies']);
        break;
      case 'depositors':
        this.router.navigate(['depositors']);
        break;
      case 'schemes':
        this.router.navigate(['schemes']);
        break;
      case 'PB':
        this.router.navigate(['Daily Stock Statement']);
    }

  }
}
