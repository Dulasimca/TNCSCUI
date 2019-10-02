import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { Dropdown } from 'primeng/primeng';
import { saveAs } from 'file-saver';
import { GolbalVariable } from 'src/app/common/globalvariable';

@Component({
  selector: 'app-scheme-receipt',
  templateUrl: './scheme-receipt.component.html',
  styleUrls: ['./scheme-receipt.component.css']
})
export class SchemeReceiptComponent implements OnInit {
  schemeReceiptCols: any;
  schemeReceiptData: any = [];
  fromDate: any = new Date();
  toDate: any = new Date();
  godown_data: any;
  scheme_data: any;
  region_data: any;
  roleId: any;
  GCode: any;
  RCode: any;
  regionOptions: SelectItem[];
  schemeOptions: SelectItem[];
  Scheme: any;
  godownOptions: SelectItem[];
  truckName: string;
  canShowMenu: boolean;
  maxDate: Date;
  loggedInRCode: string;
  username: any;
  loading: boolean = false;
  @ViewChild('godown') godownPanel: Dropdown;
  @ViewChild('region') regionPanel: Dropdown;
  @ViewChild('scheme') schemePanel: Dropdown;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private messageService: MessageService, private authService: AuthService,
    private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.schemeReceiptCols = this.tableConstants.SchemeReceiptReport;
    this.scheme_data = this.roleBasedService.getSchemeData();
    this.godown_data = this.roleBasedService.getInstance();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.region_data = this.roleBasedService.getRegions();
    this.maxDate = new Date();
    this.username = JSON.parse(this.authService.getCredentials());
  }

  onSelect(item, type) {
    let regionSelection = [];
    let godownSelection = [];
    let schemeSelection = [];
    switch (item) {
      case 'reg':
          this.region_data = this.roleBasedService.regionsData;
          if (type === 'enter') {
            this.regionPanel.overlayVisible = true;
          }
          if (this.roleId === 1) {
            if (this.region_data !== undefined) {
              this.region_data.forEach(x => {
                regionSelection.push({ 'label': x.RName, 'value': x.RCode });
              });
              this.regionOptions = regionSelection;
            }
          } else {
            if (this.region_data !== undefined) {
              this.region_data.forEach(x => {
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
        if (this.godown_data !== undefined) {
          this.godown_data.forEach(x => {
            if (x.RCode === this.RCode) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode, 'rcode': x.RCode, 'rname': x.RName });
            }
          });
          this.godownOptions = godownSelection;
        }
        break;
      case 'scheme':
        if (type === 'enter') {
          this.schemePanel.overlayVisible = true;
        }
        if (this.scheme_data !== undefined) {
          this.scheme_data.forEach(y => {
            schemeSelection.push({ 'label': y.SName, 'value': y.SCode });
            this.schemeOptions = schemeSelection;
          });
        }
        break;
    }
  }

  onView() {
    this.checkValidDateSelection();
    this.loading = true;
    this.schemeReceiptData = [];
    const params = {
      'FDate': this.datePipe.transform(this.fromDate, 'MM-dd-yyyy'),
      'ToDate': this.datePipe.transform(this.toDate, 'MM-dd-yyyy'),
      'GCode': this.GCode,
      'TRCode': this.Scheme,
      'UserName': this.username.user,
    };
    this.restAPIService.post(PathConstants.SCHEME_RECEIPT_REPORT, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.schemeReceiptData = res;
        let sno = 0;
        this.loading = false;
        let TotalQty = 0;
        this.schemeReceiptData.forEach(data => {
          data.Date = this.datePipe.transform(data.Date, 'dd-MM-yyyy');
          data.Quantity = (data.Quantity * 1).toFixed(3);
          sno += 1;
          data.SlNo = sno;
          TotalQty += data.Quantity !== undefined && data.Quantity !==null ? (data.Quantity * 1) : 0;
        })
        this.schemeReceiptData.push({
          Godownname: 'Total', Quantity: (TotalQty * 1).toFixed(3)
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

  onResetTable(item) {
    if (item === 'reg') { this.GCode = null; }
    this.schemeReceiptData = [];
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

  onPrint() {
    const path = "../../assets/Reports/" + this.username.user + "/";
    const filename = this.GCode + GolbalVariable.SchemeReceiptReportFileName + ".txt";
    saveAs(path + filename, filename);
  }
}