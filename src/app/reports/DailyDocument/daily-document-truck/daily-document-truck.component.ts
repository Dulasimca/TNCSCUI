import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Dropdown, MessageService } from 'primeng/primeng';
import { Table } from 'primeng/table';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { DatePipe } from '@angular/common';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { PathConstants } from 'src/app/constants/path.constants';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { StatusMessage } from 'src/app/constants/Messages';
import 'rxjs/add/observable/from';
import 'rxjs/Rx';
import * as Rx from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-daily-document-truck',
  templateUrl: './daily-document-truck.component.html',
  styleUrls: ['./daily-document-truck.component.css']
})
export class DailyDocumentTruckComponent implements OnInit {
  DailyDocumentTotalCols: any;
  DailyDocumentTotalData: any = [];
  DailyDocumentTruckCols: any;
  DailyDocumentTruckData: any = [];
  AllTruckDocuments: any = [];
  TruckDocumentDetailData: any = [];
  TruckDocumentDetailCols: any;
  GCode: any;
  RCode: any;
  DocumentDate: Date = new Date();
  roleId: any;
  gdata: any;
  userid: any;
  maxDate: Date = new Date();
  loading: boolean;
  godownOptions: SelectItem[];
  regionOptions: SelectItem[];
  canShowMenu: boolean;
  items: any;
  filterArray: any;
  searchText: any;
  noOfDocs: any;
  regionData: any;
  viewPane: boolean;
  loggedInRCode: string;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;
  @ViewChild('dt', { static: false }) table: Table;

  constructor(private tableConstants: TableConstants, private messageService: MessageService,
    private restAPIService: RestAPIService, private datepipe: DatePipe,
    private roleBasedService: RoleBasedService, private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.gdata = this.roleBasedService.getInstance();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.DailyDocumentTotalCols = this.tableConstants.DailyDocumentTotalReport;
    this.DailyDocumentTruckCols = this.tableConstants.DailyDocumentTruckReport;
    this.TruckDocumentDetailCols = this.tableConstants.DetailDailyDocumentTruckReport;
    this.regionData = this.roleBasedService.getRegions();
    this.userid = JSON.parse(this.authService.getCredentials());
    this.items = [
      {
        label: 'Excel', icon: 'fa fa-table', command: () => {
          this.table.exportCSV();
        }
      },
        {
        label: 'PDF', icon: "fa fa-file-pdf-o", command: () => {
          this.exportAsPDF();
        }
      }]
  }

  onSelect(selectedItem, type) {
    let godownSelection = [];
    let regionSelection = [];
    switch (selectedItem) {
      case 'reg':
          this.regionData = this.roleBasedService.regionsData;
          if (type === 'enter') {
            this.regionPanel.overlayVisible = true;
          }
          if (this.roleId === 1) {
            if (this.regionData !== undefined) {
              this.regionData.forEach(x => {
                regionSelection.push({ 'label': x.RName, 'value': x.RCode });
              });
              this.regionOptions = regionSelection;
              this.regionOptions.unshift({ label: 'All', value: 'All' });
            }
          } else {
            if (this.regionData !== undefined) {
              this.regionData.forEach(x => {
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
          this.gdata = this.roleBasedService.instance;
          if (this.gdata !== undefined) {
            this.gdata.forEach(x => {
              if (x.RCode === this.RCode.value) {
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
    const params = {
      'GodownCode': this.GCode.value,
      'RegionCode': this.RCode.value,
      'RoleId': this.roleId,
      'DocumentDate': this.datepipe.transform(this.DocumentDate, 'MM/dd/yyyy')
    };
    this.loading = true;
    this.restAPIService.post(PathConstants.DAILY_DOCUMENT_TRUCK_POST, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.AllTruckDocuments = res;
        this.loading = false;
        let sno = 1;
        ///Distinct value groupby of an array
        let groupedData;
        Rx.Observable.from(this.AllTruckDocuments)
          .groupBy((x: any) => x.DocNo) // using groupBy from Rxjs
          .flatMap(group => group.toArray())// GroupBy dont create a array object so you have to flat it
          .map(g => {// mapping 
            return {
              DocNo: g[0].DocNo,//take the first name because we grouped them by name
              CommodityName: g[0].CommodityName,
              DocDate: g[0].DocDate, // using lodash to sum quantity
              StackNo: g[0].StackNo,
              TransactionType: g[0].TransactionType,
              NOOfPACKING: g[0].NOOfPACKING,
              PackingType: g[0].PackingType,
              GROSSWT: g[0].GROSSWT,
              GodownName: g[0].GodownName,
              SCHEME: g[0].SCHEME,
              NETWT: g[0].NETWT,
              ReceivedFrom: g[0].ReceivedFrom,
              STTime: g[0].STTime
            }
          })
          .toArray() //.toArray because I guess you want to loop on it with ngFor      
          .subscribe(d => groupedData = d);
        this.DailyDocumentTruckData = groupedData;
        this.noOfDocs = groupedData.length;
        this.DailyDocumentTruckData.forEach(x => { x.SlNo = sno; sno += 1; })
        ///End

        ///No.Of Document 
        this.DailyDocumentTotalData.push({
          NoDocument: this.noOfDocs,
          GCode: this.GCode.value,
          GName: this.GCode.label,
          RName: this.RCode.label,
          RCode: this.RCode.value
        })
        ///End
      } else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
      }
      this.DailyDocumentTruckData.slice(0);
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }

  viewDetailsOfDocument(selectedRow) {
    this.TruckDocumentDetailData = [];
    this.viewPane = true;
    this.AllTruckDocuments.forEach(data => {
      if (data.DocNo === selectedRow.DocNo) {
        this.TruckDocumentDetailData.push(data);
      }
    })
    let slno = 1;
    this.TruckDocumentDetailData.forEach(s => {
      s.SlNo = slno;
      slno += 1;
    })

  }

  onResetTable(item) {
    if (item === 'reg') { this.GCode = null; }
    this.DailyDocumentTruckData = [];
    this.DailyDocumentTotalData = [];
    this.TruckDocumentDetailData = [];
    this.AllTruckDocuments = [];
  }

  onSearch(value) {
    this.DailyDocumentTruckData = this.filterArray;
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.DailyDocumentTruckData = this.DailyDocumentTruckData.filter(item => {
        // if (item.DepositorName.toString().startsWith(value)) {
        return item.CommodityName.toString().startsWith(value);
        // }
      });
    }
  }


  exportAsPDF() {
    var doc = new jsPDF('p', 'pt', 'a4');
    doc.text("Tamil Nadu Civil Supplies Corporation - Head Office", 100, 30);
    // var img ="assets\layout\images\dashboard\tncsc-logo.png";
    // doc.addImage(img, 'PNG', 150, 10, 40, 20);
    var col = this.DailyDocumentTruckCols;
    var rows = [];
    this.DailyDocumentTruckData.forEach(element => {
      var temp = [element.SlNo, element.DocNo, element.DocDate, element.Transactiontype, element.StackNo, element.CommodityName, element.PackingType, element.NOOfPACKING, element.GROSSWT, element.NETWT, element.SCHEME, element.ReceivedFrom];
      rows.push(temp);
    });
    doc.autoTable(col, rows);
    doc.save('Daily_Truck.pdf');
  }

  onPrint() { }
}
