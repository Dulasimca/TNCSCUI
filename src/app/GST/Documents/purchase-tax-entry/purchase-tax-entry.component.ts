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
  regions: any;
  RCode: any;
  GCode: any;
  formUser = [];
  AccountingYear: any;
  CompanyName: any;
  Pan: any;
  Tin: any;
  Bill: any;
  Billdate: any;
  Gst: any;
  Commodity: any;
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
  viewPane: boolean;
  isViewed: boolean = false;
  isEdited: boolean;
  loading: boolean = false;
  RName: any;
  @ViewChild('region') RegionPanel: Dropdown;
  @ViewChild('godown') GodownPanel: Dropdown;
  @ViewChild('commodity') commodityPanel: Dropdown;
  @ViewChild('accountingYear') accountingYearPanel: Dropdown;
  @ViewChild('company') companyPanel: Dropdown;
  @ViewChild('f') form: NgForm;


  constructor(private authService: AuthService, private fb: FormBuilder, private datepipe: DatePipe, private messageService: MessageService, private tableConstant: TableConstants, private roleBasedService: RoleBasedService, private restApiService: RestAPIService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    this.PurchaseTaxCols = this.tableConstant.PurchaseTaxEntry;
    this.RName = this.authService.getUserAccessible().rName;
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.regions = this.roleBasedService.getRegions();
    this.maxDate = new Date();
    const curYear = new Date().getFullYear();
    const formDate = '04' + '-' + '01' + '-' + curYear;
    this.minDate = new Date(formDate);
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
    this.userdata = this.fb.group({
      'PanNo': new FormControl(''),
      'Partyname': new FormControl(''),
      'Favour': new FormControl(''),
      'GST': new FormControl(''),
      'Account': new FormControl(''),
      'Bank': new FormControl(''),
      'Branch': new FormControl(''),
      'IFSC': new FormControl(''),
      //  'Region': new FormControl(''),
      // 'telno': new FormControl('', Validators.compose([Validators.required, Validators.minLength(11)])),
      // 'mobno': new FormControl('', Validators.compose([Validators.required, Validators.minLength(10)])),
    });
  }

  onSelect(item, type) {
    let regionSelection = [];
    let godownSelection = [];
    let YearSelection = [];
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
    }
  }

  onView() {
    const params = {
      // 'RoleId': this.roleId,
      'GCode': this.GCode,
      'RCode': this.RCode,
      'Month': this.Month,
      'Year': this.Year,
      'AccountingYear': this.AccountingYear.label
    };
    this.restApiService.getByParameters(PathConstants.PURCHASE_TAX_ENTRY_GET, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        // this.viewPane = true;
        this.PurchaseTaxCols = this.tableConstant.PurchaseTaxEntry;
        this.PurchaseTaxData = res;
        let sno = 0;
        this.PurchaseTaxData.forEach(s => {
          s.BillDate = this.datepipe.transform(s.BillDate, 'MM/dd/yyyy');
          sno += 1;
          s.SlNo = sno;
        });
      }
    });
  }

  onClear() {
    //   this.CompanyName = this.Tin = this.Bill = this.Billdate = this.CompanyName = this.Quantity = this.Rate = this.Amount = this.percentage = this.Vat = this.Total = [];
  }

  onSearch(value) {
    this.PurchaseTaxData = this.filterArray;
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.PurchaseTaxData = this.PristineData.filter(item => {
        return item.Issuername.toString().startsWith(value);
      });
    } else {
      this.PurchaseTaxData = this.PristineData;
    }
  }

  onRowSelect(event, selectedRow) {
    this.viewPane = true;
    this.isEdited = true;
    // this.selectedRow = event.data;
    this.Tin = selectedRow.TIN;
    this.Bill = selectedRow.BillNo;
    this.Billdate = selectedRow.BillDate;
    this.Quantity = selectedRow.Quantity;
    this.Rate = selectedRow.Rate;
    this.Amount = selectedRow.Amount;
    this.percentage = selectedRow.Percentage;
    this.Total = selectedRow.Total;
    this.Vat = selectedRow.VatAmount;
  }

  showSelectedData() {
    this.viewPane = true;
    this.isViewed = true;
    // this.companyOptions = [{ label: this.selectedRow.CName, value: this.selectedRow.CCode }];
    // this.commodityOptions = [{ label: this.selectedRow.ITDescription, value: this.selectedRow.Code }];
    // this.Pan = this.selectedRow.Pan;
    this.Tin = this.selectedRow.Tin;
    // this.RCode = this.selectedRow.RName;
    // this.Gst = this.selectedRow.Gst;
    this.Bill = this.selectedRow.Bill;
    this.Billdate = this.selectedRow.Billdate;
    // this.Commodity = this.selectedRow.Commodity;
    this.Quantity = this.selectedRow.Quantity;
    this.Rate = this.selectedRow.Rate;
    this.percentage = this.selectedRow.CompanyName;
    this.Vat = this.selectedRow.Vat;
    this.Total = this.selectedRow.Total;
  }

  // onCommodityClicked() {
  //   if (this.designationOptions !== undefined && this.designationOptions.length <= 1) {
  //     this.designationOptions = this.designationSelection;
  //   }
  // }

  onDateSelect() {
    this.checkValidDateSelection();
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

  onSubmit(formUser) {
    const params = {
      'Roleid': this.roleId,
      'Month': this.Month,
      'Year': this.Year,
      'TIN': this.Tin,
      'BillNo': this.Bill,
      'BillDate': this.Billdate,
      'CompanyName': "TVS", //this.CompanyName,
      'CommodityName': "TVS", //this.CompanyName,
      'Quantity': this.Quantity,
      'Rate': this.Rate,
      'Amount': this.Amount,
      'Percentage': this.percentage,
      'VatAmount': this.Vat,
      'Total': this.Total,
      'AccRegion': "CHENNAI",
      'CreatedBy': "CHENNAI",
      'CreatedDate': this.Billdate,
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
    // this.onClear();
  }
  onResetTable(item) {

  }
}