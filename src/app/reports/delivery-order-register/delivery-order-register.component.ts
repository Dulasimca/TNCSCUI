import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';

@Component({
  selector: 'app-delivery-order-register',
  templateUrl: './delivery-order-register.component.html',
  styleUrls: ['./delivery-order-register.component.css']
})
export class DeliveryOrderRegisterComponent implements OnInit {
  DeliveryReceiptRegCols: any;
  DeliveryReceiptRegData: any;

  constructor(private tableConstants: TableConstants, private restAPIService: RestAPIService) { }

  ngOnInit() {
    this.DeliveryReceiptRegCols = this.tableConstants.DeliveryMemoRegisterReport;
  }

}
