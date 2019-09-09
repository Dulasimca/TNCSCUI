import { Component, OnInit } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { Router } from '@angular/router';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { HttpErrorResponse } from '@angular/common/http';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-cash-receipt-register',
  templateUrl: './cash-receipt-register.component.html',
  styleUrls: ['./cash-receipt-register.component.css']
})
export class CashReceiptRegisterComponent implements OnInit {
  CashReceiptRegCols: any;
  CashReceiptRegData: any;
  fromDate: any;
  toDate: any;
  isActionDisabled: any;
  godownOptions: SelectItem[];
  data: any;
  g_cd: any;
  maxDate: Date;
  deliveryOptions: SelectItem[];
  deliveryName: string;
  canShowMenu: boolean;
  loading: boolean;
  username: any;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe, private messageService: MessageService,
    private authService: AuthService, private excelService: ExcelService, private router: Router,
    private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    this.isActionDisabled = true;
    this.CashReceiptRegCols = this.tableConstants.DeliveryMemoRegisterReport;
    this.maxDate = new Date();
    this.username = JSON.parse(this.authService.getCredentials());
  }

  onSelect() {
    let options = [];
    this.data = this.roleBasedService.instance;
    if (this.data !== undefined) {
      this.data.forEach(x => {
        options.push({ 'label': x.GName, 'value': x.GCode });
        this.godownOptions = options;
      });
    }
  }

  onView() {
    this.checkValidDateSelection();
    this.loading = true;
    const params = {
      'FromDate': this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'),
      'ToDate': this.datePipe.transform(this.toDate, 'MM/dd/yyyy'),
      'UserName': this.username.user,
      'GCode': this.g_cd.value
    };
    this.restAPIService.post(PathConstants.STOCK_DELIVERY_ORDER_REPORT, params).subscribe(res => {
      this.CashReceiptRegData = res;
      let sno = 0;
      this.CashReceiptRegData.forEach(data => {
        data.DeliveryOrderDate = this.datePipe.transform(data.DeliveryOrderDate, 'dd/MM/yyyy');
        sno += 1;
        data.SlNo = sno;
      });
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
    });
  }

  onResetTable() {
    this.CashReceiptRegData = [];
    this.isActionDisabled = true;
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
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_INVALID, detail: StatusMessage.ValidDateErrorMessage });
        this.fromDate = this.toDate = '';
      }
      return this.fromDate, this.toDate;
    }
  }

  exportAsXLSX(): void {
    var DeliveryData = [];
    this.CashReceiptRegData.forEach(data => {
      DeliveryData.push({
        SlNo: data.SlNo, Dono: data.Dono, DeliveryOrderDate: data.DeliveryOrderDate,
        Totals: data.Totals, To_Whom_Issued: data.To_Whom_Issued, Cheque_DD: data.Cheque_DD,
        PaymentAmount: data.PaymentAmount, Scheme: data.Scheme, Commodity: data.Commodity,
        Netwt_Kgs: data.Netwt_Kgs, Rate_Rs: data.Rate_Rs, Itemamount: data.Itemamount,
        PreviousAmount: data.PreviousAmount, Adjusted: data.Adjusted, Balance: data.Balance, MarginAmount: data.MarginAmount
      });
    });
    this.excelService.exportAsExcelFile(DeliveryData, 'DELIVERY_ORDER_REGISTER_REPORT', this.CashReceiptRegCols);
  }

  onPrint() {
    const path = "../../assets/Reports/" + this.username.user + "/";
    const filename = this.g_cd.value + GolbalVariable.StockDORegFilename + ".txt";
    saveAs(path + filename, filename);
  }
}
