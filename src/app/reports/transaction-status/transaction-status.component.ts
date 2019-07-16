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
  SRDate: any;
  godownName: SelectItem[];
  disableOkButton: boolean =true;
  Docdate: any;
  Receipt: any;
  Issues: any;
  Transaction: any;
  CbStatement: any;
  Transaction_Status: any;
  maxDate: Date;
  viewPane: boolean;
  selectedRow: any;
  viewDate: Date = new Date();
  godownOptions: SelectItem[];
  canShowMenu: boolean;

  constructor(private tableConstants: TableConstants ,private messageService: MessageService, private restAPIService: RestAPIService ,private datepipe: DatePipe ,private roleBasedService: RoleBasedService , private authService : AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    this.TransactionStatusCols = this.tableConstants.TransactionStatus;
    this.maxDate = new Date();
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
    this.selectedRow = event.SRDate;
  }

  showSelectedData() {
    this.viewPane = false;
    this.SRDate = this.selectedRow.SRDate;
    this.Receipt = this.selectedRow.Receipt;
    this.Issues = this.selectedRow.Issues;
    this.Transaction = this.selectedRow.Transaction;
    this.CbStatement = this.selectedRow.CbStatement;
  }

  onView(){
    this.TransactionStatusData = [];
    this.viewPane = true;
    const params = new HttpParams().set('sValue', this.datepipe.transform(this.viewDate, 'MM/dd/yyyy')).append('GCode', (this.gCode !== undefined) ? this.gCode: this.g_cd.value);
    this.restAPIService.getByParameters(PathConstants.STACK_OPENING_ENTRY_REPORT_GET, params).subscribe((res: any) => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.viewPane = true;
        this.TransactionStatusCols = this.tableConstants.StackCardOpeningEntryReport;
        this.TransactionStatusData = res;
        this.TransactionStatusData.forEach(x => x.GodownName = (this.godownName !== undefined) ? this.godownName : this.g_cd.label);
        this.SRDate = this.datepipe.transform(this.SRDate, 'dd-MM-yyyy');
        this.Transaction_Status = this.TransactionStatusData.slice(0);
      } else {
        this.viewPane = false;
        this.messageService.add({ key: 't-warn', severity: 'warn', summary: 'Warn Message', detail: 'Record Not Found!' });
      }
    })
  }

  onClear() {
    this.Receipt = this.Issues = this.Transaction = this.CbStatement =
      this.g_cd = this.SRDate = null;
  }

  onSave(){
    const params = {
      'GodownCode': (this.gCode !== undefined) ? this.gCode : this.g_cd.value,
      'SRDate': this.datepipe.transform(this.SRDate, 'MM/dd/yyyy'),
      'Receipt': this.Receipt,
      'Issues': this.Issues,
      'Transaction': this.Transaction,
      'CbStatement': this.CbStatement
    };
    this.restAPIService.post(PathConstants.STACK_OPENING_ENTRY_REPORT_POST, params).subscribe(res => {
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

  
