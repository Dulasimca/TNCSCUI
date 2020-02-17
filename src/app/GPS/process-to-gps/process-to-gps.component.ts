import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Dropdown, MessageService } from 'primeng/primeng';
import { Table } from 'primeng/table';
import { DatePipe } from '@angular/common';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';

@Component({
  selector: 'app-process-to-gps',
  templateUrl: './process-to-gps.component.html',
  styleUrls: ['./process-to-gps.component.css']
})
export class ProcessToGPSComponent implements OnInit {
  canShowMenu: boolean;
  FromDate: Date;
  ToDate: Date;
  maxDate: Date = new Date();
  minDate: Date;
  GCode: any;
  RCode: any;
  regionOptions: SelectItem[];
  godownOptions: SelectItem[];
  data = [];
  loading: boolean;
  loggedInRCode: string;
  regions: any;
  roleId: any;
  processToGPSCols: any;
  processToGPSData: any = [];
  @ViewChild('region', { static: false }) regionPanel: Dropdown;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;
  @ViewChild('dt', { static: false }) table: Table;

  constructor(private tableConstants: TableConstants, private roleBasedService: RoleBasedService,
      private restAPIService: RestAPIService, private authService: AuthService,
      private messageService: MessageService, private datepipe: DatePipe) { }

  ngOnInit() {
      this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
      this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
      this.loggedInRCode = this.authService.getUserAccessible().rCode;
      this.data = this.roleBasedService.getInstance();
      this.regions = this.roleBasedService.getRegions();
      this.processToGPSCols = this.tableConstants.ProcessToGPSCols;
      let today = new Date();
      let date = today.getDate();
      let month = today.getMonth();
      let year = today.getFullYear();
      this.minDate = new Date();
      let formDate = (month + 1) + "-" + (date - 1) + "-" + year;
      this.minDate = new Date(formDate);

  }

  onSelect(item, type) {
      let regionSelection = [];
      let godownSelection = [];
      switch (item) {
          case 'reg':
              this.regions = this.roleBasedService.regionsData;
              if (type === 'enter') {
                  this.regionPanel.overlayVisible = true;
              }
              if (this.roleId === 1) {
                  if (this.regions !== undefined) {
                      this.regions.forEach(x => {
                          regionSelection.push({ 'label': x.RName, 'value': x.RCode });
                      });
                      this.regionOptions = regionSelection;
                  }
              } else {
                  if (this.regions !== undefined) {
                      this.regions.forEach(x => {
                          if (x.RCode === this.loggedInRCode) {
                              regionSelection.push({ 'label': x.RName, 'value': x.RCode });
                          }
                      });
                      this.regionOptions = regionSelection;
                  }
              }
              break;
          case 'gd':
              if (type === 'enter') {
                  this.godownPanel.overlayVisible = true;
              }
              this.data = this.roleBasedService.instance;
              if (this.data !== undefined) {
                  this.data.forEach(x => {
                      if (x.RCode === this.RCode) {
                          godownSelection.push({ 'label': x.GName, 'value': x.GCode });
                      }
                  });
                  this.godownOptions = godownSelection;
              }
              break;
      }
  }

  onResetTable(item) {
      if (item === 'reg') { this.GCode = null; }
      this.processToGPSData = [];
  }

    public getColor(data: any): string {
        console.log('d', data);
      return (data === 'Grand Total') ? "#53aae5" : "white";
    }


  onView() {
      const params = new HttpParams().set('RCode', this.RCode).append('GCode', this.GCode)
      .append('FromDate', this.datepipe.transform(this.FromDate, 'MM/dd/yyyy'))
      .append('ToDate', this.datepipe.transform(this.ToDate, 'MM/dd/yyyy'));
      this.restAPIService.getByParameters(PathConstants.PROCESS_TO_GPS_GET, params).subscribe((res: any) => {
          if (res !== null && res !== undefined && res.length !== 0) {
              let sno = 1;
              this.processToGPSData = res.filter(x => {
                  return (x.GPStatus !== 4)
              });
              if(this.processToGPSData.length !== 0 && this.processToGPSData !== null) {
              this.processToGPSData.forEach(data => {
                  data.SlNo = sno;
                  sno += 1;
                  data.GPSStartDate = this.datepipe.transform(data.GPSStartDate, 'dd/MM/yyyy');
                  data.GPSEndDate = this.datepipe.transform(data.GPSEndDate, 'dd/MM/yyyy');
                  data.GPSStatus = this.getGPSStatus(data.GPSStatus);
              })
          } else {
              this.processToGPSData = [];
              this.messageService.clear();
              this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage });
          }
          } else {
              this.processToGPSData = [];
              this.messageService.clear();
              this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage });
          }
      }, (err: HttpErrorResponse) => {
          this.loading = false;
          if (err.status === 0 || err.status === 400) {
              this.processToGPSData = [];
              this.messageService.clear();
              this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
          }
      });
  }

  getGPSStatus(value): string {
      let result;
      if (value !== null && value !== undefined) {
          switch (value) {
              case 0:
                  result = 'Pending';
                  break;
              case 1:
                  result = 'Processing';
                  break;
              case 2:
                  result = 'Transfered';
                  break;
              case 3:
                  result = 'Error';
                  break;
              case 4:
                  result = 'NotRequired to Transfer';
                  break;
              case 5:
                  result = 'Unable to Transfer';
                  break;
              case 6:
                  result = 'Acknowledgement from GPS';
                  break;
          }
          return result;
      }
  }

  onDateSelect() {
    this.checkValidDateSelection();
    this.onResetTable('');
  }

  checkValidDateSelection() {
    if (this.FromDate !== undefined && this.ToDate !== undefined && this.FromDate !== null
        && this.ToDate !== null && this.FromDate.toDateString() !== '' &&
        this.ToDate.toDateString() !== '') {
      let selectedFromDate = this.FromDate.getDate();
      let selectedToDate = this.ToDate.getDate();
      let selectedFromMonth = this.FromDate.getMonth();
      let selectedToMonth = this.ToDate.getMonth();
      let selectedFromYear = this.FromDate.getFullYear();
      let selectedToYear = this.ToDate.getFullYear();
      if ((selectedFromDate > selectedToDate && ((selectedFromMonth >= selectedToMonth && selectedFromYear >= selectedToYear) ||
        (selectedFromMonth === selectedToMonth && selectedFromYear === selectedToYear))) ||
        (selectedFromMonth > selectedToMonth && selectedFromYear === selectedToYear) || (selectedFromYear > selectedToYear)) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, 
        summary: StatusMessage.SUMMARY_INVALID, 
        life:5000, detail: StatusMessage.ValidDateErrorMessage });
        this.FromDate = null; this.ToDate = null;
      }
      return this.FromDate, this.ToDate;
    }
  }

  onClear() {
      this.RCode = null;
      this.GCode = null;
      this.FromDate = new Date();
      this.ToDate = new Date();
      this.processToGPSData = [];
  }
}
