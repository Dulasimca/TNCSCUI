import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Dropdown, MessageService } from 'primeng/primeng';
import { NgForm } from '@angular/forms';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { DatePipe } from '@angular/common';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-hoqty-free-issues',
  templateUrl: './hoqty-free-issues.component.html',
  styleUrls: ['./hoqty-free-issues.component.css']
})
export class HoqtyFreeIssuesComponent implements OnInit {
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
  NMP: any;
  SGRY: any;
  Annapoorna: any;
  PmgkyAAY: any;
  PmgkyPriority: any;
  ANB: any;
  FortifiedKernels: any;
  TotalFreeRice: any;
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
      'Type': 4
    }
    this.restApiService.getByParameters(PathConstants.HO_QTY_ABSRTACT_GET, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.TotalFreeRice = (res[0].FreeIssues * 1);
        //actual purchase data view
        this.restApiService.getByParameters(PathConstants.HO_QTY_FECTH_ALL_TABLES_GET, params).subscribe(res => {
          if (res !== undefined && res.length !== 0 && res !== null) {
            this.RowId = res[0].HOQtyFreeIssueID;
            this.NMP = res[0].NMP;
            this.SGRY = res[0].SGRY;
            this.Annapoorna = res[0].ANNAPOORNA;
            this.PmgkyAAY = res[0].PMGKY_AAY;
            this.PmgkyPriority = res[0].PMGKY_PRIORITY;
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
    total += ((this.NMP * 1) + (this.SGRY * 1) + (this.Annapoorna * 1)
      + (this.PmgkyPriority * 1) + (this.PmgkyAAY * 1) + (this.ANB * 1)
      + (this.FortifiedKernels * 1));
    return {
      'isTally': (total === (this.TotalFreeRice * 1)) ? true : false,
      'Total': total
    };
  }

  onSave() {
    this.messageService.clear();
    const isTally = this.checkTotalTally().isTally;
    const current_total = this.checkTotalTally().Total;
    const params = {
      HOQtyFreeIssueID: this.RowId,
      Qtymonth: this.datePipe.transform(this.FromDate, 'MM'),
      Qtyyear: this.datePipe.transform(this.FromDate, 'yyyy'),
      RCode: this.RCode,
      ITCode: this.ITCode.value,
      LocationID: this.Location.value,
      LocationName: this.Location.label,
      NMP: this.NMP,
      SGRY: this.SGRY,
      ANNAPOORNA: this.Annapoorna,
      ANB: this.ANB,
      FORTIFIED_KERNELS: this.FortifiedKernels,
      PMGKY_AAY: this.PmgkyAAY,
      PMGKY_PRIORITY: this.PmgkyPriority,
      TotalFreeRice: this.TotalFreeRice
    }
    if (isTally) {
      this.restApiService.post(PathConstants.HO_QTY_FREE_ISSUE_POST, params).subscribe(res => {
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
        summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.HoQtyTotalFreeIssueNotTally + ' Current Total is- ' + current_total,
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
