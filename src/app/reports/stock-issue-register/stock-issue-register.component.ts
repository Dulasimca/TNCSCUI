import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { SelectItem, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { AuthService } from 'src/app/shared-services/auth.service';

@Component({
  selector: 'app-stock-issue-register',
  templateUrl: './stock-issue-register.component.html',
  styleUrls: ['./stock-issue-register.component.css']
})
export class StockIssueRegisterComponent implements OnInit {
  stockIssueRegCols: any;
  stockIssueRegData: any = [];
  fromDate: any;
  toDate: any;
  isViewDisabled: any;
  isActionDisabled: any;
  data: any;
  record: any = [];
  g_cd: any;
  godownOptions: SelectItem[];
  godownName: string;
  canShowMenu: boolean;
  maxDate: Date;
  startIndex: any = 0;
  recordRange: any = 500;
  position: any = 1;
  loading: boolean = false;
  canFetch: boolean;
  totalRecords: number;
  

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe, private authService: AuthService,
    private restAPIService: RestAPIService, private roleBasedService: RoleBasedService,
    private excelService: ExcelService, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.canFetch = true;
    this.isViewDisabled = this.isActionDisabled = true;
    this.stockIssueRegCols = this.tableConstants.StockIssueRegisterReport;
    this.data = this.roleBasedService.getInstance();
    this.maxDate = new Date();
    this.stockIssueRegData = [];
  }

  onSelect() {
    let options = [];
    this.canFetch = true;
    if (this.fromDate !== undefined && this.toDate !== undefined
      && this.g_cd !== '' && this.g_cd !== undefined) {
      this.isViewDisabled = false;
    }
    if (this.data !== undefined) {
      this.data.forEach(x => {
      options.push({ 'label': x.GName, 'value': x.GCode });
      this.godownOptions = options;
    });
  }
  }

  onView() {
    this.checkValidDateSelection();
    const params = {
      'FromDate': this.datePipe.transform(this.fromDate, 'MM-dd-yyyy'),
      'ToDate': this.datePipe.transform(this.toDate, 'MM-dd-yyyy'),
      'GCode': this.g_cd,
      'StartIndex': this.startIndex,
      'TotalRecord': this.recordRange,
      'Position': this.position
    }
    if (this.canFetch) {
      this.loading = true;
      this.restAPIService.post(PathConstants.STOCK_ISSUE_REGISTER_REPORT, params).subscribe(res => {
        if (res !== undefined && res.length !== 0) {
          this.loading = false;
          let sno = 0;
          res.forEach(rec => {
            sno += 1;
            this.record.push({
              'SlNo': sno,
              'Issue_Memono': rec.Issue_Memono, 'DNo': rec.DNo, 'Issue_Date': this.datePipe.transform(rec.Issue_Date, 'dd/mm/yyyy'),
              'Lorryno': rec.Lorryno, 'To_Whom_Issued': rec.To_Whom_Issued, 'Stackno': rec.Stackno, 'Scheme': rec.Scheme,
              'NoPacking': rec.NoPacking, 'Commodity': rec.Commodity, 'NetWt': rec.NetWt
            });
          });
          this.totalRecords = this.record.length;
          this.stockIssueRegData = this.record;
          if (res.length === this.recordRange && this.totalRecords > 0) {
            this.canFetch = true;
            this.position += 1;
            this.startIndex = this.recordRange;
            this.recordRange += this.recordRange;
            setTimeout(() => {
            this.onView();
          }, 500);
          } else {
            this.canFetch = false;
            this.isActionDisabled = false;
          }
        } else {
          this.loading = false;
          this.messageService.add({ key: 't-err', severity: 'warn', summary: 'Warning!', detail: 'No record for this combination' });
        }
      })
    }
  }

  onResetTable() {
    this.record = [];
    this.stockIssueRegData = [];
    this.isActionDisabled = true;
  }

  onDateSelect() {
    this.checkValidDateSelection();
    this.onResetTable();
    this.canFetch = true;
    if (this.fromDate !== undefined && this.toDate !== undefined
      && this.g_cd !== '' && this.g_cd !== undefined) {
      this.isViewDisabled = false;
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
      if (selectedFromMonth !== selectedToMonth || selectedFromYear !== selectedToYear) {
        this.messageService.add({ key: 't-date', severity: 'error', summary: 'Invalid Date', detail: 'Please select a date within a month' });
        this.fromDate = this.toDate = '';
      } else if (selectedFromDate >= selectedToDate) {
        this.messageService.add({ key: 't-date', severity: 'error', summary: 'Invalid Date', detail: 'Please select a valid date range' });
        this.fromDate = this.toDate = '';
      }
      return this.fromDate, this.toDate;
    }
  }

  onExportExcel(): void {
    this.excelService.exportAsExcelFile(this.stockIssueRegData, 'STOCK_ISSUE_REGISTER_REPORT', this.stockIssueRegCols);
  }
}
