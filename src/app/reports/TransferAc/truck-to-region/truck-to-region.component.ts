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
    this.TruckToRegionCols = this.tableConstants.TruckToRegionReport;
    this.data = this.roleBasedService.getInstance();
    this.maxDate = new Date();
  }

  onSelect() {
    let options = [];
    if (this.fromDate !== undefined && this.toDate !== undefined
      && this.g_cd !== '' && this.g_cd !== undefined) {
      this.isViewDisabled = false;
    }
    if(this.data !== undefined) {
      this.data.forEach(x => {
      options.push({ 'label': x.GName, 'value': x.GCode });
      this.godownOptions = options;
    });
  }
  }

  onView() {
    this.checkValidDateSelection();
    this.loading = true;
    const params = new HttpParams().set('Fdate', this.datePipe.transform(this.fromDate, 'MM-dd-yyyy')).append('ToDate', this.datePipe.transform(this.toDate, 'MM-dd-yyyy')).append('GCode', this.g_cd);
    this.restAPIService.getByParameters(PathConstants.TRUCK_TO_REGION_REPORT, params).subscribe(res => {
      this.TruckToRegionData = res;
      let sno = 0;
      this.TruckToRegionData.forEach(data => {
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
      && this.g_cd !== '' && this.g_cd !== undefined) {
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

  // validatedate(inputText)
  // {
  // var dateformat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
  // // Match the date format through regular expression
  // if(inputText.value.match(dateformat))
  // {
  // document.forms.text1.focus();
  // //Test which seperator is used '/' or '-'
  // var opera1 = inputText.value.split('/');
  // var opera2 = inputText.value.split('-');
  // lopera1 = opera1.length;
  // lopera2 = opera2.length;
  // // Extract the string into month, date and year
  // if (lopera1>1)
  // {
  // var pdate = inputText.value.split('/');
  // }
  // else if (lopera2>1)
  // {
  // var pdate = inputText.value.split('-');
  // }
  // var dd = parseInt(pdate[0]);
  // var mm  = parseInt(pdate[1]);
  // var yy = parseInt(pdate[2]);
  // // Create list of days of a month [assume there is no leap year by default]
  // var ListofDays = [31,28,31,30,31,30,31,31,30,31,30,31];
  // if (mm==1 || mm>2)
  // {
  // if (dd>ListofDays[mm-1])
  // {
  // alert('Invalid date format!');
  // return false;
  // }
  // }
  // if (mm==2)
  // {
  // var lyear = false;
  // if ( (!(yy % 4) && yy % 100) || !(yy % 400)) 
  // {
  // lyear = true;
  // }
  // if ((lyear==false) && (dd>=29))
  // {
  // alert('Invalid date format!');
  // return false;
  // }
  // if ((lyear==true) && (dd>29))
  // {
  // alert('Invalid date format!');
  // return false;
  // }
  // }
  // }
  // else
  // {
  // alert("Invalid date format!");
  // document.form1.text1.focus();
  // return false;
  // }
  // }
  onResetTable() {
    this.TruckToRegionData = [];
    this.isActionDisabled = true;
  }

  exportAsXLSX():void{
    this.excelService.exportAsExcelFile(this.TruckToRegionData, 'Truck_To_Region',this.TruckToRegionCols);
}
}