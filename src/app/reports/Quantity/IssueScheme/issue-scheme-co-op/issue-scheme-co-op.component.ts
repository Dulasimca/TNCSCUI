import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { Dropdown } from 'primeng/primeng';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-issue-scheme-co-op',
  templateUrl: './issue-scheme-co-op.component.html',
  styleUrls: ['./issue-scheme-co-op.component.css']
})
export class IssueSchemeCoOpComponent implements OnInit {
  issueSchemeCoOpCols: any;
  issueSchemeCoOpData: any = [];
  fromDate: any = new Date();
  toDate: any = new Date();
  godownOptions: SelectItem[];
  regionOptions: SelectItem[];
  region: any;
  selectedValues: any;
  GCode: any;
  RCode: any;
  data: any;
  regions: any;
  maxDate: Date;
  canShowMenu: boolean;
  loading: boolean = false;
  roleId: any;
  userId: any;
  loggedInRCode: any;
  @ViewChild('godown') godownPanel: Dropdown;
  @ViewChild('region') regionPanel: Dropdown;

  constructor(private datePipe: DatePipe, 
    private authService: AuthService, private excelService: ExcelService,
    private restAPIService: RestAPIService, private roleBasedService: RoleBasedService, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.data = this.roleBasedService.getInstance();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.regions = this.roleBasedService.getRegions();
    this.userId = JSON.parse(this.authService.getCredentials());
    this.maxDate = new Date();
  }

  onSelect(item, type) {
    let regionSelection = [];
    let godownSelection = [];
    switch (item) {
      case 'reg':
          this.regions = this.roleBasedService.regionsData;
          if (type === 'enter') {
            this.regionPanel.overlayVisible = true;
          }
          if (this.roleId === 1) {
            if (this.regions !== undefined) {
              this.regions.forEach(x => {
                regionSelection.push({ 'label': x.RName, 'value': x.RCode });
              });
              this.regionOptions = regionSelection;
            }
          } else {
            if (this.regions !== undefined) {
              this.regions.forEach(x => {
                if(x.RCode === this.loggedInRCode) {
                regionSelection.push({ 'label': x.RName, 'value': x.RCode });
                }
              });
              this.regionOptions = regionSelection;
            }
          }
        break;
      case 'gd':
        if (type === 'enter') {
          this.regionPanel.overlayVisible = true;
        }
        this.data = this.roleBasedService.instance;
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode.value) {
               godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            }
          });
          this.godownOptions = godownSelection;
        } else {
          this.godownOptions = godownSelection;
        }
        break;
    }
  }

  onView() {
    this.checkValidDateSelection();
    this.loading = true;
    const params = {
      FromDate: this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'),
      ToDate: this.datePipe.transform(this.toDate, 'MM/dd/yyyy'),
      GCode: this.GCode.value,
      RCode: this.RCode.value,
      UserId: this.userId.user,
      RName: this.RCode.label,
      GName: this.GCode.label
    };
    this.restAPIService.post(PathConstants.QUANTITY_ACCOUNT_ISSUE_SCHEME_SOCIETY_REPORT, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.loading = false;
        let columns: Array<any> = [];
        for (var i in res[0]) {
          columns.push({ header: i, field: i });
        }
        columns.unshift({ header: 'S.No:', field: 'sno' });
        let index = columns.length;
        columns.splice(index, 0, { field: 'Total', header: 'TOTAL' });
        this.issueSchemeCoOpCols = columns;
        this.issueSchemeCoOpData = res;
        let sno = 1;
        this.issueSchemeCoOpData.forEach(data => {
          data.sno = sno;
          sno += 1;
        });
        for (let i = 0; i < this.issueSchemeCoOpData.length; i++) {
          let total = 0;
          this.issueSchemeCoOpCols.forEach(x => {
            let field = x.field;
            if((typeof this.issueSchemeCoOpData[i][field] !== 'string') && field !== 'sno') {

            // if (field !== 'COMMODITY' && field !== 'PACKINGNAME' && field !== 'sno') {
              total += (((this.issueSchemeCoOpData[i][field] !== null && this.issueSchemeCoOpData[i][field] !== undefined) ?
                this.issueSchemeCoOpData[i][field] : 0) * 1);
            // }
          }
          })
          this.issueSchemeCoOpData[i].Total = total;
        }
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
    });
  }

  onDateSelect() {
    this.checkValidDateSelection();
    this.onResetTable('');
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
    if(item === 'reg') { this.GCode = null; }
    this.issueSchemeCoOpData = [];
  }

  exportAsXLSX():void{
    this.excelService.exportAsExcelFile(this.issueSchemeCoOpData, 'SCHEME_ABSTRACT_ISSUE_COOP',this.issueSchemeCoOpCols);
}

onPrint() {
  const path = "../../assets/Reports/" + this.userId.user + "/";
  const filename = this.GCode.value + GolbalVariable.QuantityACForIssueSchemeCOOP + ".txt";
  saveAs(path + filename, filename);
}
}