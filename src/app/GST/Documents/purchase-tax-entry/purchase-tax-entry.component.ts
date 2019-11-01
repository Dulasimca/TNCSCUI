import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { Dropdown } from 'primeng/primeng';
import { AuthService } from 'src/app/shared-services/auth.service';
import { FormBuilder, FormControl, NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { StatusMessage } from 'src/app/constants/Messages';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpErrorResponse } from '@angular/common/http';

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
  YearOptions: SelectItem[];
  companyOptions: SelectItem[];
  commodityOptions: SelectItem[];
  regions: any;
  RCode: any;
  formUser = [];
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
  @ViewChild('region') regionPanel: Dropdown;
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
    this.userdata = this.fb.group({
      'PanNo': new FormControl(''),
      'Partyname': new FormControl(''),
      'Favour': new FormControl(''),
      'GST': new FormControl(''),
      'Amount': new FormControl(''),
      'Bank': new FormControl(''),
      'Branch': new FormControl(''),
      'IFSC': new FormControl(''),
      // 'telno': new FormControl('', Validators.compose([Validators.required, Validators.minLength(11)])),
      // 'mobno': new FormControl('', Validators.compose([Validators.required, Validators.minLength(10)])),
      // 'faxno': new FormControl('', Validators.compose([Validators.required]))
    });
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

  onSelect() {

  }

  onView() {
    if (this.formUser !== undefined) {
      this.PurchaseTaxData = this.formUser;
      this.PurchaseTaxCols = this.tableConstant.PurchaseTaxEntry;
    }
  }

  onClear() {
    this.form.controls.Pan.reset();
    this.form.controls.Tin.reset();
    this.form.controls.Company.reset();
    this.form.controls.Gst.reset();
    this.form.controls.Flag.reset();
    this.form.controls.Bill.reset();
    this.form.controls.Billdate.reset();
    this.form.controls.Quantity.reset();
    this.form.controls.Rate.reset();
    this.form.controls.Amount.reset();
    this.form.controls.Vat.reset();
    this.form.controls.percentage.reset();
    this.form.controls.Total.reset();
    this.form.controls.Commodity.reset();

    // this.CategoryId = null;
    //this.form.form.markAsUntouched();
    // this.form.form.markAsPristine();
    this.isEdited = false;
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

  onRowSelect(event) {
    this.viewPane = true;
    this.isEdited = true;
    this.disableOkButton = false;
    this.selectedRow = event.data;
  }

  showSelectedData() {
    this.viewPane = false;
    this.isViewed = true;
    this.companyOptions = [{ label: this.selectedRow.CName, value: this.selectedRow.CCode }];
    this.commodityOptions = [{ label: this.selectedRow.ITDescription, value: this.selectedRow.Code }];
    this.Pan = this.selectedRow.Pan;
    this.Tin = this.selectedRow.Tin;
    this.RCode = this.selectedRow.RName;
    this.Gst = this.selectedRow.Gst;
    this.Bill = this.selectedRow.Bill;
    this.Billdate = this.selectedRow.Billdate;
    this.Commodity = this.selectedRow.Commodity;
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
      'Pan': this.Pan,
      'Tin': this.Tin,
      'RCode': this.regions.value,
      'GST': this.Gst,
      'Bill': this.Bill,
      'Billdate': this.Billdate,
      'CompanyName': this.CompanyName,
      'Quantity': this.Quantity,
      'percentage': this.percentage,
      'Vat': this.Vat,
      'Total': this.Total,
    };
    this.restApiService.post(PathConstants.EMPLOYEE_MASTER_POST, params).subscribe(value => {
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

  }
}