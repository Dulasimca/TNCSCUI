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
import * as Rx from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-commodity-receipt',
  templateUrl: './commodity-receipt.component.html',
  styleUrls: ['./commodity-receipt.component.css'],
})
export class CommodityReceiptComponent implements OnInit {
  commodityReceiptCols: any;
  commodityReceiptData: any = [];
  fromDate: any = new Date();
  toDate: any = new Date();
  data: any;
  regions: any;
  RCode: any;
  GCode: any;
  ITCode: any;
  Trcode: any;
  regionOptions: SelectItem[];
  godownOptions: SelectItem[];
  commodityOptions: SelectItem[];
  transactionOptions: SelectItem[];
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
    let transactoinSelection = [];
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
            this.regionOptions.unshift({ label: 'All', value: 'All' });
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
        } else {
          this.godownOptions = godownSelection;
        }
        break;
      case 'tr':
        if (type === 'enter') { this.transactionPanel.overlayVisible = true; }
        if (this.transactionOptions === undefined) {
          this.restAPIService.get(PathConstants.TRANSACTION_MASTER).subscribe(data => {
            if (data !== undefined && data !== null && data.length !== 0) {
              data.forEach(y => {
                transactoinSelection.push({ 'label': y.TRName, 'value': y.TRCode });
                this.transactionOptions = transactoinSelection;
              });
              this.transactionOptions.unshift({ label: 'All', value: 'All' });
            } else {
              this.transactionOptions = transactoinSelection;
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
              this.commodityOptions.unshift({ label: 'All', value: 'All' });
            }
          })
        }
        break;
    }
  }

  onView() {
    this.checkValidDateSelection();
    this.loading = true;
    this.commodityReceiptData.length = 0;
    const params = {
      'FDate': this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'),
      'ToDate': this.datePipe.transform(this.toDate, 'MM/dd/yyyy'),
      'GCode': this.GCode,
      'RCode': this.RCode,
      'ITCode': this.ITCode.value,
      'ITName': this.ITCode.label,
      'TRCODE': this.Trcode.value,
      'TRName': this.Trcode.label,
      'UserName': this.username.user,
    }
    this.restAPIService.post(PathConstants.COMMODITY_RECEIPT_REPORT, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.commodityReceiptData = res;
        this.loading = false;
        let sno = 0;
        let TotalQty = 0;
        let TotalBags = 0;

        ///Sorting Array
        let sortedArray = _.sortBy(this.commodityReceiptData, 'Commodity');
        this.commodityReceiptData = sortedArray;
        ///End

        ///Calculating Total of each rows
        this.commodityReceiptData.forEach(data => {
          data.Date = this.datePipe.transform(data.Date, 'dd-MM-yyyy');
          data.Truckmemodate = this.datePipe.transform(data.Truckmemodate, 'dd-MM-yyyy');
          sno += 1;
          data.SlNo = sno;
          TotalBags += data.Bags_No !== undefined && data.Bags_No !== null ? (data.Bags_No * 1) : 0;
          TotalQty += data.Quantity !== undefined && data.Quantity !== null ? (data.Quantity * 1) : 0;
        });
        ///End

        ///Grand total display
        this.commodityReceiptData.push({
          Godownname: 'Grand Total', Quantity: (TotalQty * 1).toFixed(3), Bags_No: TotalBags
        })
        ///End

        ///Grouping Array based on 'Commodity' & sum
        let groupedData;
        Rx.Observable.from(this.commodityReceiptData)
          .groupBy((x: any) => x.Commodity) // using groupBy from Rxjs
          .flatMap(group => group.toArray())// GroupBy dont create a array object so you have to flat it
          .map(g => {// mapping 
            return {
              Commodity: g[0].Commodity,//take the first name because we grouped them by name
              Quantity: _.sumBy(g, 'Quantity'),
              Bags_No: _.sumBy(g, 'Bags_No') // using lodash to sum quantity
            }
          })
          .toArray() //.toArray because I guess you want to loop on it with ngFor      
          .do(sum => sum) // just for debug
          .subscribe(d => groupedData = d);
        ///End

        ///Inserting total in an array
        let index = 0;
        let item;
        for (let i = 0; i < this.commodityReceiptData.length; i++) {
          if (this.commodityReceiptData[i].Commodity !== groupedData[index].Commodity) {
            item = {
              Godownname: 'TOTAL',
              Bags_No: (groupedData[index].Bags_No * 1),
              Quantity: (groupedData[index].Quantity * 1).toFixed(3),
            };
            this.commodityReceiptData.splice(i, 0, item);
            index += 1;
          }
        }
        ///End 
        this.commodityReceiptData.forEach(x => x.Quantity = (x.Quantity * 1).toFixed(3));
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
    this.commodityReceiptData = [];
  }

  public getColor(name: string): string {
    return (name === 'Grand Total') ? "#53aae5" : "white";
  }

  onPrint() {
    const path = "../../assets/Reports/" + this.username.user + "/";
    const filename = this.GCode + GolbalVariable.CommodityReceiptReport + ".txt";
    saveAs(path + filename, filename);
  }
}