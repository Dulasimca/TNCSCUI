import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/primeng';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { DatePipe } from '@angular/common';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { StatusMessage } from 'src/app/constants/Messages';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpErrorResponse } from '@angular/common/http';
import { ExcelService } from 'src/app/shared-services/excel.service';
import 'rxjs/add/observable/from';
import 'rxjs/Rx';
import * as Rx from 'rxjs';
import * as _ from 'lodash';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-pds-liftment-report',
  templateUrl: './pds-liftment-report.component.html',
  styles: [`
  .loading-text {
      display: block;
      background-color: #f1f1f1;
      min-height: 19px;
      animation: pulse 1s infinite ease-in-out;
      text-indent: -99999px;
      overflow: hidden;
  }
`],
  styleUrls: ['./pds-liftment-report.component.css']
})
export class PdsLiftmentReportComponent implements OnInit {

  PDSLiftmentData: any = [];
  PDSLiftmentCols: any;
  frozenPDSLiftmentCols: any;
  Date: Date = new Date();
  roleId: any;
  maxDate: Date;
  canShowMenu: boolean;
  loading: boolean = false;
  userId: any;
  yearRange: string;
  AllotmentPeriod: Date;
  viewPane: boolean;
  frozenPDSLiftmentGodownCols: any;
  GodownPDSDetailData: any = [];
  items: any;
  canLoad: boolean;
  @ViewChild('dt', { static: false }) table: Table;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private authService: AuthService, private restAPIService: RestAPIService,
    private messageService: MessageService, private excelService: ExcelService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.PDSLiftmentCols = this.tableConstants.PDSLiftmentColumns;
    this.frozenPDSLiftmentCols = this.tableConstants.FrozenPDSLiftmentColumns;
    this.frozenPDSLiftmentGodownCols = this.tableConstants.FrozenPDSLiftmentGodownColumns;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.userId = JSON.parse(this.authService.getCredentials());
    this.maxDate = new Date();
    this.yearRange = (this.maxDate.getFullYear() - 10) + ':' + this.maxDate.getFullYear();
    this.AllotmentPeriod = new Date();
    this.items = [
      {
        label: 'By Region', command: () => {
          this.onView('R');
        }
      },
      {
        label: 'By Godwown', command: () => {
          this.onView('G');
        }
      }]
  }

  onView(type) {
    this.loading = true;
    this.table.reset();
    const month = this.AllotmentPeriod.getMonth() + 1;
    this.PDSLiftmentData.length = 0;
    if (type === 'R') {
      this.canLoad = true;
      this.frozenPDSLiftmentCols = this.tableConstants.FrozenPDSLiftmentColumns;
    } else {
      this.canLoad = false;
      this.frozenPDSLiftmentCols.forEach(i => {
        if (i.field === 'Name') {
          i.header = 'Godown Name';
        }
      })
    }
    const params = {
      Date: this.datePipe.transform(this.Date, 'MM/dd/yyyy'),
      Month: (month <= 9) ? '0' + month : month,
      Year: this.AllotmentPeriod.getFullYear(),
      DocType: 1,
      Type: (this.canLoad) ? 1 : 2
    };
    this.restAPIService.post(PathConstants.PDS_LIFTMENT_POST, params).subscribe(res => {
      let tempData = [];
      if (res !== undefined && res !== null && res.length !== 0) {
        res.forEach(x => {
          if (x.Code !== null && x.Code !== undefined) {
            tempData.push(x);
          }
        })
        tempData = res.slice(0);
        this.PDSLiftmentData = tempData.slice(0);
        this.processPDSData(tempData, type);
      } else {
        this.loading = false;
        this.PDSLiftmentData.length = 0;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.PDSLiftmentData.length = 0;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
  }

  processPDSData(data, type) {
    let j = 0;
    for (let i = 0; i <= data.length - 1; i++) {
      let allotQty: any = (data[i].AllotmentQty !== null && data[i].AllotmentQty !== undefined) ? ((data[i].AllotmentQty * 1) / 1000).toFixed(3) : 0;
      allotQty = (allotQty * 1)
      let issueQty: any = (data[i].IssueQty !== null && data[i].IssueQty !== undefined) ? ((data[i].IssueQty * 1) / 1000).toFixed(3) : 0;
      issueQty = (issueQty * 1);
      const codePrev = data[i - 1] !== undefined ? data[i - 1].Code : '';
      const code = (codePrev !== '') ? data[i].Code : '';
      const codeNext = (data[i + 1] !== undefined) ? data[i + 1].Code : '';
      if (data[i].Code === codeNext || codePrev === code || codeNext === '' || (data[i].code !== (codeNext && codePrev))) {
        // this.PDSLiftmentData[j].RName = (type === 'G') ? data[i].RName : '';
        this.PDSLiftmentData[j].Name = data[i].Name;
        this.PDSLiftmentData[j].Code = data[i].Code;
        this.PDSLiftmentData[j].RCode = data[i].RCode;
        this.PDSLiftmentData[j].RName = data[i].RName;
        this.PDSLiftmentData[j].slno = j + 1;
        switch (data[i].allotmentgroup) {
          case 'PALMOIL':
            this.PDSLiftmentData[j].AllotmentOil = (data[i].AllotmentQty !== undefined && data[i].AllotmentQty !== null)
              ? (data[i].AllotmentQty * 1) : 0;
            this.PDSLiftmentData[j].LiftedOil = (data[i].IssueQty !== undefined && data[i].IssueQty !== null)
              ? (data[i].IssueQty * 1) : 0;
            this.PDSLiftmentData[j].BalanceOil = (data[i].BalanceQty !== undefined && data[i].BalanceQty !== null) ?
              data[i].BalanceQty : 0;
            this.PDSLiftmentData[j].AvailableOil = (data[i].ClosingBalance !== undefined && data[i].ClosingBalance !== null) ?
              data[i].ClosingBalance : 0;
            const percentOil = (allotQty === 0) ? 0 : (isNaN(issueQty / allotQty) ? 0 : (issueQty / allotQty) * 100);
            this.PDSLiftmentData[j].PercentNoOil = percentOil.toFixed(0);
            this.PDSLiftmentData[j].PercentNoOil = (this.PDSLiftmentData[j].PercentNoOil * 1);
            this.PDSLiftmentData[j].PercentOil = percentOil.toFixed(0) + '%';
            break;
          case 'RICE':
            this.PDSLiftmentData[j].AllotmentRice = allotQty;
            this.PDSLiftmentData[j].LiftedRice = issueQty;
            this.PDSLiftmentData[j].BalanceRice = (data[i].BalanceQty !== undefined && data[i].BalanceQty !== null)
              ? ((data[i].BalanceQty * 1) / 1000).toFixed(3) : 0;
            this.PDSLiftmentData[j].BalanceRice = (this.PDSLiftmentData[j].BalanceRice * 1);
            this.PDSLiftmentData[j].AvailableRice = (data[i].ClosingBalance !== undefined && data[i].ClosingBalance !== null)
              ? ((data[i].ClosingBalance * 1) / 1000).toFixed(3) : 0;
            this.PDSLiftmentData[j].AvailableRice = (this.PDSLiftmentData[j].AvailableRice * 1);
            const percentRice = (allotQty === 0) ? 0 : (isNaN(issueQty / allotQty) ? 0 : (issueQty / allotQty) * 100);
            this.PDSLiftmentData[j].PercentNoRice = percentRice.toFixed(0);
            this.PDSLiftmentData[j].PercentNoRice = (this.PDSLiftmentData[j].PercentNoRice * 1);
            this.PDSLiftmentData[j].PercentRice = percentRice.toFixed(0) + '%';
            break;
          case 'SUGAR':
            this.PDSLiftmentData[j].AllotmentSugar = allotQty
            this.PDSLiftmentData[j].LiftedSugar = issueQty
            this.PDSLiftmentData[j].BalanceSugar = (data[i].BalanceQty !== undefined && data[i].BalanceQty !== null)
              ? ((data[i].BalanceQty * 1) / 1000).toFixed(3) : 0;
            this.PDSLiftmentData[j].BalanceSugar = (this.PDSLiftmentData[j].BalanceSugar * 1);
            this.PDSLiftmentData[j].AvailableSugar = (data[i].ClosingBalance !== undefined && data[i].ClosingBalance !== null)
              ? ((data[i].ClosingBalance * 1) / 1000).toFixed(3) : 0;
            this.PDSLiftmentData[j].AvailableSugar = (this.PDSLiftmentData[j].AvailableSugar * 1);
            const percentSugar = (allotQty === 0) ? 0 : (isNaN(issueQty / allotQty) ? 0 : (issueQty / allotQty) * 100);
            this.PDSLiftmentData[j].PercentNoSugar = percentSugar.toFixed(0);
            this.PDSLiftmentData[j].PercentNoSugar = (this.PDSLiftmentData[j].PercentNoSugar * 1);
            this.PDSLiftmentData[j].PercentSugar = percentSugar.toFixed(0) + '%';
            break;
          case 'WHEAT':
            this.PDSLiftmentData[j].AllotmentWheat = allotQty
            this.PDSLiftmentData[j].LiftedWheat = issueQty
            this.PDSLiftmentData[j].BalanceWheat = (data[i].BalanceQty !== undefined && data[i].BalanceQty !== null)
              ? ((data[i].BalanceQty * 1) / 1000).toFixed(3) : 0;
            this.PDSLiftmentData[j].BalanceWheat = (this.PDSLiftmentData[j].BalanceWheat * 1);
            this.PDSLiftmentData[j].AvailableWheat = (data[i].ClosingBalance !== undefined && data[i].ClosingBalance !== null)
              ? ((data[i].ClosingBalance * 1) / 1000).toFixed(3) : 0;
            this.PDSLiftmentData[j].AvailableWheat = (this.PDSLiftmentData[j].AvailableWheat * 1);
            const percentWheat = (allotQty === 0) ? 0 : (isNaN(issueQty / allotQty) ? 0 : (issueQty / allotQty) * 100);
            this.PDSLiftmentData[j].PercentNoWheat = percentWheat.toFixed(0);
            this.PDSLiftmentData[j].PercentNoWheat = (this.PDSLiftmentData[j].PercentNoWheat * 1);
            this.PDSLiftmentData[j].PercentWheat = percentWheat.toFixed(0) + '%';
            break;
          case 'TOORDHALL':
            this.PDSLiftmentData[j].AllotmentDhall = allotQty
            this.PDSLiftmentData[j].LiftedDhall = issueQty
            this.PDSLiftmentData[j].BalanceDhall = (data[i].BalanceQty !== undefined && data[i].BalanceQty !== null)
              ? ((data[i].BalanceQty * 1) / 1000).toFixed(3) : 0;
            this.PDSLiftmentData[j].BalanceDhall = (this.PDSLiftmentData[j].BalanceDhall * 1);
            this.PDSLiftmentData[j].AvailableDhall = (data[i].ClosingBalance !== undefined && data[i].ClosingBalance !== null)
              ? ((data[i].ClosingBalance * 1) / 1000).toFixed(3) : 0;
            this.PDSLiftmentData[j].AvailableDhall = (this.PDSLiftmentData[j].AvailableDhall * 1);
            const percentDhall = (allotQty === 0) ? 0 : (isNaN(issueQty / allotQty) ? 0 : (issueQty / allotQty) * 100);
            this.PDSLiftmentData[j].PercentNoDhall = percentDhall.toFixed(0);
            this.PDSLiftmentData[j].PercentNoDhall = (this.PDSLiftmentData[j].PercentNoDhall * 1);
            this.PDSLiftmentData[j].PercentDhall = percentDhall.toFixed(0) + '%';
            break;
        }
      }
      if (data[i].Code !== codeNext) {
        j += 1;
      }
    }
    this.PDSLiftmentData = this.PDSLiftmentData.slice(0, j);
    if (type === 'G') {
      this.PDSLiftmentData.splice(this.PDSLiftmentData.length, 0, '');
      let groupedData;
      Rx.Observable.from(this.PDSLiftmentData)
        .groupBy((x: any) => x.RName) // using groupBy from Rxjs
        .flatMap(group => group.toArray())// GroupBy dont create a array object so you have to flat it
        .map(g => {// mapping 
          return {
            RName: g[0].RName,//take the first name because we grouped them by name
            AllotmentDhall: _.sumBy(g, 'AllotmentDhall'), // using lodash to sum quantity
            LiftedDhall: _.sumBy(g, 'LiftedDhall'),
            BalanceDhall: _.sumBy(g, 'BalanceDhall'),
            AvailableDhall: _.sumBy(g, 'AvailableDhall'),
            PercentNoDhall: _.sumBy(g, 'PercentNoDhall'),
            AllotmentWheat: _.sumBy(g, 'AllotmentWheat'),
            LiftedWheat: _.sumBy(g, 'LiftedWheat'),
            BalanceWheat: _.sumBy(g, 'BalanceWheat'),
            AvailableWheat: _.sumBy(g, 'AvailableWheat'),
            PercentNoWheat: _.sumBy(g, 'PercentNoWheat'),
            AllotmentSugar: _.sumBy(g, 'AllotmentSugar'),
            LiftedSugar: _.sumBy(g, 'LiftedSugar'),
            BalanceSugar: _.sumBy(g, 'BalanceSugar'),
            AvailableSugar: _.sumBy(g, 'AvailableSugar'),
            PercentNoSugar: _.sumBy(g, 'PercentNoSugar'),
            AllotmentRice: _.sumBy(g, 'AllotmentRice'),
            LiftedRice: _.sumBy(g, 'LiftedRice'),
            BalanceRice: _.sumBy(g, 'BalanceRice'),
            AvailableRice: _.sumBy(g, 'AvailableRice'),
            PercentNoRice: _.sumBy(g, 'PercentNoRice'),
            AllotmentOil: _.sumBy(g, 'AllotmentOil'),
            LiftedOil: _.sumBy(g, 'LiftedOil'),
            BalanceOil: _.sumBy(g, 'BalanceOil'),
            AvailableOil: _.sumBy(g, 'AvailableOil'),
            PercentNoOil: _.sumBy(g, 'PercentNoOil')
          }
        })
        .toArray() //.toArray because I guess you want to loop on it with ngFor      
        .do(sum => console.log('sum:', sum)) // just for debug
        .subscribe(d => groupedData = d);
      let index = 0;
      let item;
      for (let i = 0; i < this.PDSLiftmentData.length; i++) {
        if (groupedData[index].RName !== undefined) {
          if (this.PDSLiftmentData[i].RName !== groupedData[index].RName) {
            item = {
              Name: (groupedData[index].RName) + ' - TOTAL',
              RName: (groupedData[index].RName) + ' - TOTAL',
              AllotmentDhall: (groupedData[index].AllotmentDhall * 1).toFixed(3),
              AllotmentOil: (groupedData[index].AllotmentOil * 1),
              AllotmentWheat: (groupedData[index].AllotmentWheat * 1).toFixed(3),
              AllotmentSugar: (groupedData[index].AllotmentSugar * 1).toFixed(3),
              AllotmentRice: (groupedData[index].AllotmentRice * 1).toFixed(3),
              BalanceRice: (groupedData[index].BalanceRice * 1).toFixed(3),
              BalanceSugar: (groupedData[index].BalanceSugar * 1).toFixed(3),
              BalanceWheat: (groupedData[index].BalanceWheat * 1).toFixed(3),
              BalanceDhall: (groupedData[index].BalanceDhall * 1).toFixed(3),
              BalanceOil: (groupedData[index].BalanceOil * 1),
              AvailableRice: (groupedData[index].AvailableRice * 1).toFixed(3),
              AvailableSugar: (groupedData[index].AvailableSugar * 1).toFixed(3),
              AvailableWheat: (groupedData[index].AvailableWheat * 1).toFixed(3),
              AvailableDhall: (groupedData[index].AvailableDhall * 1).toFixed(3),
              AvailableOil: (groupedData[index].AvailableOil * 1),
              LiftedRice: (groupedData[index].LiftedRice * 1).toFixed(3),
              LiftedSugar: (groupedData[index].LiftedSugar * 1).toFixed(3),
              LiftedWheat: (groupedData[index].LiftedWheat * 1).toFixed(3),
              LiftedDhall: (groupedData[index].LiftedDhall * 1).toFixed(3),
              LiftedOil: (groupedData[index].LiftedOil * 1),
              PercentDhall: (((groupedData[index].PercentNoDhall * 1) * 1).toFixed(0)) + '%',
              PercentOil: (((groupedData[index].PercentNoOil * 1) * 1).toFixed(0)) + '%',
              PercentRice: (((groupedData[index].PercentNoRice * 1) * 1).toFixed(0)) + '%',
              PercentSugar: (((groupedData[index].PercentNoSugar * 1) * 1).toFixed(0)) + '%',
              PercentWheat: (((groupedData[index].PercentNoWheat * 1) * 1).toFixed(0)) + '%'
            };
            this.PDSLiftmentData.splice(i, 0, item);
            index += 1;
          }
        }
      }
    }
    this.PDSLiftmentData = this.calculateTotal(this.PDSLiftmentData, type);
    this.loading = false;
  }

  viewGodownBreakdown(data) {
    if (this.canLoad) {
      this.GodownPDSDetailData.length = 0;
      this.viewPane = true;
      this.loading = true;
      const month = this.AllotmentPeriod.getMonth() + 1;
      const params = {
        Date: this.datePipe.transform(this.Date, 'MM/dd/yyyy'),
        Month: (month <= 9) ? '0' + month : month,
        Year: this.AllotmentPeriod.getFullYear(),
        RCode: data.Code
      };
      this.restAPIService.getByParameters(PathConstants.PDS_LIFTMENT_GET, params).subscribe(res => {
        let tempData = [];
        if (res !== undefined && res !== null && res.length !== 0) {
          res.forEach(x => {
            if (x.GCode !== null && x.GCode !== undefined) {
              tempData.push(x);
            }
          })
          this.GodownPDSDetailData = tempData;
          let j = 0;
          for (let i = 0; i <= tempData.length - 1; i++) {
            let allotQty: any = (tempData[i].AllotmentQty !== null && tempData[i].AllotmentQty !== undefined) ? ((tempData[i].AllotmentQty * 1) / 1000).toFixed(3) : 0;
            allotQty = (allotQty * 1)
            let issueQty: any = (tempData[i].IssueQty !== null && tempData[i].IssueQty !== undefined) ? ((tempData[i].IssueQty * 1) / 1000).toFixed(3) : 0;
            issueQty = (issueQty * 1);
            const gcodePrev = tempData[i - 1] !== undefined ? tempData[i - 1].GCode : '';
            const gcode = (gcodePrev !== '') ? tempData[i].GCode : '';
            const gcodeNext = (tempData[i + 1] !== undefined) ? tempData[i + 1].GCode : '';
            if (tempData[i].GCode === gcodeNext || gcodePrev === gcode || gcodeNext === '') {
              this.GodownPDSDetailData[j].Name = tempData[i].GName1;
              this.GodownPDSDetailData[j].GCode = tempData[i].GCode;
              this.GodownPDSDetailData[j].slno = j + 1;
              switch (tempData[i].allotmentgroup) {
                case 'PALMOIL':
                  this.PDSLiftmentData[j].AllotmentOil = (tempData[i].AllotmentQty !== undefined && tempData[i].AllotmentQty !== null)
                    ? (tempData[i].AllotmentQty * 1) : 0;
                  this.PDSLiftmentData[j].LiftedOil = (tempData[i].IssueQty !== undefined && tempData[i].IssueQty !== null)
                    ? (tempData[i].IssueQty * 1) : 0;
                  this.GodownPDSDetailData[j].BalanceOil = (tempData[i].BalanceQty !== undefined && tempData[i].BalanceQty !== null)
                    ? (tempData[i].BalanceQty * 1) : 0;
                  this.GodownPDSDetailData[j].AvailableOil = (tempData[i].ClosingBalance !== undefined && tempData[i].ClosingBalance !== null)
                    ? (tempData[i].ClosingBalance * 1) : 0;
                  const percentOil = (allotQty === 0) ? 0 : (isNaN(issueQty / allotQty) ? 0 : (issueQty / allotQty) * 100);
                  this.GodownPDSDetailData[j].PercentNoOil = percentOil.toFixed(0);
                  this.GodownPDSDetailData[j].PercentOil = percentOil.toFixed(0) + '%';
                  break;
                case 'RICE':
                  this.GodownPDSDetailData[j].AllotmentRice = allotQty;
                  this.GodownPDSDetailData[j].LiftedRice = issueQty;
                  this.GodownPDSDetailData[j].BalanceRice = (tempData[i].BalanceQty !== undefined && tempData[i].BalanceQty !== null)
                    ? ((tempData[i].BalanceQty * 1) / 1000).toFixed(3) : 0;
                  this.GodownPDSDetailData[j].AvailableRice = (tempData[i].ClosingBalance !== undefined && tempData[i].ClosingBalance !== null)
                    ? ((tempData[i].ClosingBalance * 1) / 1000).toFixed(3) : 0;
                  const percentRice = (allotQty === 0) ? 0 : (isNaN(issueQty / allotQty) ? 0 : (issueQty / allotQty) * 100);
                  this.GodownPDSDetailData[j].PercentNoRice = percentRice.toFixed(0);
                  this.GodownPDSDetailData[j].PercentRice = percentRice.toFixed(0) + '%';
                  break;
                case 'SUGAR':
                  this.GodownPDSDetailData[j].AllotmentSugar = allotQty;
                  this.GodownPDSDetailData[j].LiftedSugar = issueQty;
                  this.GodownPDSDetailData[j].BalanceSugar = (tempData[i].BalanceQty !== undefined && tempData[i].BalanceQty !== null)
                    ? ((tempData[i].BalanceQty * 1) / 1000).toFixed(3) : 0;
                  this.GodownPDSDetailData[j].AvailableSugar = (tempData[i].ClosingBalance !== undefined && tempData[i].ClosingBalance !== null)
                    ? ((tempData[i].ClosingBalance * 1) / 1000).toFixed(3) : 0;
                  const percentSugar = (allotQty === 0) ? 0 : (isNaN(issueQty / allotQty) ? 0 : (issueQty / allotQty) * 100);
                  this.GodownPDSDetailData[j].PercentNoSugar = percentSugar.toFixed(0);
                  this.GodownPDSDetailData[j].PercentSugar = percentSugar.toFixed(0) + '%';
                  break;
                case 'WHEAT':
                  this.GodownPDSDetailData[j].AllotmentWheat = allotQty;
                  this.GodownPDSDetailData[j].LiftedWheat = issueQty;
                  this.GodownPDSDetailData[j].BalanceWheat = (tempData[i].BalanceQty !== undefined && tempData[i].BalanceQty !== null)
                    ? ((tempData[i].BalanceQty * 1) / 1000).toFixed(3) : 0;
                  this.GodownPDSDetailData[j].AvailableWheat = (tempData[i].ClosingBalance !== undefined && tempData[i].ClosingBalance !== null)
                    ? ((tempData[i].ClosingBalance * 1) / 1000).toFixed(3) : 0;
                  const percentWheat = (allotQty === 0) ? 0 : (isNaN(issueQty / allotQty) ? 0 : (issueQty / allotQty) * 100);
                  this.GodownPDSDetailData[j].PercentNoWheat = percentWheat.toFixed(0);
                  this.GodownPDSDetailData[j].PercentWheat = percentWheat.toFixed(0) + '%';
                  break;
                case 'TOORDHALL':
                  this.GodownPDSDetailData[j].AllotmentDhall = allotQty;
                  this.GodownPDSDetailData[j].LiftedDhall = issueQty;
                  this.GodownPDSDetailData[j].BalanceDhall = (tempData[i].BalanceQty !== undefined && tempData[i].BalanceQty !== null)
                    ? ((tempData[i].BalanceQty * 1) / 1000).toFixed(3) : 0;
                  this.GodownPDSDetailData[j].AvailableDhall = (tempData[i].ClosingBalance !== undefined && tempData[i].ClosingBalance !== null)
                    ? ((tempData[i].ClosingBalance * 1) / 1000).toFixed(3) : 0;
                  const percentDhall = (allotQty === 0) ? 0 : (isNaN(issueQty / allotQty) ? 0 : (issueQty / allotQty) * 100);
                  this.GodownPDSDetailData[j].PercentNoDhall = percentDhall.toFixed(0);
                  this.GodownPDSDetailData[j].PercentDhall = percentDhall.toFixed(0) + '%';
                  break;
              }
            }
            if (tempData[i].GCode !== gcodeNext) {
              j += 1;
            }
          }
          this.GodownPDSDetailData = this.GodownPDSDetailData.slice(0, j);
          this.GodownPDSDetailData = this.calculateTotal(this.GodownPDSDetailData, 'R');
          this.loading = false;
        } else {
          this.loading = false;
          this.GodownPDSDetailData.length = 0;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
            summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination
          });
        }
      }, (err: HttpErrorResponse) => {
        if (err.status === 0 || err.status === 400) {
          this.loading = false;
          this.GodownPDSDetailData.length = 0;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
            summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
          });
        }
      })
    }
  }

  calculateTotal(data, type) {
    ///Grand Total
    let TotalAllotmentRice = 0;
    let TotalLiftedRice = 0;
    let TotalBalanceRice = 0;
    let TotalAvailableRice = 0;
    let TotalPercentRice = 0;
    let TotalAllotmentSugar = 0;
    let TotalLiftedSugar = 0;
    let TotalBalanceSugar = 0;
    let TotalAvailableSugar = 0;
    let TotalPercentSugar = 0;
    let TotalAllotmentWheat = 0;
    let TotalLiftedWheat = 0;
    let TotalBalanceWheat = 0;
    let TotalAvailableWheat = 0;
    let TotalPercentWheat = 0;
    let TotalAllotmentOil = 0;
    let TotalLiftedOil = 0;
    let TotalBalanceOil = 0;
    let TotalAvailableOil = 0;
    let TotalPercentOil = 0;
    let TotalAllotmentDhall = 0;
    let TotalLiftedDhall = 0;
    let TotalBalanceDhall = 0;
    let TotalAvailableDhall = 0;
    let TotalPercentDhall = 0;
    data.forEach(i => {
      if ((i.RName !== undefined && i.Name !== undefined) || type === 'R') {
        var name: string = (i.RName !== undefined) ? i.RName + ' - TOTAL' : '';
        name = name.trim();
        if ((type !== 'R' && i.Name.trim() !== name) || type === 'R') {
          TotalAllotmentRice += (i.AllotmentRice !== undefined && i.AllotmentRice !== null) ? (i.AllotmentRice * 1) : 0;
          TotalLiftedRice += (i.LiftedRice !== undefined && i.LiftedRice !== null) ? (i.LiftedRice * 1) : 0;
          TotalBalanceRice += (i.BalanceRice !== undefined && i.BalanceRice !== null) ? (i.BalanceRice * 1) : 0;
          TotalAvailableRice += (i.AvailableRice !== undefined && i.AvailableRice !== null) ? (i.AvailableRice * 1) : 0;
          TotalPercentRice = (TotalAllotmentRice === 0) ? 0 : (isNaN(TotalLiftedRice / TotalAllotmentRice)
            ? 0 : (TotalLiftedRice / TotalAllotmentRice) * 100);
          TotalAllotmentSugar += (i.AllotmentSugar !== undefined && i.AllotmentSugar !== null) ? (i.AllotmentSugar * 1) : 0;
          TotalLiftedSugar += (i.LiftedSugar !== undefined && i.LiftedSugar !== null) ? (i.LiftedSugar * 1) : 0;
          TotalBalanceSugar += (i.BalanceSugar !== undefined && i.BalanceSugar !== null) ? (i.BalanceSugar * 1) : 0;
          TotalAvailableSugar += (i.AvailableSugar !== undefined && i.AvailableSugar !== null) ? (i.AvailableSugar * 1) : 0;
          TotalPercentSugar = (TotalAllotmentSugar === 0) ? 0 : (isNaN(TotalLiftedSugar / TotalAllotmentSugar)
            ? 0 : (TotalLiftedSugar / TotalAllotmentSugar) * 100);
          TotalAllotmentWheat += (i.AllotmentWheat !== undefined && i.AllotmentWheat !== null) ? (i.AllotmentWheat * 1) : 0;
          TotalLiftedWheat += (i.LiftedWheat !== undefined && i.LiftedWheat !== null) ? (i.LiftedWheat * 1) : 0;
          TotalBalanceWheat += (i.BalanceWheat !== undefined && i.BalanceWheat !== null) ? (i.BalanceWheat * 1) : 0;
          TotalAvailableWheat += (i.AvailableWheat !== undefined && i.AvailableWheat !== null) ? (i.AvailableWheat * 1) : 0;
          TotalPercentWheat = (TotalAllotmentWheat === 0) ? 0 : (isNaN(TotalLiftedWheat / TotalAllotmentWheat)
            ? 0 : (TotalLiftedWheat / TotalAllotmentWheat) * 100);
          TotalAllotmentDhall += (i.AllotmentDhall !== undefined && i.AllotmentDhallv !== null) ? (i.AllotmentDhall * 1) : 0;
          TotalLiftedDhall += (i.LiftedDhall !== undefined && i.LiftedDhall !== null) ? (i.LiftedDhall * 1) : 0;
          TotalBalanceDhall += (i.BalanceDhall !== undefined && i.BalanceDhall !== null) ? (i.BalanceDhall * 1) : 0;
          TotalAvailableDhall += (i.AvailableDhall !== undefined && i.AvailableDhall !== null) ? (i.AvailableDhall * 1) : 0;
          TotalPercentDhall = (TotalAllotmentDhall === 0) ? 0 : (isNaN(TotalLiftedDhall / TotalAllotmentDhall)
            ? 0 : (TotalLiftedDhall / TotalAllotmentDhall) * 100);
          TotalAllotmentOil += (i.AllotmentOil !== undefined && i.AllotmentOil !== null) ? (i.AllotmentOil * 1) : 0;
          TotalLiftedOil += (i.LiftedOil !== undefined && i.LiftedOil !== null) ? (i.LiftedOil * 1) : 0;
          TotalBalanceOil += (i.BalanceOil !== undefined && i.BalanceOil !== null) ? (i.BalanceOil * 1) : 0;
          TotalAvailableOil += (i.AvailableOil !== undefined && i.AvailableOil !== null) ? (i.AvailableOil * 1) : 0;
          TotalPercentOil = (TotalAllotmentOil === 0) ? 0 : (isNaN(TotalLiftedOil / TotalAllotmentOil)
            ? 0 : (TotalLiftedOil / TotalAllotmentOil) * 100);
        }
      }
    })
    data.push({
      Name: 'Grand Total', AllotmentDhall: TotalAllotmentDhall.toFixed(3),
      AllotmentOil: TotalAllotmentOil, AllotmentWheat: TotalAllotmentWheat.toFixed(3),
      AllotmentSugar: TotalAllotmentSugar.toFixed(3), AllotmentRice: TotalAllotmentRice.toFixed(3),
      BalanceRice: TotalBalanceRice.toFixed(3), BalanceSugar: TotalBalanceSugar.toFixed(3),
      BalanceWheat: TotalBalanceWheat.toFixed(3), BalanceDhall: TotalBalanceDhall.toFixed(3),
      BalanceOil: TotalBalanceOil, AvailableRice: TotalAvailableRice.toFixed(3),
      AvailableSugar: TotalAvailableSugar.toFixed(3), AvailableWheat: TotalAvailableWheat.toFixed(3),
      AvailableDhall: TotalAvailableDhall.toFixed(3), AvailableOil: TotalAvailableOil,
      LiftedRice: TotalLiftedRice.toFixed(3), LiftedSugar: TotalLiftedSugar.toFixed(3),
      LiftedWheat: TotalLiftedWheat.toFixed(3), LiftedDhall: TotalLiftedDhall.toFixed(3),
      LiftedOil: TotalLiftedOil, PercentDhall: ((TotalPercentDhall * 1).toFixed(0)) + '%',
      PercentOil: ((TotalPercentOil * 1).toFixed(0)) + '%', PercentRice: ((TotalPercentRice * 1).toFixed(0)) + '%',
      PercentSugar: ((TotalPercentSugar * 1).toFixed(0)) + '%', PercentWheat: ((TotalPercentWheat * 1).toFixed(0)) + '%'
    })
    return data;
  }

  onResetTable(item) {
    this.PDSLiftmentData = [];
    this.loading = false;
  }

  exportExcel(value) {
    let data = [];
    let cols = [];
    const LiftmentData = (value === 1) ? this.PDSLiftmentData : this.GodownPDSDetailData;
    const frozenCols = (value === 1) ? this.tableConstants.FrozenPDSLiftmentColumns : this.tableConstants.FrozenPDSLiftmentGodownColumns;
    LiftmentData.forEach(el => {
      data.push({
        Name: el.Name, AllotmentRice: el.AllotmentRice, RiceLiftedToShops: (el.LiftedRice * 1),
        RiceBalanceToBeLifted: (el.BalanceRice * 1), AvailableRiceInTNCSCGodown: (el.AvailableRice * 1),
        PercentageOfRiceLiftment: el.PercentRice, AllotmentSugar: (el.AllotmentSugar * 1),
        SugarLiftedToShops: (el.LiftedSugar * 1), SugarBalanceToBeLifted: (el.BalanceSugar * 1),
        AvailableSugarInTNCSCGodown: (el.AvailableSugar * 1), PercentageOfSugarLiftment: el.PercentSugar,
        AllotmentWheat: (el.AllotmentWheat * 1), WheatLiftedToShops: (el.LiftedWheat * 1), WheatBalanceToBeLifted: (el.BalanceWheat * 1),
        AvailableWheatInTNCSCGodown: (el.AvailableWheat * 1), PercentageOfWheatLiftment: el.PercentWheat,
        AllotmentDhall: (el.AllotmentDhall * 1), DhallLiftedToShops: (el.LiftedDhall * 1), DhallBalanceToBeLifted: (el.BalanceDhall * 1),
        AvailableDhallInTNCSCGodown: (el.AvailableDhall * 1), PercentageOfDhallLiftment: el.PercentDhall,
        AllotmentOil: (el.AllotmentOil * 1), PalmoilLiftedToShops: (el.LiftedOil * 1), PalmoilBalanceToBeLifted: (el.BalanceOil * 1),
        AvailablePalmoilInTNCSCGodown: (el.AvailableOil * 1), PercentageOfPalmoilLiftment: el.PercentOil
      });
    });
    cols = frozenCols + this.tableConstants.PDSLiftmentColumns;
    const FileName = (value === 1) ? (this.canLoad) ? 'PDS_LIFTMENT_FROM_GODOWN_TO_SHOPS_REGION_WISE_REPORT'
      : 'PDS_LIFTMENT_FROM_GODOWN_TO_SHOPS_GODOWN_WISE_REPORT' : 'PDS_LIFTMENT_FROM_GODOWN_TO_SHOPS_GODOWN_WISE_REPORT';
    this.excelService.exportAsExcelFile(data, FileName, cols);
  }

  onClose() {
    this.messageService.clear('t-err');
  }
}

