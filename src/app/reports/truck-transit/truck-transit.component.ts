import { Component, OnInit } from '@angular/core';
import { TableConstants } from '../../constants/tableconstants';
import { DatePipe } from '@angular/common';
import { ExcelService } from '../../shared-services/excel.service';
import { Router } from '@angular/router';
import { MessageService, SelectItem } from 'primeng/api';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { PathConstants } from 'src/app/constants/path.constants';

@Component({
  selector: 'app-truck-transit',
  templateUrl: './truck-transit.component.html',
  styleUrls: ['./truck-transit.component.css']
})
export class TruckTransitComponent implements OnInit {
  TruckTransitCols: any;
  TruckTransitData: any = [];
  response: any;
  fromDate: any;
  toDate: any;
  godownOptions: SelectItem[];
  transferOptions: SelectItem[];
  transferOption = [];
  g_cd: any;
  tr_cd: any;
  data: any;
  transferData: any;
  isActionDisabled: boolean;
  maxDate: Date;
  canShowMenu: boolean;
  isShowErr: boolean;
  loading: boolean = false;
  totalRecords: number;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private authService: AuthService, private excelService: ExcelService, private router: Router,
    private restAPIService: RestAPIService, private roleBasedService: RoleBasedService, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.isActionDisabled = true;
    this.TruckTransitCols = this.tableConstants.TruckTransit;
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

  onTransfer() {
    let transfers = [];
    const params = {
      'Fdate': this.datePipe.transform(this.fromDate, 'MM-dd-yyyy'),
      'ToDate': this.datePipe.transform(this.toDate, 'MM-dd-yyyy'),
      'GCode': this.g_cd.value
    }
    if (this.transferOptions === undefined) {
      this.restAPIService.getByParameters(PathConstants.TRUCK_TRANSIT, params).subscribe(res => {
        this.response = res;
        transfers.push({ 'label': this.response.Transfertype, 'value': res.RGCODE });
        this.transferOptions = transfers;
        this.transferOptions.unshift({ 'label': '-select-', 'value': null, disabled: true }, { 'label': 'TRANSFER', 'value': this.transferOptions }, { 'label': 'INTERNAL TRANSFER', 'value': this.transferOptions });

      })
    }
  }

  onView() {
    this.checkValidDateSelection();
    this.onTransfer();
    this.loading = true;
    const params = new HttpParams().set('Fdate', this.datePipe.transform(this.fromDate, 'MM-dd-yyyy')).append('ToDate', this.datePipe.transform(this.toDate, 'MM-dd-yyyy')).append('GCode', this.g_cd.value);
    this.restAPIService.getByParameters(PathConstants.TRUCK_TRANSIT, params).subscribe(res => {
      this.TruckTransitData = res;
      if (this.TruckTransitData !== undefined && this.TruckTransitData !== 0) {
        this.TruckTransitData = res.filter((value: { Transfertype: any; }) => { return value.Transfertype === this.tr_cd.label });
        // if (value.Transfertype === this.tr_cd.label) {
        // this.TruckTransitData.push(value);
        // this.totalRecords = this.TruckTransitData.length;
        // }
        // })
      }
      let sno = 0;
      this.TruckTransitData.forEach(data => {
        data.SRDate = this.datePipe.transform(data.SRDate, 'dd-MM-yyyy');
        data.Nkgs = (data.Nkgs * 1).toFixed(3);
        sno += 1;
        data.SlNo = sno;
        this.loading = false;
      })
      if (this.TruckTransitData !== undefined && this.TruckTransitData.length !== 0) {
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
    this.TruckTransitData = [];
    this.isActionDisabled = true;
  }

  exportAsXLSX(): void {
    var TruckTransit = [];
    this.TruckTransitData.forEach(data => {
      if (data.Transfertype == "INTERNAL TRANSFER" || data.Transfertype == "TRANSFER") {
        TruckTransit.push({ SlNo: data.SlNo, STNo: data.STNo, STDate: data.STDate, Region: data.Region, TNCSName: data.TNCSName, LNo: data.LNo, NoPacking: data.NoPacking, Nkgs: data.Nkgs, ACKNO: data.ACKNO, ReceiverDate: data.STDate, DepositorName: data.DepositorName, Bags: data.NoPacking, Quantity: data.Nkgs, TransferType: data.Transfertype })
      }
    })
    this.excelService.exportAsExcelFile(TruckTransit, 'Truck_Transit', this.TruckTransitCols);
  }
}

// exportAsXLSX(): void {
//   var TruckTransitInternal = [];
//   var TruckTransitTransfer = [];
//   this.TruckTransitData.forEach(data => {
//     if (data.Transfertype == "INTERNAL TRANSFER") {
//       TruckTransitInternal.push({ SlNo: data.SlNo, STNo: data.STNo, STDate: data.STDate, Region: data.Region, TNCSName: data.TNCSName, LNo: data.LNo, NoPacking: data.NoPacking, Nkgs: data.Nkgs, AckNo: data.STNo, RTDate: data.STDate, RRegion: data.Region, RGodown: data.TNCSName, Bags: data.NoPacking, Quantity: data.Nkgs, type: data.Transfertype })
//     }
//     else
//       if (data.Transfertype == "TRANSFER") {
//         TruckTransitTransfer.push({ SlNo: data.SlNo, STNo: data.STNo, STDate: data.STDate, Region: data.Region, TNCSName: data.TNCSName, LNo: data.LNo, NoPacking: data.NoPacking, Nkgs: data.Nkgs, AckNo: data.STNo, RTDate: data.STDate, RRegion: data.Region, RGodown: data.TNCSName, Bags: data.NoPacking, Quantity: data.Nkgs, type: data.Transfertype })
//       }
//   })
//   this.excelService.exportAsExcelFile(TruckTransitInternal, 'Truck_Transit_Internal', this.TruckTransitCols);
//   this.excelService.exportAsExcelFile(TruckTransitTransfer, 'Truck_Transit_Transfer', this.TruckTransitCols);
// }