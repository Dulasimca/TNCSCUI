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
  selector: 'app-service-provider-entry',
  templateUrl: './service-provider-entry.component.html',
  styleUrls: ['./service-provider-entry.component.css']
})
export class ServiceProviderEntryComponent implements OnInit {

  ServiceTaxData: any;
  ServiceTaxCols: any;
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
  TaxtypeOptions: SelectItem[];
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
  Billdate: any;
  Bdate: Date;
  Gst: any;
  Commodity: any;
  CommodityName: any;
  Quantity: any;
  Rate: any;
  percentage: any;
  Amount: any;
  TaxType: any;
  ServiceID: any;
  Vat: any;
  CGST: any;
  SGST: any;
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
  @ViewChild('tax') TaxPanel: Dropdown;
  @ViewChild('f') form: NgForm;


  constructor(private authService: AuthService, private fb: FormBuilder, private datepipe: DatePipe, private messageService: MessageService, private tableConstant: TableConstants, private roleBasedService: RoleBasedService, private restApiService: RestAPIService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
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
  }

  onSelect(item, type) {
    let regionSelection = [];
    let godownSelection = [];
    let YearSelection = [];
    let yearArr: any = [];
    let CompanySelection = [];
    let commoditySelection = [];
    let TaxSelection = [];
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
          this.restApiService.get(PathConstants.GST_SERVICE_PROVIDER_MASTER).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                commoditySelection.push({ 'label': y.SERVICENAME, 'value': y.SACCODE, 'percentage': y.TAXPERCENTAGE});
                this.commodityOptions = commoditySelection;
              });
              this.commodityOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
              this.percentage = this.Commodity.percentage;
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
      case 'tax':
        if (type === 'enter') {
          this.TaxPanel.overlayVisible = true;
        }
        if (this.TaxtypeOptions !== undefined) {
          TaxSelection.push({ 'label': '-select-', 'value': null, disabled: true }, { 'label': 'CGST/SGST', 'value': 'CGST' }, { 'label': 'IGST/UTGST', 'value': 'IGST' });
          this.TaxtypeOptions = TaxSelection;
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
    this.restApiService.getByParameters(PathConstants.SERVICE_PROVIDER_GET, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.ServiceTaxCols = this.tableConstant.ServiceProviderEntry;
        this.ServiceTaxData = res;
        this.CompanyTitle = res;
        let sno = 0;
        let bd = new Date();
        this.ServiceTaxData.forEach(s => {
          // this.Bdate = s.BillDate;
          // s.BillDate = this.datepipe.transform(s.BillDate, 'dd/MM/yyyy');
          s.bd = this.datepipe.transform(s.BillDate, 'dd/MM/yyyy');
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

  onGST() {
    // if (this.percentage !== undefined) {
    let GA = (this.Amount / 100) * this.percentage;
    this.CGST = GA / 2;
    this.SGST = GA / 2;
    this.Vat = GA;
    this.Total = this.Amount + this.Vat;
    // }
  }

  onClear() {
    this.ServiceID = this.Tin = this.State = this.Pan = this.Gst = this.Bill = this.TaxType = this.CompanyName = this.Commodity = this.Quantity = this.Rate = this.Amount = this.percentage = this.Vat = this.SGST = this.CGST = this.Total = null;
    this.Billdate = this.commodityOptions = this.companyOptions = this.TaxtypeOptions = null;
  }

  onSearch(value) {
    this.ServiceTaxData = this.CompanyTitle;
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.ServiceTaxData = this.CompanyTitle.filter(item => {
        return item.Hsncode.toString().startsWith(value);
      });
    } else {
      this.ServiceTaxData = this.CompanyTitle;
    }
  }

  onRowSelect(event, selectedRow) {
    this.viewPane = true;
    this.isEdited = true;
    this.companyOptions = [{ label: selectedRow.CompanyName, value: selectedRow.PartyID }];
    this.commodityOptions = [{ label: selectedRow.CommodityName, value: selectedRow.SACCODE }];
    this.TaxtypeOptions = [{ label: selectedRow.TaxType, value: selectedRow.Tax }];
    this.Pan = selectedRow.Pan;
    this.Gst = selectedRow.GSTNo;
    this.State = selectedRow.StateCode;
    this.TaxType = selectedRow.TaxType;
    this.Bill = selectedRow.BillNo;
    this.Billdate = this.datepipe.transform(selectedRow.BillDate, 'MM/dd/yyyy');
    this.CompanyName = selectedRow.CompanyName;
    this.Commodity = selectedRow.CommodityName;
    this.Quantity = selectedRow.Quantity;
    this.Rate = selectedRow.Rate;
    this.Amount = selectedRow.Amount;
    this.CGST = selectedRow.CGST;
    this.SGST = selectedRow.SGST;
    this.percentage = selectedRow.TaxPercentage;
    this.Vat = selectedRow.TaxAmount;
    this.Total = selectedRow.Total;
    this.ServiceID = selectedRow.ServiceID;
  }


  onSubmit(formUser) {
    const params = {
      // 'Roleid': this.roleId,
      'ServiceID': this.ServiceID || '',
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
      'CommodityName': this.Commodity.label || this.Commodity,
      'TaxType': this.TaxType,
      'CGST': this.CGST,
      'SGST': this.SGST,
      'Amount': this.Amount,
      'TaxPercentage': this.percentage,
      'TaxAmount': this.Vat,
      'Total': this.Total,
      'AccRegion': this.RCode,
      'CreatedBy': this.GCode,
      'CreatedDate': this.Billdate,
      'RCode': this.RCode,
      'GCode': this.GCode
    };
    this.restApiService.post(PathConstants.SERVICE_PROVIDER_POST, params).subscribe(value => {
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
    this.ServiceTaxData = [];
    if (item === 'company') { this.Pan = this.Gst = this.State = null; }
  }
}