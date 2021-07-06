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
  selector: 'app-lorry-master',
  templateUrl: './lorry-master.component.html',
  styleUrls: ['./lorry-master.component.css']
})
export class LorryMasterComponent implements OnInit {
  LorryReportCols: any;
  LorryReportData: any = [];
  response: any;
  fromDate: any = new Date();
  toDate: any = new Date();
  transferOptions: SelectItem[];
  transferOption = [];
  TrCode: any;
  regions: any;
  roleId: any;
  data: any;
  transferData: any;
  maxDate: Date;
  canShowMenu: boolean;
  dateView: boolean = false;
  loading: boolean = false;
  loggedInRCode: string;
  totalRecords: number;
  username: any;
  LNo: any;
  @ViewChild('transaction', { static: false }) transactionPanel: Dropdown;


  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private authService: AuthService, private restAPIService: RestAPIService, private roleBasedService: RoleBasedService,
    private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.LorryReportCols = this.tableConstants.LorryReport;
    this.regions = this.roleBasedService.getRegions();
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.data = this.roleBasedService.getInstance();
    this.maxDate = new Date();
    this.username = JSON.parse(this.authService.getCredentials());
  }

  onSelect(item, type) {
    let transactionSelection = [];
    switch (item) {
      case 'transaction':
        if (type === 'enter') {
          this.transactionPanel.overlayVisible = true;
        }
        if (this.transferOptions === undefined) {
          transactionSelection.push({ label: 'Receipt', value: 'R' }, { label: 'Issue', value: 'I' }, { label: 'Transfer', value: 'T' });
        }
        this.transferOption = transactionSelection;
    }
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
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR, life: 5000
          , summary: StatusMessage.SUMMARY_INVALID, detail: StatusMessage.ValidDateErrorMessage
        });
        this.fromDate = this.toDate = '';
      }
      return this.fromDate, this.toDate;
    }
  }

  onDateSelect() {
    this.checkValidDateSelection();
    this.onResetTable('');
  }

  onView() {
    this.onResetTable('');
    this.checkValidDateSelection();
    // if (this.LNo === undefined) {
    //   // let startdate = this.maxDate;
    //   // this.fromDate.setDate(startdate.getDate() - 7);
    //   this.fromDate = this.toDate;
    // }
    this.loading = true;
    const params = {
      'LorryNo': this.LNo || 'L',
      'Fdate': this.datePipe.transform(this.fromDate, 'MM-dd-yyyy'),
      'ToDate': (this.LNo === undefined) ? this.datePipe.transform(this.fromDate, 'MM-dd-yyyy') : this.datePipe.transform(this.toDate, 'MM-dd-yyyy'),
      'DType': this.TrCode.value,
    };
    this.restAPIService.post(PathConstants.LORRY_DETAIL_POST, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.loading = false;
        this.LorryReportData = res;
        let sno = 0;
        this.LorryReportData.forEach(data => {
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
    if (item === 'Ttype') {
      this.LorryReportData = [];
    } else if (item === 'LorryN') {
      if (this.LNo.length <= 8) {
        this.LorryReportData = [];
        this.dateView = false;
      } else if (this.LNo !== undefined) {
        this.dateView = true;
      }
    }
  }

  onClose() {
    this.messageService.clear('t-err');
  }
}