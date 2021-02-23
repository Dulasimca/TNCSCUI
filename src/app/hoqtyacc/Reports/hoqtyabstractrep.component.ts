import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { Dropdown } from 'primeng/primeng';
import * as _ from 'lodash';

@Component({
  selector: 'app-hoqtyabstractrep',
  templateUrl: './hoqtyabstractrep.component.html',
  styleUrls: ['./hoqtyabstractrep.component.css']
})
export class HoqtyabstractrepComponent implements OnInit {
  
  hoqtyacabstractData: any = [];
  hoqtyacabstractCols: any;
  fromDate: any = new Date();
  data: any;
  regions: any;
  RCode: any;
  GCode: any;
  qtymonth: any;
  qtyyear: any;
  ITCode: any;
  Trcode: any;
  regionOptions: SelectItem[];
  godownOptions: SelectItem[];
  commodityOptions: SelectItem[];
  transactionOptions: SelectItem[];
  truckName: string;
  canShowMenu: boolean;
  maxDate: Date;
  yearRange: string;
  loading: boolean;
  roleId: any;
  username: any;
  formUser = [];
  loggedInRCode: any;
  RowId: any;
 
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;
  @ViewChild('commodity', { static: false }) commodityPanel: Dropdown;
  @ViewChild('transaction', { static: false }) transactionPanel: Dropdown;


  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private messageService: MessageService, private authService: AuthService, private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.data = this.roleBasedService.getInstance();
    this.regions = this.roleBasedService.getRegions();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.maxDate = new Date();
    this.yearRange = (this.maxDate.getFullYear() - 1) + ':' + this.maxDate.getFullYear();    
    this.username = JSON.parse(this.authService.getCredentials());
  
    this.RowId = 0;
 
    this.hoqtyacabstractCols = this.tableConstants.hoqtyacabstractColumns;

  }

  onSelect(item, type) {
    let regionSelection = [];
    let godownSelection = [];
    let transactoinSelection = [];
    let commoditySelection = [];
    switch (item) {
      case 'reg':
        this.regions = this.roleBasedService.regionsData;
        if (type === 'enter') {
          this.regionPanel.overlayVisible = true;
        }
        if (this.roleId === 1) {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              regionSelection.push({ 'label': x.RName, 'value': x.RCode });
            });
            this.regionOptions = regionSelection;
            this.regionOptions.unshift({ label: 'All', value: 'All' });
          }
        } else {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              if (x.RCode === this.loggedInRCode) {
                regionSelection.push({ 'label': x.RName, 'value': x.RCode });
              }
            });
            this.regionOptions = regionSelection;
          }
        }
        break;
      case 'gd':
        if (type === 'enter') { this.godownPanel.overlayVisible = true; }
        this.data = this.roleBasedService.instance;
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            }
          });
          this.godownOptions = godownSelection;
          if (this.roleId !== 3) {
            this.godownOptions.unshift({ label: 'All', value: 'All' });
          }
        } else {
          this.godownOptions = godownSelection;
        }
        break;
      case 'tr':
          if (type === 'tab') {
            this.transactionPanel.overlayVisible = true;
          }
          this.transactionOptions = [ { label: 'All', value: 'All' },{ label: 'SCM', value: 'SCM' },{ label:'NON-SCM', value: 'NON-SCM' },           
          { label: 'DPC', value: 'DPC' }, { label:'CRS', value: 'CRS' },{ label: 'CS', value: 'CS' }];
        break;
      case 'cd':
        if (type === 'enter') { this.commodityPanel.overlayVisible = true; }
        if (this.commodityOptions === undefined) {
          this.restAPIService.get(PathConstants.ITEM_MASTER).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                commoditySelection.push({ 'label': y.ITDescription, 'value': y.ITCode });
                this.commodityOptions = commoditySelection;
              });
              this.commodityOptions.unshift({ label: 'All', value: 'All' });
            }
          })
        }
        break;
    }
  }

  onView() {
    this.loading = true;
    this.hoqtyacabstractData = [];
    this.loading = true;
    const params = {
      // 'RoleId': this.roleId,
      'qtyMonth': this.datePipe.transform(this.fromDate, 'MM'),
      'qtyYear': this.datePipe.transform(this.fromDate, 'yyyy'),
      'RCode': this.RCode,
      'ITCode': this.ITCode.value,
      'Trcode': this.Trcode.value,
     
    };
    this.restAPIService.getByParameters(PathConstants.HO_QTY_ABSRTACTREP_GET, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {  
        this.loading = false;  
        this.hoqtyacabstractData = res;        
        let sno = 0;        
        this.hoqtyacabstractData.forEach(s => {     
          sno += 1;
          s.SlNo = sno;
        });     
      } else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
  }

  onDateSelect() {
    this.checkValidDateSelection();
   this.onResetTable('');
  }

   checkValidDateSelection() {
    if (this.fromDate !== undefined &&  this.fromDate !== '' ) {         
      
      let selectedFromYear = this.fromDate.getFullYear();
      let todaydate =   new Date();
      let curyear = todaydate.getFullYear();
     
     
      if ((selectedFromYear > curyear)) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, 
        summary: StatusMessage.SUMMARY_INVALID, 
        life:5000, detail: StatusMessage.ValidDateErrorMessage });
        
      }
      return this.fromDate
    }
  }  
 
  onResetTable(item) {    
    this.loading = false;
  }
  onClose() {
    this.messageService.clear('t-err');
  }
 
}
