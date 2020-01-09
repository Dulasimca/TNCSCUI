import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { Dropdown } from 'primeng/primeng';
import { NgForm, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/shared-services/auth.service';
import { DatePipe } from '@angular/common';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-allotment-issue-quantity',
  templateUrl: './allotment-issue-quantity.component.html',
  styleUrls: ['./allotment-issue-quantity.component.css']
})
export class AllotmentIssueQuantityComponent implements OnInit {
  AllotmentQuantityData: any;
  AllotmentQuantityCols: any;
  PristineData: any = [];
  filterArray = [];
  canShowMenu: boolean;
  disableOkButton: boolean = true;
  selectedRow: any;
  data?: any;
  roleId: any;
  fromDate: any = new Date();
  toDate: any = new Date();
  regionOptions: SelectItem[];
  godownOptions: SelectItem[];
  YearOptions: SelectItem[];
  societyOptions: SelectItem[];
  shopNameOptions: SelectItem[];
  monthOptions: SelectItem[];
  yearOptions: SelectItem[];
  regions: any;
  RCode: any;
  GCode: any;
  formUser = [];
  Quantity: any;
  maxDate: Date;
  minDate: Date;
  searchText: any;
  searchIss: any;
  items: any;
  Month: any;
  Year: any;
  Shop: any;
  Society: any;
  loggedInRCode: any;
  viewPane: boolean = false;
  isViewed: boolean = false;
  isEdited: boolean;
  loading: boolean = false;
  curMonth: any;
  RName: any;
  CompanyTitle: any = [];
  @ViewChild('region') RegionPanel: Dropdown;
  @ViewChild('godown') GodownPanel: Dropdown;
  @ViewChild('commodity') commodityPanel: Dropdown;
  @ViewChild('m') monthPanel: Dropdown;
  @ViewChild('y') yearPanel: Dropdown;
  @ViewChild('shop') shopPanel: Dropdown;
  @ViewChild('society') societyPanel: Dropdown;


  constructor(private authService: AuthService, private fb: FormBuilder, private datepipe: DatePipe, private messageService: MessageService, private tableConstant: TableConstants, private roleBasedService: RoleBasedService, private restApiService: RestAPIService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    this.RName = this.authService.getUserAccessible().rName;
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.regions = this.roleBasedService.getRegions();
    const maxDate = new Date(JSON.parse(this.authService.getServerDate()));
    this.maxDate = (maxDate !== null && maxDate !== undefined) ? maxDate : new Date();
    this.curMonth = new Date().getMonth() + 1;
    this.curMonth = (this.curMonth <= 9) ? '0' + this.curMonth : this.curMonth;
    this.Month = this.datepipe.transform(new Date(), 'MMM');
    this.monthOptions = [{ label: this.Month, value: this.curMonth }];
    this.Year = new Date().getFullYear();
    this.yearOptions = [{ label: this.Year, value: this.Year }];
  }

  onSelect(item, type) {
    let regionSelection = [];
    let godownSelection = [];
    let yearArr: any = [];
    let shopSelection = [];
    let societySelection = [];
    const range = 2;
    switch (item) {
      case 'reg':
        this.regions = this.roleBasedService.regionsData;
        if (type === 'enter') {
          this.RegionPanel.overlayVisible = true;
        }
        if (this.roleId === 1) {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              regionSelection.push({ 'label': x.RName, 'value': x.RCode });
            });
            this.regionOptions = regionSelection;
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
        if (type === 'enter') {
          this.GodownPanel.overlayVisible = true;
        }
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode, 'rcode': x.RCode, 'rname': x.RName });
            }
          });
          this.godownOptions = godownSelection;
        }
        break;
      case 'Yr':
        if (type === 'enter') {
          this.yearPanel.overlayVisible = true;
        }
        const year = new Date().getFullYear();
        for (let i = 0; i < range; i++) {
          if (i === 0) {
            yearArr.push({ 'label': (year - 1).toString(), 'value': year - 1 });
          } else if (i === 1) {
            yearArr.push({ 'label': (year).toString(), 'value': year });
          }
          // else {
          //   yearArr.push({ 'label': (year + 1).toString(), 'value': year + 1 });
          // }
        }
        this.yearOptions = yearArr;
        this.yearOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        break;
      case 'm':
        if (type === 'enter') {
          this.monthPanel.overlayVisible = true;
        }
        this.monthOptions = [{ 'label': 'Jan', 'value': '01' },
        { 'label': 'Feb', 'value': '02' }, { 'label': 'Mar', 'value': '03' }, { 'label': 'Apr', 'value': '04' },
        { 'label': 'May', 'value': '05' }, { 'label': 'Jun', 'value': '06' }, { 'label': 'Jul', 'value': '07' },
        { 'label': 'Aug', 'value': '08' }, { 'label': 'Sep', 'value': '09' }, { 'label': 'Oct', 'value': '10' },
        { 'label': 'Nov', 'value': '11' }, { 'label': 'Dec', 'value': '12' }];
        this.monthOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        break;
      // case 's':
      //   if (type === 'enter') {
      //     this.societyPanel.overlayVisible = true;
      //   }
      //   if (this.CompanyTitle !== undefined) {
      //     // var result = Array.from(this.CompanyTitle.map(item => item.SocietyName));
      //     // for (var index in result) {
      //     //   societySelection.push({ 'label': result[index]})
      //     // }
      //     // this.societyOptions = societySelection;

      //     this.CompanyTitle = this.CompanyTitle.filter(item => {
      //       societySelection.push({ 'label': item.SocietyName, 'value': item.SocietyCode });
      //       let result = Array.from(item.SocietyName.map(it => it.SocietyName));
      //       for (var index in result) {
      //         societySelection.push({ 'label': result[index] });
      //       }
      //     });
      //     this.societyOptions = societySelection;
      //   }
      //   break;
      // case 'sh':
      //   if (type === 'enter') {
      //     this.shopPanel.overlayVisible = true;
      //   }
      //   if (this.shopNameOptions === undefined) {
      //     this.CompanyTitle.forEach(v => {
      //       // shopSelection.push({ 'label': vv.IssuerName, 'value': vv.Receivorcode });

      //       var result = Array.from(new Set(this.CompanyTitle.map((item: any) => item.IssuerName))); //Get distinct values from array
      //       var code = Array.from(new Set(this.CompanyTitle.map((item: any) => item.Acscode)));
      //       for (var index in result && code) {
      //         shopSelection.push({ 'label': result[index], 'value': code[index] })
      //       }
      //     });
      //     this.shopNameOptions = shopSelection;
      //   }

      //   break;
    }
  }

  onView() {
    this.loading = true;
    const params = {
      // 'RoleId': this.roleId,
      'GCode': this.GCode,
      'RCode': this.RCode,
      'Month': (this.Month.value !== undefined && this.Month.value !== null) ? this.Month.value : this.curMonth,
      'Year': this.Year,
      'FromDate': this.datepipe.transform(this.fromDate, 'MM/dd/yyyy'),
      'ToDate': this.datepipe.transform(this.toDate, 'MM/dd/yyyy'),
    };
    this.restApiService.getByParameters(PathConstants.ALLOTMENT_QUANTITY_GET, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.AllotmentQuantityCols = this.tableConstant.AllotmentIssueQuantity;
        this.loading = false;
        this.AllotmentQuantityData = res;
        this.CompanyTitle = res;
        let sno = 0;
        let Balance;
        this.AllotmentQuantityData.forEach(s => {
          s.SIDate = this.datepipe.transform(s.SIDate, 'dd/MM/yyyy');
          s.Balance = (s.AllotmentQty - s.IssueQty);
          sno += 1;
          s.SlNo = sno;
        });
      }
      else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }

  onSearch(value) {
    this.AllotmentQuantityData = this.CompanyTitle;
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.AllotmentQuantityData = this.CompanyTitle.filter(item => {
        return item.SocietyName.toString().startsWith(value);
      });
    } else {
      this.AllotmentQuantityData = this.CompanyTitle;
    }
  }

  onIssuer(value) {
    this.AllotmentQuantityData = this.CompanyTitle;
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.AllotmentQuantityData = this.CompanyTitle.filter(item => {
        return item.IssuerName.toString().startsWith(value);
      });
    } else {
      this.AllotmentQuantityData = this.CompanyTitle;
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
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_INVALID, detail: StatusMessage.ValidDateErrorMessage });
        this.fromDate = this.toDate = '';
      }
      return this.fromDate, this.toDate;
    }
  }

  onResetTable(item) {
    if (item === 'reg') { this.GCode = null; }
    this.AllotmentQuantityData = [];
  }
}
