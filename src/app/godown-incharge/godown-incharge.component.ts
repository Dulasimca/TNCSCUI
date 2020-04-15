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
    this.stockReceiptCols = this.tableConstants.StockReceiptDocumentViewCols.slice(0);
  }

  onClose() {
    this.messageService.clear('t-err');
  }
  
  onView() {
    this.messageService.clear();
    this.stockReceiptCols.forEach((x, index) => {
      if(x.field === 'TNCSName') {
        this.stockReceiptCols.splice(index, 1);
      }
    })
    const params = new HttpParams().set('FDate', this.datepipe.transform(this.FromDate, 'MM/dd/yyyy'))
    .append('GCode', this.GCode).append('TDate', this.datepipe.transform(this.ToDate, 'MM/dd/yyyy'));
    this.restAPIService.getByParameters(PathConstants.STOCK_RECEIPT_VIEW_DOCUMENT, params).subscribe((res: any) => {
      if (res !== undefined && res !== null && res.length !== 0) {
        let sno = 1;
        res.forEach(data => {
          data.sno = sno;
          data.SRDate = this.datepipe.transform(data.SRDate, 'dd-MM-yyyy');
          sno += 1;
        });
        this.stockReceiptData = res;
      } else {
        this.stockReceiptData = [];
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.stockReceiptData = [];
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
  }

  onSelectedRow(data, index) {
    
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
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
        summary: StatusMessage.SUMMARY_INVALID, life:5000, detail: StatusMessage.ValidDateErrorMessage });
        this.FromDate = this.ToDate = '';
      }
      return this.FromDate, this.ToDate;
    }
  }



}
