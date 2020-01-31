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
import { GolbalVariable } from 'src/app/common/globalvariable';
import { saveAs } from 'file-saver';
import * as _ from 'lodash';

@Component({
  selector: 'app-demand-draft',
  templateUrl: './demand-draft.component.html',
  styleUrls: ['./demand-draft.component.css']
})

export class DemandDraftComponent implements OnInit {

  DemandDraftCols: any;
  DemandDraftData: any = [];
  fromDate: any = new Date();
  toDate: any = new Date();
  godownOptions: SelectItem[];
  GCode: any;
  regionOptions: SelectItem[];
  RCode: any;
  FilterArray: any;
  roleId: any;
  regions: any;
  data: any;
  maxDate: Date;
  canShowMenu: boolean;
  isShowErr: boolean;
  loggedInRCode: any;
  username: any;
  items: any;
  loading: boolean = false;
  selectedValue: string = 'Bank';
  // DateByOrder = string;
  totalRecords: number;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private authService: AuthService, private restAPIService: RestAPIService, private roleBasedService: RoleBasedService,
    private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.DemandDraftCols = this.tableConstants.DoDemandDraft;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.regions = this.roleBasedService.getRegions();
    this.data = this.roleBasedService.getInstance();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.maxDate = new Date();
    this.username = JSON.parse(this.authService.getCredentials());
    this.items = [
      {
        label: 'View By Bank', command: () => {
          this.onView();
        }
      },
      {
        label: 'View By Date', command: () => {
          this.SortByDate();
        }
      }
    ];
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
              regionSelection.push({ 'label': x.RName, 'value': x.RCode });
            });
            this.regionOptions = regionSelection;
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
        if (type === 'enter') {
          this.godownPanel.overlayVisible = true;
        }
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode.value) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode, 'rcode': x.RCode, 'rname': x.RName });
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

  onView() {
    this.onResetTable('');
    this.checkValidDateSelection();
    this.loading = true;
    const params = {
      'FromDate': this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'),
      'ToDate': this.datePipe.transform(this.toDate, 'MM/dd/yyyy'),
      'GCode': this.GCode.value,
      'GName': this.GCode.label,
      'RCode': this.RCode.value,
      'RName': this.RCode.label,
      'UserName': this.username.user,
    };
    this.restAPIService.post(PathConstants.DEMAND_DRAFT_POST, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.DemandDraftData = res;
        this.FilterArray = res;
        this.loading = false;
        let sno = 0;
        let totalAmnt = 0;
        let cereal = 0;
        let nonCereal = 0;
        this.DemandDraftData.forEach(data => {
          data.Chequedate = this.datePipe.transform(data.Chequedate, 'dd-MM-yyyy');
          data.Dodate = this.datePipe.transform(data.Dodate, 'dd-MM-yyyy');
          sno += 1;
          data.SlNo = sno;
          totalAmnt += (data.PaymentAmount * 1);
          cereal += (data.Cereal * 1);
          nonCereal += (data.NonCereal * 1);
        });
        this.DemandDraftData.push({ Society: 'Total', PaymentAmount: totalAmnt, Cereal: cereal, NonCereal: nonCereal });
        if (this.selectedValue === 'DateByOrder') {
          this.SortByDate();
        }
        if (this.selectedValue === 'Bank') {
          this.SortByBank();
        }
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

  // get SortByDate() {
  //   return this.DemandDraftData.sort((a, b) => {
  //     return <any>new Date(b.Dodate) - <any>new Date(a.Dodate);
  //   });
  // }

  SortByDate() {
    let sortedArray = _.sortBy(this.DemandDraftData, 'Dodate');
    let sno = 0;
    sortedArray.forEach(s => {
      if (s.Society !== 'Total') {
        sno += 1;
        s.SlNo = sno;
      }
    });
    this.DemandDraftData = sortedArray;
    this.totalRecords = this.DemandDraftData.length;
  }

  SortByBank() {
    let sortedArray = _.sortBy(this.DemandDraftData, 'Bank');
    let sno = 0;
    sortedArray.forEach(s => {
      if (s.Society !== 'Total') {
        sno += 1;
        s.SlNo = sno;
      }
    });
    this.DemandDraftData = sortedArray;
  }

  onDateSelect() {
    this.checkValidDateSelection();
    this.onResetTable('');
  }

  checkValidDateSelection() {
    if (this.fromDate !== undefined && this.toDate !== undefined && this.fromDate !== '' && this.toDate !== '') {
      let selectedFromDate = this.fromDate.getDate();
      let selectedToDate = this.toDate.getDate();
      let selectedFromMonth = this.fromDate.getMonth();
      let selectedToMonth = this.toDate.getMonth();
      let selectedFromYear = this.fromDate.getFullYear();
      let selectedToYear = this.toDate.getFullYear();
      if ((selectedFromDate > selectedToDate && ((selectedFromMonth >= selectedToMonth && selectedFromYear >= selectedToYear) ||
        (selectedFromMonth === selectedToMonth && selectedFromYear === selectedToYear))) ||
        (selectedFromMonth > selectedToMonth && selectedFromYear === selectedToYear) || (selectedFromYear > selectedToYear)) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, life:5000,
        summary: StatusMessage.SUMMARY_INVALID, detail: StatusMessage.ValidDateErrorMessage });
        this.fromDate = this.toDate = '';
      }
      return this.fromDate, this.toDate;
    }
  }

  onResetTable(item) {
    if (item === 'reg') { this.GCode = null; }
    this.totalRecords = 0;
    this.DemandDraftData = [];
  }

  onPrint() {
    const path = "../../assets/Reports/" + this.username.user + "/";
    if (this.selectedValue === 'Bank') {
      const filename = this.GCode.value + GolbalVariable.DODemandDraftBankFileName + ".txt";
      saveAs(path + filename, filename);
    } else {
      const filename = this.GCode.value + GolbalVariable.DODemandDraftDateFileName + ".txt";
      saveAs(path + filename, filename);
    }
  }

  onClose() {
    this.messageService.clear('t-err');
  }
}