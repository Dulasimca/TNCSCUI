import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { Dropdown } from 'primeng/primeng';
import { AuthService } from 'src/app/shared-services/auth.service';
import { FormBuilder, FormControl, NgForm, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { StatusMessage } from 'src/app/constants/Messages';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpErrorResponse } from '@angular/common/http';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
  selector: 'app-purchase-tax-entry',
  templateUrl: './purchase-tax-entry.component.html',
  styleUrls: ['./purchase-tax-entry.component.css']
})
export class PurchaseTaxEntryComponent implements OnInit {

  PurchaseTaxData: any = [];
  PurchaseTaxCols: any;
  PristineData: any = [];
  filterArray = [];
  canShowMenu: boolean;
  disableOkButton: boolean = true;
  selectedRow: any;
  data?: any;
  roleId: any;
  fromDate: any;
  toDate: any;
  regionOptions: SelectItem[];
  godownOptions: SelectItem[];
  YearOptions: SelectItem[];
  companyOptions: SelectItem[];
  commodityOptions: SelectItem[];
  monthOptions: SelectItem[];
  yearOptions: SelectItem[];
  regions: any;
  RCode: any;
  GCode: any;
  formUser = [];
  AccountingYear: any;
  CompanyName: any;
  Company: any;
  Pan: any;
  Tin: any;
  Bill: any;
  Billdate: Date;
  Bdate: Date;
  Gst: any;
  Commodity: any;
  CommodityName: any;
  Quantity: any;
  Rate: any;
  percentage: any;
  Amount: any;
  Vat: any;
  Total: any;
  userdata: any;
  maxDate: Date;
  minDate: Date;
  searchText: any;
  items: any;
  Month: any;
  Year: any;
  loggedInRCode: any;
  viewPane: boolean = false;
  isViewed: boolean = false;
  isEdited: boolean;
  loading: boolean = false;
  curMonth: any;
  State: any;
  RName: any;
  CompanyTitle: any = [];
  @ViewChild('region') RegionPanel: Dropdown;
  @ViewChild('godown') GodownPanel: Dropdown;
  @ViewChild('commodity') commodityPanel: Dropdown;
  @ViewChild('m') monthPanel: Dropdown;
  @ViewChild('y') yearPanel: Dropdown;
  @ViewChild('accountingYear') accountingYearPanel: Dropdown;
  @ViewChild('company') companyPanel: Dropdown;
  @ViewChild('f') form: NgForm;


  constructor(private authService: AuthService, private fb: FormBuilder, private datepipe: DatePipe, private messageService: MessageService, private tableConstant: TableConstants, private roleBasedService: RoleBasedService, private restApiService: RestAPIService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    // this.PurchaseTaxCols = this.tableConstant.PurchaseTaxEntry;
    this.RName = this.authService.getUserAccessible().rName;
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.regions = this.roleBasedService.getRegions();
    this.maxDate = new Date();
    this.curMonth = new Date().getMonth() + 1;
    this.Month = this.datepipe.transform(new Date(), 'MMM');
    this.monthOptions = [{ label: this.Month, value: this.curMonth }];
    this.Year = new Date().getFullYear();
    this.yearOptions = [{ label: this.Year, value: this.Year }];
    this.items = [
      {
        label: 'Excel', icon: 'fa fa-table', command: () => {
          // this.exportAsXLSX();
        }
      },
      {
        label: 'PDF', icon: "fa fa-file-pdf-o", command: () => {
          // this.exportAsPDF();
        }
      }];
  }

  onSelect(item, type) {
    let regionSelection = [];
    let godownSelection = [];
    let YearSelection = [];
    let yearArr: any = [];
    let CompanySelection = [];
    let commoditySelection = [];
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
      case 'y':
        if (type === 'enter') {
          this.accountingYearPanel.overlayVisible = true;
        }
        if (this.YearOptions === undefined) {
          this.restApiService.get(PathConstants.STACK_YEAR).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                YearSelection.push({ 'label': y.ShortYear });
              });
              this.YearOptions = YearSelection;
            }
          });
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
          // yearArr.push({ 'label': (year + 1).toString(), 'value': year + 1 });
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
      case 'commodity':
        if (type === 'enter') {
          this.commodityPanel.overlayVisible = true;
        }
        if (this.commodityOptions !== undefined) {
          this.restApiService.get(PathConstants.ITEM_MASTER).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                commoditySelection.push({ 'label': y.ITDescription, 'value': y.ITDescription });
                this.commodityOptions = commoditySelection;
              });
              this.commodityOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
            }
          });
        }
        break;
      case 'company':
        if (type === 'enter') {
          this.companyPanel.overlayVisible = true;
        }
        if (this.companyOptions !== undefined) {
          this.restApiService.get(PathConstants.PARTY_MASTER).subscribe(res => {
            if (res !== undefined) {
              this.CompanyTitle = res;
              res.forEach(s => {
                CompanySelection.push({ 'label': s.PartyName, 'value': s.PartyID, 'tin': s.TIN, 'gstno': s.GSTNo, 'sc': s.StateCode, 'pan': s.Pan });
                this.companyOptions = CompanySelection;
              });
              this.companyOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
              this.Gst = this.CompanyName.gstno;
              this.Pan = this.CompanyName.pan;
              this.State = this.CompanyName.sc;
            }
          });
        }
        break;
    }
  }

  onView() {
    const params = {
      // 'RoleId': this.roleId,
      'GCode': this.GCode,
      'RCode': this.RCode,
      'Month': (this.Month.value !== undefined) ? this.Month.value : this.curMonth,
      'Year': this.Year,
      'AccountingYear': this.AccountingYear.label
    };
    this.restApiService.getByParameters(PathConstants.PURCHASE_TAX_ENTRY_GET, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.PurchaseTaxCols = this.tableConstant.PurchaseTaxEntry;
        this.PurchaseTaxData = res;
        this.CompanyTitle = res;
        let sno = 0;
        this.PurchaseTaxData.forEach(s => {
          this.Bdate = s.BillDate;
          s.BillDate = this.datepipe.transform(s.BillDate, 'dd/MM/yyyy');
          sno += 1;
          s.SlNo = sno;
        });
      }
      else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
  }

  onClear() {
    this.Tin = this.State = this.Pan = this.Gst = this.Bill = this.Quantity = this.Rate = this.Amount = this.percentage = this.Vat = this.Total = null;
    this.Billdate = this.commodityOptions = this.companyOptions = null;
  }

  onSearch(value) {
    this.PurchaseTaxData = this.CompanyTitle;
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.PurchaseTaxData = this.CompanyTitle.filter(item => {
        return item.GSTNo.toString().startsWith(value);
      });
    } else {
      this.PurchaseTaxData = this.CompanyTitle;
    }
  }

  onRowSelect(event, selectedRow) {
    this.viewPane = true;
    this.isEdited = true;
    this.companyOptions = [{ label: selectedRow.CompanyName, value: selectedRow.PartyID }];
    this.commodityOptions = [{ label: selectedRow.CommodityName, value: selectedRow.ITCode }];
    this.Pan = selectedRow.Pan;
    this.Gst = selectedRow.GSTNo;
    this.State = selectedRow.StateCode;
    this.CompanyName = selectedRow.CompanyName;
    this.Commodity = selectedRow.CommodityName;
    // this.Tin = selectedRow.TIN;
    this.Bill = selectedRow.BillNo;
    this.Billdate = selectedRow.BillDate;
    this.Quantity = selectedRow.Quantity;
    this.Rate = selectedRow.Rate;
    this.Amount = selectedRow.Amount;
    this.percentage = selectedRow.Percentage;
    this.Total = selectedRow.Total;
    this.Vat = selectedRow.VatAmount;
  }

  // onIssueDetailsEnter() {
  //   this.Bdate = this.Billdate;
  //   this.PurchaseTaxData.push({
  //     Bdate: this.datepipe.transform(this.Billdate, 'MM/dd/yyyy'),
  //     DeliveryOrderDate: this.datepipe.transform(this.Billdate, 'dd/MM/yyyy'),
  //   });
  //   if (this.PurchaseTaxData.length !== 0) {
  //     this.Billdate = new Date();
  //   }
  // }

  onSubmit(formUser) {
    const params = {
      'Roleid': this.roleId,
      'PurchaseID': '',
      'Month': this.curMonth,
      'Year': this.Year,
      'TIN': this.State + this.Pan + this.Gst,
      'GST': this.Gst,
      'State': this.State,
      'Pan': this.Pan,
      'AccYear': this.AccountingYear.label,
      'BillNo': this.Bill,
      'BillDate': this.datepipe.transform(this.Billdate, 'MM/dd/yyyy'),
      'CompanyName': this.CompanyName.label || this.CompanyName,
      'CommodityName': this.Commodity,
      'Quantity': this.Quantity,
      'Rate': this.Rate,
      'Amount': this.Amount,
      'Percentage': this.percentage,
      'VatAmount': this.Vat,
      'Total': this.Total,
      'AccRegion': this.RCode,
      'CreatedBy': this.GCode,
      'CreatedDate': this.datepipe.transform(this.Billdate, 'MM/dd/yyyy'),
      'RCode': this.RCode,
      'GCode': this.GCode
    };
    this.restApiService.post(PathConstants.PURCHASE_TAX_ENTRY_POST, params).subscribe(value => {
      if (value) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.SuccessMessage });

      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    }
      , (err: HttpErrorResponse) => {
        if (err.status === 0 || err.status === 400) {
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
        }
      });
    this.onClear();
  }

  onResetTable(item) {
    if (item === 'reg') { this.GCode = null; }
    this.PurchaseTaxData = [];
    if (item === 'company') { this.Pan = this.Gst = this.State = null; }
  }
}