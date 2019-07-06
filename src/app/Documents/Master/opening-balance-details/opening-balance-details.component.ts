import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';

@Component({
  selector: 'app-opening-balance-details',
  templateUrl: './opening-balance-details.component.html',
  styleUrls: ['./opening-balance-details.component.css']
})
export class OpeningBalanceDetailsComponent implements OnInit {
  OpeningBalanceDetailCols: any;
  OpeningBalanceDetailData: any;
  canShowMenu: boolean;

  constructor( private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
  }

}
