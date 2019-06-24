import { Component, OnInit } from '@angular/core';
import { TableConstants } from '../constants/tableconstants';
import { DatePipe } from '@angular/common';
import { AuthService } from '../shared-services/auth.service';
import { ExcelService } from '../shared-services/excel.service';
import { Router } from '@angular/router';
import { RestAPIService } from '../shared-services/restAPI.service';
import { RoleBasedService } from '../common/role-based.service';
import { MessageService, SelectItem } from 'primeng/api';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from '../constants/path.constants';

@Component({
  selector: 'app-truck-transit',
  templateUrl: './truck-transit.component.html',
  styleUrls: ['./truck-transit.component.css']
})
export class TruckTransitComponent implements OnInit {
  TruckTransitCols: any;
  TruckTransitData: any;
  TruckReceiverCols: any;
  TruckReceiverData: any;
  fromDate: any;
  toDate: any;
  transferOptions: SelectItem[];
  t_cd: any;
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
    this.TruckTransitCols = this.tableConstants.TruckTransitSender;
    this.TruckReceiverCols = this.tableConstants.TruckTransitReceiver;
    this.data = this.roleBasedService.getInstance();
    this.maxDate = new Date();
  }

  onSelect() {
    let options = [];
    if (this.fromDate !== undefined && this.toDate !== undefined
      && this.t_cd !== '' && this.t_cd !== undefined) {
      this.isViewDisabled = false;
    }
    if(this.data !== undefined) {
      this.data.forEach(x => {
        options.push({'label':x.Transfertype});
      // options.push({ 'label': x.GName, 'value': x.GCode });
      this.transferOptions = options;
    });
  }
  }

  onView() {
    this.checkValidDateSelection();
    this.loading = true;
    const params = new HttpParams().set('Fdate', this.datePipe.transform(this.fromDate, 'MM-dd-yyyy')).append('ToDate', this.datePipe.transform(this.toDate, 'MM-dd-yyyy')).append('GCode', this.t_cd);
    this.restAPIService.getByParameters(PathConstants.TRUCK_TRANSIT, params).subscribe(res => {
      this.TruckTransitData = res;
      let sno = 0;
      this.TruckTransitData.forEach(data => {
        data.Date = this.datePipe.transform(data.Date, 'dd-MM-yyyy');
        sno += 1;
        data.SlNo = sno;
      })
      if (res !== undefined && res.length !== 0) {
        this.isActionDisabled = false;
      } else {
        this.messageService.add({ key: 't-date', severity: 'warn', summary: 'Warning!', detail: 'No record for this combination' });
      }
      this.loading = false;
    }, (err: HttpErrorResponse) => {
      if (err.status === 0) {
      this.loading = false;
      this.router.navigate(['pageNotFound']);
      }
    })
  }
  onDateSelect() {
    this.checkValidDateSelection();
    this.onResetTable();
    if (this.fromDate !== undefined && this.toDate !== undefined
      && this.t_cd !== '' && this.t_cd !== undefined) {
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
        if (selectedFromMonth !== selectedToMonth || selectedFromYear !== selectedToYear) {
          this.messageService.add({ key: 't-date', severity: 'error', summary: 'Invalid Date', detail: 'Please select a date within a month' });
          this.isShowErr = true;
          this.fromDate = this.toDate = '';
        } else if (selectedFromDate >= selectedToDate) {
          this.messageService.add({ key: 't-date', severity: 'error', summary: 'Invalid Date', detail: 'Please select a valid date range' });
          this.fromDate = this.toDate = '';
        }
      return this.fromDate, this.toDate;
    }
  }
  onResetTable() {
    this.TruckTransitData = [];
    this.isActionDisabled = true;
  }

  exportAsXLSX():void{
    this.excelService.exportAsExcelFile(this.TruckTransitData, 'Truck_Transit',this.TruckTransitCols);
    this.excelService.exportAsExcelFile(this.TruckTransitData, 'Truck_Transit',this.TruckReceiverCols);
}
}
 