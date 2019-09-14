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
  selector: 'app-margin-amount',
  templateUrl: './margin-amount.component.html',
  styleUrls: ['./margin-amount.component.css']
})
export class MarginAmountComponent implements OnInit {
  MarginAmountCols: any;
  MarginAmountData: any;
  fromDate: any;
  toDate: any;
  godownOptions: SelectItem[];
  societyOptions: SelectItem[];
  g_cd: any;
  s_cd: any;
  data: any;
  isViewDisabled: boolean;
  isActionDisabled: boolean;
  maxDate: Date;
  canShowMenu: boolean;
  isShowErr: boolean;
  loading: boolean = false;


  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private authService: AuthService, private excelService: ExcelService, private router: Router,
    private restAPIService: RestAPIService, private roleBasedService: RoleBasedService, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.isViewDisabled = this.isActionDisabled = true;
    this.MarginAmountCols = this.tableConstants.DoMarginAmount;
    this.data = this.roleBasedService.getInstance();
    this.maxDate = new Date();
  }

  onSelect() {
    let godownSelection = [];
    this.data = this.roleBasedService.instance;
    if (this.data !== undefined) {
      this.data.forEach(x => {
        godownSelection.push({ 'label': x.GName, 'value': x.GCode });
        this.godownOptions = godownSelection;
      });
    }
  }

  onSociety() {
    let SocietySelection = [];
    if (this.societyOptions === undefined) {
      const params = new HttpParams().set('GCode', this.g_cd.value);
      this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_GET, params).subscribe(res => {
        var result = Array.from(new Set(res.map((item: any) => item.SocietyName)));
        var code = Array.from(new Set(res.map((item: any) => item.SocietyType)));
        for (var index in result && code) {
          SocietySelection.push({ 'label': result[index], 'value': code[index] });
        }
        this.societyOptions = SocietySelection;
      });
    }
  }

  onView() {
    this.checkValidDateSelection();
    this.loading = true;
    const params = {
      'FromDate': this.datePipe.transform(this.fromDate, 'MM/dd/yyy'),
      'ToDate': this.datePipe.transform(this.toDate, 'MM/dd/yyy'),
      'GCode': this.g_cd.value,
      'SCode': this.s_cd.value
    };
    this.restAPIService.post(PathConstants.DELIVERY_ORDER_MARGIN_AMOUNT_POST, params).subscribe(res => {
      this.MarginAmountData = res;
      let sno = 0;
      this.MarginAmountData.forEach(data => {
        data.Dodate = this.datePipe.transform(data.Dodate, 'dd-MM-yyyy');
        data.Nkgs = (data.Nkgs * 1).toFixed(3);
        sno += 1;
        data.SlNo = sno;
      });
      if (res !== undefined && res.length !== 0) {
        this.isActionDisabled = false;
        this.loading = false;
      } else {
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
    this.MarginAmountData = [];
    this.isActionDisabled = true;
  }

  exportAsXLSX(): void {
    var MarginAmountData = [];
    this.MarginAmountData.forEach(data => {
      MarginAmountData.push({ SlNo: data.SlNo, Coop: data.Coop, Dono: data.Dono, Dodate: data.Dodate, Comodity: data.Comodity, Scheme: data.Scheme, Quantity: data.Quantity, Rate: data.Rate, Amount: data.Amount });
    });
    this.excelService.exportAsExcelFile(MarginAmountData, 'DO_MARGIN_AMOUNT', this.MarginAmountCols);
  }

  onPrint() { }
}
