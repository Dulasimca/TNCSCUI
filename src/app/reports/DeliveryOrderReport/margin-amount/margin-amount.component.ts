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
  selector: 'app-margin-amount',
  templateUrl: './margin-amount.component.html',
  styleUrls: ['./margin-amount.component.css']
})
export class MarginAmountComponent implements OnInit {
  MarginAmountCols: any;
  MarginAmountData: any = [];
  fromDate: any = new Date();
  toDate: any = new Date();
  godownOptions: SelectItem[];
  regionOptions: SelectItem[];
  societyOptions: SelectItem[];
  g_cd: any;
  s_cd: any;
  data: any;
  maxDate: Date;
  canShowMenu: boolean;
  isShowErr: boolean;
  loading: boolean = false;
  username: any;
  regionsData: any;
  roleId: any;
  GCode: any;
  RCode: any;
  loggedInRCode: any;
  @ViewChild('godown') godownPanel: Dropdown;
  @ViewChild('region') regionPanel: Dropdown;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private authService: AuthService, private restAPIService: RestAPIService, private roleBasedService: RoleBasedService, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.MarginAmountCols = this.tableConstants.DoMarginAmount;
    this.data = this.roleBasedService.getInstance();
    this.regionsData = this.roleBasedService.getRegions();
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.maxDate = new Date();
    this.username = JSON.parse(this.authService.getCredentials());
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.maxDate = new Date();
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
                if(x.RCode === this.loggedInRCode) {
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
            if (x.RCode === this.RCode.value) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode, 'rcode': x.RCode, 'rname': x.RName });
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


  // onSociety() {
  //   let SocietySelection = [];
  //   if (this.societyOptions === undefined) {
  //     const params = new HttpParams().set('GCode', this.g_cd.value);
  //     this.restAPIService.getByParameters(PathConstants.SOCIETY_MASTER_GET, params).subscribe(res => {
  //       var result = Array.from(new Set(res.map((item: any) => item.SocietyName)));
  //       var code = Array.from(new Set(res.map((item: any) => item.SocietyCode)));
  //       for (var index in result) {
  //         SocietySelection.push({ 'label': result[index], 'value': result[index] });
  //       }
  //       // res.forEach(s => {
  //       // SocietySelection.push({ 'label': s.SocietyName, ' value': s.SocietyType })
  //       // });
  //       this.societyOptions = SocietySelection;
  //     });
  //   }
  // }

  onView() {
    this.checkValidDateSelection();
    this.loading = true;
    const params = {
      'FromDate': this.datePipe.transform(this.fromDate, 'MM/dd/yyy'),
      'ToDate': this.datePipe.transform(this.toDate, 'MM/dd/yyy'),
      'GCode': this.GCode.value,
      'GName': this.GCode.label,
      'RCode': this.RCode.value,
      'RName': this.RCode.label,
      'UserName': this.username.user,
    };
    this.restAPIService.post(PathConstants.DELIVERY_ORDER_MARGIN_AMOUNT_POST, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.MarginAmountData = res;
        this.loading = false;
        let sno = 0;
        let totalAmnt = 0;
        this.MarginAmountData.forEach(data => {
          data.Dodate = this.datePipe.transform(data.Dodate, 'dd-MM-yyyy');
          data.Quantity = (data.Quantity * 1).toFixed(3);
          sno += 1;
          data.SlNo = sno;
          totalAmnt += (data.Amount * 1);
        });
        this.MarginAmountData.push({ Coop: 'Total', Amount: totalAmnt });
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
    this.MarginAmountData = [];
  }

  onPrint() {
    const path = "../../assets/Reports/" + this.username.user + "/";
    const filename = this.GCode.value + GolbalVariable.DOMarginReportFileName + ".txt";
    saveAs(path + filename, filename);
  }
}
