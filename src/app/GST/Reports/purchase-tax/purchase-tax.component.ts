import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Dropdown, MessageService } from 'primeng/primeng';
import { AuthService } from 'src/app/shared-services/auth.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-purchase-tax',
  templateUrl: './purchase-tax.component.html',
  styleUrls: ['./purchase-tax.component.css']
})
export class PurchaseTaxComponent implements OnInit {
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
  TaxPercentOptions: SelectItem[];
  TaxPercent: any;
  loggedInRCode: string;
  AccountingYear: any;
  purchaseTaxReportData: any = [];
  purchaseTaxReportCols: any;
  loading: boolean;
  AADS: any = 1;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;
  @ViewChild('m', { static: false }) monthPanel: Dropdown;
  @ViewChild('y', { static: false }) yearPanel: Dropdown;
  @ViewChild('accountingYear', { static: false }) accountingYearPanel: Dropdown;
  @ViewChild('taxPercentage', { static: false }) taxPercentagePanel: Dropdown;


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
    this.purchaseTaxReportCols = this.tableConstants.GSTPurchasexTaxReportColumns;
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
        this.monthOptions = [{ label: 'Jan', value: '1' },
        { label: 'Feb', value: '2' }, { label: 'Mar', value: '3' }, { label: 'Apr', value: '4' },
        { label: 'May', value: '5' }, { label: 'Jun', value: '6' }, { label: 'Jul', value: '7' },
        { label: 'Aug', value: '8' }, { label: 'Sep', value: '9' }, { label: 'Oct', value: '10' },
        { label: 'Nov', value: '11' }, { label: 'Dec', value: '12' }];
        this.monthOptions.unshift({ label: '-select-', value: null, disabled: true });
        break;
      case 'tp':
        if (type === 'tab') {
          this.taxPercentagePanel.overlayVisible = true;
        }
        this.TaxPercentOptions = [{ label: 'All', value: 'All' },
        { label: '0 %', value: '0.00' }, { label: '2 %', value: '2.00' }, { label: '5 %', value: '5.00' },
        { label: '12 %', value: '12.00' }, { label: '18 %', value: '18.00' }, { label: '100 %', value: '100.00' }];
        break;
    }
  }

  // onView() {
  //   this.loading = true;
  //   const params = {
  //     // 'RoleId': this.roleId,
  //     'GCode': this.GCode,
  //     'RCode': this.RCode,
  //     'Month': (this.Month.value !== undefined) ? this.Month.value : this.curMonth,
  //     'Year': this.Year,
  //     'AccountingYear': this.AccountingYear.label,
  //     'GSTType': 3
  //   };
  //   this.restApiService.getByParameters(PathConstants.PURCHASE_TAX_ENTRY_GET, params).subscribe(res => {
  //     if (res !== undefined && res !== null && res.length !== 0) {
  //       this.purchaseTaxReportData = res;
  //       let sno = 0;
  //       this.purchaseTaxReportData.forEach(s => {
  //         sno += 1;
  //         s.SlNo = sno;
  //         s.BillDate = this.datepipe.transform(s.BillDate, 'dd/MM/yyyy');
  //         s.Amount = ((s.Amount * 1) > 0) ? (s.Amount * 1).toFixed(2) : s.Amount;
  //         s.Rate = ((s.Rate * 1) > 0) ? (s.Rate * 1).toFixed(2) : s.Rate;
  //         s.DORate = ((s.DORate * 1) > 0) ? (s.DORate * 1).toFixed(2) : s.DORate;
  //         s.DOTotal = ((s.DOTotal * 1) > 0) ? (s.DOTotal * 1).toFixed(2) : s.DOTotal;
  //         s.Quantity = ((s.Quantity * 1) > 0) ? (s.Quantity * 1).toFixed(3) : s.Quantity;
  //         s.VatAmount = ((s.VatAmount * 1) > 0) ? (s.VatAmount * 1).toFixed(2) : s.VatAmount;
  //         s.Total = ((s.Total * 1) > 0) ? (s.Total * 1).toFixed(2) : s.Total;
  //       });
  //       this.loading = false;
  //     } else {
  //       this.loading = false;
  //       this.messageService.clear();
  //       this.messageService.add({
  //         key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
  //         summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination
  //       });
  //     }
  //   }, (err: HttpErrorResponse) => {
  //     if (err.status === 0 || err.status === 400) {
  //       this.loading = false;
  //       this.messageService.clear();
  //       this.messageService.add({
  //         key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
  //         summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
  //       });
  //     }
  //   });
  // }

  onView() {
    const params = {
      'GCode': this.GCode,
      'RCode': this.RCode,
      'Month': (this.Month.value !== undefined) ? this.Month.value : this.curMonth,
      'Year': this.Year,
      'AccountingYear': this.AccountingYear.label,
      'GSTType': 5,
      'TaxPer': this.TaxPercent.value
    };
    this.restApiService.getByParameters(PathConstants.PURCHASE_TAX_ENTRY_GET, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        // this.purchaseTaxReportCols = this.tableConstants.PurchaseTaxEntry;
        this.purchaseTaxReportData = res;
        this.loading = false;
        let sno = 0;
        let bd = new Date();
        this.purchaseTaxReportData.forEach(s => {
          s.bd = this.datepipe.transform(s.BillDate, 'dd/MM/yyyy');
          sno += 1;
          s.SlNo = sno;
        });
        ///Abstract
        var hash = Object.create(null),
          abstract = [];
        this.purchaseTaxReportData.forEach(function (o) {
          var key = ['TaxPercentage'].map(function (k) { return o[k]; }).join('|');
          if (!hash[key]) {
            hash[key] = {
              BillNo: o.BillNo, BillDate: o.BillDate, GSTNo: o.GSTNo,
              Quantity: 0, Rate: 0, Amount: 0, TaxPercentage: o.Percentage,
              VatAmount: 0, CGST: 0, SGST: 0, Total: 0
            };
            abstract.push(hash[key]);
          }
          ['TaxPercentage'].forEach(function (k) { hash[key][k] += (o[k] * 1); });
          ['Quantity'].forEach(function (k) { hash[key][k] += (o[k] * 1); });
          ['Rate'].forEach(function (k) { hash[key][k] += (o[k] * 1); });
          ['Amount'].forEach(function (k) { hash[key][k] += (o[k] * 1); });
          ['VatAmount'].forEach(function (k) { hash[key][k] += (o[k] * 1); });
          ['CGST'].forEach(function (k) { hash[key][k] += (o[k] * 1); });
          ['SGST'].forEach(function (k) { hash[key][k] += (o[k] * 1); });
          ['Total'].forEach(function (k) { hash[key][k] += (o[k] * 1); });
        });
        this.purchaseTaxReportData.push({ CompanyName: 'Total' });
        abstract.forEach(x => {
          this.purchaseTaxReportData.push({
            Quantity: (x.Quantity * 1).toFixed(2), Rate: (x.Rate * 1).toFixed(2), Amount: (x.Amount * 1).toFixed(2), VatAmount: (x.VatAmount * 1).toFixed(2),
            CGST: (x.CGST * 1).toFixed(2), SGST: (x.SGST * 1).toFixed(2), Total: (x.Total * 1).toFixed(2)
          });;
        })
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

  }
  onClose() {
    this.messageService.clear('t-err');
  }

  public getStyle(value: string, id: string): string {
    if (id === 'line') {
      return (value === 'ABSTRACT') ? "underline" : "none";
    } else {
      return (value === 'ABSTRACT') ? "#18c5a9" : "black";
    }
  }

}