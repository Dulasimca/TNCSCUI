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
  selector: 'app-commodity-receipt',
  templateUrl: './commodity-receipt.component.html',
  styleUrls: ['./commodity-receipt.component.css'],
})
export class CommodityReceiptComponent implements OnInit {
  commodityReceiptCols: any;
  commodityReceiptData: any = [];
  loadedData: any = [];
  fromDate: any = new Date();
  toDate: any = new Date();
  data: any;
  regions: any;
  RCode: any;
  GCode: any;
  ITCode: any;
  TrCode: any;
  regionOptions: SelectItem[];
  godownOptions: SelectItem[];
  transactionOptions: SelectItem[];
  commodityOptions: SelectItem[];
  truckName: string;
  canShowMenu: boolean;
  maxDate: Date;
  loading: boolean;
  roleId: any;
  username: any;
  loggedInRCode: any;
  @ViewChild('godown') godownPanel: Dropdown;
  @ViewChild('region') regionPanel: Dropdown;
  @ViewChild('commodity') commodityPanel: Dropdown;
  @ViewChild('transaction') transactionPanel: Dropdown;
  

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private messageService: MessageService, private authService: AuthService, private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.commodityReceiptCols = this.tableConstants.CommodityReceiptReport;
    this.data = this.roleBasedService.getInstance();
    this.regions = this.roleBasedService.getRegions();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.maxDate = new Date();
    this.username = JSON.parse(this.authService.getCredentials());
  }

  onSelect(item, type) {
    let regionSelection = [];
    let godownSelection = [];
    let transactionSelection = [];
    let commoditySelection = [];
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
        if (type === 'enter') { this.godownPanel.overlayVisible = true; }
        this.data = this.roleBasedService.instance;
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            }
          });
          this.godownOptions = godownSelection;
          if (this.roleId !== 3) {
            this.godownOptions.unshift({ label: 'All', value: 'All' });
          }
        }
        break;
      case 'tr':
        if (type === 'enter') { this.transactionPanel.overlayVisible = true; }
        if (this.transactionOptions === undefined) {
          this.restAPIService.get(PathConstants.TRANSACTION_MASTER).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                transactionSelection.push({ 'label': y.TRName, 'value': y.TRCode });
                this.transactionOptions = transactionSelection;
              });
            }
          })
        }
        break;
      case 'cd':
        if (type === 'enter') { this.commodityPanel.overlayVisible = true; }
        if (this.commodityOptions === undefined) {
          this.restAPIService.get(PathConstants.ITEM_MASTER).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                commoditySelection.push({ 'label': y.ITDescription, 'value': y.ITCode });
                this.commodityOptions = commoditySelection;
              });
            }
          })
        }
        break;
    }
  }

  onView() {
    this.checkValidDateSelection();
    this.loading = true;
    this.commodityReceiptData = [];
    const params = {
      'FDate': this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'),
      'ToDate': this.datePipe.transform(this.toDate, 'MM/dd/yyyy'),
      'GCode': this.GCode,
      'RCode': this.RCode,
      'ITCode': this.ITCode,
      'TRCode': this.TrCode,
      'UserName': this.username.user,
    }
    this.restAPIService.post(PathConstants.COMMODITY_RECEIPT_REPORT, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.loadedData = res;
        this.commodityReceiptData = res;
        this.loading = false;
        let sno = 0;
        this.commodityReceiptData.forEach(data => {
          data.Date = this.datePipe.transform(data.Date, 'dd-MM-yyyy');
          data.Truckmemodate = this.datePipe.transform(data.Truckmemodate, 'dd-MM-yyyy');
          data.Quantity = (data.Quantity * 1).toFixed(3);
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
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_INVALID, detail: StatusMessage.ValidDateErrorMessage });
        this.fromDate = this.toDate = '';
      }
      return this.fromDate, this.toDate;
    }
  }

  onResetTable() {
    this.commodityReceiptData = [];
  }

  onPrint() { 
    const path = "../../assets/Reports/" + this.username.user + "/";
    const filename = this.GCode + GolbalVariable.CommodityReceiptReport + ".txt";
    saveAs(path + filename, filename);
  }
}