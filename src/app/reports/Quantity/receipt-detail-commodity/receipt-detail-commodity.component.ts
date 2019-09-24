import { Component, OnInit, ViewChild } from '@angular/core';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { DatePipe } from '@angular/common';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { MessageService, SelectItem } from 'primeng/api';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { StatusMessage } from 'src/app/constants/Messages';
import { Dropdown } from 'primeng/primeng';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-receipt-detail-commodity',
  templateUrl: './receipt-detail-commodity.component.html',
  styleUrls: ['./receipt-detail-commodity.component.css']
})
export class ReceiptDetailCommodityComponent implements OnInit {
  QtyReceiptCols: any;
  QtyReceiptData: any = [];
  fromDate: any = new Date();
  toDate: any = new Date();
  godownOptions: SelectItem[];
  regionOptions: SelectItem[];
  GCode: any;
  RCode: any;
  roleId: any;
  data: any;
  regions: any;
  maxDate: Date;
  canShowMenu: boolean;
  loading: boolean = false;
  loggedInRCode: string;
  userId: any;
  @ViewChild('godown') godownPanel: Dropdown;
  @ViewChild('region') regionPanel: Dropdown;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private authService: AuthService, private excelService: ExcelService,
    private restAPIService: RestAPIService, private roleBasedService: RoleBasedService, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.QtyReceiptCols = this.tableConstants.QuantityACReceiptDetailsCommodity;
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.data = this.roleBasedService.getInstance();
    this.regions = this.roleBasedService.getRegions();
    this.userId = JSON.parse(this.authService.getCredentials());
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
          this.regionPanel.overlayVisible = true;
        }
        this.data = this.roleBasedService.instance;
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode.value) {
               godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            }
          });
          this.godownOptions = godownSelection;
        } else {
          this.godownOptions = godownSelection;
        }
        break;
    }
  }

  onView() {
    this.checkValidDateSelection();
    this.loading = true;
    const params = {
      FromDate: this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'),
      ToDate: this.datePipe.transform(this.toDate, 'MM/dd/yyyy'),
      GCode: this.GCode.value,
      RCode: this.RCode.value,
      UserId: this.userId.user,
      RName: this.RCode.label,
      GName: this.GCode.label
    };
        this.restAPIService.post(PathConstants.TRUCK_FROM_REGION_REPORT, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.QtyReceiptData = res;
        this.loading = false;
      let sno = 0;
      this.QtyReceiptData.forEach(data => {
        data.SRDate = this.datePipe.transform(data.SRDate, 'dd-MM-yyyy');
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
    if(item === 'reg') { this.GCode = null; }
    this.QtyReceiptData = [];
  }

  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.QtyReceiptData, 'QTY_RECEIPT_COMMODITY', this.QtyReceiptCols);
  }

  onPrint() { 
    const path = "../../assets/Reports/" + this.userId.user + "/";
    const filename = this.GCode.value + GolbalVariable.QuantityACForReceiptDetailCommodity + ".txt";
    saveAs(path + filename, filename);
  }
}