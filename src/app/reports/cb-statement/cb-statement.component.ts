import { Component, OnInit, ViewChild } from '@angular/core';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ExcelService } from 'src/app/shared-services/excel.service';
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

@Component({
  selector: 'app-cb-statement',
  templateUrl: './cb-statement.component.html',
  styles: [`
  :host ::ng-deep .ui-table .ui-table-thead > tr > th {
      position: -webkit-sticky;
      position: sticky;
      top: 0px;
  }

  @media screen and (max-width: 64em) {
      :host ::ng-deep .ui-table .ui-table-thead > tr > th {
          top: 100px;
      }
  }
`],
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
  regions: any;
  @ViewChild('gd') godownPanel: Dropdown;
  @ViewChild('reg') regionPanel: Dropdown;

  constructor(private restApiService: RestAPIService, private authService: AuthService, private messageService: MessageService,
    private tableConstants: TableConstants, private datepipe: DatePipe, private excelService: ExcelService,
    private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.rowGroupMetadata = {};
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
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
        if (type === 'enter') {
          this.regionPanel.overlayVisible = true;
        }
        if (this.roleId === 3) {
          this.data = this.roleBasedService.instance;
          if (this.data !== undefined) {
            this.data.forEach(x => {
              regionSelection.push({ 'label': x.RName, 'value': x.RCode });
            });
            for (let i = 0; i < regionSelection.length - 1;) {
              if (regionSelection[i].value === regionSelection[i + 1].value) {
                regionSelection.splice(i + 1, 1);
              }
            }
          }
          this.regionOptions = regionSelection;
        } else {
          this.regions = this.roleBasedService.regionsData;
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              regionSelection.push({ 'label': x.RName, 'value': x.RCode });
            });
          }
          this.regionOptions = regionSelection;
          this.regionOptions.unshift({ label: 'All', value: 'All' });
          if (this.RCode !== undefined && this.RCode !== null) {
            if (this.RCode === 'All') {
              this.godownOptions = [{ label: 'All', value: 'All ' }];
              this.GCode = 'All';
              this.disbaleGodown = true;
            } else {
              this.disbaleGodown = false;
            }
          } else {
            this.GCode = null; 
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
    this.loading = true;
    const params = new HttpParams().set('Date', this.datepipe.transform(this.Date, 'MM/dd/yyyy')).append('GCode', this.GCode).append('RCode', this.RCode);
    this.restApiService.getByParameters(PathConstants.CB_STATEMENT_REPORT, params).subscribe(response => {
      if (response.Table !== undefined && response.Table !== null && response.Table.length !== 0) {
        this.cbData = response.Table;
        this.record = response.Table.slice(0);
        let totalData = response.Table1;
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
          .groupBy((x: any) => x.RGNAME) // using groupBy from Rxjs
          .flatMap(group => group.toArray())// GroupBy dont create a array object so you have to flat it
          .map(g => {// mapping 
            return {
              RGNAME: g[0].RGNAME,//take the first name because we grouped them by name
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
        for (let i = 0; i < this.cbData.length; i++) {
          if (this.cbData[i].RGNAME !== groupedData[index].RGNAME) {
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
          let RGNAME = rowData.RGNAME;
          if (i == 0) {
            this.rowGroupMetadata[RGNAME] = { index: 0, size: 1 };
          }
          else {
            let previousRowData = this.cbData[i - 1];
            let previousRowGroup = previousRowData.RGNAME;
            if (RGNAME === previousRowGroup)
              this.rowGroupMetadata[RGNAME].size++;
            else
              this.rowGroupMetadata[RGNAME] = { index: i, size: 1 };
          }
        }
        this.loading = false;
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
        this.loading = false;
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    })
  }

  public getColor(name: string): string {
    return name === 'TOTAL' ? "#53aae5" : "white";
  }

  onResetTable(item) {
    if(item === 'reg') { this.GCode = null; }
    this.cbData = [];
  }

  exportAsXLSX(): void {
    var ClosingBalanceData = [];
    this.cbData.forEach(data => {
      ClosingBalanceData.push({
        TNCSName: data.TNCSName, TNCSCapacity: data.TNCSCapacity,
        boiledRice: data.boiledRice, rawRice: data.rawRice, totalRice: data.totalRice, SUGAR: data.SUGAR, WHEAT: data.WHEAT,
        toorDhall: data.toorDhall, kanadaToorDhall: data.kanadaToorDhall, totalDhall: data.totalDhall,
        uridDhall: data.uridDhall, palmoil: data.palmoil, cement: data.cement
      });
    });
    this.excelService.exportAsExcelFile(ClosingBalanceData, 'CLOSING_BALANCE_STATEMENT_REPORT', this.column);
  }

  
}
