import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { HttpErrorResponse } from '@angular/common/http';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { saveAs } from 'file-saver';
import { Dropdown } from 'primeng/primeng';

@Component({
  selector: 'app-Cash-Receipt-Register',
  templateUrl: './Cash-Receipt-Register.component.html',
  styleUrls: ['./Cash-Receipt-Register.component.css']
})
export class CashReceiptRegisterComponent implements OnInit {
  CashReceiptRegCols: any;
  CashReceiptRegData: any;
  fromDate: any = new Date();
  toDate: any = new Date();
  RCode: any;
  regionOptions: SelectItem[];
  GCode: any;
  godownOptions: SelectItem[];
  roleId: any;
  regions: any;
  maxDate: Date;
  canShowMenu: boolean;
  data: any;
  loading: boolean;
  username: any;
  loggedInRCode: string;
  @ViewChild('godown') godownPanel: Dropdown;
  @ViewChild('region') regionPanel: Dropdown;
  
  constructor(private tableConstants: TableConstants, private datePipe: DatePipe, private messageService: MessageService,
    private authService: AuthService, private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.regions = this.roleBasedService.getRegions();
    this.CashReceiptRegCols = this.tableConstants.DeliveryMemoRegisterReport;
    this.maxDate = new Date();
    this.username = JSON.parse(this.authService.getCredentials());
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
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
    const params = {
      'FromDate': this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'),
      'ToDate': this.datePipe.transform(this.toDate, 'MM/dd/yyyy'),
      'UserName': this.username.user,
      'GCode': this.GCode
    };
    this.restAPIService.post(PathConstants.STOCK_DELIVERY_ORDER_REPORT, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.CashReceiptRegData = res;
        this.loading = false;
      let sno = 0;
      this.CashReceiptRegData.forEach(data => {
        data.DeliveryOrderDate = this.datePipe.transform(data.DeliveryOrderDate, 'dd/MM/yyyy');
        sno += 1;
        data.SlNo = sno;
      });
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
    });
  }

  onResetTable(item) {
    if(item === 'reg') { this.GCode = null; }
    this.CashReceiptRegData = [];
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
    const filename = this.GCode + GolbalVariable.StockDORegFilename + ".txt";
    saveAs(path + filename, filename);
  }
}
