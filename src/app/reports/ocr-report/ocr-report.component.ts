import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Dropdown, MessageService } from 'primeng/primeng';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { saveAs } from 'file-saver';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-ocr-report',
  templateUrl: './ocr-report.component.html',
  styleUrls: ['./ocr-report.component.css']
})
export class OCRReportComponent implements OnInit {
  cashReceiptRegCols: any;
  cashReceiptRegData: any = [];
  canShowMenu: boolean;
  godownOptions: SelectItem[];
  regionOptions: SelectItem[];
  GCode: any;
  maxDate: Date = new Date();
  loading: boolean;
  fromDate: any = new Date();
  toDate: any = new Date();
  username: any;
  RCode: any;
  data: any;
  roleId: any;
  loggedInRCode: any;
  regions: any;
  @ViewChild('gd') godownPanel: Dropdown;
  @ViewChild('reg') regionPanel: Dropdown;

  constructor(private tableConstants: TableConstants, private restApiService: RestAPIService, private roleBasedService: RoleBasedService,
    private authService: AuthService, private datePipe: DatePipe, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.cashReceiptRegCols = this.tableConstants.CashReceiptRegCols;
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.data = this.roleBasedService.getInstance();
    this.regions = this.roleBasedService.getRegions();
    this.username = JSON.parse(this.authService.getCredentials());
    this.username = JSON.parse(this.authService.getCredentials());
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
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
          this.godownPanel.overlayVisible = true;
        }
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.loggedInRCode) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode, 'rcode': x.RCode, 'rname': x.RName });
            }
          });
          this.godownOptions = godownSelection;
        }
        break;
    }
  }

  onView() {
    this.loading = true;
    const params = {
      'GCode': this.GCode.value,
      'GName': this.GCode.label,
      'RName': this.RCode.label,
      'UserID': this.username.user,
      'FromDate': this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'),
      'ToDate': this.datePipe.transform(this.toDate, 'MM/dd/yyyy'),
    };
    this.restApiService.post(PathConstants.OCR_REGISTER_REPORT, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.cashReceiptRegData = res;
        this.loading = false;
        let sno = 0;
        let TotalValue=0;
        this.cashReceiptRegData.forEach(data => {
          data.Date = this.datePipe.transform(data.Date, 'dd-MM-yyyy');
          data.DDDate = this.datePipe.transform(data.DDDate, 'dd-MM-yyyy');
          sno += 1;
          data.SlNo = sno;
          TotalValue += data.Amount !== undefined && data.Amount !==null ? (data.Amount*1) : 0;
        })
        this.cashReceiptRegData.push(
          {
              Amount : TotalValue.toFixed(2),
              ReceivedFrom: 'Total'
          }
        );
       
      } else{
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
    this.cashReceiptRegData = [];
  }
  onPrint() {
    const path = "../../assets/Reports/" + this.username.user + "/";
    const filename = this.GCode + GolbalVariable.OCRRegisterRpeort + ".txt";
    saveAs(path + filename, filename);
  }
}
