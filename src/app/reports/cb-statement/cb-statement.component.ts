import { Component, OnInit } from '@angular/core';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { PathConstants } from 'src/app/constants/path.constants';

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
  searchText: string;
  filterArray: any;
  filteredItem: any;
  rowGroupMetadata: any;
  totalMetaData: any;

  constructor(private restApiService: RestAPIService, private authService: AuthService, private tableConstants: TableConstants) { }

  ngOnInit() {
    this.rowGroupMetadata = {};
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.column = this.tableConstants.CBStatementColumns;
    this.restApiService.get(PathConstants.CB_STATEMENT).subscribe(response => {
      if (response !== undefined && response !== null) {
        this.cbData = response;
        let data = response.slice(0);
            this.cbData.forEach(record => {
          let boiledRiceTotal = ((record.BOILED_RICE_A !== null && record.BOILED_RICE_A !== undefined) ? (record.BOILED_RICE_A * 1) : 0) +
            ((record.BOILED_RICE_A_HULLING !== null && record.BOILED_RICE_A_HULLING !== undefined) ? (record.BOILED_RICE_A_HULLING * 1) : 0) +
            ((record.BOILED_RICE_C_HULLING !== null && record.BOILED_RICE_C_HULLING !== undefined) ? (record.BOILED_RICE_C_HULLING * 1) : 0) +
            ((record.BOILED_RICE_COMMON !== null && record.BOILED_RICE_COMMON !== undefined) ? (record.BOILED_RICE_COMMON * 1) : 0);
          record.boiledRice = (boiledRiceTotal !== 0) ? boiledRiceTotal.toFixed(3) : boiledRiceTotal;
          let rawRiceTotal = ((record.RAW_RICE_A !== null && record.RAW_RICE_A !== undefined) ? (record.RAW_RICE_A * 1) : 0) +
            ((record.RAW_RICE_A_HULLING !== null && record.RAW_RICE_A_HULLING !== undefined) ? (record.RAW_RICE_A_HULLING * 1) : 0) +
            ((record.RAW_RICE_COM_HULLING !== null && record.RAW_RICE_COM_HULLING !== undefined) ? (record.RAW_RICE_COM_HULLING * 1) : 0) +
            ((record.RAW_RICE_COMMON !== null && record.RAW_RICE_COMMON !== undefined) ? (record.RAW_RICE_COMMON * 1) : 0);
          record.rawRice = (rawRiceTotal !== 0) ? rawRiceTotal.toFixed(3) : rawRiceTotal;
          let kanadaToorDhallTotal = ((record.Candian_Yellow_lentil_TD !== null && record.Candian_Yellow_lentil_TD !== undefined) ?
            record.Candian_Yellow_lentil_TD * 1 : 0) + ((record.YELLOW_LENTAL_US !== null && record.YELLOW_LENTAL_US !== undefined) ?
              record.YELLOW_LENTAL_US * 1 : 0);
          record.kanadaToorDhall = (kanadaToorDhallTotal !== 0) ? kanadaToorDhallTotal.toFixed(3) : kanadaToorDhallTotal;
          let toorDhallTotal = ((record.TOOR_DHALL !== null && record.TOOR_DHALL !== undefined) ?
            record.TOOR_DHALL * 1 : 0) + ((record.TUR_ARUSHA !== null && record.TUR_ARUSHA !== undefined) ?
              record.TUR_ARUSHA * 1 : 0) + ((record.TUR_LEMON !== null && record.TUR_LEMON !== undefined) ?
                record.TUR_LEMON * 1 : 0) + ((record.LIARD_LENTIL_GREEN !== null && record.LIARD_LENTIL_GREEN !== undefined) ?
                  record.LIARD_LENTIL_GREEN * 1 : 0);
          record.toorDhall = (toorDhallTotal !== 0) ? toorDhallTotal.toFixed(3) : toorDhallTotal;
          let uridDhallTotal = ((record.URAD_FAQ !== null && record.URAD_FAQ !== undefined) ?
            record.URAD_FAQ * 1 : 0) + ((record.URAD_SQ !== null && record.URAD_SQ !== undefined) ?
              record.URAD_SQ * 1 : 0) + ((record.URID_DHALL !== null && record.URID_DHALL !== undefined) ?
                record.URID_DHALL * 1 : 0) + ((record.URID_DHALL_FAQ !== null && record.URID_DHALL_FAQ !== undefined) ?
                  record.URID_DHALL_FAQ * 1 : 0) + ((record.URID_DHALL_SPLIT !== null && record.URID_DHALL_SPLIT !== undefined) ?
                    record.URID_DHALL_SPLIT * 1 : 0) + ((record.URID_DHALL_SQ !== null && record.URID_DHALL_SQ !== undefined) ?
                      record.URID_DHALL_SQ * 1 : 0);
          record.uridDhall = (uridDhallTotal !== 0) ? uridDhallTotal.toFixed(3) : uridDhallTotal;
          let palmoilTotal = ((record.PALMOLIEN_OIL !== null && record.PALMOLIEN_OIL !== undefined) ?
            record.PALMOLIEN_OIL * 1 : 0) + ((record.PALMOLIEN_POUCH !== null && record.PALMOLIEN_POUCH !== undefined) ?
              record.PALMOLIEN_POUCH * 1 : 0);
          record.palmoil = (palmoilTotal !== 0) ? palmoilTotal.toFixed(3) : palmoilTotal;
          let cementTotal = ((record.CEMENT_IMPORTED !== null && record.CEMENT_IMPORTED !== undefined) ?
            record.CEMENT_IMPORTED * 1 : 0) + ((record.CEMENT_REGULAR !== null && record.CEMENT_REGULAR !== undefined) ?
              record.CEMENT_REGULAR * 1 : 0);
          record.cement = (cementTotal !== 0) ? cementTotal.toFixed(3) : cementTotal;
          let totalRice = boiledRiceTotal + rawRiceTotal;
          let totalDhall = toorDhallTotal + uridDhallTotal;
          record.totalRice = (totalRice !== 0) ? totalRice.toFixed(3) : totalRice;
          record.totalDhall = (totalDhall !== 0) ? totalDhall.toFixed(3) : totalDhall;
        });
        let reduceArr = [];
        data.forEach(x => reduceArr.push(x.RGNAME));
        var map = reduceArr.reduce(function (item, index) {
          item[index] = (item[index] || 0) + 1;
          return item;
        }, {});
        console.log(map);
        let count = 0;
        let ind;
        let mapIndex = 0;
        let totalCapacity = 0;
        let findIndex = 0;
          while ((count > 0 || count === 0) && count < data.length - 1) {
            let name = (data[count] !== undefined && data[count].RGNAME !== undefined) ? data[count].RGNAME : data[count + 1].RGNAME;
            if (data[count].RGNAME === data[count + 1].RGNAME) { ind = map[name] + count; } else { ind = map[name] + count + 1; }
            mapIndex = map[name];
            if (findIndex < mapIndex && findIndex < data.length - 1) {
              totalCapacity += (data[findIndex].TNCSCapacity * 1);
              findIndex++;
            } else {
              var item = { 'TNCSName': 'TOTAL', 'TNCSCapacity': totalCapacity };
              this.cbData.splice(ind, 0, item);
              totalCapacity = 0;
              count = ind + 1;
              mapIndex += findIndex;
              
            }
          }
        // for (let j = 0; j < data.length; j++) {
        //   while ((count > 0 || count === 0) && count < data.length - 1) {
        //         let name = (data[count] !== undefined && data[count].RGNAME !== undefined) ? data[count].RGNAME : data[count + 1].RGNAME;
        //         if (data[count].RGNAME === data[count + 1].RGNAME) { ind = map[name] + count; } else { ind = map[name] + count + 1; }
        //         if (findIndex < ind) {
        //           totalCapacity += (data[j].TNCSCapacity * 1);
        //           findIndex++;
        //         } else {
        //           var item = { 'TNCSName': 'TOTAL', 'TNCSCapacity': totalCapacity };
        //           this.cbData.splice(ind, 0, item);
        //           totalCapacity = 0;
        //           count = ind + 1;
        //         }
        //       }
        // }
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

    })

  }

  public getColor(name: string): string {
    return name === 'TOTAL' ? "#53aae4" : "white";
  }
}
