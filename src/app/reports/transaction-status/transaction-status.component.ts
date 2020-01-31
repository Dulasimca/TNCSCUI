import { Component, OnInit, ViewChild } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { SelectItem, MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { Dropdown } from 'primeng/primeng';

@Component({
  selector: 'app-transaction-status',
  templateUrl: './transaction-status.component.html',
  styleUrls: ['./transaction-status.component.css']
})
export class TransactionStatusComponent implements OnInit {
  TransactionStatusCols: any;
  TransactionStatusData: any;
  TransactionStatusTableData: any;
  GCode: any;
  rCode: any;
  gCode: any;
  data: any;
  Type: 1;
  godownName: SelectItem[];
  disableOkButton: boolean = true;
  Docdate: Date;
  userid: any;
  remarks: any;
  Srno: any;
  Receipt: boolean;
  Issues: boolean;
  Transfer: boolean;
  CB: boolean;
  roleId: any;
  RoleId: any;
  Transaction_Status: any;
  maxDate: Date = new Date();
  loading: boolean;
  viewPane: boolean;
  selectedRow: any;
  gdata: any;
  godownOptions: SelectItem[];
  canShowMenu: boolean;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;


  constructor(private tableConstants: TableConstants, private messageService: MessageService,
    private restAPIService: RestAPIService, private datepipe: DatePipe, private roleBasedService: RoleBasedService,
    private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance().gCode;
    this.gdata = this.roleBasedService.instance;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.userid = JSON.parse(this.authService.getCredentials());
  }

  onSelect(selectedItem, type) {
    let godownSelection = [];
    switch (selectedItem) {
      case 'gd':
        if (type === 'enter') {
          this.godownPanel.overlayVisible = true;
        }
        this.gdata = this.roleBasedService.instance;
        if (this.gdata !== undefined) {
          this.gdata.forEach(x => {
            godownSelection.push({ 'label': x.GName, 'value': x.GCode, 'RCode': x.RCode });
          });
          this.godownOptions = godownSelection;
          // if (this.roleId !== 3) {
          //   this.godownOptions.unshift({ label: 'All', value: 'All' });
          // }
        }
        break;
    }
  }

  // For Checkbox
  onView() {
    this.TransactionStatusData = [];
    this.loading = true;
    if (this.godownOptions !== undefined) {
      const params = {
        'Docdate': this.datepipe.transform(this.Docdate, 'MM/dd/yyyy'),
        'Gcode': this.GCode.value,
        'RoleId': this.roleId,
        'Type': 1
      };
      this.restAPIService.post(PathConstants.TRANSACTION_STATUS_DETAILS_POST, params).subscribe((res: any) => {
        if (res !== undefined && res.length !== 0 && res !== null) {
          this.TransactionStatusData = res;
          this.loading = false;
          this.Srno = this.TransactionStatusData[0].Srno,
            this.Receipt = this.TransactionStatusData[0].Receipt,
            this.Issues = this.TransactionStatusData[0].Issues,
            this.Transfer = this.TransactionStatusData[0].Transfer,
            this.CB = this.TransactionStatusData[0].CB,
            this.remarks = this.TransactionStatusData[0].remarks
          this.RoleId = this.roleId
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
  }

  // For Grid
  onTable() {
    this.loading = true;
    this.TransactionStatusTableData = [];
    if (this.roleId === 2) {
      this.TransactionStatusCols = this.tableConstants.TransactionStatus;
      const params = {
        'Docdate': this.datepipe.transform(this.Docdate, 'MM-dd-yyyy'),
        'RCode': this.GCode.RCode,
        'RoleId': this.roleId,
        'Type': 2
      };
      this.restAPIService.post(PathConstants.TRANSACTION_STATUS_DETAILS_POST, params).subscribe((res: any) => {
        if (res !== undefined && res !== null && res.length !== 0 && this.godownOptions !== undefined) {
          this.TransactionStatusTableData = res;
          this.loading = false;
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
  }

  onClear() {
    this.Receipt = this.Issues = this.Transfer = this.CB = this.GCode = this.Docdate =
      this.remarks = this.TransactionStatusTableData = null;
    this.loading = false;
  }

  onResetTable(item) {
    this.Receipt = false;
    this.Issues = false;
    this.Transfer = false;
    this.CB = false;
    this.remarks = '';
    if (item === 'date') { this.godownOptions = []; this.GCode = null; }
  }

  showTrue(e: any) {
    if (this.Receipt == true && this.Issues == true && this.Transfer == true && this.CB == true) {
      this.Receipt = this.Issues = this.Transfer = this.CB = true
    } else {
      this.Receipt = this.Issues = this.Transfer = this.CB = false
    }
  }

  onSave() {
    const params = {
      'Gcode': (this.gCode !== undefined) ? this.gCode : this.GCode.value,
      'Docdate': this.datepipe.transform(this.Docdate, 'MM/dd/yyyy'),
      'Srno': this.Srno,
      'Receipt': (this.Receipt == true) ? true : false,
      'Issues': (this.Issues == true) ? true : false,
      'Transfer': (this.Transfer == true) ? true : false,
      'CB': (this.CB == true) ? true : false,
      'remarks': (this.remarks !== undefined && this.remarks !== null) ? this.remarks : 'No Remarks',
      'userid': this.userid.user,
      'RoleId': this.roleId
    };
    this.restAPIService.post(PathConstants.TRANSACTION_STATUS_POST, params).subscribe(res => {
      if (res) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS,
          summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.SuccessMessage
        });
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
    this.onClear();
  }
}


