import { Component, OnInit, ViewChild } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { SelectItem, MessageService } from 'primeng/api';
import { StatusMessage } from 'src/app/constants/Messages';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { Router } from '@angular/router';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Dropdown } from 'primeng/primeng';


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
  receiverOptions: SelectItem[];
  godownOptions: SelectItem[];
  societyOptions: SelectItem[];
  transactionOptions: SelectItem[];
  s_cd: any;
  r_cd: any;
  g_cd: any;
  t_cd: any;
  gCode: any;
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
  loading: boolean;
  @ViewChild('receiver') receivorTypePanel: Dropdown;
  @ViewChild('society') partyNamePanel: Dropdown;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe, private messageService: MessageService,
    private authService: AuthService, private excelService: ExcelService, private router: Router,
    private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    this.gCode = this.authService.getUserAccessible().gCode;
    this.isActionDisabled = true;
    this.maxDate = new Date();
  }

  onGodown() {
    let godownSelection = [];
    this.data = this.roleBasedService.instance;
    if (this.data !== undefined) {
      this.data.forEach(x => {
        godownSelection.push({ 'label': x.GName, 'value': x.GCode });
        this.godownOptions = godownSelection;
      });
    }
  }

  onSelect(item) {
    switch (item) {
      case 't':
        if (this.transactionOptions === undefined && this.receiverOptions === undefined && this.societyOptions === undefined) {
          this.restAPIService.get(PathConstants.TRANSACTION_MASTER).subscribe(s => {
            s.forEach(c => {
              if (c.TransType === 'I') {
                this.TransactionSelection.push({ 'label': c.TRName, 'value': c.TRCode });
              }
              this.transactionOptions = this.TransactionSelection;
            });
          });
        }
        break;
      case 'r':
        {
          const params = new HttpParams().set('TRCode', this.t_cd.value);
          this.restAPIService.getByParameters(PathConstants.DEPOSITOR_TYPE_MASTER, params).subscribe(res => {
            res.forEach(s => {
              this.ReceiverSelection.push({ 'label': s.Tyname, 'value': s.Tycode });
            });
            this.receiverOptions = this.ReceiverSelection;
          });
        }
        break;
      //   case 's':
      //     const params = new HttpParams().set('GCode', this.g_cd.value);
      //     this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_GET, params).subscribe(res => {
      //       var result = Array.from(new Set(res.map((item: any) => item.SocietyName)));
      //       var code = Array.from(new Set(res.map((item: any) => item.SocietyCode)));
      //       for (var index in result && code) {
      //         this.SocietySelection.push({ 'label': result[index], 'value': code[index] });
      //       }
      //       this.societyOptions = this.SocietySelection;
      //     });
    }
  }

  onSociety() {
    if (this.societyOptions === undefined) {
      const params = new HttpParams().set('GCode', this.g_cd.value);
      this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_GET, params).subscribe(res => {
        var result = Array.from(new Set(res.map((item: any) => item.SocietyName)));
        var code = Array.from(new Set(res.map((item: any) => item.SocietyCode)));
        for (var index in result && code) {
          this.SocietySelection.push({ 'label': result[index], 'value': code[index] });
        }
        this.societyOptions = this.SocietySelection;
      });
    }
  }

  // onView() {
  //   const params = {
  //     'GCode': this.gCode,
  //     'SCode': this.s_cd.value,
  //     'TCode': this.r_cd.value,
  //     'Fdate': this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'),
  //     'Tdate': this.datePipe.transform(this.toDate, 'MM/dd/yyyy'),
  //   };
  //   this.restAPIService.post(PathConstants.ISSUE_MEMO_CUTOMER_DETAILS_POST, params).subscribe(res => {
  //     this.IssueData = res;
  //     if (res !== undefined) {
  //       this.IssueMemoCustomerDetailsData = res;
  //     }
  //   });
  // }

  // onSelect(selectedItem, type) {
  //     let godownSelection = [];
  //     switch (selectedItem) {
  //       case 'gd':
  //         this.data = this.roleBasedService.instance;
  //         if (this.data !== undefined) {
  //           this.data.forEach(x => {
  //             godownSelection.push({ 'label': x.GName, 'value': x.GCode });
  //             this.godownOptions = godownSelection;
  //           });
  //         }
  //         break;
  //       case 'receiver':
  //         if (type === 'enter') {
  //           this.receivorTypePanel.overlayVisible = true;
  //         }
  //         if (this.Trcode === null && this.Trcode === undefined) {
  //           if ((this.Trcode.value === undefined && this.Trcode.value === null) ||
  //             (this.trCode === null && this.trCode === undefined)) {
  //             const params = new HttpParams().set('TRCode', (this.Trcode.value !== undefined) ? this.Trcode.value : this.trCode).append('GCode', this.gCode);
  //             this.restAPIService.getByParameters(PathConstants.DEPOSITOR_TYPE_MASTER, params).subscribe((res: any) => {
  //               if (res !== null && res !== undefined && res.length !== 0) {
  //                 res.forEach(dt => {
  //                   this.ReceiverSelection.push({ 'label': dt.Tyname, 'value': dt.Tycode });
  //                 });
  //                 this.receiverOptions = this.ReceiverSelection;
  //               }
  //               // this.isReceivorNameDisabled = false;
  //               this.receiverOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
  //             });
  //           }
  //         } else {
  //           this.receiverOptions = this.ReceiverSelection;
  //         }
  //         break;
  //         case 'society':
  //           if (this.societyOptions === undefined) {
  //             const params = new HttpParams().set('GCode', this.g_cd.value);
  //             this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_GET, params).subscribe(res => {
  //               this.Type = res;
  //               if (this.Type !== undefined && this.Type !== 0) {
  //                 this.Type = res.filter((value: { Tyname: any; }) => { return res.Tyname === this.societyOptions });
  //                 this.societyOptions = this.SocietySelection;
  //                 this.societyOptions.unshift({ 'label': '-select-', 'value': null, disabled: true }, { 'label': 'CRS', 'value': this.societyOptions }, { 'label': 'COPERATIVES LEADING', 'value': this.societyOptions });
  //               }
  //             });
  //           }
  //           break;
  //     }
  //   }


  onView() {
    const params = {
      'GCode': this.gCode,
      'SCode': this.s_cd.value,
      'TCode': this.r_cd.value,
      'Fdate': this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'),
      'Tdate': this.datePipe.transform(this.toDate, 'MM/dd/yyyy'),
    };
    this.IssueMemoCustomerDetailsCols = this.tableConstants.IssueMemoCustomerDeatil;
    this.restAPIService.post(PathConstants.ISSUE_MEMO_CUTOMER_DETAILS_POST, params).subscribe(res => {
      this.IssueMemoCustomerDetailsData = res;
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
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
      }
      this.loading = false;
    }, (err: HttpErrorResponse) => {
      if (err.status === 0) {
        this.loading = false;
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
    this.AbstractCols = this.AbstractData = [];
  }

  onAbstract() {
    const params = {
      'GCode': this.gCode,
      'FDate': this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'),
      'ToDate': this.datePipe.transform(this.toDate, 'MM/dd/yyyy')
    };
    this.AbstractCols = this.tableConstants.IssueMemoAbstract;
    this.restAPIService.getByParameters(PathConstants.ISSUE_MEMO_CUTOMER_ABSTRACT_GET, params).subscribe(res => {
      this.AbstractData = res;
      let sno = 0;
      this.IssueMemoCustomerDetailsData.forEach(data => {
        // data.Date = this.datePipe.transform(data.Date, 'dd/MM/yyyy');
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
    }, (err: HttpErrorResponse) => {
      if (err.status === 0) {
        this.loading = false;
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
    this.IssueMemoCustomerDetailsCols = this.IssueMemoCustomerDetailsData = [];
  }

  onResetTable() {
    this.isActionDisabled = true;
    // this.TransactionSelection = [];
    // this.ReceiverSelection = [];
    // this.AbstractData = this.AbstractCols = this.IssueMemoCustomerDetailsCols = this.IssueMemoCustomerDetailsData = [];
  }

  onClear() {
    //  this.AbstractData = this.AbstractCols = this.IssueMemoCustomerDetailsCols = this.IssueMemoCustomerDetailsData = [];
    // this.IssueMemoCustomerDetailsCols = this.IssueMemoCustomerDetailsData = [];
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
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_INVALID, detail: StatusMessage.ValidDateErrorMessage });
        this.fromDate = this.toDate = '';
      }
      return this.fromDate, this.toDate;
    }
  }
}
