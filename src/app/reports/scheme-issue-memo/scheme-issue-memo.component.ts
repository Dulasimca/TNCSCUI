import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { Dropdown } from 'primeng/primeng';

@Component({
  selector: 'app-scheme-issue-memo',
  templateUrl: './scheme-issue-memo.component.html',
  styleUrls: ['./scheme-issue-memo.component.css']
})
export class SchemeIssueMemoComponent implements OnInit {
  schemeIssueMemoCols: any;
  schemeIssueMemoData: any = [];
  username: any;
  fromDate: any = new Date();
  toDate: any = new Date();
  godown_data: any;
  scheme_data: any;
  region_data: any;
  GCode: any;
  schemeOptions: SelectItem[];
  regionOptions: SelectItem[];
  selectedValues: any;
  Scheme: any;
  RCode: any;
  roleId: any;
  godownOptions: SelectItem[];
  truckName: string;
  canShowMenu: boolean;
  maxDate: Date;
  loading: boolean = false;
  @ViewChild('godown') godownPanel: Dropdown;
  @ViewChild('region') regionPanel: Dropdown;
  @ViewChild('scheme') schemePanel: Dropdown;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private messageService: MessageService, private authService: AuthService, private excelService: ExcelService, private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.schemeIssueMemoCols = this.tableConstants.SchemeIssueMemoReport;
    this.scheme_data = this.roleBasedService.getSchemeData();
    this.godown_data = this.roleBasedService.getInstance();
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.region_data = this.roleBasedService.getRegions();
    this.maxDate = new Date();
  }

  onSelect(item, type) {
      let regionSelection = [];
      let godownSelection = [];
      let schemeSelection = [];
      switch (item) {
        case 'reg':
        if (type === 'enter') {
          this.regionPanel.overlayVisible = true;
        }
        if (this.roleId === 3) {
          this.region_data = this.roleBasedService.instance;
          if (this.region_data !== undefined) {
            this.region_data.forEach(x => {
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
          this.region_data = this.roleBasedService.regionsData;
          if (this.region_data !== undefined) {
            this.region_data.forEach(x => {
              regionSelection.push({ 'label': x.RName, 'value': x.RCode });
            });
          }
          this.regionOptions = regionSelection;
        }
        break;
        case 'gd':
          if (type === 'enter') {
            this.godownPanel.overlayVisible = true;
          } 
          if (this.godown_data !== undefined) {
            this.godown_data.forEach(x => {
              if(x.RCode === this.RCode) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode, 'rcode': x.RCode, 'rname': x.RName });
              }
            });
            this.godownOptions = godownSelection;
          }
          break;
      case 'scheme':
        if (type === 'enter') {
          this.schemePanel.overlayVisible = true;
        }
        if (this.scheme_data !== undefined) {
          this.scheme_data.forEach(y => {
            schemeSelection.push({ 'label': y.SName, 'value': y.SCode });
            this.schemeOptions = schemeSelection;
          });
        }
        break;
    }
  }


  onView() {
    this.checkValidDateSelection();
    this.loading = true;
    const params = {
      'FDate': this.datePipe.transform(this.fromDate, 'MM-dd-yyyy'),
      'ToDate': this.datePipe.transform(this.toDate, 'MM-dd-yyyy'),
      'GCode': this.GCode,
      'TRCode': this.Scheme
    };
    this.restAPIService.post(PathConstants.SCHEME_ISSUE_MEMO_REPORT, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.schemeIssueMemoData = res;
      let sno = 0;
      this.schemeIssueMemoData.forEach(data => {
        data.Issue_Date = this.datePipe.transform(data.Issue_Date, 'dd-MM-yyyy');
        data.Quantity = (data.Quantity * 1).toFixed(3);
        sno += 1;
        data.SlNo = sno;
      })
      } else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination
        });
      }
      this.loading = false;
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    })
  }

  onResetTable(item) {
    if(item === 'reg') { this.GCode = null; }
    this.schemeIssueMemoData = [];
  }

  onDateSelect(event) {
    this.checkValidDateSelection();
    this.onResetTable('');
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
    var SchemeIssueData = [];
    this.schemeIssueMemoData.forEach(data => {
      SchemeIssueData.push({
        SlNo: data.SlNo, Godownname: data.Godownname, Scheme: data.Scheme, Issue_Memono: data.Issue_Memono,
        Date: data.Issue_Date, Commodity: data.Commodity, Quantity: data.Quantity, Issued_To: data.Issuedto
      })
    })
    this.excelService.exportAsExcelFile(SchemeIssueData, 'SCHEME_ISSUE_MEMO_REPORT', this.schemeIssueMemoCols);
  }
}