import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { SelectItem } from 'primeng/api';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams } from '@angular/common/http';
import { RoleBasedService } from 'src/app/common/role-based.service';

@Component({
  selector: 'app-delivery-receipt',
  templateUrl: './delivery-receipt.component.html',
  styleUrls: ['./delivery-receipt.component.css']
})
export class DeliveryReceiptComponent implements OnInit {
  deliveryCols: any;
  deliveryData: any;
  index: number = 0;
  scheme_data: any[];
  itemCols: any;
  itemData: any;
  paymentCols: any;
  paymentData: any;
  paymentBalCols: any;
  paymentBalData: any;
  itemSchemeCols: any;
  itemSchemeData: any;
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
  DeliveryDate: Date = new Date();
  DeliveryOrderNo: any;
  Trcode: any;
  IndentNo: number;
  PermitDate: Date = new Date();
  PMonth: string;
  PYear: string;
  RCode: string;
  GCode: string;
  PName: any;
  RTCode: any;
  Instructions: string;
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
    private restAPIService: RestAPIService, private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.scheme_data = this.roleBasedService.getSchemeData();
    this.deliveryCols = this.tableConstants.DeliveryDocumentcolumns;
    this.itemCols = this.tableConstants.DeliveryItemColumns;
    this.paymentCols = this.tableConstants.DeliveryPaymentcolumns;
    this.paymentBalCols = this.tableConstants.DeliveryPaymentBalanceCols;
    this.itemSchemeCols  = this.tableConstants.DeliveryItemSchemeColumns;
     setTimeout(()=> {
      this.GodownName = this.roleBasedService.rgData[1].GName;
      this.RegionName = this.roleBasedService.rgData[0].RName;
      this.GCode = this.roleBasedService.gCode;
      this.RCode = this.roleBasedService.rCode;
     },300);
  }

  onSelect(selectedItem) {
    let transactoinSelection = [];
    let schemeSelection = [];
    let receivorTypeList = [];
    let partyNameList = [];
    let yearArr = [];
    const range = 3;
    switch(selectedItem) {
    case 'y':
      const year = new Date().getFullYear();
      for (let i = 0; i < range ; i ++) {
        if (i === 0) {
          yearArr.push({'label': (year - 1).toString(), 'value': year - 1});
        } else if (i === 1) {
          yearArr.push({'label': (year).toString(), 'value': year});
        } else {
          yearArr.push({'label': (year + 1).toString(), 'value': year + 1});
        }
      }
      this.yearOptions = yearArr;
      break;
      case 'm':
        this.monthOptions = [{'label': 'Jan', 'value': 1},
        {'label': 'Feb', 'value': 2},{'label': 'Mar', 'value': 3},{'label': 'Apr', 'value': 4},
        {'label': 'May', 'value': 5},{'label': 'Jun', 'value': 6},{'label': 'Jul', 'value': 7},
        {'label': 'Aug', 'value': 8},{'label': 'Sep', 'value': 9},{'label': 'Oct', 'value': 10},
        {'label': 'Nov', 'value': 11},{'label': 'Dec', 'value': 12}];
        break;
        case 'tr':
        if (this.transactionOptions === undefined) {
          this.restAPIService.get(PathConstants.TRANSACTION_MASTER).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                transactoinSelection.push({ 'label': y.TRName, 'value': y.TRCode });
                this.transactionOptions = transactoinSelection;
              });
              this.transactionOptions.unshift({ 'label': '-', 'value': '-' });
            }
          })
        }
        break;
        case 'sc':
            if (this.scheme_data !== undefined) {
              this.scheme_data.forEach(y => {
                schemeSelection.push({ 'label': y.SName, 'value': y.SCode });
                this.schemeOptions = schemeSelection;
              });
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
                  this.itemDescOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
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

  onEnter() { }

  onMarginCalculate() { }

  onPrint() { }

  onSave() { }
}
