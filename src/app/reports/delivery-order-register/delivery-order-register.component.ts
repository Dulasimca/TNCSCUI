import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { DatePipe } from '@angular/common';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { SelectItem, MessageService } from 'primeng/api';
import { HttpParams } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { AuthService } from 'src/app/shared-services/auth.service';

@Component({
  selector: 'app-delivery-order-register',
  templateUrl: './delivery-order-register.component.html',
  styleUrls: ['./delivery-order-register.component.css']
})
export class DeliveryOrderRegisterComponent implements OnInit {
  deliveryReceiptRegCols: any;
  deliveryReceiptRegData: any;
  fromDate: any;
  toDate: any;
  isViewDisabled: any;
  isActionDisabled: any;
  godownOptions: SelectItem[];
  data: any;
  g_cd: any;
  maxDate: Date;
  deliveryOptions: SelectItem[];
  deliveryName: string;
  canShowMenu: boolean;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe, private messageService: MessageService,
    private authService: AuthService, private excelService: ExcelService, private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.isViewDisabled = this.isActionDisabled = true;
    this.deliveryReceiptRegCols = this.tableConstants.DeliveryMemoRegisterReport;
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
    this.restAPIService.getByParameters(PathConstants.STOCK_DELIVERY_ORDER_REPORT, params).subscribe(res => {
      this.deliveryReceiptRegData = res;
      let sno = 0;
      this.deliveryReceiptRegData.forEach(data => {
        data.DeliveryOrderDate = this.datePipe.transform(data.DeliveryOrderDate, 'dd-MM-yyyy');
        sno += 1;
        data.SlNo = sno;
      })
      if (res !== undefined && res.length !== 0) {
        this.isActionDisabled = false;
      } else {
        this.messageService.add({ key: 't-date', severity: 'warn', summary: 'Warning!', detail: 'No record for this combination' });
      }
    })
  }

  onResetTable() {
    this.deliveryReceiptRegData = [];
    this.isActionDisabled = true;
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
          this.fromDate = this.toDate = '';
        } else if (selectedFromDate >= selectedToDate) {
          this.messageService.add({ key: 't-date', severity: 'error', summary: 'Invalid Date', detail: 'Please select a valid date range' });
          this.fromDate = this.toDate = '';
        }
      return this.fromDate, this.toDate;
    }
  }

  exportAsXLSX():void{
    this.excelService.exportAsExcelFile(this.deliveryReceiptRegData, 'DELIVERY_ORDER_REGISTER_REPORT',this.deliveryReceiptRegCols);
}
}
