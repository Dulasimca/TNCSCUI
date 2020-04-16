import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared-services/auth.service';
import { TableConstants } from '../constants/tableconstants';
import { RoleBasedService } from '../common/role-based.service';
import { DatePipe } from '@angular/common';
import { RestAPIService } from '../shared-services/restAPI.service';
import { MessageService } from 'primeng/api';
import { StatusMessage } from '../constants/Messages';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { PathConstants } from '../constants/path.constants';

@Component({
  selector: 'app-godown-incharge',
  templateUrl: './godown-incharge.component.html',
  styleUrls: ['./godown-incharge.component.css']
})
export class GodownInchargeComponent implements OnInit {
  canShowMenu: boolean;
  FromDate: any;
  maxDate: Date;
  ToDate: any;
  regionName: string;
  godownName: string;
  stockReceiptCols: any;
  stockReceiptData: any = []
  loading: boolean;
  GCode: string;
  RCode: string;
  roleId: any;
  ApprovalID: any;
  blockScreen: boolean;


  constructor(private authService: AuthService, private tableConstants: TableConstants,
    private roleBasedService: RoleBasedService, private restAPIService: RestAPIService,
    private datepipe: DatePipe, private messageService: MessageService) {
  }
  ngOnInit() {
    const maxDate = new Date(JSON.parse(this.authService.getServerDate()));
    this.maxDate = (maxDate !== null && maxDate !== undefined) ? maxDate : new Date();
    this.regionName = this.authService.getUserAccessible().rName;
    this.godownName = this.authService.getUserAccessible().gName;
    this.GCode = this.authService.getUserAccessible().gCode;
    this.RCode = this.authService.getUserAccessible().rCode;
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.FromDate = this.ToDate = this.maxDate;
    this.stockReceiptCols = this.tableConstants.DailyDocumentReceiptReport.slice(0);
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
  }

  onClose() {
    this.messageService.clear('t-err');
  }

  onView() {
    this.messageService.clear();
    const params = {
      'GodownCode': this.GCode,
      'RegionCode': this.RCode,
      'RoleId': this.roleId,
      'FromDate': this.datepipe.transform(this.FromDate, 'MM/dd/yyyy'),
      'ToDate': this.datepipe.transform(this.ToDate, 'MM/dd/yyyy'),
      'ITCode': 'All',
      'Type': 1
    };
    this.loading = true;
    this.restAPIService.post(PathConstants.DAILY_DOCUMENT_RECEIPT_POST, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.stockReceiptData = res;
        this.loading = false;
        let sno = 1;
        this.stockReceiptData.forEach(x => {
          x.SlNo = sno;
          sno += 1;
          x.SRDate = this.datepipe.transform(new Date(x.DocDate), 'MM/dd/yyyy');
        })
      } else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING,
          detail: StatusMessage.NoRecForCombination
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR,
          detail: StatusMessage.ErrorMessage
        });
      }
    });
  }

  onSelectedRow(data, index, type) {
    this.messageService.clear();
    this.blockScreen = true;
    const params = {
      'DocNo': data.DocNo,
      'DocDate': data.SRDate,
      'GCode': this.GCode,
      'RCode': this.RCode,
      'IssuerName': data.ReceivedFrom,
      'Flag': (type === 'A') ? 1 : 0,
      'ApprovalID': (this.ApprovalID !== null && this.ApprovalID !== undefined) ? this.ApprovalID : 0
    }
    this.restAPIService.post(PathConstants.GODOWN_APPROVAL_POST, params).subscribe(res => {
      if (res.Item1) {
        this.blockScreen = false;
        var msg = data.DocNo + ((type === 'A') ? '  Document is Approved successfully!' : '  Document is Rejected successfully!');
        var summary = (type === 'A') ? StatusMessage.SUMMARY_APPROVED : StatusMessage.SUMMARY_REJECTED;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS,
          summary: summary, detail: msg
        });
        } else {
        this.blockScreen = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      this.blockScreen = false;
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.NetworkErrorMessage
        });
      }
    });
  }

  onDateSelect(date) {
    this.checkValidDateSelection();
  }

  checkValidDateSelection() {
    if (this.FromDate !== undefined && this.ToDate !== undefined && this.FromDate !== '' && this.ToDate !== '') {
      let selectedFromDate = this.FromDate.getDate();
      let selectedToDate = this.ToDate.getDate();
      let selectedFromMonth = this.FromDate.getMonth();
      let selectedToMonth = this.ToDate.getMonth();
      let selectedFromYear = this.FromDate.getFullYear();
      let selectedToYear = this.ToDate.getFullYear();
      if ((selectedFromDate > selectedToDate && ((selectedFromMonth >= selectedToMonth && selectedFromYear >= selectedToYear) ||
        (selectedFromMonth === selectedToMonth && selectedFromYear === selectedToYear))) ||
        (selectedFromMonth > selectedToMonth && selectedFromYear === selectedToYear) || (selectedFromYear > selectedToYear)) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_INVALID, life: 5000, detail: StatusMessage.ValidDateErrorMessage
        });
        this.FromDate = this.ToDate = '';
      }
      return this.FromDate, this.ToDate;
    }
  }
}
