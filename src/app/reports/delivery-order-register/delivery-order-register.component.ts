import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';

@Component({
  selector: 'app-delivery-order-register',
  templateUrl: './delivery-order-register.component.html',
  styleUrls: ['./delivery-order-register.component.css']
})
export class DeliveryOrderRegisterComponent implements OnInit {
  DeliveryReceiptRegCols: any;
  DeliveryReceiptRegData: any;
  canShowMenu: boolean;

  constructor(private tableConstants: TableConstants, private restAPIService: RestAPIService, private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.DeliveryReceiptRegCols = this.tableConstants.DeliveryMemoRegisterReport;
  }

}
