import { Component, OnInit } from '@angular/core';
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
  g_cd: any;
  gCode: any;
  rCode: any;
  r_cd: any;
  DocumentDate: Date;
  roleId: any;
  gdata: any;
  userid: any;
  maxDate: Date;
  loading: boolean;
  godownOptions: SelectItem[];
  canShowMenu: boolean;
  items: any;
  filterArray: any;
  searchText: any;
  noOfDocs: any;

  constructor(private tableConstants: TableConstants, private messageService: MessageService, private excelService: ExcelService, private restAPIService: RestAPIService, private datepipe: DatePipe, private roleBasedService: RoleBasedService, private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.gdata = this.roleBasedService.getInstance();
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.DailyDocumentTotalCols = this.tableConstants.DailyDocumentTotalReport;
    this.DailyDocumentReceiptCols = this.tableConstants.DailyDocumentReceipt;
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

  onSelect(selectedItem) {
    let godownSelection = [];
    switch (selectedItem) {
      case 'gd':
        if (this.gdata !== undefined) {
          this.gdata.forEach(x => {
            godownSelection.push({ 'label': x.GName, 'value': x.GCode, 'rcode': x.RCode, 'rname': x.RName });
            this.godownOptions = godownSelection;
          });
        }
        break;
    }
  }

  ontime() {
    const params = {
      'GodownCode': this.g_cd.value,
      'RegionCode': this.g_cd.rcode,
      'RoleId': this.roleId,
      'DocumentDate': this.datepipe.transform(this.DocumentDate, 'MM/dd/yyyy')
    };
    this.restAPIService.post(PathConstants.DAILY_DOCUMENT_RECEIPT_POST, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
         this.DailyDocumentReceiptData = res;
      let sno = 1;
      ///Distinct value groupby of an array
      let groupedData;
      Rx.Observable.from(this.DailyDocumentReceiptData)
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
      .subscribe(d => groupedData = d);
      ///End

      ///Duplicate value replacin
      let j = 0;
      for(let i = 0; i < this.DailyDocumentReceiptData.length; i ++) {
          if(j < groupedData.length && this.DailyDocumentReceiptData[i].DocNo === groupedData[j].DocNo) {
            this.DailyDocumentReceiptData[i].SlNo = sno;
            this.noOfDocs = sno;
            sno += 1;
            j += 1;
          } else {
            this.DailyDocumentReceiptData[i].SlNo = '';
          }
      }
      ///End

      ///No.Of Document 
      this.DailyDocumentTotalData.push({
        NoDocument: this.noOfDocs,
        GCode: this.g_cd.value,
        GName: this.g_cd.label,
        RName: this.g_cd.rname,
        RCode: this.g_cd.rcode
      })
      ///End
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
      }
      this.DailyDocumentReceiptData.slice(0);
    }, (err: HttpErrorResponse) => {
      if (err.status === 0) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }

  onResetTable() {
    this.DailyDocumentReceiptData = [];
    this.DailyDocumentTotalData = [];
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