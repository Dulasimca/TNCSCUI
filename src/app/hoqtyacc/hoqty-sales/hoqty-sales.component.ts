import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Dropdown, MessageService } from 'primeng/primeng';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { DatePipe } from '@angular/common';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-hoqty-sales',
  templateUrl: './hoqty-sales.component.html',
  styleUrls: ['./hoqty-sales.component.css']
})
export class HoqtySalesComponent implements OnInit {
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
  CRS: any;
  AAY: any;
  ICDS: any;
  POLICE: any;
  CREDIT: any;
  Srilanka: any;
  COOP: any;
  SPLPDS_CRS: any;
  SPLPDS_COOP: any;
  PTMGR_NMP: any;
  BULK_QTY: any;
  OAP: any;
  Flood: any;
  TenderSales: any;
  NPHH_SSR: any;
  TotalSales: any;
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
      'Type': 6
    }
    this.restApiService.getByParameters(PathConstants.HO_QTY_ABSRTACT_GET, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.TotalSales = (res[0].IssueOnSales * 1);
        //actual purchase data view
        this.restApiService.getByParameters(PathConstants.HO_QTY_FECTH_ALL_TABLES_GET, params).subscribe(res => {
          if (res !== undefined && res.length !== 0 && res !== null) {
            this.RowId = res[0].HOQtySalesID;
            this.CRS = res[0].CRS;
            this.COOP = res[0].COOP;
            this.SPLPDS_CRS = res[0].SPLPDS_CRS;
            this.SPLPDS_COOP = res[0].SPLPDS_COOP;
            this.ICDS = res[0].ICDS;
            this.AAY = res[0].AAY;
            this.OAP = res[0].OAP;
            this.PTMGR_NMP = res[0].PTMGR_NMP;
            this.NPHH_SSR = res[0].NPHH_SSR;
            this.Srilanka = res[0].Srilanka;
            this.Flood = res[0].Flood;
            this.TenderSales = res[0].TenderSales;
            this.POLICE = res[0].POLICE;
            this.BULK_QTY = res[0].BULK_QTY;
            this.CREDIT = res[0].CREDIT;
            this.TotalSales = res[0].TotalSales;
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
    total += ((this.CRS * 1) + (this.COOP * 1) + (this.SPLPDS_COOP * 1) + (this.SPLPDS_CRS * 1)
      + (this.POLICE * 1) + (this.PTMGR_NMP * 1) + (this.AAY * 1) + (this.BULK_QTY * 1)
      + (this.CREDIT * 1) + (this.Srilanka * 1) + (this.NPHH_SSR * 1)
      + (this.OAP * 1) + (this.ICDS * 1) + (this.Flood * 1) + (this.TenderSales * 1));
    return {
      'isTally': (total === (this.TotalSales * 1)) ? true : false,
      'Total': total
    };
  }

  onSave() {
    this.messageService.clear();
    const isTally = this.checkTotalTally().isTally;
    const current_total = this.checkTotalTally().Total;
    const params = {
      HOQtySalesID: this.RowId,
      Qtymonth: this.datePipe.transform(this.FromDate, 'MM'),
      Qtyyear: this.datePipe.transform(this.FromDate, 'yyyy'),
      RCode: this.RCode,
      ITCode: this.ITCode.value,
      LocationID: this.Location.value,
      LocationName: this.Location.label,
      CRS: this.CRS,
      COOP: this.COOP,
      SPLPDS_COOP: this.SPLPDS_COOP,
      SPLPDS_CRS: this.SPLPDS_CRS,
      POLICE: this.POLICE,
      PTMGR_NMP: this.PTMGR_NMP,
      CREDIT: this.CREDIT,
      OAP: this.OAP,
      ICDS: this.ICDS,
      AAY: this.AAY,
      Srilanka: this.Srilanka,
      Flood: this.Flood,
      TenderSales: this.TenderSales,
      NPHH_SSR: this.NPHH_SSR,
      BULK_QTY: this.BULK_QTY,
      TotalSales: this.TotalSales,
    }
    if (isTally) {
      this.restApiService.post(PathConstants.HO_QTY_SALES_POST, params).subscribe(res => {
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
        summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.HoQtyTotalSalesTally + ' Current Total is- ' + current_total,
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
      this.purchaseForm.controls.total_sales_value.reset();
      this.purchaseForm.form.markAsUntouched();
      this.purchaseForm.form.markAsPristine();
    }
    this.purchaseForm.controls.crs_value.reset();
    this.purchaseForm.controls.coop_value.reset();
    this.purchaseForm.controls.splpds_value.reset();
    this.purchaseForm.controls.splpds_coop_value.reset();
    this.purchaseForm.controls.police_value.reset();
    this.purchaseForm.controls.ptmgr_nmp_value.reset();
    this.purchaseForm.controls.bulk_value.reset();
    this.purchaseForm.controls.credit_value.reset();
    this.purchaseForm.controls.icds_value.reset();
    this.purchaseForm.controls.oap_value.reset();
    this.purchaseForm.controls.srilanka_value.reset();
    this.purchaseForm.controls.flood_value.reset();
    this.purchaseForm.controls.tender_sales_value.reset();
    this.purchaseForm.controls.nphh_ssr_value.reset();
    this.purchaseForm.controls.aay_value.reset();
  }

  onClose() {
    this.messageService.clear('t-err');
  }

}

