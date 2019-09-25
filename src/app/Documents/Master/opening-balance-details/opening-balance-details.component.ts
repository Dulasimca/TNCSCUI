import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { SelectItem, MessageService } from 'primeng/api';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { TableConstants } from 'src/app/constants/tableconstants';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { StatusMessage } from 'src/app/constants/Messages';
import { DatePipe } from '@angular/common';

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

  constructor(private authService: AuthService, private roleBasedService: RoleBasedService,
    private excelService: ExcelService, private restAPIService: RestAPIService,
    private tableConstants: TableConstants, private messageService: MessageService,
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
      })
    }
  }

  calculateCS() {
    if (this.BookBalanceWeight !== undefined && this.PhysicalBalanceWeight !== undefined) {
      if (this.BookBalanceWeight < this.PhysicalBalanceWeight) {
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
      if (this.BookBalanceBags < this.PhysicalBalanceBags) {
        this.validationErr = true;
        this.PhysicalBalanceBags = null;
      } else {
        this.validationErr = false;
      }
    }
  }

  onSelect(selectedItem) {
    let godownSelection = [];
    switch (selectedItem) {
      case 'gd':
        if (this.gdata !== undefined) {
          this.gdata.forEach(x => {
            godownSelection.push({ 'label': x.GName, 'value': x.GCode, 'rcode': x.RCode });
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
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage });
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
    this.CumulativeShortage = (this.selectedRow.CumulativeShortage * 1);
  }

  onView() {
    this.openingBalanceData = []; this.opening_balance = [];
    const params = new HttpParams().set('ObDate', '04' + '/' + '01' + '/' + this.Year.value).append('GCode', this.g_cd.value);
    this.restAPIService.getByParameters(PathConstants.OPENING_BALANCE_MASTER_GET, params).subscribe((res: any) => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.viewPane = true;
        let sno = 0;
        this.openingBalanceCols = this.tableConstants.OpeningBalanceMasterEntry;
        this.openingBalanceData = res;
          this.openingBalanceData.forEach(x => {
            sno += 1;
            x.SlNo = sno;
            x.BookBalanceWeight = (x.BookBalanceWeight * 1).toFixed(3),
            x.PhysicalBalanceWeight = (x.PhysicalBalanceWeight * 1).toFixed(3),
            x.CumulitiveShortage = (x.CumulitiveShortage * 1).toFixed(3),
            x.ObDate = this.datepipe.transform(x.ObDate, 'dd-MM-yyyy')
          })
          this.totalRecords = this.openingBalanceData.length;
        this.opening_balance = this.openingBalanceData.slice(0);
      } else {
        this.viewPane = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage });
      }
    })
  }

  onClear() {
    this.BookBalanceBags = this.BookBalanceWeight = this.PhysicalBalanceBags = this.PhysicalBalanceWeight =
      this.c_cd = this.commodityCd = this.CumulativeShortage = this.Year = null;
    this.commodityOptions = [];
  }

  onSave() {
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
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.SuccessMessage });
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    })
    this.onClear();
  }

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.openingBalanceData, 'OPENING_BALANCE_DETAILS', this.openingBalanceCols);
  }
}
