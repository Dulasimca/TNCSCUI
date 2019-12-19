import { Component, OnInit, ViewChild } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { SelectItem, MessageService } from 'primeng/api';
import { PathConstants } from 'src/app/constants/path.constants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { DatePipe } from '@angular/common';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { HttpErrorResponse } from '@angular/common/http';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { StatusMessage } from 'src/app/constants/Messages';
import { Dropdown, DataTable } from 'primeng/primeng';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { saveAs } from 'file-saver';

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
  regionOptions: SelectItem[];
  GCode: any;
  maxDate: Date = new Date();
  loading: boolean;
  fromDate: any = new Date();
  toDate: any = new Date();
  username: any;
  RCode: any;
  data: any;
  items: any;
  roleId: any;
  loggedInRCode: any;
  regions: any;
  @ViewChild('gd') godownPanel: Dropdown;
  @ViewChild('reg') regionPanel: Dropdown;
  @ViewChild('dt') table: DataTable;

  constructor(private tableConstants: TableConstants, private restApiService: RestAPIService, private roleBasedService: RoleBasedService,
    private authService: AuthService, private datePipe: DatePipe, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.stockDataColumns = this.tableConstants.StockStatementReport;
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.data = this.roleBasedService.getInstance();
    this.regions = this.roleBasedService.getRegions();
    this.username = JSON.parse(this.authService.getCredentials());
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.items = [  
  {
    label: 'Excel', icon: 'fa fa-table', command: () => {
      this.table.exportCSV();
    }
  },
  {
        label: 'PDF', icon: "fa fa-file-pdf-o", command: () => {
          this.exportAsPDF();
        }
      }]
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
        if(this.RCode === undefined || this.RCode === null) { this.GCode = null; }
        break;
      case 'gd':
        if (type === 'enter') {
          this.godownPanel.overlayVisible = true;
        }
        this.data = this.roleBasedService.instance;
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode.value) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            }
          });
          this.godownOptions = godownSelection;
        }
        break;
    }
  }

  onView() {
    this.onResetTable('');
    this.checkValidDateSelection();
    this.loading = true;
    const params = {
      'FDate': this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'),
      'ToDate': this.datePipe.transform(this.toDate, 'MM/dd/yyyy'),
      'GCode': this.GCode.value,
      'RCode': this.RCode.value,
      'GName': this.GCode.label,
      'RName': this.RCode.label,
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
        this.messageService.clear();
        this.messageService.add({ key: 't-error', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-error', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }

  onDateSelect() {
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
        this.messageService.add({ key: 't-error', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_INVALID, detail: StatusMessage.ValidDateErrorMessage });
        this.fromDate = this.toDate = '';
      }
      return this.fromDate, this.toDate;
    }
  }
  
  onResetTable(item) {
    if(item === 'reg') { this.GCode = null; }
    this.stockData = [];
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

  onPrint() {
    const path = "../../assets/Reports/" + this.username.user + "/";
    const filename = this.GCode.value + GolbalVariable.StockStatementFileName + ".txt";
    saveAs(path + filename, filename);
  }
}
