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
  isActionDisabled: any;
  data: any;
  RCode: any;
  GCode: any;
  ITCode: any;
  regionOptions: SelectItem[];
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
    this.isActionDisabled = true;
    this.commodityIssueMemoCols = this.tableConstants.CommodityIssueMemoReport;
    this.data = this.roleBasedService.getInstance();
    this.maxDate = new Date();
  }

  onSelect(item) {
    let regionSelection = [];
    let godownSelection = [];
    let commoditySelection = [];

    switch (item) {
      case 'reg':
        this.data = this.roleBasedService.instance;
        if (this.data !== undefined) {
          this.data.forEach(x => {
            regionSelection.push({ 'label': x.RName, 'value': x.RCode });
            this.regionOptions = regionSelection;
          });
        }
        break;
      case 'gd':
        this.data = this.roleBasedService.instance;
        if (this.data !== undefined) {
          this.data.forEach(x => {
            godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            this.godownOptions = godownSelection;
          });
          this.godownOptions.unshift({ label: 'All', value: 'All' });
        }
        break;
      case 'cd':
        if (this.commodityOptions === undefined) {
          this.restAPIService.get(PathConstants.ITEM_MASTER).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                commoditySelection.push({ 'label': y.ITDescription, 'value': y.ITCode });
                this.commodityOptions = commoditySelection;
              });
            }
          })
        }
        break;
    }
  }

  onView() {
    this.checkValidDateSelection();
    this.loading = true;
    const params = {
      'FDate': this.datePipe.transform(this.fromDate, 'MM-dd-yyyy'),
      'ToDate': this.datePipe.transform(this.toDate, 'MM-dd-yyyy'),
      'GCode': this.GCode.value,
      'TRCode': this.ITCode.value
    }
    this.restAPIService.post(PathConstants.COMMODITY_ISSUE_MEMO_REPORT, params).subscribe(res => {
      this.commodityIssueMemoData = res;
      let sno = 0;
      this.commodityIssueMemoData.forEach(data => {
        data.Issue_Date = this.datePipe.transform(data.Issue_Date, 'dd-MM-yyyy');
        data.Quantity = (data.Quantity * 1).toFixed(3);
        sno += 1;
        data.SlNo = sno;
      })
      if (res !== undefined && res.length !== 0) {
        this.isActionDisabled = false;
      } else {
        this.messageService.add({ key: 't-err', severity: 'warn', summary: 'Warning!', detail: 'No record for this combination' });
      }
      this.loading = false;
    }, (err: HttpErrorResponse) => {
      if (err.status === 0) {
        this.loading = false;
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message!', detail: 'Please contact administrator' });
      }
    })
  }

  onDateSelect() {
    this.checkValidDateSelection();
    this.onResetTable();
  }

  checkValidDateSelection() {
    if (this.fromDate !== undefined && this.toDate !== undefined && this.fromDate !== '' && this.toDate !== '') {
      let selectedFromDate = this.fromDate.getDate();
      let selectedToDate = this.toDate.getDate();
      let selectedFromMonth = this.fromDate.getMonth();
      let selectedToMonth = this.toDate.getMonth();
      let selectedFromYear = this.fromDate.getFullYear();
      let selectedToYear = this.toDate.getFullYear();
      if ((selectedFromDate > selectedToDate && ((selectedFromMonth >= selectedToMonth && selectedFromYear >= selectedToYear) ||
        (selectedFromMonth === selectedToMonth && selectedFromYear === selectedToYear))) ||
        (selectedFromMonth > selectedToMonth && selectedFromYear === selectedToYear) || (selectedFromYear > selectedToYear)) {
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
    var CommodityIssueData = [];
    this.commodityIssueMemoData.forEach(data => {
      CommodityIssueData.push({
        SlNo: data.SlNo, Godownname: data.Godownname, Scheme: data.Scheme, Issue_Memono: data.Issue_Memono,
        Issue_Date: data.Issue_Date, Commodity: data.Commodity, Quantity: data.Quantity, Issuedto: data.Issuedto,
        Lorryno: data.Lorryno, Stackno: data.Stackno
      })
    });
    this.excelService.exportAsExcelFile(CommodityIssueData, 'COMMODITY_ISSUE_MEMO_REPORT', this.commodityIssueMemoCols);
  }
}