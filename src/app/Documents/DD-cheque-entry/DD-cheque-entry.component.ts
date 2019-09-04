import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { SelectItem, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { StatusMessage } from 'src/app/constants/Messages';

@Component({
  selector: 'app-DD-cheque-entry',
  templateUrl: './DD-cheque-entry.component.html',
  styleUrls: ['./DD-cheque-entry.component.css']
})
export class DDChequeEntryComponent implements OnInit {
  DDChequeCols: any;
  DDChequeData: any = [];
  CashReceiptData: any = [];
  ChequeReceiptNoCols: any;
  ChequeReceiptNoData: any = [];
  receiptDate: any = new Date();
  receiptNo: any;
  canShowMenu: boolean;
  maxDate: Date = new Date();
  paymentTypeOptions: SelectItem[];
  paymentType: any;
  rowId: any = 0;
  receivedFromOptions: SelectItem[];
  receivorTypeOptions: SelectItem[];
  receivedFrom: any;
  filteredNames: any[];
  chequeDate: any = new Date();
  bank: any;
  chequeAmount: any;
  chequeNo: any;
  SocietyChecked: boolean;
  data: any;
  UserID: any;
  regionName: any;
  godownName: any;
  amount : any;
  GCode: any;
  RCode: any;
  viewDate: Date = new Date();
  viewPane: boolean;
  receivorType: any;
  receivorCode: any;
  details: any = '-';

  constructor(private tableConstants: TableConstants, private restApiService: RestAPIService,
    private authService: AuthService, private datepipe: DatePipe,
    private roleBasedService: RoleBasedService, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.DDChequeCols = this.tableConstants.DDChequeEntryCols;
    this.ChequeReceiptNoCols = this.tableConstants.ChequeReceiptNoCols;
    this.data = this.roleBasedService.getInstance();
    this.UserID = JSON.parse(this.authService.getCredentials());
    this.paymentTypeOptions = [{ label: '-select-', value: null }, { label: 'Cash', value: 'CA' },
    { label: 'Cheque', value: 'CH' }, { label: 'Demand Draft', value: 'DA' }];
    this.receivorTypeOptions = [{ label: '-select-', value: null }, { label: 'BULK CONSUMERS', value: 'TY001' },
    { label: 'COOPERATIVES LEADING', value: 'TY002' }, { label: 'COOPERATIVES PRIMARY', value: 'TY003' },
    { label: 'CRS', value: 'TY004' }];
    setTimeout(() => {
      this.regionName = this.data[0].RName;
      this.godownName = this.data[0].GName;
      this.GCode = this.data[0].GCode;
      this.RCode = this.data[0].RCode;
    }, 1200);
  }

  onLoadReceivor() {
    let receivorNameList = [];
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
    if (this.receivorTypeOptions !== undefined && this.receivorTypeOptions !== null &&
      this.receivorTypeOptions.length !== 0) {
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
    this.viewPane = true;
    const params = new HttpParams().set('GCode', this.GCode).append('value', this.datepipe.transform(this.viewDate, 'MM/dd/yyyy')).append('Type','1');
    this.restApiService.getByParameters(PathConstants.DD_CHEQUE_ENTRY_GET, params).subscribe((res: any) => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.ChequeReceiptNoData = res;
      } else {
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage });
      }
    }, (err: HttpErrorResponse) => {
      // this.blockScreen = false;
      if (err.status === 0) {
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }
  onRowSelect(event) {
    this.receiptNo = event.data.receiptNo;
  }
  getDocByReceiptNo() {
    const params = new HttpParams().set('GCode', this.GCode).append('value', this.receiptNo).append('Type','2');
    this.restApiService.getByParameters(PathConstants.DD_CHEQUE_ENTRY_GET, params).subscribe((res: any) => {
      if (res !== undefined && res !== null && res.length !== 0) {
        // this.ChequeReceiptNoData = res;
      } else {
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    }, (err: HttpErrorResponse) => {
      // this.blockScreen = false;
      if (err.status === 0) {
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }
  onEnter() {
    this.CashReceiptData = [];
    this.DDChequeData.push({
      PaymentType: this.paymentType.value,
      PayName: this.paymentType.label,
      ChequeDate: this.datepipe.transform(this.chequeDate, 'dd/MM/yyyy'),
      ChequeNo: this.chequeNo,
      ReceiptDate: this.datepipe.transform(this.receiptDate, 'MM/dd/yyyy'),
      ReceivedFrom: (this.receivedFrom.label !== undefined && this.receivedFrom.label !== null) ? this.receivedFrom.label : this.receivedFrom,
      ReceivorCode: (this.receivorCode !== undefined && this.receivorCode !== null) ? this.receivorCode : '-',
      Amount: (this.chequeAmount * 1).toFixed(2),
      Bank: this.bank,
    })
    this.CashReceiptData.push({
      PaymentType: this.paymentType.value,
      ChequeDate: this.datepipe.transform(this.chequeDate, 'dd/MM/yyyy'),
      ChequeNo: this.chequeNo,
      ReceiptDate: this.datepipe.transform(this.receiptDate, 'MM/dd/yyyy'),
      ReceivedFrom: (this.receivedFrom.label !== undefined && this.receivedFrom.label !== null) ? this.receivedFrom.label : this.receivedFrom,
      ReceivorCode: (this.receivorCode !== undefined && this.receivorCode !== null) ? this.receivorCode : '-',
      Amount: this.chequeAmount,
      Bank: this.bank,
      Flag: 'N'
    })
    if (this.DDChequeData.length !== 0) {
      this.paymentType = null; 
      this.paymentTypeOptions = [];
      this.chequeAmount = 0; 
      this.chequeDate = new Date();
      this.chequeNo = null; 
      this.bank = null;
      this.receivorType = null; 
      this.receivedFrom = null;
     
    }
   
  }

  onClear() {
    this.CashReceiptData = []; this.DDChequeData = []; this.ChequeReceiptNoData = [];
    this.receivorType = null; this.details = '-';
  }

  onSave()
  {
    const params = {
      'GCode': this.GCode,
      'ReceiptNo': (this.receiptNo !== undefined && this.receiptNo !== null) ? this.receiptNo : 0,
      'Details': (this.details !== undefined && this.details !== null) ? this.details : '-',
      'GodownName' : this.godownName,
      'RegionName' : this.regionName,
      'UserID' : this.UserID.user,
      'Total' : "12345",
      'DDChequeItems': this.CashReceiptData
    }
    this.restApiService.post(PathConstants.DD_CHEQUE_ENTRY_POST, params).subscribe((res: any) => {
      if (res.Item1) {
        this.onClear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: res.Item2 });
      } else {
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: res.Item2 });
      }
    }, (err: HttpErrorResponse) => {
      // this.blockScreen = false;
      if (err.status === 0) {
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }



  viewSelectedRow(data, index) {
    this.chequeAmount = (data.Amount * 1);
    this.chequeNo = data.ChequeNo;
    this.chequeDate = data.ChequeDate;
    this.paymentType = data.PayName;
    this.paymentTypeOptions = [{ label: data.PayName, value: data.PaymentType }];
    this.bank = data.Bank;
    this.receivedFrom = data.ReceivedFrom;
    this.DDChequeData.splice(index, 1);
  }
}
