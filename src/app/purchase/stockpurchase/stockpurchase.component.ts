import { Component, OnInit, ViewChild } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { StatusMessage } from 'src/app/constants/Messages';
import { Dropdown, ConfirmationService } from 'primeng/primeng';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-stockpurchase',
  templateUrl: './stockpurchase.component.html',
  styleUrls: ['./stockpurchase.component.css']
})
export class StockPurchaseComponent implements OnInit {
  isShowGrid: boolean;
  canShowMenu: boolean;
  stockPurchaseData: any;
  stockPurchaseDataCoulmns: any;
  tenderQtyCoulmns: any;
  tenderQtyData: any;
  commodityOptions: any[];
  ICode: any;
  TenderId: any;
  OrderNo: any;
  NetWt: any;
  TenderDate: any;
  OrderDate: any;
  maxDate: Date = new Date();
  minDate: Date = new Date();
  Remarks: any;
  TenderDetId: any;
  CompletedDate: any;
  iCode: any;
  commoditySelection: any[] = [];
  isViewed: boolean = false;
  Quantity: any;
  viewPane: boolean;
  AdditionalQty: any;
  isShowQtyGrid: boolean;
  TenderQtyId: any;
  AOrderNo: any;
  tenderDate: Date;
  orderDate: Date;
  completedDate: Date;
  blockScreen: boolean;
  UserInfo: any;
  roleId: any;
  @ViewChild('commodity') commodityPanel: Dropdown;
  @ViewChild('f') form: NgForm;
  @ViewChild('qf') qtyForm: NgForm;

  constructor(private tableConstants: TableConstants, private authService: AuthService,
    private restApiService: RestAPIService, private datePipe: DatePipe,
    private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.stockPurchaseDataCoulmns = this.tableConstants.TenderDetailsCols;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.UserInfo = JSON.parse(this.authService.getCredentials());
    this.restApiService.get(PathConstants.COMMODITY_BREAK_ITEM_MASTER_MODIFICATION).subscribe(data => {
      if (data !== undefined && data !== null && data.length !== 0) {
        data.forEach(x => {
          this.commoditySelection.push({ label: x.ITDescription, value: x.ITCode });
        })
        this.commodityOptions = this.commoditySelection;
        this.commodityOptions.unshift({ label: '-select-', value: null });
      } else { this.commodityOptions = this.commoditySelection; }
    })
  }

  onSelect(type) {
    if (type === 'enter') { this.commodityPanel.overlayVisible = true; }
    this.commodityOptions = this.commoditySelection;
  }

  onView(type) {
    if (type === '1') {
      this.stockPurchaseData = [];
      this.isShowGrid = true;
      // const params = new HttpParams().set('Value', '').append('type', type);
      this.restApiService.get(PathConstants.PURCHASE_TENDER_DETAILS_GET).subscribe(data => {
        if (data !== undefined && data !== null && data.length !== 0) {
          let sno = 1;
          data.forEach(x => {
            x.SlNo = sno;
            sno += 1;
            x.tenderDate = this.datePipe.transform(x.TenderDate, 'MM/dd/yyyy');
            x.TenderDate = this.datePipe.transform(x.TenderDate, 'dd/MM/yyyy');
            x.completedDate = this.datePipe.transform(x.CompletedDate, 'MM/dd/yyyy');
            x.CompletedDate = this.datePipe.transform(x.CompletedDate, 'dd/MM/yyyy');
            x.orderDate = this.datePipe.transform(x.OrderDate, 'MM/dd/yyyy');
            x.OrderDate = this.datePipe.transform(x.OrderDate, 'dd/MM/yyyy');
          });
          this.stockPurchaseData = data;
        }
      })
    } else {
      this.tenderQtyData = [];
      this.isShowQtyGrid = true;
      const params = new HttpParams().set('Value', this.AOrderNo).append('type', type);
      this.restApiService.getByParameters(PathConstants.PURCHASE_TENDER_DETAILS_GET, params).subscribe(data => {
        if (data !== undefined && data !== null && data.length !== 0) {
          this.tenderQtyCoulmns = this.tableConstants.TenderQuantityCols;
          let sno = 1;
          data.forEach(x => {
            x.SlNo = sno;
            sno += 1;
          });
          this.tenderQtyData = data;
        }
      })
    }
  }

  onSelectedRow(data, index, type) {
    if (type === '1') {
      this.confirmationService.confirm({
        message: 'Do you want edit or add additional quantity?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        reject: () => {
          this.isViewed = true;
          this.TenderId = data.TenderId;
          this.TenderDetId = data.TenderDetId;
          this.TenderDate = data.TenderDate;
          this.tenderDate = data.tenderDate;
          this.CompletedDate = data.CompletedDate;
          this.completedDate = data.completedDate;
          this.OrderNo = data.OrderNumber;
          this.NetWt = data.Quantity;
          this.OrderDate = data.OrderDate;
          this.orderDate = data.orderDate;
          this.Remarks = data.Remarks;
          this.ICode = data.ITName;
          this.iCode = data.ITCode;
          this.Quantity = (data.AdditionalQty !== null && data.AdditionalQty !== undefined)
            ? data.AdditionalQty : 0;
          this.commodityOptions = [{ label: data.ITName, value: data.ITCode }];
        },
        accept: () => {
          this.isViewed = true;
          this.AOrderNo = data.OrderNumber;
          this.viewPane = true;
        }
      });
    } else {
      this.TenderQtyId = data.TenderQtyID;
      this.AdditionalQty = data.Quantity;
    }

  }

  onSave(type) {
    this.blockScreen = true;
    if (type === '2') {
      const TenderQtyId = (this.TenderQtyId !== undefined && this.TenderQtyId !== null) ? this.TenderQtyId : 0;
      const params = {
        'TenderQtyID': TenderQtyId,
        'OrderNumber': this.AOrderNo,
        'AdditionalQty': this.AdditionalQty,
        'RoleId': this.roleId,
        'Username': this.UserInfo.user,
        'Type': type
      }
      this.restApiService.post(PathConstants.PURCHASE_TENDER_DETAILS_POST, params).subscribe(res => {
        if (res.Item1) {
          this.onClear(type);
          this.onView(type);
          this.onView('1');
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.SuccessMessage });
        } else {
          this.isViewed = false;
          this.blockScreen = false;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: res.Item2 });
        }
      }, (err: HttpErrorResponse) => {
        this.isViewed = false;
        this.blockScreen = false;
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
        'Type': type,
        'TenderDetId': TenderDetId,
        'TenderId': this.TenderId,
        'TenderDate': (this.tenderDate !== null && this.tenderDate !== undefined &&
          (typeof this.TenderDate === 'string'))
          ? this.tenderDate : this.datePipe.transform(this.TenderDate, 'MM/dd/yyyy'),
        'CompletedDate': (this.completedDate !== null && this.completedDate !== undefined &&
          (typeof this.CompletedDate === 'string') && this.CompletedDate !== undefined && this.CompletedDate !== null)
          ? this.completedDate : this.datePipe.transform(this.CompletedDate, 'MM/dd/yyyy'),
        'OrderNumber': this.OrderNo,
        'ITCode': (this.ICode.value !== undefined && this.ICode.value !== null) ? this.ICode.value : this.iCode,
        'Quantity': this.NetWt,
        'OrderDate': (this.orderDate !== null && this.orderDate !== undefined &&
          (typeof this.OrderDate === 'string'))
          ? this.orderDate : this.datePipe.transform(this.OrderDate, 'MM/dd/yyyy'),
        'Remarks': (this.Remarks !== undefined && this.Remarks !== null) ? this.Remarks : '',
        'RoleId': this.roleId,
        'Username': this.UserInfo.user
      }
      this.restApiService.post(PathConstants.PURCHASE_TENDER_DETAILS_POST, params).subscribe(res => {
        if (res.Item1) {
          this.onClear(type);
          this.onView(type);
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.SuccessMessage });
        } else {
          this.isViewed = false;
          this.blockScreen = false;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: res.Item2 });
        }
      }, (err: HttpErrorResponse) => {
        if (err.status === 0 || err.status === 400) {
          this.isViewed = false;
          this.blockScreen = false;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
        } else {
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.NetworkErrorMessage });
        }
      });
    }
  }

  onClear(type) {
    if (type === '1') {
      this.form.controls.orderDate.reset();
      this.form.controls.qty.reset();
      this.form.controls.Commodity.reset();
      this.form.controls.completedDate.reset();
      this.form.controls.tenderDate.reset();
      this.form.controls.orderNum.reset();
      this.form.controls.tenderId.reset();
      this.form.form.markAsPristine();
      this.form.form.markAsUntouched();
      this.isViewed = false; this.blockScreen = false;
      this.iCode = null; this.commodityOptions = [];
      this.Quantity = null; this.TenderDetId = null;
      this.TenderId = null; this.TenderDate = null;
      this.CompletedDate = null; this.NetWt = null;
      this.OrderDate = null; this.Remarks = null;
      this.tenderDate = null; this.completedDate = null; this.orderDate = null;
    } else {
      this.qtyForm.controls.Additional_Qty.reset();
      this.AdditionalQty = null; this.TenderQtyId = null;
      this.isViewed = false; this.blockScreen = false;
    }
  }

}
