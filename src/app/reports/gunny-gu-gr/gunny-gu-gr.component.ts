import { Component, OnInit } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { Router } from '@angular/router';
import { StatusMessage } from 'src/app/constants/Messages';

@Component({
  selector: 'app-gunny-gu-gr',
  templateUrl: './gunny-gu-gr.component.html',
  styleUrls: ['./gunny-gu-gr.component.css']
})
export class GunnyGuGrComponent implements OnInit {
  GunnyRepCols: any;
  GunnyRepData: any;
  fromDate: any;
  toDate: any;
  godownOptions: SelectItem[];
  g_cd: any;
  data: any;
  isActionDisabled: boolean;
  maxDate: Date;
  canShowMenu: boolean;
  isShowErr: boolean;
  username: any;
  selectedValue: string = 'GR';
  loading: boolean;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private authService: AuthService, private excelService: ExcelService, private router: Router,
    private restAPIService: RestAPIService, private roleBasedService: RoleBasedService, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.isActionDisabled = true;
    this.GunnyRepCols = this.tableConstants.GunnyReport;
    this.data = this.roleBasedService.getInstance();
    this.username = JSON.parse(this.authService.getCredentials());
    this.maxDate = new Date();
  }

  onSelect() {
    let options = [];
    this.data = this.roleBasedService.instance;
    if (this.data !== undefined) {
      this.data.forEach(x => {
        options.push({ 'label': x.GName, 'value': x.GCode });
        this.godownOptions = options;
      });
    }
  }

  onView() {
    this.checkValidDateSelection();
    this.loading = true;
    const params = {
      'GCode': this.g_cd.value,
      'FromDate': this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'),
      'ToDate': this.datePipe.transform(this.toDate, 'MM/dd/yyyy'),
      'UserName': this.username.user,
      'Type': this.selectedValue
    }
    this.restAPIService.post(PathConstants.GUNNY_REPORT, params).subscribe(res => {
      this.GunnyRepData = res;
      let sno = 0;
      this.GunnyRepData.forEach(data => {
        data.Date = this.datePipe.transform(data.Date, 'dd-MM-yyyy');
        data.Quantity = (data.Quantity * 1).toFixed(3);
        sno += 1;
        data.SlNo = sno;
      })
      if (res !== undefined && res.length !== 0) {
        this.isActionDisabled = false;
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
      }
      this.loading = false;
    }, (err: HttpErrorResponse) => {
      if (err.status === 0) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    })
  }

  onDateSelect() {
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
    this.GunnyRepData = [];
    this.isActionDisabled = true;
  }

  onExportExcel(): void {
    var GunnyData = [];
    this.GunnyRepData.forEach(data => {
      GunnyData.push({ SlNo: data.SlNo, Ackno: data.Ackno, Date: data.Date, Commodity: data.Commodity, Bags: data.Bags, Quantity: data.Quantity, stackno: data.stackno, Year: data.Year })
    });
    this.excelService.exportAsExcelFile(GunnyData, 'GUNNY_REPORT', this.GunnyRepCols);
  }

}
