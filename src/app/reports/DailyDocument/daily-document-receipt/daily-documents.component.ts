import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { DatePipe } from '@angular/common';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpErrorResponse, HttpParams, HttpClient } from '@angular/common/http';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { StatusMessage } from 'src/app/constants/Messages';
import 'rxjs/add/observable/from';
import * as Rx from 'rxjs';
import { Dropdown } from 'primeng/primeng';
import { Table } from 'primeng/table';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { saveAs } from 'file-saver';

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
  ITCode: any;
  FromDate: any = new Date();
  ToDate: any = new Date();
  roleId: any;
  gdata: any;
  userid: any;
  maxDate: Date;
  loading: boolean;
  godownOptions: SelectItem[];
  regionOptions: SelectItem[];
  commodityOptions: SelectItem[];
  canShowMenu: boolean;
  items: any;
  filterArray: any;
  searchText: any;
  noOfDocs: any;
  regionData: any;
  viewPane: boolean;
  loggedInRCode: any;
  selectedParty: any;
  showPreview: boolean;
  obj: any = {};
  itemCols: any;
  itemData: any = [];
  blockScreen: boolean;
  commodity_data: any;
  @ViewChild('commodity', { static: false }) commodityPanel: Dropdown;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;
  @ViewChild('dt', { static: false }) table: Table;
  isLocked: any;


  constructor(private tableConstants: TableConstants, private messageService: MessageService,
    private restAPIService: RestAPIService, private datepipe: DatePipe, private http: HttpClient,
    private roleBasedService: RoleBasedService, private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.commodity_data = this.roleBasedService.getCommodityData();
    this.gdata = this.roleBasedService.getInstance();
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.DailyDocumentTotalCols = this.tableConstants.DailyDocumentTotalReport.slice(0);
    this.DailyDocumentReceiptCols = this.tableConstants.DailyDocumentReceiptReport.slice(0);
    this.ReceiptDocumentDetailCols = this.tableConstants.DetailDailyDocumentReceiptReport.slice(0);
    this.regionData = this.roleBasedService.getRegions();
    this.maxDate = new Date();
    this.userid = JSON.parse(this.authService.getCredentials());
    this.items = [
      {
        label: 'Excel', icon: 'fa fa-table', command: () => {
          this.table.exportCSV();
        }
      },
      {
        label: 'PDF', icon: "fa fa-file-pdf-o", command: () => {
          this.exportAsPDF('1');
        }
      }];
    if (this.roleId !== 1) {
      this.DailyDocumentReceiptCols.forEach((x, index) => {
        if (x.field === 'ilock' || 'ipreview' || 'ipdf') {
          this.DailyDocumentReceiptCols.splice(index, 1);
        }
      })
    }
  }

  onSelect(selectedItem, type) {
    let godownSelection = [];
    let regionSelection = [];
    let commoditySelection = [];
    switch (selectedItem) {
      case 'reg':
        this.regionData = this.roleBasedService.regionsData;
        if (type === 'enter') {
          this.regionPanel.overlayVisible = true;
        }
        if (this.roleId === 1 || this.roleId === 2) {
          if (this.regionData !== undefined) {
            this.regionData.forEach(x => {
              regionSelection.push({ label: x.RName, value: x.RCode });
            });
            this.regionOptions = regionSelection;
            this.regionOptions.unshift({ label: 'All', value: 'All' });
          }
        } else {
          if (this.regionData !== undefined) {
            this.regionData.forEach(x => {
              if (x.RCode === this.loggedInRCode) {
                regionSelection.push({ label: x.RName, value: x.RCode });
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
              godownSelection.push({ label: x.GName, value: x.GCode });
            }
          });
          this.godownOptions = godownSelection;
          if (this.roleId !== 3) {
            this.godownOptions.unshift({ label: 'All', value: 'All' });
          }
        }
        break;
      case 'cd':
        if (type === 'enter') { this.commodityPanel.overlayVisible = true; }
        if (this.commodity_data !== undefined && this.commodity_data !== null) {
          this.commodity_data.forEach(y => {
            commoditySelection.push({ label: y.ITName, value: y.ITCode, ascheme: y.AGroup });
          });
          this.commodityOptions = commoditySelection;
          this.commodityOptions.unshift({ label: '-select-', value: null, disabled: true });
        } else {
          this.commodityOptions = commoditySelection;
        }
        break;
    }
  }

  onView() {
    this.onResetTable('');
    this.checkValidDateSelection();
    const params = {
      'GodownCode': this.GCode.value,
      'RegionCode': this.RCode.value,
      'RoleId': this.roleId,
      'FromDate': this.datepipe.transform(this.FromDate, 'MM/dd/yyyy'),
      'ToDate': this.datepipe.transform(this.ToDate, 'MM/dd/yyyy'),
      'ITCode': this.ITCode.value,
      'ITName': this.ITCode.label,
      'Type': 1
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
              LorryNo: g[0].LorryNo,
              PERIODALLOT: g[0].PERIODALLOT,
              PackingType: g[0].PackingType,
              ReceivedFrom: g[0].ReceivedFrom,
              SCHEME: g[0].SCHEME,
              StackNo: g[0].StackNo,
              TNCSCode: g[0].TNCSCode,
              Transactiontype: g[0].Transactiontype,
              TRUCKDate: g[0].TRUCKDate,
              TruckMemoNo: g[0].TruckMemoNo,
              SRTime: g[0].SRTime,
              Status: g[0].Status
            }
          })
          .toArray() //.toArray because I guess you want to loop on it with ngFor      
          .subscribe(d => groupedData = d);
        this.DailyDocumentReceiptData = groupedData;
        this.noOfDocs = groupedData.length;
        this.doIterateList(this.DailyDocumentReceiptData);
        this.doIterateList(this.AllReceiptDocuments);
        ///End

        ///No.Of Document 
        this.DailyDocumentTotalData.push({
          NoDocument: this.noOfDocs,
          GCode: this.GCode.value,
          GName: this.GCode.label,
          RName: this.RCode.value,
          RCode: this.RCode.label
        });
        ///End
      } else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING,
          detail: StatusMessage.NoRecForCombination
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR,
          detail: StatusMessage.ErrorMessage
        });
      }
    });
  }

  doIterateList(data) {
    let sno = 1;
    data.forEach(x => {
    x.SlNo = sno;
    sno += 1;
    x.ilock = (x.Status) ? 'pi pi-lock' : 'pi pi-lock-open';
    x.ipreview = 'pi pi-eye';
    x.ipdf = 'pi pi-file-pdf';
  })
}

  viewDetailsOfDocument(selectedRow) {
    this.ReceiptDocumentDetailData = [];
    this.selectedParty = selectedRow.ReceivedFrom;
    this.viewPane = true;
    this.AllReceiptDocuments.forEach(data => {
      if (data.ReceivedFrom === selectedRow.ReceivedFrom) {
        this.ReceiptDocumentDetailData.push(data);
      }
    });
    let slno = 1;
    this.ReceiptDocumentDetailData.forEach(s => {
      s.SlNo = slno;
      slno += 1;
    });
  }

  onSelectedRow(data, index, type) {
    if (data) {
      switch (type) {
        case 'preview':
          this.onLoadSRDetails(data.DocNo, type);
          break;
        case 'pdf':
          this.onLoadSRDetails(data.DocNo, type);
          break;
        case 'unlock':
          this.callUnlockDocUpdate(data.DocNo);
          break;
      }
    }
  }

  onLoadSRDetails(num, type) {
    this.blockScreen = true;
    this.obj = {};
    const params = new HttpParams().set('sValue', num).append('Type', '2');
    this.restAPIService.getByParameters(PathConstants.STOCK_RECEIPT_VIEW_DOCUMENT, params).subscribe((res: any) => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.obj.Type = 2;
        this.obj.SRNo = res[0].SRNO;
        this.obj.SRDate = this.datepipe.transform(res[0].SRDate, 'MM/dd/yyyy');
        this.obj.ReceiptDate = this.datepipe.transform(res[0].SRDate, 'dd/MM/yyyy');
        this.obj.RowId = res[0].RowId;
        this.obj.AllotOrderDate = this.datepipe.transform(res[0].OrderDate, 'dd/MM/yyyy');
        this.obj.OrderDate = this.datepipe.transform(res[0].OrderDate, 'MM/dd/yyyy');
        this.obj.OrderNo = res[0].OrderNo;
        this.obj.TruckDate = this.datepipe.transform(res[0].TruckMemoDate, 'dd/MM/yyyy');
        this.obj.TruckMemoDate = this.datepipe.transform(res[0].TruckMemoDate, 'MM/dd/yyyy');
        this.obj.TruckMemoNo = res[0].TruckMemoNo;
        this.obj.LNo = res[0].LNo;
        this.obj.LFrom = res[0].LFrom;
        this.obj.TransactionName = res[0].TRName;
        this.obj.Trcode = res[0].Trcode;
        this.obj.ReceivingCode = res[0].ReceivingCode;
        this.obj.RCode = res[0].RCode;
        this.obj.TransporterName = (res[0].TransporterName !== undefined && res[0].TransporterName !== null) ? res[0].TransporterName : '-';
        this.obj.DepositorName = res[0].DepositorName;
        this.obj.DepositorType = res[0].IssuerType;
        this.obj.DepositorCode = res[0].IssuingCode;
        this.obj.DepositorTypeName = res[0].DepositorType;
        this.obj.PAllotment = res[0].Pallotment;
        this.obj.MTransport = res[0].TransportMode;
        this.obj.ManualDocNo = res[0].Flag1;
        this.obj.Remarks = res[0].Remarks.trim();
        this.obj.UnLoadingSlip = res[0].Unloadingslip;
        this.obj.LWBNo = res[0].LWBNo;
        this.obj.GodownName = res[0].GName;
        this.obj.RegionName = res[0].RName;
        this.obj.LWBDate = this.datepipe.transform(res[0].LWBDate, 'MM/dd/yyyy');
        this.obj.LorryWayBillDate = this.datepipe.transform(res[0].LWBDate, 'dd/MM/yyyy');
        this.obj.LDate = this.datepipe.transform(res[0].LDate, 'MM/dd/yyyy');
        this.obj.UserID = this.userid.user;
        let sno = 1;
        this.obj.ItemList = [];
        res.forEach(i => {
          this.obj.ItemList.push({
            sno: sno,
            TStockNo: i.TStockNo,
            Scheme: i.Scheme,
            ICode: i.ICode,
            IPCode: i.IPCode,
            NoPacking: i.NoPacking,
            PWeight: i.PWeight,
            GKgs: i.GKgs,
            Nkgs: i.Nkgs,
            WTCode: i.WTCode,
            Moisture: i.Moisture,
            CommodityName: i.ITName,
            SchemeName: i.SCName,
            PackingName: i.PName,
            WmtType: i.WEType,
            StackYear: i.StackYear,
          });
          sno += 1;
        });
        this.itemData = this.obj.ItemList;
        if (type === 'preview') {
          this.showPreviewPane();
        } else if (type === 'pdf') {
          this.downloadPDF();
        }
      } else {
        this.blockScreen = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      this.blockScreen = false;
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
  }

  showPreviewPane() {
    this.showPreview = true;
    this.itemCols = this.tableConstants.StockReceiptItemColumns;
    this.blockScreen = false;
  }

  downloadPDF() {
    this.blockScreen = true;
    this.restAPIService.post(PathConstants.DAILY_RECEIPT_REPORT_PDF_DOWNLOAD, this.obj).subscribe(res => {
      if (res.Item1) {
        const path = "../../assets/Reports/" + this.userid.user + "/";
        const filename = this.obj.ReceivingCode + GolbalVariable.DailyReceiptPDFFileName + ".pdf";
        saveAs(path + filename, filename);
        this.blockScreen = false;
      } else {
        this.blockScreen = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.ErrorMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      this.blockScreen = false;
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
  }

  callUnlockDocUpdate(docNo) {
    const params = { 'DocNumber': docNo, 'Status': 0,'UserId':this.userid.user };
    this.blockScreen = true;
    this.restAPIService.put(PathConstants.DAILY_RECEIPT_REPORT_UNLOCK_DOC_PUT, params).subscribe(res => {
      if (res) {
        var msg = 'Unlocked the document no: ' + docNo + ' successfully';
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS,
          summary: StatusMessage.SUMMARY_SUCCESS, detail: msg
        });
        this.blockScreen = false;
        this.onView();
      } else {
        this.blockScreen = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.ErrorMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      this.blockScreen = false;
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
  }

  onPrint() {
    this.blockScreen = true;
    this.restAPIService.post(PathConstants.STOCK_RECEIPT_DOCUMENT, this.obj).subscribe(res => {
      if (res.Item1) {
        const path = "../../assets/Reports/" + this.userid.user + "/";
        const filename = this.obj.ReceivingCode + GolbalVariable.StockReceiptDocument;
        let filepath = path + filename + ".txt";
        this.http.get(filepath, { responseType: 'text' })
          .subscribe(data => {
            if (data !== undefined && data !== null) {
              var doc = new jsPDF({
                orientation: 'potrait',
              })
              doc.setFont('courier');
              doc.setFontSize(9);
              doc.text(data, 2, 2);
              doc.save(filename + '.pdf');
              window.open(doc.output(filepath), '_blank');
            } else {
              this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
              this.blockScreen = false;
            }
          }, (err: HttpErrorResponse) => {
            this.blockScreen = false;
            if (err.status === 0) {
              this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
            }
          });
        this.blockScreen = false;
        this.messageService.clear();
        this.messageService.clear();
        this.showPreview = false;
        this.itemData = [];
      } else {
        this.blockScreen = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.ErrorMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      this.blockScreen = false;
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
  }

  onResetTable(item) {
    if (item === 'reg') { this.GCode = null; }
    this.DailyDocumentReceiptData = [];
    this.DailyDocumentTotalData = [];
    this.ReceiptDocumentDetailData = [];
    this.AllReceiptDocuments = [];
    this.blockScreen = false;
  }

  onDateSelect() {
    this.checkValidDateSelection();
    this.onResetTable('');
  }

  checkValidDateSelection() {
    if (this.FromDate !== undefined && this.ToDate !== undefined && this.FromDate !== '' && this.ToDate !== '') {
      let selectedFromDate = this.FromDate.getDate();
      let selectedToDate = this.ToDate.getDate();
      let selectedFromMonth = this.FromDate.getMonth();
      let selectedToMonth = this.ToDate.getMonth();
      let selectedFromYear = this.FromDate.getFullYear();
      let selectedToYear = this.ToDate.getFullYear();
      if ((selectedFromDate > selectedToDate && ((selectedFromMonth >= selectedToMonth && selectedFromYear >= selectedToYear) ||
        (selectedFromMonth === selectedToMonth && selectedFromYear === selectedToYear))) ||
        (selectedFromMonth > selectedToMonth && selectedFromYear === selectedToYear) || (selectedFromYear > selectedToYear)) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_INVALID,
          life: 5000, detail: StatusMessage.ValidDateErrorMessage
        });
        this.FromDate = this.ToDate = '';
      }
      return this.FromDate, this.ToDate;
    }
  }


  onSearch(value) {
    this.DailyDocumentReceiptData = this.filterArray;
    if (value !== undefined && value !== '') {
      value = value.toString().toLowerCase();
      this.DailyDocumentReceiptData = this.AllReceiptDocuments.filter(item => {
        return item.ReceivedFrom.toString().toLowerCase().startsWith(value);
      });
    } else {
      this.DailyDocumentReceiptData = this.AllReceiptDocuments;
    }
    let sno = 1;
    this.DailyDocumentReceiptData.forEach(x => { x.SlNo = sno; sno += 1; })
  }

  exportAsPDF(type) {
    var doc = new jsPDF('l', 'pt', 'a4');
    doc.text("Tamil Nadu Civil Supplies Corporation - Head Office", 200, 18);
    var rows = [];
    if (type === '1') {
      var col = this.DailyDocumentReceiptCols;
      this.DailyDocumentReceiptData.forEach(element => {
        var temp = [element.SlNo, element.DocNo, element.DocDate,
        element.Transactiontype, element.ReceivedFrom, element.SRTime];
        rows.push(temp);
      });
    } else {
      const header = "Receipt Document Details of - " + this.selectedParty;
      doc.text(header, 210, 36);
      var col = this.ReceiptDocumentDetailCols.slice(0);
      col.forEach((x, index) => {
        if (x.field === 'Transactiontype' || x.field === 'SRTime') {
          col.splice(index, 1);
        }
      })
      this.ReceiptDocumentDetailData.forEach(element => {
        var temp = [element.SlNo, element.DocNo, element.DocDate,
        element.LorryNo, element.StackNo, element.CommodityName,
        element.PackingType, element.NOOfPACKING, element.GROSSWT,
        element.NETWT, element.Moisture, element.SCHEME,
        element.PERIODALLOT, element.OrderNo, element.ORDERDate,
        element.ReceivedFrom, element.TruckMemoNo, element.TRUCKDate];
        rows.push(temp);
      });
    }
    doc.setFontSize(8);
    doc.autoTable(col, rows);
    doc.save('DAILY_RECEIPT.pdf');
  }
}