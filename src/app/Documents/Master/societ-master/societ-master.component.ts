import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { TableConstants } from 'src/app/constants/tableconstants';

@Component({
  selector: 'app-societ-master',
  templateUrl: './societ-master.component.html',
  styleUrls: ['./societ-master.component.css']
})
export class SocietMasterComponent implements OnInit {
  SocietyMasterCols: any;
  SocietyMasterData: any;
  data?:any;
  g_cd: any;
  isViewDisabled: boolean;
  isActionDisabled: boolean;
  canShowMenu: boolean;

  constructor(private tableConstants: TableConstants, private authService: AuthService,) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.SocietyMasterCols = this.tableConstants.SocietyMaster;

  }

  onSelect(){}

  onSave(){}

  New(){}

  onResetTable(){}

  exportAsXLSX(){}
}
