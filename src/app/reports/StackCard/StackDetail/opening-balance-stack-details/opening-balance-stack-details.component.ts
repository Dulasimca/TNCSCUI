import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { Dropdown } from 'primeng/primeng';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-opening-balance-stack-details',
  templateUrl: './opening-balance-stack-details.component.html',
  styleUrls: ['./opening-balance-stack-details.component.css']
})
export class OpeningBalanceStackDetailsComponent implements OnInit {
  OBStackCols: any;
  OBStackData: any = [];
  pristineData: any = [];
  GCode: any;
  RCode: any;
  GName: any;
  RName: any;
  CurrentYear: any;
  regionsData: any;
  godownOptions: SelectItem[];
  regionOptions: SelectItem[];
  yearOptions: SelectItem[];
  data: any;
  roleId: any;
  maxDate: Date;
  canShowMenu: boolean;
  loading: boolean;
  username: any;
  loggedInRCode: string;
  @ViewChild('godown') godownPanel: Dropdown;
  @ViewChild('region') regionPanel: Dropdown;
  @ViewChild('year') yearPanel: Dropdown;


  constructor(private tableConstants: TableConstants, private datePipe: DatePipe, private messageService: MessageService,
    private authService: AuthService, private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    this.regionsData = this.roleBasedService.getRegions();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.OBStackCols = this.tableConstants.OBStackDetails;
    this.maxDate = new Date();
    this.username = JSON.parse(this.authService.getCredentials());
    this.GName = this.authService.getUserAccessible().gName;
    this.RName = this.authService.getUserAccessible().rName;
  }

  onSelect(item, type) {
    let godownSelection = [];
    let regionSelection = [];
    let yearSelection = [];
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
      case 'y':
        if (type === 'enter') {
          this.yearPanel.overlayVisible = true;
        }
        if (this.yearOptions === undefined) {
          this.restAPIService.get(PathConstants.STACK_YEAR).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                yearSelection.push({ 'label': y.ShortYear });
              });
              this.yearOptions = yearSelection;
            }
          });
        }
        break;
    }
  }

  filterByStackDate(date) {
    let stackDate = this.datePipe.transform(date, 'dd-MM-yyyy');
    let sno = 1;
    let filterArray = this.pristineData.filter(x => {
      return x.StackDate === stackDate;
    })
    filterArray.forEach(i => { 
      i.SlNo = sno;
      sno += 1;
    })
    this.OBStackData = (filterArray.length !== 0 && filterArray !== undefined) ? filterArray : this.pristineData;
  }

  onView() {
    this.loading = true;
    const params = {
      'GCode': this.GCode,
      'GName': this.GName,
      'RName': this.RName,
      'UserName': this.username.user,
      'StackYear': this.CurrentYear.label,
      'Type': 1
    };
    this.restAPIService.post(PathConstants.STACK_OPENING_BALANCE_DETAIL_POST, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.loading = false;
        this.OBStackData = res;
        let sno = 0;
        this.OBStackData.forEach(data => {
          data.StackDate = this.datePipe.transform(data.StackDate, 'dd-MM-yyyy');
          // data.Quantity = (data.Quantity * 1).toFixed(3);
          sno += 1;
          data.SlNo = sno;
        });
        this.pristineData = this.OBStackData;
        // if (this.statusOptions !== undefined) {
        // }
      } else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }

  onResetTable(item) {
    if(item === 'reg') { this.GCode = null; }
    this.OBStackData = [];
   }

}
