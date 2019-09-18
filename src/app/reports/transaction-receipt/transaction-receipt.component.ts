import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { Dropdown } from 'primeng/primeng';

@Component({
  selector: 'app-transaction-receipt',
  templateUrl: './transaction-receipt.component.html',
  styleUrls: ['./transaction-receipt.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TransactionReceiptComponent implements OnInit {
  transactionReceiptCols: any;
  transactionReceiptData: any = [];
  fromDate: any = new Date();
  toDate: any = new Date();
  data: any;
  RCode: any;
  regionOptions: SelectItem[];
  GCode: any;
  godownOptions: SelectItem[];
  truckName: string;
  canShowMenu: boolean;
  maxDate: Date;
  TrCode: any;
  transactionOptions: SelectItem[];
  loading: boolean = false;
  regionsData: any;
  roleId: any;
  @ViewChild('godown') godownPanel: Dropdown;
  @ViewChild('region') regionPanel: Dropdown;
  @ViewChild('transaction') transactionPanel: Dropdown;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private messageService: MessageService, private authService: AuthService, private excelService: ExcelService, private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.transactionReceiptCols = this.tableConstants.TransactionReceiptReport;
    this.data = this.roleBasedService.getInstance();
    this.regionsData = this.roleBasedService.getRegions();
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.maxDate = new Date();
  }

  onSelect(item, type) {
    let godownSelection = [];
    let transactoinSelection = [];
    let regionSelection = [];
    switch (item) {
      case 'reg':
        if (type === 'enter') {
          this.regionPanel.overlayVisible = true;
        }
        if (this.roleId === 3) {
          this.regionsData = this.roleBasedService.instance;
          if (this.regionsData !== undefined) {
            this.regionsData.forEach(x => {
              regionSelection.push({ 'label': x.RName, 'value': x.RCode });
            });
            for (let i = 0; i < regionSelection.length - 1;) {
              if (regionSelection[i].value === regionSelection[i + 1].value) {
                regionSelection.splice(i + 1, 1);
              }
            }
          }
          this.regionOptions = regionSelection;
        } else {
          this.regionsData = this.roleBasedService.regionsData;
          if (this.regionsData !== undefined) {
            this.regionsData.forEach(x => {
              regionSelection.push({ 'label': x.RName, 'value': x.RCode });
            });
          }
          this.regionOptions = regionSelection;
        }
        break;
      case 'godown':
        if (type === 'enter') {
          this.godownPanel.overlayVisible = true;
        }
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode, 'rcode': x.RCode, 'rname': x.RName });
            }
          });
          this.godownOptions = godownSelection;
        }
        break;
      case 'transaction':
        if (type === 'enter') {
          this.transactionPanel.overlayVisible = true;
        }
         if (this.transactionOptions === undefined) {
          this.restAPIService.get(PathConstants.TRANSACTION_MASTER).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                transactoinSelection.push({ 'label': y.TRName, 'value': y.TRCode });
                this.transactionOptions = transactoinSelection;
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
      'GCode': this.GCode,
      'TRCode': this.TrCode
    }
    this.restAPIService.post(PathConstants.TRANSACTION_RECEIPT_REPORT, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.transactionReceiptData = res;
      let sno = 0;
      this.transactionReceiptData.forEach(data => {
        data.Date = this.datePipe.transform(data.Date, 'dd-MM-yyyy');
        data.Quantity = (data.Quantity * 1).toFixed(3);
        sno += 1;
        data.SlNo = sno;
      })
      } else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
      }
      this.loading = false;
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    })
  }

  onResetTable(item) {
    if(item === 'reg') { this.GCode = null; }
    this.transactionReceiptData = [];
  }

  onDateSelect() {
    this.checkValidDateSelection();
    this.onResetTable('');
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
    var TransactionReceiptData = [];
    this.transactionReceiptData.forEach(data => {
      TransactionReceiptData.push({ SlNo: data.SlNo, Godownname: data.Godownname, Commodity: data.Commodity, Date: data.Date, Trans_action: data.Trans_action, Quantity: data.Quantity })
    })
    this.excelService.exportAsExcelFile(TransactionReceiptData, 'TRANSACTION_RECEIPT_REPORT', this.transactionReceiptCols);
  }

  public setAlignment(value) {
    return (value !== '') ? 'right' : 'left';
  }

  onPrint() { }
  
}
