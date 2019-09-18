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
import { StatusMessage } from 'src/app/constants/Messages';
import { Dropdown } from 'primeng/primeng';

@Component({
  selector: 'app-demand-draft',
  templateUrl: './demand-draft.component.html',
  styleUrls: ['./demand-draft.component.css']
})
export class DemandDraftComponent implements OnInit {

  DemandDraftCols: any;
  DemandDraftData: any = [];
  fromDate: any = new Date();
  toDate: any = new Date();
  godownOptions: SelectItem[];
  GCode: any;
  regionOptions: SelectItem[];
  RCode: any;
  roleId: any;
  regions: any;
  data: any;
  maxDate: Date;
  canShowMenu: boolean;
  isShowErr: boolean;
  loading: boolean = false;
  @ViewChild('godown') godownPanel: Dropdown;
  @ViewChild('region') regionPanel: Dropdown;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private authService: AuthService, private excelService: ExcelService,
    private restAPIService: RestAPIService, private roleBasedService: RoleBasedService,
    private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.DemandDraftCols = this.tableConstants.DoDemandDraft;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.regions = this.roleBasedService.getRegions(); this.data = this.roleBasedService.getInstance();
    this.maxDate = new Date();
  }

  onSelect(item, type) {
    let regionSelection = [];
    let godownSelection = [];
    switch (item) {
      case 'reg':
        if (type === 'enter') {
          this.regionPanel.overlayVisible = true;
        }
        if (this.roleId === 3) {
          this.regions = this.roleBasedService.instance;
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
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
          this.regions = this.roleBasedService.regionsData;
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              regionSelection.push({ 'label': x.RName, 'value': x.RCode });
            });
          }
          this.regionOptions = regionSelection;
        }
        break;
      case 'gd':
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
    };
    this.restAPIService.post(PathConstants.DEMAND_DRAFT_POST, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.DemandDraftData = res;
        this.loading = false;
        let sno = 0;
        this.DemandDraftData.forEach(data => {
          data.Chequedate = this.datePipe.transform(data.Chequedate, 'dd-MM-yyyy');
          data.Dodate = this.datePipe.transform(data.Dodate, 'dd-MM-yyyy');
          data.Nkgs = (data.Nkgs * 1).toFixed(3);
          sno += 1;
          data.SlNo = sno;
        });
      } else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
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
    if (item === 'reg') { this.GCode = null; }
    this.DemandDraftData = [];
  }

  exportAsXLSX(): void {
    var DemandDraftData = [];
    this.DemandDraftData.forEach(data => {
      DemandDraftData.push({ SlNo: data.SlNo, Society: data.Society, Dono: data.Dono, Dodate: data.Dodate, Chequeno: data.Chequeno, Chequedate: data.Chequedate, Bank: data.Bank, PaymentAmount: data.PaymentAmount, Cereal: data.Cereal, NonCereal: data.NonCereal });
    });
    this.excelService.exportAsExcelFile(DemandDraftData, 'DO_DEMAND_DRAFT_DATA', this.DemandDraftCols);
  }

  onPrint() { }
}