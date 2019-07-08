import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';

@Component({
  selector: 'app-societ-master-entry',
  templateUrl: './societ-master-entry.component.html',
  styleUrls: ['./societ-master-entry.component.css']
})
export class SocietMasterEntryComponent implements OnInit {
  SocietyMasterEntryCols: any;
  SocietyMasterEntryData: any;
  data?:any;
  g_cd: any;
  isViewDisabled: boolean;
  isActionDisabled: boolean;
  canShowMenu: boolean;

  constructor(private tableConstants: TableConstants, private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.SocietyMasterEntryCols = this.tableConstants.SocietyMasterEntry;

  }

}
