import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { SelectItem, MessageService } from 'primeng/api';
import { HttpParams } from '@angular/common/http';
import { TableConstants } from 'src/app/constants/tableconstants';

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
  godownName: any;
  Year: any;
  commoditySelection: any[] = [];
  yearOptions: SelectItem[];
  godownOptions: SelectItem[];
  commodityOptions: SelectItem[];
  canShowMenu: boolean;
  disableOkButton: boolean = true;
  BookBalanceBags: number;
  BookBalanceWeight: number;
  CumulitiveShortage: number;
  PhysicalBalanceBags: number;
  PhysicalBalanceWeight: number;
  rCode: any;
  gCode: any;
  viewPane: boolean;
  selectedRow: any;
  msgs: any;
  roleId: any;
  allowSelect: boolean;

  constructor(private authService: AuthService, private roleBasedService: RoleBasedService,
    private restAPIService: RestAPIService, private tableConstants: TableConstants, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    this.roleId = this.authService.getUserAccessible().roleId;
    setTimeout(() => {
      this.allowSelect = (this.roleId != 3) ? true : false;
      this.godownName = this.data.rgData[1].GName;
      this.gCode = this.data.rgData[1].GCode;
      this.rCode = this.data.rgData[0].RCode;
    }, 1200);
    if (this.commodityOptions === undefined) {
      this.restAPIService.get(PathConstants.ITEM_MASTER).subscribe(data => {
        if (data !== undefined) {
          data.forEach(y => {
            this.commoditySelection.push({ 'label': y.ITDescription, 'value': y.ITCode });
            this.commodityOptions = this.commoditySelection;
          });
          this.commodityOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        }
      })
    }
  }

  onSelect(selectedItem) {
    let godownSelection = [];
    switch (selectedItem) {
      case 'gd':
        if (this.data.godownData !== undefined) {
          this.data.godownData.forEach(x => {
            godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            this.godownOptions = godownSelection;
          });
          this.godownOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        }
        break;
      case 'y':
        let yearArr = [];
        const range = 2;
        const year = new Date().getFullYear();
        for (let i = 0; i < range; i++) {
          if (i === 0) {
            yearArr.push({ 'label': (year).toString(), 'value': year });
          } else {
            yearArr.push({ 'label': (year - 1).toString(), 'value': year - 1 });
          }
        }
        this.yearOptions = yearArr;
        this.yearOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        break;
    }
  }

  onChange(e) {
    if (this.commodityOptions !== undefined) {
      const selectedItem = e.value;
      if (selectedItem !== null) {
        this.openingBalanceData = this.openingBalanceData.filter(x => { return x.ITDescription === selectedItem.label });
        if (this.openingBalanceData.length === 0) {
          this.messageService.add({ key: 't-err', severity: 'warn', summary: 'Warn Message', detail: 'Record not found!' });
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
    this.commodityOptions = [{ 'label': this.selectedRow.ITDescription, 'value': this.selectedRow.CommodityCode }];
    this.c_cd = this.selectedRow.ITDescription;
    this.commodityCd = this.selectedRow.CommodityCode;
    this.BookBalanceBags = this.selectedRow.BookBalanceBags;
    this.BookBalanceWeight = this.selectedRow.BookBalanceWeight;
    this.PhysicalBalanceBags = this.selectedRow.PhysicalBalanceBags;
    this.PhysicalBalanceWeight = this.selectedRow.PhysicalBalanceWeight;
    this.CumulitiveShortage = this.selectedRow.CumulitiveShortage;
  }

  onView() {
    this.openingBalanceData = [];
    const params = new HttpParams().set('ObDate', '04' + '/' + '01' + '/' + this.Year.value).append('GCode', this.gCode);
    this.restAPIService.getByParameters(PathConstants.OPENING_BALANCE_MASTER_GET, params).subscribe((res: any) => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.viewPane = true;
        this.openingBalanceCols = this.tableConstants.OpeningBalanceMasterEntry;
        this.openingBalanceData = res;
        this.openingBalanceData.forEach(x => x.GodownName = this.godownName);
        this.opening_balance = this.openingBalanceData.slice(0);
      } else {
        this.viewPane = false;
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message', detail: 'Something went wrong!' });
      }
    })
  }

  onSave() {
    const params = {
      'GodownCode': this.gCode,
      'CommodityCode': (this.c_cd.value !== null && this.c_cd.value !== undefined) ? this.c_cd.value : this.commodityCd,
      'ObDate': this.Year.value,
      'BookBalanceBags': this.BookBalanceBags,
      'BookBalanceWeight': this.BookBalanceWeight,
      'PhysicalBalanceBags': this.PhysicalBalanceBags,
      'PhysicalBalanceWeight': this.PhysicalBalanceWeight,
      'CumulitiveShortage': this.CumulitiveShortage,
      'RegionCode': this.rCode
    };
    this.restAPIService.post(PathConstants.OPENING_BALANCE_MASTER_POST, params).subscribe(res => {
      if (res) {
        this.messageService.add({ key: 't-err', severity: 'success', summary: 'Success Message', detail: 'Saved Successfully!' });
      } else {
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message', detail: 'Something went wrong!' });
      }
    })
  }

}
