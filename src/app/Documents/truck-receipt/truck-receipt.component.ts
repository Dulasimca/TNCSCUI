import { Component, OnInit } from '@angular/core';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';

@Component({
  selector: 'app-truck-receipt',
  templateUrl: './truck-receipt.component.html',
  styleUrls: ['./truck-receipt.component.css']
})
export class TruckReceiptComponent implements OnInit {
  canShowMenu: boolean;

  constructor(private restApiService: RestAPIService, private authService: AuthService,) { 
    this.canShowMenu = (this.authService.canShowMenu()) ? this.authService.canShowMenu() : false;

  }

  ngOnInit() {
  }

}
