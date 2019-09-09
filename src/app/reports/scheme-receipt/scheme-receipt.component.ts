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
import { StatusMessage } from 'src/app/constants/Messages';

@Component({
  selector: 'app-scheme-receipt',
  templateUrl: './scheme-receipt.component.html',
  styleUrls: ['./scheme-receipt.component.css']
})
export class SchemeReceiptComponent implements OnInit {
  schemeReceiptCols: any;
  schemeReceiptData: any;
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
    this.schemeReceiptCols = this.tableConstants.SchemeReceiptReport;
    this.scheme_data = this.roleBasedService.getSchemeData();
    this.godown_data = this.roleBasedService.getInstance();
    this.maxDate = new Date();
  }

  onSelect(item) {
    let godownSelection = [];
    let schemeSelection = [];
    switch (item) {
      case 'godown':
        this.godown_data = this.roleBasedService.instance;
        if (this.godown_data !== undefined) {
          this.godown_data.forEach(x => {
            godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            this.godownOptions = godownSelection;
          });
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
      && this.g_cd.value !== '' && this.g_cd.value !== undefined &&
      this.sc_cd.value !== undefined && this.sc_cd.value !== '' && this.g_cd !== null && this.sc_cd !== null) {
      this.isViewDisabled = false;
    }
  }


  onView() {
    this.checkValidDateSelection();
    this.loading = true;
    this.schemeReceiptData = [];
    const params = {
      'FDate': this.datePipe.transform(this.fromDate, 'MM-dd-yyyy'),
      'ToDate': this.datePipe.transform(this.toDate, 'MM-dd-yyyy'),
      'GCode': this.g_cd.value,
      'TRCode': this.sc_cd.value
    };
    this.restAPIService.post(PathConstants.SCHEME_RECEIPT_REPORT, params).subscribe(res => {
      this.schemeReceiptData = res;
      let sno = 0;
      this.schemeReceiptData.forEach(data => {
        data.Date = this.datePipe.transform(data.Date, 'dd-MM-yyyy');
        data.Quantity = (data.Quantity * 1).toFixed(3);
        sno += 1;
        data.SlNo = sno;
      })
      if (res !== undefined && res.length !== 0) {
        this.isActionDisabled = false;
      } else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
      }
      this.loading = false;
    }, (err: HttpErrorResponse) => {
      if (err.status === 0) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    })
  }

  onResetTable() {
    this.schemeReceiptData = [];
    this.isActionDisabled = true;
  }

  onDateSelect() {
    this.checkValidDateSelection();
    this.onResetTable();
    if (this.fromDate !== undefined && this.toDate !== undefined && this.g_cd.value !== '' && this.g_cd.value !== undefined &&
      this.sc_cd.value !== undefined && this.sc_cd.value !== '' && this.g_cd !== null && this.sc_cd !== null) {
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
      if ((selectedFromDate > selectedToDate && ((selectedFromMonth >= selectedToMonth && selectedFromYear >= selectedToYear) ||
        (selectedFromMonth === selectedToMonth && selectedFromYear === selectedToYear))) ||
        (selectedFromMonth > selectedToMonth && selectedFromYear === selectedToYear) || (selectedFromYear > selectedToYear)) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_INVALID, detail: StatusMessage.ValidDateErrorMessage });
        this.fromDate = this.toDate = '';
      }
      return this.fromDate, this.toDate;
    }
  }

  exportAsXLSX(): void {
    var SchemeReceiptData = [];
    this.schemeReceiptData.forEach(data => {
      SchemeReceiptData.push({ SlNo: data.SlNo, Godownname: data.Godownname, Scheme: data.Scheme, AckNo: data.Ackno, Date: data.Date, Commodity: data.Commodity, Quantity: data.Quantity, RecdFrom: data.RecdFrom, TruckMemoNo: data.TruckMemoNo, Lorryno: data.Lorryno })
    })
    this.excelService.exportAsExcelFile(SchemeReceiptData, 'SCHEME_RECEIPT_REPORT', this.schemeReceiptCols);
  }
}
