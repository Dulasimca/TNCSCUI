import { Component, OnInit } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-commodity-issue-memo',
  templateUrl: './commodity-issue-memo.component.html',
  styleUrls: ['./commodity-issue-memo.component.css']
})
export class CommodityIssueMemoComponent implements OnInit {
  commodityIssueMemoCols: any;
  commodityIssueMemoData: any;
  fromDate: any;
  toDate: any;
  isViewDisabled: any;
  isActionDisabled: any;
  data: any;
  g_cd: any;
  c_cd: any;
  godownOptions: SelectItem[];
  commodityOptions: SelectItem[];
  truckName: string;
  canShowMenu: boolean;
  maxDate: Date;
  loading: boolean;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe, private router: Router,
     private messageService: MessageService, private authService: AuthService, private excelService: ExcelService, private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.isViewDisabled = this.isActionDisabled = true;
    this.commodityIssueMemoCols = this.tableConstants.CommodityIssueMemoReport;
    this.data = this.roleBasedService.getInstance();
    this.maxDate = new Date();
  }

  onSelect(item) {
    let godownSelection = [];
    let commoditySelection = [];

    switch (item) {
      case 'gd':
        if (this.data !== undefined) {
          this.data.forEach(x => {
            godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            this.godownOptions = godownSelection;
          });
          this.godownOptions.unshift({ 'label': null, 'value': null });
        }
        break;
      case 'cd':
        if(this.commodityOptions === undefined){
        this.restAPIService.get(PathConstants.ITEM_MASTER).subscribe(data => {
          if (data !== undefined) {
            data.forEach(y => {
              commoditySelection.push({ 'label': y.ITDescription, 'value': y.ITCode });
              this.commodityOptions = commoditySelection;
            });

            this.commodityOptions.unshift({ 'label': null, 'value': null });
          }
        })
      }
      break;
    }
    if (this.fromDate !== undefined && this.toDate !== undefined
      && this.g_cd.value !== '' && this.g_cd.value !== undefined && this.g_cd !==  null
       && this.c_cd.value !== undefined && this.c_cd.value !== '' && this.c_cd !== null) {
      this.isViewDisabled = false;
    }
  }

  onView() {
    this.checkValidDateSelection();
    this.loading = true;
    const params = {
      'FDate': this.datePipe.transform(this.fromDate, 'MM-dd-yyyy'),
      'ToDate': this.datePipe.transform(this.toDate, 'MM-dd-yyyy'),
      'GCode': this.g_cd.value,
      'TRCode': this.c_cd.value
    }
    this.restAPIService.post(PathConstants.COMMODITY_ISSUE_MEMO_REPORT, params).subscribe(res => {
      this.commodityIssueMemoData = res;
      let sno = 0;
      this.commodityIssueMemoData.forEach(data => {
        data.Date = this.datePipe.transform(data.Date, 'dd-MM-yyyy');
        sno += 1;
        data.SlNo = sno;
      })
      if (res !== undefined && this.commodityIssueMemoData.length !== 0) {
        this.isActionDisabled = false;
      } else {
        this.messageService.add({ key: 't-err', severity: 'warn', summary: 'Warning!', detail: 'No record for this combination' });
      }
      this.loading = false;
    }, (err: HttpErrorResponse) => {
      if (err.status === 0) {
      this.loading = false;
      this.router.navigate(['pageNotFound']);
      }
    })
  }

  onDateSelect() {
    this.checkValidDateSelection();
    this.onResetTable();
    if (this.fromDate !== undefined && this.toDate !== undefined && this.g_cd.value !== '' && this.g_cd.value !== undefined && this.g_cd !==  null
    && this.c_cd.value !== undefined && this.c_cd.value !== '' && this.c_cd !== null) {
      this.isViewDisabled = false;
    }
  }

  checkValidDateSelection() {
    if (this.fromDate !== undefined && this.toDate !== undefined && this.fromDate !== '' && this.toDate !== '') {
      let selectedFromDate = this.fromDate.getDate();
      let selectedToDate = this.toDate.getDate();
      let selectedFromMonth = this.fromDate.getMonth();
      let selectedToMonth = this.toDate.getMonth();
      let selectedFromYear = this.fromDate.getFullYear();
      let selectedToYear = this.toDate.getFullYear();
      if (selectedFromMonth !== selectedToMonth || selectedFromYear !== selectedToYear) {
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Invalid Date', detail: 'Please select a date within a month' });
        this.fromDate = this.toDate = '';
      } else if (selectedFromDate > selectedToDate) {
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Invalid Date', detail: 'Please select a valid date range' });
        this.fromDate = this.toDate = '';
      }
      return this.fromDate, this.toDate;
    }
  }

  onResetTable() {
    this.commodityIssueMemoData = [];
    this.isActionDisabled = true;
  }

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.commodityIssueMemoData, 'COMMODITY_ISSUE_MEMO_REPORT', this.commodityIssueMemoCols);
  }
}