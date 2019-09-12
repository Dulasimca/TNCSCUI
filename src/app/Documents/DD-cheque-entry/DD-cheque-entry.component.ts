import { Component, OnInit, ViewChild } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams, HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';
import { SelectItem, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { StatusMessage } from 'src/app/constants/Messages';
import * as jsPDF from 'jspdf';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { NgForm } from '@angular/forms';
import { Dropdown } from 'primeng/primeng';

@Component({
  selector: 'app-DD-cheque-entry',
  templateUrl: './DD-cheque-entry.component.html',
  styleUrls: ['./DD-cheque-entry.component.css']
})
export class DDChequeEntryComponent implements OnInit {
  DDChequeCols: any;
  DDChequeData: any = [];
  ChequeReceiptNoCols: any;
  ChequeReceiptNoData: any = [];
  receiptDate: any = new Date();
  receiptNo: any;
  ReceiptDt: any;
  canShowMenu: boolean;
  maxDate: Date = new Date();
  paymentTypeOptions: SelectItem[];
  paymentList: any = [];
  paymentType: any;
  rowId: any = 0;
  receivedFromOptions: SelectItem[];
  receivorTypeOptions: SelectItem[];
  receivedFrom: any;
  filteredNames: any[];
  chequeDate: any = new Date();
  bank: any;
  chequeAmount: any = 0;
  chequeNo: any;
  SocietyChecked: boolean;
  data: any;
  UserID: any;
  regionName: any;
  godownName: any;
  amount: any;
  GCode: any;
  RCode: any;
  viewDate: Date = new Date();
  viewPane: boolean;
  receivorType: any;
  receivorCode: any;
  details: any = '-';
  totalAmount: any = 0;
  isSaveSucceed: boolean;
  isViewed: boolean;
  isSelectedReceivor: boolean;
  @ViewChild('receivor') receivorTypePanel: Dropdown;
  @ViewChild('pay') paymentTypePanel: Dropdown;

  constructor(private tableConstants: TableConstants, private restApiService: RestAPIService,
    private authService: AuthService, private datepipe: DatePipe, private http: HttpClient,
    private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.DDChequeCols = this.tableConstants.DDChequeEntryCols;
    this.ChequeReceiptNoCols = this.tableConstants.ChequeReceiptNoCols;
    this.UserID = JSON.parse(this.authService.getCredentials());
    this.receivorTypeOptions = [{ label: '-select-', value: null }, { label: 'BULK CONSUMERS', value: 'TY001' },
    { label: 'COOPERATIVES LEADING', value: 'TY002' }, { label: 'COOPERATIVES PRIMARY', value: 'TY003' },
    { label: 'CRS', value: 'TY004' }];
    this.regionName = this.authService.getUserAccessible().rName;
    this.godownName = this.authService.getUserAccessible().gName;
    this.GCode = this.authService.getUserAccessible().gCode;
    this.RCode = this.authService.getUserAccessible().rCode;
    this.chequeAmount = 0;
    this.paymentList = [{ label: 'Cash', value: 'CA' },
    { label: 'Cheque', value: 'CH' }, { label: 'Demand Draft', value: 'DA' }];
  }


  onSelect(type, id) {
    switch (id) {
      case 'rt':
        if (type === 'enter') {
          this.receivorTypePanel.overlayVisible = true;
        }
        break;
      case 'pay':
        if (type === 'enter') {
          this.paymentTypePanel.overlayVisible = true;
        }
        let paymentTypeList = [];
        paymentTypeList.push({ label: 'Cash', value: 'CA' },
          { label: 'Cheque', value: 'CH' }, { label: 'Demand Draft', value: 'DA' });
        this.paymentTypeOptions = paymentTypeList.slice(0);
        this.paymentTypeOptions.unshift({ label: '-select-', value: null });
        break;
    }
  }

  onLoadReceivor() {
    let receivorNameList = [];
    this.receivedFrom = null;
    const params = new HttpParams().set('TyCode', this.receivorType.value).append('TRType', '-').append('GCode', this.GCode).append('TRCode', '-');
    this.restApiService.getByParameters(PathConstants.DEPOSITOR_NAME_MASTER, params).subscribe((res: any) => {
      if (res !== null && res !== undefined && res.length !== 0) {
        res.forEach(rn => {
          receivorNameList.push({ 'label': rn.DepositorName, 'value': rn.DepositorCode });
        })
        this.receivedFromOptions = receivorNameList;
      }
    });
  }

  filterNames(event) {
    this.filteredNames = [];
    if (this.receivedFromOptions !== undefined && this.receivedFromOptions !== null &&
      this.receivedFromOptions.length !== 0) {
      for (let i = 0; i < this.receivedFromOptions.length; i++) {
        let name: any = this.receivedFromOptions[i];
        let code: string = this.receivedFromOptions[i].value;
        if (name.label.toString().toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
          this.filteredNames.push(name);
        }
      }
    }
  }

  onReceivorSelection(event) {
    if (event !== null) {
      this.receivorCode = event.value;
      this.receivedFrom = this.receivedFrom.label.toString().trim();
    }
  }

  onView() {
    this.ChequeReceiptNoData = [];
    this.viewPane = true;
    const params = new HttpParams().set('GCode', this.GCode).append('value', this.datepipe.transform(this.viewDate, 'MM/dd/yyyy')).append('Type', '1');
    this.restApiService.getByParameters(PathConstants.DD_CHEQUE_ENTRY_GET, params).subscribe((res: any) => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.ChequeReceiptNoData = res;
        let sno = 1;
        this.ChequeReceiptNoData.forEach(x => {
          x.SNo = sno;
          sno += 1;
        })
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage });
      }
    }, (err: HttpErrorResponse) => {
      // this.blockScreen = false;
      if (err.status === 0) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }
  onRowSelect(event) {
    this.receiptNo = event.data.receiptNo;
  }

  getDocByReceiptNo() {
    this.viewPane = false;
    this.isSelectedReceivor = true;
    this.DDChequeData = [];
    const params = new HttpParams().set('GCode', this.GCode).append('value', this.receiptNo).append('Type', '2');
    this.restApiService.getByParameters(PathConstants.DD_CHEQUE_ENTRY_GET, params).subscribe((res: any) => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.isViewed = true;
        this.isSaveSucceed = false;
        let sno = 1;
        res.forEach(x => {
          let paymentName;
          this.paymentList.forEach(y => {
            if (x.PaymentType === y.value) {
              paymentName = y.label;
            }
          })
          this.totalAmount += (x.Amount * 1);
          this.totalAmount = (this.totalAmount * 1).toFixed(2);
          this.DDChequeData.push({
            SNo: sno,
            PaymentType: x.PaymentType,
            Payment: paymentName,
            ChequeNo: x.ChequeNo,
            ChDate: this.datepipe.transform(x.ChequeDate, 'dd/MM/yyyy'),
            ChequeDate: this.datepipe.transform(x.ChequeDate, 'MM/dd/yyyy'),
            Amount: x.Amount,
            Bank: x.Bank,
            ReceivedFrom: x.ReceivedFrom,
            ReceivorCode: x.ReceivorCode,
            ReceiptDate: this.datepipe.transform(x.ReceiptDate, 'MM/dd/yyyy'),
            RowId: x.RowId,
            Flag: 'N'
          })
          sno += 1;
        });
        this.rowId = res[0].RowId;
        this.receivedFrom = res[0].ReceivedFrom;
        this.chequeDate = this.datepipe.transform(res[0].ChequeDate, 'dd/MM/yyyy');
        this.receiptNo = res[0].ReceiptNo;
        this.details = (res[0].Detail !== undefined && res[0].Detail !== null) ? res[0].Detail : '-';
        this.receiptDate = (res[0].ReceiptDate !== undefined && res[0].ReceiptDate !== null) ?
          this.datepipe.transform(res[0].ReceiptDate, 'dd/MM/yyyy') : new Date();
        this.ReceiptDt = this.datepipe.transform(res[0].ReceiptDate, 'MM/dd/yyyy');
      } else if (res.length === 0) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    }, (err: HttpErrorResponse) => {
      // this.blockScreen = false;
      if (err.status === 0) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }

  onEnter() {
    this.DDChequeData.push({
      PaymentType: (this.paymentType.value !== undefined && this.paymentType.value !== null) ? this.paymentType.value : null,
      Payment: (this.paymentType.label !== undefined && this.paymentType.label !== null) ? this.paymentType.label : this.paymentType,
      ChequeDate: this.datepipe.transform(this.chequeDate, 'MM/dd/yyyy'),
      ChDate: this.datepipe.transform(this.chequeDate, 'dd/MM/yyyy'),
      ChequeNo: this.chequeNo,
      ReceiptDate: (this.isViewed) ? this.ReceiptDt : ((typeof this.receiptDate === 'string') ? this.receiptDate : this.datepipe.transform(this.receiptDate, 'MM/dd/yyyy')),
      ReceivedFrom: (this.receivedFrom.label !== undefined && this.receivedFrom.label !== null) ? this.receivedFrom.label : this.receivedFrom,
      ReceivorCode: (this.receivorCode !== undefined && this.receivorCode !== null) ? this.receivorCode : '-',
      Amount: (this.chequeAmount * 1).toFixed(2),
      Bank: this.bank,
      Flag: 'N'
    })
    let sno = 1;
    this.totalAmount = 0;
    this.DDChequeData.forEach(i => {
      this.totalAmount += (i.Amount * 1);
      i.SNo = sno;
      sno += 1;
    });
    this.totalAmount = (this.totalAmount * 1).toFixed(2);
    if (this.DDChequeData.length !== 0) {
      this.paymentType = null;
      this.paymentTypeOptions = [];
      this.chequeAmount = 0;
      this.chequeDate = new Date();
      this.chequeNo = null;
      this.bank = null;
      this.receivorType = null;
      this.isSelectedReceivor = true;
    }
  }

  resetForm(ddChequeForm: NgForm) {
    ddChequeForm.form.markAsUntouched();
    ddChequeForm.form.markAsPristine();
  }

  onSave(type) {
    const params = {
      'Type': type,
      'GCode': this.GCode,
      'ReceiptNo': (this.receiptNo !== undefined && this.receiptNo !== null) ? this.receiptNo : 0,
      'Details': (this.details !== undefined && this.details !== null) ? this.details : '-',
      'GodownName': this.godownName,
      'RegionName': this.regionName,
      'UserID': this.UserID.user,
      'Total': this.totalAmount,
      'DDChequeItems': this.DDChequeData
    }
    this.restApiService.post(PathConstants.DD_CHEQUE_ENTRY_POST, params).subscribe((res: any) => {
      if (res.Item1) {
        this.onClear();
        if (type !== '2') {
          this.isSaveSucceed = true;
          this.isViewed = false;
        } else {
          this.isSaveSucceed = false;
          this.loadDocument();
          this.isViewed = false;
        }
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: res.Item2 });
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: res.Item2 });
      }
    }, (err: HttpErrorResponse) => {
      // this.blockScreen = false;
      if (err.status === 0) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }

  viewSelectedRow(data, index) {
    this.chequeAmount = (data.Amount * 1);
    this.totalAmount = ((this.totalAmount * 1) - (this.chequeAmount * 1));
    this.chequeNo = data.ChequeNo;
    this.chequeDate = data.ChequeDate;
    if (data.Payment !== undefined && data.Payment !== null) {
      this.paymentType = data.PaymentType;
      this.paymentTypeOptions = [{ label: data.PaymentType, value: data.Payment }];
    } else {
      let paymentType;
      this.paymentList.filter(x => {
        if (data.PaymentType === x.value)
          paymentType = x.value;
      })
      this.paymentType = data.PaymentType;
      this.paymentTypeOptions = [{ label: data.PaymentType, value: paymentType }];
    }
    this.bank = data.Bank;
    this.receivedFrom = data.ReceivedFrom;
    this.receivorCode = (data.ReceivorCode !== undefined && data.ReceivorCode !== null) ? data.ReceivorCode : '-';
    this.details = (data.Detail !== undefined && data.Detail !== null) ? data.Detail : '-';
    this.DDChequeData.splice(index, 1);
  }

  loadDocument() {
    const path = "../../assets/Reports/" + this.UserID.user + "/";
    const filename = this.GCode + GolbalVariable.DDChequeDocument;
    let filepath = path + filename + ".txt";
    var w = window.open(filepath);
    w.print();
    // this.http.get(filepath, { responseType: 'text' })
    //   .subscribe(data => {
    //     if (data !== undefined && data !== null) {
    //       var doc = new jsPDF({
    //         orientation: 'potrait',
    //       })
    //       doc.setFont('courier');
    //       doc.setFontSize(9);
    //       doc.text(data, 2, 2)
    //       doc.save(filename + '.pdf');
    //       // this.blockScreen = false;
    //     } else {
    //       // this.blockScreen = false;
    //       this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
    //     }
    //   }, (err: HttpErrorResponse) => {
    //     // this.blockScreen = false;
    //     if (err.status === 0) {
    //       this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
    //     }
    //   });
  }

  onPrint() {
    if (this.isViewed) {
      this.onSave('2');
    } else {
      this.loadDocument();
      this.isSaveSucceed = false;
      this.isViewed = false;
    }
  }

  onClear() {
    this.DDChequeData = []; this.ChequeReceiptNoData = []; this.paymentTypeOptions = [];
    this.receivorType = null; this.details = '-'; this.receiptDate = new Date();
    this.receiptNo = null; this.bank = null; this.paymentType = null;
    this.chequeDate = new Date(); this.chequeAmount = 0; this.totalAmount = 0;
    this.isSelectedReceivor = false; this.receivedFrom = null; this.chequeNo = null;
  }

}
