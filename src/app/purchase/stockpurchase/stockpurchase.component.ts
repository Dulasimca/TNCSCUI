import { Component, OnInit, ViewChild } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { StatusMessage } from 'src/app/constants/Messages';
import { Dropdown } from 'primeng/primeng';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-stockpurchase',
  templateUrl: './stockpurchase.component.html',
  styleUrls: ['./stockpurchase.component.css']
})
export class StockPurchaseComponent implements OnInit {
  isShowGrid:  boolean;
  canShowMenu: boolean;
  stockPurchaseData: any;
  stockPurchaseDataCoulmns: any;
  commodityOptions: any[];
  ICode: any;
  TenderId: any;
  OrderNo: any;
  NetWt: any;
  TenderDate: any;
  OrderDate: any;
  maxDate: Date = new Date();
  Remarks: any;
  TenderDetId: any;
  CompletedDate: any;
  iCode: any;
  commoditySelection: any[] = [];
  isViewed: boolean = false;
  Quantity: any;
 // nonEditable: boolean;
  @ViewChild('commodity') commodityPanel: Dropdown;
  @ViewChild('f') form: NgForm;
  
  constructor(private tableConstants: TableConstants, private authService: AuthService,
    private restApiService: RestAPIService, private datePipe: DatePipe,
    private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.stockPurchaseDataCoulmns = this.tableConstants.TenderDetailsCols;
    this.restApiService.get(PathConstants.COMMODITY_BREAK_ITEM_MASTER_MODIFICATION).subscribe(data => {
      if(data !== undefined && data !== null && data.length !== 0) {
        data.forEach(x => {
          this.commoditySelection.push({ label: x.ITDescription, value: x.ITCode });
        })
        this.commodityOptions = this.commoditySelection;
        this.commodityOptions.unshift({ label: '-select-', value: null });
      } else { this.commodityOptions = this.commoditySelection; }
    })
  }

  onSelect(type) {
    if(type === 'enter') { this.commodityPanel.overlayVisible = true; }
    this.commodityOptions = this.commoditySelection;
  }

  onView() {
    this.isShowGrid = true;
    this.restApiService.get(PathConstants.PURCHASE_TENDER_DETAILS_GET).subscribe(data => {
      if(data !== undefined && data !== null && data.length !== 0) {
        let sno = 1;
        data.forEach(x => {
          x.SlNo = sno;
          sno += 1;
          x.TenderDate = this.datePipe.transform(x.TenderDate, 'dd/MM/yyyy');
          x.CompletedDate = this.datePipe.transform(x.CompletedDate, 'dd/MM/yyyy');
          x.OrderDate = this.datePipe.transform(x.OrderDate, 'dd/MM/yyyy');
        });
        this.stockPurchaseData = data;
      } 
    })
  }

  onSelectedRow(data) {
        this.isViewed = true;
        this.TenderId = data.TenderId;
        this.TenderDetId = data.TenderDetId;
        this.TenderDate = data.TenderDate;
        this.CompletedDate = data.CompletedDate;
        this.OrderNo = data.OrderNumber;
        this.NetWt = data.Quantity;
        this.OrderDate = data.OrderDate;
        this.Remarks = data.Remarks;
        this.ICode = data.ITName;
        this.iCode = data.ITCode;
        this.Quantity = (data.AdditionalQty !== null && data.AdditionalQty !== undefined)
         ? data.AdditionalQty : 0;
        this.commodityOptions = [{ label: data.ITName, value: data.ITCode }];
  }

  onSave() {
    if(this.isViewed) {
      const params = {
        'OrderNumber': this.OrderNo,
        'AdditionalQty': this.Quantity,
        'Type': 2
      }
      this.restApiService.post(PathConstants.PURCHASE_TENDER_DETAILS_POST, params).subscribe(res => {
          if (res.Item1) {
            this.onClear();
            this.onView();
            this.messageService.clear();
            this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.SuccessMessage });
          } else {
            this.messageService.clear();
            this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: res.Item2 });
          }
      }, (err: HttpErrorResponse) => {
        if (err.status === 0 || err.status === 400) {
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
        } else {
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.NetworkErrorMessage });
        }
      });
    } else {
    const TenderDetId = (this.TenderDetId !== undefined && this.TenderDetId !== null) ? this.TenderDetId : 0;
    const params = {
      'Type': 1,
      'TenderDetId': TenderDetId,
      'TenderId': this.TenderId,
      'TenderDate': this.datePipe.transform(this.TenderDate, 'MM/dd/yyyy'),
      'CompletedDate': this.datePipe.transform(this.CompletedDate, 'MM/dd/yyyy'),
      'OrderNumber': this.OrderNo,
      'ITCode': (this.ICode.value !== undefined && this.ICode.value !== null) ? this.ICode.value : this.iCode,
      'Quantity': this.NetWt,
      'OrderDate': this.datePipe.transform(this.OrderDate, 'MM/dd/yyyy'),
      'Remarks': (this.Remarks !== undefined && this.Remarks !== null) ? this.Remarks : ''
    }
    this.restApiService.post(PathConstants.PURCHASE_TENDER_DETAILS_POST, params).subscribe(res => {
        if (res.Item1) {
          this.onClear();
          this.onView();
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.SuccessMessage });
        } else {
          this.isViewed = false;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: res.Item2 });
        }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.isViewed = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      } else {
        this.isViewed = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.NetworkErrorMessage });
      }
    });
  }
  }

  onClear() {
    this.form.controls.orderDate.reset();
    this.form.controls.qty.reset();
    this.form.controls.Commodity.reset();
    this.form.controls.completedDate.reset();
    this.form.controls.tenderDate.reset();
    this.form.controls.orderNum.reset();
    this.form.controls.tenderId.reset();
    this.isViewed = false;
    this.iCode = null; this.commodityOptions = []; 
    this.Quantity = null; this.TenderDetId = null;
    this.TenderId = null; this.TenderDate = null;
    this.CompletedDate = null; this.NetWt = null;
    this.OrderDate = null; this.Remarks = null;
  }
 
}
