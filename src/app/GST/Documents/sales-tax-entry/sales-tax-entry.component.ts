import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { Dropdown } from 'primeng/primeng';
import { NgForm, FormBuilder, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/shared-services/auth.service';
import { DatePipe } from '@angular/common';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { StatusMessage } from 'src/app/constants/Messages';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpErrorResponse } from '@angular/common/http';
import { RouteConfigLoadEnd } from '@angular/router';

@Component({
  selector: 'app-sales-tax-entry',
  templateUrl: './sales-tax-entry.component.html',
  styleUrls: ['./sales-tax-entry.component.css']
})
export class SalesTaxEntryComponent implements OnInit {

  SalesTaxData: any = [];
  SalesTaxCols: any;
  CompanyTitleCols: any;
  CompanyTitleData: any;
  CompanyGlobal: any;
  PristineData: any = [];
  PresistData: any = [];
  CommodityGlobal: any = [];
  CommodityData: any;
  CommodityCols: any;
  filterArray = [];
  onDrop: boolean = true;
  canShowMenu: boolean;
  disableOkButton: boolean = false;
  disableButton: boolean = false;
  selectedRow: any;
  OnEdit: boolean = false;
  onPut: boolean = true;
  blockScreen: boolean;
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
  MeasurementOptions: SelectItem[];
  SchemeOptions: SelectItem[];
  regions: any;
  RCode: any;
  GCode: any;
  formUser = [];
  AccountingYear: any;
  CompanyName: any;
  Company: any;
  Party: any;
  PartyID: any;
  CommodityID: any;
  Pan: any;
  Tin: any;
  Bill: any;
  Billdate: any;
  Bdate: Date;
  Cdate: Date;
  Gst: any;
  curDate: Date;
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
  searchParty: any;
  searchCommodity: any;
  items: any;
  Month: any;
  Year: any;
  Measurement: any;
  Hsncode: any;
  CGST: any;
  SGST: any;
  IGST: any;
  TaxType: any;
  Tax: any;
  SalesID: any;
  Credit: Boolean;
  loggedInRCode: any;
  viewPane: boolean = false;
  isViewed: boolean = false;
  isEdited: boolean;
  ifEdit: boolean = false;
  loading: boolean = false;
  isCom: boolean = false;
  isCommodity: boolean = false;
  curMonth: any;
  State: any;
  RName: any;
  Godown: Boolean = false;
  AADS: string
  Scheme: any;
  SchemeCode: any;
  GodownCode: any;
  Sum: any;
  AllTotal: any;
  CompanyTitle: any = [];
  @ViewChild('region', { static: false }) RegionPanel: Dropdown;
  @ViewChild('godown', { static: false }) GodownPanel: Dropdown;
  @ViewChild('commodity', { static: false }) commodityPanel: Dropdown;
  @ViewChild('m', { static: false }) monthPanel: Dropdown;
  @ViewChild('y', { static: false }) yearPanel: Dropdown;
  @ViewChild('accountingYear', { static: false }) accountingYearPanel: Dropdown;
  @ViewChild('company', { static: false }) companyPanel: Dropdown;
  @ViewChild('tax', { static: false }) TaxPanel: Dropdown;
  @ViewChild('measurement', { static: false }) MeasurementPanel: Dropdown;
  @ViewChild('scheme', { static: false }) SchemePanel: Dropdown;
  @ViewChild('f', { static: false }) form: NgForm;
  aadsGodownSelection: any = [];
  RevRate: any;

  constructor(private authService: AuthService, private fb: FormBuilder, private datepipe: DatePipe, private messageService: MessageService,
    private tableConstant: TableConstants, private roleBasedService: RoleBasedService, private restApiService: RestAPIService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    this.RName = this.authService.getUserAccessible().rName;
    this.GodownCode = this.authService.getUserAccessible().gCode;
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.regions = this.roleBasedService.getRegions();
    const maxDate = new Date(JSON.parse(this.authService.getServerDate()));
    this.maxDate = (maxDate !== null && maxDate !== undefined) ? maxDate : new Date();
    this.curDate = new Date();
    this.curMonth = new Date().getMonth() + 1;
    this.Month = this.datepipe.transform(new Date(), 'MMM');
    this.monthOptions = [{ label: this.Month, value: this.curMonth }];
    this.Year = new Date().getFullYear();
    this.yearOptions = [{ label: this.Year, value: this.Year }];
    this.restApiService.get(PathConstants.AADS).subscribe(res => {
      res.forEach(s => {
        this.aadsGodownSelection.push({ 'label': s.Name, 'value': s.AADSType, 'RCode': s.RGCODE });
      });
    });
    this.aadsGodownSelection.unshift({ label: 'All', value: 'All' });
  }

  onSelect(item, type) {
    let regionSelection = [];
    let godownSelection = [];
    let YearSelection = [];
    let yearArr: any = [];
    let CompanySelection = [];
    let commoditySelection = [];
    let TaxSelection = [];
    let MeasurementSelection = [];
    let SchemeSelection = [];
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
      case 'y':
        if (type === 'tab') {
          this.accountingYearPanel.overlayVisible = true;
        }
        if (this.YearOptions === undefined) {
          this.restApiService.get(PathConstants.STACK_YEAR).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                YearSelection.push({ label: y.ShortYear });
              });
              this.YearOptions = YearSelection;
            }
          });
        }
        break;
      case 'Yr':
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
          // else {
          // yearArr.push({ label: (year + 1).toString(), value: year + 1 });
          // }
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
      case 'commodity':
        if (type === 'tab') {
          this.commodityPanel.overlayVisible = true;
        }
        this.loading = true;
        if (this.commodityOptions !== undefined && this.PresistData !== undefined && this.AADS === "2") {
          this.PresistData = this.CommodityGlobal;
          this.PresistData.forEach(y => {
            commoditySelection.push({ label: y.CommodityName, value: y.CommodityName, 'TaxPer': y.TaxPercentage, 'Hsncode': y.Hsncode });
          });
          this.loading = false;
          this.commodityOptions = commoditySelection;
          this.commodityOptions.unshift({ label: '-select-', value: null, disabled: true });
          this.percentage = (this.Commodity.TaxPer !== undefined) ? this.Commodity.TaxPer : '';
          this.Hsncode = (this.Commodity.Hsncode !== undefined) ? this.Commodity.Hsncode : '';
          this.Vat = ((this.Amount / 100) * this.percentage).toFixed(2);
          this.Total = (this.Amount * 1) + (this.Vat * 1);
        } else if (this.AADS === "1") {
          this.restApiService.get(PathConstants.ITEM_MASTER).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                commoditySelection.push({ 'label': y.ITDescription, 'value': y.ITCode, 'TaxPer': y.TaxPercentage, 'Hsncode': y.Hsncode });
              });
              this.loading = false;
              this.commodityOptions = commoditySelection;
              this.commodityOptions.unshift({ label: '-select-', value: null, disabled: true });
              this.percentage = (this.Commodity.TaxPer !== undefined) ? this.Commodity.TaxPer : '';
              this.Hsncode = (this.Commodity.Hsncode !== undefined) ? this.Commodity.Hsncode : '';
              this.Vat = ((this.Amount / 100) * this.percentage).toFixed(2);
              this.Total = (this.Amount * 1) + (this.Vat * 1);
            }
          });
        }
        break;
      case 'company':
        if (type === 'tab') {
          this.companyPanel.overlayVisible = true;
        }
        this.loading = true;
        this.PristineData = this.CompanyGlobal;
        if (this.companyOptions !== undefined && this.PristineData !== undefined) {
          this.PristineData.forEach(s => {
            CompanySelection.push({ label: s.PartyName, value: s.PartyID, tin: s.TIN, gstno: s.GSTNo, sc: s.StateCode, pan: s.Pan });
          });
          this.loading = false;
          this.companyOptions = CompanySelection;
          this.companyOptions.unshift({ label: '-select-', value: null, disabled: true });
          if (this.Party.tin === 'URD') {
            this.Gst = 'URD';
            this.State = '';
            this.Pan = '';
          } else {
            this.Gst = (this.Party.gstno !== undefined) ? this.Party.gstno : '';
            this.Pan = (this.Party.pan !== undefined) ? this.Party.pan : '';
            this.State = (this.Party.sc !== undefined) ? this.Party.sc : '';
          }
        }
        break;
      case 'tax':
        if (type === 'tab') {
          this.TaxPanel.overlayVisible = true;
        }
        if (this.TaxtypeOptions !== undefined) {
          TaxSelection.push({ label: '-select-', value: null, disabled: true }, { label: 'CGST/SGST', value: 'CGST' },
            { label: 'IGST/UTGST', value: 'IGST' });
          this.TaxtypeOptions = TaxSelection;
        }
        break;
      case 'measurement':
        if (type === 'tab') {
          this.MeasurementPanel.overlayVisible = true;
        }
        if (this.MeasurementOptions !== undefined) {
          MeasurementSelection.push({ label: '-select-', value: null, disabled: true }, { label: 'GRAMS', value: 'GRAMS' },
            { label: 'KGS', value: 'KGS' }, { label: 'KILOLITRE', value: 'KILOLITRE' }, { label: 'LTRS', value: 'LTRS' },
            { label: 'M.TONS', value: 'TONS' }, { label: 'NO.s', value: 'NOS' }, { label: 'QUINTAL', value: 'QUINTAL' });
          this.MeasurementOptions = MeasurementSelection;
        }
        break;
      case 'scheme':
        if (type === 'tab') {
          this.SchemePanel.overlayVisible = true;
        }
        if (this.AADS === "1" && this.SchemeOptions !== undefined) {
          this.restApiService.get(PathConstants.SCHEMES).subscribe(res => {
            res.forEach(s => {
              SchemeSelection.push({ 'label': s.Name, 'value': s.SCCode });
            });
            this.SchemeOptions = SchemeSelection;
            this.SchemeOptions.unshift({ label: '-select-', value: null, disabled: true });
          });
        }
        break;
      case 'gd':
        if (type === 'tab') {
          this.GodownPanel.overlayVisible = true;
        }
        if (this.godownOptions === undefined) {
          if (this.data !== undefined && this.AADS === "1") {
            this.data.forEach(x => {
              if (x.RCode === this.RCode) {
                godownSelection.push({ label: x.GName, value: x.GCode, 'rcode': x.RCode, 'rname': x.RName });
              }
            });
            this.godownOptions = godownSelection;
            this.godownOptions.unshift({ label: 'All', value: 'All' });
          } else if (this.data !== undefined && this.AADS === "2") {
            this.aadsGodownSelection.forEach(s => {
              if (s.RCode === this.RCode) {
                godownSelection.push({ 'label': s.label, 'value': s.value });
              }
            });
            this.godownOptions = godownSelection;
            this.godownOptions.unshift({ label: 'All', value: 'All' });
          }
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
        this.CompanyGlobal = res;
        this.isViewed = true;
        this.disableOkButton = true;
        this.onDrop = false;
        this.loading = false;
        let sno = 0;
        this.CompanyTitleData.forEach(s => {
          sno += 1;
          s.SlNo = sno;
        });
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

  onRow(event, selectedRow) {
    this.isEdited = true;
    this.isViewed = false;
    if (selectedRow.TIN === 'URD') {
      this.companyOptions = [{ label: selectedRow.PartyName, value: selectedRow.PartyID }];
      this.Party = selectedRow.PartyName;
      this.PartyID = selectedRow.PartyID;
      this.Gst = 'URD';
      this.State = '';
      this.Pan = '';
    } else {
      this.companyOptions = [{ label: selectedRow.PartyName, value: selectedRow.PartyID }];
      this.Party = selectedRow.PartyName;
      this.PartyID = selectedRow.PartyID;
      this.State = selectedRow.StateCode;
      this.Pan = selectedRow.Pan;
      this.Gst = selectedRow.GSTNo;
    }
  }

  onCommoditySelect(event, selectedRow) {
    this.ifEdit = true;
    this.isCom = false;
    this.commodityOptions = [{ label: selectedRow.CommodityName, value: selectedRow.CommodityID }];
    this.Commodity = selectedRow.CommodityName;
    this.CommodityID = selectedRow.CommodityID;
    this.percentage = selectedRow.TaxPercentage;
    this.Hsncode = selectedRow.Hsncode;
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

  onView() {
    const params = {
      // 'RoleId': this.roleId,
      'GCode': this.GCode,
      'RCode': this.RCode,
      'Month': (this.Month.value !== undefined) ? this.Month.value : this.curMonth,
      'Year': this.Year,
      'AccountingYear': this.AccountingYear.label,
      'GSTType': this.AADS
    };
    this.restApiService.getByParameters(PathConstants.SALES_TAX_ENTRY_GET, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.SalesTaxCols = (this.AADS === '2') ? this.tableConstant.AADSSalesTaxEntry : this.tableConstant.GodownSalesTaxEntry;
        this.SalesTaxData = res;
        this.CompanyTitle = res;
        this.viewPane = true;
        this.loading = false;
        let sno = 0;
        let bd = new Date();
        this.SalesTaxData.forEach(s => {
          s.bd = this.datepipe.transform(s.BillDate, 'dd/MM/yyyy');
          // this.Cdate = s.CreatedDate;
          sno += 1;
          s.SlNo = sno;
        });
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

  // onGST() {
  //   this.Amount = this.Quantity * this.Rate;
  //   let GA = (this.Amount / 100) * this.percentage;
  //   this.CGST = GA / 2;
  //   this.SGST = GA / 2;
  //   this.Vat = GA;
  //   this.Total = this.Amount + this.Vat;
  // }

  QtyAndRateCalculation(selectedWt, amnt, qty) {
    let sum: any = 0;
    // this.Amount = this.Quantity * this.Rate;
    switch (selectedWt) {
      case 'KGS':
        sum = (qty * amnt).toFixed(2);
        break;
      case 'QUINTAL':
        sum = ((qty / 100) * amnt).toFixed(2);
        break;
      case 'TONS':
        sum = ((qty / 1000) * amnt).toFixed(2);
        break;
      case 'LTRS':
        sum = (qty * amnt).toFixed(2);
        break;
      case 'NOS':
        sum = (qty * amnt).toFixed(2);
        break;
      case 'KILOLITRE':
        sum = ((qty / 1000) * amnt).toFixed(2);
        break;
      case 'GRAMS':
        sum = ((qty * amnt).toFixed(2));
        break;
    }
    return sum;
  }

  PercentageAndAmountTotal(percentage, amt) {
    let total: any = 0;
    total = (percentage * 1) + (amt * 1);
    return total;
  }

  onGST() {
    if (this.Quantity !== undefined && this.Rate !== undefined && this.Quantity !== null && this.Rate !== null) {
      let unit = (this.Measurement.value !== undefined && this.Measurement.value !== null) ? this.Measurement.value : this.Measurement;
      this.Amount = this.QtyAndRateCalculation(unit, this.Rate, this.Quantity);
      let GA;
      GA = (this.Amount / 100) * this.percentage;
      this.Total = this.Amount + ((this.Amount / 100) * this.percentage);
      this.CGST = (GA / 2).toFixed(2);
      this.SGST = (GA / 2).toFixed(2);
      this.Vat = GA.toFixed(2);
      // this.Total = (this.Amount * 1) + (this.Vat * 1);
      this.Total = this.PercentageAndAmountTotal(this.Vat, this.Amount);
      this.onRevRate();
    }
  }

  onRevRate() {
  this.RevRate = Math.round((this.Rate * 100) / (100 + this.percentage));
  }

  onClear() {
    this.SalesID = this.Tin = this.State = this.Pan = this.Gst = this.Bill = this.TaxType = this.Measurement = this.CompanyName = null;
    this.Commodity = this.Quantity = this.Rate = this.RevRate = this.Amount = this.percentage = this.Vat = this.SGST = this.CGST = this.Hsncode = null;
    this.Billdate = this.commodityOptions = this.companyOptions = this.Total = this.SchemeOptions = this.Scheme = this.Party = null;
    this.TaxtypeOptions = this.MeasurementOptions = null;
    this.Credit = false;
  }

  onSearch(value) {
    this.SalesTaxData = this.CompanyTitle;
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.SalesTaxData = this.CompanyTitle.filter(item => {
        return item.BillNo.toString().startsWith(value);
      });
    } else {
      this.SalesTaxData = this.CompanyTitle;
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
    this.viewPane = false;
    this.AADS = selectedRow.GSTType;
    this.OnEdit = true;
    this.companyOptions = [{ label: selectedRow.CompanyName, value: selectedRow.CompanyID }];
    this.commodityOptions = [{ label: selectedRow.CommodityName, value: selectedRow.CommodityID }];
    this.TaxtypeOptions = [{ label: selectedRow.TaxType, value: selectedRow.Tax }];
    this.MeasurementOptions = [{ label: selectedRow.Measurement, value: selectedRow.measurement }];
    this.Pan = (selectedRow.TIN === 'URD') ? '' : selectedRow.Pan;
    this.Gst = (selectedRow.TIN === 'URD') ? 'URD' : selectedRow.GSTNo;
    this.State = (selectedRow.TIN === 'URD') ? '' : selectedRow.StateCode;
    this.Hsncode = selectedRow.Hsncode;
    this.TaxType = selectedRow.TaxType;
    this.Measurement = selectedRow.Measurement;
    this.Bill = selectedRow.BillNo;
    this.Billdate = this.datepipe.transform(selectedRow.BillDate, 'MM/dd/yyyy');
    this.Party = selectedRow.CompanyName;
    this.PartyID = selectedRow.CompanyID;
    this.Commodity = selectedRow.CommodityName;
    this.CommodityID = selectedRow.CommodityID;
    this.Quantity = selectedRow.Quantity;
    this.Rate = selectedRow.Rate;
    this.RevRate = selectedRow.RevRate;
    this.Amount = selectedRow.Amount;
    this.Credit = selectedRow.CreditSales;
    this.CGST = selectedRow.CGST;
    this.SGST = selectedRow.SGST;
    this.percentage = selectedRow.TaxPercentage;
    this.Vat = selectedRow.TaxAmount;
    this.Total = selectedRow.Total;
    this.SalesID = selectedRow.SalesID;
    this.SchemeOptions = [{ label: selectedRow.SchemeName, value: selectedRow.SchemeCode }];
    this.Scheme = selectedRow.SchemeName;
    this.SchemeCode = selectedRow.SchemeCode;
  }


  showTrue(e: any) {
    if (this.Credit == true) {
      this.Credit = true
    } else {
      this.Credit = false
    }
  }

  onSubmit(formUser) {
    this.blockScreen = true;
    this.messageService.clear();
    const params = {
      'SalesID': (this.SalesID !== undefined && this.SalesID !== null) ? this.SalesID : 0,
      'Month': (this.Month.value !== undefined) ? this.Month.value : this.curMonth,
      'Year': this.Year,
      'AccYear': this.AccountingYear.label,
      'BillNo': this.Bill,
      'BillDate': this.datepipe.transform(this.Billdate, 'MM/dd/yyyy'),
      'CompanyName': (this.Party.value !== undefined && this.Party.value !== null) ? this.Party.value : this.PartyID,
      'CommodityName': (this.Commodity.value !== undefined && this.Commodity.value !== null) ? this.Commodity.value : this.CommodityID,
      'CreditSales': (this.Credit == true) ? true : false,
      'TaxType': this.TaxType,
      'Measurement': this.Measurement,
      'Hsncode': this.Hsncode,
      'CGST': this.CGST,
      'SGST': this.SGST,
      'Quantity': this.Quantity,
      'Rate': this.Rate,
      'Amount': this.Amount,
      'TaxPercentage': this.percentage,
      'TaxAmount': this.Vat,
      'Total': this.Total,
      'CreatedBy': this.GCode,
      'CreatedDate': this.curDate,
      'RCode': this.RCode,
      'GCode': (this.AADS === '2') ? this.GodownCode : this.GCode,
      'GSTType': this.AADS,
      'Scheme': (this.AADS === '1') ? this.Scheme.value || this.SchemeCode : '',
      'AADS': (this.AADS === '2') ? this.GCode : '',
      'RevRate': this.RevRate
    };
    this.restApiService.post(PathConstants.SALES_TAX_ENTRY_POST, params).subscribe(value => {
      if (value) {
        this.blockScreen = false;
        this.onClear();
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS,
          summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.SuccessMessage
        });
      } else {
        this.blockScreen = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING, life: 5000,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.ValidCredentialsErrorMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      this.blockScreen = false;
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
  }

  onResetTable(item) {
    if (item === 'reg') { this.GCode = null; }
    this.SalesTaxData = [];
    if (item === 'company') { this.Pan = this.Gst = this.State = null; }
    if (item === 'AADS') { this.GCode = this.formUser = null; this.OnEdit = false; this.godownOptions = undefined }
  }

  onClose() {
    this.messageService.clear('t-err');
  }
}