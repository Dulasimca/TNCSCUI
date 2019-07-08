import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';

@Component({
  selector: 'app-shop-wise-allotment',
  templateUrl: './shop-wise-allotment.component.html',
  styleUrls: ['./shop-wise-allotment.component.css']
})
export class ShopWiseAllotmentComponent implements OnInit {
  ShopWiseAllotmentData: any;
  ShopWiseAllotmentCols: any;data?:any;
  g_cd: any;
  isViewDisabled: boolean;
  isActionDisabled: boolean;
  canShowMenu: boolean;

  constructor(private tableConstants: TableConstants, private authService: AuthService,) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.ShopWiseAllotmentCols = this.tableConstants.ShopWiseAllotmentMaster;

  }

  onSelect(){}

  onCreate(){}

  onView(){}

  onResetTable(){}

  exportAsXLSX(){}
}

