import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../shared-services/auth.service';
import { RestAPIService } from '../shared-services/restAPI.service';
import { DatePipe, LocationStrategy } from '@angular/common';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { PathConstants } from '../constants/path.constants';
import * as Highcharts from 'highcharts';
import { MessageService } from 'primeng/api';
import { StatusMessage } from '../constants/Messages';

@Component({
  selector: 'app-godown-dashboard',
  templateUrl: './godown-dashboard.component.html',
  styleUrls: ['./godown-dashboard.component.css']
})
export class GodownDashboardComponent implements OnInit {
  cbRice: string = 'line';
  cbDhall: string = 'column';
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
  rawRiceCB: any;
  boiledRiceCB: any;
  dhallCB: any;
  pOilCB: any;
  wheatCB: any;
  sugarCB: any;
  rawRicePB: number = 0;
  boiledRicePB: number = 0;
  dhallPB: number = 0;
  pOilPB: number = 0;
  wheatPB: number = 0;
  sugarPB: number = 0;
  selectedCBRiceType: string;
  receiptQuantity: any;
  issueQuantity: any;
  isCBClicked: boolean = true;
  isReceiptClicked: boolean = false;
  isIssueClicked: boolean = false;
  display: boolean = false;
  notificationsHeight: any;
  noti: any;
  NotificationsData: any;
  TNCSCKey: string = 'Notification';
  @ViewChild('AADS', { static: false }) divAADS: ElementRef;
  @ViewChild('element', { static: false }) toastObj;


  constructor(private authService: AuthService, private restApiService: RestAPIService, private datePipe: DatePipe,
    private router: Router, private locationStrategy: LocationStrategy, private messageService: MessageService) { }

  ngOnInit() {
    this.showDialog();
    this.preventBackButton();
    this.calculateHeight();
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.date = this.datePipe.transform(new Date(), 'MM/dd/yyyy');
    let params = new HttpParams().set('Date', this.date);
    this.restApiService.get(PathConstants.DASHBOARD).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
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
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.DashboardNoRecord });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
    this.restApiService.get(PathConstants.REGION).subscribe(data => data);
    this.restApiService.getByParameters(PathConstants.CHART_CB, params).subscribe((response: any[]) => {
      if (response !== undefined && response !== null && response.length !== 0) {
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
            type: 'column'
          },
          credits: {
            enabled: false
          },
          xAxis: {
            categories: this.chartLabels
          },
          yAxis: {
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
            type: 'column'
          },
          credits: {
            enabled: false
          },
          xAxis: {
            categories: this.chartLabels
          },
          yAxis: {
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
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordForCBChart });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
    this.restApiService.getByParameters(PathConstants.CHART_RECEIPT, params).subscribe((response: any[]) => {
      if (response !== undefined && response.length !== 0 && response !== null) {
        this.receiptQuantity = response;
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
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordForReceiptChart });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
    this.restApiService.getByParameters(PathConstants.CHART_ISSUE, params).subscribe((response: any[]) => {
      if (response !== undefined && response.length !== 0 && response !== null) {
        this.chartLabels = response[1];
        this.issueQuantity = response;
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
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordForIssueChart });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
    this.restApiService.get(PathConstants.DASHBOARD_COMMODITY_PB).subscribe(data => {
      if (data !== undefined && data !== null) {
        this.rawRiceCB = (data.RawRice !== undefined && data.RawRice !== '') ? data.RawRice : 0;
        this.rawRicePB = this.rawRiceCB;
        this.boiledRiceCB = (data.BoiledRice !== undefined && data.BoiledRice !== '') ? data.BoiledRice : 0;
        this.boiledRicePB = this.boiledRiceCB;
        this.dhallCB = (data.Dhall !== undefined && data.Dhall !== '') ? data.Dhall : 0;
        this.dhallPB = this.dhallCB;
        this.pOilCB = (data.POil !== undefined && data.POil !== '') ? data.POil : 0;
        this.pOilPB = this.pOilCB;
        this.wheatCB = (data.Wheat !== undefined && data.Wheat !== '') ? data.Wheat : 0;
        this.wheatPB = this.wheatCB;
        this.sugarCB = (data.Sugar !== undefined && data.Sugar !== '') ? data.Sugar : 0;
        this.sugarPB = this.sugarCB;
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.DashboardNoRecord });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
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
        if (this.isCBClicked) {
          this.router.navigate(['cbStatement']);
        } else if (this.isReceiptClicked) {
          // this.router.navigate(['']);
        } else {
          // this.router.navigate(['']);
        }
    }

  }

  calculateQuantity(id) {
    switch (id) {
      case 'CB':
        this.isCBClicked = true;
        this.isReceiptClicked = this.isIssueClicked = false;
        this.rawRicePB = this.rawRiceCB;
        this.boiledRicePB = this.boiledRiceCB;
        this.dhallPB = this.dhallCB;
        this.wheatPB = this.wheatCB;
        this.pOilPB = this.pOilCB;
        this.sugarPB = this.sugarCB;
        break;
      case 'R':
        this.isReceiptClicked = true;
        this.isCBClicked = this.isIssueClicked = false;
        this.boiledRicePB = this.rawRicePB = this.dhallPB = this.wheatPB = this.pOilPB = this.sugarPB = 0;
        this.receiptQuantity[2].forEach(bc => {
          this.boiledRicePB += (bc * 1);
        })
        this.receiptQuantity[3].forEach(bg => {
          this.boiledRicePB += (bg * 1);
        })
        this.receiptQuantity[4].forEach(rc => {
          this.rawRicePB += (rc * 1);
        })
        this.receiptQuantity[5].forEach(rg => {
          this.rawRicePB += (rg * 1);
        })
        this.receiptQuantity[6].forEach(d => {
          this.dhallPB += (d * 1);
        })
        this.receiptQuantity[7].forEach(po => {
          this.pOilPB += (po * 1);
        })
        this.receiptQuantity[8].forEach(pp => {
          this.pOilPB += (pp * 1);
        })
        this.receiptQuantity[9].forEach(w => {
          this.wheatPB += (w * 1);
        })
        this.receiptQuantity[10].forEach(s => {
          this.sugarPB += (s * 1);
        })
        break;
      case 'I':
        this.isIssueClicked = true;
        this.isCBClicked = this.isReceiptClicked = false;
        this.boiledRicePB = this.rawRicePB = this.dhallPB = this.wheatPB = this.pOilPB = this.sugarPB = 0;
        this.issueQuantity[2].forEach(bc => {
          this.boiledRicePB += (bc * 1);
        })
        this.issueQuantity[3].forEach(bg => {
          this.boiledRicePB += (bg * 1);
        })
        this.issueQuantity[4].forEach(rc => {
          this.rawRicePB += (rc * 1);
        })
        this.issueQuantity[5].forEach(rg => {
          this.rawRicePB += (rg * 1);
        })
        this.issueQuantity[6].forEach(d => {
          this.dhallPB += (d * 1);
        })
        this.issueQuantity[7].forEach(po => {
          this.pOilPB += (po * 1);
        })
        this.issueQuantity[8].forEach(pp => {
          this.pOilPB += (pp * 1);
        })
        this.issueQuantity[9].forEach(w => {
          this.wheatPB += (w * 1);
        })
        this.issueQuantity[10].forEach(s => {
          this.sugarPB += (s * 1);
        })
        break;
    }
  }

  preventBackButton() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    })
  }

  calculateHeight() {
    const height = this.divAADS.nativeElement.offsetHeight;
    this.notificationsHeight = (height * 4);
  }

  showDialog() {
    const param = { 'Type': 1 };
    this.restApiService.getByParameters(PathConstants.NOTIFICATIONS, param).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.NotificationsData = res[0];
        this.NotificationsData = this.NotificationsData.Notes;
      }
    });
    const params = { 'sValue': this.TNCSCKey };
    this.restApiService.getByParameters(PathConstants.TNCSC_SETTINGS, params).subscribe(res => {
      if (res !== undefined) {
        this.noti = res[0];
        if (this.noti.TNCSCValue === 'NO') {
          this.display = false;
        }
        if (this.noti.TNCSCValue === 'YES') {
          this.display = true;
        }
      }
    });
  }
}