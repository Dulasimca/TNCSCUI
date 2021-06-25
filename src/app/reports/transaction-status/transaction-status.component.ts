import { Component, OnInit, ViewChild } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { SelectItem, MessageService } from 'primeng/api';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
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
  CBCols: any;
  CBData: any = [];
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;
  loading_cb: boolean;


  constructor(private tableConstants: TableConstants, private messageService: MessageService,
    private restAPIService: RestAPIService, private datepipe: DatePipe, private roleBasedService: RoleBasedService,
    private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance().gCode;
    this.gdata = this.roleBasedService.instance;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.userid = JSON.parse(this.authService.getCredentials());
    this.CBCols = this.tableConstants.CBAllColumns;
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
            summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordForTransactionStatus
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
    if (this.GCode !== null && this.GCode !== undefined && this.Docdate !== null && this.Docdate !== undefined) {
      if (this.GCode.RCode !== null && this.GCode.RCode !== undefined && this.GCode.value !== null &&
        this.GCode.value !== undefined) {
        this.loading = true;
        this.TransactionStatusTableData = [];
        this.CBData.length = 0;
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
        const params = new HttpParams().set('Date', this.datepipe.transform(this.Docdate, 'MM/dd/yyyy'))
          .append('GCode', this.GCode.value).append('RCode', this.GCode.RCode).append('RoleId', this.roleId);
        this.restAPIService.getByParameters(PathConstants.CB_STATEMENT_REPORT, params).subscribe((response: any) => {
          if (response !== undefined && response !== null && response.length !== 0) {
            response.forEach(x => {
              x.CEMENT_ALL = ((x.AMMA_CEMENT * 1) + (x.CEMENT_IMPORTED * 1) + (x.CEMENT_REGULAR * 1));
              x.SALT_ALL = ((x.AMMA_SALT_CIS * 1) + (x.AMMA_SALT_DFS * 1) + (x.AMMA_SALT_LSS * 1) +
                (x.AMMA_SALT_RFFIS * 1) + (x.SALT * 1) + (x.SALT_FF * 1));
              x.BOILED_RICE_A = (x.BOILED_RICE_A_HULLING * 1) + (x.BOILED_RICE_A * 1);
              x.BOILED_RICE_COMMON = (x.BOILED_RICE_C_HULLING * 1) + (x.BOILED_RICE_COMMON * 1);
              x.RAW_RICE_A = (x.RAW_RICE_A * 1) + (x.RAW_RICE_A_HULLING * 1);
              x.RAW_RICE_COMMON = (x.RAW_RICE_COMMON * 1) + (x.RAW_RICE_COM_HULLING * 1);
              x.RCode = this.GCode.RCode;
              x.GCode = this.GCode.value;
              x.StkDate = this.datepipe.transform(this.Docdate, 'MM/dd/yyyy');
            })
            this.CBData = response;
            this.loading_cb = false;
          } else {
            this.messageService.clear();
            this.messageService.add({
              key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
              summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoCBDataFound
            });
            this.loading_cb = false;
          }
        }, (err: HttpErrorResponse) => {
          if (err.status === 0 || err.status === 400) {
            this.loading_cb = false;
            this.messageService.clear();
            this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
          }
        })
      }
    }
  }

  onClear() {
    this.Receipt = this.Issues = this.Transfer = this.CB = this.GCode = this.Docdate =
      this.remarks = this.TransactionStatusTableData = null;
    this.loading = false;
    this.loading_cb = false;
    this.CBData.length = 0;
  }

  // onResetTable(item) {
  //   this.Receipt = false;
  //   this.Issues = false;
  //   this.Transfer = false;
  //   this.CB = false;
  //   this.remarks = '';
  //   if (item === 'date') { this.godownOptions = []; this.GCode = null; }
  // }

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
    this.onTransferCBToTnDaily();
  }

  onTransferCBToTnDaily() {
    this.restAPIService.post(PathConstants.CB_TO_TNDAILY_POST, this.CBData[0]).subscribe(res => {
      if (res) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS,
          summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.CBToTNDailyTransferSuccessMsg, life: 2800
        });
        this.onClear();
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
  }
}


