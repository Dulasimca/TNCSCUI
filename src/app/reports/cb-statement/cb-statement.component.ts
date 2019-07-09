import { Component, OnInit } from '@angular/core';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';

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
  loading: boolean;
  record: any;
  constructor(private restApiService: RestAPIService, private authService: AuthService, 
    private tableConstants: TableConstants, private router: Router) { }

  ngOnInit() {
    this.rowGroupMetadata = {};
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.column = this.tableConstants.CBStatementColumns;
    this.loading = true;
    this.restApiService.get(PathConstants.CB_STATEMENT_REPORT).subscribe(response => {
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
          record.WHEAT = (record.WHEAT !== 0) ? record.WHEAT.toFixed(3) : record.WHEAT;
          record.SUGAR = (record.SUGAR !== 0) ? record.SUGAR.toFixed(3) : record.SUGAR;
        });
        // let reduceArr = [];
        // data.forEach(x => reduceArr.push(x.RGNAME));
        // var map = reduceArr.reduce(function (item, index) {
        //   item[index] = (item[index] || 0) + 1;
        //   return item;
        // }, {});
        // let count = 0;
        // let k = 0;
        // let ind;
        // let mapIndex = 0;
        // let totalBoiledRice;
        // let totalCement;
        // let totalKanadaDhall;
        // let totalToorDhall;
        // let totalPalmOil;
        // let totalRawRice;
        // let totalUridDhallTotal;
        // let totalSugar;
        // let totalWheat;
        // let findIndex = 0;
        // let grandTotal = 0;
        // while ((count > 0 || count === 0) && count < data.length - 1) {
        //   let name = (data[count] !== undefined && data[count].RGNAME !== undefined) ? data[count].RGNAME : data[count + 1].RGNAME;
        //   if (data[count].RGNAME === data[count + 1].RGNAME) { ind = map[name] + count; } else { ind = map[name] + count + 1; }
        //   mapIndex = map[name];
        //   if (data[findIndex] !== undefined && data[findIndex].RGNAME === name) {
        //     let i = totalData.findIndex(item => item.RGNAME === data[findIndex].RGNAME);
        //     totalBoiledRice = ((totalData[i].BOILED_RICE_A !== null && totalData[i].BOILED_RICE_A !== undefined) ?
        //       totalData[i].BOILED_RICE_A * 1 : totalData[i].BOILED_RICE_A) + ((totalData[i].BOILED_RICE_A_HULLING !== null && totalData[i].BOILED_RICE_A_HULLING !== undefined) ?
        //         totalData[i].BOILED_RICE_A_HULLING * 1 : totalData[i].BOILED_RICE_A_HULLING) + ((totalData[i].BOILED_RICE_COMMON !== null && totalData[i].BOILED_RICE_COMMON !== undefined) ?
        //           totalData[i].BOILED_RICE_COMMON * 1 : totalData[i].BOILED_RICE_COMMON) + ((totalData[i].BOILED_RICE_C_HULLING !== null && totalData[i].BOILED_RICE_C_HULLING !== undefined) ?
        //             totalData[i].BOILED_RICE_C_HULLING * 1 : totalData[i].BOILED_RICE_C_HULLING);
        //     totalBoiledRice = (totalBoiledRice !== 0) ? totalBoiledRice.toFixed(3) : totalBoiledRice;
        //     totalCement = ((totalData[i].CEMENT_IMPORTED !== null && totalData[i].CEMENT_IMPORTED !== undefined) ?
        //       totalData[i].CEMENT_IMPORTED * 1 : totalData[i].CEMENT_IMPORTED) + ((totalData[i].CEMENT_REGULAR !== null && totalData[i].CEMENT_REGULAR !== undefined) ?
        //         totalData[i].CEMENT_REGULAR * 1 : totalData[i].CEMENT_REGULAR);
        //     totalCement = (totalCement !== 0) ? totalCement.toFixed(3) : totalCement;
        //     totalKanadaDhall = ((totalData[i].Candian_Yellow_lentil_TD !== null && totalData[i].Candian_Yellow_lentil_TD !== undefined) ?
        //       totalData[i].Candian_Yellow_lentil_TD * 1 : 0) + ((totalData[i].YELLOW_LENTAL_US !== null && totalData[i].YELLOW_LENTAL_US !== undefined) ?
        //         totalData[i].YELLOW_LENTAL_US * 1 : 0);
        //     totalKanadaDhall = (totalKanadaDhall !== 0) ? totalKanadaDhall.toFixed(3) : totalKanadaDhall;
        //     totalToorDhall = ((totalData[i].TOOR_DHALL !== null && totalData[i].TOOR_DHALL !== undefined) ?
        //       totalData[i].TOOR_DHALL * 1 : 0) + ((totalData[i].TUR_ARUSHA !== null && totalData[i].TUR_ARUSHA !== undefined) ?
        //         totalData[i].TUR_ARUSHA * 1 : 0) + ((totalData[i].TUR_LEMON !== null && totalData[i].TUR_LEMON !== undefined) ?
        //           totalData[i].TUR_LEMON * 1 : 0) + ((totalData[i].LIARD_LENTIL_GREEN !== null && totalData[i].LIARD_LENTIL_GREEN !== undefined) ?
        //             totalData[i].LIARD_LENTIL_GREEN * 1 : 0);
        //     totalToorDhall = (totalToorDhall !== 0) ? totalToorDhall.toFixed(3) : totalToorDhall;
        //     totalPalmOil = ((totalData[i].PALMOLIEN_OIL !== null && totalData[i].PALMOLIEN_OIL !== undefined) ?
        //       totalData[i].PALMOLIEN_OIL * 1 : 0) + ((totalData[i].PALMOLIEN_POUCH !== null && totalData[i].PALMOLIEN_POUCH !== undefined) ?
        //         totalData[i].PALMOLIEN_POUCH * 1 : 0);
        //     totalPalmOil = (totalPalmOil !== 0) ? totalPalmOil.toFixed(3) : totalPalmOil;
        //     totalRawRice = ((totalData[i].RAW_RICE_A !== null && totalData[i].RAW_RICE_A !== undefined) ? (totalData[i].RAW_RICE_A * 1) : 0) +
        //       ((totalData[i].RAW_RICE_A_HULLING !== null && totalData[i].RAW_RICE_A_HULLING !== undefined) ? (totalData[i].RAW_RICE_A_HULLING * 1) : 0) +
        //       ((totalData[i].RAW_RICE_COM_HULLING !== null && totalData[i].RAW_RICE_COM_HULLING !== undefined) ? (totalData[i].RAW_RICE_COM_HULLING * 1) : 0) +
        //       ((totalData[i].RAW_RICE_COMMON !== null && totalData[i].RAW_RICE_COMMON !== undefined) ? (totalData[i].RAW_RICE_COMMON * 1) : 0);
        //     totalRawRice = (totalRawRice !== 0) ? totalRawRice.toFixed(3) : totalRawRice;
        //     totalUridDhallTotal = ((totalData[i].URAD_FAQ !== null && totalData[i].URAD_FAQ !== undefined) ?
        //       totalData[i].URAD_FAQ * 1 : 0) + ((totalData[i].URAD_SQ !== null && totalData[i].URAD_SQ !== undefined) ?
        //         totalData[i].URAD_SQ * 1 : 0) + ((totalData[i].URID_DHALL !== null && totalData[i].URID_DHALL !== undefined) ?
        //           totalData[i].URID_DHALL * 1 : 0) + ((totalData[i].URID_DHALL_FAQ !== null && totalData[i].URID_DHALL_FAQ !== undefined) ?
        //             totalData[i].URID_DHALL_FAQ * 1 : 0) + ((totalData[i].URID_DHALL_SPLIT !== null && totalData[i].URID_DHALL_SPLIT !== undefined) ?
        //               totalData[i].URID_DHALL_SPLIT * 1 : 0) + ((totalData[i].URID_DHALL_SQ !== null && totalData[i].URID_DHALL_SQ !== undefined) ?
        //                 totalData[i].URID_DHALL_SQ * 1 : 0);
        //     totalUridDhallTotal = (totalUridDhallTotal !== 0) ? totalUridDhallTotal.toFixed(3) : totalUridDhallTotal;
        //     totalSugar = ((totalData[i].SUGAR !== null && totalData[i].SUGAR !== undefined) ?
        //       totalData[i].SUGAR * 1 : 0);
        //     totalSugar = (totalSugar !== 0) ? totalSugar.toFixed(3) : totalSugar;
        //     totalWheat = ((totalData[i].WHEAT !== null && totalData[i].WHEAT !== undefined) ?
        //       totalData[i].WHEAT * 1 : 0);
        //     totalWheat = (totalWheat !== 0) ? totalWheat.toFixed(3) : totalWheat;
        //     findIndex += mapIndex;
        //   } else {
        //     var item = { 'TNCSName': 'TOTAL', 'boiledRice': totalBoiledRice, 'cement': totalCement, 'rawRice': totalRawRice,
        //   'SUGAR': totalSugar, 'WHEAT': totalWheat, 'toorDhall': totalToorDhall, 'kanadaToorDhall': totalKanadaDhall,
        // 'uridDhall': totalUridDhallTotal, 'palmoil': totalPalmOil };
        //     this.cbData.splice(ind, 0, item);
        //     count = ind + 1;
        //     findIndex += 1;
        //   }
        // }
        let capacity = 0;
        let setFlag = false;
        let index = 0;
        const arr: any[] = this.record;
        this.record.forEach(x => {
          arr.filter(y => {
            if (x.RGNAME === y.RGNAME) {
              setFlag = false;
              capacity += y.TNCSCapacity;
              // arr.splice(0, 1);
              console.log('c', capacity);
              index += 1;
            } else {
              if (!setFlag) {
                // arr.splice(0, 1);
              console.log('c', capacity);
              console.log('ind', index);
              arr.splice(0, index);
                  var item = { 'TNCSName': 'TOTAL', 'TNCSCapacity': capacity };
              this.cbData.splice(index, 0, item);
              setFlag = true;
              capacity = 0;
              }
            }
          })
        })
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
      //   var result = this.record.map(o => {
      //     var k = Object.keys(o)[0];
      //     return {
      //         name: k,
      //         value: o[k]
      //     };
      // });
     
        this.loading = false;
      } else {
        this.loading = false;
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0) {
        this.loading = false;
        this.router.navigate(['pageNotFound']);
      }
    })
  }

  public getColor(name: string): string {
    return name === 'TOTAL' ? "#53aae5" : "white";
  }
}
