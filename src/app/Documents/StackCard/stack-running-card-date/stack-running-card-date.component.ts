import { Component, OnInit, ViewChild } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { MessageService, SelectItem } from 'primeng/api';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { DatePipe } from '@angular/common';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { Dropdown } from 'primeng/primeng';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { StatusMessage } from 'src/app/constants/Messages';

@Component({
  selector: 'app-stack-running-card-date',
  templateUrl: './stack-running-card-date.component.html',
  styleUrls: ['./stack-running-card-date.component.css']
})
export class StackRunningCardDateComponent implements OnInit {
  canShowMenu: boolean;
  gdata: any;
  maxDate: Date;
  Date: Date;
  commodityOptions: SelectItem[];
  commoditySelection: any = [];
  RCode: string;
  GCode: string;
  GName: string;
  RName: string;
  ITCode: any;
  loading: boolean;
  stackRunningCardCols: any;
  stackRunningCardData: any = [];
  totalRecords: number;
  Remarks: string;
  SCDate: string;
  showPane: boolean;
  IsRequired: boolean;
  setFlag: boolean;
  // showDialog: boolean;
  StackNo: any;
  CurYear: any;
  RowId: any;
  runningCard: any;
  FromDate: string;
  Status: any;
  statusOptions: SelectItem[];
  @ViewChild('commodity', { static: false }) commodityPanel: Dropdown;

  constructor(private tableConstants: TableConstants, private messageService: MessageService,
    private datepipe: DatePipe, private restAPIService: RestAPIService,
    private roleBasedService: RoleBasedService, private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.gdata = this.roleBasedService.getInstance();
    const maxDate = new Date(JSON.parse(this.authService.getServerDate()));
    this.maxDate = (maxDate !== null && maxDate !== undefined) ? maxDate : new Date();
    this.Date = this.maxDate;
    if (this.commodityOptions === undefined) {
      this.restAPIService.get(PathConstants.ITEM_MASTER).subscribe(data => {
        if (data !== undefined) {
          data.forEach(y => {
            this.commoditySelection.push({ 'label': y.ITDescription, 'value': y.ITCode, 'group': y.GRName });
          });
          this.commodityOptions = this.commoditySelection;
          this.commodityOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        }
      })
    }
    this.GCode = this.authService.getUserAccessible().gCode;
    this.RCode = this.authService.getUserAccessible().rCode;
    this.RName = this.authService.getUserAccessible().rName;
    this.GName = this.authService.getUserAccessible().gName;
    this.stackRunningCardCols = this.tableConstants.RunningStackCardDetailsCols;
    this.statusOptions = [{ label: '-select-', value: null, disabled: true },
    { label: 'InActive', value: 0 }, { label: 'Active', value: 1 }]
  }

  onSelect(type) {
    if (type === 'tab') {
      this.commodityPanel.overlayVisible = true;
    }
    this.loading = true;
    const params = {
      'GCode': this.GCode,
      'ItemCode': this.ITCode.value,
      'Type': 2
    };
    this.restAPIService.post(PathConstants.STACK_CARD_DETAILS, params).subscribe((res: any) => {
      if (res !== null && res !== undefined && res.length !== 0) {
        let sno = 1;
        this.stackRunningCardData = res;
        this.stackRunningCardData.forEach(x => {
          x.SlNo = sno;
          sno += 1;
          x.StackBalanceWeight = (x.StackBalanceWeight * 1).toFixed(3);
          x.StackDate = this.datepipe.transform(x.StackDate, 'dd/MM/yyyy');
        })
        this.totalRecords = this.stackRunningCardData.length;
        for(let i = 0; i < this.stackRunningCardData.length; i ++) {
          if ((this.stackRunningCardData[i].Remarks === null || 
              this.stackRunningCardData[i].Remarks.toString().trim() === '') &&
              this.stackRunningCardData[i].FromDate !== null) {
              this.runningCard = this.stackRunningCardData[i].StackNo;
              this.setFlag = true;
              break;
            } else {
              this.setFlag = false;
              continue;
            }
        }
        this.loading = false;
      } else {
        this.refreshScreen();
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage });
      }
    }, (err: HttpErrorResponse) => {
      this.refreshScreen();
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }

  onRowSelect(event, data) {
    if(event !== null && event !== undefined && data !== undefined && data !== null) {
      if(data.FromDate === null && this.setFlag) {
        this.showPane = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, 
        summary: StatusMessage.SUMMARY_ERROR, life:5000,
        detail: this.runningCard + 'card is active for ' + this.ITCode.label +'. Please add reason for activating another card!' });
      } else if(data.FromDate !== null && (data.Remarks === null && data.Remarks.trim() === '') && this.setFlag){
        this.showPane = true;
        this.IsRequired = true;
        this.RowId = data.RowId;
        this.SCDate = this.datepipe.transform(data.FromDate, 'dd/MM/yyyy');
        this.FromDate = this.datepipe.transform(data.FromDate, 'MM/dd/yyyy');
        this.StackNo = data.StackNo;
        this.CurYear = data.CurYear;
        this.Remarks = data.Remarks;
      } else{
        this.showPane = true;
        this.FromDate = null;
        this.IsRequired = false;
        this.RowId = data.RowId;
        this.SCDate = this.datepipe.transform(this.maxDate, 'dd/MM/yyyy');
        this.StackNo = data.StackNo;
        this.CurYear = data.CurYear;
        this.Remarks = data.Remarks;
      }
    }
  }

  onSave() {
    this.showPane = false;
    const params = {
      'RowId': this.RowId,
      'CurYear': this.CurYear,
      'StackNo': this.StackNo,
      'FromDate': (this.FromDate !== null && this.FromDate !== undefined) ?
       this.FromDate : this.datepipe.transform(this.maxDate, 'MM/dd/yyyy'),
      'Remarks': (this.Remarks !== null && this.Remarks !== undefined) ? this.Remarks.trim() : '',
      'RCode': this.RCode,
      'GCode': this.GCode,
      'Status': this.Status
    }
    this.restAPIService.post(PathConstants.STACK_DAY_TO_DAY_POST, params).subscribe(res => {
      if(res.Item1) {
        this.refreshScreen();
        this.loading = true;
        setTimeout(() => this.loading = false, 1000); 
        this.onSelect('');
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.SuccessMessage });
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.NetworkErrorMessage
        });
      }
    });

  }

  refreshScreen() {
    this.loading = false;
    this.stackRunningCardData = [];
    this.totalRecords = 0;
    this.showPane = false;
    this.IsRequired = false;
    this.FromDate = null;
    this.RowId = null; this.StackNo = null;
    this.CurYear = null; this.Remarks = null;
  }

  onClose() {
    this.messageService.clear('t-err');
  }
}
