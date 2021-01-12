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
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-service-provider-entry',
  templateUrl: './service-provider-entry.component.html',
  styleUrls: ['./service-provider-entry.component.css']
})
export class ServiceProviderEntryComponent implements OnInit {

  ServiceTaxData: any;
  ServiceTaxCols: any;
  CompanyTitleCols: any;
  CompanyTitleData: any;
  PristineData: any = [];
  filterArray = [];
  CompanyGlobal: any;
  canShowMenu: boolean;
  disableOkButton: boolean = false;
  onDrop: boolean = true;
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
  TaxtypeOptions: SelectItem[];
  regions: any;
  RCode: any;
  GCode: any;
  formUser = [];
  AccountingYear: any;
  CompanyName: any;
  Company: any;
  Party: any;
  PartyID: any;
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
  curDate: Date;
  searchText: any;
  searchParty: any;
  items: any;
  Month: any;
  Year: any;
  loggedInRCode: any;
  viewPane: boolean = false;
  isViewed: boolean = false;
  isEdited: boolean;
  loading: boolean = false;
  blockScreen: boolean;
  curMonth: any;
  State: any;
  RName: any;
  CompanyTitle: any = [];
  @ViewChild('region', { static: false }) RegionPanel: Dropdown;
  @ViewChild('godown', { static: false }) GodownPanel: Dropdown;
  @ViewChild('commodity', { static: false }) commodityPanel: Dropdown;
  @ViewChild('m', { static: false }) monthPanel: Dropdown;
  @ViewChild('y', { static: false }) yearPanel: Dropdown;
  @ViewChild('accountingYear', { static: false }) accountingYearPanel: Dropdown;
  @ViewChild('company', { static: false }) companyPanel: Dropdown;
  @ViewChild('tax', { static: false }) TaxPanel: Dropdown;
  @ViewChild('f', { static: false }) form: NgForm;

  constructor(private authService: AuthService, private fb: FormBuilder, private datepipe: DatePipe, private messageService: MessageService,
    private tableConstant: TableConstants, private roleBasedService: RoleBasedService, private restApiService: RestAPIService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    this.RName = this.authService.getUserAccessible().rName;
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
          this.godownOptions.unshift({ label: 'All', value: 'All' });
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
        if (this.commodityOptions !== undefined) {
          this.restApiService.get(PathConstants.GST_SERVICE_PROVIDER_MASTER).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                commoditySelection.push({ label: y.SERVICENAME, value: y.ID, percentage: y.TAXPERCENTAGE, saccode: y.SACCODE });
                this.commodityOptions = commoditySelection;
              });
              this.commodityOptions.unshift({ label: '-select-', value: null, disabled: true });
              this.percentage = this.Commodity.percentage;
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
            CompanySelection.push({
              label: s.PartyName, value: s.PartyID, tin: s.TIN, gstno: s.GSTNo, sc: s.StateCode,
              pan: s.Pan
            });
          });
          this.loading = false;
          this.companyOptions = CompanySelection;
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
        this.loading = true;
        this.CompanyTitleData = res;
        this.filterArray = res;
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
        this.viewPane = true;
        let sno = 0;
        let bd = new Date();
        this.ServiceTaxData.forEach(s => {
          s.bd = this.datepipe.transform(s.BillDate, 'dd/MM/yyyy');
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

  onGST() {
    let GA = (this.Amount / 100) * this.percentage;
    this.CGST = (GA / 2).toFixed(2);
    this.SGST = (GA / 2).toFixed(2);
    this.Vat = GA.toFixed(2);
    this.Total = (this.Amount * 1) + (this.Vat * 1);
  }

  onClear() {
    this.ServiceID = this.Tin = this.State = this.Pan = this.Gst = this.Bill = this.TaxType = this.CompanyName = this.Commodity = null;
    this.Quantity = this.Rate = this.Amount = this.percentage = this.Vat = this.SGST = this.CGST = this.Total = null;
    this.Billdate = this.commodityOptions = this.companyOptions = this.TaxtypeOptions = this.Party = null;
  }

  onSearch(value) {
    this.ServiceTaxData = this.CompanyTitle;
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.ServiceTaxData = this.CompanyTitle.filter(item => {
        return item.TIN.toString().startsWith(value);
      });
    } else {
      this.ServiceTaxData = this.CompanyTitle;
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

  onRowSelect(event, selectedRow) {
    this.viewPane = false;
    this.OnEdit = true;
    this.companyOptions = [{ label: selectedRow.CompanyName, value: selectedRow.CompanyID }];
    this.commodityOptions = [{ label: selectedRow.CommodityName, value: selectedRow.CommodityID }];
    this.TaxtypeOptions = [{ label: selectedRow.TaxType, value: selectedRow.Tax }];
    this.Pan = (selectedRow.TIN === 'URD') ? '' : selectedRow.Pan;
    this.Gst = (selectedRow.TIN === 'URD') ? 'URD' : selectedRow.GSTNo;
    this.State = (selectedRow.TIN === 'URD') ? '' : selectedRow.StateCode;
    this.TaxType = selectedRow.TaxType;
    this.Bill = selectedRow.BillNo;
    this.Billdate = this.datepipe.transform(selectedRow.BillDate, 'MM/dd/yyyy');
    this.Party = selectedRow.CompanyName;
    this.PartyID = selectedRow.CompanyID;
    this.Commodity = selectedRow.CommodityID;
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
    this.blockScreen = true;
    this.messageService.clear();
    const params = {
      // 'Roleid': this.roleId,
      'ServiceID': (this.ServiceID !== undefined && this.ServiceID !== null) ? this.ServiceID : 0,
      'Month': (this.Month.value !== undefined) ? this.Month.value : this.curMonth,
      'Year': this.Year,
      'TIN': this.State + this.Pan + this.Gst,
      'AccYear': this.AccountingYear.label,
      'BillNo': this.Bill,
      'BillDate': this.datepipe.transform(this.Billdate, 'MM/dd/yyyy'),
      'CompanyName': (this.Party.value !== undefined && this.Party.value !== null) ? this.Party.value : this.PartyID,
      'CommodityName': this.Commodity.value || this.Commodity,
      'TaxType': this.TaxType,
      'CGST': this.CGST,
      'SGST': this.SGST,
      'Amount': this.Amount,
      'TaxPercentage': this.percentage,
      'TaxAmount': this.Vat,
      'Total': this.Total,
      'CreatedBy': this.GCode,
      'CreatedDate': this.curDate,
      'RCode': this.RCode,
      'GCode': this.GCode
    };
    this.restApiService.post(PathConstants.SERVICE_PROVIDER_POST, params).subscribe(value => {
      if (value) {
        this.blockScreen = false;
        this.onClear();
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS,
          detail: StatusMessage.SuccessMessage
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
    this.ServiceTaxData = [];
    if (item === 'company') { this.Pan = this.Gst = this.State = null; }
  }

  onClose() {
    this.messageService.clear('t-err');
  }
}