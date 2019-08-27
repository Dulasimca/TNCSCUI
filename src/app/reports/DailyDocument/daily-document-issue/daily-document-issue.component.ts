import { Component, OnInit } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpErrorResponse } from '@angular/common/http';
import { ExcelService } from 'src/app/shared-services/excel.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { StatusMessage } from 'src/app/constants/Messages';

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
  items: any;
  filterArray: any;

  constructor(private tableConstants: TableConstants, private messageService: MessageService, private excelService: ExcelService, private restAPIService: RestAPIService, private datepipe: DatePipe, private roleBasedService: RoleBasedService, private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.gdata = this.roleBasedService.getInstance();
    this.isActionDisabled = true;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.DailyDocumentTotalCols = this.tableConstants.DailyDocumentTotalReport;
    this.DailyDocumentIssueCols = this.tableConstants.DailyDocumentIssue;
    this.maxDate = new Date();
    this.userid = JSON.parse(this.authService.getCredentials());
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
    };
    this.restAPIService.post(PathConstants.DAILY_DOCUMENT_ISSUE_POST, params).subscribe(res => {
      this.DailyDocumentIssueData = res;
      if (this.roleId !== 1) {
        this.DailyDocumentTotalData = this.gdata
        this.DailyDocumentTotalData.forEach(s => {
          s.RCode = this.g_cd.rcode,
            s.GCode = this.g_cd.value,
            s.GName = this.g_cd.label,
            s.RName,
            s.NoDocument = res.length
        });
      }
      let sno = 0;
      this.DailyDocumentIssueData.forEach(data => {
        data.DocDate = this.datepipe.transform(data.DocDate, 'MM/dd/yyyy');
        sno += 1;
        data.SlNo = sno;
      });
      if (res !== undefined && res.length !== 0) {
        this.isActionDisabled = false;
      } else {
        this.loading = false;
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
      }
      this.loading = false;
      this.DailyDocumentIssueData.slice(0);
    }, (err: HttpErrorResponse) => {
      if (err.status === 0) {
        this.loading = false;
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }

  onResetTable() {
    this.DailyDocumentIssueData = [];
    this.DailyDocumentTotalData = [];
    this.isActionDisabled = true;
  }

  onSearch(value) {
    this.DailyDocumentIssueData = this.filterArray;
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.DailyDocumentIssueData = this.DailyDocumentIssueData.filter(item => {
        // if (item.DepositorName.toString().startsWith(value)) {
        return item.CommodityName.toString().startsWith(value);
        // }
      });
    }
  }

  exportAsXLSX(): void {
    var DailyReceipt = [];
    this.DailyDocumentIssueData.forEach(data => {
      DailyReceipt.push({ SlNo: data.SlNo, DocNo: data.DocNo, DocDate: data.DocDate, Transactiontype: data.Transactiontype, StackNo: data.StackNo, CommodityName: data.CommodityName, PackingType: data.PackingType, NOOfPACKING: data.NOOfPACKING, GROSSWT: data.GROSSWT, NETWT: data.NETWT, Scheme: data.SCHEME, Received_From: data.ReceivedFrom })
    });
    this.excelService.exportAsExcelFile(DailyReceipt, 'Daily_Issue', this.DailyDocumentIssueCols);
  }

  exportAsPDF() {
    var doc = new jsPDF('p', 'pt', 'a4');
    doc.text("Tamil Nadu Civil Supplies Corporation - Head Office", 100, 30);
    // var img ="assets\layout\images\dashboard\tncsc-logo.png";
    // doc.addImage(img, 'PNG', 150, 10, 40, 20);
    var col = this.DailyDocumentIssueCols;
    var rows = [];
    this.DailyDocumentIssueData.forEach(element => {
      var temp = [element.SlNo, element.DocNo, element.DocDate, element.Transactiontype, element.StackNo, element.CommodityName, element.PackingType, element.NOOfPACKING, element.GROSSWT, element.NETWT, element.SCHEME, element.ReceivedFrom];
      rows.push(temp);
    });
    doc.autoTable(col, rows);
    doc.save('Daily_Issue.pdf');
  }
}