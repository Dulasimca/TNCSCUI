import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { SelectItem, MessageService } from 'primeng/api';
import { HttpParams } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { ExcelService } from 'src/app/shared-services/excel.service';

@Component({
  selector: 'app-stock-receipt-register',
  templateUrl: './stock-receipt-register.component.html',
  styleUrls: ['./stock-receipt-register.component.css']
})
export class StockReceiptRegisterComponent implements OnInit {
  stockReceiptRegCols: any;
  stockReceiptRegData: any;
  fromDate: any;
  toDate: any;
  godownOptions: SelectItem[];
  g_cd: any;
  data: any;
  isViewDisabled: boolean;
  isActionDisabled: boolean;
  maxDate: Date;
  canShowMenu: boolean;
  isShowErr: boolean;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe, 
    private authService: AuthService, private excelService: ExcelService,
    private restAPIService: RestAPIService, private roleBasedService: RoleBasedService, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.isViewDisabled = this.isActionDisabled = true;
    this.stockReceiptRegCols = this.tableConstants.StockReceiptRegisterReport;
    this.data = this.roleBasedService.getInstance();
    this.maxDate = new Date();
  }

  onSelect() {
    let options = [];
    if (this.fromDate !== undefined && this.toDate !== undefined
      && this.g_cd !== '' && this.g_cd !== undefined) {
      this.isViewDisabled = false;
    }
    if (this.data !== undefined) {
      this.data.forEach(x => {
      options.push({ 'label': x.GName, 'value': x.GCode });
      this.godownOptions = options;
    });
  }
  }

  onView() {
    this.checkValidDateSelection();
    const params = new HttpParams().set('Fdate', this.datePipe.transform(this.fromDate, 'MM-dd-yyyy')).append('ToDate', this.datePipe.transform(this.toDate, 'MM-dd-yyyy')).append('GCode', this.g_cd);
    this.restAPIService.getByParameters(PathConstants.STOCK_RECEIPT_REGISTER_REPORT, params).subscribe(res => {
      this.stockReceiptRegData = res;
      if (res !== undefined && res.length !== 0) {
        this.isActionDisabled = false;
      } else {
        this.messageService.add({ key: 't-date', severity: 'warn', summary: 'Warning!', detail: 'No record for this combination' });
      }
    })
  }

  onDateSelect() {
    this.checkValidDateSelection();
    this.onResetTable();
    if (this.fromDate !== undefined && this.toDate !== undefined
      && this.g_cd !== '' && this.g_cd !== undefined) {
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
          this.messageService.add({ key: 't-date', severity: 'error', summary: 'Invalid Date', detail: 'Please select a date within a month' });
          this.isShowErr = true;
          this.fromDate = this.toDate = '';
        } else if (selectedFromDate >= selectedToDate) {
          this.messageService.add({ key: 't-date', severity: 'error', summary: 'Invalid Date', detail: 'Please select a valid date range' });
          this.fromDate = this.toDate = '';
        }
      return this.fromDate, this.toDate;
    }
  }
  onResetTable() {
    this.stockReceiptRegData = [];
    this.isActionDisabled = true;
  }

  onExportExcel():void{
    this.excelService.exportAsExcelFile(this.stockReceiptRegData, 'STOCK_RECEIPT_REGISTER_REPORT',this.stockReceiptRegCols);
}

}