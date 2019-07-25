import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { SelectItem } from 'primeng/api';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams } from '@angular/common/http';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-delivery-receipt',
  templateUrl: './delivery-receipt.component.html',
  styleUrls: ['./delivery-receipt.component.css']
})
export class DeliveryReceiptComponent implements OnInit {
  data: any;
  deliveryCols: any;
  deliveryData: any = [];
  deliveryItemEntryData: any = [];
  index: number = 0;
  scheme_data: any[];
  itemCols: any;
  itemData: any = [];
  paymentCols: any;
  paymentData: any;
  paymentBalCols: any;
  paymentBalData: any;
  itemSchemeCols: any;
  itemSchemeData: any = [];
  itemSchemeEntryData: any = [];
  maxDate: Date = new Date();
  transactionOptions: SelectItem[];
  yearOptions: SelectItem[];
  receivorTypeOptions: SelectItem[];
  partyNameOptions: SelectItem[];
  monthOptions: SelectItem[];
  itemDescOptions: SelectItem[];
  schemeOptions: SelectItem[];
  rateInTermsOptions: SelectItem[];
  marginSchemeOptions: SelectItem[];
  marginRateInTermsOptions: SelectItem[];
  paymentOptions: Selection[];
  selectedItem: boolean;
  RegionName: any;
  GodownName: any;
  marginItemDescOptions: SelectItem[];
  canShowMenu: boolean;
  rowId: any;
  UnLoadingSlip: any;
  DeliveryDate: Date = new Date();
  DeliveryOrderNo: any;
  Trcode: any;
  IndentNo: number;
  OrderPeriod: any;
  PermitDate: Date = new Date();
  PMonth: any;
  PYear: any;
  RCode: string;
  GCode: string;
  PName: any;
  RTCode: any;
  Remarks: string;
  Scheme: any;
  MarginScheme: any;
  ICode: any;
  MICode: any;
  NKgs: any;
  Rate: any;
  RateTerm: any;
  TotalAmount: any;
  MarginNKgs: any;
  MarginRate: any;
  MarginAmount: any;
  MarginRateInTerms: any;
  GrandTotal: any;
  Payment: string;
  OcrNo: any;
  PDate: Date;
  PAmount: any;
  OnBank: any;
  PrevOrderNo: any;
  PrevAmount: any;
  OtherAmount: any;
  Balance: any;
  DueAmount: any;
  PaidAmount: any;
  BalanceAmount: any;
  MarginItem: string;


  constructor(private tableConstants: TableConstants, private roleBasedService: RoleBasedService,
    private restAPIService: RestAPIService, private authService: AuthService, private datepipe: DatePipe) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.scheme_data = this.roleBasedService.getSchemeData();
    this.data = this.roleBasedService.getInstance();
    this.deliveryCols = this.tableConstants.DeliveryDocumentcolumns;
    this.itemCols = this.tableConstants.DeliveryItemColumns;
    this.paymentCols = this.tableConstants.DeliveryPaymentcolumns;
    this.paymentBalCols = this.tableConstants.DeliveryPaymentBalanceCols;
    this.itemSchemeCols = this.tableConstants.DeliveryItemSchemeColumns;
    setTimeout(() => {
      this.GodownName = this.data[0].GName;
      this.RegionName = this.data[0].RName;
      this.GCode = this.data[0].GCode;
      this.RCode = this.data[0].RCode;
    }, 300);
  }

  onSelect(selectedItem) {
    let transactoinSelection = [];
    let schemeSelection = [];
    let receivorTypeList = [];
    let partyNameList = [];
    let yearArr = [];
    const range = 3;
    switch (selectedItem) {
      case 'y':
        const year = new Date().getFullYear();
        for (let i = 0; i < range; i++) {
          if (i === 0) {
            yearArr.push({ 'label': (year - 1).toString(), 'value': year - 1 });
          } else if (i === 1) {
            yearArr.push({ 'label': (year).toString(), 'value': year });
          } else {
            yearArr.push({ 'label': (year + 1).toString(), 'value': year + 1 });
          }
        }
        this.yearOptions = yearArr;
        this.yearOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        break;
      case 'm':
        this.monthOptions = [{ 'label': 'Jan', 'value': 1 },
        { 'label': 'Feb', 'value': 2 }, { 'label': 'Mar', 'value': 3 }, { 'label': 'Apr', 'value': 4 },
        { 'label': 'May', 'value': 5 }, { 'label': 'Jun', 'value': 6 }, { 'label': 'Jul', 'value': 7 },
        { 'label': 'Aug', 'value': 8 }, { 'label': 'Sep', 'value': 9 }, { 'label': 'Oct', 'value': 10 },
        { 'label': 'Nov', 'value': 11 }, { 'label': 'Dec', 'value': 12 }];
        this.monthOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        break;
      case 'tr':
        if (this.transactionOptions === undefined) {
          this.restAPIService.get(PathConstants.TRANSACTION_MASTER).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                transactoinSelection.push({ 'label': y.TRName, 'value': y.TRCode, 'transType': y.TransType });
                this.transactionOptions = transactoinSelection;
              });
              this.transactionOptions.unshift({ 'label': '-select', 'value': null });
            }
          })
        }
        break;
      case 'sc':
        if (this.scheme_data !== undefined) {
          this.scheme_data.forEach(y => {
            schemeSelection.push({ 'label': y.SName, 'value': y.SCode });
            this.schemeOptions = schemeSelection;
            this.marginSchemeOptions = schemeSelection;
          });
          this.marginSchemeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
          // this.schemeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        }
        break;
      case 'rt':
        if (this.Trcode !== null && this.Trcode.value !== undefined && this.Trcode.value !== '') {
          const params = new HttpParams().set('TRCode', this.Trcode.value).append('GCode', this.GCode);
          this.restAPIService.getByParameters(PathConstants.DEPOSITOR_TYPE_MASTER, params).subscribe((res: any) => {
            res.forEach(dt => {
              receivorTypeList.push({ 'label': dt.Tyname, 'value': dt.Tycode });
            });
            this.receivorTypeOptions = receivorTypeList;
            // this.isReceivorNameDisabled = false;
            this.receivorTypeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
          });
        }
        break;
      case 'pn':
        if (this.Trcode !== null && this.Trcode.value !== undefined && this.Trcode.value !== '' &&
          this.RTCode !== null && this.RTCode.value !== undefined && this.RTCode.value !== '') {
          const params = new HttpParams().set('TyCode', this.RTCode.value).append('TRType', this.Trcode.transType);
          this.restAPIService.getByParameters(PathConstants.DEPOSITOR_NAME_MASTER, params).subscribe((res: any) => {
            res.forEach(dn => {
              partyNameList.push({ 'label': dn.DepositorName, 'value': dn.DepositorCode });
            })
            this.partyNameOptions = partyNameList;
            this.partyNameOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
          });
        }
        break;
      case 'i_desc':
        let itemDesc = [];
        if (this.Scheme.value !== undefined && this.Scheme.value !== '' && this.Scheme !== null) {
          const params = new HttpParams().set('SCode', this.Scheme.value);
          this.restAPIService.getByParameters(PathConstants.COMMODITY_FOR_SCHEME, params).subscribe((res: any) => {
            res.forEach(i => {
              itemDesc.push({ 'label': i.ITDescription, 'value': i.ITCode });
            })
            this.itemDescOptions = itemDesc;
            this.marginItemDescOptions = itemDesc;
            this.itemDescOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
            // this.marginItemDescOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
          });
        }
        break;
        case 'wmt':
        let weighment = [];
        if (this.rateInTermsOptions === undefined || this.marginRateInTermsOptions === undefined) {
          this.restAPIService.get(PathConstants.PACKING_AND_WEIGHMENT).subscribe((res: any) => {
            res.Table1.forEach(w => {
              weighment.push({ 'label': w.WEType, 'value': w.WECode });
            })
            this.rateInTermsOptions = weighment;
            this.rateInTermsOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
            this.marginRateInTermsOptions = weighment;
            // this.marginRateInTermsOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
          });
        }
        break;
    }
  }

  openNext() {
    this.index = (this.index === 2) ? 0 : this.index + 1;
  }

  openPrev() {
    this.index = (this.index === 0) ? 2 : this.index - 1;
  }

  onPayment() { }

  onEnter(id) {
    switch (id) {
      case 'Item1':
        this.itemData.push({
          'itemDesc': this.ICode.label, 'netWeight': this.NKgs, 'unitMeasure': this.RateTerm.label,
          'scheme': this.Scheme.label, 'rate': this.Rate, 'total': this.TotalAmount
        });
        this.deliveryItemEntryData.push({
          'Itemcode': this.ICode.value, 'NetWeight': this.NKgs, 'Wtype': this.RateTerm.value,
          'Scheme': this.Scheme.value, 'Rate': this.Rate, 'Total': this.TotalAmount, 'RCode': this.RCode
        });
        if (this.itemData.length !== 0 && this.deliveryItemEntryData.length !== 0) {
          this.Scheme = this.ICode = this.NKgs = this.RateTerm = this.Rate = this.TotalAmount = null;
        }
        break;
      case 'Item2':
        this.itemSchemeData.push({
          'itemName': this.MICode.label, 'netWeight': this.MarginNKgs, 'rateInTerms': this.MarginRateInTerms.label,
          'schemeName': this.MarginScheme.label, 'marginRate': this.MarginRate, 'marginAmount': this.MarginAmount
        });
        this.itemSchemeEntryData.push({
          'ItemCode': this.MICode.label, 'MarginNkgs': this.MarginNKgs, 'rateInTerms': this.MarginRateInTerms.label,
          'SchemeCode': this.MarginScheme.label, 'MarginRate': this.MarginRate, 'MarginAmount': this.MarginAmount, 'RCode': this.RCode
        });
        if (this.itemSchemeData.length !== 0 && this.itemSchemeEntryData.length !== 0) {
          this.MarginScheme = this.MICode = this.MarginNKgs = this.MarginRateInTerms = this.MarginRate = this.MarginAmount = null;
        }
        break;
    }
  }

  calculateTotal() {
   if (this.NKgs !== undefined && this.Rate !== undefined) {
      this.TotalAmount = (this.NKgs * 1) + (this.Rate * 1);
    }
    if (this.MarginNKgs !== undefined && this.MarginRate !== undefined) {
      this.MarginAmount = (this.MarginNKgs * 1) + (this.MarginRate * 1);
    }
  }

  onPrint() { }

  onSave() {
    this.OrderPeriod = this.PMonth.value + '/' + this.PYear.label;
    const params = {
      'Dono': this.DeliveryOrderNo,
      'RowId': (this.rowId !== undefined) ? this.rowId : 0,
      'DoDate': this.datepipe.transform(this.DeliveryDate, 'MM/dd/yyyy'),
      'TransactionCode': this.Trcode.value,
      'IndentNo': this.IndentNo,
      'PermitDate': this.datepipe.transform(this.PermitDate, 'MM/dd/yyyy'),
      'OrderPeriod': this.OrderPeriod,
      'ReceivorCode': this.PName.value,
      'IssuerCode': this.GCode,
      'IssuerType': this.RTCode.value,
      'GrandTotal': this.GrandTotal,
      'Regioncode': this.RCode,
      'Remarks': this.Remarks,
      'deliverytype': '',
      'GodownName': this.GodownName,
      'TransactionName': this.Trcode.label,
      'RegionName': this.RegionName,
      'UnLoadingSlip': (this.DeliveryOrderNo === 0) ? 'N' : this.UnLoadingSlip
    };
   }
}
