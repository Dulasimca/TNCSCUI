import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';

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
  constructor(private tableConstants: TableConstants) { }

  ngOnInit() {
    this.deliveryCols = this.tableConstants.DeliveryDocumentcolumns;
    this.itemCols = this.tableConstants.DeliveryItemColumns;
    this.paymentCols = this.tableConstants.DeliveryPaymentcolumns;
    this.paymentBalCols = this.tableConstants.DeliveryPaymentBalanceCols;
    this.itemSchemeCols  = this.tableConstants.DeliveryItemSchemeColumns;
  }

}
