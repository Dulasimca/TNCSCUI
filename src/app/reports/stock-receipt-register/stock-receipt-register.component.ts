import { Component, OnInit, ViewChild } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { SelectItem, MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { StatusMessage } from 'src/app/constants/Messages';
import { Dropdown } from 'primeng/primeng';


@Component({
  selector: 'app-stock-receipt-register',
  templateUrl: './stock-receipt-register.component.html',
  styleUrls: ['./stock-receipt-register.component.css']
})
export class StockReceiptRegisterComponent implements OnInit {
  stockReceiptRegCols: any;
  stockReceiptRegData: any = [];
  fromDate: any = new Date();
  toDate: any = new Date();
  godownOptions: SelectItem[];
  regionOptions: SelectItem[];
  RCode: any;
  GCode: any;
  data: any;
  maxDate: Date;
  canShowMenu: boolean;
  isShowErr: boolean;
  loading: boolean = false;
  username: any;
  regionsData: any;
  roleId: any;
  @ViewChild('godown') godownPanel: Dropdown;
  @ViewChild('region') regionPanel: Dropdown;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private authService: AuthService, private excelService: ExcelService, private router: Router,
    private restAPIService: RestAPIService, private roleBasedService: RoleBasedService, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.stockReceiptRegCols = this.tableConstants.StockReceiptRegisterReport;
    this.regionsData = this.roleBasedService.getRegions();
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId); this.maxDate = new Date();
    this.data = this.roleBasedService.getInstance();
    this.username = JSON.parse(this.authService.getCredentials());
  }

  onSelect(item, type) {
    let godownSelection = [];
    let regionSelection = [];
    switch (item) {
      case 'reg':
        if (type === 'enter') {
          this.regionPanel.overlayVisible = true;
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
        }
        break;
    }
  }

  onView() {
    this.checkValidDateSelection();
    this.loading = true;
    const params = {
      'FromDate': this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'),
      'ToDate': this.datePipe.transform(this.toDate, 'MM/dd/yyyy'),
      'UserName': this.username.user,
      'GCode': this.GCode
    }
    this.restAPIService.post(PathConstants.STOCK_RECEIPT_REGISTER_REPORT, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.stockReceiptRegData = res;
        let sno = 0;
        this.stockReceiptRegData.forEach(data => {
          data.Date = this.datePipe.transform(data.Date, 'dd-MM-yyyy');
          data.NetWt = (data.NetWt * 1).toFixed(3);
          sno += 1;
          data.SlNo = sno;
        })
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
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
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_INVALID, detail: StatusMessage.ValidDateErrorMessage });
        this.fromDate = this.toDate = '';
      }
      return this.fromDate, this.toDate;
    }
  }
  onResetTable(item) {
    if (item === 'reg') { this.GCode = null; }
    this.stockReceiptRegData = [];
  }

  exportAsXLSX(): void {
    var StockReceiptData = [];
    this.stockReceiptRegData.forEach(data => {
      StockReceiptData.push({
        SlNo: data.SlNo, Ackno: data.Ackno, Date: data.Date, TruckMemoNo: data.TruckMemoNo,
        Lorryno: data.Lorryno, From_Whom_Received: data.From_Whom_Received, Stackno: data.Stackno, Scheme: data.Scheme,
        NoPacking: data.NoPacking, Commodity: data.Commodity, NetWt: data.NetWt
      })
    })
    this.excelService.exportAsExcelFile(StockReceiptData, 'STOCK_RECEIPT_REGISTER_REPORT', this.stockReceiptRegCols);
  }

  onPrint() {
    const path = "../../assets/Reports/" + this.username.user + "/";
    const filename = this.GCode + GolbalVariable.StockReceiptRegFilename + ".txt";
    saveAs(path + filename, filename);
  }

}
