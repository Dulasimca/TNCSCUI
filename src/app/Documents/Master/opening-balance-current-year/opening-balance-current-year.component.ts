import { Component, OnInit } from '@angular/core';
import { PathConstants } from 'src/app/constants/path.constants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-opening-balance-current-year',
  templateUrl: './opening-balance-current-year.component.html',
  styleUrls: ['./opening-balance-current-year.component.css']
})
export class OpeningBalanceCurrentYearComponent implements OnInit {
  OpeningBalanceDetailCols: any;
  OpeningBalanceDetailData: any;
  data: any;
  g_cd: any;
  c_cd: any;
  Year: any;
  yearOptions: SelectItem[];
  godownOptions: SelectItem[];
  commodityOptions: SelectItem[];
  isViewDisabled: boolean;
  isActionDisabled: boolean;
  canShowMenu: boolean;

  constructor( private authService: AuthService, private roleBasedService: RoleBasedService, private restAPIService: RestAPIService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.isViewDisabled = this.isActionDisabled = true;
    this.data = this.roleBasedService.getInstance();
  }

  onSelect(item) {
    let godownSelection = [];
    let commoditySelection = [];
    switch (item) {
      case 'gd':
    if (this.data.godownData !== undefined) {
      this.data.godownData.forEach(x => {
          godownSelection.push({ 'label': x.GName, 'value': x.GCode });
          this.godownOptions = godownSelection;
        });
      }
      break;
      case 'cd':
        if(this.commodityOptions === undefined){
        this.restAPIService.get(PathConstants.ITEM_MASTER).subscribe(data => {
          if (data !== undefined) {
            data.forEach(y => {
              commoditySelection.push({ 'label': y.ITDescription, 'value': y.ITCode });
              this.commodityOptions = commoditySelection;
            });
          }
        })
      }
      break;
      case 'y':
          let yearArr = [];
          const range = 3;
        const year = new Date().getFullYear();
        for (let i = 0; i < range; i++) {
          if (i === 0) {
            yearArr.push({ 'label': (year - 1).toString(), 'value': year - 1 });
          } else if (i === 1) {
            yearArr.push({ 'label': (year).toString(), 'value': year });
          } else {
            yearArr.push({ 'label': (year + 1).toString(), 'value': year + 1 });
          }
        }
        this.yearOptions = yearArr;
        this.yearOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        break;
    }
    if (this.Year !== undefined && this.g_cd.value !== '' && this.g_cd.value !== undefined && this.g_cd !== null && this.c_cd.value !== undefined && this.c_cd.value !== '' && this.c_cd !== null) {
      this.isViewDisabled = false;
    }
  }

}
