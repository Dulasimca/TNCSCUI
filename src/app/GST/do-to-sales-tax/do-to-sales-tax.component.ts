import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { Dropdown } from 'primeng/primeng';
import { AuthService } from 'src/app/shared-services/auth.service';
import { DatePipe } from '@angular/common';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { HttpErrorResponse } from '@angular/common/http';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-do-to-sales-tax',
  templateUrl: './do-to-sales-tax.component.html',
  styleUrls: ['./do-to-sales-tax.component.css']
})
export class DoToSalesTaxComponent implements OnInit {
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
  DOSalesData: any = [];
  DOSalesCols: any;
  loading: boolean;
  fromDate: any = new Date();
  toDate: any = new Date();
  @ViewChild('region', { static: false }) regionPanel: Dropdown;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;
  @ViewChild('dt', { static: false }) table: Table;
  // @ViewChild('m', { static: false }) monthPanel: Dropdown;
  // @ViewChild('y', { static: false }) yearPanel: Dropdown;
  blockScreen: boolean;
  username: any;
  accYear: any;


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
    const accountingYear = '04' + '/' + '01' + '/' + this.Year;
    this.restApiService.get(PathConstants.STACK_YEAR).subscribe(data => {
      if (data !== undefined) {
        data.forEach(y => {
          if(y.FromDate === accountingYear) {
          this.accYear = y.ShortYear;
          }
        });
      }
    }, () => {
      if(this.accYear !== null && this.accYear !== undefined) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoAccountingYearFound
        });  
    }
    });
    this.DOSalesCols = this.tableConstants.DOtoSalesTaxReport;
    this.username = JSON.parse(this.authService.getCredentials());
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
      // case 'y':
      //   if (type === 'tab') {
      //     this.yearPanel.overlayVisible = true;
      //   }
      //   const year = new Date().getFullYear();
      //   for (let i = 0; i < range; i++) {
      //     if (i === 0) {
      //       yearArr.push({ label: (year - 1).toString(), value: year - 1 });
      //     } else if (i === 1) {
      //       yearArr.push({ label: (year).toString(), value: year });
      //     }
      //   }
      //   this.yearOptions = yearArr;
      //   this.yearOptions.unshift({ label: '-select-', value: null, disabled: true });
      //   break;
      // case 'm':
      //   if (type === 'tab') {
      //     this.monthPanel.overlayVisible = true;
      //   }
      //   this.monthOptions = [{ label: 'Jan', value: '01' },
      //   { label: 'Feb', value: '02' }, { label: 'Mar', value: '03' }, { label: 'Apr', value: '04' },
      //   { label: 'May', value: '05' }, { label: 'Jun', value: '06' }, { label: 'Jul', value: '07' },
      //   { label: 'Aug', value: '08' }, { label: 'Sep', value: '09' }, { label: 'Oct', value: '10' },
      //   { label: 'Nov', value: '11' }, { label: 'Dec', value: '12' }];
      //   this.monthOptions.unshift({ label: '-select-', value: null, disabled: true });
      //   break;
    }
  }

  onView() {
    this.loading = true;
    const params = {
      // 'RoleId': this.roleId,
      'GCode': this.GCode,
      // 'RCode': this.RCode,
      // 'Month': (this.Month.value !== undefined) ? this.Month.value : this.curMonth,
      // 'Year': this.Year,
      'fromDate': this.datepipe.transform(this.fromDate, 'MM/dd/yyyy'),
      'toDate': this.datepipe.transform(this.toDate, 'MM/dd/yyyy'),
    };
    this.restApiService.getByParameters(PathConstants.DO_TO_SALESTAX, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.DOSalesData = res;
        let sno = 0;
        this.DOSalesData.forEach(s => {
          sno += 1;
          s.SlNo = sno;
        });
        this.loading = false;
      } else {
        this.loading = false;
        this.onResetTable('');
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

  importToSales() {
    if (this.DOSalesData.length !== 0) {
      this.DOSalesData.forEach(x => {
        x.CreatedBy = this.username.user;
        x.Year = new Date(x.DoDate).getFullYear();
        x.Month = (new Date(x.DoDate).getMonth()) + 1;
       // x.Year = x.OrderPeriod.slice(0,4);
        x.AccYear = this.accYear;
        // x.Month = x.OrderPeriod.slice(5, 7);
        x.CurrentDate = this.datepipe.transform(this.maxDate, 'MM/dd/yyyy');
      })
      this.blockScreen = true;
      this.restApiService.post(PathConstants.DO_TO_SALES_POST, this.DOSalesData).subscribe((res: any) => {
        if (res.Item1) {
          this.blockScreen = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS,
            summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.DOSalesTaxImportSuccess
          });
        } else {
          this.blockScreen = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
            summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.DOSalesTaxImportError
          });
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
    }
  }

  onDateSelect() {
    this.checkValidDateSelection();
    this.onResetTable('');
  }

  checkValidDateSelection() {
    if (this.fromDate !== undefined && this.toDate !== undefined && this.fromDate !== '' && this.toDate !== '') {
      let selectedFromDate = this.fromDate.getDate();
      let selectedToDate = this.toDate.getDate();
      let selectedFromMonth = this.fromDate.getMonth();
      let selectedToMonth = this.toDate.getMonth();
      let selectedFromYear = this.fromDate.getFullYear();
      let selectedToYear = this.toDate.getFullYear();
      if ((selectedFromDate > selectedToDate && ((selectedFromMonth >= selectedToMonth && selectedFromYear >= selectedToYear) ||
        (selectedFromMonth === selectedToMonth && selectedFromYear === selectedToYear))) ||
        (selectedFromMonth > selectedToMonth && selectedFromYear === selectedToYear) || (selectedFromYear > selectedToYear)) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR, life: 5000
          , summary: StatusMessage.SUMMARY_INVALID, detail: StatusMessage.ValidDateErrorMessage
        });
        this.fromDate = this.toDate = '';
      }
      return this.fromDate, this.toDate;
    }
  }

  onResetTable(item) {
   if(item === 'R') {
     this.GCode = null;
   }
   this.table.reset();
  }
  
  onClose() {
    this.messageService.clear('t-err');
  }

}