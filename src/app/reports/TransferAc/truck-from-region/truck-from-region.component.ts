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
  selector: 'app-truck-from-region',
  templateUrl: './truck-from-region.component.html',
  styleUrls: ['./truck-from-region.component.css']
})
export class TruckFromRegionComponent implements OnInit {
  TruckFromRegionCols: any;
  TruckFromRegionData: any;
  fromDate: any;
  toDate: any;
  godownOptions: SelectItem[];
  // selectedValues: string[] = ['Road'];
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
    this.TruckFromRegionCols = this.tableConstants.TruckFromRegionReport;
    this.data = this.roleBasedService.getInstance();
    this.maxDate = new Date();
  }

  onSelect() {
    let options = [];
    this.data = this.roleBasedService.instance;
    if (this.data !== undefined) {
      this.data.forEach(x => {
        options.push({ 'label': x.GName, 'value': x.GCode });
        this.godownOptions = options;
      });
    }
  }

  onView() {
    this.checkValidDateSelection();
    this.loading = true;
    const params = new HttpParams().set('Fdate', this.datePipe.transform(this.fromDate, 'MM-dd-yyyy')).append('ToDate', this.datePipe.transform(this.toDate, 'MM-dd-yyyy')).append('GCode', this.g_cd.value);
    this.restAPIService.getByParameters(PathConstants.TRUCK_FROM_REGION_REPORT, params).subscribe(res => {
      this.TruckFromRegionData = res;
      let sno = 0;
      this.TruckFromRegionData.forEach(data => {
        data.SRDate = this.datePipe.transform(data.SRDate, 'dd-MM-yyyy');
        // this.selectedValues = [res[0].TransportMode];
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
    this.TruckFromRegionData = [];
    this.isActionDisabled = true;
  }

  // onSave() {
  //   this.messageService.clear();
  //   this.PAllotment = this.year + '/' + ((this.month.value !== undefined) ? this.month.value : this.curMonth);
  //   if (this.selectedValues.length !== 0) {
  //     if (this.selectedValues.length === 2) {
  //       this.MTransport = 'UPCountry';
  //     } else if (this.selectedValues.length === 1) {
  //       this.MTransport = (this.selectedValues[0] === 'Rail') ? 'Rail' : 'Road';
  //     }
  //   }

  exportAsXLSX(): void {
    var TruckFromRegion = [];
    this.TruckFromRegionData.forEach(data => {
      TruckFromRegion.push({ SlNo: data.SlNo, SRNo: data.SRNo, SRDate: data.SRDate, Tyname: data.Tyname, TNCSName: data.TNCSName, ITDescription: data.ITDescription, NoPacking: data.NoPacking, Nkgs: data.Nkgs })
    })
    this.excelService.exportAsExcelFile(TruckFromRegion, 'Truck_From_Region', this.TruckFromRegionCols);
  }
}