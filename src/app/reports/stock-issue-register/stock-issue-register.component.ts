import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { SelectItem, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
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
  regions: any;
  roleId: number;
  canShowMenu: boolean;
  maxDate: Date;
  startIndex: any = 0;
  recordRange: any = 500;
  position: any = 1;
  loading: boolean = false;
  canFetch: boolean;
  loggedInRCode: string;
  totalRecords: number;
  @ViewChild('godown') godownPanel: Dropdown;
  @ViewChild('region') regionPanel: Dropdown;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe, private authService: AuthService,
    private restAPIService: RestAPIService, private roleBasedService: RoleBasedService, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.canFetch = true;
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.stockIssueRegCols = this.tableConstants.StockIssueRegisterReport;
    this.regions = this.roleBasedService.getRegions();
    this.maxDate = new Date();
    this.stockIssueRegData = [];
    this.data = this.roleBasedService.getInstance();
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.maxDate = new Date();
    this.username = JSON.parse(this.authService.getCredentials());
  }

  onSelect(item, type) {
    let godownSelection = [];
    let regionSelection = [];
    switch (item) {
      case 'reg':
          this.regions = this.roleBasedService.regionsData;
          if (type === 'enter') {
            this.regionPanel.overlayVisible = true;
          }
          if (this.roleId === 1) {
            if (this.regions !== undefined) {
              this.regions.forEach(x => {
                regionSelection.push({ 'label': x.RName, 'value': x.RCode });
              });
              this.regionOptions = regionSelection;
            }
          } else {
            if (this.regions !== undefined) {
              this.regions.forEach(x => {
                if(x.RCode === this.loggedInRCode) {
                regionSelection.push({ 'label': x.RName, 'value': x.RCode });
                }
              });
              this.regionOptions = regionSelection;
            }
          }
        break;
      case 'godown':
        if (type === 'enter') {
          this.godownPanel.overlayVisible = true;
        }
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode, 'rcode': x.RCode, 'rname': x.RName });
            }
          });
          this.godownOptions = godownSelection;
          if (this.roleId !== 3) {
            this.godownOptions.unshift({ label: 'All', value: 'All' });
          }
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
          let sno = 1;
          res.forEach(rec => {
            this.record.push({
             // 'SlNo': sno,
              'Issue_Memono': rec.Issue_Memono, 'DNo': rec.DNo, 'Issue_Date': this.datePipe.transform(rec.Issue_Date, 'dd/MM/yyyy'),
              'Lorryno': rec.Lorryno, 'To_Whom_Issued': rec.To_Whom_Issued, 'Stackno': rec.Stackno, 'Scheme': rec.Scheme,
              'NoPacking': rec.NoPacking, 'Commodity': rec.Commodity, 'NetWt': rec.NetWt
            });
          });
          this.record.forEach((data, index) => {
            if(index > 0 && data.Issue_Memono !== this.record[index - 1].Issue_Memono) {
              sno += 1;
              data.SlNo = sno;
            } else if (index === 0) { data.SlNo = sno; }
          })
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
        if (err.status === 0 || err.status === 400) {
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

  onPrint() {
    const path = "../../assets/Reports/" + this.username.user + "/";
    const filename = this.GCode + GolbalVariable.StockIssueRegFilename + ".txt";
    saveAs(path + filename, filename);
  }
}
