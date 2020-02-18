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
  ITCode: string;
  loading: boolean;
  stackRunningCardCols: any;
  stackRunningCardData: any = [];
  totalRecords: number;
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
  }

  onSelect(type) {
    if (type === 'tab') {
      this.commodityPanel.overlayVisible = true;
    }
    this.loading = true;
    const params = {
      'GCode': this.GCode,
      'ItemCode': this.ITCode,
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

  }

  refreshScreen() {
    this.loading = false;
    this.stackRunningCardData = [];
    this.totalRecords = 0;
  }

  onClose() {
    this.messageService.clear('t-err');
  }
}
