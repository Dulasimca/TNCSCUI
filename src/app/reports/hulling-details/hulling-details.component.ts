import { Component, OnInit } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hulling-details',
  templateUrl: './hulling-details.component.html',
  styleUrls: ['./hulling-details.component.css']
})
export class HullingDetailsComponent implements OnInit {
  hullingDetailsCols: any;
  hullingDetailsData: any;
  fromDate: any;
  toDate: any;
  isViewDisabled: any;
  isActionDisabled: any;
  data: any;
  g_cd: any;
  godownOptions: SelectItem[];
  truckName: string;
  canShowMenu: boolean;
  maxDate: Date;
  loading: boolean = false;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private messageService: MessageService, private authService: AuthService,
    private excelService: ExcelService, private restAPIService: RestAPIService,
    private roleBasedService: RoleBasedService, private router: Router) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.isViewDisabled = this.isActionDisabled = true;
    this.hullingDetailsCols = this.tableConstants.HullingDetailsReport;
    this.data = this.roleBasedService.getInstance();
    this.maxDate = new Date();
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
    const params = new HttpParams().set('Fdate', this.datePipe.transform(this.fromDate, 'MM-dd-yyyy')).append('ToDate', this.datePipe.transform(this.toDate, 'MM-dd-yyyy')).append('GCode', this.g_cd.value);
    this.restAPIService.getByParameters(PathConstants.HULLING_DETAILS_REPORT, params).subscribe(res => {
      this.hullingDetailsData = res;
      let sno = 0;
      this.hullingDetailsData.forEach(data => {
        data.SRDate = this.datePipe.transform(data.SRDate, 'dd-MM-yyyy');
        data.Nkgs = (data.Nkgs * 1).toFixed(3);
        sno += 1;
        data.SlNo = sno;
      })
      if (res !== undefined && res.length !== 0) {
        this.isActionDisabled = false;
      } else {
        this.messageService.add({ key: 't-err', severity: 'warn', summary: 'Warning!', detail: 'No record for this combination' });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0) {
      this.loading = false;
      this.router.navigate(['pageNotFound']);
      }
    })  }

  onResetTable() {
    this.hullingDetailsData = [];
    this.isActionDisabled = true;
  }

  onDateSelect() {
    this.checkValidDateSelection();
    if (this.fromDate !== undefined && this.toDate !== undefined && 
      this.g_cd !== '' && this.g_cd !== undefined && this.g_cd !== null) {
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

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.hullingDetailsData, 'Hulling_Details', this.hullingDetailsCols);
  }
}
