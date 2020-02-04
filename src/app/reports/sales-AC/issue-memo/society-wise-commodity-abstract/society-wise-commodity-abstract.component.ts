import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { StatusMessage } from 'src/app/constants/Messages';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Dropdown } from 'primeng/primeng';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-society-wise-commodity-abstract',
  templateUrl: './society-wise-commodity-abstract.component.html',
  styleUrls: ['./society-wise-commodity-abstract.component.css']
})
export class SocietyWiseCommodityAbstractComponent implements OnInit {
  SocietyAbstractCols: any;
  SocietyAbstractData: any;
  DateWiseData: any;
  DateWiseCols: any;
  SchemeData: any;
  SchemeCols: any;
  SchemeAbstractData: any;
  SchemeAbstractCols: any;
  showCommodityAbstract: boolean = false;
  showCommodityBreakup: boolean = false;
  showSchemeCommodityBreakup: boolean = false;
  showSchemeAbstract: boolean = false;
  abstractOptions: SelectItem[];
  customerOptions: SelectItem[];
  godownOptions: SelectItem[];
  regionOptions: SelectItem[];
  receiverOptions: SelectItem[];
  g_cd: any;
  ReceivorType: any;
  c_cd: any;
  a_cd: string;
  data: any;
  TSA: any;
  S: any;
  SA: any;
  DW: any;
  fromDate: any = new Date();
  toDate: any = new Date();
  isActionDisabled: boolean;
  maxDate: Date;
  regions: any;
  roleId: any;
  RCode: any;
  GCode: any;
  username: any;
  SocietyAbstract: any;
  loggedInRCode: any;
  canShowMenu: boolean;
  loading: boolean = false;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;
  @ViewChild('receivor', { static: false }) receiverPanel: Dropdown;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe, private messageService: MessageService,
    private authService: AuthService, private excelService: ExcelService,
    private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    this.isActionDisabled = true;
    this.regions = this.roleBasedService.getRegions();
    this.maxDate = new Date();
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.username = JSON.parse(this.authService.getCredentials());
  }

  onSelect(item, type) {
    let regionSelection = [];
    let godownSelection = [];
    let receiverSelection = [];
    switch (item) {
      case 'reg':
        this.regions = this.roleBasedService.regionsData;
        if (type === 'enter') {
          this.regionPanel.overlayVisible = true;
        }
        if (this.roleId === 1) {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              regionSelection.push({ label: x.RName, value: x.RCode });
            });
            this.regionOptions = regionSelection;
          }
        } else {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              if (x.RCode === this.loggedInRCode) {
                regionSelection.push({ label: x.RName, value: x.RCode });
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
            if (x.RCode === this.RCode.value) {
              godownSelection.push({ label: x.GName, value: x.GCode });
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
      case 'r':
        if (type === 'enter') {
          this.receiverPanel.overlayVisible = true;
        }
        if (this.receiverOptions === undefined) {
          const params = new HttpParams().set('TRCode', 'All');
          this.restAPIService.getByParameters(PathConstants.DEPOSITOR_TYPE_MASTER, params).subscribe(res => {
            res.forEach(s => {
              receiverSelection.push({ label: s.Tyname, value: s.Tycode });
            });
            this.receiverOptions = receiverSelection;
          });
        }
        break;
      // case 'abstract':
      //   this.abstractOptions = [{ 'label': 'Society Wise Commodity Breakup', 'value': 'society_c_a' },
      //   { 'label': 'Society Wise Date Wise Commodity Abstract', 'value': 'date_c_b' },
      //   { 'label': 'Society Wise Scheme Wise Commodity Breakup', 'value': 'scheme_c_b' },
      //   { 'label': 'Society Wise Scheme Wise Commodity Abstract', 'value': 'scheme_c_a' }];
      //   this.showPane();
      //   break;
    }
  }

  // showPane() {
  //   switch (this.a_cd) {
  //     case 'society_c_a':
  //       this.showCommodityAbstract = true;
  //       this.showCommodityBreakup = false;
  //       this.showSchemeAbstract = false;
  //       this.showSchemeCommodityBreakup = false;
  //       break;
  //     case 'date_c_b':
  //       this.showCommodityAbstract = false;
  //       this.showCommodityBreakup = true;
  //       this.showSchemeAbstract = false;
  //       this.showSchemeCommodityBreakup = false;
  //       break;
  //     case 'scheme_c_b':
  //       this.showCommodityAbstract = false;
  //       this.showCommodityBreakup = false;
  //       this.showSchemeAbstract = false;
  //       this.showSchemeCommodityBreakup = true;
  //       break;
  //     case 'scheme_c_a':
  //       this.showCommodityAbstract = false;
  //       this.showCommodityBreakup = false;
  //       this.showSchemeAbstract = true;
  //       this.showSchemeCommodityBreakup = false;
  //       break;
  //   }

  // }

  onView() {
    this.onClear();
    this.checkValidDateSelection();
    this.loading = true;
    const params = {
      Fdate: this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'),
      Tdate: this.datePipe.transform(this.toDate, 'MM/dd/yyyy'),
      GCode: this.GCode.value,
      RCode: this.RCode.value,
      UserName: this.username.user,
      RName: this.RCode.label,
      GName: this.GCode.label,
      ReceivorType: this.ReceivorType.value,
      Type: 1
    };
    this.restAPIService.post(PathConstants.ISSUE_MEMO_SOCIETY_ABSTRACT_REPORT, params).subscribe(res => {
      if (res !== undefined && res.length !== 0) {
        this.loading = false;
        let columns: Array<any> = [];
        for (var i in res[0]) {
          columns.push({ header: i, field: i });
        }
        columns.unshift({ header: 'S.No:', field: 'sno' });
        let index = columns.length;
        columns.splice(index, 0, { field: 'Total', header: 'TOTAL' });
        this.SocietyAbstractCols = columns;
        this.SocietyAbstractData = res;
        this.TSA = true;
        let sno = 1;
        this.SocietyAbstractData.forEach(data => {
          data.sno = sno;
          sno += 1;
        });
        for (let i = 0; i < this.SocietyAbstractData.length; i++) {
          let total: any = 0;
          this.SocietyAbstractCols.forEach(x => {
            let field = x.field;
            if ((typeof this.SocietyAbstractData[i][field] !== 'string') && field !== 'sno') {
              total += (((this.SocietyAbstractData[i][field] !== null && this.SocietyAbstractData[i][field] !== undefined) ?
                this.SocietyAbstractData[i][field] : 0) * 1);
            }
          })
          this.SocietyAbstractData[i].Total = total;
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
    this.onClear();
  }

  onDataWise() {
    this.onClear();
    this.checkValidDateSelection();
    this.loading = true;
    const params = {
      Fdate: this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'),
      Tdate: this.datePipe.transform(this.toDate, 'MM/dd/yyyy'),
      GCode: this.GCode.value,
      RCode: this.RCode.value,
      UserName: this.username.user,
      RName: this.RCode.label,
      GName: this.GCode.label,
      ReceivorType: this.ReceivorType.value,
      Type: 2
    };
    this.restAPIService.post(PathConstants.ISSUE_MEMO_SOCIETY_ABSTRACT_REPORT, params).subscribe(res => {
      if (res !== undefined && res.length !== 0) {
        this.loading = false;
        let columns: Array<any> = [];
        for (var i in res[0]) {
          columns.push({ header: i, field: i });
        }
        columns.unshift({ header: 'S.No:', field: 'sno' });
        let index = columns.length;
        columns.splice(index, 0, { field: 'Total', header: 'TOTAL' });
        this.DateWiseCols = columns;
        this.DateWiseData = res;
        this.DW = true;
        let sno = 1;
        this.DateWiseData.forEach(data => {
          data.SIDATE = this.datePipe.transform(data.SIDATE, 'dd/MM/yyyy');
          data.sno = sno;
          sno += 1;
        });
        for (let i = 0; i < this.DateWiseData.length; i++) {
          let total: any = 0;
          this.SocietyAbstractCols.forEach(x => {
            let field = x.field;
            if ((typeof this.DateWiseData[i][field] !== 'string') && field !== 'sno') {
              total += (((this.DateWiseData[i][field] !== null && this.DateWiseData[i][field] !== undefined) ?
                this.DateWiseData[i][field] : 0) * 1);
            }
          })
          this.DateWiseData[i].Total = total;
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

  onScheme() {
    this.onClear();
    this.checkValidDateSelection();
    this.loading = true;
    const params = {
      Fdate: this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'),
      Tdate: this.datePipe.transform(this.toDate, 'MM/dd/yyyy'),
      GCode: this.GCode.value,
      RCode: this.RCode.value,
      UserName: this.username.user,
      RName: this.RCode.label,
      GName: this.GCode.label,
      ReceivorType: this.ReceivorType.value,
      Type: 3
    };
    this.restAPIService.post(PathConstants.ISSUE_MEMO_SOCIETY_ABSTRACT_REPORT, params).subscribe(res => {
      if (res !== undefined && res.length !== 0) {
        this.loading = false;
        let columns: Array<any> = [];
        for (var i in res[0]) {
          columns.push({ header: i, field: i });
        }
        columns.unshift({ header: 'S.No:', field: 'sno' });
        let index = columns.length;
        columns.splice(index, 0, { field: 'Total', header: 'TOTAL' });
        this.SchemeCols = columns;
        this.SchemeData = res;
        this.S = true;
        let sno = 1;
        this.SchemeData.forEach(data => {
          data.SIDATE = this.datePipe.transform(data.SIDATE, 'dd/MM/yyyy');
          data.sno = sno;
          sno += 1;
        });
        for (let i = 0; i < this.SchemeData.length; i++) {
          let total: any = 0;
          this.SocietyAbstractCols.forEach(x => {
            let field = x.field;
            if ((typeof this.SchemeData[i][field] !== 'string') && field !== 'sno') {
              total += (((this.SchemeData[i][field] !== null && this.SchemeData[i][field] !== undefined) ?
                this.SchemeData[i][field] : 0) * 1);
            }
          })
          this.SchemeData[i].Total = total;
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

  onSchemeAbstract() {
    this.onClear();
    this.checkValidDateSelection();
    this.loading = true;
    const params = {
      Fdate: this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'),
      Tdate: this.datePipe.transform(this.toDate, 'MM/dd/yyyy'),
      GCode: this.GCode.value,
      RCode: this.RCode.value,
      UserName: this.username.user,
      RName: this.RCode.label,
      GName: this.GCode.label,
      ReceivorType: this.ReceivorType.value,
      Type: 4
    };
    this.restAPIService.post(PathConstants.ISSUE_MEMO_SOCIETY_ABSTRACT_REPORT, params).subscribe(res => {
      if (res !== undefined && res.length !== 0) {
        this.loading = false;
        let columns: Array<any> = [];
        for (var i in res[0]) {
          columns.push({ header: i, field: i });
        }
        columns.unshift({ header: 'S.No:', field: 'sno' });
        let index = columns.length;
        columns.splice(index, 0, { field: 'Total', header: 'TOTAL' });
        this.SchemeAbstractCols = columns;
        this.SchemeAbstractData = res;
        this.SA = true;
        let sno = 1;
        this.SchemeAbstractData.forEach(data => {
          data.sno = sno;
          sno += 1;
        });
        for (let i = 0; i < this.SchemeAbstractData.length; i++) {
          let total: any = 0;
          this.SocietyAbstractCols.forEach(x => {
            let field = x.field;
            if ((typeof this.SchemeAbstractData[i][field] !== 'string') && field !== 'sno') {
              total += (((this.SchemeAbstractData[i][field] !== null && this.SchemeAbstractData[i][field] !== undefined) ?
                this.SchemeAbstractData[i][field] : 0) * 1);
            }
          })
          this.SchemeAbstractData[i].Total = total;
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
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, life:5000
        ,summary: StatusMessage.SUMMARY_INVALID, detail: StatusMessage.ValidDateErrorMessage });
        this.fromDate = ''; this.toDate = '';
      }
      return this.fromDate, this.toDate;
    }
  }

  onResetTable(item) {
    if (item === 'reg') { this.GCode = null; }
    this.SocietyAbstractData = this.SocietyAbstractCols = [];
    this.SchemeAbstractData = [];
    this.SchemeData = [];
    this.DateWiseData = [];
    this.SchemeCols = [];
    this.SchemeAbstractCols = [];
    this.DateWiseCols = [];
  }

  onClear() {
    this.SchemeAbstractData = [];
    this.SchemeData = [];
    this.DateWiseData = [];
    this.SchemeCols = [];
    this.SchemeAbstractCols = [];
    this.DateWiseCols = [];
  }


  onPrint() {
    const path = "../../assets/Reports/" + this.username.user + "/";
    if (this.TSA === true) {
      const filename1 = this.GCode.value + GolbalVariable.IssueMemoSocietyAbstractFileName + ".txt";
      saveAs(path + filename1, filename1);
    }
  }

  onDateWisePrint() {
    const path = "../../assets/Reports/" + this.username.user + "/";
    if (this.DW === true) {
      const filename1 = this.GCode.value + GolbalVariable.IssueMemoSocietyDateWiseFileName + ".txt";
      saveAs(path + filename1, filename1);
    }
  }

  onSchemePrint() {
    const path = "../../assets/Reports/" + this.username.user + "/";
    if (this.S === true) {
      const filename1 = this.GCode.value + GolbalVariable.IssueMemoSocietyDateAndSchemeFileName + ".txt";
      saveAs(path + filename1, filename1);
    }
  }

  onSchemeAbstractPrint() {
    const path = "../../assets/Reports/" + this.username.user + "/";
    if (this.SA === true) {
      const filename1 = this.GCode.value + GolbalVariable.IssueMemoSocietySchemeWiseFileName + ".txt";
      saveAs(path + filename1, filename1);
    }
  }
  
  onClose() {
    this.messageService.clear('t-err');
  }  
}
