import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { Dropdown } from 'primeng/primeng';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-society-abstract',
  templateUrl: './society-abstract.component.html',
  styleUrls: ['./society-abstract.component.css']
})
export class SocietyAbstractComponent implements OnInit {
  SocietyAbstractCols: any;
  SocietyAbstractData: any = [];
  fromDate: any = new Date();
  toDate: any = new Date();
  godownOptions: SelectItem[];
  regionOptions: SelectItem[];
  GCode: any;
  RCode: any;
  RName: any;
  GName: any;
  data: any;
  maxDate: Date;
  canShowMenu: boolean;
  loading: boolean = false;
  userId: any;
  regionsData: any;
  roleId: any;
  loggedInRCode: any;
  @ViewChild('godown') godownPanel: Dropdown;
  @ViewChild('region') regionPanel: Dropdown;


  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private authService: AuthService, private restAPIService: RestAPIService, private roleBasedService: RoleBasedService, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.SocietyAbstractCols = this.tableConstants.DoSocietyAbstract;
    this.data = this.roleBasedService.getInstance();
    this.maxDate = new Date();
    this.regionsData = this.roleBasedService.getRegions();
    this.RName = this.authService.getUserAccessible().rName;
    this.GName = this.authService.getUserAccessible().gName;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.maxDate = new Date();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.userId = JSON.parse(this.authService.getCredentials());
  }

  onSelect(item, type) {
    let godownSelection = [];
    let regionSelection = [];
    switch (item) {
      case 'reg':
        this.regionsData = this.roleBasedService.regionsData;
        if (type === 'enter') {
          this.regionPanel.overlayVisible = true;
        }
        if (this.roleId === 1) {
          if (this.regionsData !== undefined) {
            this.regionsData.forEach(x => {
              regionSelection.push({ 'label': x.RName, 'value': x.RCode });
            });
            this.regionOptions = regionSelection;
          }
        } else {
          if (this.regionsData !== undefined) {
            this.regionsData.forEach(x => {
              if (x.RCode === this.loggedInRCode) {
                regionSelection.push({ 'label': x.RName, 'value': x.RCode });
              }
            });
            this.regionOptions = regionSelection;
          }
        }
        break;
      case 'godown':
        if (type === 'enter') {
          this.godownPanel.overlayVisible = true;
        }
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode, 'rcode': x.RCode, 'rname': x.RName });
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
    this.checkValidDateSelection();
    this.loading = true;
    const params = {
      'FromDate': this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'),
      'ToDate': this.datePipe.transform(this.toDate, 'MM/dd/yyyy'),
      'GCode': this.GCode,
      'GName': this.GName,
      'RName': this.RName,
      'UserName': this.userId.user,
    };
    this.restAPIService.post(PathConstants.DELIVERY_ORDER_SOCIETY_ABSTRACT, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.SocietyAbstractData = res;
        this.loading = false;
        let sno = 0;
        this.SocietyAbstractData.forEach(data => {
          data.DoDate = this.datePipe.transform(data.DoDate, 'dd-MM-yyyy');
          data.AdvanceCollection = (data.AdvanceCollection * 1).toFixed(2);
          data.Debit = (data.Debit * 1).toFixed(2);
          sno += 1;
          data.SlNo = sno;
        });
      } else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    })
  }

  onDateSelect() {
    this.checkValidDateSelection();
  }

  checkValidDateSelection() {
    if (this.fromDate !== undefined && this.toDate !== undefined && this.fromDate !== '' && this.toDate !== '') {
      let selectedFromDate = this.fromDate.getDate();
      let selectedToDate = this.toDate.getDate();
      let selectedFromMonth = this.fromDate.getMonth();
      let selectedToMonth = this.toDate.getMonth();
      let selectedFromYear = this.fromDate.getFullYear();
      let selectedToYear = this.toDate.getFullYear();
      if ((selectedFromDate > selectedToDate && ((selectedFromMonth >= selectedToMonth && selectedFromYear >= selectedToYear) ||
        (selectedFromMonth === selectedToMonth && selectedFromYear === selectedToYear))) ||
        (selectedFromMonth > selectedToMonth && selectedFromYear === selectedToYear) || (selectedFromYear > selectedToYear)) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_INVALID, detail: StatusMessage.ValidDateErrorMessage });
        this.fromDate = this.toDate = '';
      }
      return this.fromDate, this.toDate;
    }
  }

  onResetTable(item) {
    if (item === 'reg') { this.GCode = null; }
    this.SocietyAbstractData = [];
  }

  onPrint() {
    const path = "../../assets/Reports/" + this.userId.user + "/";
    const filename = this.GCode + GolbalVariable.DOSocietyReportFileName + ".txt";
    saveAs(path + filename, filename);
  }
}
