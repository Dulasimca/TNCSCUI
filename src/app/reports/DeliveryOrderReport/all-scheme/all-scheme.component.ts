import { Component, OnInit } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { Router } from '@angular/router';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';

@Component({
  selector: 'app-all-scheme',
  templateUrl: './all-scheme.component.html',
  styleUrls: ['./all-scheme.component.css']
})
export class AllSchemeComponent implements OnInit {
  AllSchemeCols: any;
  AllSchemeData: any;
  fromDate: any;
  toDate: any;
  godownOptions: SelectItem[];
  SchemeOptions: SelectItem[];
  transactionOptions: SelectItem[];
  receiverOptions: SelectItem[];
  t_cd: any;
  g_cd: any;
  s_cd: any;
  sch_cd: any;
  Trcode: any;
  trcode: any;
  data: any;
  SchCode: any;
  gCode: any;
  SCode: any;
  isViewDisabled: boolean;
  isActionDisabled: boolean;
  maxDate: Date;
  roleId: any;
  canShowMenu: boolean;
  isShowErr: boolean;
  loading: boolean = false;


  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private authService: AuthService, private excelService: ExcelService, private router: Router,
    private restAPIService: RestAPIService, private datepipe: DatePipe, private roleBasedService: RoleBasedService, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.isViewDisabled = this.isActionDisabled = true;
    this.AllSchemeCols = this.tableConstants.DoAllScheme;
    this.data = this.roleBasedService.getInstance();
    this.gCode = this.authService.getUserAccessible().gCode;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.maxDate = new Date();
  }

  onSelect(item) {
    let TransactionSelection = [];
    let ReceiverSelection = [];
    let godownSelection = [];
    let SchemeSelection = [];
    switch (item) {
      case 'gd':
        this.data = this.roleBasedService.instance;
        if (this.data !== undefined) {
          this.data.forEach(x => {
            godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            this.godownOptions = godownSelection;
          });
          if (this.roleId !== 3) {
            this.godownOptions.unshift({ label: 'All', value: 'All' });
          }
        }
        break;
      case 't':
        // if (this.transactionOptions === undefined && this.receiverOptions === undefined) {
        this.restAPIService.get(PathConstants.TRANSACTION_MASTER).subscribe(s => {
          s.forEach(c => {
            if (c.TransType === 'I') {
              TransactionSelection.push({ 'label': c.TRName, 'value': c.TRCode });
            }
            this.transactionOptions = TransactionSelection;
          });
        });
        // }
        break;
      case 'r':
        const params = new HttpParams().set('TRCode', this.t_cd.value);
        this.restAPIService.getByParameters(PathConstants.DEPOSITOR_TYPE_MASTER, params).subscribe(res => {
          res.forEach(s => {
            ReceiverSelection.push({ 'label': s.Tyname, 'value': s.Tycode });
          });
          this.receiverOptions = ReceiverSelection;
        });
        break;
      case 'Sch':
        this.restAPIService.get(PathConstants.SCHEMES).subscribe(data => {
          data.forEach(y => {
            SchemeSelection.push({ 'label': y.Name, 'value': y.SCCode });
            this.SchemeOptions = SchemeSelection;
          });
          this.SchemeOptions.unshift({ label: '-select-', value: null, disabled: true });
        });
        break;
    }
  }

  onView() {
    this.checkValidDateSelection();
    this.loading = true;
    const params = {
      'FromDate': this.datepipe.transform(this.fromDate, 'MM/dd/yyyy'),
      'ToDate': this.datepipe.transform(this.toDate, 'MM/dd/yyyy'),
      'GCode': this.g_cd.value,
      'SCode': this.s_cd.value,
      'SchCode': this.sch_cd.value
    };
    this.restAPIService.post(PathConstants.DELIVERY_ORDER_SCHEMEWISE, params).subscribe(res => {
      this.AllSchemeData = res;
      let sno = 0;
      this.AllSchemeData.forEach(data => {
        data.Dodate = this.datePipe.transform(data.Dodate, 'dd-MM-yyyy');
        data.Nkgs = (data.Nkgs * 1).toFixed(3);
        sno += 1;
        data.SlNo = sno;
      });
      if (res !== undefined && res.length !== 0) {
        this.isActionDisabled = false;
        this.loading = false;
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
    });
  }
  onDateSelect() {
    this.checkValidDateSelection();
    if (this.fromDate !== undefined && this.toDate !== undefined
      && this.g_cd !== '' && this.g_cd !== undefined && this.g_cd !== null) {
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
  onResetTable() {
    this.AllSchemeData = [];
    this.isActionDisabled = true;
  }

  exportAsXLSX(): void {
    var AllSchemeData = [];
    this.AllSchemeData.forEach(data => {
      AllSchemeData.push({ SlNo: data.SlNo, Dono: data.Dono, Dodate: data.Dodate, Type: data.Type, Coop: data.Coop, Comodity: data.Comodity, Scheme: data.Scheme, Quantity: data.Quantity, Rate: data.Rate, Amount: data.Amount, C_Nc: data.C_Nc });
    });
    this.excelService.exportAsExcelFile(AllSchemeData, 'DO_ALL_SCHEME', this.AllSchemeCols);
  }
}