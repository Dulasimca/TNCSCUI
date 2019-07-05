import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';

@Component({
  selector: 'app-depositor-customer-master',
  templateUrl: './depositor-customer-master.component.html',
  styleUrls: ['./depositor-customer-master.component.css']
})
export class DepositorCustomerMasterComponent implements OnInit {
  DepositorCols: any;
  DepositorData: any;
  g_cd: any;
  isViewDisabled: boolean;
  isActionDisabled: boolean;
  canShowMenu: boolean;

  constructor(private tableConstants: TableConstants, private authService: AuthService,) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.DepositorCols = this.tableConstants.DepositorMaster;

  }

  onSelect(){}

  onView(){}

  onResetTable(){}

  exportAsXLSX(){}
}
