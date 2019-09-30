import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { ExcelService } from 'src/app/shared-services/excel.service';
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
  selector: 'app-splpds',
  templateUrl: './splpds.component.html',
  styleUrls: ['./splpds.component.css']
})
export class SplpdsComponent implements OnInit {
  SplpdsCols: any;
  splpdsData: any = [];
  fromDate: any = new Date();
  toDate: any = new Date();
  godownOptions: SelectItem[];
  transactionOptions: SelectItem[];
  receiverOptions: SelectItem[];
  regionOptions: SelectItem[];
  selectedValues: any;
  filterArray: any;
  FilterData: any;
  regions: any;
  t_cd: any;
  userId: any;
  r_cd: any;
  RCode: any;
  Trcode: any;
  data: any;
  GCode: any;
  SCode: any;
  maxDate: Date;
  roleId: any;
  canShowMenu: boolean;
  isShowErr: boolean;
  loading: boolean = false;
  loggedInRCode: any;
  rowGroupMetadata: any;
  Coop: any;
  Tyname: any;
  @ViewChild('godown') godownPanel: Dropdown;
  @ViewChild('region') regionPanel: Dropdown;
  @ViewChild('transaction') transactionPanel: Dropdown;
  @ViewChild('receiver') societyPanel: Dropdown;



  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private authService: AuthService, private excelService: ExcelService,
    private restAPIService: RestAPIService, private datepipe: DatePipe,
    private roleBasedService: RoleBasedService, private messageService: MessageService) { }

  ngOnInit() {
    this.rowGroupMetadata = {};
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.SplpdsCols = this.tableConstants.DoSPLPDS;
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

  // onView() {
  //   this.checkValidDateSelection();
  //   this.loading = true;
  //   const params = {
  //     'FromDate': this.datepipe.transform(this.fromDate, 'MM/dd/yyyy'),
  //     'ToDate': this.datepipe.transform(this.toDate, 'MM/dd/yyyy'),
  //     'GCode': this.GCode,
  //     'UserName': this.userId.user,
  //   };
  //   this.restAPIService.post(PathConstants.DELIVERY_ORDER_SPLPDS, params).subscribe(res => {
  //     if (res !== undefined && res.length !== 0 && res !== null) {
  //       this.splpdsData = res;
  //       this.filterArray = res;
  //       this.loading = false;
  //       let sno = 1;
  //       // let result = Array.from(new Set(this.splpdsData.map((item: any) => item.Tyname)));
  //       this.splpdsData.forEach(data => {
  //         data.SlNo = sno;
  //         // // let code = Array.from(new Set(this.splpdsData.map((item: any) => item.Comodity)));
  //         // // let coop = Array.from(new Set(this.splpdsData.map((item: any) => item.Coop)));
  //         // // for (var index in result) {
  //         // //   this.splpdsData.push(result[index]);
  //         // // }
  //         // data.Tyname = this.splpdsData.filter(item => {
  //         //   return item.Tyname === result;
  //         // });
  //         // data.Tyname = result;
  //         data.Dodate = this.datePipe.transform(data.Dodate, 'dd-MM-yyyy');
  //         data.Nkgs = (data.Nkgs * 1).toFixed(3);
  //         sno += 1;
  //       });
  //       // if (this.splpdsData !== undefined) {
  //       //   //   let result = Array.from(new Set(this.splpdsData.map((item: any) => item.Coop)));
  //       //   //   let code = Array.from(new Set(this.splpdsData.map((item: any) => item.Comodity)));
  //       //   //   this.splpdsData.forEach(s => {

  //       //   //     for (var index in result && code) {
  //       //   //       this.splpdsData.push(result[index]);
  //       //   //     }
  //     } else {
  //       this.loading = false;
  //       this.messageService.clear();
  //       this.messageService.add({
  //         key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
  //         summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination
  //       });
  //     }
  //   }, (err: HttpErrorResponse) => {
  //     if (err.status === 0 || err.status === 400) {
  //       this.loading = false;
  //       this.messageService.clear();
  //       this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
  //     }
  //   });
  // }

  onView() {
    this.checkValidDateSelection();
    this.loading = true;
    const params = {
      'FromDate': this.datepipe.transform(this.fromDate, 'MM/dd/yyyy'),
      'ToDate': this.datepipe.transform(this.toDate, 'MM/dd/yyyy'),
      'GCode': this.GCode,
      'UserName': this.userId.user,
    };
    this.restAPIService.post(PathConstants.DELIVERY_ORDER_SPLPDS, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.splpdsData = res;
        this.filterArray = res.slice(0);
        this.loading = false;
        let sno = 1;
        this.splpdsData.forEach(data => {
          data.SlNo = sno;
          data.Dodate = this.datePipe.transform(data.Dodate, 'dd-MM-yyyy');
          data.Nkgs = (data.Nkgs * 1).toFixed(3);
          sno += 1;
        });
        this.splpdsData.splice(this.splpdsData.length, 0, '');
        let groupedData: any = [];
        // Rx.Observable.from(this.filterArray)
        //   .groupBy((x: any) => x.Comodity) // using groupBy from Rxjs
        //   .flatMap(group => group.toArray())// GroupBy dont create a array object so you have to flat it
        //   .map(g => {// mapping
        //     return {
        //       Coop: g[0].Coop,

        //       Amount: _.sumBy(g, 'Amount'),
        //       Rate: _.sumBy(g, 'Rate'),
        //       Quantity: _.sumBy(g, 'Quantity')
        //     }
        //   })
        //   .toArray() //.toArray because I guess you want to loop on it with ngFor
        //   .do(sum => console.log('sum:', sum)) // just for debug
        //   .subscribe(d => groupedData = d);
        // let index = 0;
        // let item;
        // for (let i = 0; i < this.splpdsData.length; i++) {
        //   if (this.splpdsData[i].Tyname !== groupedData[index].Tyname) {
        //     item = {
        //       // Tname :'Tyname', Tyname: groupedData[index].Tyname,
        //       Tyname: groupedData[index].Tyname,

        //     };
        //     this.splpdsData.splice(i, 0, item);
        //     index += 1;
        //   }
        // }

        // for (let i = 0; i < this.splpdsData.length; i++) {
        //   let rowData = this.splpdsData[i];
        //   let Tyname = rowData.Tyname;
        //   if (i == 0) {
        //     this.rowGroupMetadata[Tyname] = { index: 0, size: 1 };
        //   }
        //   else {
        //     let previousRowData = this.splpdsData[i - 1];
        //     let previousRowGroup = previousRowData.Tyname;
        //     if (Tyname === previousRowGroup)
        //       this.rowGroupMetadata[Tyname].size++;
        //     else
        //       this.rowGroupMetadata[Tyname] = { index: i, size: 1 };
        //   }
        // }

        // Rx.Observable.from(this.splpdsData)
        //   .groupBy((x: any) => x.Tyname).flatMap(grop => grop.toArray())
        // Rx.Observable.from(this.splpdsData)
        //   .groupBy((y: any) => y.Coop).flatMap(grop => grop.toArray())
        Rx.Observable.from(this.splpdsData)
          .groupBy((z: any) => z.Comodity).flatMap(grop => grop.toArray())
          .map(g => {// mapping 
            return {
              Tyname: g[0].Tyname,//take the first name because we grouped them by name
              Comodity: g[0].Comodity,
              Coop: g[0].Coop,
              Scheme: g[0].Scheme,
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
            // this.splpdsData = groupedData;
          });

        this.loading = false;
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination
        });
        this.loading = false;
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    })
  }

  onSociety() {
    // let TransactionSelection = [];
    // let ReceiverSelection = [];
    // switch (item) {
    //   case 't':
    //     if (this.transactionOptions === undefined) {
    //       this.restAPIService.get(PathConstants.TRANSACTION_MASTER).subscribe(s => {
    //         s.forEach(c => {
    //           if (c.TransType === 'I') {
    //             TransactionSelection.push({ 'label': c.TRName, 'value': c.TRCode });
    //           }
    //         });
    //         this.transactionOptions = TransactionSelection;
    //       });
    //     }
    //     break;
    //   case 'r':
    //     const params = new HttpParams().set('TRCode', this.t_cd.value);
    //     this.restAPIService.getByParameters(PathConstants.DEPOSITOR_TYPE_MASTER, params).subscribe(res => {
    //       res.forEach(s => {
    //         ReceiverSelection.push({ 'label': s.Tyname, 'value': s.Tycode });
    //       });
    //       this.receiverOptions = ReceiverSelection;
    //     });
    //     break;
    // }
    this.splpdsData = this.filterArray;
    if (this.splpdsData !== undefined && this.splpdsData !== '') {
      let sno = 0;

      this.splpdsData.forEach(data => {
        data.Slno = sno;
        sno += 1;
        this.splpdsData = this.splpdsData.filter(item => {
          return item.Tyname === this.r_cd.label;
        });
      });
      this.splpdsData.splice(this.splpdsData.length, 0, '');
      let groupedData: any = [];
      // this.splpdsData.forEach(m => {

      Rx.Observable.from(this.splpdsData)
        .groupBy((z: any) => z.Comodity).flatMap(grop => grop.toArray())

        .map(g => {
          this.splpdsData.forEach(g => {
            return {
              Tyname: g[0].Tyname,//take the first name because we grouped them by name
              Comodity: g[0].Comodity,
              Coop: g[0].Coop,
              Scheme: g[0].Scheme,
              Amount: _.sumBy(g, 'Amount'),
              Rate: _.sumBy(g, 'Rate'),
              Quantity: _.sumBy(g, 'Quantity'), // using lodash to sum quantity
              // Amount: _.sumBy(g, 'Amount'), // using lodash to sum price
            }
          })
        })
        // })
        // })

        .toArray() //.toArray because I guess you want to loop on it with ngFor      
        // .do(sum => console.log('sum:', sum)) // just for debug
        .subscribe(d => {
          groupedData = d;
          console.log(groupedData, 'Hii');
          this.splpdsData = groupedData;
        });

      // tslint:disable-next-line: max-line-length


      let index = 0;
      let item;
      for (let i = 0; i < this.splpdsData.length; i++) {
        if (this.splpdsData[i].Tyname !== groupedData[index].Tyname) {
          item = {
            // Tname :'Tyname', Tyname: groupedData[index].Tyname,
            Tyname: groupedData[index].Tyname,

          };
          this.splpdsData.splice(i, 0, item);
          index += 1;
        }
      }

      for (let i = 0; i < this.splpdsData.length; i++) {
        let rowData = this.splpdsData[i];
        let Tyname = rowData.Tyname;
        if (i == 0) {
          this.rowGroupMetadata[Tyname] = { index: 0, size: 1 };
        }
        else {
          let previousRowData = this.splpdsData[i - 1];
          let previousRowGroup = previousRowData.Tyname;
          if (Tyname === previousRowGroup)
            this.rowGroupMetadata[Tyname].size++;
          else
            this.rowGroupMetadata[Tyname] = { index: i, size: 1 };
        }

      }
    }
  }


  // onSociety() {
  //   let ReceiverSelection = [];
  //   const params = new HttpParams().set('TRCode', this.t_cd.value);
  //   this.restAPIService.getByParameters(PathConstants.DEPOSITOR_TYPE_MASTER, params).subscribe(res => {
  //     res.forEach(s => {
  //       ReceiverSelection.push({ 'label': s.Tyname, 'value': s.Tycode });
  //     });
  //     this.receiverOptions = ReceiverSelection;
  //   });
  //   // if (this.splpdsData !== undefined) {
  //   //   let result = Array.from(new Set(this.splpdsData.map((item: any) => item.Coop)));
  //   //   let code = Array.from(new Set(this.splpdsData.map((item: any) => item.Comodity)));
  //   //   this.splpdsData.forEach(s => {

  //   //     for (var index in result && code) {
  //   //       this.splpdsData.push(result[index]);
  //   //     }
  //   //     s.Coop = result;
  //   //     s.Comodity = code;
  //   //   });
  //   //   this.FilterData = this.filterArray;
  //   // }
  //   this.splpdsData = this.filterArray;
  //   if (this.splpdsData !== undefined && this.splpdsData !== '') {
  //     let sno = 0;
  //     this.splpdsData.forEach(data => {
  //       data.Slno = sno;
  //       sno += 1;
  //       this.splpdsData = this.splpdsData.filter(item => {
  //         return item.Tyname === this.r_cd.label
  //       });
  //     });
  //   }
  // }

  getTotalQuantity() {
    return this.splpdsData.map(t => t.Quantity).reduce((acc, value) => acc + value, 0);
  }

  getTotalAmount() {
    return this.splpdsData.map(t => t.Amount).reduce((acc, value) => acc + value, 0);
  }

  getTotalRate() {
    return this.splpdsData.map(t => t.Rate).reduce((acc, value) => acc + value, 0);
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
    this.splpdsData = [];
  }

  exportAsXLSX(): void {
    var splpdsData = [];
    this.splpdsData.forEach(data => {
      splpdsData.push({ SlNo: data.SlNo, Dono: data.Dono, Dodate: data.Dodate, Type: data.Type, Coop: data.Coop, Comodity: data.Comodity, Scheme: data.Scheme, Quantity: data.Quantity, Rate: data.Rate, Amount: data.Amount, C_Nc: data.C_Nc });
    });
    this.excelService.exportAsExcelFile(splpdsData, 'DO_SPLPDS_Scheme', this.SplpdsCols);
  }

  onPrint() { }
}