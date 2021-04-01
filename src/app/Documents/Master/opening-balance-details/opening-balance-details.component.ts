import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { SelectItem, MessageService } from 'primeng/api';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { TableConstants } from 'src/app/constants/tableconstants';
import { StatusMessage } from 'src/app/constants/Messages';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Dropdown } from 'primeng/primeng';

@Component({
  selector: 'app-opening-balance-details',
  templateUrl: './opening-balance-details.component.html',
  styleUrls: ['./opening-balance-details.component.css']
})
export class OpeningBalanceDetailsComponent implements OnInit {
  openingBalanceCols: any;
  openingBalanceData: any = [];
  opening_balance: any = [];
  data: any;
  c_cd: any;
  commodityCd: any;
  Year: any;
  commoditySelection: any[] = [];
  yearOptions: SelectItem[];
  godownOptions: SelectItem[];
  commodityOptions: SelectItem[];
  viewCommodityOptions: SelectItem[];
  canShowMenu: boolean;
  disableOkButton: boolean = true;
  isViewed: boolean = false;
  BookBalanceBags: any;
  BookBalanceWeight: any;
  CumulativeShortage: any;
  PhysicalBalanceBags: any;
  PhysicalBalanceWeight: any;
  viewPane: boolean;
  selectedRow: any;
  msgs: any;
  g_cd: any;
  roleId: any;
  showErr: boolean = false;
  gdata: any = [];
  validationErr: boolean = false;
  totalRecords: number;
  blockScreen: boolean;
  currYrSelection: any = [];
  @ViewChild('f', { static: false }) OBForm: NgForm;
  @ViewChild('year', { static: false }) yearPanel: Dropdown;
  @ViewChild('commodity', { static: false }) commodityPanel: Dropdown;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;

  constructor(private authService: AuthService, private roleBasedService: RoleBasedService,
    private restAPIService: RestAPIService, private tableConstants: TableConstants, private messageService: MessageService,
    private datepipe: DatePipe) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.gdata = this.roleBasedService.getInstance();
    if (this.commodityOptions === undefined) {
      this.restAPIService.get(PathConstants.ITEM_MASTER).subscribe(data => {
        if (data !== undefined) {
          data.forEach(y => {
            this.commoditySelection.push({ 'label': y.ITDescription, 'value': y.ITCode });
            this.commodityOptions = this.commoditySelection;
          });
          this.commodityOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        }
      });
    }
    /// curyear
    this.restAPIService.get(PathConstants.STACKCARD_YEAR_GET).subscribe(res => {
      for (let i = 0; i <= 2; i++) {
        this.currYrSelection.push({ label: res[i].StackYear, value: res[i].StackYear });
      }
    });
  }

  calculateCS() {
    if (this.BookBalanceWeight !== undefined && this.PhysicalBalanceWeight !== undefined) {
      if ((this.BookBalanceWeight * 1) < (this.PhysicalBalanceWeight * 1)) {
        this.showErr = true;
        this.PhysicalBalanceWeight = this.CumulativeShortage = null;
      } else {
        this.showErr = false;
        this.CumulativeShortage = ((this.BookBalanceWeight * 1) - (this.PhysicalBalanceWeight * 1)).toFixed(3);
        this.CumulativeShortage = (this.CumulativeShortage * 1);
      }
    } else {
      this.CumulativeShortage = 0;
    }

  }

  calculateBagS() {
    if (this.BookBalanceBags !== undefined && this.PhysicalBalanceBags !== undefined) {
      if ((this.BookBalanceBags * 1) < (this.PhysicalBalanceBags * 1)) {
        this.validationErr = true;
        this.PhysicalBalanceBags = null;
      } else {
        this.validationErr = false;
      }
    }
  }

  onSelect(selectedItem, type) {
    let godownSelection = [];
    switch (selectedItem) {
      case 'gd':
        if (type === 'tab') {
          this.godownPanel.overlayVisible = true;
        }
        if (this.gdata !== undefined) {
          this.gdata.forEach(x => {
            godownSelection.push({ 'label': x.GName, 'value': x.GCode, 'rcode': x.RCode });
            this.godownOptions = godownSelection;
          });
          this.godownOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        }
        break;
      case 'y':
        if (type === 'tab') {
          this.yearPanel.overlayVisible = true;
        }
        if (this.currYrSelection.length !== 0) {
          this.yearOptions = this.currYrSelection;
          this.yearOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        }
        break;
      case 'cd':
        if (type === 'tab') {
          this.commodityPanel.overlayVisible = true;
        }
        this.onCommodityClicked();
        break;
    }
  }

  onChange(e) {
    if (this.commodityOptions !== undefined) {
      const selectedItem = e.value;
      if (selectedItem !== null) {
        this.openingBalanceData = this.openingBalanceData.filter(x => { return x.ITDescription === selectedItem.label });
        if (this.openingBalanceData.length === 0) {
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
            summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage
          });
        }
      } else {
        this.openingBalanceData = this.opening_balance;
      }
    }
  }

  onCommodityClicked() {
    if (this.commodityOptions !== undefined && this.commodityOptions.length <= 1) {
      this.commodityOptions = this.commoditySelection;
    }
  }

  onRowSelect(event) {
    this.disableOkButton = false;
    this.selectedRow = event.data;
  }

  showSelectedData() {
    this.viewPane = false;
    this.isViewed = true;
    this.commodityOptions = [{ 'label': this.selectedRow.ITDescription, 'value': this.selectedRow.CommodityCode }];
    this.c_cd = this.selectedRow.ITDescription;
    this.commodityCd = this.selectedRow.CommodityCode;
    this.BookBalanceBags = this.selectedRow.BookBalanceBags;
    this.BookBalanceWeight = (this.selectedRow.BookBalanceWeight * 1);
    this.PhysicalBalanceBags = this.selectedRow.PhysicalBalanceBags;
    this.PhysicalBalanceWeight = (this.selectedRow.PhysicalBalanceWeight * 1);
    this.CumulativeShortage = (this.selectedRow.CumulitiveShortage * 1);
  }

  onView() {
    this.blockScreen = true;
    this.openingBalanceData = []; this.opening_balance = [];
    const params = new HttpParams().set('ObDate', this.Year.value).append('GCode', this.g_cd.value);
    this.restAPIService.getByParameters(PathConstants.OPENING_BALANCE_MASTER_GET, params).subscribe((res: any) => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.viewPane = true;
        let sno = 0;
        this.openingBalanceCols = this.tableConstants.OpeningBalanceMasterEntry;
        this.openingBalanceData = res;
        this.blockScreen = false;
        this.openingBalanceData.forEach(x => {
          sno += 1;
          x.SlNo = sno;
          x.BookBalanceWeight = (x.BookBalanceWeight * 1).toFixed(3),
            x.PhysicalBalanceWeight = (x.PhysicalBalanceWeight * 1).toFixed(3),
            x.CumulitiveShortage = (x.CumulitiveShortage * 1).toFixed(3),
            x.ObDate = this.datepipe.transform(x.ObDate, 'dd-MM-yyyy')
        });
        this.totalRecords = this.openingBalanceData.length;
        this.opening_balance = this.openingBalanceData.slice(0);
      } else {
        this.blockScreen = false;
        this.viewPane = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      this.blockScreen = false;
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
  }

  onClear() {
    this.OBForm.form.markAsUntouched();
    this.OBForm.form.markAsPristine();
    this.BookBalanceBags = null;
    this.BookBalanceWeight = null;
    this.PhysicalBalanceBags = null;
    this.PhysicalBalanceWeight = null;
    this.c_cd = null;
    this.commodityCd = null;
    this.CumulativeShortage = null;
    this.Year = null;
    this.blockScreen = false;
    this.commodityOptions = [];
    this.godownOptions = [];
    this.yearOptions = [];
    this.Year = null;
    this.g_cd = null;
    this.openingBalanceData = [];
    this.opening_balance = [];
  }

  onSave() {
    this.blockScreen = true;
    const params = {
      'GodownCode': this.g_cd.value,
      'CommodityCode': (this.c_cd.value !== null && this.c_cd.value !== undefined) ? this.c_cd.value : this.commodityCd,
      'ObDate': this.Year.value,
      'BookBalanceBags': this.BookBalanceBags,
      'BookBalanceWeight': this.BookBalanceWeight,
      'PhysicalBalanceBags': this.PhysicalBalanceBags,
      'PhysicalBalanceWeight': this.PhysicalBalanceWeight,
      'CumulitiveShortage': this.CumulativeShortage,
      'RegionCode': this.g_cd.rcode
    };
    this.restAPIService.post(PathConstants.OPENING_BALANCE_MASTER_POST, params).subscribe(res => {
      if (res) {
        this.blockScreen = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.SuccessMessage });
      } else {
        this.blockScreen = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    }, (err: HttpErrorResponse) => {
      this.blockScreen = false;
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.NetworkErrorMessage });
      }
    });
    this.onClear();
  }
}
