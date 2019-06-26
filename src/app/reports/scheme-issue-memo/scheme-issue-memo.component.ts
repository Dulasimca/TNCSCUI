import { Component, OnInit } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scheme-issue-memo',
  templateUrl: './scheme-issue-memo.component.html',
  styleUrls: ['./scheme-issue-memo.component.css']
})
export class SchemeIssueMemoComponent implements OnInit {
  schemeIssueMemoCols: any;
  schemeIssueMemoData: any;
  username: any;
  fromDate: any;
  toDate: any;
  isViewDisabled: any;
  isActionDisabled: any;
  godown_data: any;
  scheme_data: any;
  g_cd: any;
  schemeOptions: SelectItem[];
  sc_cd: any;
  godownOptions: SelectItem[];
  truckName: string;
  canShowMenu: boolean;
  maxDate: Date;
  loading: boolean = false;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe, private router: Router,
    private messageService: MessageService, private authService: AuthService, private excelService: ExcelService, private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.isViewDisabled = this.isActionDisabled = true;
    this.schemeIssueMemoCols = this.tableConstants.SchemeIssueMemoReport;
    this.godown_data = this.roleBasedService.getInstance();
    this.scheme_data = this.roleBasedService.getSchemeData();
    this.maxDate = new Date();
  }

  onSelect(item) {
    let godownSelection = [];
    let schemeSelection = [];
    switch (item) {
      case 'godown':
        if (this.godown_data !== undefined) {
          this.godown_data.forEach(x => {
            godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            this.godownOptions = godownSelection;
          });
          this.godownOptions.unshift({ 'label': null, 'value': null });
        }
        break;
      case 'scheme':
        if (this.scheme_data !== undefined) {
          this.scheme_data.forEach(y => {
            schemeSelection.push({ 'label': y.SName, 'value': y.SCode });
            this.schemeOptions = schemeSelection;
          });
        }
        break;
    }
    if (this.fromDate !== undefined && this.toDate !== undefined
      && this.g_cd.value !== '' && this.g_cd.value !== undefined && this.g_cd !== null
       && this.sc_cd.value !== undefined && this.sc_cd.value !== '' && this.sc_cd !== null) {
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
      'TRCode': this.sc_cd.value
    };
    this.restAPIService.post(PathConstants.SCHEME_ISSUE_MEMO_REPORT, params).subscribe(res => {
      this.schemeIssueMemoData = res;
      let sno = 0;
      this.schemeIssueMemoData.forEach(data => {
        data.Issue_Date = this.datePipe.transform(data.Issue_Date, 'dd-MM-yyyy');
        sno += 1;
        data.SlNo = sno;
      })
      if (res !== undefined && this.schemeIssueMemoData.length !== 0) {
        this.isActionDisabled = false;
      } else {
        this.loading = false;
        this.messageService.add({ key: 't-err', severity: 'warn', summary: 'Warning!', detail: 'No record for this combination' });
      }
      this.loading = false;
    }, (err: HttpErrorResponse) => {
      if (err.status === 0) {
      this.loading = false;
      this.router.navigate(['pageNotFound']);
      }
    })  }

  onResetTable() {
    this.schemeIssueMemoData = [];
    this.isActionDisabled = true;
  }

  onDateSelect() {
    this.checkValidDateSelection();
    this.onResetTable();
    if (this.fromDate !== undefined && this.toDate !== undefined && this.g_cd.value !== '' && this.g_cd.value !== undefined && this.g_cd !== null
    && this.sc_cd.value !== undefined && this.sc_cd.value !== '' && this.sc_cd !== null) {
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

  exportAsXLSX():void{
    this.excelService.exportAsExcelFile(this.schemeIssueMemoData, 'SCHEME_ISSUE_MEMO_REPORT',this.schemeIssueMemoCols);
}
}