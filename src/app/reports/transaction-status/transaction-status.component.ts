import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { SelectItem, MessageService } from 'primeng/api';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';

@Component({
  selector: 'app-transaction-status',
  templateUrl: './transaction-status.component.html',
  styleUrls: ['./transaction-status.component.css']
})
export class TransactionStatusComponent implements OnInit {
  TransactionStatusCols: any;
  TransactionStatusData: any;
  g_cd: any;
  gCode: any;
  data: any;
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
  Transaction_Status: any;
  isActionDisabled: any;
  maxDate: Date;
  loading: boolean;
  viewPane: boolean;
  selectedRow: any;
  godownOptions: SelectItem[];
  canShowMenu: boolean;

  constructor(private tableConstants: TableConstants, private cd: ChangeDetectorRef, private messageService: MessageService, private restAPIService: RestAPIService, private datepipe: DatePipe, private roleBasedService: RoleBasedService, private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    this.isActionDisabled = true;
    this.TransactionStatusCols = this.tableConstants.TransactionStatus;
    this.maxDate = new Date();
    this.userid = JSON.parse(this.authService.getCredentials());
  }

  onSelect() {
    let options = [];
    this.data = this.roleBasedService.instance;
    if (this.data !== undefined) {
      this.data.forEach(x => {
        options.push({ 'label': x.GName, 'value': x.GCode });
        this.godownOptions = options;
      });
    }
  }

  onView() {
    if (this.godownOptions !== undefined) {
      const params = new HttpParams().set('Docdate', this.datepipe.transform(this.Docdate, 'MM/dd/yyyy')).append('Gcode', (this.g_cd.value !== null && this.g_cd.value !== undefined) ? this.g_cd.value : this.gCode);
      this.restAPIService.getByParameters(PathConstants.TRANSACTION_STATUS_GET, params).subscribe((res: any) => {
        this.TransactionStatusData = res;
        if (this.TransactionStatusData !== undefined && this.TransactionStatusData !== 0) {
            this.isActionDisabled = false;
            this.Srno = this.TransactionStatusData[0].Srno,
            this.Receipt = this.TransactionStatusData[0].Receipt,
            this.Issues = this.TransactionStatusData[0].Issues,
            this.Transfer = this.TransactionStatusData[0].Transfer,
            this.CB = this.TransactionStatusData[0].CB,
            this.remarks = this.TransactionStatusData[0].remarks
        } else {
          this.messageService.add({ key: 't-date', severity: 'warn', summary: 'Warning!', detail: 'No record for this combination' });
        }
      }, (err: HttpErrorResponse) => {
        if (err.status === 0) {
          this.loading = false;
        }
      })
    }
  }

  onClear() {
    this.Receipt = this.Issues = this.Transfer = this.CB = this.g_cd = this.Docdate = this.remarks = null;
  }

  onResetTable() {
    this.Receipt = false;
    this.Issues = false;
    this.Transfer = false;
    this.CB = false;
    this.remarks = '';
    this.isActionDisabled = true;
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
      'Gcode': (this.gCode !== undefined) ? this.gCode : this.g_cd.value,
      'Docdate': this.datepipe.transform(this.Docdate, 'MM/dd/yyyy'),
      'Srno': this.Srno,
      'Receipt': (this.Receipt == true) ? true : false,
      'Issues': (this.Issues == true) ? true : false,
      'Transfer': (this.Transfer == true) ? true : false,
      'CB': (this.CB == true) ? true : false,
      'remarks': (this.remarks !== undefined && this.remarks !== null) ? this.remarks : 'No Remarks',
      'userid': this.userid.user
    };
    this.restAPIService.post(PathConstants.TRANSACTION_STATUS_POST, params).subscribe(res => {
      if (res) {
        this.messageService.add({ key: 't-success', severity: 'success', summary: 'Success Message', detail: 'Saved Successfully!' });
      } else {
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message', detail: 'Please try again!' });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0) {
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message', detail: 'Please try again!' });
      }
    })
    this.onClear();
  }
}


