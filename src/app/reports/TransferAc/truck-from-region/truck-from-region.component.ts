import { Component, OnInit, ViewChild } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { SelectItem, MessageService } from 'primeng/api';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { StatusMessage } from 'src/app/constants/Messages';
import { Dropdown } from 'primeng/primeng';

@Component({
  selector: 'app-truck-from-region',
  templateUrl: './truck-from-region.component.html',
  styleUrls: ['./truck-from-region.component.css']
})
export class TruckFromRegionComponent implements OnInit {
  TruckFromRegionCols: any;
  TruckFromRegionData: any = [];
  fromDate: any = new Date();
  toDate: any = new Date();
  regionOptions: SelectItem[];
  godownOptions: SelectItem[];
  // selectedValues: string[] = ['Road'];
  GCode: any;
  RCode: any;
  regions: any;
  data: any;
  maxDate: Date;
  canShowMenu: boolean;
  isShowErr: boolean;
  loading: boolean = false;
  roleId: any;
  @ViewChild('godown') godownPanel: Dropdown;
  @ViewChild('region') regionPanel: Dropdown;
  loggedInRCode: any;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private authService: AuthService, private excelService: ExcelService,
    private restAPIService: RestAPIService, private roleBasedService: RoleBasedService, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.TruckFromRegionCols = this.tableConstants.TruckFromRegionReport;
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.data = this.roleBasedService.getInstance();
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.regions = this.roleBasedService.getRegions();
    this.maxDate = new Date();
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
                if(x.RCode === this.loggedInRCode) {
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
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode, 'rcode': x.RCode, 'rname': x.RName });
            }
          });
          this.godownOptions = godownSelection;
        }
        break;
    }
  }


  onView() {
    this.checkValidDateSelection();
    this.loading = true;
    const params = new HttpParams().set('Fdate', this.datePipe.transform(this.fromDate, 'MM-dd-yyyy')).append('ToDate', this.datePipe.transform(this.toDate, 'MM-dd-yyyy')).append('GCode', this.GCode);
    this.restAPIService.getByParameters(PathConstants.TRUCK_FROM_REGION_REPORT, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.TruckFromRegionData = res;
        this.loading = false;
        let sno = 0;
        this.TruckFromRegionData.forEach(data => {
          data.SRDate = this.datePipe.transform(data.SRDate, 'dd-MM-yyyy');
          // this.selectedValues = [res[0].TransportMode];
          data.Nkgs = (data.Nkgs * 1).toFixed(3);
          sno += 1;
          data.SlNo = sno;
        })
      } else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    })
  }
  onDateSelect() {
    this.checkValidDateSelection();
    this.onResetTable('');
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
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_INVALID, detail: StatusMessage.ValidDateErrorMessage });
        this.fromDate = this.toDate = '';
      }
      return this.fromDate, this.toDate;
    }
  }
  onResetTable(item) {
    if (item === 'reg') { this.GCode = null; }
    this.TruckFromRegionData = [];
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

  onPrint() { }
  
}