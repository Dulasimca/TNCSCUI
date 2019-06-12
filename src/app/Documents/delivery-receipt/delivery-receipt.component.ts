import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { SelectItem } from 'primeng/api';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';

@Component({
  selector: 'app-delivery-receipt',
  templateUrl: './delivery-receipt.component.html',
  styleUrls: ['./delivery-receipt.component.css']
})
export class DeliveryReceiptComponent implements OnInit {
  deliveryCols: any;
  deliveryData: any;
  itemCols: any;
  itemData: any;
  paymentCols: any;
  paymentData: any;
  paymentBalCols: any;
  paymentBalData: any;
  itemSchemeCols: any;
  itemSchemeData: any;
  deliveryOrderNo: number;
  deliveryDate: Date;
  transactionCdOptions: SelectItem[];
  transactionCd: string;
  indentNo: number;
  permitDate: Date;
  selectedItem: boolean;
  orderPeriodMonth: Date;
  orderPeriodYear: Date;
  regionName: any;
  issuingGodownName: any;
  receivorTypeOptions: SelectItem[];
  receivorType: string;
  partyNameOptions: SelectItem[];
  partyName: string;
  instructions: string;
  itemDescOptions: SelectItem[];
  itemDesc: string;
  schemeOptions: SelectItem[];
  scheme: string;
  netWeight: number;
  rateInTermsOptions: SelectItem[];
  rateInTerms: string;
  rate: number;
  total: number;
  marginSchemeOptions: SelectItem[];
  marginScheme: string;
  marginItemDescOptions: SelectItem[];
  marginItemDesc: string;
  marginNetWeight: number;
  marginRateInTermsOptions: SelectItem[];
  marginRateInTerms: string;
  marginRate: number;
  marginAmount: number;
  canShowMenu: boolean;
  constructor(private tableConstants: TableConstants,private restApiService: RestAPIService, private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.deliveryCols = this.tableConstants.DeliveryDocumentcolumns;
    this.itemCols = this.tableConstants.DeliveryItemColumns;
    this.paymentCols = this.tableConstants.DeliveryPaymentcolumns;
    this.paymentBalCols = this.tableConstants.DeliveryPaymentBalanceCols;
    this.itemSchemeCols  = this.tableConstants.DeliveryItemSchemeColumns;
  }
  onPayment() { }

  onEnter() { }

  onMarginCalculate() { }
}
