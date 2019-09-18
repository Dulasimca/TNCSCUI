import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { MessageService } from 'primeng/api';
import { RoleBasedService } from 'src/app/common/role-based.service';

@Component({
  selector: 'app-cnc-correction',
  templateUrl: './cnc-correction.component.html',
  styleUrls: ['./cnc-correction.component.css']
})
export class CncCorrectionComponent implements OnInit {
  CncCorrectionCols: any;
  CncCorrectionData: any;
  canShowMenu: boolean;
  data: any;
  loading: boolean;

  constructor(private tableConstants: TableConstants, private roleBasedService: RoleBasedService, private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    this.CncCorrectionCols = this.tableConstants.CncCorrection;
  }

}