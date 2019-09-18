import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { Dropdown } from 'primeng/primeng';
import { StatusMessage } from 'src/app/constants/Messages';

@Component({
  selector: 'app-commodity-issue-memo',
  templateUrl: './commodity-issue-memo.component.html',
  styleUrls: ['./commodity-issue-memo.component.css']
})
export class CommodityIssueMemoComponent implements OnInit {
  commodityIssueMemoCols: any;
  commodityIssueMemoData: any = [];
  fromDate: any = new Date();
  toDate: any = new Date();
  data: any;
  RCode: any;
  GCode: any;
  ITCode: any;
  regionOptions: SelectItem[];
  godownOptions: SelectItem[];
  commodityOptions: SelectItem[];
  truckName: string;
  canShowMenu: boolean;
  maxDate: Date;
  loading: boolean;
  roleId: number;
  @ViewChild('godown') godownPanel: Dropdown;
  @ViewChild('region') regionPanel: Dropdown;
  @ViewChild('commodity') commodityPanel: Dropdown;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private messageService: MessageService, private authService: AuthService, private excelService: ExcelService, private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.commodityIssueMemoCols = this.tableConstants.CommodityIssueMemoReport;
    this.data = this.roleBasedService.getInstance();
    this.maxDate = new Date();
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
  }

  onSelect(item, type) {
    let regionSelection = [];
    let godownSelection = [];
    let commoditySelection = [];
    switch (item) {
      case 'reg':
        if (type === 'enter') { this.regionPanel.overlayVisible = true; }
        if (this.roleId === 3) {
          this.data = this.roleBasedService.instance;
          if (this.data !== undefined) {
            this.data.forEach(x => {
              regionSelection.push({ 'label': x.RName, 'value': x.RCode });
            });
            for (let i = 0; i < regionSelection.length - 1;) {
              if (regionSelection[i].value === regionSelection[i + 1].value) {
                regionSelection.splice(i + 1, 1);
              }
            }
          }
          this.regionOptions = regionSelection;
        } else {
          this.data = this.roleBasedService.regionsData;
          if (this.data !== undefined) {
            this.data.forEach(x => {
              regionSelection.push({ 'label': x.RName, 'value': x.RCode });
            });
          }
          this.regionOptions = regionSelection;
        }
        break;
      case 'gd':
        if (type === 'enter') { this.godownPanel.overlayVisible = true; }
        this.data = this.roleBasedService.instance;
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode });
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
        if (this.commodityOptions === undefined) {
          this.restAPIService.get(PathConstants.ITEM_MASTER).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                commoditySelection.push({ 'label': y.ITDescription, 'value': y.ITCode });
                this.commodityOptions = commoditySelection;
              });
            }
          })
        }
        break;
    }
  }

  onView() {
    this.messageService.clear();
    this.commodityIssueMemoData = [];
    this.checkValidDateSelection();
    this.loading = true;
    const params = {
      'FDate': this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'),
      'ToDate': this.datePipe.transform(this.toDate, 'MM/dd/yyyy'),
      'RCode': this.RCode,
      'GCode': this.GCode,
      'TRCode': this.ITCode
    }
    this.restAPIService.post(PathConstants.COMMODITY_ISSUE_MEMO_REPORT, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.commodityIssueMemoData = res;
        this.loading = false;
        let sno = 0;
        this.commodityIssueMemoData.forEach(data => {
          data.Issue_Date = this.datePipe.transform(data.Issue_Date, 'dd-MM-yyyy');
          data.Quantity = (data.Quantity * 1).toFixed(3);
          data.Lorryno = data.Lorryno.toString().toUpperCase();
          sno += 1;
          data.SlNo = sno;
        })
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

  onDateSelect(event) {
    this.checkValidDateSelection();
    this.onResetTable();
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

  onResetTable() {
    this.commodityIssueMemoData = [];
  }

  exportAsXLSX(): void {
    var CommodityIssueData = [];
    this.commodityIssueMemoData.forEach(data => {
      CommodityIssueData.push({
        SlNo: data.SlNo, Godownname: data.Godownname, Scheme: data.Scheme, Issue_Memono: data.Issue_Memono,
        Issue_Date: data.Issue_Date, Commodity: data.Commodity, Quantity: data.Quantity, Issuedto: data.Issuedto,
        Lorryno: data.Lorryno, Stackno: data.Stackno
      })
    });
    this.excelService.exportAsExcelFile(CommodityIssueData, 'COMMODITY_ISSUE_MEMO_REPORT', this.commodityIssueMemoCols);
  }

  onPrint() { }

}