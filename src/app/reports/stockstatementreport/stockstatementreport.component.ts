import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { SelectItem, MessageService } from 'primeng/api';
import { PathConstants } from 'src/app/constants/path.constants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { DatePipe } from '@angular/common';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-stockstatementreport',
  templateUrl: './stockstatementreport.component.html',
  styleUrls: ['./stockstatementreport.component.css']
})
export class StockstatementreportComponent implements OnInit {
  canShowMenu: boolean;
  stockDataColumns: any;
  stockData: any = [];
  godownOptions: SelectItem[];
  g_cd: any;
  maxDate: Date = new Date();
  loading: boolean;
  fromDate: any;
  toDate: any;
  username: any;
  rCode: any;
  data: any;
  items: any;

  constructor(private tableConstants: TableConstants, private restApiService: RestAPIService, private roleBasedService: RoleBasedService,
    private authService: AuthService, private datePipe: DatePipe,
    private excelService: ExcelService, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.stockDataColumns = this.tableConstants.StockStatementReport;
    this.data = this.roleBasedService.getInstance();
    this.username = JSON.parse(this.authService.getCredentials());
    this.items = [
      {
        label: 'Excel', icon: 'fa fa-table', command: () => {
          this.exportAsXLSX();
        }
      },
      {
        label: 'PDF', icon: "fa fa-file-pdf-o", command: () => {
          this.exportAsPDF();
        }
      }]
  }

  onSelect() {
    let options = [];
    this.data = this.roleBasedService.instance;
    if (this.data !== undefined) {
      this.data.forEach(x => {
        options.push({ 'label': x.GName, 'value': x.GCode, 'rcode': x.RCode });
        this.godownOptions = options;
      });
    }
  }

  onView() {
    this.checkValidDateSelection();
    this.rCode = this.data.rCode;
    this.loading = true;
    const params = {
      'FDate': this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'),
      'ToDate': this.datePipe.transform(this.toDate, 'MM/dd/yyyy'),
      'GCode': this.g_cd.value,
      'RCode': this.g_cd.rcode,
      'UserName': this.username.user
    }
    this.restApiService.post(PathConstants.STOCK_STATEMENT_REPORT, params).subscribe((res: any) => {
      if (res !== undefined && res.length !== 0) {
        this.stockData = res;
        let sno = 0;
        this.stockData.forEach(data => {
          sno += 1;
          data.SlNo = sno;
          data.ITDescription = data.ITDescription;
          data.OpeningBalance = (data.OpeningBalance * 1).toFixed(3);
          data.Receipt = (data.TotalReceipt * 1).toFixed(3);
          data.TotalReceipt = (((data.TotalReceipt * 1) + (data.OpeningBalance * 1)).toFixed(3));
          data.TotalIssue = ((data.IssueSales * 1) + (data.IssueOthers * 1)).toFixed(3);
          data.ClosingBalance = (data.ClosingBalance * 1).toFixed(3);
          data.CSBalance = (data.CSBalance * 1).toFixed(3);
          data.Shortage = (data.Shortage * 1).toFixed(3);
          data.PhycialBalance = (data.PhycialBalance * 1).toFixed(3);
          this.loading = false;
        });
      } else {
        this.loading = false;
        this.messageService.add({ key: 't-error', severity: 'warn', summary: 'Warn Message', detail: 'Record Not Found!' });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0) {
        this.loading = false;
        this.messageService.add({ key: 't-error', severity: 'error', summary: 'Error Message', detail: 'Please try again!' });
      }
    });
  }

  onDateSelect() {
    this.checkValidDateSelection();
    this.onResetTable();
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
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Invalid Date', detail: 'Please select a valid date range' });
        this.fromDate = this.toDate = '';
      }
      return this.fromDate, this.toDate;
    }
  }
  onResetTable() {
    this.stockData = [];
  }

  exportAsXLSX(): void {
    var StockStatementData = [];
    this.stockData.forEach(data => {
      StockStatementData.push({
        SlNo: data.SlNo, ITDescription: data.ITDescription,
        OpeningBalance: data.OpeningBalance, Receipt: data.Receipt,
        TotalReceipt: data.TotalReceipt, TotalIssue: data.TotalIssue,
        ClosingBalance: data.ClosingBalance, CSBalance: data.CSBalance,
        Shortage: data.Shortage, PhycialBalance: data.PhycialBalance
      });
    });
    this.excelService.exportAsExcelFile(StockStatementData, 'STOCK_STATEMENT_REPORT', this.stockDataColumns);
  }
  exportAsPDF() {
    var doc = new jsPDF('p', 'pt', 'a4');
    doc.text("Tamil Nadu Civil Supplies Corporation - Head Office", 100, 30);
    // var img ="assets\layout\images\dashboard\tncsc-logo.png";
    // doc.addImage(img, 'PNG', 150, 10, 40, 20);
    var col = this.stockDataColumns;
    var rows = [];
    this.stockData.forEach(element => {
      var temp = [element.SlNo, element.ITDescription, element.OpeningBalance, element.Receipt,
      element.TotalReceipt, element.TotalIssue, element.ClosingBalance, element.CSBalance,
      element.Shortage, element.PhycialBalance
      ];
      rows.push(temp);
    });
    doc.autoTable(col, rows);
    doc.save('STOCK_STATEMENT_REPORT.pdf');
  }
}
