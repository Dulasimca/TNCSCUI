import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { Dropdown } from 'primeng/primeng';
import { NgForm } from '@angular/forms';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { DatePipe } from '@angular/common';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-stack-card-correction',
  templateUrl: './stack-card-correction.component.html',
  styleUrls: ['./stack-card-correction.component.css']
})
export class StackCardCorrectionComponent implements OnInit {
  data = [];
  canShowMenu: boolean;
  maxDate: Date;
  yearOptions: SelectItem[];
  commodityOptions: SelectItem[];
  regionOptions: SelectItem[];
  stackOptions: SelectItem[];
  StackCardCorrectionCols: any;
  StackCardCorrectionData: any = [];
  CurYear: any;
  Commodity: any;
  StackCard: any;
  StackDetail: any = [];
  RowId: any;
  GCode: any;
  RCode: any;
  RegionName: any;
  GodownName: any;
  Reason: any;
  roleId: number;
  regions: any;
  viewPane: boolean;
  loading: boolean;
  regionData: any;
  fromDate: any;
  toDate: any;
  isViewed: boolean = false;
  isEdited: boolean = false;
  SaveEnable: boolean = false;
  ReasonEnable: boolean = false;
  blockScreen: boolean;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;
  @ViewChild('year', { static: false }) yearPanel: Dropdown;
  @ViewChild('commodity', { static: false }) commodityPanel: Dropdown;
  @ViewChild('stack', { static: false }) stackPanel: Dropdown;
  @ViewChild('f', { static: false }) CSForm: NgForm;

  constructor(private restApiService: RestAPIService, private authService: AuthService, private messageService: MessageService,
    private datepipe: DatePipe, private tableConstants: TableConstants, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.RCode = this.authService.getUserAccessible().rCode;
    this.GCode = this.authService.getUserAccessible().gCode;
    this.RegionName = this.authService.getUserAccessible().rName;
    this.GodownName = this.authService.getUserAccessible().gName;
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.regionData = this.roleBasedService.getRegions();
    // this.StackCardCorrectionCols = this.tableConstants.StackCorrectionColumns;
    const maxDate = new Date(JSON.parse(this.authService.getServerDate()));
    this.maxDate = (maxDate !== null && maxDate !== undefined) ? maxDate : new Date();
    this.fromDate = this.maxDate;
    this.toDate = this.maxDate;
  }

  onSelect(item, type) {
    let yearSelection = [];
    let regionSelection = [];
    let commoditySelection = [];
    let stackSelection = [];
    switch (item) {
      case 'reg':
        this.regionData = this.roleBasedService.regionsData;
        if (type === 'tab') {
          this.regionPanel.overlayVisible = true;
        }
        if (this.regionData !== undefined) {
          this.regionData.forEach(x => {
            regionSelection.push({ 'label': x.RName, 'value': x.RCode });
          });
          this.regionOptions = regionSelection;
        }
        break;
      case 'y':
        if (type === 'enter') {
          this.yearPanel.overlayVisible = true;
        }
        if (this.yearOptions === undefined) {
          this.restApiService.get(PathConstants.STACK_YEAR).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                yearSelection.push({ 'label': y.ShortYear });
              });
              this.yearOptions = yearSelection;
              // this.yearOptions.unshift({ label: '-select-', value: null, disabled: true });
            }
          });
        }
        break;
      case 'commodity':
        if (type === 'enter') {
          this.commodityPanel.overlayVisible = true;
        }
        if (this.commodityOptions === undefined) {
          this.restApiService.get(PathConstants.ITEM_MASTER).subscribe(res => {
            if (res !== undefined) {
              res.forEach(s => {
                commoditySelection.push({ 'label': s.ITDescription, 'value': s.ITCode });
              });
              this.commodityOptions = commoditySelection;
            }
          });
        }
        break;
      case 'stack':
        if (type === 'enter') {
          this.stackPanel.overlayVisible = true;
        }
        if (this.stackOptions === undefined && this.commodityOptions !== undefined && this.yearOptions !== undefined) {
          const params = {
            'Type': 2,
            'GCode': this.GCode,
            'ItemCode': this.Commodity.value
          };
          this.restApiService.post(PathConstants.STACK_OPENING_BALANCE_DETAIL_POST, params).subscribe(res => {
            if (res !== undefined) {
              // this.StackDetail = res;
              this.StackDetail = res.filter(x => { return x.CurYear === this.CurYear.label });
              this.StackDetail.forEach(st => {
                stackSelection.push({ 'label': st.StackNo });
              });
              this.stackOptions = stackSelection;
            }
          });
        }
    }
  }

  onView() {
    this.loading = true;
    const params = {
      'RCode': this.RCode,
      'GCode': this.GCode,
      'StackNo': this.StackCard.label,
      'CurYear': this.CurYear.label
    };
    this.restApiService.getByParameters(PathConstants.STACK_CARD_GET, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.StackCardCorrectionCols = this.tableConstants.StackCardMaster;
        this.StackCardCorrectionData = res;
        // this.FilteredArray = res;
        let sno = 0;
        this.StackCardCorrectionData.forEach(ss => {
          this.RowId = ss.RowId;
          sno += 1;
          ss.SlNo = sno;
        });
        this.loading = false;
      } else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination
        });
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
    });
  }

  onRow(event, selectedRow) {
    this.isEdited = true;
    this.isViewed = false;
    this.RowId = selectedRow.RowId;
    // if (this.RowId !== undefined && this.Reason !== undefined) { this.SaveEnable = true };
    (this.Reason !== undefined && this.Reason !== null) ? this.ReasonEnable = true : this.ReasonEnable = false;
    this.SaveEnable = true;
  }

  onClear() {
    this.commodityOptions = this.yearOptions = this.stackOptions = undefined;
    this.CurYear = this.RowId = this.Commodity = this.StackCard = this.Reason = null;
    this.StackCardCorrectionData = undefined;
    this.SaveEnable = this.ReasonEnable = false;
    this.loading = false;
  }

  onResetTable(item) {
    if (item === 'reg') { this.GCode = null; }
    if (item === 'stack') {
      this.StackCard = null;
      this.stackOptions = undefined;
    }
  }

  onSave() {
    this.blockScreen = true;
    const params = {
      'Type': 1,
      'DocNo': this.RowId,
      'GCode': this.GCode,
      'RCode': this.RCode,
      'DocType': 5,
      'RoleId': this.roleId,
      'Reason': (this.Reason !== null && this.Reason !== undefined) ? this.Reason : ''
    };
    this.restApiService.post(PathConstants.DOCUMENT_CORRECTION_POST, params).subscribe((res: any) => {
      if (res.Item1) {
        this.blockScreen = false;
        this.onClear();
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: StatusMessage.SEVERITY_SUCCESS,
          summary: StatusMessage.SUMMARY_SUCCESS, detail: res.Item2
        });
      } else {
        this.blockScreen = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: res.Item2
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
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.NetworkErrorMessage
        });
      }
    });
    this.SaveEnable = false;
  }

  onClose() {
    this.messageService.clear('t-err');
  }
}
