import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { SelectItem } from 'primeng/api';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { PathConstants } from 'src/app/constants/path.constants';

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
  Trcode: string;
  IndentNo: number;
  PermitDate: Date = new Date();
  PMonth: string;
  PYear: string;
  RCode: string;
  GCode: string;
  PName: string;
  RTCode: string;
  Instructions: string;
  Scheme: string;
  MarginScheme: string;
  ICode: string;
  NKgs: any;
  Rate: any;
  RateTerm: string;
  TotalAmount: any;
  MarginNKgs: any;
  MarginRate: any;
  MarginAmount: any;
  MarginRateInTerms: string;
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


  constructor(private tableConstants: TableConstants,private restAPIService: RestAPIService, private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.deliveryCols = this.tableConstants.DeliveryDocumentcolumns;
    this.itemCols = this.tableConstants.DeliveryItemColumns;
    this.paymentCols = this.tableConstants.DeliveryPaymentcolumns;
    this.paymentBalCols = this.tableConstants.DeliveryPaymentBalanceCols;
    this.itemSchemeCols  = this.tableConstants.DeliveryItemSchemeColumns;
  }

  onSelect(selectedItem) {
    let transactoinSelection = [];
    let schemeSelection = [];
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
