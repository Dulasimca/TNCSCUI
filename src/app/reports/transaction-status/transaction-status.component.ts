import { Component, OnInit } from '@angular/core';
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
  // Docdate: any;
  godownName: SelectItem[];
  disableOkButton: boolean = true;
  Docdate: Date;
  userid: any;
  remarks: any;
  Receipt: boolean;
  Issues: boolean;
  Transfer: boolean;
  CB: boolean;
  Transaction_Status: any;
  maxDate: Date;
  loading: boolean;
  viewPane: boolean;
  selectedRow: any;
  viewDate: Date = new Date();
  godownOptions: SelectItem[];
  canShowMenu: boolean;

  constructor(private tableConstants: TableConstants, private messageService: MessageService, private restAPIService: RestAPIService, private datepipe: DatePipe, private roleBasedService: RoleBasedService, private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
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

  onRowSelect(event) {
    this.disableOkButton = false;
    this.selectedRow = event.Docdate;
  }

  showSelectedData() {
    this.viewPane = false;
    this.Docdate = this.selectedRow.DocdDate;
    this.Receipt = this.selectedRow.Receipt;
    this.Issues = this.selectedRow.Issues;
    this.Transfer = this.selectedRow.Transfer;
    this.CB = this.selectedRow.CB;
    this.remarks = this.selectedRow.remarks;
    this.userid = this.userid;
  }

  onView() {
    if (this.godownOptions !== undefined) {
      const params = new HttpParams().set('Docdate', this.datepipe.transform(this.Docdate, 'MM/dd/yyyy')).append('Gcode', this.g_cd.value);
      this.restAPIService.getByParameters(PathConstants.TRANSACTION_STATUS_GET, params).subscribe((res: any) => {
        this.TransactionStatusData = res;
        if (this.TransactionStatusData !== undefined) {
          this.Receipt = this.TransactionStatusData[0].Receipt,
            this.Issues = this.TransactionStatusData[0].Issues,
            this.Transfer = this.TransactionStatusData[0].Transfer,
            this.CB = this.TransactionStatusData[0].CB,
            this.remarks = this.TransactionStatusData[0].remarks,
            this.userid = this.TransactionStatusData[0].userid
        }
      });
    }
  }

  onClear() {
    this.Receipt = this.Issues = this.Transfer = this.CB = this.g_cd = this.Docdate = this.remarks = null;
  }

  onSave() {
    const params = {
      'Gcode': (this.gCode !== undefined) ? this.gCode : this.g_cd.value,
      'Docdate': this.datepipe.transform(this.Docdate, 'MM/dd/yyyy'),
      'Receipt': (this.Receipt !== undefined && this.Receipt !== null) ? true : false,
      'Issues': (this.Issues !== undefined && this.Issues !== null) ? true : false,
      'Transfer': (this.Transfer !== undefined && this.Transfer !== null) ? true : false,
      'CB': (this.CB !== undefined && this.CB !== null) ? true : false,
      'remarks': (this.remarks !== undefined && this.remarks !== null) ? this.remarks : 'No Remarks',
      'userid': this.userid.user,
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


