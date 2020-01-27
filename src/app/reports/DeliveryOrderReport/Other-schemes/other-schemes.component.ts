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
import { GolbalVariable } from 'src/app/common/globalvariable';
import { saveAs } from 'file-saver';
import * as Rx from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-other-schemes',
  templateUrl: './other-schemes.component.html',
  styleUrls: ['./other-schemes.component.css']
})
export class OtherSchemesComponent implements OnInit {
  OtherSchemeCols: any;
  OtherSchemeData: any = [];
  fromDate: any = new Date();
  toDate: any = new Date();
  godownOptions: SelectItem[];
  SchemeOptions: SelectItem[];
  transactionOptions: SelectItem[];
  receiverOptions: SelectItem[];
  regionOptions: SelectItem[];
  selectedValues: any;
  regions: any;
  t_cd: any;
  g_cd: any;
  s_cd: any;
  r_cd: any;
  sch_cd: any;
  RCode: any;
  Trcode: any;
  trcode: any;
  data: any;
  SchCode: any;
  GCode: any;
  SCode: any;
  FilterArray: any;
  maxDate: Date;
  roleId: any;
  canShowMenu: boolean;
  isShowErr: boolean;
  loading: boolean = false;
  loggedInRCode: any;
  userId: any;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;
  @ViewChild('transaction', { static: false }) transactionPanel: Dropdown;
  @ViewChild('receiver', { static: false }) societyPanel: Dropdown;
  @ViewChild('scheme', { static: false }) schemePanel: Dropdown;



  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private authService: AuthService, private restAPIService: RestAPIService, private datepipe: DatePipe,
    private roleBasedService: RoleBasedService, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.OtherSchemeCols = this.tableConstants.DoOtherScheme;
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
    let SchemeSelection = [];
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
      case 'Sch':
        if (type === 'enter') {
          this.schemePanel.overlayVisible = true;
        }
        if (this.SchemeOptions === undefined) {
          this.restAPIService.get(PathConstants.SCHEMES).subscribe(data => {
            data.forEach(y => {
              SchemeSelection.push({ 'label': y.Name, 'value': y.SCCode });
            });
            this.SchemeOptions = SchemeSelection;
          });
        }
        break;
    }
  }
  // }

  onView() {
    this.onResetTable('');
    this.checkValidDateSelection();
    this.loading = true;
    const params = {
      'FromDate': this.datepipe.transform(this.fromDate, 'MM/dd/yyyy'),
      'ToDate': this.datepipe.transform(this.toDate, 'MM/dd/yyyy'),
      'GCode': this.GCode.value,
      'GName': this.GCode.label,
      'RName': this.RCode.label,
      'RCode': this.RCode.value,
      'UserName': this.userId.user,
      'SchCode': this.sch_cd.value
    };
    this.restAPIService.post(PathConstants.DELIVERY_ORDER_OTHERSCHEME, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.OtherSchemeData = res;
        this.FilterArray = res;
        this.loading = false;
        let sno = 0;
        let TotalAmount = 0;
        let TotalQuantity = 0;

        ///Sorting Array
        let sortedArray = _.sortBy(this.OtherSchemeData, 'Comodity');
        this.OtherSchemeData = sortedArray;
        ///End

        this.OtherSchemeData.forEach(data => {
          data.Dodate = this.datePipe.transform(data.Dodate, 'dd-MM-yyyy');
          sno += 1;
          data.SlNo = sno;
          TotalAmount += (data.Amount !== undefined && data.Amount !== null) ? (data.Amount * 1) : 0;
          TotalQuantity += (data.Quantity !== undefined && data.Quantity !== null) ? (data.Quantity * 1) : 0;
        });

        ///Grand total display
        this.OtherSchemeData.push(
          {
            Amount: TotalAmount.toFixed(2),
            Quantity: TotalQuantity.toFixed(3),
            Dono: 'Grand Total'
          }
        );
        ///End


        ///Grouping Array based on 'Commodity' & sum
        let groupedData;
        Rx.Observable.from(this.OtherSchemeData)
          .groupBy((x: any) => x.Comodity) // using groupBy from Rxjs
          .flatMap(group => group.toArray())// GroupBy dont create a array object so you have to flat it
          .map(g => {// mapping 
            return {
              Comodity: g[0].Comodity,//take the first name because we grouped them by name
              Quantity: _.sumBy(g, 'Quantity'),
              Amount: _.sumBy(g, 'Amount') // using lodash to sum quantity
            }
          })
          .toArray() //.toArray because I guess you want to loop on it with ngFor      
          .do(sum => sum) // just for debug
          .subscribe(d => { groupedData = d; console.log('data', groupedData); });
        ///End

        ///Inserting total in an array
        let index = 0;
        let item;
        for (let i = 0; i < this.OtherSchemeData.length; i++) {
          if (this.OtherSchemeData[i].Comodity !== groupedData[index].Comodity && groupedData[index].Comodity !== undefined) {
            item = {
              Dono: 'TOTAL',
              Amount: (groupedData[index].Amount * 1).toFixed(2),
              Quantity: (groupedData[index].Quantity * 1).toFixed(3),
            };
            this.OtherSchemeData.splice(i, 0, item);
            index += 1;
          }
        }
        ///End 

      } else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    }
    );
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
    this.OtherSchemeData = [];
  }

  onPrint() {
    const path = "../../assets/Reports/" + this.userId.user + "/";
    const filename = this.GCode.value + GolbalVariable.DOOthersReportFileName + ".txt";
    saveAs(path + filename, filename);
  }

  public getColor(name: string): string {
    return (name === 'Grand Total') ? "#53aae5" : "white";
  }
}