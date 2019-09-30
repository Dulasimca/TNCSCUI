import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { Dropdown } from 'primeng/primeng';
import 'rxjs/add/observable/from';
import 'rxjs/Rx';
import * as Rx from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-All-scheme',
  templateUrl: './all-scheme.component.html',
  styleUrls: ['./all-scheme.component.css']
})
export class AllSchemeComponent implements OnInit {
  AllSchemeCols: any;
  AllSchemeData: any = [];
  fromDate: any = new Date();
  toDate: any = new Date();
  godownOptions: SelectItem[];
  transactionOptions: SelectItem[];
  receiverOptions: SelectItem[];
  regionOptions: SelectItem[];
  selectedValues: any;
  FilterArray: any;
  regions: any;
  t_cd: any;
  g_cd: any;
  s_cd: any;
  r_cd: any;
  RCode: any;
  Trcode: any;
  data: any;
  GCode: any;
  userId: any;
  SCode: any;
  maxDate: Date;
  roleId: any;
  canShowMenu: boolean;
  isShowErr: boolean;
  loading: boolean = false;
  loggedInRCode: any;
  @ViewChild('godown') godownPanel: Dropdown;
  @ViewChild('region') regionPanel: Dropdown;
  @ViewChild('transaction') transactionPanel: Dropdown;
  @ViewChild('receiver') societyPanel: Dropdown;



  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private authService: AuthService, private restAPIService: RestAPIService, private datepipe: DatePipe,
    private roleBasedService: RoleBasedService, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.AllSchemeCols = this.tableConstants.DoAllScheme;
    this.data = this.roleBasedService.getInstance();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.GCode = this.authService.getUserAccessible().gCode;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.regions = this.roleBasedService.getRegions();
    this.maxDate = new Date();
    this.userId = JSON.parse(this.authService.getCredentials());
  }

  onSelect(item, type) {
    let regionSelection = [];
    let godownSelection = [];
    let TransactionSelection = [];
    let ReceiverSelection = [];
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
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            }
          });
          this.godownOptions = godownSelection;
        }
        break;
      case 't':
        if (type === 'enter') {
          this.transactionPanel.overlayVisible = true;
        }
        if (this.transactionOptions === undefined) {
          this.restAPIService.get(PathConstants.TRANSACTION_MASTER).subscribe(s => {
            s.forEach(c => {
              if (c.TransType === 'I') {
                TransactionSelection.push({ 'label': c.TRName, 'value': c.TRCode });
              }
              this.transactionOptions = TransactionSelection;
            });
          });
        }
        break;
      case 'r':
        if (type === 'enter') {
          this.societyPanel.overlayVisible = true;
        }
        const params = new HttpParams().set('TRCode', this.t_cd.value);
        this.restAPIService.getByParameters(PathConstants.DEPOSITOR_TYPE_MASTER, params).subscribe(res => {
          res.forEach(s => {
            ReceiverSelection.push({ 'label': s.Tyname, 'value': s.Tycode });
          });
          this.receiverOptions = ReceiverSelection;
        });
        break;
    }
  }
  // }

  onView() {
    this.checkValidDateSelection();
    this.loading = true;
    const params = {
      'FromDate': this.datepipe.transform(this.fromDate, 'MM/dd/yyyy'),
      'ToDate': this.datepipe.transform(this.toDate, 'MM/dd/yyyy'),
      'GCode': this.GCode,
      // 'SCode': this.r_cd.value,
      'UserName': this.userId.user,
    };
    this.restAPIService.post(PathConstants.DELIVERY_ORDER_SCHEMEWISE, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.AllSchemeData = res;
        this.FilterArray = res;
        this.loading = false;
        let sno = 0;
        this.AllSchemeData.forEach(data => {

          sno += 1;
          data.SlNo = sno;
        });
        this.AllSchemeData = this.AllSchemeData.filter(item => {
          return item.Tyname === this.r_cd.label;
        });
      }
      // if (this.AllSchemeData !== undefined) {
      //   this.AllSchemeData;
      // }
      else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination
        });
      }

    });
  }

  onSociety() {
    // this.AllSchemeData = this.FilterArray;
    this.AllSchemeData.splice(this.AllSchemeData.length, 0, '');
    let groupedData: any = [];
    // Rx.Observable.from(this.AllSchemeData)
    //   .groupBy((x: any) => x.Tyname).flatMap(grop => grop.toArray())
    // Rx.Observable.from(this.AllSchemeData)
    //   .groupBy((y: any) => y.Coop).flatMap(grop => grop.toArray())
    // this.AllSchemeData.forEach(d => {
    // if(this.AllSchemeData !== undefined) {
    Rx.Observable.from(this.AllSchemeData)
      .groupBy((z: any) => { z.Comodity; z.Coop }).flatMap(grop => grop.toArray())
      .map(g => {// mapping 
        return {
          Tyname: g[0].Tyname,//take the first name because we grouped them by name
          Comodity: g[0].Comodity,
          Coop: g[0].Coop,
          Scheme: g[0].Scheme,
          Date: g[0].Date,
          Dono: g[0].Dono,
          Amount: _.sumBy(g, 'Amount'),
          Rate: _.sumBy(g, 'Rate'),
          Quantity: _.sumBy(g, 'Quantity'), // using lodash to sum quantity
          // Amount: _.sumBy(g, 'Amount'), // using lodash to sum price
        }
      })

      .toArray() //.toArray because I guess you want to loop on it with ngFor      
      // .do(sum => console.log('sum:', sum)) // just for debug
      .subscribe(d => {
        groupedData = d;
        console.log(groupedData, 'Hii');
      });
    // })

    this.AllSchemeData = groupedData;
    let index = 0;
    for (let i = 0; i < groupedData[index]; i++) {

    }
  }

  getTotalQuantity() {
    return this.AllSchemeData.map(t => t.Quantity).reduce((acc, value) => acc + value, 0);
  }

  getTotalAmount() {
    return this.AllSchemeData.map(t => t.Amount).reduce((acc, value) => acc + value, 0);
  }

  getTotalRate() {
    return this.AllSchemeData.map(t => t.Rate).reduce((acc, value) => acc + value, 0);
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
    this.AllSchemeData = [];
  }

  onPrint() { }
}