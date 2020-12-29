import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { DatePipe } from '@angular/common';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { MessageService, SelectItem } from 'primeng/api';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { PathConstants } from 'src/app/constants/path.constants';
import { Dropdown } from 'primeng/primeng';
import { StatusMessage } from 'src/app/constants/Messages';
import { HttpErrorResponse } from '@angular/common/http';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-sales-tax',
  templateUrl: './sales-tax.component.html',
  styleUrls: ['./sales-tax.component.css']
})
export class SalesTaxComponent implements OnInit {
  canShowMenu: boolean;
  data: any;
  roleId: any;
  regions: any;
  maxDate: Date;
  curMonth: number;
  Month: any;
  monthOptions: SelectItem[];
  Year: any;
  yearOptions: SelectItem[];
  regionOptions: SelectItem[];
  RCode: any;
  GCode: any;
  godownOptions: SelectItem[];
  accYearSelection: any = [];
  AccountingYearOptions: SelectItem[];
  loggedInRCode: string;
  AccountingYear: any;
  salesTaxReportData: any = [];
  salesTaxReportCols: any;
  loading: boolean;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;
  @ViewChild('m', { static: false }) monthPanel: Dropdown;
  @ViewChild('y', { static: false }) yearPanel: Dropdown;
  @ViewChild('dt', { static: false }) table: Table;
  @ViewChild('accountingYear', { static: false }) accountingYearPanel: Dropdown;


  constructor(private authService: AuthService, private datepipe: DatePipe, private messageService: MessageService,
    private tableConstants: TableConstants, private roleBasedService: RoleBasedService, private restApiService: RestAPIService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.regions = this.roleBasedService.getRegions();
    const maxDate = new Date(JSON.parse(this.authService.getServerDate()));
    this.maxDate = (maxDate !== null && maxDate !== undefined) ? maxDate : new Date();
    this.curMonth = new Date().getMonth() + 1;
    this.Month = this.datepipe.transform(new Date(), 'MMM');
    this.monthOptions = [{ label: this.Month, value: this.curMonth }];
    this.Year = new Date().getFullYear();
    this.yearOptions = [{ label: this.Year, value: this.Year }];
    this.restApiService.get(PathConstants.STACK_YEAR).subscribe(data => {
      if (data !== undefined) {
        data.forEach(y => {
          this.accYearSelection.push({ label: y.ShortYear });
        });
        this.AccountingYearOptions = this.accYearSelection;
      }
    });
    this.salesTaxReportCols = this.tableConstants.GSTSalexTaxReportColumns;
  }

  onSelect(item, type) {
    let regionSelection = [];
    let godownSelection = [];
    let yearArr: any = [];
    const range = 2;
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
      case 'gd':
        if (type === 'tab') {
          this.godownPanel.overlayVisible = true;
        }
        if (type === 'enter') { this.godownPanel.overlayVisible = true; }
        this.data = this.roleBasedService.instance;
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            }
          });
          this.godownOptions = godownSelection;
          if (this.roleId !== 3) {
            this.godownOptions.unshift({ label: 'All', value: 'All' });
          }
        } else {
          this.godownOptions = godownSelection;
        }
        break;
      case 'acc':
        if (type === 'tab') {
          this.accountingYearPanel.overlayVisible = true;
        }
        break;
      case 'y':
        if (type === 'tab') {
          this.yearPanel.overlayVisible = true;
        }
        const year = new Date().getFullYear();
        for (let i = 0; i < range; i++) {
          if (i === 0) {
            yearArr.push({ label: (year - 1).toString(), value: year - 1 });
          } else if (i === 1) {
            yearArr.push({ label: (year).toString(), value: year });
          }
        }
        this.yearOptions = yearArr;
        this.yearOptions.unshift({ label: '-select-', value: null, disabled: true });
        break;
      case 'm':
        if (type === 'tab') {
          this.monthPanel.overlayVisible = true;
        }
        this.monthOptions = [{ label: 'Jan', value: '01' },
        { label: 'Feb', value: '02' }, { label: 'Mar', value: '03' }, { label: 'Apr', value: '04' },
        { label: 'May', value: '05' }, { label: 'Jun', value: '06' }, { label: 'Jul', value: '07' },
        { label: 'Aug', value: '08' }, { label: 'Sep', value: '09' }, { label: 'Oct', value: '10' },
        { label: 'Nov', value: '11' }, { label: 'Dec', value: '12' }];
        this.monthOptions.unshift({ label: '-select-', value: null, disabled: true });
        break;
    }
  }

  onView() {
    this.loading = true;
    const params = {
      // 'RoleId': this.roleId,
      'GCode': this.GCode,
      'RCode': this.RCode,
      'Month': (this.Month.value !== undefined) ? this.Month.value : this.curMonth,
      'Year': this.Year,
      'AccountingYear': this.AccountingYear.label,
      'GSTType': '3'
    };
    this.restApiService.getByParameters(PathConstants.SALES_TAX_ENTRY_GET, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.salesTaxReportData = res;
        let sno = 0;
        this.salesTaxReportData.forEach(s => {
          sno += 1;
          s.SlNo = sno;
          s.BillDate = this.datepipe.transform(s.BillDate, 'dd/MM/yyyy');
          s.Amount = ((s.Amount * 1) > 0) ? (s.Amount * 1).toFixed(2) : s.Amount;
          s.Rate = ((s.Rate * 1) > 0) ? (s.Rate * 1).toFixed(2) : s.Rate;
          s.DORate = ((s.DORate * 1) > 0) ? (s.DORate * 1).toFixed(2) : s.DORate;
          s.DOTotal = ((s.DOTotal * 1) > 0) ? (s.DOTotal * 1).toFixed(2) : s.DOTotal;
          s.Quantity = ((s.Quantity * 1) > 0) ? (s.Quantity * 1).toFixed(3) : s.Quantity;
          s.TaxAmount = ((s.TaxAmount * 1) > 0) ? (s.TaxAmount * 1).toFixed(2) : s.TaxAmount;
          s.Total = ((s.Total * 1) > 0) ? (s.Total * 1).toFixed(2) : s.Total;
        });
        this.loading = false;
      } else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
  }

  onResetTable(item) {
    if(item === 'reg') {
      this.GCode = null;
    }
    this.table.reset();
   }

  onClose() {
    this.messageService.clear('t-err');
  }

}
