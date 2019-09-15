// import { Component, OnInit } from '@angular/core';
// import { SelectItem, MessageService } from 'primeng/api';
// import { TableConstants } from '../constants/tableconstants';
// import { DatePipe } from '@angular/common';
// import { AuthService } from '../shared-services/auth.service';
// import { ExcelService } from '../shared-services/excel.service';
// import { Router } from '@angular/router';
// import { RestAPIService } from '../shared-services/restAPI.service';
// import { RoleBasedService } from '../common/role-based.service';
// import { HttpParams, HttpErrorResponse } from '@angular/common/http';
// import { PathConstants } from '../constants/path.constants';

// @Component({
//   selector: 'app-opening-balance',
//   templateUrl: './opening-balance.component.html',
//   styleUrls: ['./opening-balance.component.css']
// })
// export class OpeningBalanceComponent implements OnInit {
//   StackWiseCols: any;
//   StackWiseData: any;
//   SchemeWiseCols: any;
//   SchemeWiseData: any;
//   godownOptions: SelectItem[];
//   g_cd: any;
//   data: any;
//   isViewDisabled: boolean;
//   isActionDisabled: boolean;
//   maxDate: Date;
//   canShowMenu: boolean;
//   isShowErr: boolean;
//   loading: boolean = false;

//   constructor(private tableConstants: TableConstants, private datePipe: DatePipe, 
//     private authService: AuthService, private excelService: ExcelService, private router: Router,
//     private restAPIService: RestAPIService, private roleBasedService: RoleBasedService, private messageService: MessageService) { }

//   ngOnInit() {
//     this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
//     this.isViewDisabled = this.isActionDisabled = true;
//     this.StackWiseCols = this.tableConstants.StackWiseBreakupDetails;
//     this.SchemeWiseCols = this.tableConstants.SchemeWiseBreakupDetails;
//     this.data = this.roleBasedService.getInstance();
//     this.maxDate = new Date();
//   }
  
//   onStackResetTable() {
//     this.StackWiseData = [];
//     this.isActionDisabled = true;
//   }

//   onSchemeResetTable() {
//     this.SchemeWiseData = [];
//     this.isActionDisabled = true;
//   }

//   onExportExcel():void{
//     this.excelService.exportAsExcelFile(this.StackWiseData, 'STACK_WISE_BREAKUP_DEATILS',this.StackWiseCols);
// }
//  onExportToExcel():void{
//   this.excelService.exportAsExcelFile(this.SchemeWiseData, 'STOCK_RECEIPT_REGISTER_REPORT',this.SchemeWiseCols);
// }
// }
