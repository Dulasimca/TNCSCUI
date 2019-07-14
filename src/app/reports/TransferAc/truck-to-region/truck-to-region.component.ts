import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { SelectItem, MessageService } from 'primeng/api';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-truck-to-region',
  templateUrl: './truck-to-region.component.html',
  styleUrls: ['./truck-to-region.component.css']
  
})
export class TruckToRegionComponent implements OnInit {
  TruckToRegionCols: any;
  TruckToRegionData: any;
  fromDate: any;
  toDate: any;
  godownOptions: SelectItem[];
  g_cd: any;
  data: any;
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
    this.isActionDisabled = true;
    this.TruckToRegionCols = this.tableConstants.TruckToRegionReport;
    this.data = this.roleBasedService.getInstance();
    this.maxDate = new Date();
  }

  onSelect() {
    let options = [];
    if(this.data.godownData !== undefined) {
      this.data.godownData.forEach(x => {
      options.push({ 'label': x.GName, 'value': x.GCode });
      this.godownOptions = options;
    });
  }
  }

  onView() {
    this.checkValidDateSelection();
    // this.loading = true;
    const params = new HttpParams().set('Fdate', this.datePipe.transform(this.fromDate, 'MM-dd-yyyy')).append('ToDate', this.datePipe.transform(this.toDate, 'MM-dd-yyyy')).append('GCode', this.g_cd.value);
    this.restAPIService.getByParameters(PathConstants.TRUCK_TO_REGION_REPORT, params).subscribe(res => {
      this.TruckToRegionData = res;
      let sno = 0;
      this.TruckToRegionData.forEach(data => {
        data.Date = this.datePipe.transform(data.Date, 'dd-MM-yyyy');
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
    })
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
          this.messageService.add({ key: 't-err', severity: 'error', summary: 'Invalid Date', detail: 'Please select a valid date range' });
          this.fromDate = this.toDate = '';
      }
      return this.fromDate, this.toDate;
    }
  }
  onResetTable() {
    this.TruckToRegionData = [];
    this.isActionDisabled = true;
  }

  exportAsXLSX():void{
    this.excelService.exportAsExcelFile(this.TruckToRegionData, 'Truck_To_Region',this.TruckToRegionCols);
}
}