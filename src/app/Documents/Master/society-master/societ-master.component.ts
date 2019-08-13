import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { SelectItem } from 'primeng/api';
import { PathConstants } from 'src/app/constants/path.constants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-societ-master',
  templateUrl: './societ-master.component.html',
  styleUrls: ['./societ-master.component.css']
})
export class SocietMasterComponent implements OnInit {
  SocietyMasterCols: any;
  SocietyMasterData: any;
  data?: any;
  g_cd: any;
  t_cd: any;
  godownOptions: SelectItem[];
  typeOptions: SelectItem[];
  isViewDisabled: boolean;
  isActionDisabled: boolean;
  canShowMenu: boolean;

  constructor(private tableConstants: TableConstants, private authService: AuthService, private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.SocietyMasterCols = this.tableConstants.SocietyMaster;

  }

  onSelect(item) {
    let godownSelection = [];
    let typeSelection = [];
    switch (item) {
      case 'gd':
        this.data = this.roleBasedService.instance;
        if (this.data !== undefined) {
          this.data.forEach(x => {
            godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            this.godownOptions = godownSelection;
          });
        }
        break;
      case 'type':
        if (this.typeOptions === undefined) {
          const params = new HttpParams().set('GCode', this.g_cd.value);
          this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_GET, params).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                typeSelection.push({ 'label': y.SocietyType, 'value': y.SocietyName });
                this.typeOptions = typeSelection;
              });
            }
          })
        }
        break;
    }
  }


  onSave() { }

  New() { }

  onResetTable() { }

  exportAsXLSX() { }
}
