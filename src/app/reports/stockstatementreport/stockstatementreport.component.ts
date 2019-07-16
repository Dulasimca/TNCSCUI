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

@Component({
  selector: 'app-stockstatementreport',
  templateUrl: './stockstatementreport.component.html',
  styleUrls: ['./stockstatementreport.component.css']
})
export class StockstatementreportComponent implements OnInit {
  canShowMenu: boolean;
  stockDataColumns: any;
  stockData: any;
  godownOptions: SelectItem[];
  g_cd: any;
  maxDate: Date = new Date();
  loading: boolean;
  fromDate: any;
  toDate: any;
  username: any;
  rCode: any;
  data: any;

  constructor(private tableConstants: TableConstants, private restApiService: RestAPIService, private roleBasedService: RoleBasedService,
    private authService: AuthService, private datePipe: DatePipe, private router: Router,
     private excelService: ExcelService, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.stockDataColumns = this.tableConstants.StockStatementReport;
    this.username = JSON.parse(this.authService.getCredentials());
    this.data = this.roleBasedService;
  }

  onSelect() {
    let options = [];
    if (this.data.instance !== undefined) {
      this.data.instance.forEach(x => {
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
        data.OpeningBalance = (data.OpeningBalance * 1).toFixed(3);
        data.PhycialBalance = (data.PhycialBalance * 1).toFixed(3);
        data.TotalIssue = (data.TotalIssue * 1).toFixed(3);
        data.IssueOthers = (data.IssueOthers * 1).toFixed(3);
        data.IssueSales = (data.IssueSales * 1).toFixed(3);
        data.Receipt = (data.Receipt * 1).toFixed(3);
        data.TotalReceipt = (data.TotalReceipt * 1).toFixed(3);
        data.ClosingBalance = (data.ClosingBalance * 1).toFixed(3);
        data.CSBalance = (data.CSBalance * 1).toFixed(3);
        data.Shortage = (data.Shortage * 1).toFixed(3);
        data.Receipt = ((data.TotalReceipt * 1) + (data.OpeningBalance * 1)).toFixed(3);
        data.TotalIssue = ((data.IssueSales * 1) + (data.IssueOthers * 1)).toFixed(3);
        sno += 1;
        data.SlNo = sno;
      })
      this.loading = false;
      } else{
        this.loading = false;
        this.messageService.add({ key: 't-error', severity: 'error', summary: 'Warn Message', detail: 'Record Not Found!' });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0) {
      this.loading = false;
      this.router.navigate(['pageNotFound']);
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
      if ((selectedFromDate > selectedToDate && selectedFromMonth === selectedToMonth && selectedFromYear === selectedToYear) ||
       (selectedFromMonth != selectedToMonth) || (selectedToYear != selectedFromYear)) {
          this.messageService.add({ key: 't-err', severity: 'error', summary: 'Invalid Date', detail: 'Please select a valid date range' });
          this.fromDate = this.toDate = '';
      }
      return this.fromDate, this.toDate;
    }
  }
  onResetTable() {
    this.stockData = [];
  }

  onExportExcel():void{
    this.excelService.exportAsExcelFile(this.stockData, 'STOCK_RECEIPT_REGISTER_REPORT',this.stockDataColumns);
}

}
