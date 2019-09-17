import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { SelectItem, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { StatusMessage } from 'src/app/constants/Messages';
import { Dropdown } from 'primeng/primeng';

@Component({
  selector: 'app-stock-issue-register',
  templateUrl: './stock-issue-register.component.html',
  styleUrls: ['./stock-issue-register.component.css']
})
export class StockIssueRegisterComponent implements OnInit {
  stockIssueRegCols: any;
  stockIssueRegData: any = [];
  username: any;
  fromDate: any = new Date();
  toDate: any = new Date();
  data: any;
  record: any = [];
  GCode: any;
  godownOptions: SelectItem[];
  regionOptions: SelectItem[];
  RCode: any;
  regionsData: any;
  roleId: number;
  canShowMenu: boolean;
  maxDate: Date;
  startIndex: any = 0;
  recordRange: any = 500;
  position: any = 1;
  loading: boolean = false;
  canFetch: boolean;
  totalRecords: number;
  @ViewChild('godown') godownPanel: Dropdown;
  @ViewChild('region') regionPanel: Dropdown;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe, private authService: AuthService,
    private restAPIService: RestAPIService, private roleBasedService: RoleBasedService,
    private excelService: ExcelService, private messageService: MessageService, private router: Router) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.canFetch = true;
    this.stockIssueRegCols = this.tableConstants.StockIssueRegisterReport;
    this.maxDate = new Date();
    this.stockIssueRegData = [];
    this.data = this.roleBasedService.getInstance();
    this.username = JSON.parse(this.authService.getCredentials());
  }

  onSelect(item, type) {
    let godownSelection = [];
    let regionSelection = [];
    switch (item) {
      case 'reg':
        if (type === 'enter') {
          this.godownPanel.overlayVisible = true;
        }
        if (this.roleId === 3) {
          this.regionsData = this.roleBasedService.instance;
          if (this.regionsData !== undefined) {
            this.regionsData.forEach(x => {
              regionSelection.push({ 'label': x.RName, 'value': x.RCode });
            });
            for (let i = 0; i < regionSelection.length - 1;) {
              if (regionSelection[i].value === regionSelection[i + 1].value) {
                regionSelection.splice(i + 1, 1);
              }
            }
          }
          this.regionOptions = regionSelection;
        } else {
          this.regionsData = this.roleBasedService.regionsData;
          if (this.regionsData !== undefined) {
            this.regionsData.forEach(x => {
              regionSelection.push({ 'label': x.RName, 'value': x.RCode });
            });
          }
          this.regionOptions = regionSelection;
        }
        break;
      case 'godown':
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if(x.RCode === this.RCode) {
            godownSelection.push({ 'label': x.GName, 'value': x.GCode, 'rcode': x.RCode, 'rname': x.RName });
            }
          });
          this.godownOptions = godownSelection;
        }
        break;
    }
  }

  onView() {
    this.checkValidDateSelection();
    const params = {
      'FromDate': this.datePipe.transform(this.fromDate, 'MM-dd-yyyy'),
      'ToDate': this.datePipe.transform(this.toDate, 'MM-dd-yyyy'),
      'GCode': this.GCode,
      'StartIndex': this.startIndex,
      'TotalRecord': this.recordRange,
      'Position': this.position,
      'UserName': this.username.user
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
              'Issue_Memono': rec.Issue_Memono, 'DNo': rec.DNo, 'Issue_Date': this.datePipe.transform(rec.Issue_Date, 'dd/MM/yyyy'),
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
          }
        } else {
          this.loading = false;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
        }
      }, (err: HttpErrorResponse) => {
        if (err.status === 0) {
          this.loading = false;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
        }
      })
    }
  }

  onResetTable(item) {
    if (item === 'reg') { this.GCode = null; }
    this.record = [];
    this.stockIssueRegData = [];
  }

  onDateSelect() {
    this.checkValidDateSelection();
    this.onResetTable('');
    this.canFetch = true;
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
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_INVALID, detail: StatusMessage.ValidDateErrorMessage });
        this.fromDate = this.toDate = '';
      }
      return this.fromDate, this.toDate;
    }
  }

  exportAsXLSX(): void {
    var StockIssueData = [];
    this.stockIssueRegData.forEach(data => {
      StockIssueData.push({
        SlNo: data.SlNo, Issue_Memono: data.Issue_Memono, DNo: data.DNo, Issue_Date: data.Issue_Date,
        Lorryno: data.Lorryno, To_Whom_Issued: data.To_Whom_Issued, Stackno: data.Stackno, Scheme: data.Scheme, Commodity: data.Commodity,
        NoPacking: data.NoPacking, NetWt: data.NetWt
      })
    })
    this.excelService.exportAsExcelFile(StockIssueData, 'STOCK_ISSUE_REGISTER_REPORT', this.stockIssueRegCols);
  }

  onPrint() {
    const path = "../../assets/Reports/" + this.username.user + "/";
    const filename = this.GCode + GolbalVariable.StockIssueRegFilename + ".txt";
    saveAs(path + filename, filename);
  }
}
