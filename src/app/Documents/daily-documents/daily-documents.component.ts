import { Component, OnInit } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { DatePipe } from '@angular/common';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpErrorResponse } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-daily-documents',
  templateUrl: './daily-documents.component.html',
  styleUrls: ['./daily-documents.component.css']
})
export class DailyDocumentsComponent implements OnInit {
  DailyDocumentTotalCols: any;
  DailyDocumentTotalData: any;
  DailyDocumentReceiptCols: any;
  DailyDocumentReceiptData: any;
  g_cd: any;
  gCode: any;
  rCode: any;
  r_cd: any;
  DocumentDate: Date;
  roleId: any;
  gdata: any;
  // Docdate: any;
  godownName: SelectItem[];
  disableOkButton: boolean = true;
  userid: any;
  maxDate: Date;
  loading: boolean;
  viewPane: boolean;
  selectedRow: any;
  viewDate: Date = new Date();
  godownOptions: SelectItem[];
  canShowMenu: boolean;

  constructor(private tableConstants: TableConstants, private messageService: MessageService, private restAPIService: RestAPIService, private datepipe: DatePipe, private roleBasedService: RoleBasedService, private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.gdata = this.roleBasedService.getInstance();
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.rCode = JSON.parse(this.authService.getUserAccessible().rCode);
    this.DailyDocumentTotalCols = this.tableConstants.DailyDocumentTotalReport;
    this.DailyDocumentReceiptCols = this.tableConstants.DailyDocumentReceipt;
    this.maxDate = new Date();
    this.userid = JSON.parse(this.authService.getCredentials());
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

  onTotal() {
    this.DailyDocumentTotalData = [];
    this.DailyDocumentReceiptData = [];
    // this.checkValidDateSelection();
    const params = {
      'GodownCode': this.g_cd.value,
      'RegionCode': this.g_cd.rcode,
      'RoleId': this.roleId,
      'DocumentDate': this.datepipe.transform(this.DocumentDate, 'MM/dd/yyyy')
    }
    this.restAPIService.post(PathConstants.DAILY_DOCUMENT_RECEIPT_POST, params).subscribe(res => {
      this.DailyDocumentTotalData = res;
      // this.DailyDocumentReceiptData = res;
      // let sno = 0;
      // this.DailyDocumentReceiptData.forEach(data => {
      //   data.NetWt = (data.NetWt * 1).toFixed(3);
      //   sno += 1;
      //   data.SlNo = sno;
      // })
      this.DailyDocumentTotalData.forEach(res => {
        
        res.rcode = this.g_cd.rcode,
        res.gCode = this.g_cd.value
      })
      if (res !== undefined && res.length !== 0)
       {
          this.messageService.add({ key: 't-success', severity: 'success', summary: 'Success Message', detail: 'Saved Successfully!' });
        } else {
          this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message', detail: 'Please try again!' });
        }
      this.DailyDocumentTotalCols.push(res);
    })
  }

}

// this.checkValidDateSelection();
// this.loading = true;
// const params = {
//   'FromDate': this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'),
//   'ToDate': this.datePipe.transform(this.toDate, 'MM/dd/yyyy'),
//   'UserName': this.username.user,
//   'GCode': this.g_cd.value
// }
// this.restAPIService.post(PathConstants.STOCK_TRUCK_MEMO_REPORT, params).subscribe(res => {
//   this.truckMemoRegData = res;
//   let sno = 0;
//   this.truckMemoRegData.forEach(data => {
//     data.Issue_Date = this.datePipe.transform(data.Issue_Date, 'dd-MM-yyyy');
//     data.NetWt = (data.NetWt * 1).toFixed(3);
//     sno += 1;
//     data.SlNo = sno;
//   })
//   if (res !== undefined && res.length !== 0) {
//     this.isActionDisabled = false;
//   } else {
//     this.messageService.add({ key: 't-err', severity: 'warn', summary: 'Warning!', detail: 'No record for this combination' });
//   }
//   this.loading = false;
// }, (err: HttpErrorResponse) => {
//   if (err.status === 0) {
//   this.loading = false;
//   this.router.navigate(['pageNotFound']);
//   }
// })  }
