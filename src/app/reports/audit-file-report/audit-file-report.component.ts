import { Component, OnInit, ViewChild } from '@angular/core';
import { saveAs } from 'file-saver';
import { SelectItem } from 'primeng/api';
import { Dropdown, MessageService } from 'primeng/primeng';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { DatePipe } from '@angular/common';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { StatusMessage } from 'src/app/constants/Messages';
import { Table } from 'primeng/table';
import { GolbalVariable } from 'src/app/common/globalvariable';

@Component({
  selector: 'app-audit-file-report',
  templateUrl: './audit-file-report.component.html',
  styleUrls: ['./audit-file-report.component.css']
})
export class AuditFileReportComponent implements OnInit {
  SRDocPDFDownloadStatusCols: any;
  SRDocPDFDownloadStatusData: any = [];
  FromDate: any = new Date();
  ToDate: any = new Date();
  data: any;
  RCode: any;
  regionOptions: SelectItem[];
  GCode: any;
  godownOptions: SelectItem[];
  roleId: any;
  regions: any;
  truckName: string;
  canShowMenu: boolean;
  maxDate: Date;
  username: any;
  loggedInRCode: any;
  loading: boolean = false;
  selectedOption: string = 'D';
  excelFileName: string;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;
  @ViewChild('dt', { static: false }) table: Table;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private messageService: MessageService, private authService: AuthService,
    private restAPIService: RestAPIService,
    private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.regions = this.roleBasedService.getRegions();
    this.SRDocPDFDownloadStatusCols = this.tableConstants.SRDocPDFDownloadDocColumns.slice(0);
    this.data = this.roleBasedService.getInstance();
    this.maxDate = new Date();
    this.username = JSON.parse(this.authService.getCredentials());

  }

  onSelect(item, type) {
    let regionSelection = [];
    let godownSelection = [];
    switch (item) {
      case 'reg':
        this.regions = this.roleBasedService.regionsData;
        if (type === 'enter') {
          this.regionPanel.overlayVisible = true;
        }
        if (this.roleId === 1) {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              regionSelection.push({ label: x.RName, value: x.RCode });
            });
            this.regionOptions = regionSelection;
            this.regionOptions.unshift({ label: 'All', value: 'All' });
          }
        } else {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              if (x.RCode === this.loggedInRCode) {
                regionSelection.push({ label: x.RName, value: x.RCode });
              }
            });
            this.regionOptions = regionSelection;
          }
        }
        break;
      case 'gd':
        if (type === 'enter') {
          this.godownPanel.overlayVisible = true;
        }
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode) {
              godownSelection.push({ label: x.GName, value: x.GCode, rcode: x.RCode, rname: x.RName });
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
    this.onResetTable('');
    this.checkValidDateSelection();
    this.loading = true;
    const params = new HttpParams().set('FromDate', this.datePipe.transform(this.FromDate, 'MM-dd-yyyy'))
    .append('ToDate', this.datePipe.transform(this.ToDate, 'MM-dd-yyyy')).append('GCode', this.GCode)
    .append('RCode', this.RCode).append('Type', (this.selectedOption === 'D') ? '1' : '2');
    this.restAPIService.getByParameters(PathConstants.DAILY_RECEIPT_REPORT_PDF_DOWNLOAD_GET, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.SRDocPDFDownloadStatusData = res;
        this.loading = false;
        let sno = 0;
        this.SRDocPDFDownloadStatusData.forEach(data => {
          data.SRDate = this.datePipe.transform(data.SRDate, 'dd-MM-yyyy');
          sno += 1;
          data.SlNo = sno;
        })
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

  onChangeRadioType(type) {
    if(type === 'D') {
      this.SRDocPDFDownloadStatusCols = this.tableConstants.SRDocPDFDownloadDocColumns;
      this.excelFileName = 'RECEIPT_DOWNLOADED_DOCUMENT_DETAILS_REPORT';
    } else {
      this.SRDocPDFDownloadStatusCols = this.tableConstants.SRDocPDFDownloadLogColumns;
      this.excelFileName = 'RECEIPT_DOCUMENT_LOG_DETAILS_REPORT';
    }
    this.onView();
  }

  onResetTable(item) {
    if (item === 'reg') { this.GCode = null; }
    this.SRDocPDFDownloadStatusData = [];
    this.table.reset();
    this.loading = false;
  }

  onDateSelect() {
    this.checkValidDateSelection();
    this.onResetTable('');
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
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, life:5000
        ,summary: StatusMessage.SUMMARY_INVALID, detail: StatusMessage.ValidDateErrorMessage });
        this.FromDate = this.ToDate = '';
      }
      return this.FromDate, this.ToDate;
    }
  }

  onPrint() {
    // const path = "../../assets/Reports/" + this.username.user + "/";
    // const filename = this.GCode + GolbalVariable.HullingDetailsReportFileName + ".txt";
    // saveAs(path + filename, filename);
  }

  onClose() {
    this.messageService.clear('t-err');
  }
}

