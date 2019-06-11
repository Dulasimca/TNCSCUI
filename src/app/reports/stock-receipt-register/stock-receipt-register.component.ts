import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';

@Component({
  selector: 'app-stock-receipt-register',
  templateUrl: './stock-receipt-register.component.html',
  styleUrls: ['./stock-receipt-register.component.css']
})
export class StockReceiptRegisterComponent implements OnInit {
  stockReceiptRegCols: any;
  stockReceiptRegData: any;

  constructor(private tableConstants: TableConstants, private restAPIService: RestAPIService) { }

  ngOnInit() {
    this.stockReceiptRegCols = this.tableConstants.StockReceiptRegisterReport;
  }

}
