import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { DatePipe } from '@angular/common';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpErrorResponse } from '@angular/common/http';
import { ExcelService } from 'src/app/shared-services/excel.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { StatusMessage } from 'src/app/constants/Messages';
import 'rxjs/add/observable/from';
import 'rxjs/Rx';
import * as Rx from 'rxjs';
import * as _ from 'lodash';
import { Dropdown } from 'primeng/primeng';

@Component({
  selector: 'app-daily-documents',
  templateUrl: './daily-documents.component.html',
  styleUrls: ['./daily-documents.component.css']
})
export class DailyDocumentsComponent implements OnInit {
  DailyDocumentTotalCols: any;
  DailyDocumentTotalData: any = [];
  DailyDocumentReceiptCols: any;
  DailyDocumentReceiptData: any = [];
  AllReceiptDocuments: any = [];
  ReceiptDocumentDetailData: any = [];
  ReceiptDocumentDetailCols: any;
  GCode: any;
  RCode: any;
  DocumentDate: Date;
  roleId: any;
  gdata: any;
  userid: any;
  maxDate: Date;
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
  @ViewChild('godown') godownPanel: Dropdown;
  @ViewChild('region') regionPanel: Dropdown;

  constructor(private tableConstants: TableConstants, private messageService: MessageService, private excelService: ExcelService, private restAPIService: RestAPIService, private datepipe: DatePipe, private roleBasedService: RoleBasedService, private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.gdata = this.roleBasedService.getInstance();
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.DailyDocumentTotalCols = this.tableConstants.DailyDocumentTotalReport;
    this.DailyDocumentReceiptCols = this.tableConstants.DailyDocumentReceiptReport;
    this.ReceiptDocumentDetailCols = this.tableConstants.DetailDailyDocumentReceiptReport;
    this.regionData = this.roleBasedService.getRegions();
    this.maxDate = new Date();
    this.userid = JSON.parse(this.authService.getCredentials());
    this.items = [
      {
        label: 'Excel', icon: 'fa fa-table', command: () => {
          this.exportAsXLSX();
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
        if (type === 'enter') {
          this.godownPanel.overlayVisible = true;
        }
        if (this.roleId === 3) {
          this.regionData = this.roleBasedService.instance;
          if (this.regionData !== undefined) {
            this.regionData.forEach(x => {
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
          this.regionData = this.roleBasedService.regionsData;
          if (this.regionData !== undefined) {
            this.regionData.forEach(x => {
              regionSelection.push({ 'label': x.RName, 'value': x.RCode });
            });
          }
          this.regionOptions = regionSelection;
        }
        break;
      case 'gd':
        if (this.gdata !== undefined) {
          this.gdata.forEach(x => {
            if(x.RCode === this.RCode.value) {
            godownSelection.push({ 'label': x.GName, 'value': x.GCode, 'rcode': x.RCode, 'rname': x.RName });
            }
          });
          this.godownOptions = godownSelection;
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
    this.restAPIService.post(PathConstants.DAILY_DOCUMENT_RECEIPT_POST, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
         this.AllReceiptDocuments = res;
         this.loading = false;
      ///Distinct value groupby of an array
      let groupedData;
      Rx.Observable.from(this.AllReceiptDocuments)
      .groupBy((x: any) => x.DocNo) // using groupBy from Rxjs
      .flatMap(group => group.toArray())// GroupBy dont create a array object so you have to flat it
      .map(g => {// mapping 
        return {
          DocNo: g[0].DocNo,//take the first name because we grouped them by name
          CommodityName: g[0].CommodityName,
          DocDate: g[0].DocDate, // using lodash to sum quantity
          GROSSWT: g[0].GROSSWT,
          GodownName: g[0].GodownName,
          Moisture: g[0].Moisture,
          NETWT: g[0].NETWT,
          NOOfPACKING: g[0].NOOfPACKING,
          ORDERDate: g[0].ORDERDate,
          OrderNo: g[0].OrderNo,
          PERIODALLOT: g[0].PERIODALLOT,
          PackingType: g[0].PackingType,
          ReceivedFrom: g[0].ReceivedFrom,
          SCHEME: g[0].SCHEME,
          StackNo: g[0].StackNo,
          TNCSCode: g[0].TNCSCode,
          Transactiontype: g[0].Transactiontype,
          TRUCKDate: g[0].TRUCKDate,
          TruckMemoNo: g[0].TruckMemoNo,
        }
      })
      .toArray() //.toArray because I guess you want to loop on it with ngFor      
      .subscribe(d =>  groupedData = d);
      this.DailyDocumentReceiptData = groupedData;
      this.noOfDocs = groupedData.length;
      let sno = 1;
      this.DailyDocumentReceiptData.forEach(x => { x.SlNo = sno; sno += 1; })
      ///End

      ///No.Of Document 
      this.DailyDocumentTotalData.push({
        NoDocument: this.noOfDocs,
        GCode: this.GCode.value,
        GName: this.GCode.label,
        RName: this.RCode.value,
        RCode: this.RCode.label
      })
      ///End
      } else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }

  viewDetailsOfDocument(selectedRow) {
    this.ReceiptDocumentDetailData = [];
    this.viewPane = true;
    this.AllReceiptDocuments.forEach(data => {
      if(data.DocNo === selectedRow.DocNo) {
        this.ReceiptDocumentDetailData.push(data);
      }
    })
    let slno = 1;
    this.ReceiptDocumentDetailData.forEach(s => {
      s.SlNo = slno;
      slno += 1;
    })
  }


  onResetTable(item) {
    if(item === 'reg') { this.GCode = null; }
    this.DailyDocumentReceiptData = [];
    this.DailyDocumentTotalData = [];
    this.ReceiptDocumentDetailData = [];
    this.AllReceiptDocuments = [];
  }

  onSearch(value) {
    this.DailyDocumentReceiptData = this.filterArray;
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.DailyDocumentReceiptData = this.DailyDocumentReceiptData.filter(item => {
        // if (item.DepositorName.toString().startsWith(value)) {
        return item.CommodityName.toString().startsWith(value);
        // }
      });
    }
  }

  exportAsXLSX(): void {
    var DailyReceipt = [];
    this.DailyDocumentReceiptData.forEach(data => {
      DailyReceipt.push({ SlNo: data.SlNo, DocNo: data.DocNo, DocDate: data.DocDate, Transactiontype: data.Transactiontype, StackNo: data.StackNo, CommodityName: data.CommodityName, PackingType: data.PackingType, NOOfPACKING: data.NOOfPACKING, GROSSWT: data.GROSSWT, NETWT: data.NETWT, Moisture: data.Moisture, Scheme: data.SCHEME, Period_Allotment: data.PERIODALLOT, OrderNo: data.OrderNo, Order_Date: data.ORDERDate, Received_From: data.ReceivedFrom, TruckMemoNo: data.TruckMemoNo, Truck_Date: data.TRUCKDate })
    });
    this.excelService.exportAsExcelFile(DailyReceipt, 'Daily_Receipt', this.DailyDocumentReceiptCols);
  }

  exportAsPDF() {
    var doc = new jsPDF('p', 'pt', 'a4');
    doc.text("Tamil Nadu Civil Supplies Corporation - Head Office", 100, 30);
    // var img ="assets\layout\images\dashboard\tncsc-logo.png";
    // doc.addImage(img, 'PNG', 150, 10, 40, 20);
    var col = this.DailyDocumentReceiptCols;
    var rows = [];
    this.DailyDocumentReceiptData.forEach(element => {
      var temp = [element.SlNo, element.DocNo, element.DocDate, element.Transactiontype, element.StackNo, element.CommodityName, element.PackingType, element.NOOfPACKING, element.GROSSWT, element.NETWT, element.Moisture, element.SCHEME, element.PERIODALLOT, element.OrderNo, element.ORDERDate, element.ReceivedFrom, element.TruckMemoNo, element.TRUCKDate];
      rows.push(temp);
    });
    doc.autoTable(col, rows);
    doc.save('Daily_Receipt.pdf');
  }

  onPrint() { }
}