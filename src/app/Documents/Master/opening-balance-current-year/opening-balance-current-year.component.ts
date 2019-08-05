import { Component, OnInit } from '@angular/core';
import { PathConstants } from 'src/app/constants/path.constants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { SelectItem, MessageService } from 'primeng/api';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { TableConstants } from 'src/app/constants/tableconstants';
import { ExcelService } from 'src/app/shared-services/excel.service';

@Component({
  selector: 'app-opening-balance-current-year',
  templateUrl: './opening-balance-current-year.component.html',
  styleUrls: ['./opening-balance-current-year.component.css']
})
export class OpeningBalanceCurrentYearComponent implements OnInit {
  OpeningBalanceDetailCols: any;
  OpeningBalanceDetailData: any;
  data: any;
  g_cd: any;
  c_cd: any;
  Year: any;
  Rowid: any;
  WriteOff: any;
  BookBalanceBags: any;
  BookBalanceWeight: any;
  CumulativeShortage: any;
  PhysicalBalanceBags: any;
  PhysicalBalanceWeight: any;
  CurYear: any;
  yearOptions: SelectItem[];
  godownOptions: SelectItem[];
  commodityOptions: SelectItem[];
  commoditySelection: any[] = [];
  commodityCd: any;
  gdata: any = [];
  opening_balance: any = [];
  selectedRow: any;
  disableOkButton: boolean = true;
  isViewed: boolean = false;
  viewPane: boolean;
  isViewDisabled: boolean;
  isActionDisabled: boolean;
  canShowMenu: boolean;

  constructor(private authService: AuthService, private excelService: ExcelService, private tableConstants: TableConstants, private messageService: MessageService, private roleBasedService: RoleBasedService, private restAPIService: RestAPIService) { }

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

  onChange() {
    if (this.commodityOptions !== undefined && this.godownOptions !== undefined && this.yearOptions !== undefined) {
      const params = new HttpParams().set('ObDate', '04' + '/' + '01' + '/' + this.Year.value).append('GCode', this.g_cd.value);
      this.restAPIService.getByParameters(PathConstants.OPENING_BALANCE_MASTER_GET, params).subscribe((res: any) => {
        if (this.commodityOptions !== undefined && this.commodityOptions.length !== 0) {
          this.OpeningBalanceDetailData = res.filter((x: { ITDescription: any; }) => { return x.ITDescription === this.commodityCd.label });
          if (this.OpeningBalanceDetailData !== undefined && this.OpeningBalanceDetailData !== 0) {
            this.BookBalanceBags = this.OpeningBalanceDetailData[0].BookBalanceBags;
            this.BookBalanceWeight = this.OpeningBalanceDetailData[0].BookBalanceWeight;
            this.PhysicalBalanceBags = this.OpeningBalanceDetailData[0].PhysicalBalanceBags;
            this.PhysicalBalanceWeight = this.OpeningBalanceDetailData[0].PhysicalBalanceWeight;
            this.CumulativeShortage = this.OpeningBalanceDetailData[0].CumulitiveShortage;
            this.WriteOff = this.OpeningBalanceDetailData[0].WriteOff;
            this.Rowid = this.OpeningBalanceDetailData[0].Rowid;
          }
        }
      });
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

  onClear() {
    this.BookBalanceBags = this.BookBalanceWeight = this.PhysicalBalanceBags = this.PhysicalBalanceWeight =
      this.c_cd = this.commodityCd = this.g_cd = this.CumulativeShortage = this.WriteOff = this.Year = null;
  }

  onSave() {
    const params = {
      'Rowid': this.Rowid,
      'WriteOff': this.WriteOff,
    };
    // const params = new HttpParams().set('RowId', this.Rowid).append('WriteOff', this.WriteOff);
    this.restAPIService.put(PathConstants.OPENING_BALANCE_MASTER_PUT, params).subscribe(res => {
      if (res) {
        this.messageService.add({ key: 't-err', severity: 'success', summary: 'Success Message!', detail: 'Saved Successfully!' });
      } else {
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message!', detail: 'Please try again!' });
      }
    })
    this.onClear();
  }

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.OpeningBalanceDetailData, 'OPENING_BALANCE_CURRENT_YEAR_SHORTAGE', this.OpeningBalanceDetailCols);
  }
}
