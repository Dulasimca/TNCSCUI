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
  RowId: any;
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
    let commoditySelection = [];
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
      case 'cd':
        if (this.commodityOptions === undefined) {
          this.restAPIService.get(PathConstants.ITEM_MASTER).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                commoditySelection.push({ 'label': y.ITDescription, 'value': y.ITCode });
                this.commodityOptions = commoditySelection;
              });
            }
          })
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
    if (this.Year !== undefined && this.g_cd.value !== '' && this.g_cd.value !== undefined && this.g_cd !== null && this.c_cd.value !== undefined && this.c_cd.value !== '' && this.c_cd !== null) {
      this.isViewDisabled = false;
    }
  }

  onChange(e) {
    if (this.commodityOptions !== undefined) {
      const selectedItem = e.value;
      if (selectedItem !== null) {
        this.OpeningBalanceDetailData = this.OpeningBalanceDetailData.filter(x => { return x.ITDescription === selectedItem.label });
        if (this.OpeningBalanceDetailData.length === 0) {
          this.messageService.add({ key: 't-err', severity: 'error', summary: 'Warn Message', detail: 'Record not found!' });
        }
      } else {
        this.OpeningBalanceDetailData = this.opening_balance;
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
    this.BookBalanceBags = this.selectedRow.BookBalanceBags;
    this.BookBalanceWeight = this.selectedRow.BookBalanceWeight;
    this.PhysicalBalanceBags = this.selectedRow.PhysicalBalanceBags;
    this.PhysicalBalanceWeight = this.selectedRow.PhysicalBalanceWeight;
    this.CumulativeShortage = this.selectedRow.CumulativeShortage;
    this.CurYear = this.selectedRow.CurYear;
  }

  onClear() {
    this.BookBalanceBags = this.BookBalanceWeight = this.PhysicalBalanceBags = this.PhysicalBalanceWeight =
      this.c_cd = this.commodityCd = this.g_cd = this.CumulativeShortage = this.CurYear = this.Year = null;
  }

  onView() {
    this.OpeningBalanceDetailData = [];
    const params = new HttpParams().set('ObDate', '04' + '/' + '01' + '/' + this.Year.value).append('Gcode', this.g_cd.value);
    this.restAPIService.getByParameters(PathConstants.OPENING_BALANCE_MASTER_GET, params).subscribe((res: any) => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.viewPane = true;
        let sno = 0;
        this.OpeningBalanceDetailCols = this.tableConstants.OpeningBalanceMasterEntry;
        res.forEach(x => {
          sno += 1;
          this.OpeningBalanceDetailData.push({
            'SlNo': sno, 'ITDescription': x.ITDescription,
            'BookBalanceBags': x.BookBalanceBags,
            'BookBalanceWeight': (x.BookBalanceWeight * 1).toFixed(3),
            'PhysicalBalanceBags': x.PhysicalBalanceBags,
            'PhysicalBalanceWeight': (x.PhysicalBalanceWeight * 1).toFixed(3),
            'CumulativeShortage': (x.CumulitiveShortage * 1).toFixed(3),
            'CurYear': x.CurYear,
            'RowId': x.RowId,
            'WriteOff': x.WriteOff
          })
        });
        this.opening_balance = this.OpeningBalanceDetailData.slice(0);
      } else {
        this.viewPane = false;
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Warn Message', detail: 'Record Not Found!' });
      }
    })
  }

  onSave() {
    const params = {
      'RowId': this.RowId.value,
      'WriteOff': this.WriteOff.value,
      'GodownCode': this.g_cd.value,
      'CommodityCode': (this.c_cd.value !== null && this.c_cd.value !== undefined) ? this.c_cd.value : this.commodityCd,
      'BookBalanceBags': this.BookBalanceBags,
      'BookBalanceWeight': this.BookBalanceWeight,
      'PhysicalBalanceBags': this.PhysicalBalanceBags,
      'PhysicalBalanceWeight': this.PhysicalBalanceWeight,
      'CumulitiveShortage': this.CumulativeShortage,
      'CurYear': this.CurYear
    };
    //  const params = new HttpParams().set('RowId', this.RowId.value).append('WriteOff', this.WriteOff.value);
    this.restAPIService.post(PathConstants.OPENING_BALANCE_MASTER_POST, params).subscribe(res => {
      if (res) {
        this.messageService.add({ key: 't-success', severity: 'success', summary: 'Success Message', detail: 'Saved Successfully!' });
      } else {
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message', detail: 'Please try again!' });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0) {
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message', detail: 'Please try again!' });
      }
    })
    this.onClear();
  }

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.OpeningBalanceDetailData, 'OPENING_BALANCE_CURRENT_YEAR_SHORTAGE', this.OpeningBalanceDetailCols);
  }
}
