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
  selector: 'app-tax-abstractservice',
  templateUrl: './tax-abstractservice.component.html',
  styleUrls: ['./tax-abstractservice.component.css']
})
export class TaxAbstractServiceComponent implements OnInit {
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
  TaxReportData: any = [];
  TaxReportCols: any;
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
    this.TaxReportCols = this.tableConstants.TaxReportServiceColumns;
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
        { label: '12 %', value: '12.00' }, { label: '18 %', value: '18.00' }, { label: '28 %', value: '28.00' }];
        break;
    }
  }


  onView() {
    const params = {
      'GCode': this.GCode,
      'RCode': this.RCode,
      'Month': (this.Month.value !== undefined) ? this.Month.value : this.curMonth,
      'Year': this.Year,
      'AccountingYear': this.AccountingYear.label,      
      'GSTType': 3,
      'TaxPer': this.TaxPercent.value,
      'TaxTran': 'ser'
    };
    this.restApiService.getByParameters(PathConstants.GSTTAX_ABSTRAC_GET, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        // this.purchaseTaxReportCols = this.tableConstants.PurchaseTaxEntry;
        this.TaxReportData = res;
        this.loading = false;
        let sno = 0;
        let bd = new Date();
        this.TaxReportData.forEach(s => {
          // s.bd = this.datepipe.transform(s.BillDate, 'dd/MM/yyyy');
          sno += 1;
          s.SlNo = sno;
        });
        ///Abstract
        var hash = Object.create(null),
          abstract = [];
        this.TaxReportData.forEach(function (o) {
          var key = ['Month'].map(function (k) { return o[k]; }).join('|');
          if (!hash[key]) {
            hash[key] = {            
              Amount: 0, TaxPercentage: o.Percentage, RGNAME: o.RGNAME,
              TaxAmount: 0,  Total: 0, CGST: 0, SGST: 0, IGST: 0,
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
        //this.TaxReportData.push({ CompanyName: 'Total' });
        abstract.forEach(x => {
          this.TaxReportData.push({ RGNAME: 'Total',
             Amount: (x.Amount * 1).toFixed(2), TaxAmount: (x.TaxAmount * 1).toFixed(2),
             CGST: (x.CGST * 1).toFixed(2), SGST: (x.SGST * 1).toFixed(2), IGST: (x.IGST * 1).toFixed(2),
             Total: (x.Total * 1).toFixed(2)
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
    if (item === 'reg') {
      this.GCode = null;
      
    }
    
    this.TaxReportData = [];

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

