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
  g_cd: any;
  roleId: any;
  showErr: boolean = false;
  rData: any = [];
  gdata: any = [];
  loggedInGCode: any;
  loggedInRCode: any;
  rName: any;

  constructor(private authService: AuthService, private roleBasedService: RoleBasedService, private restApiService: RestAPIService,
    private restAPIService: RestAPIService, private tableConstants: TableConstants, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.roleId = this.authService.getUserAccessible().roleId;
    this.loggedInGCode = this.authService.getUserAccessible().gCode;
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.restApiService.get(PathConstants.GODOWN_MASTER).subscribe((res: any) => {
      let gList;
      if(res !== undefined) {
        if (this.roleId === '3') {
          this.data = res.filter(x => {
            if (x.Code === this.loggedInRCode) {
              gList = x.list;
              this.rData.push({ 'RName': x.Name, 'RCode': x.Code })
              this.rCode = this.rData[0].RCode;
              this.rName = this.rData[0].RName;
            }
            gList.filter(y => {
              if (y.GCode === this.loggedInGCode) {
                this.gdata.push({'GName': y.Name, 'GCode': y.GCode})
                this.godownName = this.gdata[0].GName;
                this.gCode = this.gdata[0].GCode;
              }
            })
          })
        } else if (this.roleId === '2') {
          this.data = res.filter(x => {
            if (x.Code === this.loggedInRCode) {
              gList = x.list;
              this.rData.push({ 'RName': x.Name, 'RCode': x.Code })
            }
            gList.forEach(y => {
                this.gdata.push({'GName': y.Name, 'GCode': y.GCode})
            })
          })
        } else {
          this.data = res.forEach(x => {
          gList = x.list;
          gList.forEach(y => {
            this.gdata.push({'GName': y.Name, 'GCode': y.GCode})
        })
          });
        }
      }
    });
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

  calculateCS() {
    if (this.BookBalanceWeight  !== undefined && this.PhysicalBalanceWeight !== undefined) {
      if (this.BookBalanceWeight < this.PhysicalBalanceWeight) {
        this.showErr = true;
        this.PhysicalBalanceWeight = this.CumulitiveShortage = null;
      } else {
        this.showErr = false;
        this.CumulitiveShortage = this.BookBalanceWeight - this.PhysicalBalanceWeight;
      }
    } else {
      this.CumulitiveShortage = 0;
    }
   
  }

  onSelect(selectedItem) {
    let godownSelection = [];
    switch (selectedItem) {
      case 'gd':
        if (this.gdata !== undefined) {
          this.gdata.forEach(x => {
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
          this.messageService.add({ key: 't-warn', severity: 'warn', summary: 'Warn Message', detail: 'Record not found!' });
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
    const params = new HttpParams().set('ObDate', '04' + '/' + '01' + '/' + this.Year.value).append('GCode', (this.gCode !== undefined) ? this.gCode : this.g_cd.value);
    this.restAPIService.getByParameters(PathConstants.OPENING_BALANCE_MASTER_GET, params).subscribe((res: any) => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.viewPane = true;
        this.openingBalanceCols = this.tableConstants.OpeningBalanceMasterEntry;
        this.openingBalanceData = res;
        this.openingBalanceData.forEach(x => x.GodownName = this.godownName);
        this.opening_balance = this.openingBalanceData.slice(0);
      } else {
        this.viewPane = false;
        this.messageService.add({ key: 't-warn', severity: 'warn', summary: 'Warn Message', detail: 'Record Not Found!' });
      }
    })
  }

  onClear() {
    this.BookBalanceBags = this.BookBalanceWeight = this.PhysicalBalanceBags = this.PhysicalBalanceWeight =
    this.c_cd = this.commodityCd = this.CumulitiveShortage = this.Year = this.g_cd = null;
  }

  onSave() {
    const params = {
      'GodownCode': (this.gCode !== undefined) ? this.gCode : this.g_cd.value,
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
        this.messageService.add({ key: 't-success', severity: 'success', summary: 'Success Message', detail: 'Saved Successfully!' });
      } else {
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message', detail: 'Please try again!' });
      }
    })
    this.onClear();
  }

}
