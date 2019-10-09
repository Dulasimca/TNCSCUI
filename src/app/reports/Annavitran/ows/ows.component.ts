import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Dropdown, MessageService } from 'primeng/primeng';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { PathConstants } from 'src/app/constants/path.constants';

@Component({
  selector: 'app-ows',
  templateUrl: './ows.component.html',
  styleUrls: ['./ows.component.css']
})
export class OWSComponent implements OnInit {
  OWSData: any;
  OWSCols: any;
  fromDate: any = new Date();
  toDate: any = new Date();
  GCode: any;
  RCode: any;
  GName: any;
  RName: any;
  sch_cd: any;
  regionsData: any;
  godownOptions: SelectItem[];
  regionOptions: SelectItem[];
  schemeOptions: SelectItem[];
  data: any;
  roleId: any;
  maxDate: Date;
  canShowMenu: boolean;
  loading: boolean;
  username: any;
  loggedInRCode: string;
  @ViewChild('godown') godownPanel: Dropdown;
  @ViewChild('region') regionPanel: Dropdown;
  @ViewChild('scheme') schemePanel: Dropdown;


  constructor(private tableConstants: TableConstants, private datePipe: DatePipe, private messageService: MessageService,
    private authService: AuthService, private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    this.regionsData = this.roleBasedService.getRegions();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.OWSCols = this.tableConstants.OWSReport;
    this.maxDate = new Date();
    this.username = JSON.parse(this.authService.getCredentials());
    this.GName = this.authService.getUserAccessible().gName;
    this.RName = this.authService.getUserAccessible().rName;
  }

  onSelect(item, type) {
    let godownSelection = [];
    let regionSelection = [];
    let schemeSelection = [];
    switch (item) {
      case 'reg':
        this.regionsData = this.roleBasedService.regionsData;
        if (type === 'enter') {
          this.regionPanel.overlayVisible = true;
        }
        if (this.roleId === 1) {
          if (this.regionsData !== undefined) {
            this.regionsData.forEach(x => {
              regionSelection.push({ 'label': x.RName, 'value': x.RCode });
            });
            this.regionOptions = regionSelection;
          }
        } else {
          if (this.regionsData !== undefined) {
            this.regionsData.forEach(x => {
              if (x.RCode === this.loggedInRCode) {
                regionSelection.push({ 'label': x.RName, 'value': x.RCode });
              }
            });
            this.regionOptions = regionSelection;
          }
        }
        break;
      case 'godown':
        if (type === 'enter') {
          this.godownPanel.overlayVisible = true;
        }
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode, 'rcode': x.RCode, 'rname': x.RName });
            }
          });
          this.godownOptions = godownSelection;
          if (this.roleId !== 3) {
            this.godownOptions.unshift({ label: 'All', value: 'All' });
          }
        }
        break;
      case 'Sch':
        if (type === 'enter') {
          this.schemePanel.overlayVisible = true;
        }
        if (this.schemeOptions === undefined) {
          this.restAPIService.get(PathConstants.SCHEMES).subscribe(data => {
            data.forEach(y => {
              schemeSelection.push({ 'label': y.Name, 'value': y.SCCode });
            });
            this.schemeOptions = schemeSelection;
          });
        }
        break;
    }
  }

  onView() {

  }
  onResetTable(item)
  {

  }
  onDateSelect(item)
  {

  }
}
