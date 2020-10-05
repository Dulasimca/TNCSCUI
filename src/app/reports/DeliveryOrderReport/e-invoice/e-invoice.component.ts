import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { SelectItem, MessageService } from 'primeng/api';
import { Dropdown } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { StatusMessage } from 'src/app/constants/Messages';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { saveAs } from 'file-saver';
import * as Rx from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-e-invoice',
  templateUrl: './e-invoice.component.html',
  styleUrls: ['./e-invoice.component.css']
})
export class EInvoiceComponent implements OnInit {
  EInvoiceCols: any;
  EInvoiceData: any = [];
  fromDate: any = new Date();
  toDate: any = new Date();
  godownOptions: SelectItem[];
  SchemeOptions: SelectItem[];
  transactionOptions: SelectItem[];
  receiverOptions: SelectItem[];
  regionOptions: SelectItem[];
  selectedValues: any;
  regions: any;
  t_cd: any;
  g_cd: any;
  s_cd: any;
  r_cd: any;
  sch_cd: any;
  RCode: any;
  Trcode: any;
  trcode: any;
  data: any;
  SchCode: any;
  GCode: any;
  SCode: any;
  FilterArray: any;
  maxDate: Date;
  roleId: any;
  canShowMenu: boolean;
  isShowErr: boolean;
  loading: boolean = false;
  loggedInRCode: any;
  userId: any;
  DoNumber: any;
  checkBox: any;
  DoCheck: boolean = false;
  EnDoNumber: boolean;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private authService: AuthService, private restAPIService: RestAPIService, private datepipe: DatePipe,
    private roleBasedService: RoleBasedService, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.EInvoiceCols = this.tableConstants.EInvoice;
    this.data = this.roleBasedService.getInstance();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.regions = this.roleBasedService.getRegions();
    this.maxDate = new Date();
    this.userId = JSON.parse(this.authService.getCredentials());
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
            if (x.RCode === this.RCode.value) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            }
          });
          this.godownOptions = godownSelection;
          if (this.roleId !== 3) {
            this.godownOptions.unshift({ label: 'All', value: 'All' });
          }
        } else {
          this.godownOptions = godownSelection;
        }
    }
  }

  onView() {
    this.loading = true;
    if (this.DoNumber !== undefined) {
      const params = {
        'DType': 1,
        'DONumber': this.DoNumber
      };
      this.restAPIService.post(PathConstants.E_INVOICE_POST, params).subscribe(res => {
        if (res !== null && res !== undefined && res.length !== 0) {
          this.EInvoiceData = res;
          this.loading = false;
          let sno = 0;
          this.EInvoiceData.forEach(data => {
            data.DoDate = this.datepipe.transform(data.DoDate, 'MM/dd/yyyy');
            sno += 1;
            data.SlNo = sno;
          });
        } else {
          this.loading = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
            summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination
          });
        }
      }, (err: HttpErrorResponse) => {
        if (err.status === 0 || err.status === 400) {
          this.loading = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
            summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
          });
        }
      });
    } else if (this.DoNumber === undefined) {
      const params = {
        'DType': 2,
        'GCode': this.GCode.value,
        'RCode': this.RCode.value,
        'fromdate': this.fromDate,
        'todate': this.toDate,
      };
      this.restAPIService.post(PathConstants.E_INVOICE_POST, params).subscribe(res => {
        if (res !== null && res !== undefined && res.length !== 0) {
          this.EInvoiceData = res;
          this.loading = false;
          let sno = 0;
          this.EInvoiceData.forEach(data => {
            data.DoDate = this.datepipe.transform(data.DoDate, 'MM/dd/yyyy');
            sno += 1;
            data.SlNo = sno;
          });
        } else {
          this.loading = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
            summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination
          });
        }
      }, (err: HttpErrorResponse) => {
        if (err.status === 0 || err.status === 400) {
          this.loading = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
            summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
          });
        }
      });
    }
  }

  oncheckbox() {
    if (this.checkBox == false) {
      this.DoCheck = false;
      this.EnDoNumber = false;
      this.DoNumber = undefined;
    } else {
      this.DoCheck = true;
      this.EnDoNumber = true;
      this.RCode = this.GCode = this.fromDate = this.toDate = undefined;
    }
  }

  showTrue(e: any) {
    if (this.checkBox == false) {
      this.DoCheck = false;
    } else {
      this.DoCheck = true;
    }
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
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR, life: 5000
          , summary: StatusMessage.SUMMARY_INVALID, detail: StatusMessage.ValidDateErrorMessage
        });
        this.fromDate = this.toDate = '';
      }
      return this.fromDate, this.toDate;
    }
  }

  onResetTable(item) {
    if (item === 'reg') { this.GCode = null; }
    this.EInvoiceData = [];
  }

  onPrint() {
    const path = "../../assets/Reports/" + this.userId.user + "/";
    const filename = this.GCode.value + GolbalVariable.EInvoice + ".txt";
    saveAs(path + filename, filename);
  }

  onClose() {
    this.messageService.clear('t-err');
  }

}
