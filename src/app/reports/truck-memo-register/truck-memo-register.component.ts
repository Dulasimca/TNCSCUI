import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { SelectItem, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { GolbalVariable } from 'src/app/common/globalvariable';

@Component({
  selector: 'app-truck-memo-register',
  templateUrl: './truck-memo-register.component.html',
  styleUrls: ['./truck-memo-register.component.css']
})
export class TruckMemoRegisterComponent implements OnInit {
  truckMemoRegCols: any;
  truckMemoRegData: any;
  fromDate: any;
  toDate: any;
  isViewDisabled: any;
  isActionDisabled: any;
  data: any;
  godownOptions: SelectItem[];
  g_cd: any;
  truckOptions: SelectItem[];
  truckName: string;
  canShowMenu: boolean;
  maxDate: Date;
  loading: boolean;
  username: any;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,private messageService: MessageService,
    private authService: AuthService, private excelService: ExcelService, private router: Router,
     private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.isViewDisabled = this.isActionDisabled = true;
    this.truckMemoRegCols = this.tableConstants.TruckMemoRegisterReport;
    this.data = this.roleBasedService.getInstance();
    this.maxDate = new Date();
    this.username = JSON.parse(this.authService.getCredentials());
  }

  onSelect() {
    let options = [];
    if (this.fromDate !== undefined && this.toDate !== undefined
      && this.g_cd.value !== '' && this.g_cd.value !== undefined && this.g_cd !== null) {
      this.isViewDisabled = false;
    }
    if (this.data.godownData !== undefined) {
      this.data.godownData.forEach(x => {
      options.push({ 'label': x.GName, 'value': x.GCode });
      this.godownOptions = options;
    });
  }
  }

  onView() {
    this.checkValidDateSelection();
    this.loading = true;
    const params = {
      'FromDate': this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'),
      'ToDate': this.datePipe.transform(this.toDate, 'MM/dd/yyyy'),
      'UserName': this.username.user,
      'GCode': this.g_cd.value
    }
    this.restAPIService.post(PathConstants.STOCK_TRUCK_MEMO_REPORT, params).subscribe(res => {
      this.truckMemoRegData = res;
      let sno = 0;
      this.truckMemoRegData.forEach(data => {
        data.Issue_Date = this.datePipe.transform(data.Issue_Date, 'dd-MM-yyyy');
        sno += 1;
        data.SlNo = sno;
      })
      if (res !== undefined && res.length !== 0) {
        this.isActionDisabled = false;
      } else {
        this.messageService.add({ key: 't-err', severity: 'warn', summary: 'Warning!', detail: 'No record for this combination' });
      }
      this.loading = false;
    }, (err: HttpErrorResponse) => {
      if (err.status === 0) {
      this.loading = false;
      this.router.navigate(['pageNotFound']);
      }
    })  }

  onDateSelect() {
    this.checkValidDateSelection();
    this.onResetTable();
    if (this.fromDate !== undefined && this.toDate !== undefined
      && this.g_cd.value !== '' && this.g_cd.value !== undefined && this.g_cd !== null) {
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
          this.messageService.add({ key: 't-err', severity: 'error', summary: 'Invalid Date', detail: 'Please select a valid date range' });
          this.fromDate = this.toDate = '';
      }
      return this.fromDate, this.toDate;
    }
  }

  onResetTable() {
    this.truckMemoRegData = [];
    this.isActionDisabled = true;
  }

  exportAsXLSX():void{
    this.excelService.exportAsExcelFile(this.truckMemoRegData, 'TRUCK_MEMO_REGISTER_REPORT',this.truckMemoRegCols);
}

onPrint() {
  const path = "../../assets/Reports/" + this.username.user + "/";
  const filename = this.g_cd.value + GolbalVariable.StocTruckMemoRegFilename + ".txt";
  saveAs(path + filename, filename);
}
}