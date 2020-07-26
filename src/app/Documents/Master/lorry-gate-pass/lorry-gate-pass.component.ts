import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { Dropdown } from 'primeng/primeng';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { StatusMessage } from 'src/app/constants/Messages';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-lorry-gate-pass',
  templateUrl: './lorry-gate-pass.component.html',
  styleUrls: ['./lorry-gate-pass.component.css']
})
export class LorryGatePassComponent implements OnInit {
  GatePassCols: any;
  GatePassData: any = [];
  response: any;
  fromDate: any = new Date();
  toDate: any = new Date();
  transferOptions: SelectItem[];
  godownOptions: SelectItem[];
  regionOptions: SelectItem[];
  transferOption = [];
  TrCode: any;
  GCode: any;
  RCode: any;
  regions: any;
  roleId: any;
  data: any;
  searchText: any;
  PristineData: any = [];
  transferData: any;
  maxDate: Date;
  canShowMenu: boolean;
  loading: boolean = false;
  loggedInRCode: string;
  totalRecords: number;
  username: any;
  LNo: any;
  @ViewChild('transaction', { static: false }) transactionPanel: Dropdown;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;


  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private authService: AuthService, private restAPIService: RestAPIService, private roleBasedService: RoleBasedService,
    private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.GatePassCols = this.tableConstants.GatePass;
    this.regions = this.roleBasedService.getRegions();
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.data = this.roleBasedService.getInstance();
    this.maxDate = new Date();
    this.username = JSON.parse(this.authService.getCredentials());
  }

  onSelect(item, type) {
    let regionSelection = [];
    let godownSelection = [];
    switch (item) {
      case 'reg':
        this.regions = this.roleBasedService.regionsData;
        if (type === 'enter') {
          this.regionPanel.overlayVisible = true;
        }
        if (this.roleId === 1) {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              regionSelection.push({ label: x.RName, value: x.RCode });
            });
            this.regionOptions = regionSelection;
            this.regionOptions.unshift({ label: 'All', value: 'All' });
          }
        } else {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              if (x.RCode === this.loggedInRCode) {
                regionSelection.push({ label: x.RName, value: x.RCode });
              }
            });
            this.regionOptions = regionSelection;
          }
        }
        break;
      case 'gd':
        if (type === 'enter') {
          this.godownPanel.overlayVisible = true;
        }
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode) {
              godownSelection.push({ label: x.GName, value: x.GCode, 'rcode': x.RCode, 'rname': x.RName });
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
    }
  }

  checkValidDateSelection() {
    if (this.toDate !== undefined && this.toDate !== '') {
      let selectedToDate = this.toDate.getDate();
      let selectedToMonth = this.toDate.getMonth();
      let selectedToYear = this.toDate.getFullYear();
      return this.toDate;
    }
  }

  onDateSelect() {
    this.checkValidDateSelection();
    this.onResetTable('');
  }

  onView() {
    this.onResetTable('');
    this.checkValidDateSelection();
    this.loading = true;
    const params = {
      'RCode': this.RCode,
      'GCode': this.GCode,
      'ToDate': this.datePipe.transform(this.toDate, 'MM-dd-yyyy'),
      'DType': 'G',
    };
    this.restAPIService.post(PathConstants.LORRY_DETAIL_POST, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.loading = false;
        this.GatePassData = res;
        this.PristineData = res;
        let sno = 0;
        this.GatePassData.forEach(data => {
          sno += 1;
          data.SlNo = sno;
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

  onResetTable(item) {
    if (item === 'reg') {
      this.GCode = null;
      this.GatePassData = [];
    }
  }

  onSearch(value) {
    this.GatePassData = this.PristineData;
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.GatePassData = this.PristineData.filter(item => {
        return item.LorryNo.toString().toUpperCase().startsWith(value);
      });
    } else {
      this.GatePassData = this.PristineData;
    }
  }

  onClose() {
    this.messageService.clear('t-err');
  }
}
