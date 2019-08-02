import { Component, OnInit } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-receipt-rono-purchase',
  templateUrl: './receipt-rono-purchase.component.html',
  styleUrls: ['./receipt-rono-purchase.component.css']
})
export class ReceiptRONOPurchaseComponent implements OnInit {
  receiptHOPurchaseCols: any;
  receiptHOPurchaseData: any;
  fromDate: any;
  toDate: any;
  isActionDisabled: any;
  data: any;
  g_cd: any;
  godownOptions: SelectItem[];
  canShowMenu: boolean;
  maxDate: Date;
  loading: boolean = false;
  orderNo: any;
  username: any;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe, private messageService: MessageService,
    private authService: AuthService, private excelService: ExcelService, private router: Router,
    private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.isActionDisabled = true;
    this.receiptHOPurchaseCols = this.tableConstants.ReceiptRONOPurchaseReport;
    this.username = JSON.parse(this.authService.getCredentials());
    this.data = this.roleBasedService.getInstance();
    this.maxDate = new Date();
  }

  onSelect() {
    let godownSelection = [];
    this.data = this.roleBasedService.instance;
    if (this.data !== undefined) {
      this.data.forEach(x => {
        godownSelection.push({ 'label': x.GName, 'value': x.GCode });
        this.godownOptions = godownSelection;
      });
    }
  }

  onView() {
    this.checkValidDateSelection();
    this.loading = true;
    const params = {
      'GCode': this.g_cd.value,
      'FromDate': this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'),
      'ToDate': this.datePipe.transform(this.toDate, 'MM/dd/yyyy'),
      'OrderNo': this.orderNo,
      'UserName': this.username.user
    }
    this.restAPIService.post(PathConstants.RECEIPT_RONO_PURCHASE_REPORT, params).subscribe(res => {
      this.receiptHOPurchaseData = res;
      let sno = 0;
      this.receiptHOPurchaseData.forEach(data => {
        sno += 1;
        data.SlNo = sno;
      })
      if (res !== undefined && res.length !== 0) {
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
    this.receiptHOPurchaseData = [];
    this.isActionDisabled = true;
  }

  onExportExcel(): void {
    var ReceiptRoNo = [];
    this.receiptHOPurchaseData.forEach(data => {
      ReceiptRoNo.push({
        SlNo: data.SlNo, Ackno: data.Ackno, Date: data.Date, Type: data.Type,
        Depositor: data.Depositor, Commodity: data.Commodity, Bags: data.Bags, Quantity: data.Quantity,
        TruckMen: data.TruckMen, Orderno: data.Orderno, Lorryno: data.Lorryno, Scheme: data.Scheme
      })
    })
    this.excelService.exportAsExcelFile(ReceiptRoNo, 'RECEIPT-HO-PURCHASE', this.receiptHOPurchaseCols);
  }
}
