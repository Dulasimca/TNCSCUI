import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Dropdown, MessageService } from 'primeng/primeng';
import { AuthService } from 'src/app/shared-services/auth.service';
import { NgForm } from '@angular/forms';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { DatePipe } from '@angular/common';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-hoqty-other-receipt',
  templateUrl: './hoqty-other-receipt.component.html',
  styleUrls: ['./hoqty-other-receipt.component.css']
})
export class HoqtyOtherReceiptComponent implements OnInit {
  canShowMenu: boolean;
  roleId: any;
  data: any = [];
  regions: any = [];
  loggedInRCode: string;
  maxDate: Date;
  yearRange: string;
  username: any;
  regionOptions: SelectItem[];
  RCode: any;
  commodityOptions: SelectItem[];
  ITCode: any;
  locationOptions: SelectItem[];
  Location: any;
  FromDate: any = new Date();
  commoditySelection: any = [];
  locationSelection: any = [];
  FromMrm: any;
  FromHulling: any;
  WithinRegion: any;
  OtherRegion: any;
  Excess: any;
  Packing: any;
  Blg: any;
  SalesReturn: any;
  Others: any;
  TotalOtherReceipt: any;
  RowId: number = 0;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;
  @ViewChild('commodity', { static: false }) commodityPanel: Dropdown;
  @ViewChild('location', { static: false }) locationPanel: Dropdown;
  @ViewChild('f', { static: false }) purchaseForm: NgForm;

  constructor(private authService: AuthService, private roleBasedService: RoleBasedService,
    private messageService: MessageService, private restApiService: RestAPIService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.data = this.roleBasedService.getInstance();
    this.regions = this.roleBasedService.getRegions();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.maxDate = new Date();
    this.yearRange = (this.maxDate.getFullYear() - 1) + ':' + this.maxDate.getFullYear();
    this.username = JSON.parse(this.authService.getCredentials());
    this.onLoad();
  }

  onSelect(item, type) {
    let regionSelection = [];
    switch (item) {
      case 'reg':
        this.regions = this.roleBasedService.regionsData;
        if (type === 'enter') {
          this.regionPanel.overlayVisible = true;
        }
        if (this.roleId === 1) {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              regionSelection.push({ 'label': x.RName, 'value': x.RCode });
            });
            this.regionOptions = regionSelection;
            this.regionOptions.unshift({ label: 'All', value: 'All' });
          }
        } else {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              if (x.RCode === this.loggedInRCode) {
                regionSelection.push({ 'label': x.RName, 'value': x.RCode });
              }
            });
            this.regionOptions = regionSelection;
          }
        }
        break;
      case 'lc':
        if (type === 'tab') {
          this.locationPanel.overlayVisible = true;
        }
        this.locationOptions = this.locationSelection;
        break;
      case 'cd':
        if (type === 'enter') { this.commodityPanel.overlayVisible = true; }
        this.commodityOptions = this.commoditySelection;
        break;
    }
  }

  onLoad() {
    //commodity details
    this.restApiService.get(PathConstants.ITEM_MASTER).subscribe(data => {
      if (data !== undefined) {
        data.forEach(y => {
          this.commoditySelection.push({ 'label': y.ITDescription, 'value': y.ITCode });
        });
      }
    })
    //location details
    this.restApiService.get(PathConstants.LOCATION_MASTER).subscribe(data => {
      if (data !== undefined) {
        data.forEach(y => {
          this.locationSelection.push({ 'label': y.LocationName, 'value': y.LocationID });
        });
      }
    })
  }

  onView() {
    const params = {
      'qtyMonth': this.datePipe.transform(this.FromDate, 'MM'),
      'qtyYear': this.datePipe.transform(this.FromDate, 'yyyy'),
      'RCode': this.RCode,
      'ITCode': this.ITCode.value,
      'Trcode': this.Location.label,
      'Location': this.Location.value,
      'UserName': this.username.user,
      'Type': 3
    }
    this.restApiService.getByParameters(PathConstants.HO_QTY_ABSRTACT_GET, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.TotalOtherReceipt = (res[0].OtherReceipt * 1);
        //actual purchase data view
        this.restApiService.getByParameters(PathConstants.HO_QTY_FECTH_ALL_TABLES_GET, params).subscribe(res => {
          if (res !== undefined && res.length !== 0 && res !== null) {
            this.RowId = res[0].HOQtyOtherReceiptID;
            this.FromMrm = res[0].FromMRM;
            this.FromHulling = res[0].FromHulling;
            this.WithinRegion = res[0].WithinRegion;
            this.OtherRegion = res[0].OtherRegion;
            this.Excess = res[0].Excess;
            this.Packing = res[0].Packing;
            this.Blg = res[0].BLG;
            this.SalesReturn = res[0].SalesReturn;
            this.Others = res[0].Others;
            this.TotalOtherReceipt = res[0].TotalOtherReceipts;
          } else {
            this.RowId = 0;
            this.messageService.clear();
            this.messageService.add({
              key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
              summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination
            });
            this.onClear(2);
          }
        }, (err: HttpErrorResponse) => {
          if (err.status === 0 || err.status === 400) {
            this.messageService.clear();
            this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
          }
        })
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.HoQtyTotalPurchase, life: 5000
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    })
  }

  checkTotalTally() {
    let total = 0;
    total += ((this.FromMrm * 1) + (this.FromHulling * 1) + (this.WithinRegion * 1)
      + (this.Excess * 1) + (this.Packing * 1) + (this.Blg * 1) + (this.SalesReturn * 1)
      + (this.Others * 1) + (this.OtherRegion * 1));
    return {
      'isTally': (total === (this.TotalOtherReceipt * 1)) ? true : false,
      'Total': total
    };
  }

  onSave() {
    this.messageService.clear();
    const isTally = this.checkTotalTally().isTally;
    const current_total = this.checkTotalTally().Total;
    const params = {
      HOQtyOtherReceiptID: this.RowId,
      Qtymonth: this.datePipe.transform(this.FromDate, 'MM'),
      Qtyyear: this.datePipe.transform(this.FromDate, 'yyyy'),
      RCode: this.RCode,
      ITCode: this.ITCode.value,
      LocationID: this.Location.value,
      LocationName: this.Location.label,
      FromMRM: this.FromMrm,
      FromHulling: this.FromHulling,
      WithinRegion: this.WithinRegion,
      OtherRegion: this.OtherRegion,
      Packing: this.Packing,
      Excess: this.Excess,
      BLG: this.Blg,
      SalesReturn: this.SalesReturn,
      Others: this.Others,
      TotalOtherReceipts: this.TotalOtherReceipt,
    }
    if (isTally) {
      this.restApiService.post(PathConstants.HO_QTY_OTHER_RECEIPT_POST, params).subscribe(res => {
        if (res) {
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS,
            summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.SuccessMessage
          });
          this.onClear(1);
        } else {
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
            summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
          });
        }
      }, (err: HttpErrorResponse) => {
        if (err.status === 0 || err.status === 400) {
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
            summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
          });
        }
      });
    } else {
      this.messageService.clear();
      this.messageService.add({
        key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
        summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.HoQtyTotalOtherReceiptNotTally + ' Current Total is- ' + current_total,
        life: 4000
      });
    }
  }

  onClear(type) {
    if (type === 1) {
      this.locationOptions = [];
      this.commodityOptions = [];
      this.regionOptions = [];
      this.RCode = null;
      this.Location = null;
      this.ITCode = null;
      this.FromDate = new Date();
      this.RowId = 0;
      this.purchaseForm.controls.total_other_receipt_value.reset();
      this.purchaseForm.form.markAsUntouched();
      this.purchaseForm.form.markAsPristine();
    }
    this.purchaseForm.controls.from_mrm_value.reset();
    this.purchaseForm.controls.from_hulling_value.reset();
    this.purchaseForm.controls.within_region_value.reset();
    this.purchaseForm.controls.other_region_value.reset();
    this.purchaseForm.controls.excess_sample_value.reset();
    this.purchaseForm.controls.packing_value.reset();
    this.purchaseForm.controls.blg_value.reset();
    this.purchaseForm.controls.sale_return_value.reset();
    this.purchaseForm.controls.others_value.reset();
  }

  onClose() {
    this.messageService.clear('t-err');
  }

}
