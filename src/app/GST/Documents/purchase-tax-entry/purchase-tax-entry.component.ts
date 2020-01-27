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
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import * as Rx from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-purchase-tax-entry',
  templateUrl: './purchase-tax-entry.component.html',
  styleUrls: ['./purchase-tax-entry.component.css']
})
export class PurchaseTaxEntryComponent implements OnInit {

  PurchaseTaxData: any = [];
  PurchaseTaxCols: any;
  PristineData: any = [];
  PresistData: any = [];
  CompanyTitleData: any;
  CompanyTitleCols: any;
  CompanyGlobal: any = [];
  CommodityGlobal: any = [];
  CommodityData: any;
  CommodityCols: any;
  filterArray = [];
  canShowMenu: boolean;
  disableOkButton: boolean = false;
  disableButton: boolean = false;
  onDrop: boolean = true;
  onPut: boolean = true;
  OnEdit: boolean = false;
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
  MeasurementOptions: SelectItem[];
  TaxtypeOptions: SelectItem[];
  regions: any;
  RCode: any;
  GCode: any;
  formUser = [];
  AccountingYear: any;
  PurchaseID: any;
  CompanyName: any;
  Company: any;
  Party: any;
  PartyID: any;
  CommodityID: any;
  CompanyID: any;
  Pan: any;
  Tin: any;
  Bill: any;
  Billdate: any;
  Bdate: Date;
  Gst: any;
  Measurement: any;
  Commodity: any;
  CommodityName: any;
  Quantity: any;
  Rate: any;
  percentage: any;
  Amount: any;
  Vat: any;
  Total: any;
  TaxType: any;
  userdata: any;
  maxDate: Date;
  minDate: Date;
  searchText: any;
  searchParty: any;
  searchCommodity: any;
  items: any;
  Month: any;
  Year: any;
  loggedInRCode: any;
  viewPane: boolean = false;
  isViewed: boolean = false;
  isEdited: boolean = false;
  ifEdit: boolean = false;
  loading: boolean = false;
  isCom: boolean = false;
  isCommodity: boolean = false;
  curMonth: any;
  State: any;
  RName: any;
  CGST: any;
  SGST: any;
  CompanyTitle: any = [];
  @ViewChild('region', { static: false }) RegionPanel: Dropdown;
  @ViewChild('godown', { static: false }) GodownPanel: Dropdown;
  @ViewChild('commodity', { static: false }) commodityPanel: Dropdown;
  @ViewChild('m', { static: false }) monthPanel: Dropdown;
  @ViewChild('y', { static: false }) yearPanel: Dropdown;
  @ViewChild('accountingYear', { static: false }) accountingYearPanel: Dropdown;
  @ViewChild('company', { static: false }) companyPanel: Dropdown;
  @ViewChild('measurement', { static: false }) MeasurementPanel: Dropdown;
  @ViewChild('tax', { static: false }) TaxPanel: Dropdown;
  @ViewChild('f', { static: false }) form: NgForm;


  constructor(private authService: AuthService, private fb: FormBuilder, private datepipe: DatePipe, private messageService: MessageService, private tableConstant: TableConstants, private roleBasedService: RoleBasedService, private restApiService: RestAPIService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    // this.PurchaseTaxCols = this.tableConstant.PurchaseTaxEntry;
    this.RName = this.authService.getUserAccessible().rName;
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
  }

  onSelect(item, type) {
    let regionSelection = [];
    let godownSelection = [];
    let YearSelection = [];
    let yearArr: any = [];
    let CompanySelection = [];
    let commoditySelection = [];
    let MeasurementSelection = [];
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
          if (this.roleId !== 3) {
            this.godownOptions.unshift({ label: 'All', value: 'All' });
          }
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
      case 'tax':
        if (type === 'enter') {
          this.TaxPanel.overlayVisible = true;
        }
        if (this.TaxtypeOptions !== undefined) {
          TaxSelection.push({ 'label': 'CGST/SGST', 'value': 'CGST' }, { 'label': 'IGST/UTGST', 'value': 'IGST' });
        }
        this.TaxtypeOptions = TaxSelection;
        this.TaxtypeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
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
      case 'measurement':
        if (type === 'enter') {
          this.MeasurementPanel.overlayVisible = true;
        }
        if (this.MeasurementOptions !== undefined) {
          MeasurementSelection.push({ 'label': 'GRAMS', 'value': 'GRAMS' }, { 'label': 'KGS', 'value': 'KGS' }, { 'label': 'KILOLITRE', 'value': 'KILOLITRE' }, { 'label': 'LTRS', 'value': 'LTRS' }, { 'label': 'M.TONS', 'value': 'M.TONS' }, { 'label': 'NO.s', 'value': 'NO.s' }, { 'label': 'QUINTAL', 'value': 'QUINTAL' });
        }
        this.MeasurementOptions = MeasurementSelection;
        this.MeasurementOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        break;
      case 'commodity':
        if (type === 'enter') {
          this.commodityPanel.overlayVisible = true;
        }
        this.loading = true;
        this.PresistData = this.CommodityGlobal;
        if (this.commodityOptions !== undefined && this.PresistData !== undefined) {
          this.PresistData.forEach(y => {
            commoditySelection.push({ 'label': y.CommodityName, 'value': y.CommodityID, 'TaxPer': y.TaxPercentage });
          });
          this.loading = false;
          this.commodityOptions = commoditySelection;
          this.commodityOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
          this.percentage = (this.Commodity.TaxPer !== undefined) ? this.Commodity.TaxPer : '';
          this.Vat = (this.Amount / 100) * this.percentage;
          this.Total = this.Amount + this.Vat;
        }
        break;
      case 'company':
        if (type === 'enter') {
          this.companyPanel.overlayVisible = true;
        }
        this.loading = true;
        this.PristineData = this.CompanyGlobal;
        if (this.companyOptions !== undefined && this.PristineData !== undefined) {
          this.PristineData.forEach(s => {
            CompanySelection.push({ 'label': s.PartyName, 'value': s.PartyID, 'tin': s.TIN, 'gstno': s.GSTNo, 'sc': s.StateCode, 'pan': s.Pan });
          });
          this.loading = false;
          this.companyOptions = CompanySelection;
          this.companyOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
          this.Gst = (this.Party.gstno !== undefined) ? this.Party.gstno : '';
          this.Pan = (this.Party.pan !== undefined) ? this.Party.pan : '';
          this.State = (this.Party.sc !== undefined) ? this.Party.sc : '';
        }
        break;
    }
  }

  onCompany() {
    this.loading = true;
    const params = {
      'RCode': this.RCode,
      'Type': 2
    };
    this.CompanyTitleCols = this.tableConstant.PartyName;
    this.restApiService.getByParameters(PathConstants.PARTY_MASTER, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.CompanyTitleData = res;
        this.loading = false;
        this.CompanyGlobal = res;
        this.isViewed = true;
        this.disableOkButton = true;
        this.onDrop = false;
        let sno = 0;
        this.CompanyTitleData.forEach(s => {
          sno += 1;
          s.SlNo = sno;
        });
      } else {
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

  onRow(event, selectedRow) {
    this.isEdited = true;
    this.isViewed = false;
    this.companyOptions = [{ label: selectedRow.PartyName, value: selectedRow.PartyID }];
    this.Party = selectedRow.PartyName;
    this.PartyID = selectedRow.PartyID;
    this.State = selectedRow.StateCode;
    this.Pan = selectedRow.Pan;
    this.Gst = selectedRow.GSTNo;
  }

  onCommoditySelect(event, selectedRow) {
    this.ifEdit = true;
    this.isCom = false;
    this.commodityOptions = [{ label: selectedRow.CommodityName, value: selectedRow.CommodityID }];
    this.Commodity = selectedRow.CommodityName;
    this.CommodityID = selectedRow.CommodityID;
    this.percentage = selectedRow.TaxPercentage;
  }

  onCommodity() {
    this.loading = true;
    this.CommodityCols = this.tableConstant.GSTCommodityName;
    this.restApiService.get(PathConstants.GST_COMMODITY_MASTER).subscribe(data => {
      if (data !== undefined) {
        this.CommodityData = data;
        this.loading = false;
        this.CommodityGlobal = data;
        this.isCom = true;
        this.onPut = false;
        this.disableButton = true;
        this.isCommodity = false;
        let sno = 0;
        this.CommodityData.forEach(s => {
          sno += 1;
          s.SlNo = sno;
        });
      } else {
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
        this.viewPane = true;
        let sno = 0;
        let bd = new Date();
        this.PurchaseTaxData.forEach(s => {
          s.bd = this.datepipe.transform(s.BillDate, 'dd/MM/yyyy');
          sno += 1;
          s.SlNo = sno;
        });
      } else {
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

  onGST() {
    this.Amount = this.Quantity * this.Rate;
    // this.Vat = (this.Amount / 100) * this.percentage;
    let GA = (this.Amount / 100) * this.percentage;
    this.CGST = GA / 2;
    this.SGST = GA / 2;
    this.Vat = GA;
    this.Total = this.Amount + this.Vat;
  }

  onClear() {
    this.PurchaseID = this.Tin = this.State = this.Pan = this.Gst = this.Bill = this.Quantity = this.Rate = this.Amount = this.percentage = this.Vat = this.Total = this.CGST = this.SGST = null;
    this.Billdate = this.commodityOptions = this.companyOptions = this.TaxtypeOptions = this.MeasurementOptions = null;
  }

  onSearch(value) {
    this.PurchaseTaxData = this.CompanyTitle;
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.PurchaseTaxData = this.CompanyTitle.filter(item => {
        return item.TIN.toString().startsWith(value);
      });
    } else {
      this.PurchaseTaxData = this.CompanyTitle;
    }
  }

  onSearchParty(value) {
    this.CompanyTitleData = this.CompanyGlobal;
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.CompanyTitleData = this.CompanyGlobal.filter(item => {
        return item.PartyName.startsWith(value) || item.TIN.toString().startsWith(value);
      });
    } else {
      this.CompanyTitleData = this.CompanyGlobal;
    }
  }

  onSearchCommodity(value) {
    this.CommodityData = this.CommodityGlobal;
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.CommodityData = this.CommodityGlobal.filter(item => {
        return item.CommodityName.toString().startsWith(value);
      });
    } else {
      this.CommodityData = this.CommodityGlobal;
    }
  }

  onRowSelect(event, selectedRow) {
    this.OnEdit = true;
    this.viewPane = false;
    this.companyOptions = [{ label: selectedRow.CompanyName, value: selectedRow.CompanyID }];
    this.commodityOptions = [{ label: selectedRow.CommodityName, value: selectedRow.CommodityID }];
    this.TaxtypeOptions = [{ label: selectedRow.TaxType, value: selectedRow.Tax }];
    this.MeasurementOptions = [{ label: selectedRow.Measurement, value: selectedRow.measurement }];
    this.Pan = selectedRow.Pan;
    this.Gst = selectedRow.GSTNo;
    this.State = selectedRow.StateCode;
    this.Party = selectedRow.CompanyName;
    this.PartyID = selectedRow.CompanyID;
    this.Commodity = selectedRow.CommodityName;
    this.CommodityID = selectedRow.CommodityID;
    this.Bill = selectedRow.BillNo;
    this.Billdate = this.datepipe.transform(selectedRow.BillDate, 'MM/dd/yyyy');
    this.TaxType = selectedRow.TaxType;
    this.Measurement = selectedRow.Measurement;
    this.Quantity = selectedRow.Quantity;
    this.Rate = selectedRow.Rate;
    this.Amount = selectedRow.Amount;
    this.percentage = selectedRow.Percentage;
    this.CGST = selectedRow.CGST;
    this.SGST = selectedRow.SGST;
    this.Total = selectedRow.Total;
    this.Vat = selectedRow.VatAmount;
    this.PurchaseID = selectedRow.PurchaseID;
  }

  onSubmit(formUser) {
    const params = {
      'Roleid': this.roleId,
      'PurchaseID': (this.PurchaseID !== undefined && this.PurchaseID !== null) ? this.PurchaseID : 0,
      'Month': this.curMonth,
      'Year': this.Year,
      'TIN': this.State + this.Pan + this.Gst,
      'GST': this.Gst,
      'State': this.State,
      'Pan': this.Pan,
      'AccYear': this.AccountingYear.label,
      'BillNo': this.Bill,
      'BillDate': this.datepipe.transform(this.Billdate, 'MM/dd/yyyy'),
      'TaxType': this.TaxType,
      'Measurement': this.Measurement,
      'CompanyName': (this.Party.value !== undefined && this.Party.value !== null) ? this.Party.value : this.PartyID,
      'CommodityName': (this.Commodity.value !== undefined && this.Commodity.value !== null) ? this.Commodity.value : this.CommodityID,
      'Quantity': this.Quantity,
      'Rate': this.Rate,
      'Amount': this.Amount,
      'Percentage': this.percentage,
      'VatAmount': this.Vat,
      'CGST': this.CGST,
      'SGST': this.SGST,
      'Total': this.Total,
      'AccRegion': this.RCode,
      'CreatedBy': this.GCode,
      'CreatedDate': this.Billdate,
      'RCode': this.RCode,
      'GCode': this.GCode
    };
    this.restApiService.post(PathConstants.PURCHASE_TAX_ENTRY_POST, params).subscribe(value => {
      if (value) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS,
          summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.SuccessMessage
        });
      } else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.ValidCredentialsErrorMessage
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
    this.onClear();
  }

  onResetTable(item) {
    if (item === 'reg') { this.GCode = null; }
    this.PurchaseTaxData = [];
    if (item === 'company') { this.Pan = this.Gst = this.State = null; }
  }
}