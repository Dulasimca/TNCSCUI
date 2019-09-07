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
import { HttpParams } from '@angular/common/http';
import { Dropdown } from 'primeng/primeng';


@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {
  IssueMemoCustomerDetailsData: any;
  IssueMemoCustomerDetailsCols: any;
  IssueData: any;
  canShowMenu: boolean;
  receiverOptions: SelectItem[];
  godownOptions: SelectItem[];
  societyOptions: SelectItem[];
  s_cd: any;
  r_cd: any;
  g_cd: any;
  Type: any;
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
  Trcode: any;
  trCode: any;
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
    this.IssueMemoCustomerDetailsCols = this.tableConstants.IssueMemoCustomerDeatil;
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

  // onSelect(item) {
  //   let godownSelection = [];
  //   let typeSelection = [];
  //   switch (item) {
  //     case 'gd':
  //       this.data = this.roleBasedService.instance;
  //       if (this.data !== undefined) {
  //         this.data.forEach(x => {
  //           godownSelection.push({ 'label': x.GName, 'value': x.GCode });
  //           this.godownOptions = godownSelection;
  //         });
  //       }
  //       break;
  //     case 'receiver':
  //       if (this.receiverOptions === undefined) {
  //         const params = new HttpParams().set('GCode', this.g_cd.value);
  //         this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_GET, params).subscribe(res => {
  //           this.Type = res;
  //           if (this.Type !== undefined && this.Type !== 0) {
  //             this.Type = res.filter((value: { Tyname: any; }) => { return res.Tyname === this.receiverOptions });
  //             this.receiverOptions = typeSelection;
  //             this.receiverOptions.unshift({ 'label': '-select-', 'value': null, disabled: true }, { 'label': 'CRS', 'value': this.receiverOptions }, { 'label': 'COPERATIVES LEADING', 'value': this.receiverOptions });
  //           }
  //         });
  //       }
  //       break;
  //       case 'society':
  //         if (this.societyOptions === undefined) {
  //           const params = new HttpParams().set('GCode', this.g_cd.value);
  //           this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_GET, params).subscribe(res => {
  //             this.Type = res;
  //             if (this.Type !== undefined && this.Type !== 0) {
  //               this.Type = res.filter((value: { Tyname: any; }) => { return res.Tyname === this.societyOptions });
  //               this.societyOptions = typeSelection;
  //               this.societyOptions.unshift({ 'label': '-select-', 'value': null, disabled: true }, { 'label': 'CRS', 'value': this.societyOptions }, { 'label': 'COPERATIVES LEADING', 'value': this.societyOptions });
  //             }
  //           });
  //         }
  //         break;
  //   }
  // }

  // onSelect() {
  //   if (this.societyOptions === undefined && this.receiverOptions === undefined) {
  //     const params = new HttpParams().set('GCode', this.gCode);
  //     this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_ENTRY_GET, params).subscribe(res => {

  //       if (res !== undefined) {
  //         var result = Array.from(new Set(res.map((item: any) => item.Tyname))); //Get distinct values from array
  //         var code = Array.from(new Set(res.map((item: any) => item.Tycode)));
  //         for (var index in result && code) {
  //           this.ReceiverSelection.push({ 'label': result[index], 'value': code[index] });
  //         }
  //         this.receiverOptions = this.ReceiverSelection;
  //         var result = Array.from(new Set(res.map((item: any) => item.Societyname))); //Get distinct values from array
  //         var code = Array.from(new Set(res.map((item: any) => item.SocietyCode)));
  //         for (var index in result && code) {
  //           this.SocietySelection.push({ 'label': result[index], 'value': code[index] });
  //         }
  //         this.societyOptions = this.SocietySelection;
  //       }
  //     });
  //   }
  // }

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
    this.restAPIService.post(PathConstants.ISSUE_MEMO_CUTOMER_DETAILS_POST, params).subscribe(res => {
      this.IssueData = res;
      if (res !== undefined) {
        this.IssueMemoCustomerDetailsData = res;
      }
    });
  }

  onResetTable() {
    this.isActionDisabled = true;
  }

  onDateSelect() {
    this.checkValidDateSelection();
    this.onResetTable();
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
