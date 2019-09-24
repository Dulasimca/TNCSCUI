import { Component, OnInit, ViewChild } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { SelectItem, MessageService } from 'primeng/api';
import { StatusMessage } from 'src/app/constants/Messages';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Dropdown } from 'primeng/primeng';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';


@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {
  IssueMemoCustomerDetailsData: any;
  IssueMemoCustomerDetailsCols: any;
  AbstractData: any;
  AbstractCols: any;
  canShowMenu: boolean;
  godownOptions: SelectItem[];
  SchemeOptions: SelectItem[];
  transactionOptions: SelectItem[];
  receiverOptions: SelectItem[];
  regionOptions: SelectItem[];
  societyOptions: SelectItem[];
  filterArray: any;
  s_cd: any;
  r_cd: any;
  g_cd: any;
  t_cd: any;
  GCode: any;
  data: any;
  fromDate: any;
  toDate: any;
  isActionDisabled: boolean;
  deliveryReceiptRegCols: any;
  maxDate: Date;
  SocietySelection = [];
  TypeSelection = [];
  ReceiverSelection = [];
  TransactionSelection = [];
  Trcode: any;
  trCode: any;
  roleId: any;
  RCode: any;
  loggedInRCode: any;
  regions: any;
  loading: boolean;
  @ViewChild('godown') godownPanel: Dropdown;
  @ViewChild('region') regionPanel: Dropdown;
  @ViewChild('transaction') transactionPanel: Dropdown;
  @ViewChild('society') societyPanel: Dropdown;
  @ViewChild('receiver') receiverPanel: Dropdown;


  constructor(private tableConstants: TableConstants, private datePipe: DatePipe, private messageService: MessageService,
    private authService: AuthService, private excelService: ExcelService,
    private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    this.GCode = this.authService.getUserAccessible().gCode;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.isActionDisabled = true;
    this.regions = this.roleBasedService.getRegions();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.maxDate = new Date();
  }

  onSelect(item, type) {
    let regionSelection = [];
    let godownSelection = [];
    let TransactionSelection = [];
    let ReceiverSelection = [];
    let SocietySelection = [];
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
              if (x.RCode === this.loggedInRCode) {
                regionSelection.push({ 'label': x.RName, 'value': x.RCode });
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
              godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            }
          });
          this.godownOptions = godownSelection;
        }
        break;
      case 't':
        if (type === 'enter') {
          this.transactionPanel.overlayVisible = true;
        }
        if (this.transactionOptions === undefined) {
          this.restAPIService.get(PathConstants.TRANSACTION_MASTER).subscribe(s => {
            s.forEach(c => {
              if (c.TransType === 'I') {
                TransactionSelection.push({ 'label': c.TRName, 'value': c.TRCode });
              }
              this.transactionOptions = TransactionSelection;
            });
          });
        }
        break;
      case 'r':
        if (type === 'enter') {
          this.receiverPanel.overlayVisible = true;
        }
        const params = new HttpParams().set('TRCode', this.t_cd.value);
        this.restAPIService.getByParameters(PathConstants.DEPOSITOR_TYPE_MASTER, params).subscribe(res => {
          res.forEach(s => {
            ReceiverSelection.push({ 'label': s.Tyname, 'value': s.Tycode });
          });
          this.receiverOptions = ReceiverSelection;
        });
        break;
      case 's':
        if (type === 'enter') {
          this.societyPanel.overlayVisible = true;
        }
        if (this.societyOptions === undefined) {
          const params = new HttpParams().set('GCode', this.GCode);
          this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_GET, params).subscribe(res => {
            var result = Array.from(new Set(res.map((item: any) => item.SocietyName)));
            var code = Array.from(new Set(res.map((item: any) => item.SocietyCode)));
            for (var index in result && code) {
              this.SocietySelection.push({ 'label': result[index], 'value': code[index] });
            }
            this.societyOptions = this.SocietySelection;
          });
        }
        break;
    }
  }

  onView() {
    const params = {
      'GCode': this.GCode,
      'SCode': this.s_cd.value,
      'TCode': this.r_cd.value,
      'Fdate': this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'),
      'Tdate': this.datePipe.transform(this.toDate, 'MM/dd/yyyy'),
    };
    this.restAPIService.post(PathConstants.ISSUE_MEMO_CUTOMER_DETAILS_POST, params).subscribe(res => {
      if (res !== undefined) {
        this.IssueMemoCustomerDetailsCols = this.tableConstants.IssueMemoCustomerDeatil;
        this.loading = false;
        this.IssueMemoCustomerDetailsData = res;
        this.filterArray = res;
        let sno = 0;
        this.IssueMemoCustomerDetailsData.forEach(data => {
          data.Date = this.datePipe.transform(data.Date, 'dd/MM/yyyy');
          sno += 1;
          data.SlNo = sno;
        });
        if (res !== undefined && res.length !== 0) {
          this.isActionDisabled = false;
        } else {
          this.loading = false;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
        }
        this.loading = false;
      } (err: HttpErrorResponse) => {
        if (err.status === 0 || err.status === 400) {
          this.loading = false;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
        }
      }
    });
    this.onClear();
  }

  onAbstract() {
    const params = {
      'Fdate': this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'),
      'Tdate': this.datePipe.transform(this.toDate, 'MM/dd/yyyy'),
      'Gcode': this.g_cd.value,
    };
    this.restAPIService.getByParameters(PathConstants.ISSUE_MEMO_CUTOMER_ABSTRACT_GET, params).subscribe(res => {
      if (res !== undefined) {
        this.AbstractCols = this.tableConstants.IssueMemoAbstract;
        this.loading = false;
        this.AbstractData = res;
        this.filterArray = res;
        let sno = 0;
        this.AbstractData.forEach(data => {
          data.Date = this.datePipe.transform(data.Date, 'dd/MM/yyyy');
          sno += 1;
          data.SlNo = sno;
        });
        if (res !== undefined && res.length !== 0) {
          this.isActionDisabled = false;
        } else {
          this.loading = false;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
        }
        this.loading = false;
      } (err: HttpErrorResponse) => {
        if (err.status === 0 || err.status === 400) {
          this.loading = false;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
        }
      }
    });
    this.onClear();
  }

  onResetTable() {
    this.isActionDisabled = true;
  }

  onClear() {
    this.AbstractData = this.AbstractCols = this.IssueMemoCustomerDetailsCols = this.IssueMemoCustomerDetailsData = null;
  }

  onDateSelect() {
    this.checkValidDateSelection();
    this.IssueMemoCustomerDetailsData = [];
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
    var IssueMemo = [];
    var AbstractData = [];
    if (this.AbstractData || this.IssueMemoCustomerDetailsData) {
      if (this.AbstractData) {
        this.AbstractData.forEach(data => {
          AbstractData.push({ SlNo: data.SlNo, Society: data.society, Commodity: data.Commodity, Quantity: data.Quantity });
        });
        this.excelService.exportAsExcelFile(AbstractData, 'Issue_Memo_Abstract', this.AbstractCols);
      } else if (this.IssueMemoCustomerDetailsData) {
        this.IssueMemoCustomerDetailsData.forEach(data => {
          IssueMemo.push({
            SlNo: data.SlNo, Ackno: data.Ackno, Date: data.Date, Type_name: data.tyname,
            Coop: data.Coop, Scheme: data.Scheme, Commodity: data.Commodity, Quantity: data.Quantity,
            Society: data.Society, Rate: data.Rate, value: data.value
          });
        });
        this.excelService.exportAsExcelFile(IssueMemo, 'Issue_Memo_Customer_Details_Data', this.IssueMemoCustomerDetailsCols);
      }
    }
  }

  print() { }

  exportAsPDF() {
    var doc = new jsPDF('p', 'pt', 'a4');
    doc.text("Tamil Nadu Civil Supplies Corporation - Head Office", 100, 30);
    // var img ="assets\layout\images\dashboard\tncsc-logo.png";
    // doc.addImage(img, 'PNG', 150, 10, 40, 20);
    if (this.IssueMemoCustomerDetailsData || this.AbstractData) {
      if (this.AbstractData) {
        var col = this.AbstractCols;
        var rows = [];
        this.AbstractData.forEach(element => {
          var temp = [element.SlNo, element.society, element.Commodity, element.Quantity];
          rows.push(temp);
        });
        doc.autoTable(col, rows);
        doc.save('Issue_Memo_Abstract.pdf');
      } else if (this.IssueMemoCustomerDetailsData) {
        var col = this.IssueMemoCustomerDetailsCols;
        var rows = [];
        this.IssueMemoCustomerDetailsData.forEach(element => {
          var temp = [element.SlNo, element.Ackno, element.Date, element.tyname, element.Coop, element.Scheme, element.Commodity, element.Quantity, element.Society, element.Rate, element.value];
          rows.push(temp);
        });
        doc.autoTable(col, rows);
        doc.save('Issue_Memo_Customer_Details_Data.pdf');
      }
    }
  }
}

