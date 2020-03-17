import { Component, OnInit, ViewChild } from '@angular/core';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import 'jspdf-autotable';
import 'rxjs/add/observable/from';
import 'rxjs/Rx';
import * as Rx from 'rxjs';
import * as _ from 'lodash';
import { MessageService } from 'primeng/api';
import { StatusMessage } from 'src/app/constants/Messages';
import { Dropdown, SelectItem } from 'primeng/primeng';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { DatePipe } from '@angular/common';
import { Table } from 'primeng/table';
import { ExcelService } from 'src/app/shared-services/excel.service';

@Component({
  selector: 'app-cb-statement',
  templateUrl: './cb-statement.component.html',
  styleUrls: ['./cb-statement.component.css']
})
export class CBStatementComponent implements OnInit {
  cbData: any = [];
  data = [];
  column?: any;
  canShowMenu: boolean;
  rowGroupMetadata: any;
  loading: boolean;
  record: any;
  regionOptions: SelectItem[];
  godownOptions: SelectItem[];
  RCode: any;
  GCode: any;
  Date: any = new Date();
  roleId: any;
  disbaleGodown: boolean;
  maxDate: Date = new Date();  
  loggedInRCode: string;
  regions: any;
  abstractData: any = [];
  abstractCols: any;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;
  @ViewChild('dt', { static: false }) table: Table;

  constructor(private restApiService: RestAPIService, private authService: AuthService,
    private messageService: MessageService, private excelService: ExcelService,
    private tableConstants: TableConstants, private datepipe: DatePipe,
    private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.rowGroupMetadata = {};
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.data = this.roleBasedService.getInstance();
    this.regions = this.roleBasedService.getRegions();
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.column = this.tableConstants.CBStatementColumns;
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
            this.regionOptions.unshift({ label: 'All', value: 'All' });
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
    }
  }

  onView() {
    this.onResetTable('');
    this.loading = true;
    const params = new HttpParams().set('Date', this.datepipe.transform(this.Date, 'MM/dd/yyyy'))
    .append('GCode', this.GCode).append('RCode', this.RCode).append('RoleId', this.roleId);
    this.restApiService.getByParameters(PathConstants.CB_STATEMENT_REPORT, params).subscribe((response: any) => {
      if (response !== undefined && response !== null && response.length !== 0) {
        this.cbData = response;
        this.record = response;
        this.cbData.forEach(record => {
          let boiledRiceTotal = ((record.BOILED_RICE_A !== null && record.BOILED_RICE_A !== undefined) ? (record.BOILED_RICE_A * 1) : 0) +
            ((record.BOILED_RICE_A_HULLING !== null && record.BOILED_RICE_A_HULLING !== undefined) ? (record.BOILED_RICE_A_HULLING * 1) : 0) +
            ((record.BOILED_RICE_C_HULLING !== null && record.BOILED_RICE_C_HULLING !== undefined) ? (record.BOILED_RICE_C_HULLING * 1) : 0) +
            ((record.BOILED_RICE_COMMON !== null && record.BOILED_RICE_COMMON !== undefined) ? (record.BOILED_RICE_COMMON * 1) : 0);
          record.boiledRice = (boiledRiceTotal !== 0) ? boiledRiceTotal.toFixed(3) : boiledRiceTotal;
          record.boiledRice = (record.boiledRice * 1);
          let rawRiceTotal = ((record.RAW_RICE_A !== null && record.RAW_RICE_A !== undefined) ? (record.RAW_RICE_A * 1) : 0) +
            ((record.RAW_RICE_A_HULLING !== null && record.RAW_RICE_A_HULLING !== undefined) ? (record.RAW_RICE_A_HULLING * 1) : 0) +
            ((record.RAW_RICE_COM_HULLING !== null && record.RAW_RICE_COM_HULLING !== undefined) ? (record.RAW_RICE_COM_HULLING * 1) : 0) +
            ((record.RAW_RICE_COMMON !== null && record.RAW_RICE_COMMON !== undefined) ? (record.RAW_RICE_COMMON * 1) : 0);
          record.rawRice = (rawRiceTotal !== 0) ? rawRiceTotal.toFixed(3) : rawRiceTotal;
          record.rawRice = (record.rawRice * 1);
          let kanadaToorDhallTotal = ((record.Candian_Yellow_lentil_TD !== null && record.Candian_Yellow_lentil_TD !== undefined) ?
            record.Candian_Yellow_lentil_TD * 1 : 0) + ((record.YELLOW_LENTAL_US !== null && record.YELLOW_LENTAL_US !== undefined) ?
              record.YELLOW_LENTAL_US * 1 : 0);
          record.kanadaToorDhall = (kanadaToorDhallTotal !== 0) ? kanadaToorDhallTotal.toFixed(3) : kanadaToorDhallTotal;
          record.kanadaToorDhall = (record.kanadaToorDhall * 1);
          let toorDhallTotal = ((record.TOOR_DHALL !== null && record.TOOR_DHALL !== undefined) ?
            record.TOOR_DHALL * 1 : 0) + ((record.TUR_ARUSHA !== null && record.TUR_ARUSHA !== undefined) ?
              record.TUR_ARUSHA * 1 : 0) + ((record.TUR_LEMON !== null && record.TUR_LEMON !== undefined) ?
                record.TUR_LEMON * 1 : 0) + ((record.LIARD_LENTIL_GREEN !== null && record.LIARD_LENTIL_GREEN !== undefined) ?
                  record.LIARD_LENTIL_GREEN * 1 : 0);
          record.toorDhall = (toorDhallTotal !== 0) ? toorDhallTotal.toFixed(3) : toorDhallTotal;
          record.toorDhall = (record.toorDhall * 1);
          let uridDhallTotal = ((record.URAD_FAQ !== null && record.URAD_FAQ !== undefined) ?
            record.URAD_FAQ * 1 : 0) + ((record.URAD_SQ !== null && record.URAD_SQ !== undefined) ?
              record.URAD_SQ * 1 : 0) + ((record.URID_DHALL !== null && record.URID_DHALL !== undefined) ?
                record.URID_DHALL * 1 : 0) + ((record.URID_DHALL_FAQ !== null && record.URID_DHALL_FAQ !== undefined) ?
                  record.URID_DHALL_FAQ * 1 : 0) + ((record.URID_DHALL_SPLIT !== null && record.URID_DHALL_SPLIT !== undefined) ?
                    record.URID_DHALL_SPLIT * 1 : 0) + ((record.URID_DHALL_SQ !== null && record.URID_DHALL_SQ !== undefined) ?
                      record.URID_DHALL_SQ * 1 : 0);
          record.uridDhall = (uridDhallTotal !== 0) ? uridDhallTotal.toFixed(3) : uridDhallTotal;
          record.uridDhall = (record.uridDhall * 1);
          let palmoilTotal = ((record.PALMOLIEN_OIL !== null && record.PALMOLIEN_OIL !== undefined) ?
            record.PALMOLIEN_OIL * 1 : 0) + ((record.PALMOLIEN_POUCH !== null && record.PALMOLIEN_POUCH !== undefined) ?
              record.PALMOLIEN_POUCH * 1 : 0);
          record.palmoil = (palmoilTotal !== 0) ? palmoilTotal.toFixed(3) : palmoilTotal;
          record.palmoil = (record.palmoil * 1);
          let cementTotal = ((record.CEMENT_IMPORTED !== null && record.CEMENT_IMPORTED !== undefined) ?
            record.CEMENT_IMPORTED * 1 : 0) + ((record.CEMENT_REGULAR !== null && record.CEMENT_REGULAR !== undefined) ?
              record.CEMENT_REGULAR * 1 : 0) + ((record.AMMA_CEMENT !== null && record.AMMA_CEMENT !== undefined) ?
                record.AMMA_CEMENT * 1 : 0);
          record.cement = (cementTotal !== 0) ? cementTotal.toFixed(3) : cementTotal;
          record.cement = (record.cement * 1);
          let totalRice = boiledRiceTotal + rawRiceTotal;
          let totalDhall = toorDhallTotal + kanadaToorDhallTotal;
          record.totalRice = (totalRice !== 0) ? totalRice.toFixed(3) : totalRice;
          record.totalRice = (record.totalRice * 1);
          record.totalDhall = (totalDhall !== 0) ? totalDhall.toFixed(3) : totalDhall;
          record.totalDhall = (record.totalDhall * 1);
          record.WHEAT = (record.WHEAT !== 0) ? record.WHEAT.toFixed(3) : record.WHEAT;
          record.WHEAT = (record.WHEAT * 1);
          record.SUGAR = (record.SUGAR !== 0) ? record.SUGAR.toFixed(3) : record.SUGAR;
          record.SUGAR = (record.SUGAR * 1);
        });
        this.cbData.splice(this.cbData.length, 0, '');
        let groupedData;
        Rx.Observable.from(this.cbData)
          .groupBy((x: any) => x.RNAME) // using groupBy from Rxjs
          .flatMap(group => group.toArray())// GroupBy dont create a array object so you have to flat it
          .map(g => {// mapping 
            return {
              RNAME: g[0].RNAME,//take the first name because we grouped them by name
              TNCSCapacity: _.sumBy(g, 'TNCSCapacity'),
              boiledRice: _.sumBy(g, 'boiledRice'), // using lodash to sum quantity
              rawRice: _.sumBy(g, 'rawRice'),
              totalRice: _.sumBy(g, 'totalRice'),
              SUGAR: _.sumBy(g, 'SUGAR'),
              WHEAT: _.sumBy(g, 'WHEAT'),
              toorDhall: _.sumBy(g, 'toorDhall'),
              kanadaToorDhall: _.sumBy(g, 'kanadaToorDhall'),
              totalDhall: _.sumBy(g, 'totalDhall'),
              uridDhall: _.sumBy(g, 'uridDhall'),
              palmoil: _.sumBy(g, 'palmoil'),
              cement: _.sumBy(g, 'cement')
            }
          })
          .toArray() //.toArray because I guess you want to loop on it with ngFor      
          .do(sum => console.log('sum:', sum)) // just for debug
          .subscribe(d => groupedData = d);
        let index = 0;
        let item;
        console.log('grd', groupedData);
        for (let i = 0; i < this.cbData.length; i++) {
          if (this.cbData[i].RNAME !== groupedData[index].RNAME) {
            item = {
              TNCSName: 'TOTAL', TNCSCapacity: groupedData[index].TNCSCapacity,
              boiledRice: (groupedData[index].boiledRice * 1).toFixed(3),
              rawRice: (groupedData[index].rawRice * 1).toFixed(3),
              totalRice: (groupedData[index].totalRice * 1).toFixed(3),
              totalDhall: (groupedData[index].totalDhall * 1).toFixed(3),
              toorDhall: (groupedData[index].toorDhall * 1).toFixed(3),
              kanadaToorDhall: (groupedData[index].kanadaToorDhall * 1).toFixed(3),
              kanadaToorDhallTotal: (groupedData[index].kanadaToorDhallTotal * 1).toFixed(3),
              SUGAR: (groupedData[index].SUGAR * 1).toFixed(3), WHEAT: (groupedData[index].WHEAT * 1).toFixed(3),
              cement: (groupedData[index].cement * 1).toFixed(3), uridDhall: (groupedData[index].uridDhall * 1).toFixed(3),
              palmoil: (groupedData[index].palmoil * 1).toFixed(3)
            };
            this.cbData.splice(i, 0, item);
            index += 1;
          }
        }

        for (let i = 0; i < this.cbData.length; i++) {
          let rowData = this.cbData[i];
          let RNAME = rowData.RNAME;
          if (i == 0) {
            this.rowGroupMetadata[RNAME] = { index: 0, size: 1 };
          }
          else {
            let previousRowData = this.cbData[i - 1];
            let previousRowGroup = previousRowData.RNAME;
            if (RNAME === previousRowGroup)
              this.rowGroupMetadata[RNAME].size++;
            else
              this.rowGroupMetadata[RNAME] = { index: i, size: 1 };
          }
        }

        if(this.GCode === 'All' && this.RCode === 'All') {
          this.loadAbstract(groupedData);
          }
        ///grand total
        if(this.GCode === 'All' && this.RCode === 'All') {
          let capacity = 0; let bRice = 0; let rRice = 0;
          let tRice = 0; let tDhall = 0; let trDhall = 0;
          let kDhall = 0; let kDhallTotal = 0;
          let cement = 0; let sugar = 0; let pOil = 0;
          let wheat = 0; let uDhall = 0;
          this.cbData.forEach(x => {
            if(x.TNCSName === 'TOTAL') {
              capacity += (x.TNCSCapacity * 1);
              bRice += (x.boiledRice * 1);
              rRice += (x.rawRice * 1);
              tRice += (x.totalRice * 1);
              tDhall += (x.totalDhall * 1);
              trDhall += (x.toorDhall * 1);
              kDhall += (x.kanadaToorDhall * 1);
              kDhallTotal += (x.kanadaToorDhallTotal * 1);
              cement += (x.cement * 1);
              sugar += (x.SUGAR * 1);
              wheat += (x.WHEAT * 1);
              uDhall += (x.uridDhall * 1);
              pOil += (x.palmoil * 1);
            }
          })
          this.cbData.push({ TNCSName: 'GRAND TOTAL', TNCSCapacity: capacity.toFixed(3),
          boiledRice: bRice.toFixed(3), rawRice: rRice.toFixed(3),
          toorDhall: trDhall.toFixed(3), totalRice: tRice.toFixed(3),
          totalDhall: tDhall.toFixed(3), SUGAR: sugar.toFixed(3),
          WHEAT: wheat.toFixed(3), palmoil: pOil, cement: cement.toFixed(3),
          uridDhall: uDhall.toFixed(3), kanadaToorDhall: kDhall.toFixed(3),
          kanadaToorDhallTotal: kDhallTotal.toFixed(3)});
        }
        this.loading = false;
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
        this.loading = false;
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    })
  }

  loadAbstract(data) {
    this.abstractCols = this.tableConstants.CBStatementAbstractCols;
    data.splice(data.length - 1, 1);
    this.abstractData = data;
        let sno = 1;
        this.abstractData.forEach(x => {
          x.SlNo = sno;
          x.TNCSCapacity = (x.TNCSCapacity * 1).toFixed(3);
          x.boiledRice = (x.boiledRice * 1).toFixed(3);
          x.rawRice = (x.rawRice * 1).toFixed(3);
          x.toorDhall = (x.toorDhall * 1).toFixed(3);
          x.uridDhall = (x.uridDhall * 1).toFixed(3);
          x.totalRice = (x.totalRice * 1).toFixed(3);
          x.totalDhall = (x.totalDhall * 1).toFixed(3);
          x.SUGAR = (x.SUGAR * 1).toFixed(3);
          x.WHEAT = (x.WHEAT * 1).toFixed(3);
          x.cement = (x.cement * 1).toFixed(3);
          x.kanadaToorDhall = (x.kanadaToorDhall * 1).toFixed(3);
          sno += 1;
        })
  }

  export() {
    let data = [];
    this.abstractData.forEach(item => {
      data.push({
        RNAME: item.RNAME,
        TNCSCapacity: (item.TNCSCapacity * 1),
        boiledRice: (item.boiledRice * 1),
        rawRice: (item.rawRice * 1),
        toorDhall: (item.toorDhall * 1),
        uridDhall: (item.uridDhall * 1),
        totalRice: (item.totalRice * 1),
        totalDhall: (item.totalDhall * 1),
        SUGAR: (item.SUGAR * 1),
        WHEAT: (item.WHEAT * 1),
        cement: (item.cement * 1),
        kanadaToorDhall: (item.kanadaToorDhall * 1)
      })
    })
    this.excelService.exportAsExcelFile(data, 'CB_STATEMENT_REGIONWISE_ABSTRACT', this.abstractCols);
}

  public getColor(name: string): string {
    return name === 'TOTAL' ? "#53aae5" : (name === 'GRAND TOTAL' ? "#18c5a9" : "white");
  }

  onResetTable(item) {
    if(item === 'reg') { this.GCode = null; }
    this.cbData = [];
    this.abstractData = [];
    this.record = [];
    this.table.reset();
  }
  
}
