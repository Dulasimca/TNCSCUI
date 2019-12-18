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
import { GolbalVariable } from 'src/app/common/globalvariable';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-annapoorna',
  templateUrl: './annapoorna.component.html',
  styleUrls: ['./annapoorna.component.css']
})
export class AnnapoornaComponent implements OnInit {
  AnnapoornaCols: any;
  AnnapoornaData: any = [];
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
  totalRecords: number;
  @ViewChild('godown') godownPanel: Dropdown;
  @ViewChild('region') regionPanel: Dropdown;
  @ViewChild('transaction') transactionPanel: Dropdown;
  @ViewChild('receiver') societyPanel: Dropdown;



  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private authService: AuthService, private restAPIService: RestAPIService, private datepipe: DatePipe,
    private roleBasedService: RoleBasedService, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.AnnapoornaCols = this.tableConstants.DoAnnaPoorna;
    this.data = this.roleBasedService.getInstance();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
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
            if (x.RCode === this.RCode.value) {
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
    this.onResetTable('');
    this.loading = true;
    const params = {
      'FromDate': this.datepipe.transform(this.fromDate, 'MM/dd/yyyy'),
      'ToDate': this.datepipe.transform(this.toDate, 'MM/dd/yyyy'),
      'GCode': this.GCode.value,
      // 'SCode': this.r_cd.value,
      'UserName': this.userId.user,
      'GName': this.GCode.label,
      'RName': this.RCode.label,
      'RCode': this.RCode.value
    };
    this.restAPIService.post(PathConstants.DELIVERY_ORDER_ANNAPOORNA, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.AnnapoornaData = res;
        this.FilterArray = res;
        this.loading = false;
        let sno = 0;
        let TotalAmount = 0;
        let TotalQuantity = 0;
        let TotalRate = 0;
        this.AnnapoornaData.forEach(data => {
          TotalAmount += data.Amount !== undefined && data.Amount !== null ? (data.Amount * 1) : 0;
          TotalQuantity += data.Quantity !== undefined && data.Quantity !== null ? (data.Quantity * 1) : 0;
          TotalRate += data.Rate !== undefined && data.Rate !== undefined ? (data.Rate * 1) : 0;
          sno += 1;
          data.SlNo = sno;
        });
        this.AnnapoornaData.push(
          {
            Amount: TotalAmount.toFixed(2),
            Quantity: TotalQuantity.toFixed(2),
            Rate: TotalRate.toFixed(2),
            Dono: 'Total'
          }
        );
        this.FilterArray = this.AnnapoornaData.filter(item => {
          return item.Tyname === this.r_cd.label;
        });

        sno = 0;
        let FilterAmount = 0;
        let FilterRate = 0;
        let FilterQuantity = 0;
        this.FilterArray.forEach(data => {
          FilterAmount += data.Amount !== undefined && data.Amount !== null ? (data.Amount * 1) : 0;
          FilterQuantity += data.Quantity !== undefined && data.Quantity !== null ? (data.Quantity * 1) : 0;
          FilterRate += data.Rate !== undefined && data.Rate !== null ? (data.Rate * 1) : 0;
          sno += 1;
          data.SlNo = sno;
        });
        this.FilterArray.push(
          {
            Amount: FilterAmount.toFixed(2),
            Quantity: FilterQuantity.toFixed(2),
            Rate: FilterRate.toFixed(2),
            Dono: 'Total'
          }
        );
        this.AnnapoornaData = this.FilterArray;
        this.totalRecords = this.AnnapoornaData.length;
      }

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
    // this.AnnapoornaData = this.FilterArray;
    this.AnnapoornaData.splice(this.AnnapoornaData.length, 0, '');
    let groupedData: any = [];
    // Rx.Observable.from(this.AnnapoornaData)
    //   .groupBy((x: any) => x.Tyname).flatMap(grop => grop.toArray())
    // Rx.Observable.from(this.AnnapoornaData)
    //   .groupBy((y: any) => y.Coop).flatMap(grop => grop.toArray())
    // this.AnnapoornaData.forEach(d => {
    // if(this.AnnapoornaData !== undefined) {
    Rx.Observable.from(this.AnnapoornaData)
      .groupBy((z: any) => { z.Comodity; z.Coop }).flatMap(grop => grop.toArray())
      .map(g => {// mapping 
        return {
          Tyname: g[0].Tyname,//take the first name because we grouped them by name
          Comodity: g[0].Comodity,
          Coop: g[0].Coop,
          Scheme: g[0].Scheme,
          Date: g[0].Date,
          Dono: g[0].Dono,
          Amount: g[0].Amount.toFixed(2),
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

    this.AnnapoornaData = groupedData;
    let index = 0;
    for (let i = 0; i < groupedData[index]; i++) {

    }
  }

  // getTotalQuantity() {
  //   return this.AnnapoornaData.map(t => t.Quantity * 1).reduce((acc, value) => acc + value, 0);
  // }

  // getTotalAmount() {
  //   if(this.AnnapoornaData.TotalAmount !== undefined && this.AnnapoornaData.TotalAmount !== null )
  //   {
  //   this.AnnapoornaData.TotalAmount.toFixed(2)

  //   this.AnnapoornaData.TotalAmount * 1;
  //  }
  //   else return 0;
  //   // return this.AnnapoornaData.map(t => t.Amount).reduce((acc, value) => acc + value, 0);
  // }

  // getTotalRate() {
  //   return this.AnnapoornaData.map(t => t.Rate).reduce((acc, value) => acc + value, 0);
  // }

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
    this.AnnapoornaData = [];
    this.totalRecords = 0;
  }

  onPrint() {
    const path = "../../assets/Reports/" + this.userId.user + "/";
    const filename = this.GCode.value + GolbalVariable.DOAnnapornaReportFileName + ".txt";
    saveAs(path + filename, filename);
  }
}