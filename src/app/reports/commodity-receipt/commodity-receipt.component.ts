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
  selector: 'app-commodity-receipt',
  templateUrl: './commodity-receipt.component.html',
  styleUrls: ['./commodity-receipt.component.css']
})
export class CommodityReceiptComponent implements OnInit {
  commodityReceiptCols: any;
  commodityReceiptData: any = [];
  loadedData: any = [];
  fromDate: any;
  toDate: any;
  isActionDisabled: any;
  regionsList: any;
  godownsList: any;
  RCode: any;
  GCode: any;
  ITCode: any;
  TrCode: any;
  regionOptions: SelectItem[];
  godownOptions: SelectItem[];
  transactionOptions: SelectItem[];
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
    this.commodityReceiptCols = this.tableConstants.CommodityReceiptReport;
    this.godownsList = this.roleBasedService.getGodowns();
    this.regionsList = this.roleBasedService.getRegions();
    this.maxDate = new Date();
    let commoditySelection = [];
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
  }

  onSelect(item) {
    let regionSelection = [];
    let godownSelection = [];
    let transactionSelection = [];
    switch (item) {
      case 'reg':
        this.regionsList = this.roleBasedService.regionsData;
        if (this.regionsList !== undefined) {
          this.regionsList.forEach(x => {
            regionSelection.push({ 'label': x.RName, 'value': x.RCode });
            this.regionOptions = regionSelection;
          });
        }
        break;
      case 'gd':
        this.godownsList = this.roleBasedService.godownsList;
        if (this.godownsList !== undefined) {
          this.godownsList.forEach(x => {
            godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            this.godownOptions = godownSelection;
          });
          this.godownOptions.unshift({ label: 'All', value: 'All' });
        }
        break;
      case 'tr':
        if (this.transactionOptions === undefined) {
          this.restAPIService.get(PathConstants.TRANSACTION_MASTER).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                transactionSelection.push({ 'label': y.TRName, 'value': y.TRCode });
                this.transactionOptions = transactionSelection;
              });
            }
          })
        }
        break;
    }
  }

  onView() {
    this.checkValidDateSelection();
    this.ITCode = null;
    this.loading = true;
    const params = {
      'FDate': this.datePipe.transform(this.fromDate, 'MM-dd-yyyy'),
      'ToDate': this.datePipe.transform(this.toDate, 'MM-dd-yyyy'),
      'GCode': this.GCode.value,
      'TRCode': this.TrCode.value,
    }
    this.restAPIService.post(PathConstants.COMMODITY_RECEIPT_REPORT, params).subscribe(res => {
      this.loadedData = res;
      this.commodityReceiptData = res;
      let sno = 0;
      this.commodityReceiptData.forEach(data => {
        data.Date = this.datePipe.transform(data.Date, 'dd-MM-yyyy');
        data.Truckmemodate = this.datePipe.transform(data.Truckmemodate, 'dd-MM-yyyy');
        data.Quantity = (data.Quantity * 1).toFixed(3);
        sno += 1;
        data.SlNo = sno;
      });
      if (res !== undefined && res.length !== 0) {
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

  filterCommodity(event) {
    let selectedItem = event.value;
    if(selectedItem !== undefined && selectedItem !== null) {
    this.commodityReceiptData = this.commodityReceiptData.filter(f => {
      return f.Commodity === selectedItem.label;
    })
  } else {
    this.commodityReceiptData = this.loadedData;
  }
    
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
    this.commodityReceiptData = [];
    this.isActionDisabled = true;
  }

  exportAsXLSX(): void {
    var CommodityReceiptData = [];
    this.commodityReceiptData.forEach(data => {
      CommodityReceiptData.push({
        SlNo: data.SlNo, Godownname: data.Godownname, Scheme: data.Scheme, Ackno: data.Ackno,
        Date: data.Date, Commodity: data.Commodity, Bags_No: data.Bags_No, Quantity: data.Quantity, RecdFrom: data.RecdFrom,
        Lorryno: data.Lorryno, TruckMemoNo: data.TruckMemoNo, Truckmemodate: data.Truckmemodate, Orderno: data.Orderno
      })
    })
    this.excelService.exportAsExcelFile(CommodityReceiptData, 'COMMODITY_RECEIPT_REPORT', this.commodityReceiptCols);
  }
}