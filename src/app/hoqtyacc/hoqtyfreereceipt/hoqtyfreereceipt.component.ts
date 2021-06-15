import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Dropdown, MessageService } from 'primeng/primeng';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/shared-services/auth.service';
import { DatePipe } from '@angular/common';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-hoqtyfreereceipt',
  templateUrl: './hoqtyfreereceipt.component.html',
  styleUrls: ['./hoqtyfreereceipt.component.css']
})
export class HoqtyfreereceiptComponent implements OnInit {
  RowId: number = 0;
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
  TotalFreeRice: number;
  NMP: any;
  SGRY: any;
  Annapoorna: any;
  PmgkyPriority: any;
  PmgkyAAY: any;
  ANB: any;
  FortifiedKernels: any;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;
  @ViewChild('commodity', { static: false }) commodityPanel: Dropdown;
  @ViewChild('location', { static: false }) locationPanel: Dropdown;
  @ViewChild('f', { static: false }) freeReceiptForm: NgForm;

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
      'Type': 2
    }
    this.restApiService.getByParameters(PathConstants.HO_QTY_ABSRTACT_GET, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.TotalFreeRice = (res[0].FreeRice * 1);
        //actual purchase data view
        this.restApiService.getByParameters(PathConstants.HO_QTY_FECTH_ALL_TABLES_GET, params).subscribe(res => {
          if (res !== undefined && res.length !== 0 && res !== null) {
            this.RowId = res[0].HOQtyFreeReceiptID;
            this.NMP = res[0].NMP;
            this.SGRY = res[0].SGRY;
            this.Annapoorna = res[0].ANNAPOORNA;
            this.PmgkyPriority = res[0].PMGKY_PRIORITY;
            this.PmgkyAAY = res[0].PMGKY_AAY;
            this.ANB = res[0].ANB;
            this.FortifiedKernels = res[0].FORTIFIED_KERNELS;
            this.TotalFreeRice = res[0].TotalFreeRice;
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
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.HoQtyTotalFreeReceipt, life: 5000
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    })
  }

  checkTotalTally(): boolean {
    let total = 0;
    total += ((this.Annapoorna * 1) + (this.ANB * 1) + (this.NMP * 1) + (this.SGRY * 1)
      + (this.PmgkyAAY * 1) + (this.PmgkyPriority * 1) + (this.FortifiedKernels * 1));
    return (total === (this.TotalFreeRice * 1)) ? true : false;
  }

  onSave() {
    this.messageService.clear();
    const isTally = this.checkTotalTally();
    const params = {
      HOQtyFreeReceiptID: this.RowId,
      Qtymonth: this.datePipe.transform(this.FromDate, 'MM'),
      Qtyyear: this.datePipe.transform(this.FromDate, 'yyyy'),
      RCode: this.RCode,
      ITCode: this.ITCode.value,
      LocationID: this.Location.value,
      LocationName: this.Location.label,
      NMP: this.NMP,
      ANB: this.ANB,
      Annapoorna: this.Annapoorna,
      PMGKY_PRIORITY: this.PmgkyPriority,
      PMGKY_AAY: this.PmgkyAAY,
      SGRY: this.SGRY,
      FORTIFIED_KERNELS: this.FortifiedKernels,
      TotalFreeRice: this.TotalFreeRice,
    }
    if (isTally) {
      this.restApiService.post(PathConstants.HO_QTY_FREE_RECEIPT_POST, params).subscribe(res => {
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
        summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.HoQtyTotalFreeReceiptNotTally, life: 3500
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
      this.freeReceiptForm.controls.total_free_rice_value.reset();
      this.freeReceiptForm.form.markAsUntouched();
      this.freeReceiptForm.form.markAsPristine();
    }
    this.freeReceiptForm.controls.fortified_kernels_value.reset();
    this.freeReceiptForm.controls.anb_value.reset();
    this.freeReceiptForm.controls.pmgky_priority_value.reset();
    this.freeReceiptForm.controls.pmgky_aay_value.reset();
    this.freeReceiptForm.controls.annapoorna_value.reset();
    this.freeReceiptForm.controls.sgry_value.reset();
    this.freeReceiptForm.controls.nmp_value.reset();
  }

  onClose() {
    this.messageService.clear('t-err');
  }

}
