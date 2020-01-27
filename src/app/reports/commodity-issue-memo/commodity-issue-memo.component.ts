import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { Dropdown } from 'primeng/primeng';
import { StatusMessage } from 'src/app/constants/Messages';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { saveAs } from 'file-saver';
import * as Rx from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-commodity-issue-memo',
  templateUrl: './commodity-issue-memo.component.html',
  styleUrls: ['./commodity-issue-memo.component.css']
})
export class CommodityIssueMemoComponent implements OnInit {
  commodityIssueMemoCols: any;
  commodityIssueMemoData: any = [];
  fromDate: any = new Date();
  toDate: any = new Date();
  data: any;
  RCode: any;
  GCode: any;
  ITCode: any;
  regionOptions: SelectItem[];
  godownOptions: SelectItem[];
  commodityOptions: SelectItem[];
  truckName: string;
  canShowMenu: boolean;
  maxDate: Date;
  loading: boolean;
  roleId: number;
  loggedInRCode: string;
  regions: any;
  issuedToDepositor: string[];
  issuedToGodown: string[];
  username: any;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;
  @ViewChild('commodity', { static: false }) commodityPanel: Dropdown;


  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private messageService: MessageService, private authService: AuthService,
    private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.commodityIssueMemoCols = this.tableConstants.CommodityIssueMemoReport;
    this.data = this.roleBasedService.getInstance();
    this.regions = this.roleBasedService.getRegions();
    this.maxDate = new Date();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.username = JSON.parse(this.authService.getCredentials());
  }

  onSelect(item, type) {
    let regionSelection = [];
    let godownSelection = [];
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
    this.messageService.clear();
    this.checkValidDateSelection();
    this.onResetTable('');
    this.loading = true;
    const params = {
      'FDate': this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'),
      'ToDate': this.datePipe.transform(this.toDate, 'MM/dd/yyyy'),
      'RCode': this.RCode,
      'GCode': this.GCode,
      'TRCode': this.ITCode,
      'IssueToGodown': (this.issuedToGodown !== undefined ? ((this.issuedToGodown[0] === '1') ? 1 : 0) : 0),
      'IssueToDepositor': (this.issuedToDepositor !== undefined ? ((this.issuedToDepositor[0] === '0') ? 1 : 0) : 0),
      'UserName': this.username.user
    }
    this.restAPIService.post(PathConstants.COMMODITY_ISSUE_MEMO_REPORT, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.commodityIssueMemoData = res;
        this.loading = false;
        let sno = 0;
        let TotalQty = 0;

        ///Sorting Array
        let sortedArray = _.sortBy(this.commodityIssueMemoData, 'Commodity');
        this.commodityIssueMemoData = sortedArray;
        ///End

        ///Calculating Total of each rows
        this.commodityIssueMemoData.forEach(data => {
          data.Issue_Date = this.datePipe.transform(data.Issue_Date, 'dd-MM-yyyy');
          data.Lorryno = data.Lorryno.toString().toUpperCase();
          sno += 1;
          data.SlNo = sno;
          TotalQty += data.Quantity !== undefined && data.Quantity !== null ? (data.Quantity * 1) : 0;
        })
        ///End

        ///Grand total display
        this.commodityIssueMemoData.push({
          Godownname: 'Grand Total', Quantity: (TotalQty * 1).toFixed(3)
        })
        ///End

        ///Grouping Array based on 'Commodity' & sum
        let groupedData;
        Rx.Observable.from(this.commodityIssueMemoData)
          .groupBy((x: any) => x.Commodity) // using groupBy from Rxjs
          .flatMap(group => group.toArray())// GroupBy dont create a array object so you have to flat it
          .map(g => {// mapping 
            return {
              Commodity: g[0].Commodity,//take the first name because we grouped them by name
              Quantity: _.sumBy(g, 'Quantity')// using lodash to sum quantity
            }
          })
          .toArray() //.toArray because I guess you want to loop on it with ngFor      
          .do(sum => sum) // just for debug
          .subscribe(d => groupedData = d);
        ///End

        ///Inserting total in an array
        let index = 0;
        let item;
        for (let i = 0; i < this.commodityIssueMemoData.length; i++) {
          if (this.commodityIssueMemoData[i].Commodity !== groupedData[index].Commodity) {
            item = {
              Godownname: 'TOTAL',
              Quantity: (groupedData[index].Quantity * 1).toFixed(3),
            };
            this.commodityIssueMemoData.splice(i, 0, item);
            index += 1;
          }
        }
        ///End 
        this.commodityIssueMemoData.forEach(x => x.Quantity = (x.Quantity * 1).toFixed(3));
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

  public getColor(name: string): string {
    return (name === 'Grand Total') ? "#53aae5" : "white";
  }

  onDateSelect(event) {
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
    this.commodityIssueMemoData = [];
  }

  onPrint() {
    const path = "../../assets/Reports/" + this.username.user + "/";
    const filename = this.GCode + GolbalVariable.CommodityIssueMemoReport + ".txt";
    saveAs(path + filename, filename);
  }

}