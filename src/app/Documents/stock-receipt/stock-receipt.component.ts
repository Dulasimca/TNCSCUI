import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { SelectItem, MessageService, ConfirmationService } from 'primeng/api';
import { PathConstants } from 'src/app/constants/path.constants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { HttpParams, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { Dropdown } from 'primeng/primeng';
import * as jsPDF from 'jspdf';
import { StatusMessage } from 'src/app/constants/Messages';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-stock-receipt',
  templateUrl: './stock-receipt.component.html',
  styleUrls: ['./stock-receipt.component.css']
})
export class StockReceiptComponent implements OnInit {
  index: number = 0;
  scheme_data: any;
  itemCol: any;
  itemData: any = [];
  documentViewCol: any;
  documentViewData: any = [];
  regionName: any;
  godownName: any;
  data: any;
  RowId: any;
  selectedValues: string[] = ['Road'];
  depositorTypeOptions: SelectItem[];
  depositorNameOptions: SelectItem[];
  transactionOptions: SelectItem[];
  stackOptions: SelectItem[];
  month: any;
  monthOptions: SelectItem[];
  yearOptions: SelectItem[];
  year: any;
  isSaveSucceed: boolean = false;
  tareWt: number;
  maxDate: Date = new Date();
  enableActions: boolean = true;
  viewDate: Date = new Date();
  moistureOptions: SelectItem[];
  itemDescOptions: SelectItem[];
  schemeOptions: SelectItem[];
  packingTypeOptions: SelectItem[];
  // isDepositorTypeDisabled: boolean = true;
  // isDepositorNameDisabled: boolean = true;
  locationNo: any;
  depositorType: string;
  trCode: string;
  wtCode: string;
  iCode: string;
  ipCode: string;
  tStockCode: string;
  depositorCode: string;
  schemeCode: string;
  stackYear: any;
  isStackNoEnabled: boolean = true;
  isItemDescEnabled: boolean = true;
  wmtOptions: SelectItem[];
  fromStationOptions: SelectItem[];
  toStationOptions: SelectItem[];
  vehicleOptions: SelectItem[];
  freightOptions: SelectItem[];
  TransType: string = 'R';
  godownNo: any;
  OrderNo: any;
  OrderDate: Date = new Date();
  StackBalance: any = 0;
  viewPane: boolean;
  canShowMenu: boolean;
  ReceivingCode: string;
  RCode: any;
  //SR-Details
  SRNo: any;
  SRDate: Date = new Date();
  PAllotment: any;
  MTransport: string;
  Trcode: any;
  DepositorType: any;
  DepositorCode: any;
  TruckMemoNo: any;
  TruckMemoDate: Date = new Date();
  ManualDocNo: any;
  LNo: any;
  LFrom: any;
  //SR-Item Details
  TStockNo: any;
  Scheme: any;
  ICode: any;
  IPCode: any;
  NoPacking: number;
  GKgs: number;
  NKgs: number;
  WTCode: any;
  Moisture: string;
  //SR-Freight Details
  TransporterName: string;
  LWBillNo: any;
  LWBillDate: Date = new Date();
  Kilometers: number;
  FreightAmount: number;
  WHDNo: any;
  WCharges: number;
  HCharges: number;
  GUnserviceable: any;
  GServiceable: any;
  GPatches: any;
  FCode: string;
  VCode: string;
  Gunnyutilised: any;
  GunnyReleased: any;
  mno: any;
  TStation: string;
  FStation: string;
  RRNo: any;
  LDate: Date = new Date();
  WNo: any;
  Remarks: string;
  username: any;
  UnLoadingSlip: any;
  curMonth: any;
  isViewed: boolean = false;
  blockScreen: boolean;
  @ViewChild('tr') transactionPanel: Dropdown;
  @ViewChild('m') monthPanel: Dropdown;
  @ViewChild('y') yearPanel: Dropdown;
  @ViewChild('dt') depositorTypePanel: Dropdown;
  @ViewChild('dn') depositorNamePanel: Dropdown;
  @ViewChild('sc') schemePanel: Dropdown;
  @ViewChild('i_desc') commodityPanel: Dropdown;
  @ViewChild('st_no') stackNoPanel: Dropdown;
  @ViewChild('pt') packingPanel: Dropdown;
  @ViewChild('wmt') weightmentPanel: Dropdown;
  @ViewChild('vc') vehiclePanel: Dropdown;
  @ViewChild('fc') freightPanel: Dropdown;

  constructor(private authService: AuthService, private tableConstants: TableConstants,
    private roleBasedService: RoleBasedService, private restAPIService: RestAPIService,
    private datepipe: DatePipe, private messageService: MessageService, private http: HttpClient) {
  }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.scheme_data = this.roleBasedService.getSchemeData();
    this.data = this.roleBasedService.getInstance();
    this.itemCol = this.tableConstants.StockReceiptItemColumns;
    this.documentViewCol = this.tableConstants.StockReceiptDocumentViewCols;
    this.maxDate = new Date();
    this.username = JSON.parse(this.authService.getCredentials());
    this.curMonth = "0" + (new Date().getMonth() + 1);
    this.month = this.datepipe.transform(new Date(), 'MMM');
    this.monthOptions = [{ label: this.month, value: this.curMonth }];
    this.year = new Date().getFullYear();
    this.yearOptions = [{ label: this.year, value: this.year }];
    setTimeout(() => {
      this.regionName = this.data[0].RName;
      this.godownName = this.data[0].GName;
      this.ReceivingCode = this.data[0].GCode;
      this.RCode = this.data[0].RCode;
    }, 1200);
  }

  onSelect(selectedItem, type) {
    let transactoinSelection: any = [];
    let schemeSelection: any = [];
    let depositorNameList: any = [];
    let itemDesc: any = [];
    let yearArr: any = [];
    let depositorTypeList: any = [];
    let packingTypes: any = [];
    let stackNo: any = [];
    let weighment: any = [];
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
              if (y.TransType === this.TransType) {
                transactoinSelection.push({ 'label': y.TRName, 'value': y.TRCode });
              }
            });
            this.transactionOptions = transactoinSelection.slice(0);
            this.transactionOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
          } else {
            this.transactionOptions = transactoinSelection.slice(0);
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
          // this.isItemDescEnabled = (this.Scheme !== null && this.Scheme !== undefined) ? false : true;
        } else {
          this.schemeOptions = schemeSelection;
        }
        break;
      case 'dt':
        if (type === 'enter') {
          this.depositorTypePanel.overlayVisible = true;
        }
        if (this.Trcode !== undefined && this.Trcode !== null) {
          if ((this.Trcode.value !== undefined && this.Trcode.value !== null)
            || (this.trCode !== undefined && this.trCode !== null)) {
            const params = new HttpParams().set('TRCode', (this.Trcode.value !== undefined) ? this.Trcode.value : this.trCode).append('GCode', this.ReceivingCode);
            this.restAPIService.getByParameters(PathConstants.DEPOSITOR_TYPE_MASTER, params).subscribe((res: any) => {
              if (res !== undefined && res !== null && res.length !== 0) {
                res.forEach(dt => {
                  depositorTypeList.push({ 'label': dt.Tyname, 'value': dt.Tycode });
                });
                this.depositorTypeOptions = depositorTypeList;
                this.depositorTypeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
              }
              //  this.isDepositorNameDisabled = (this.DepositorType !== null && this.DepositorType !== undefined) ? false : true;
            });
          }
        } else {
          this.depositorTypeOptions = depositorTypeList;
        }
        break;
      case 'dn':
        if (type === 'enter') {
          this.depositorNamePanel.overlayVisible = true;
        }
        if (this.Trcode !== undefined && this.Trcode !== null && this.DepositorType !== null && this.DepositorType !== undefined) {
          if ((this.DepositorType.value !== undefined && this.DepositorType.value !== null)
            || (this.depositorType !== null && this.depositorType !== undefined)) {
            const params = new HttpParams().set('TyCode', (this.DepositorType.value !== undefined) ?
              this.DepositorType.value : this.depositorType).append('TRType', this.TransType).append('GCode', this.ReceivingCode)
              .append('TRCode', (this.Trcode.value !== undefined) ? this.Trcode.value : this.trCode);
            this.restAPIService.getByParameters(PathConstants.DEPOSITOR_NAME_MASTER, params).subscribe((res: any) => {
              if (res !== undefined && res !== null && res.length !== 0) {
                res.forEach(dn => {
                  depositorNameList.push({ 'label': dn.DepositorName, 'value': dn.DepositorCode });
                })
                this.depositorNameOptions = depositorNameList;
                this.depositorNameOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
              }
            });
          }
        } else {
          this.depositorNameOptions = depositorNameList;
        }
        break;
      case 'i_desc':
        if (type === 'enter') {
          this.commodityPanel.overlayVisible = true;
        }
         if (this.Scheme !== undefined && this.Scheme !== null) {
          if ((this.Scheme.value !== undefined && this.Scheme.value !== null)
            || (this.schemeCode !== undefined && this.schemeCode !== null)) {
            const params = new HttpParams().set('SCode', (this.Scheme.value !== undefined) ? this.Scheme.value : this.schemeCode);
            this.restAPIService.getByParameters(PathConstants.COMMODITY_FOR_SCHEME, params).subscribe((res: any) => {
              if (res !== undefined && res !== null && res.length !== 0) {
                res.forEach(i => {
                  itemDesc.push({ 'label': i.ITDescription, 'value': i.ITCode });
                })
                this.itemDescOptions = itemDesc;
                this.itemDescOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
              }
            });
            //  this.isStackNoEnabled = (this.ICode !== null && this.ICode !== undefined) ? false : true;
          }
        } else {
          this.itemDescOptions = itemDesc;
        }
        break;
      case 'st_no':
        if (type === 'enter') {
          this.stackNoPanel.overlayVisible = true;
        } 
        if (this.ReceivingCode !== undefined && this.ICode !== null && this.ICode !== undefined) {
          if ((this.ICode.value !== undefined && this.ICode.value !== null)
            || (this.iCode !== undefined && this.iCode !== null)) {
            const params = new HttpParams().set('GCode', this.ReceivingCode).append('ITCode', (this.ICode.value !== undefined) ? this.ICode.value : this.iCode);
            this.restAPIService.getByParameters(PathConstants.STACK_DETAILS, params).subscribe((res: any) => {
              if (res !== undefined && res !== null && res.length !== 0) {
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
          if (res !== undefined && res !== null && res.length !== 0) {
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
        // if (this.wmtOptions === undefined) {
        if (type === 'enter') {
          this.weightmentPanel.overlayVisible = true;
        }
         this.restAPIService.get(PathConstants.PACKING_AND_WEIGHMENT).subscribe((res: any) => {
          if (res.Table1 !== undefined && res.Table1 !== null && res.Table1.length !== 0) {
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
        this.depositorNameOptions = this.depositorTypeOptions = [];
        this.DepositorCode = null; this.DepositorType = null;
        this.depositorCode = null; this.depositorType = null;
        break;
      case 'dt':
        this.depositorNameOptions = [];
        this.DepositorCode = null; this.depositorCode = null;
        break;
      case 'sc':
        this.itemDescOptions = []; this.stackOptions = [];
        this.iCode = null; this.ICode = null; this.TStockNo = null;
        break;
      case 'i_desc':
        this.stackOptions = [];
        this.TStockNo = null;
        break;
    }
  }

  deleteRow(data, index) {
    this.Scheme = data.SchemeName; this.schemeCode = data.Scheme;
    this.ICode = data.CommodityName; this.iCode = data.ICode;
    this.IPCode = data.PackingName; this.ipCode = data.IPCode;
    this.GKgs = data.GKgs; this.NKgs = data.Nkgs;
    this.NoPacking = data.NoPacking; this.TStockNo = data.TStockNo;
    this.WTCode = data.WmtType; this.wtCode = data.WTCode;
    this.Moisture = (data.Moisture * 1).toFixed(2);
    this.schemeOptions = [{ label: data.SchemeName, value: data.Scheme }];
    this.packingTypeOptions = [{ label: data.PackingName, value: data.IPCode }];
    this.itemDescOptions = [{ label: data.CommodityName, value: data.ICode }];
    this.stackOptions = [{ label: data.TStockNo, value: data.TStockNo }];
    this.wmtOptions = [{ label: data.WmtType, value: data.WTCode }];
    if (this.TStockNo !== undefined && this.TStockNo !== null) {
      let index;
      index = this.TStockNo.toString().indexOf('/', 2);
      const totalLength = this.TStockNo.length;
      this.godownNo = this.TStockNo.toString().slice(0, index);
      this.locationNo = this.TStockNo.toString().slice(index + 1, totalLength);
    }
    this.StackBalance = ((this.StackBalance * 1) > (this.NKgs * 1)) ?
      ((this.StackBalance * 1) - (this.NKgs * 1)) : (this.StackBalance * 1);
    this.tareWt = (this.GKgs !== undefined && this.NKgs !== undefined) ? ((this.GKgs * 1) - (this.NKgs * 1)) : 0;
    this.itemData.splice(index, 1);
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
    if (this.NoPacking !== undefined && this.NoPacking !== null
      && this.IPCode !== undefined && this.IPCode.weight !== undefined) {
      this.GKgs = this.NKgs = this.NoPacking * this.IPCode.weight;
      this.tareWt = (this.GKgs * 1) - (this.NKgs * 1);
    } else {
      this.GKgs = this.NKgs = this.tareWt = 0;
    }
  }

  onCalculateWt() {
    if (this.GKgs !== undefined && this.NKgs !== undefined) {
      this.tareWt = (this.GKgs * 1) - (this.NKgs * 1);
    }
    if (this.GKgs < this.NKgs) {
      this.NKgs = this.GKgs = this.tareWt = 0;
    }
  }
  onStackNoChange(event) {
    this.messageService.clear();
    if (this.TStockNo !== undefined && this.TStockNo !== null) {
      this.stackYear = this.TStockNo.stack_yr;
      let index;
      index = this.TStockNo.value.toString().indexOf('/', 2);
      const totalLength = this.TStockNo.value.length;
      this.godownNo = this.TStockNo.value.toString().slice(0, index);
      this.locationNo = this.TStockNo.value.toString().slice(index + 1, totalLength);
    } else {
      this.godownNo = this.stackYear = this.locationNo = null;
    }
    let stack_data = event.value;
    const params = {
      TStockNo: stack_data.value,
      StackDate: this.datepipe.transform(stack_data.stack_date, 'MM/dd/yyyy'),
      GCode: this.ReceivingCode,
      ICode: (this.ICode.value !== undefined && this.ICode.value !== null) ? this.ICode.value : this.iCode,
      Type: 1
    }
    this.restAPIService.post(PathConstants.STACK_BALANCE, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.StackBalance = (res[0].StackBalance * 1).toFixed(3);
        this.StackBalance = (this.StackBalance * 1);
      }
    })
  }

  onEnter() {
    let stackBalance;
    this.itemData.push({
      'TStockNo': (this.TStockNo.value !== undefined) ? this.TStockNo.value : this.TStockNo,
      'Scheme': (this.Scheme.value !== undefined) ? this.Scheme.value : this.schemeCode,
      'ICode': (this.ICode.value !== undefined) ? this.ICode.value : this.iCode,
      'IPCode': (this.IPCode.value !== undefined) ? this.IPCode.value : this.ipCode,
      'NoPacking': this.NoPacking, 'GKgs': this.GKgs, 'Nkgs': this.NKgs,
      'WTCode': (this.WTCode.value !== undefined) ? this.WTCode.value : this.wtCode,
      'Moisture': this.Moisture,
      'CommodityName': (this.ICode.label !== undefined) ? this.ICode.label : this.ICode,
      'SchemeName': (this.Scheme.label !== undefined) ? this.Scheme.label : this.Scheme,
      'PackingName': (this.IPCode.label !== undefined) ? this.IPCode.label : this.IPCode,
      'WmtType': (this.WTCode.label !== undefined) ? this.WTCode.label : this.WTCode
    });
    if (this.itemData.length !== 0) {
      stackBalance = (stackBalance !== undefined) ? (stackBalance * 1) : 0;
      this.itemData.forEach(x => {
        if (x.TStockNo === this.TStockNo.value) {
          stackBalance += (x.Nkgs * 1);
        }
      });
      this.StackBalance += stackBalance;
      this.ICode = null; this.TStockNo = null; this.Scheme = null; this.IPCode = null;
      this.WTCode = null; this.Moisture = null; this.NoPacking = null;
      this.GKgs = null; this.NKgs = null; this.WTCode = null; this.tareWt = null;
      this.godownNo = null; this.locationNo = null; this.stackYear = null;
      this.schemeOptions = []; this.itemDescOptions = []; this.stackOptions = [];
      this.packingTypeOptions = []; this.wmtOptions = [];
    }
  }

  onSave(type) {
    this.blockScreen = true;
    this.messageService.clear();
    this.PAllotment = this.year + '/' + ((this.month.value !== undefined) ? this.month.value : this.curMonth);
    if (this.selectedValues.length !== 0) {
      if (this.selectedValues.length === 2) {
        this.MTransport = 'UPCountry';
      } else if (this.selectedValues.length === 1) {
        this.MTransport = (this.selectedValues[0] === 'Rail') ? 'Rail' : 'Road';
      }
    }
    const params = {
      'Type': type,
      'SRNo': (this.SRNo !== undefined && this.SRNo !== null) ? this.SRNo : 0,
      'RowId': (this.RowId !== undefined && this.RowId !== null) ? this.RowId : 0,
      'SRDate': this.datepipe.transform(this.SRDate, 'MM/dd/yyyy'),
      'PAllotment': this.PAllotment,
      'OrderNo': this.OrderNo,
      'OrderDate': this.datepipe.transform(this.OrderDate, 'MM/dd/yyyy'),
      'ReceivingCode': this.ReceivingCode,
      'RCode': this.RCode,
      'MTransport': (this.MTransport !== undefined && this.MTransport !== null) ? this.MTransport : '-',
      'Trcode': (this.Trcode.value !== undefined) ? this.Trcode.value : this.trCode,
      'DepositorType': (this.DepositorType.value !== undefined && this.DepositorType.value !== null) ? this.DepositorType.value : this.depositorType,
      'DepositorCode': (this.DepositorCode.value !== undefined && this.DepositorCode.value !== null) ? this.DepositorCode.value : this.depositorCode,
      'TruckMemoNo': this.TruckMemoNo,
      'TruckMemoDate': this.datepipe.transform(this.TruckMemoDate, 'MM/dd/yyyy'),
      'ManualDocNo': this.ManualDocNo,
      'LNo': (this.LNo !== undefined && this.LNo !== null) ? this.LNo.toString().toUpperCase() : '-',
      'LFrom': (this.LFrom !== undefined && this.LFrom !== null) ? this.LFrom : '-',
      'ItemList': this.itemData,
      'Remarks': (this.Remarks !== undefined && this.Remarks !== null) ? this.Remarks : '-',
      'GodownName': this.godownName,
      'TransactionType': (this.DepositorType.label !== undefined && this.DepositorType.label !== null) ? this.DepositorType.label : this.DepositorType,
      'DepositorName': (this.DepositorCode.label !== undefined && this.DepositorCode.label !== null) ? this.DepositorCode.label : this.DepositorCode,
      'UserID': this.username.user,
      'RegionName': this.regionName,
      'UnLoadingSlip': (this.SRNo === 0) ? 'N' : this.UnLoadingSlip
    }
    this.restAPIService.post(PathConstants.STOCK_RECEIPT_DOCUMENT, params).subscribe(res => {
      if (res.Item1 !== undefined && res.Item1 !== null && res.Item2 !== undefined && res.Item2 !== null) {
        if (res.Item1) {
          this.isSaveSucceed = true;
          this.isViewed = false;
          this.blockScreen = false;
          this.onClear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: res.Item2 });
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
    this.messageService.clear();
    this.viewPane = true;
    const params = new HttpParams().set('sValue', this.datepipe.transform(this.viewDate, 'MM/dd/yyyy')).append('GCode', this.ReceivingCode).append('Type', '1');
    this.restAPIService.getByParameters(PathConstants.STOCK_RECEIPT_VIEW_DOCUMENT, params).subscribe((res: any) => {
      if (res !== undefined && res !== null && res.length !== 0) {
        res.forEach(data => {
          data.OrderDate = this.datepipe.transform(data.OrderDate, 'dd-MM-yyyy');
          data.SRDate = this.datepipe.transform(data.SRDate, 'dd-MM-yyyy');
        })
        this.documentViewData = res;
      } else {
        this.documentViewData = [];
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage });
      }
    });
  }

  onRowSelect(event) {
    this.SRNo = event.data.SRNo;
  }

  getDocBySRNo() {
    this.messageService.clear();
    this.viewPane = false;
    this.isViewed = true;
    this.itemData = [];
    const params = new HttpParams().set('sValue', this.SRNo).append('Type', '2');
    this.restAPIService.getByParameters(PathConstants.STOCK_RECEIPT_VIEW_DOCUMENT, params).subscribe((res: any) => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.SRNo = res[0].SRNO;
        this.SRDate = new Date(res[0].SRDate);
        this.RowId = res[0].RowId;
        this.OrderDate = new Date(res[0].OrderDate);
        this.OrderNo = res[0].OrderNo;
        this.TruckMemoDate = new Date(res[0].TruckMemoDate);
        this.TruckMemoNo = res[0].TruckMemoNo;
        this.LNo = res[0].LNo;
        this.LFrom = res[0].LFrom;
        let currentYr = new Date().getFullYear();
        let today = new Date().getDate();
        this.curMonth = res[0].Pallotment.slice(5, 7);
        let formDate = this.curMonth + "-" + today + "-" + currentYr;
        this.monthOptions = [{ label: this.datepipe.transform(new Date(formDate), 'MMM'), value: this.curMonth }]
        this.month = this.datepipe.transform(new Date(formDate), 'MMM');
        this.yearOptions = [{ label: res[0].Pallotment.slice(0, 4), value: res[0].Pallotment.slice(0, 4) }]
        this.year = res[0].Pallotment.slice(0, 4);
        this.transactionOptions = [{ label: res[0].TRName, value: res[0].Trcode }];
        this.Trcode = res[0].TRName;
        this.trCode = res[0].Trcode;
        this.depositorTypeOptions = [{ label: res[0].DepositorType, value: res[0].IssuerType }];
        this.DepositorType = res[0].DepositorType;
        this.depositorType = res[0].IssuerType;
        this.depositorNameOptions = [{ label: res[0].DepositorName, value: res[0].IssuingCode }];
        this.DepositorCode = res[0].DepositorName;
        this.depositorCode = res[0].IssuingCode;
        this.PAllotment = res[0].Pallotment;
        this.LNo = res[0].LNo;
        this.selectedValues = [res[0].TransportMode];
        this.ManualDocNo = res[0].Flag1;
        this.Remarks = (res[0].Remarks.toString().trim().length !== 0) ? res[0].Remarks : "-";
        this.UnLoadingSlip = res[0].UnLoadingSlip;
        res.forEach(i => {
          this.itemData.push({
            TStockNo: i.TStockNo,
            Scheme: i.Scheme,
            ICode: i.ICode,
            IPCode: i.IPCode,
            NoPacking: i.NoPacking, GKgs: i.GKgs, Nkgs: i.Nkgs,
            WTCode: i.WTCode,
            Moisture: i.Moisture,
            CommodityName: i.ITName,
            SchemeName: i.SCName,
            PackingName: i.PName,
            WmtType: i.WEType
          })
        });
      } else {
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage });
      }
    });
  }

  onPrint() {
    if(this.isViewed) {
      this.onSave('2');
    }
    const path = "../../assets/Reports/" + this.username.user + "/";
    const filename = this.ReceivingCode + GolbalVariable.StockReceiptDocument;
    let filepath = path + filename + ".txt";
    saveAs(filepath, filename);
    // this.http.get(filepath, {responseType: 'text'})
    //   .subscribe(data => {
    //     var doc = new jsPDF({
    //       orientation: 'landscape',
    //     })
    //     doc.setFont('courier');
    //     doc.setFontSize(10);
    //     doc.text(data, 2, 2)
    //     doc.save(filename + '.pdf');
    //     var w = window.open(filename + '.pdf');
    //     w.print();
    //     this.isSaveSucceed = (this.isSaveSucceed) ? false : true;
    //     this.isViewed = (this.isViewed) ? false : true;    
    //   });
  }

  onClear() {
    this.itemData = [];
    this.curMonth = "0" + (new Date().getMonth() + 1);
    this.month = this.datepipe.transform(new Date(), 'MMM');
    this.monthOptions = [{ label: this.month, value: this.curMonth }];
    this.year = new Date().getFullYear();
    this.yearOptions = [{ label: this.year, value: this.year }];
    this.OrderNo = null; this.selectedValues = ['Road']; this.Trcode = null;
    this.DepositorCode = null; this.DepositorType = null; this.TruckMemoNo = null;
    this.LNo = null; this.LFrom = null; this.ManualDocNo = null; this.trCode = null;
    this.depositorCode = null; this.depositorType = null; this.ICode = null; this.iCode = null;
    this.IPCode = null; this.ipCode = null; this.TStockNo = null; this.NoPacking = null;
    this.schemeCode = null; this.Scheme = null; this.Remarks = null;
    this.transactionOptions = []; this.schemeOptions = []; this.itemDescOptions = [];
    this.depositorNameOptions = []; this.depositorTypeOptions = [];
    this.stackOptions = []; this.wmtOptions = []; this.packingTypeOptions = [];
    this.StackBalance = 0; this.GKgs = 0; this.tareWt = 0; this.NKgs = 0; this.SRNo = null;
    this.TruckMemoDate = this.SRDate = this.OrderDate = new Date();
  }

  openNext() {
    this.index = (this.index === 2) ? 0 : this.index + 1;
  }

  openPrev() {
    this.index = (this.index === 0) ? 2 : this.index - 1;
  }
}