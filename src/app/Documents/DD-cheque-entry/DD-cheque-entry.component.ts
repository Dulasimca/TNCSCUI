import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
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
  GCode: any;
  RCode: any;
  viewDate: Date = new Date();
  viewPane: boolean;

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
    this.receivorTypeOptions = [{ label: 'BULK CONSUMERS', value: 'TY001' },
    { label: 'COOPERATIVES LEADING', value: 'TY002' }, { label: 'COOPERATIVES PRIMARY', value: 'TY003' },
    { label: 'CRS', value: 'TY004' }];
    setTimeout(() => {
      this.regionName = this.data[0].RName;
      this.godownName = this.data[0].GName;
      this.GCode = this.data[0].GCode;
      this.RCode = this.data[0].RCode;
    }, 1200);
  }

  onSelect() {
    let receivorNameList = [];
    const params = new HttpParams().set('TyCode', this.receivedFrom.value).append('TRType', '-').append('GCode', this.GCode).append('TRCode', '-');
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
    for (let i = 0; i < this.receivedFromOptions.length; i++) {
      let name = this.receivedFromOptions[i].label;
      if (name.toString().toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
        this.filteredNames.push(name);
      }
    }
  }

  onView() {
    this.viewPane = true;
    const params = new HttpParams().set('GCode', this.GCode).append('value', this.datepipe.transform(this.viewDate, 'MM/dd/yyyy'));
    this.restApiService.getByParameters(PathConstants.DD_CHEQUE_ENTRY_GET, params).subscribe(res => {
      if(res !== undefined && res !== null && res.length !== 0){
        this.ChequeReceiptNoData = res;
      } else {
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage });
      }
    },(err: HttpErrorResponse) => {
      // this.blockScreen = false;
       if (err.status === 0) {
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }

  onEnter() {
    this.DDChequeData.push({
      paymentType: this.paymentType.label,
      chequeDate: this.datepipe.transform(this.chequeDate, 'dd/MM/yyyy'),
      chequeNo: this.chequeNo,
      amount: this.chequeAmount,
      bank: this.bank, receivedFrom: this.receivedFrom
    })
  }

  getDocByReceiptNo(index, data) {
  }


}
