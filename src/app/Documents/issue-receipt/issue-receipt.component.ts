import { Component, OnInit, ViewChild } from '@angular/core';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { SelectItem, MessageService, ConfirmationService } from 'primeng/api';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams, HttpErrorResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { Dropdown, Messages } from 'primeng/primeng';
import * as jsPDF from 'jspdf';
import { StatusMessage } from 'src/app/constants/Messages';

@Component({
  selector: 'app-issue-receipt',
  templateUrl: './issue-receipt.component.html',
  styleUrls: ['./issue-receipt.component.css']
})
export class IssueReceiptComponent implements OnInit {
  issueData: any = [];
  issueCols: any;
  itemCols: any;
  itemData: any = [];
  regionName: string;
  issuingGodownName: string;
  showMsg: any;
  data: any;
  maxDate: Date = new Date();
  scheme_data: any;
  stackYear: any;
  issueMemoDocData: any = [];
  issueMemoDocCols: any;
  viewDate: Date = new Date();
  monthOptions: SelectItem[];
  yearOptions: SelectItem[];
  transactionOptions: SelectItem[];
  receiverTypeOptions: SelectItem[];
  receiverNameOptions: SelectItem[];
  schemeOptions: SelectItem[];
  itemDescOptions: SelectItem[];
  packingTypeOptions: SelectItem[];
  stackOptions: SelectItem[];
  wmtOptions: SelectItem[];
  viewPane: boolean = false;
  isValidStackBalance: boolean;
  isReceivorNameDisabled: boolean;
  isReceivorTypeDisabled: boolean;
  isSaveSucceed: boolean = false;
  rtCode: string;
  rnCode: string;
  locationNo: any;
  godownNo: any;
  trCode: string;
  wtCode: string;
  iCode: string;
  ipCode: string;
  tStockCode: string;
  schemeCode: string;
  transType: string = 'I';
  TKgs: any;
  month: any;
  year: any;
  curMonth: any;
  SINo: any;
  SIDate: Date = new Date();
  IssuingCode: any;
  RCode: any;
  StackBalance: any = 0;
  RegularAdvance: string;
  RowId: any;
  DDate: Date = new Date();
  SI_Date: Date;
  DNo: any;
  canShowMenu: boolean;
  //Issue details
  Trcode: any;
  IRelates: any;
  DeliveryOrderDate: Date = new Date();
  DeliveryOrderNo: any;
  RTCode: any;
  RNCode: any;
  WNo: any;
  TransporterCharges: any;
  VehicleNo: any;
  TransporterName: string;
  ManualDocNo: any;
  Remarks: string;
  //Issue item
  Scheme: any;
  ICode: any;
  TStockNo: any;
  StackDate: Date;
  IPCode: any;
  NoPacking: any;
  PWeight: any;
  GKgs: any;
  NKgs: any;
  WTCode: any;
  Moisture: string;
  NewBale: any = 0;
  SServiceable: any = 0;
  SPatches: any = 0;
  Gunnyutilised: any = 0;
  GunnyReleased: any = 0;
  NetStackBalance: any = 0;
  CurrentDocQtv: any = 0;
  index: number = 0;
  UserID: any;
  Loadingslip: any;
  isViewed: boolean = false;
  blockScreen: boolean;
  @ViewChild('tr') transactionPanel: Dropdown;
  @ViewChild('m') monthPanel: Dropdown;
  @ViewChild('y') yearPanel: Dropdown;
  @ViewChild('rt') receivorTypePanel: Dropdown;
  @ViewChild('rn') receivorNamePanel: Dropdown;
  @ViewChild('sc') schemePanel: Dropdown;
  @ViewChild('i_desc') commodityPanel: Dropdown;
  @ViewChild('st_no') stackNoPanel: Dropdown;
  @ViewChild('pt') packingPanel: Dropdown;
  @ViewChild('wmt') weightmentPanel: Dropdown;

  constructor(private roleBasedService: RoleBasedService, private restAPIService: RestAPIService, private messageService: MessageService,
    private authService: AuthService, private tableConstants: TableConstants, private datepipe: DatePipe,
    private confirmationService: ConfirmationService, private http: HttpClient) {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;

  }

  ngOnInit() {
    this.scheme_data = this.roleBasedService.getSchemeData();
    this.issueCols = this.tableConstants.StockIssueMemoIssueDetailsColumns;
    this.itemCols = this.tableConstants.StockIssueMemoItemDetailsColumns;
    this.issueMemoDocCols = this.tableConstants.StockIssueMemoViewBySINOCols;
    this.data = this.roleBasedService.getInstance();
    this.UserID = JSON.parse(this.authService.getCredentials());
    this.maxDate = new Date();
    this.curMonth = "0" + (new Date().getMonth() + 1);
    this.month = this.datepipe.transform(new Date(), 'MMM');
    this.monthOptions = [{ label: this.month, value: this.curMonth }];
    this.year = new Date().getFullYear();
    this.yearOptions = [{ label: this.year, value: this.year }];
    setTimeout(() => {
      this.regionName = this.data[0].RName;
      this.issuingGodownName = this.data[0].GName;
      this.IssuingCode = this.data[0].GCode;
      this.RCode = this.data[0].RCode;
    }, 1200);
  }
  onSelect(selectedItem, type) {
    let transactoinSelection = [];
    let schemeSelection = [];
    let yearArr = [];
    let receivorTypeList = [];
    let itemDesc = [];
    let receivorNameList = [];
    let stackNo = [];
    let packingTypes = [];
    let weighment = [];
    const range = 3;
    switch (selectedItem) {
      case 'y':
        if (type === 'enter') {
          this.yearPanel.overlayVisible = true;
        }
        const year = new Date().getFullYear();
        for (let i = 0; i < range; i++) {
          if (i === 0) {
            yearArr.push({ 'label': (year - 1).toString(), 'value': year - 1 });
          } else if (i === 1) {
            yearArr.push({ 'label': (year).toString(), 'value': year });
          } else {
            yearArr.push({ 'label': (year + 1).toString(), 'value': year + 1 });
          }
        }
        this.yearOptions = yearArr;
        this.yearOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        break;
      case 'm':
        if (type === 'enter') {
          this.monthPanel.overlayVisible = true;
        }
        this.monthOptions = [{ 'label': 'Jan', 'value': '01' },
        { 'label': 'Feb', 'value': '02' }, { 'label': 'Mar', 'value': '03' }, { 'label': 'Apr', 'value': '04' },
        { 'label': 'May', 'value': '05' }, { 'label': 'Jun', 'value': '06' }, { 'label': 'Jul', 'value': '07' },
        { 'label': 'Aug', 'value': '08' }, { 'label': 'Sep', 'value': '09' }, { 'label': 'Oct', 'value': '10' },
        { 'label': 'Nov', 'value': '11' }, { 'label': 'Dec', 'value': '12' }];
        this.monthOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        break;
      case 'tr':
        if (type === 'enter') {
          this.transactionPanel.overlayVisible = true;
        }
        this.restAPIService.get(PathConstants.TRANSACTION_MASTER).subscribe(data => {
          if (data !== undefined && data !== null && data.length !== 0) {
            data.forEach(y => {
              if (y.TransType === this.transType) {
                transactoinSelection.push({ 'label': y.TRName, 'value': y.TRCode });
              }
              this.transactionOptions = transactoinSelection;
            });
            this.isReceivorTypeDisabled = false;
            this.transactionOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
          } else {
            this.transactionOptions = transactoinSelection;
          }
        })
        break;
      case 'sc':
        if (type === 'enter') {
          this.schemePanel.overlayVisible = true;
        }
        if (this.scheme_data !== undefined && this.scheme_data !== null) {
          this.scheme_data.forEach(y => {
            schemeSelection.push({ 'label': y.SName, 'value': y.SCode });
          });
          this.schemeOptions = schemeSelection;
          this.schemeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        } else {
          this.schemeOptions = schemeSelection;
        }
        break;
      case 'rt':
        if (type === 'enter') {
          this.receivorTypePanel.overlayVisible = true;
        }
        if (this.Trcode !== null && this.Trcode !== undefined) {
          if ((this.Trcode.value !== undefined && this.Trcode.value !== null) ||
            (this.trCode !== null && this.trCode !== undefined)) {
            const params = new HttpParams().set('TRCode', (this.Trcode.value !== undefined) ? this.Trcode.value : this.trCode).append('GCode', this.IssuingCode);
            this.restAPIService.getByParameters(PathConstants.DEPOSITOR_TYPE_MASTER, params).subscribe((res: any) => {
              if (res !== null && res !== undefined && res.length !== 0) {
                res.forEach(rt => {
                  receivorTypeList.push({ 'label': rt.Tyname, 'value': rt.Tycode });
                });
                this.receiverTypeOptions = receivorTypeList;
                this.receiverTypeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
                // this.isReceivorNameDisabled = false;
              }
            });
          }
        } else {
          this.receiverTypeOptions = receivorTypeList;
        }
        break;
      case 'rn':
        if (type === 'enter') {
          this.receivorNamePanel.overlayVisible = true;
        }
        if (this.Trcode !== null && this.RTCode !== null && this.Trcode !== undefined && this.RTCode !== undefined) {
          if ((this.Trcode.value !== undefined && this.Trcode.value !== null &&
            this.RTCode.value !== undefined && this.RTCode.value !== null) || (this.rtCode !== null && this.rtCode !== undefined
              && this.trCode !== null && this.trCode !== undefined)) {
            const params = new HttpParams().set('TyCode', (this.RTCode.value !== undefined) ? this.RTCode.value : this.rtCode).append('TRType', this.transType).append('GCode', this.IssuingCode)
              .append('TRCode', (this.Trcode.value !== undefined) ? this.Trcode.value : this.trCode);
            this.restAPIService.getByParameters(PathConstants.DEPOSITOR_NAME_MASTER, params).subscribe((res: any) => {
              if (res !== null && res !== undefined && res.length !== 0) {
                res.forEach(rn => {
                  receivorNameList.push({ 'label': rn.DepositorName, 'value': rn.DepositorCode });
                })
                this.receiverNameOptions = receivorNameList;
                this.receiverNameOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
              }
            });
          }
        } else {
          this.receiverNameOptions = receivorNameList;
        }
        break;
      case 'i_desc':
        if (type === 'enter') {
          this.commodityPanel.overlayVisible = true;
        }
        if (this.Scheme !== null && this.Scheme !== undefined) {
          if ((this.Scheme.value !== undefined && this.Scheme.value !== null) || (this.schemeCode !== undefined && this.schemeCode !== null)) {
            const params = new HttpParams().set('SCode', (this.Scheme.value !== undefined) ? this.Scheme.value : this.schemeCode);
            this.restAPIService.getByParameters(PathConstants.COMMODITY_FOR_SCHEME, params).subscribe((res: any) => {
              if (res !== null && res !== undefined && res.length !== 0) {
                res.forEach(i => {
                  itemDesc.push({ 'label': i.ITDescription, 'value': i.ITCode });
                })
                this.itemDescOptions = itemDesc;
                this.itemDescOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
              }
            });
          }
        } else {
          this.itemDescOptions = itemDesc;
        }
        break;
      case 'st_no':
        if (type === 'enter') {
          this.stackNoPanel.overlayVisible = true;
        }
        if (this.RCode !== undefined && this.ICode !== undefined && this.ICode !== null) {
          if ((this.ICode.value !== undefined && this.ICode.value !== null) || (this.iCode !== undefined && this.iCode !== null)) {
            const params = new HttpParams().set('GCode', this.IssuingCode).append('ITCode', (this.ICode.value !== undefined) ? this.ICode.value : this.iCode);
            this.restAPIService.getByParameters(PathConstants.STACK_DETAILS, params).subscribe((res: any) => {
              if (res !== null && res !== undefined && res.length !== 0) {
                res.forEach(s => {
                  stackNo.push({ 'label': s.StackNo, 'value': s.StackNo, 'stack_date': s.ObStackDate, 'stack_yr': s.CurYear });
                })
                this.stackOptions = stackNo;
                this.stackOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
              }
            });
          }
        } else {
          this.stackOptions = stackNo;
        }
        break;
      case 'pt':
        // if (this.packingTypeOptions === undefined) {
        if (type === 'enter') {
          this.packingPanel.overlayVisible = true;
        }
        this.restAPIService.get(PathConstants.PACKING_AND_WEIGHMENT).subscribe((res: any) => {
          if (res !== null && res !== undefined && res.length !== 0) {
            res.Table.forEach(p => {
              packingTypes.push({ 'label': p.PName, 'value': p.Pcode, 'weight': p.PWeight });
            })
            this.packingTypeOptions = packingTypes;
            this.packingTypeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
          } else {
            this.packingTypeOptions = packingTypes;
          }
        });
        // }
        break;
      case 'wmt':
        if (type === 'enter') {
          this.weightmentPanel.overlayVisible = true;
        }
        // if (this.wmtOptions === undefined) {
        this.restAPIService.get(PathConstants.PACKING_AND_WEIGHMENT).subscribe((res: any) => {
          if (res !== null && res !== undefined && res.length !== 0) {
            res.Table1.forEach(w => {
              weighment.push({ 'label': w.WEType, 'value': w.WECode });
            })
            this.wmtOptions = weighment;
            this.wmtOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
          }
        });
        // }
        break;
    }
  }

  refreshSelect(id) {
    switch (id) {
      case 'tr':
        this.receiverNameOptions = []; this.receiverTypeOptions = [];
        this.rtCode = null; this.RTCode = null; this.rnCode = null; this.RNCode = null;
        break;
      case 'sc':
        this.itemDescOptions = []; this.stackOptions = [];
        this.iCode = null; this.ICode = null; this.TStockNo = null;
        break;
      case 'i_desc':
        this.stackOptions = [];
        this.TStockNo = null;
        break;
      case 'rt':
        this.receiverNameOptions = [];
        this.rnCode = null; this.RNCode = null;
        break;
    }
  }


  parseMoisture(event) {
    let totalLength = event.target.value.length;
    let value = event.target.value;
    let findDot = this.Moisture.toString().indexOf('.');
    if ((event.keyCode >= 32 && event.keyCode <= 47) || (event.keyCode >= 58 && event.keyCode <= 64)
      || (event.keyCode >= 91 && event.keyCode <= 95) || (event.keyCode >= 123 && event.keyCode <= 127)
      || (findDot > 1)) {
      return false;
    } else if (totalLength === 1 && event.keyCode === 190) {
      return true;
    }
    else if (totalLength >= 2 && event.keyCode !== 8) {
      if (findDot < 0) {
        let checkValue: any = this.Moisture.slice(0, 2);
        checkValue = (checkValue * 1);
        if (checkValue > 25) {
          let startValue = this.Moisture.slice(0, 1);
          let endValue = this.Moisture.slice(1, totalLength);
          this.Moisture = startValue + '.' + endValue;
        } else {
          let startValue = this.Moisture.slice(0, 2);
          let endValue = this.Moisture.slice(2, totalLength);
          endValue = (endValue !== undefined && endValue !== '') ? endValue : '00';
          this.Moisture = startValue + '.' + endValue;
        }
      }
    } else {
      return true;
    }
  }

  onCalculateKgs() {
    this.NoPacking = (this.NoPacking * 1);
    if (this.NoPacking !== undefined && this.NoPacking !== null
      && this.IPCode !== undefined && this.IPCode !== null) {
      let wt = (this.IPCode.weight !== undefined && this.IPCode.weight !== null) ? this.IPCode.weight : this.PWeight;
      this.GKgs = this.NKgs = ((this.NoPacking * 1) * (wt * 1));
      this.TKgs = (this.GKgs * 1) - (this.NKgs * 1);
    } else {
      this.GKgs = this.NKgs = this.TKgs = 0;
    }
  }

  onCalculateWt() {
    if (this.GKgs !== undefined && this.NKgs !== undefined) {
      this.TKgs = (this.GKgs * 1) - (this.NKgs * 1);
    }
    if (this.GKgs < this.NKgs) {
      this.NKgs = this.GKgs = this.TKgs = 0;
    }
  }

  onStackNoChange(event) {
    this.messageService.clear();
    if (this.TStockNo !== undefined && this.TStockNo !== null) {
      this.stackYear = this.TStockNo.stack_yr;
      let index;
      let TStockNo = (this.TStockNo.value !== undefined && this.TStockNo.value !== null) ?
        this.TStockNo.value : this.TStockNo;
      index = TStockNo.toString().indexOf('/', 2);
      const totalLength = TStockNo.length;
      this.godownNo = TStockNo.toString().slice(0, index);
      this.locationNo = TStockNo.toString().slice(index + 1, totalLength);
    } else {
      this.godownNo = this.stackYear = this.locationNo = null;
    }
    let stack_data = (event.value !== undefined) ? event.value : event;
    const params = {
      TStockNo: (stack_data.value !== undefined && stack_data.value !== null) ? stack_data.value : stack_data.stack_no,
      StackDate: this.datepipe.transform(stack_data.stack_date, 'MM/dd/yyyy'),
      GCode: this.IssuingCode,
      ICode: (this.ICode.value !== undefined && this.ICode.value !== null) ? this.ICode.value : this.iCode,
      Type: 1
    }
    this.restAPIService.post(PathConstants.STACK_BALANCE, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.StackBalance = (res[0].StackBalance * 1).toFixed(3);
        this.StackBalance = (this.StackBalance * 1);
        if (this.StackBalance > 0) {
          this.isValidStackBalance = false;
          this.CurrentDocQtv = this.NetStackBalance = 0;
          if (this.itemData.length !== 0) {
            this.itemData.forEach(x => {
              if (x.TStockNo === stack_data.value) {
                this.CurrentDocQtv += (x.Nkgs * 1);
                this.NetStackBalance = (this.StackBalance * 1) - (this.CurrentDocQtv * 1);
              }
            })
          }
        } else {
          this.isValidStackBalance = true;
          this.CurrentDocQtv = 0;
          this.NetStackBalance = 0;
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.NotSufficientStackBalance });
        }
      }
    })
  }


  onIssueDetailsEnter() {
    this.DNo = this.DeliveryOrderNo;
    this.DDate = this.DeliveryOrderDate;
    this.SI_Date = this.SIDate;
    this.issueData.push({
      SINo: (this.SINo !== undefined) ? this.SINo : '-',
      SIDate: this.datepipe.transform(this.SIDate, 'MM/dd/yyyy'),
      DNo: this.DeliveryOrderNo,
      DDate: this.datepipe.transform(this.DeliveryOrderDate, 'MM/dd/yyyy'),
      RCode: this.RCode, GodownCode: this.IssuingCode,
      DeliveryOrderDate: this.datepipe.transform(this.DeliveryOrderDate, 'dd/MM/yyyy'),
      IssueMemoDate: this.datepipe.transform(this.SIDate, 'dd/MM/yyyy'),
    });
    if (this.issueData.length !== 0) {
      this.DeliveryOrderDate = new Date(); this.DeliveryOrderNo = null;
      this.issueData = this.issueData.filter(x => {
        return x.SIDate === this.datepipe.transform(this.SIDate, 'MM/dd/yyyy')
      });
    }
  }

  onItemDetailsEnter() {
    this.messageService.clear();
    this.itemData.push({
      TStockNo: (this.TStockNo.value !== undefined) ? this.TStockNo.value : this.TStockNo,
      ICode: (this.ICode.value !== undefined) ? this.ICode.value : this.iCode,
      IPCode: (this.IPCode.value !== undefined) ? this.IPCode.value : this.ipCode,
      NoPacking: this.NoPacking,
      GKgs: this.GKgs,
      Nkgs: this.NKgs,
      WTCode: (this.WTCode.value !== undefined) ? this.WTCode.value : this.wtCode,
      Moisture: this.Moisture,
      Scheme: (this.Scheme.value !== undefined) ? this.Scheme.value : this.schemeCode,
      CommodityName: (this.ICode.label !== undefined) ? this.ICode.label : this.ICode,
      SchemeName: (this.Scheme.label !== undefined) ? this.Scheme.label : this.Scheme,
      PackingName: (this.IPCode.label !== undefined) ? this.IPCode.label : this.IPCode,
      WmtType: (this.WTCode.label !== undefined) ? this.WTCode.label : this.WTCode,
      PWeight: (this.IPCode.weight !== undefined) ? this.IPCode.weight : this.PWeight,
      StackDate: (this.TStockNo.stack_date !== undefined && this.TStockNo.stack_date !== null) ?
        new Date(this.TStockNo.stack_date) : this.StackDate
    });
    if (this.itemData.length !== 0) {
      this.StackBalance = (this.StackBalance * 1);
      this.CurrentDocQtv = 0;
      let stock_no = (this.TStockNo.value !== undefined && this.TStockNo.value !== null) ? this.TStockNo.value : this.TStockNo;
      this.itemData.forEach(x => {
        if (x.TStockNo === stock_no) {
          this.CurrentDocQtv += (x.Nkgs * 1);
        }
      });
      let lastIndex = this.itemData.length;
      if (this.CurrentDocQtv > this.StackBalance) {
        this.messageService.clear();
        this.itemData = this.itemData.splice(lastIndex, 1);
        this.CurrentDocQtv = 0;
        this.NetStackBalance = 0;
        this.NoPacking = null;
        this.GKgs = null; this.NKgs = null; this.TKgs = null;
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ExceedingStackBalance });
      } else {
        this.NetStackBalance = (this.StackBalance * 1) - (this.CurrentDocQtv * 1);
        this.TStockNo = null; this.ICode = null; this.IPCode = null; this.NoPacking = null;
        this.GKgs = null; this.NKgs = null; this.godownNo = null; this.locationNo = null;
        this.TKgs = null; this.WTCode = null; this.Moisture = null; this.Scheme = null;
        this.schemeOptions = []; this.itemDescOptions = []; this.stackOptions = [];
        this.packingTypeOptions = []; this.wmtOptions = [];
      }

    }
  }

  deleteRow(id, data, index) {
    switch (id) {
      case 'issue':
        this.SIDate = new Date(data.SIDate);
        this.SINo = data.SINo;
        this.DeliveryOrderNo = data.DNo;
        this.DeliveryOrderDate = new Date(data.DDate);
        this.issueData.splice(index, 1);
        break;
      case 'item':
        this.TStockNo = data.TStockNo;
        this.stackOptions = [{ label: data.TStockNo, value: data.TStockNo }];
        this.StackDate = data.StackDate;
        this.Scheme = data.SchemeName; this.schemeCode = data.Scheme;
        this.schemeOptions = [{ label: data.SchemeName, value: data.Scheme }];
        this.ICode = data.CommodityName; this.iCode = data.ICode;
        this.itemDescOptions = [{ label: data.CommodityName, value: data.ICode }];
        this.IPCode = data.PackingName; this.ipCode = data.IPCode;
        this.PWeight = (data.PWeight * 1);
        this.packingTypeOptions = [{ label: data.PackingName, value: data.IPCode }];
        this.WTCode = data.WmtType; this.wtCode = data.WTCode;
        this.wmtOptions = [{ label: data.WmtType, value: data.WTCode }];
        this.NoPacking = (data.NoPacking * 1),
          this.GKgs = (data.GKgs * 1).toFixed(3);
        this.NKgs = (data.Nkgs * 1).toFixed(3);
        this.Moisture = (data.Moisture * 1).toFixed(2);
        if (this.TStockNo !== undefined && this.TStockNo !== null) {
          let index;
          index = this.TStockNo.toString().indexOf('/', 2);
          const totalLength = this.TStockNo.length;
          this.godownNo = this.TStockNo.toString().slice(0, index);
          this.locationNo = this.TStockNo.toString().slice(index + 1, totalLength);
        }
        this.TKgs = (this.GKgs !== undefined && this.NKgs !== undefined) ? ((this.GKgs * 1) - (this.NKgs * 1)) : 0;
        this.itemData.splice(index, 1);
        const list = { stack_no: this.TStockNo, stack_date: this.StackDate }
        this.onStackNoChange(list);
        break;
    }

  }

  onSave(type) {
    this.messageService.clear();
    this.blockScreen = true;
    if (this.SIDate !== undefined && this.SIDate !== null) {
      this.issueData.forEach(x => {
        if (x.SIDate === this.datepipe.transform(this.SIDate, 'MM/dd/yyyy')) {
          this.SIDate = this.SIDate;
        } else {
          this.SIDate = x.SIDate;
        }
      })
    }
    this.IRelates = this.year + '/' + ((this.month.value !== undefined) ? this.month.value : this.curMonth);
    const params = {
      'Type': type,
      'SINo': (this.SINo !== undefined && this.SINo !== null) ? this.SINo : 0,
      'RowId': (this.RowId !== undefined && this.RowId !== null) ? this.RowId : 0,
      'SIDate': this.datepipe.transform(this.SIDate, 'MM/dd/yyyy'),
      'IRelates': this.IRelates,
      'DNo': (this.DeliveryOrderNo !== null) ? this.DeliveryOrderNo : this.DNo,
      'DDate': (this.DeliveryOrderDate !== null) ? this.datepipe.transform(this.DeliveryOrderDate, 'MM/dd/yyyy') :
        this.datepipe.transform(this.DDate, 'MM/dd/yyyy'),
      'WCCode': this.WNo,
      'IssuingCode': this.IssuingCode,
      'RCode': this.RCode,
      'IssueRegularAdvance': this.RegularAdvance.toUpperCase(),
      'Trcode': (this.Trcode.value !== undefined) ? this.Trcode.value : this.trCode,
      'Receivorcode': (this.RNCode.value !== undefined) ? this.RNCode.value : this.rnCode,
      'Issuetype': (this.RTCode.value !== undefined) ? this.RTCode.value : this.rtCode,
      'TransporterName': this.TransporterName,
      'TransportingCharge': this.TransporterCharges,
      'ManualDocNo': (this.ManualDocNo === undefined || this.ManualDocNo === null) ? "" : this.ManualDocNo,
      'LorryNo': (this.VehicleNo !== undefined && this.VehicleNo !== null) ? this.VehicleNo : '-',
      'NewBale': (this.NewBale !== undefined && this.NewBale !== null) ? this.NewBale : 0,
      'SoundServiceable': (this.SServiceable !== undefined && this.SServiceable !== null) ? this.SServiceable : 0,
      'ServiceablePatches': (this.SPatches !== undefined && this.SPatches !== null) ? this.SPatches : 0,
      'GunnyUtilised': (this.Gunnyutilised !== undefined && this.Gunnyutilised !== null) ? this.Gunnyutilised : 0,
      'GunnyReleased': (this.GunnyReleased !== undefined && this.GunnyReleased !== null) ? this.GunnyReleased : 0,
      'IssueItemList': this.itemData,
      'SIDetailsList': this.issueData,
      'Remarks': (this.Remarks !== undefined) ? this.Remarks : '-',
      'GodownName': this.issuingGodownName,
      'RegionName': this.regionName,
      'TransactionType': (this.Trcode.label !== undefined && this.Trcode.label !== null) ? this.Trcode.label : this.Trcode,
      'ReceiverName': (this.RNCode.label !== undefined && this.RNCode.label !== null) ? this.RNCode.label : this.RNCode,
      'UserID': this.UserID.user,
      'Loadingslip': (this.SINo === undefined || this.SINo === null) ? 'N' : this.Loadingslip,
      'IssueMemo ': 'F'
    }
    this.restAPIService.post(PathConstants.STOCK_ISSUE_MEMO_DOCUMENTS, params).subscribe(res => {
      if (res.Item1 !== undefined && res.Item1 !== null && res.Item2 !== undefined && res.Item2 !== null) {
        if (res.Item1) {
          this.isSaveSucceed = true;
          this.isViewed = false;
          this.blockScreen = false;
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: res.Item2 });
          this.onClear();
        } else {
          this.isViewed = false;
          this.blockScreen = false;
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: res.Item2 });
        }
      }
    }, (err: HttpErrorResponse) => {
      this.isSaveSucceed = false;
      this.isViewed = false;
      this.blockScreen = false;
      if (err.status === 0) {
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }

  onView() {
    this.viewPane = true;
    this.messageService.clear();
    this.issueMemoDocData = [];
    const params = new HttpParams().set('value', this.datepipe.transform(this.viewDate, 'MM/dd/yyyy')).append('GCode', this.IssuingCode).append('Type', '1');
    this.restAPIService.getByParameters(PathConstants.STOCK_ISSUE_VIEW_DOCUMENTS, params).subscribe((res: any) => {
      if (res.Table !== null && res.Table !== undefined && res.Table.length !== 0) {
        res.Table.forEach(data => {
          data.SIDate = this.datepipe.transform(data.SIDate, 'dd-MM-yyyy');
          data.DDate = this.datepipe.transform(data.DDate, 'dd-MM-yyyy');
        })
        this.issueMemoDocData = res.Table;
      } else {
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage });
      }
    });
  }

  onRowSelect(event) {
    this.SINo = event.data.SINo;
  }

  getDocBySINo() {
    this.messageService.clear();
    this.viewPane = false;
    this.isSaveSucceed = false;
    this.isViewed = true;
    this.itemData = []; this.issueData = [];
    const params = new HttpParams().set('value', this.SINo).append('Type', '2');
    this.restAPIService.getByParameters(PathConstants.STOCK_ISSUE_VIEW_DOCUMENTS, params).subscribe((res: any) => {
      if (res.Table !== undefined && res.Table.length !== 0 && res.Table !== null) {
        this.RowId = res.Table[0].RowId;
        this.TransporterName = res.Table[0].TransporterName;
        this.TransporterCharges = res.Table[0].TransportingCharge;
        this.NewBale = (res.Table[0].NewBale !== null && res.Table[0].NewBale !== undefined) ? res.Table[0].NewBale : 0;
        this.SServiceable = (res.Table[0].SoundServiceable !== null && res.Table[0].SoundServiceable !== undefined) ?
          res.Table[0].SoundServiceable : 0;
        this.SPatches = (res.Table[0].ServiceablePatches !== null && res.Table[0].ServiceablePatches !== undefined)
          ? res.Table[0].ServiceablePatches : 0;
        this.GunnyReleased = (res.Table[0].GunnyReleased !== null && res.Table[0].GunnyReleased !== undefined) ?
          res.Table[0].GunnyReleased : 0;
        this.Gunnyutilised = (res.Table[0].GunnyUtilised !== null && res.Table[0].GunnyUtilised !== undefined) ?
          res.Table[0].GunnyUtilised : 0;
        this.WNo = res.Table[0].WCCode;
        let currentYr = new Date().getFullYear();
        let today = new Date().getDate();
        this.curMonth = res.Table[0].IRelates.slice(5, 7);
        let formDate = this.curMonth + "-" + today + "-" + currentYr;
        this.monthOptions = [{ label: this.datepipe.transform(new Date(formDate), 'MMM'), value: this.curMonth }]
        this.month = this.datepipe.transform(new Date(formDate), 'MMM');
        this.yearOptions = [{ label: res.Table[0].IRelates.slice(0, 4), value: res.Table[0].IRelates.slice(0, 4) }]
        this.year = res.Table[0].IRelates.slice(0, 4);
        this.transactionOptions = [{ label: res.Table[0].TRName, value: res.Table[0].Trcode }];
        this.Trcode = res.Table[0].TRName;
        this.trCode = res.Table[0].Trcode;
        this.receiverTypeOptions = [{ label: res.Table[0].ReceivorType, value: res.Table[0].issuetype1 }];
        this.RTCode = res.Table[0].ReceivorType;
        this.rtCode = res.Table[0].issuetype1;
        this.receiverNameOptions = [{ label: res.Table[0].ReceivorName, value: res.Table[0].Receivorcode }];
        this.RNCode = res.Table[0].ReceivorName;
        this.rnCode = res.Table[0].Receivorcode;
        this.IRelates = res.Table[0].IRelates;
        this.VehicleNo = res.Table[0].LorryNo;
        this.RegularAdvance = res.Table[0].Flag2;
        this.ManualDocNo = res.Table[0].Flag1;
        this.Remarks = res.Table[0].Remarks;
        res.Table.forEach(i => {
          this.itemData.push({
            TStockNo: i.TStockNo,
            ICode: i.ICode,
            IPCode: i.IPCode,
            NoPacking: i.NoPacking,
            GKgs: i.GKgs,
            Nkgs: i.Nkgs,
            WTCode: i.WTCode,
            Moisture: i.Moisture,
            Scheme: i.Scheme,
            CommodityName: i.ITName,
            SchemeName: i.SchemeName,
            PackingName: i.PName,
            WmtType: i.WEType,
            PWeight: i.PWeight,
            StackDate: i.StackDate,
            RCode: i.RCode
          })
        })
        res.Table1.forEach(j => {
          this.issueData.push({
            SINo: j.SINo,
            IssueMemoDate: this.datepipe.transform(new Date(j.SIDate), 'dd-MM-yyyy'),
            SIDate: this.datepipe.transform(new Date(j.SIDate), 'MM/dd/yyyy'),
            DDate: this.datepipe.transform(new Date(j.DDate), 'MM/dd/yyyy'),
            DNo: j.DNo,
            DeliveryOrderDate: this.datepipe.transform(new Date(j.DDate), 'dd-MM-yyyy'),
            GodownCode: this.IssuingCode,
            DORowid: j.Rowid,
            RCode: j.RCode
          })
        })
      } else {
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage });
      }
    });
  }

  onClear() {
    this.itemData = []; this.issueData = [];
    this.trCode = null; this.Trcode = null; this.rtCode = null; this.RTCode = null;
    this.rnCode = null; this.RNCode = null; this.wtCode = null; this.WTCode = null;
    this.WNo = null; this.RegularAdvance = null; this.VehicleNo = null; this.Remarks = null;
    this.TransporterCharges = null; this.TransporterName = null; this.ManualDocNo = null;
    this.NewBale = 0; this.GunnyReleased = 0; this.Gunnyutilised = 0;
    this.SServiceable = 0; this.SPatches = 0; this.CurrentDocQtv = 0;
    this.StackBalance = 0; this.NetStackBalance = 0; this.SINo = null;
    this.curMonth = "0" + (new Date().getMonth() + 1);
    this.month = this.datepipe.transform(new Date(), 'MMM');
    this.monthOptions = [{ label: this.month, value: this.curMonth }];
    this.year = new Date().getFullYear();
    this.yearOptions = [{ label: this.year, value: this.year }];
    this.packingTypeOptions = []; this.transactionOptions = [];
    this.schemeOptions = this.stackOptions = []; this.wmtOptions = [];
    this.receiverNameOptions = []; this.receiverTypeOptions = [];
  }

  openNext() {
    this.index = (this.index === 2) ? 0 : this.index + 1;
  }

  openPrev() {
    this.index = (this.index === 0) ? 2 : this.index - 1;
  }

  onPrint() {
    if (this.isViewed) {
      this.onSave('2');
    }
    const path = "../../assets/Reports/" + this.UserID.user + "/";
    const filename = this.IssuingCode + GolbalVariable.StockIssueDocument;
    let filepath = path + filename + ".txt";
    this.http.get(filepath, { responseType: 'text' })
      .subscribe(data => {
        if(data !== null && data !== undefined) {
        var doc = new jsPDF({
          orientation: 'potrait',
        })
        doc.setFont('courier');
        doc.setFontSize(8);
        doc.text(data, 2, 2);
        doc.save(filename + '.pdf');
        //  var w = window.open(path + filename); //Required full file path.
        //  w.print();
        this.isSaveSucceed = false;
        this.isViewed = false;
      } else {
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      } 
      },(err: HttpErrorResponse) => {
        this.blockScreen = false;
         if (err.status === 0) {
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
        }
      });  }

}
