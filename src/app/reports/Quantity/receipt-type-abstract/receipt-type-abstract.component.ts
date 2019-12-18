import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Dropdown, MessageService } from 'primeng/primeng';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { saveAs } from 'file-saver';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpErrorResponse } from '@angular/common/http';
import { StatusMessage } from 'src/app/constants/Messages';

@Component({
  selector: 'app-receipt-type-abstract',
  templateUrl: './receipt-type-abstract.component.html',
  styleUrls: ['./receipt-type-abstract.component.css']
})
export class ReceiptTypeAbstractComponent implements OnInit {
  ReceiptAbstractCols: any;
  ReceiptAbstractData: any = [];
  fromDate: any = new Date();
  toDate: any = new Date();
  regionOptions: SelectItem[];
  godownOptions: SelectItem[];
  regions: any;
  RCode: any;
  GCode: any;
  data: any;
  roleId: any;
  maxDate: Date;
  canShowMenu: boolean;
  isShowErr: boolean;
  loading: boolean = false;
  userId: any;
  loggedInRCode: any;
  @ViewChild('godown') godownPanel: Dropdown;
  @ViewChild('region') regionPanel: Dropdown;

  constructor(private datePipe: DatePipe, private authService: AuthService, private excelService: ExcelService,
    private restAPIService: RestAPIService, private roleBasedService: RoleBasedService, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
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
    this.onResetTable('');
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
    this.restAPIService.post(PathConstants.QUANTITY_ACCOUNT_RECEIPT_REPORT, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.loading = false;
        let columns: Array<any> = [];
        for (var i in res[0]) {
          columns.push({ header: i, field: i });
        }
        columns.unshift({ header: 'S.No:', field: 'sno' });
        let index = columns.length;
        columns.splice(index, 0, { field: 'Total', header: 'TOTAL' });
        this.ReceiptAbstractCols = columns;
        this.ReceiptAbstractData = res;
        let sno = 1;
        this.ReceiptAbstractData.forEach(data => {
          data.sno = sno;
          sno += 1;
        });
        for (let i = 0; i < this.ReceiptAbstractData.length; i++) {
          let total = 0;
          this.ReceiptAbstractCols.forEach(x => {
            let field = x.field;
            if ((typeof this.ReceiptAbstractData[i][field] !== 'string') && field !== 'sno') {
              total += (((this.ReceiptAbstractData[i][field] !== null && this.ReceiptAbstractData[i][field] !== undefined) ?
                this.ReceiptAbstractData[i][field] : 0) * 1);
            }
          })
          this.ReceiptAbstractData[i].Total = total;
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
    if (item === 'reg') { this.GCode = null; }
    this.ReceiptAbstractData = [];
  }

  onPrint() {
    const path = "../../assets/Reports/" + this.userId.user + "/";
    const filename = this.GCode.value + GolbalVariable.QuantityACForReceipt + ".txt";
    saveAs(path + filename, filename);
  }

}

