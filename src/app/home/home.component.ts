import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared-services/auth.service';
import { RestAPIService } from '../shared-services/restAPI.service';
import { DatePipe } from '@angular/common';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
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
  shopsCount: any;
  hullingAgencies: any;
  suppliersCount: any;
  schemeCount: any;
  Highcharts = Highcharts;
  options: any;
  CBRiceData: any;
  CBDhallAndOilData: any;
  CBWheatAndSugarData: any;
  ReceiptRiceData: any;
  ReceiptDhallAndOilData: any;
  ReceiptWheatAndSugarData: any;
  IssueRiceData: any;
  IssueDhallAndOilData: any;
  IssueWheatAndSugarData: any;
  chartLabels: any[];
  rawRicePB: any;
  boiledRicePB: any;
  dhallPB: any;
  pOilPB: any;
  wheatPB: any;
  sugarPB: any;
  constructor(private authService: AuthService, private restApiService: RestAPIService, private datePipe: DatePipe,
    private router: Router) {}

    ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.date = this.datePipe.transform(new Date(), 'MM/dd/yyyy');
    let params = new HttpParams().set('Date', this.date);
    this.restApiService.get(PathConstants.DASHBOARD).subscribe(res => {
      if (res !== undefined) {
        this.godownCount = (res[0] !== undefined && res[0] !== '') ? res[0] : 0;
        this.mrmCount = (res[1] !== undefined && res[1] !== '') ? res[1] : 0;
        this.aadsCount = (res[2] !== undefined && res[2] !== '') ? res[2] : 0;
        this.fciCount = (res[3] !== undefined && res[3] !== '') ? res[3] : 0;
        this.regionCount = (res[4] !== undefined && res[4] !== '') ? res[4] : 0;
        this.shopsCount = (res[5] !== undefined && res[5] !== '') ? res[5] : 0;
        this.hullingAgencies = (res[6] !== undefined && res[6] !== '') ? res[6] : 0;
        this.suppliersCount = (res[7] !== undefined && res[7] !== '') ? res[7] : 0;
        this.schemeCount = (res[8] !== undefined && res[8] !== '') ? res[8] : 0;
        this.notifications = (res[9] !== undefined && res[9] !== '') ? res[9] : 0;
      } else {
        this.errMessage = 'Record not found';
      }
    });
    this.restApiService.get(PathConstants.REGION).subscribe(data => data);
    if(this.CBRiceData === undefined &&  this.CBWheatAndSugarData === undefined && this.CBDhallAndOilData === undefined) {
    this.restApiService.getByParameters(PathConstants.CHART_CB, params).subscribe((response: any[]) => {
      if (response !== undefined) {
        this.chartLabels = response[1];
        this.CBRiceData = {
          title: {
            text: 'Rice chart - CB'
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
        this.CBDhallAndOilData = {
          title: {
            text: 'Dhall & Oil chart - CB'
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
        this.CBWheatAndSugarData = {
          title: {
            text: 'Wheat & Sugar chart - CB'
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
  }
  if (this.ReceiptDhallAndOilData === undefined && this.ReceiptRiceData === undefined && this.ReceiptWheatAndSugarData === undefined) {
    this.restApiService.getByParameters(PathConstants.CHART_RECEIPT, params).subscribe((response: any[]) => {
      if (response !== undefined) {
        this.chartLabels = response[1];
        this.ReceiptRiceData = {
          title: {
            text: 'Rice chart - Receipt'
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
        this.ReceiptDhallAndOilData = {
          title: {
            text: 'Dhall & Oil chart - Receipt'
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
        this.ReceiptWheatAndSugarData = {
          title: {
            text: 'Wheat & Sugar chart - Receipt'
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
  }
  if ( this.IssueDhallAndOilData === undefined && this.IssueRiceData === undefined && this.IssueWheatAndSugarData === undefined) {
    this.restApiService.getByParameters(PathConstants.CHART_ISSUE, params).subscribe((response: any[]) => {
      if (response !== undefined) {
        this.chartLabels = response[1];
        this.IssueRiceData = {
          title: {
            text: 'Rice chart - Issue'
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
        this.IssueDhallAndOilData = {
          title: {
            text: 'Dhall & Oil chart - Issue'
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
        this.IssueWheatAndSugarData = {
          title: {
            text: 'Wheat & Sugar chart - Issue'
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
  }
    this.restApiService.get(PathConstants.DASHBOARD_COMMODITY_PB).subscribe(data => {
      if (data !== undefined) {
        this.rawRicePB = (data.RawRice !== undefined && data.RawRice !== '') ? data.RawRice : 0;
        this.boiledRicePB = (data.BoiledRice !== undefined && data.BoiledRice !== '') ? data.BoiledRice : 0;
        this.dhallPB = (data.Dhall !== undefined && data.Dhall !== '') ? data.Dhall : 0;
        this.pOilPB = (data.POil !== undefined && data.POil !== '') ? data.POil : 0;
        this.wheatPB = (data.Wheat !== undefined && data.Wheat !== '') ? data.Wheat : 0;
        this.sugarPB = (data.Sugar !== undefined && data.Sugar !== '') ? data.Sugar : 0;
      }
    });
  }

  onGridClicked(param) {
    switch (param) {
      case 'godown':
        this.router.navigate(['godownData']);
        break;
      case 'mrm':
        this.router.navigate(['mrmData']);
        break;
      case 'shops':
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
