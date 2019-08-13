import { Component, OnInit } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-daily-document-issue',
  templateUrl: './daily-document-issue.component.html',
  styleUrls: ['./daily-document-issue.component.css']
})
export class DailyDocumentIssueComponent implements OnInit {
  DailyDocumentTotalCols: any;
  DailyDocumentTotalData: any;
  DailyDocumentIssueCols: any;
  DailyDocumentIssueData: any;
  g_cd: any;
  gCode: any;
  rCode: any;
  r_cd: any;
  DocumentDate: Date;
  roleId: any;
  gdata: any;
  isActionDisabled: any;
  userid: any;
  maxDate: Date;
  loading: boolean;
  godownOptions: SelectItem[];
  canShowMenu: boolean;

  constructor(private tableConstants: TableConstants, private messageService: MessageService, private restAPIService: RestAPIService, private datepipe: DatePipe, private roleBasedService: RoleBasedService, private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.gdata = this.roleBasedService.getInstance();
    this.isActionDisabled = true;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.DailyDocumentTotalCols = this.tableConstants.DailyDocumentTotalReport;
    this.DailyDocumentIssueCols = this.tableConstants.DailyDocumentIssue;
    this.maxDate = new Date();
    this.userid = JSON.parse(this.authService.getCredentials());
  }

  onSelect(selectedItem) {
    let godownSelection = [];
    switch (selectedItem) {
      case 'gd':
        if (this.gdata !== undefined) {
          this.gdata.forEach(x => {
            godownSelection.push({ 'label': x.GName, 'value': x.GCode, 'rcode': x.RCode });
            this.godownOptions = godownSelection;
          });
          this.godownOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        }
        break;
    }
  }

  ontime() {
    this.loading = true;
    const params = {
      'GodownCode': (this.g_cd.value !== null && this.g_cd.value !== undefined) ? this.g_cd.value : this.gCode,
      'RegionCode': this.g_cd.rcode,
      'RoleId': this.roleId,
      'DocumentDate': this.datepipe.transform(this.DocumentDate, 'dd/MM/yyyy')
    }
    this.restAPIService.post(PathConstants.DAILY_DOCUMENT_ISSUE_POST, params).subscribe(res => {
      this.DailyDocumentIssueData = res;
      this.DailyDocumentTotalData = this.gdata
      this.DailyDocumentTotalData.forEach(s => {
        s.RCode = this.g_cd.rcode,
          s.GCode = this.g_cd.value,
          s.GName = this.g_cd.label,
          s.RName,
          s.NoDocument = res.length
      })
      let sno = 0;
      this.DailyDocumentIssueData.forEach(data => {
        data.DocDate = this.datepipe.transform(data.DocDate, 'dd/MM/yyyy');
        sno += 1;
        data.SlNo = sno;
      })
      if (res !== undefined && res.length !== 0) {
        this.isActionDisabled = false;
      } else {
        this.loading = false;
        this.messageService.add({ key: 't-date', severity: 'warn', summary: 'Warning!', detail: 'No record for this combination' });
      }
      this.loading = false;
      this.DailyDocumentIssueData.slice(0);
    }, (err: HttpErrorResponse) => {
      if (err.status === 0) {
        this.loading = false;
      }
    })
  }

  onResetTable() {
    this.DailyDocumentIssueData = [];
    this.DailyDocumentTotalData = [];
    this.isActionDisabled = true;
  }
}