import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { FormBuilder } from '@angular/forms';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { MessageService, SelectItem } from 'primeng/api';
import { Dropdown } from 'primeng/primeng';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpErrorResponse } from '@angular/common/http';
import { StatusMessage } from 'src/app/constants/Messages';

@Component({
  selector: 'app-service-provider',
  templateUrl: './service-provider.component.html',
  styleUrls: ['./service-provider.component.css']
})
export class ServiceProviderComponent implements OnInit {
  maxDate: Date;
  curMonth: number;
  Month: any;
  regions: any;
  canShowMenu: boolean;
  blockScreen: boolean;
  data: any;
  loggedInRCode: string;
  roleId: any;
  monthOptions: SelectItem[];
  Year: any;
  yearOptions: SelectItem[];
  accYearOptions: SelectItem[];
  AccountingYear: any;
  regionOptions: SelectItem[];
  RCode: any;
  godownOptions: SelectItem[];
  GCode: any;
  serviceTaxData: any = [];
  TaxPercentOptions: SelectItem[];
  TaxPercent: any;
  serviceTaxCols: any;
  @ViewChild('region', { static: false }) RegionPanel: Dropdown;
  @ViewChild('godown', { static: false }) GodownPanel: Dropdown;
  @ViewChild('m', { static: false }) monthPanel: Dropdown;
  @ViewChild('y', { static: false }) yearPanel: Dropdown;
  @ViewChild('accountingYear', { static: false }) accountingYearPanel: Dropdown;
  @ViewChild('taxPercentage', { static: false }) taxPercentagePanel: Dropdown;
  loading: boolean;


  constructor(private authService: AuthService, private fb: FormBuilder, private datepipe: DatePipe, private messageService: MessageService,
    private tableConstant: TableConstants, private roleBasedService: RoleBasedService, private restApiService: RestAPIService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.regions = this.roleBasedService.getRegions();
    const maxDate = new Date(JSON.parse(this.authService.getServerDate()));
    this.maxDate = (maxDate !== null && maxDate !== undefined) ? maxDate : new Date();
    this.curMonth = new Date().getMonth() + 1;
    this.Month = this.datepipe.transform(new Date(), 'MMM');
    this.monthOptions = [{ label: this.Month, value: this.curMonth }];
    this.Year = new Date().getFullYear();
    this.yearOptions = [{ label: this.Year, value: this.Year }];
    this.serviceTaxCols = this.tableConstant.ServiceProviderEntry;
    let YearSelection = [];
    this.restApiService.get(PathConstants.STACK_YEAR).subscribe(data => {
      if (data !== undefined) {
        data.forEach(y => {
          YearSelection.push({ label: y.ShortYear, value: y.ShortYear });
        });
        this.accYearOptions = YearSelection;
      }
    });
  }

  onSelect(item, type) {
    let regionSelection = [];
    let godownSelection = [];
    let yearArr: any = [];
    const range = 2;
    switch (item) {
      case 'reg':
        this.regions = this.roleBasedService.regionsData;
        if (type === 'tab') {
          this.RegionPanel.overlayVisible = true;
        }
        if (this.roleId === 1) {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              regionSelection.push({ label: x.RName, value: x.RCode });
            });
            this.regionOptions = regionSelection;
          }
        } else {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              if (x.RCode === this.loggedInRCode) {
                regionSelection.push({ label: x.RName, value: x.RCode });
              }
            });
            this.regionOptions = regionSelection;
          }
        }
        break;
      case 'gd':
        if (type === 'tab') {
          this.GodownPanel.overlayVisible = true;
        }
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode) {
              godownSelection.push({ label: x.GName, value: x.GCode, rcode: x.RCode, rname: x.RName });
            }
          });
          this.godownOptions = godownSelection;
          if (this.roleId !== 3) {
            this.godownOptions.unshift({ label: 'All', value: 'All' });
          }
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
        { label: '12 %', value: '12.00' }, { label: '18 %', value: '18.00' }, { label: '28 %', value: '28.00' }];
        break;
    }
  }

  onView() {
    const params = {
      // 'RoleId': this.roleId,
      'GCode': this.GCode,
      'RCode': this.RCode,
      'Month': (this.Month.value !== undefined && this.Month.value !== null) ? this.Month.value : this.curMonth,
      'Year': this.Year,
      'AccountingYear': this.AccountingYear,
      'TaxPer': this.TaxPercent.value
    };
    this.restApiService.getByParameters(PathConstants.SERVICE_PROVIDER_GET, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.serviceTaxData = res;
        let sno = 0;
        this.serviceTaxData.forEach(s => {
          s.bd = this.datepipe.transform(s.BillDate, 'dd/MM/yyyy');
          sno += 1;
          s.SlNo = sno;
        });
        ///Abstract
        var hash = Object.create(null),
          abstract = [];
        this.serviceTaxData.forEach(function (o) {
          var key = ['TaxPercentage'].map(function (k) { return o[k]; }).join('|');
          if (!hash[key]) {
            hash[key] = {
              BillNo: o.BillNo, BillDate: o.BillDate, GSTNo: o.GSTNo,
              TIN: o.TIN, Pan: o.Pan, Amount: 0, TaxPercentage: o.TaxPercentage,
              TaxAmount: 0, CGST: 0, SGST: 0,IGST: 0, Total: 0
            };
            abstract.push(hash[key]);
          }
          ['Amount'].forEach(function (k) { hash[key][k] += (o[k] * 1); });
          ['TaxAmount'].forEach(function (k) { hash[key][k] += (o[k] * 1); });
          ['CGST'].forEach(function (k) { hash[key][k] += (o[k] * 1); });
          ['SGST'].forEach(function (k) { hash[key][k] += (o[k] * 1); });
          ['IGST'].forEach(function (k) { hash[key][k] += (o[k] * 1); });
          ['Total'].forEach(function (k) { hash[key][k] += (o[k] * 1); });
        });
       // this.serviceTaxData.push({ CommodityName: 'Total' });
        abstract.forEach(x => {
          this.serviceTaxData.push({
            CommodityName: 'Total',
            Amount: (x.Amount * 1).toFixed(2), TaxAmount: (x.TaxAmount * 1).toFixed(2),
            CGST: (x.CGST * 1).toFixed(2), SGST: (x.SGST * 1).toFixed(2), Total: (x.Total * 1).toFixed(2)
          });;
        })
        ///End
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

  onResetFields(item) {
    if (item === 'reg') { this.GCode = null; }
    this.serviceTaxData = [];
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
