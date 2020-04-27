import { Component, OnInit, ViewChild } from '@angular/core';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { DatePipe } from '@angular/common';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { MessageService, SelectItem } from 'primeng/api';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpErrorResponse } from '@angular/common/http';
import { StatusMessage } from 'src/app/constants/Messages';
import { Dropdown } from 'primeng/primeng';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { saveAs } from 'file-saver';
import { ExcelService } from 'src/app/shared-services/excel.service';

@Component({
  selector: 'app-quantity-detail-commodity',
  templateUrl: './quantity-detail-commodity.component.html',
  styles: [`
  .loading-text {
      display: block;
      background-color: #f1f1f1;
      min-height: 19px;
      animation: pulse 1s infinite ease-in-out;
      text-indent: -99999px;
      overflow: hidden;
  }
`],
  styleUrls: ['./quantity-detail-commodity.component.css']
})
export class QuantityDetailCommodityComponent implements OnInit {
  QtyReceiptCols: any;
  QtyReceiptData: any = [];
  frozenQtyReceiptCols: any;
  QtyIssueCols: any;
  frozenQtyIssueCols: any;
  QtyIssueData: any[] = [];
  fromDate: any = new Date();
  toDate: any = new Date();
  godownOptions: SelectItem[];
  regionOptions: SelectItem[];
  GCode: any;
  RCode: any;
  roleId: any;
  data: any;
  regions: any;
  maxDate: Date;
  canShowMenu: boolean;
  loading: boolean = false;
  loggedInRCode: string;
  userId: any;
  // showIssueDetails: boolean;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private authService: AuthService, private excelService: ExcelService,
    private restAPIService: RestAPIService, private roleBasedService: RoleBasedService, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.QtyReceiptCols = this.tableConstants.QuantityACReceiptDetailsCommodity;
    this.frozenQtyReceiptCols = this.tableConstants.FrozenQuantityACReceiptDetailsCommodity;
    this.QtyIssueCols = this.tableConstants.QuantityACIssueDetailsCommodity;
    this.frozenQtyIssueCols = this.tableConstants.FrozenQuantityACIssueDetailsCommodity;
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.data = this.roleBasedService.getInstance();
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
            this.regionOptions.unshift({ label: 'All', value: 'All' });
          }
        } else {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              if (x.RCode === this.loggedInRCode) {
                regionSelection.push({ 'label': x.RName, 'value': x.RCode });
              }
            });
            this.regionOptions = regionSelection;
          }
        }
        break;
      case 'gd':
        if (type === 'enter') {
          this.godownPanel.overlayVisible = true;
        }
        this.data = this.roleBasedService.instance;
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode.value) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            }
          });
          this.godownOptions = godownSelection;
          if (this.roleId !== 3) {
            this.godownOptions.unshift({ label: 'All', value: 'All' });
          }
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
    this.restAPIService.post(PathConstants.QUANTITY_RECISS_COMMODITY_POST, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.QtyReceiptData = res;
        this.QtyIssueData = res;
        this.loading = false;
        let r_sno = 0;
        let i_sno = 0;
        this.QtyReceiptData.forEach(data => {
          r_sno += 1;
          data.SlNo = r_sno;
        });
        this.QtyIssueData.forEach(data => {
          i_sno += 1;
          data.SlNo = i_sno;
        });
      } else {
        this.loading = false;
        this.QtyIssueData.length = 0;
        this.QtyReceiptData.length = 0;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.QtyIssueData.length = 0;
        this.QtyReceiptData.length = 0;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
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
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR, life: 5000,
          summary: StatusMessage.SUMMARY_INVALID, detail: StatusMessage.ValidDateErrorMessage
        });
        this.fromDate = this.toDate = '';
      }
      return this.fromDate, this.toDate;
    }
  }

  onResetTable(item) {
    if (item === 'reg') { this.GCode = null; }
    this.QtyReceiptData = [];
    this.QtyIssueData = [];
  }

  exportExcel(type) {
    let data = [];
    let cols = [];
    if (type === '1') {
      this.QtyReceiptData.forEach(el => {
        data.push({
          GName: el.GName, Commodity: el.Commodity, OpeningBalance: (el.OpeningBalance * 1),
          RecPDS: (el.RecPDS * 1), RecPRIORITY: (el.RecPRIORITY * 1), RecTIDEOVER: (el.RecTIDEOVER * 1), RecAAY: (el.RecAAY * 1),
          RecSPLPDS: (el.RecSPLPDS * 1), RecCEMENT: (el.RecCEMENT * 1), RecHOPURCHASE: (el.RecHOPURCHASE * 1),
          RecSEIZUR: (el.RecSEIZUR * 1), Total: (el.Total * 1), RecPTMGRNMP: (el.RecPTMGRNMP * 1), RecSGRY: (el.RecSGRY * 1),
          RecANNAPURNA: (el.RecANNAPURNA * 1), TotalFreeRice: (el.TotalFreeRice * 1), RecRECEIVEDFROM: (el.RecRECEIVEDFROM * 1),
          RecTRANSFERWITHINREGION: (el.RecTRANSFERWITHINREGION * 1), RecTRANSFEROTHERREGION: (el.RecTRANSFEROTHERREGION * 1),
          RecEXCESS: (el.RecEXCESS * 1), RecCLEANINGANDPACKING: (el.RecCLEANINGANDPACKING * 1),
          RecVCFLOOD: (el.RecVCFLOOD * 1), RecSALESRETURN: (el.RecSALESRETURN * 1), TotalReceipt: (el.TotalReceipt * 1),
          TotalOtherReceipt: (el.TotalOtherReceipt * 1), GrandTotalReceipt: (el.GrandTotalReceipt * 1)
        });
      });
      cols = this.tableConstants.FrozenQuantityACReceiptDetailsCommodity + this.tableConstants.QuantityACReceiptDetailsCommodity;
      this.excelService.exportAsExcelFile(data, 'QTY_AC_RECEIPT_COMMODITY_REPORT', cols);
    } else {
      this.QtyIssueData.forEach(el => {
        data.push({
          GName: el.GName, Commodity: el.Commodity, OpeningBalance: (el.OpeningBalance * 1),
          IsPDS: (el.IsPDS * 1), IsCOOP: (el.IsCOOP * 1), IsPOLICE: (el.IsPOLICE * 1), IsNMP: (el.IsNMP * 1),
          IsBULK: (el.IsBULK * 1), IsCREDIT: (el.IsCREDIT * 1), IsOAP: (el.IsOAP * 1), IsSRILANKA: (el.IsSRILANKA * 1),
          IsAAY: (el.IsAAY * 1), IsSPLPDS: (el.IsSPLPDS * 1), IsPDSCOOP: (el.IsPDSCOOP * 1), IsCEMENTFLOOD: (el.IsCEMENTFLOOD * 1),
          IsTotalSales: (el.IsTotalSales * 1), IsPTMGR: (el.IsPTMGR * 1), IsSGRY: (el.IsSGRY * 1), IsANNAPOORNA: (el.IsANNAPOORNA * 1),
          IsTotalFreeRiceIssues: (el.IsTotalFreeRiceIssues * 1), IsISSUESTOPROCESSING: (el.IsISSUESTOPROCESSING * 1),
          IsTRANSFERWITHINREGION: (el.IsTRANSFERWITHINREGION * 1), IsTRANSFEROTHERREGION: (el.IsTRANSFEROTHERREGION * 1),
          IsWRITEOFF: (el.IsWRITEOFF * 1), IsCLEANING: (el.IsCLEANING * 1), IsVCBLG: (el.IsVCBLG * 1),
          IsPURCHASERETURN: (el.IsPURCHASERETURN * 1), IsTotalOtherIssues: (el.IsTotalOtherIssues * 1),
          IsTotalIssues: (el.IsTotalIssues * 1), IsBalanceQty: (el.IsBalanceQty * 1)
        });
      });
      cols = this.tableConstants.FrozenQuantityACIssueDetailsCommodity + this.tableConstants.QuantityACIssueDetailsCommodity;
      this.excelService.exportAsExcelFile(data, 'QTY_AC_ISSUE_COMMODITY_REPORT', cols);
    }
  }

  onPrint() {
    const path = "../../assets/Reports/" + this.userId.user + "/";
    const filename = this.GCode.value + GolbalVariable.QuantityACForReceiptDetailCommodity + ".txt";
    saveAs(path + filename, filename);
  }

  onClose() {
    this.messageService.clear('t-err');
  }
}