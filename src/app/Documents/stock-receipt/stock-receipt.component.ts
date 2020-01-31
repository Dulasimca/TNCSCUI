import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { SelectItem, MessageService } from 'primeng/api';
import { PathConstants } from 'src/app/constants/path.constants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { Dropdown } from 'primeng/primeng';
import { StatusMessage } from 'src/app/constants/Messages';
import { NgForm } from '@angular/forms';


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
  tareWt: any;
  maxDate: Date;
  enableActions: boolean = true;
  viewDate: Date;
  moistureOptions: SelectItem[];
  itemDescOptions: SelectItem[];
  schemeOptions: SelectItem[];
  packingTypeOptions: SelectItem[];
  locationNo: string;
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
  OrderNo: any = '-';
  OrderDate: Date;
  StackBalance: any = 0;
  viewPane: boolean;
  canShowMenu: boolean;
  ReceivingCode: string;
  RCode: any;
  //SR-Details
  SRNo: any;
  SRDate: Date;
  PAllotment: any;
  MTransport: string;
  Trcode: any;
  DepositorType: any;
  DepositorCode: any;
  TruckMemoNo: any = '-';
  TruckMemoDate: Date;
  ManualDocNo: any = '-';
  LNo: any;
  LFrom: any = '-';
  //SR-Item Details
  TStockNo: any;
  Scheme: any;
  ICode: any;
  IPCode: any;
  NoPacking: any;
  PWeight: any;
  GKgs: any;
  NKgs: any;
  WTCode: any;
  Moisture: any;
  //SR-Freight Details
  TransporterName: any = '-';
  LWBillNo: any = '-';
  LWBillDate: Date;
  Kilometers: number = 0;
  FreightAmount: number = 0;
  WHDNo: any;
  WCharges: number = 0;
  HCharges: number = 0;
  GUnserviceable: any = 0;
  GServiceable: any = 0;
  GPatches: any = 0;
  FCode: string;
  VCode: string;
  Gunnyutilised: any = 0;
  GunnyReleased: any = 0;
  mno: any = 0;
  StackNo: any;
  TStation: string;
  FStation: string;
  RRNo: any = 0;
  LDate: Date;
  WNo: any = 0;
  Remarks: string;
  username: any;
  UnLoadingSlip: any;
  curMonth: any;
  isViewed: boolean = false;
  blockScreen: boolean;
  stackCompartment: string = '';
  checkTrType: boolean = true;
  DOCNumber: any;
  submitted: boolean;
  missingFields: any;
  field: any;
  selected: any;
  disableSave: boolean = false;
  // isSaved: boolean = false;
  @ViewChild('tr', { static: false }) transactionPanel: Dropdown;
  @ViewChild('m', { static: false }) monthPanel: Dropdown;
  @ViewChild('y', { static: false }) yearPanel: Dropdown;
  @ViewChild('dt', { static: false }) depositorTypePanel: Dropdown;
  @ViewChild('dn', { static: false }) depositorNamePanel: Dropdown;
  @ViewChild('sc', { static: false }) schemePanel: Dropdown;
  @ViewChild('i_desc', { static: false }) commodityPanel: Dropdown;
  @ViewChild('st_no', { static: false }) stackNoPanel: Dropdown;
  @ViewChild('pt', { static: false }) packingPanel: Dropdown;
  @ViewChild('wmt', { static: false }) weightmentPanel: Dropdown;
  @ViewChild('vc', { static: false }) vehiclePanel: Dropdown;
  @ViewChild('fc', { static: false }) freightPanel: Dropdown;

  constructor(private authService: AuthService, private tableConstants: TableConstants,
    private roleBasedService: RoleBasedService, private restAPIService: RestAPIService,
    private datepipe: DatePipe, private messageService: MessageService) {
  }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.scheme_data = this.roleBasedService.getSchemeData();
    this.itemCol = this.tableConstants.StockReceiptItemColumns;
    this.documentViewCol = this.tableConstants.StockReceiptDocumentViewCols;
    this.username = JSON.parse(this.authService.getCredentials());
    this.curMonth = "0" + (new Date().getMonth() + 1);
    this.month = this.datepipe.transform(new Date(), 'MMM');
    this.monthOptions = [{ label: this.month, value: this.curMonth }];
    this.year = new Date().getFullYear();
    this.yearOptions = [{ label: this.year, value: this.year }];
    this.regionName = this.authService.getUserAccessible().rName;
    this.godownName = this.authService.getUserAccessible().gName;
    this.ReceivingCode = this.authService.getUserAccessible().gCode;
    this.RCode = this.authService.getUserAccessible().rCode;
    const maxDate = new Date(JSON.parse(this.authService.getServerDate()));
    this.maxDate = (maxDate !== null && maxDate !== undefined) ? maxDate : new Date();
    this.viewDate = this.maxDate;
    this.SRDate = this.maxDate;
    this.OrderDate = this.maxDate;
    this.TruckMemoDate = this.maxDate;
    this.LWBillDate = this.maxDate;
    this.LDate = this.maxDate;
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
        // if(this.transactionOptions === undefined || this.isViewed) {
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
        // }
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
            const params = new HttpParams().set('GCode', this.ReceivingCode).append('ITCode', (this.ICode.value !== undefined) ? this.ICode.value : this.iCode)
              .append('TRCode', (this.Trcode.value !== undefined) ? this.Trcode.value : this.trCode);
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
        if (type === 'enter') {
          this.packingPanel.overlayVisible = true;
        }
        // if(this.packingTypeOptions === undefined || this.isViewed) {
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
        if (type === 'enter') {
          this.weightmentPanel.overlayVisible = true;
        }
        // if(this.wmtOptions === undefined || this.isViewed) {
        this.restAPIService.get(PathConstants.PACKING_AND_WEIGHMENT).subscribe((res: any) => {
          if (res.Table1 !== undefined && res.Table1 !== null && res.Table1.length !== 0) {
            res.Table1.forEach(w => {
              weighment.push({ 'label': w.WEType, 'value': w.WECode });
            })
            this.wmtOptions = weighment;
            this.wmtOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
          }
        });
        //  }
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
    let sno = 1;
    this.Scheme = data.SchemeName; this.schemeCode = data.Scheme;
    this.ICode = data.CommodityName; this.iCode = data.ICode;
    this.IPCode = data.PackingName; this.ipCode = data.IPCode;
    this.GKgs = (data.GKgs * 1).toFixed(3);
    this.NKgs = (data.Nkgs * 1).toFixed(3);
    this.NoPacking = data.NoPacking; this.TStockNo = data.TStockNo;
    this.PWeight = (data.PWeight * 1);
    this.WTCode = data.WmtType; this.wtCode = data.WTCode;
    this.Moisture = ((data.Moisture * 1) !== 0) ? (data.Moisture * 1).toFixed(2) : (data.Moisture * 1).toFixed(0);
    this.schemeOptions = [{ label: data.SchemeName, value: data.Scheme }];
    this.packingTypeOptions = [{ label: data.PackingName, value: data.IPCode }];
    this.itemDescOptions = [{ label: data.CommodityName, value: data.ICode }];
    this.stackOptions = [{ label: data.TStockNo, value: data.TStockNo }];
    this.wmtOptions = [{ label: data.WmtType, value: data.WTCode }];
    this.stackYear = data.StackYear;
    if (this.TStockNo !== undefined && this.TStockNo !== null) {
      let index;
      index = this.TStockNo.toString().indexOf('/', 2);
      const totalLength = this.TStockNo.length;
      this.godownNo = this.TStockNo.toString().slice(0, index);
      this.locationNo = this.TStockNo.toString().slice(index + 1, totalLength);
    }
    this.StackBalance = ((this.StackBalance * 1) > (this.NKgs * 1)) ?
      ((this.StackBalance * 1) - (this.NKgs * 1)) : (this.StackBalance * 1);
    this.tareWt = (this.GKgs !== undefined && this.NKgs !== undefined) ? ((this.GKgs * 1) - (this.NKgs * 1)).toFixed(3) : 0;
    this.itemData.splice(index, 1);
    this.itemData.forEach(x => { x.sno = sno; sno += 1; })
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
          endValue = (endValue !== undefined && endValue !== '') ? endValue : '';
          this.Moisture = (endValue.trim() !== '') ? (startValue + '.' + endValue) : startValue;
        }
      }
    } else {
      return true;
    }
  }

  onCalculateKgs() {
    if (this.NoPacking !== undefined && this.NoPacking !== null
      && this.IPCode !== undefined && this.IPCode !== null) {
      let NoOfPacking = (this.NoPacking * 1);
      let wt = (this.IPCode.weight !== undefined && this.IPCode.weight !== null) ? this.IPCode.weight : this.PWeight;
      this.GKgs = this.NKgs = (NoOfPacking * (wt * 1));
      this.tareWt = ((this.GKgs * 1) - (this.NKgs * 1)).toFixed(3);
    } else {
      this.GKgs = null; this.NKgs = null; this.tareWt = null;
    }
  }

  onCalculateWt(value, id) {
    const kgs = (value * 1);
    if(kgs !== null && kgs !== undefined) {
      if(id === 'gkgs') { this.NKgs = kgs; }
    }
    if (this.GKgs !== undefined && this.GKgs !== null && this.NKgs !== undefined && this.NKgs !== null) {
      let grossWt = (this.GKgs * 1);
      let netWt = (this.NKgs * 1);
      if (grossWt < netWt) {
        this.NKgs = null; this.GKgs = null; this.tareWt = null;
      } else {
        this.tareWt = (grossWt - netWt).toFixed(3);
      }
    }
  }

  onStackNoChange(event) {
    this.messageService.clear();
    this.stackCompartment = null;
    if (this.TStockNo !== undefined && this.TStockNo !== null) {
      const trcode = (this.Trcode.value !== null && this.Trcode.value !== undefined) ?
        this.Trcode.value : this.trCode;
      this.checkTrType = (trcode === 'TR023') ? false : true;
      this.stackYear = (this.TStockNo.stack_yr !== undefined && this.TStockNo.stack_yr !== null) ? this.TStockNo.stack_yr : this.stackYear;
      // const stackDate = (this.TStockNo.stack_date !== undefined && this.TStockNo.stack_date !== null) ?
      // this.TStockNo.stack_date : this.stackda
      this.checkStackAndReceiptDate(new Date(this.TStockNo.stack_date));
      let ind;
      let stockNo: string = (this.TStockNo.value !== undefined && this.TStockNo.value !== null) ? this.TStockNo.value : this.TStockNo;
      ind = stockNo.indexOf('/', 2);
      const totalLength = stockNo.length;
      this.godownNo = stockNo.slice(0, ind);
      this.locationNo = stockNo.slice(ind + 1, totalLength);
      const params = {
        DocNo: (this.SRNo !== undefined && this.SRNo !== null) ? this.SRNo : 0,
        TStockNo: stockNo,
        StackDate: this.datepipe.transform(this.TStockNo.stack_date, 'MM/dd/yyyy'),
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
    } else {
      this.godownNo = null; this.stackYear = null;
      this.locationNo = null; this.stackCompartment = null;
      this.StackBalance = null;
    }
  }

  onSRDateChange() {
    this.checkStackAndReceiptDate(new Date(this.TStockNo.stack_date));
  }

  checkStackAndReceiptDate(stackCardDate) {
    if(stackCardDate !== null && stackCardDate !== undefined && this.SRDate !== undefined && this.SRDate !== null) {
      const receiptDate = this.SRDate.getDate();
      const receiptYear = this.SRDate.getFullYear();
      const receiptMonth = this.SRDate.getMonth() + 1;
      const stackDate = stackCardDate.getDate();
      const stackYear = stackCardDate.getFullYear();
      const stackMonth = stackCardDate.getMonth() + 1;
      if ((stackDate > receiptDate && ((stackMonth >= receiptMonth && stackYear >= receiptYear) ||
      (stackMonth === receiptMonth && stackYear === receiptYear))) ||
      (stackMonth > receiptMonth && stackYear === receiptYear) || (stackYear > receiptYear)) {
         this.disableSave = true;
         this.messageService.clear();
         this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR,
         life:300, sticky: true, detail: StatusMessage.NotValidReceiptDateForStackCard });
        } else {
          this.disableSave = false;
          this.messageService.clear();
        }
    }
  }

  onStackInput(event) {
    let value = event.data;
    if (this.TStockNo !== undefined && this.TStockNo !== null) {
      this.stackYear = (this.TStockNo.stack_yr !== undefined && this.TStockNo.stack_yr !== null) ?
        this.TStockNo.stack_yr : this.stackYear;
      let index;
      index = this.TStockNo.value.toString().indexOf('/', 2);
      const totalLength = this.TStockNo.value.length;
      this.godownNo = this.TStockNo.value.toString().slice(0, index);
      if (this.stackCompartment !== undefined && this.stackCompartment !== null) {
        this.locationNo = this.TStockNo.value.toString().slice(index + 1, totalLength).trim() + this.stackCompartment.toUpperCase();
      } else {
        this.locationNo = this.TStockNo.value.toString().slice(index + 1, totalLength).trim();
      }
    }
  }

  onEnter() {
    let stackBalance;
    this.itemData.push({
      TStockNo: (this.TStockNo.value !== undefined) ?
        this.TStockNo.value.trim() + ((this.stackCompartment !== undefined && this.stackCompartment !== null) ? this.stackCompartment.toUpperCase() : '')
        : this.TStockNo.trim() + ((this.stackCompartment !== undefined && this.stackCompartment !== null) ? this.stackCompartment.toUpperCase() : ''),
      Scheme: (this.Scheme.value !== undefined) ? this.Scheme.value : this.schemeCode,
      ICode: (this.ICode.value !== undefined) ? this.ICode.value : this.iCode,
      IPCode: (this.IPCode.value !== undefined) ? this.IPCode.value : this.ipCode,
      NoPacking: this.NoPacking, GKgs: this.GKgs, Nkgs: this.NKgs,
      PWeight: (this.IPCode.weight !== undefined) ? this.IPCode.weight : this.PWeight,
      WTCode: (this.WTCode.value !== undefined) ? this.WTCode.value : this.wtCode,
      Moisture: this.Moisture,
      CommodityName: (this.ICode.label !== undefined) ? this.ICode.label : this.ICode,
      SchemeName: (this.Scheme.label !== undefined) ? this.Scheme.label : this.Scheme,
      PackingName: (this.IPCode.label !== undefined) ? this.IPCode.label : this.IPCode,
      WmtType: (this.WTCode.label !== undefined) ? this.WTCode.label : this.WTCode,
      StackYear: (this.stackYear !== undefined && this.stackYear !== null) ? this.stackYear : '-'
    });
    let sno = 1;
    if (this.itemData.length !== 0) {
      stackBalance = (stackBalance !== undefined) ? (stackBalance * 1) : 0;
      this.itemData.forEach(x => {
        x.sno = sno;
        if (x.TStockNo === this.TStockNo.value) {
          stackBalance += (x.Nkgs * 1);
        }
        sno += 1;
      });
      this.StackBalance += stackBalance;
      this.ICode = null; this.TStockNo = null; this.Scheme = null; this.IPCode = null;
      this.WTCode = null; this.Moisture = null; this.NoPacking = null;
      this.GKgs = null; this.NKgs = null; this.WTCode = null; this.tareWt = null;
      this.godownNo = null; this.locationNo = null; this.stackYear = null;
      this.schemeOptions = []; this.itemDescOptions = []; this.stackOptions = [];
      this.packingTypeOptions = []; this.wmtOptions = []; this.stackCompartment = null;
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
    this.SRNo = (this.SRNo !== undefined && this.SRNo !== null) ? this.SRNo : 0;
    this.RowId = (this.RowId !== undefined && this.RowId !== null) ? this.RowId : 0;
    this.UnLoadingSlip = (this.SRNo !== 0) ? this.UnLoadingSlip : 'N';
    const params = {
      'Type': type,
      'SRNo': this.SRNo,
      'RowId': this.RowId,
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
      'Remarks': (this.Remarks !== null && this.Remarks.trim() !== '') ? this.Remarks.trim() : '-',
      'GodownName': this.godownName,
      'TransactionName': (this.Trcode.label !== undefined && this.Trcode.label !== null) ? this.Trcode.label : this.Trcode,
      'DepositorName': (this.DepositorCode.label !== undefined && this.DepositorCode.label !== null) ? this.DepositorCode.label : this.DepositorCode,
      'UserID': this.username.user,
      'RegionName': this.regionName,
      'UnLoadingSlip': this.UnLoadingSlip,
      'TransporterName': (this.TransporterName.length !== 0 && this.TransporterName !== '') ? this.TransporterName : '-',
      'LWBNo': (this.LWBillNo !== undefined && this.LWBillNo !== null) ? this.LWBillNo : '-',
      'LDate': this.datepipe.transform(this.LDate, 'MM/dd/yyyy'),
      'LWBDate': this.datepipe.transform(this.LWBillDate, 'MM/dd/yyyy')
    }
    this.restAPIService.post(PathConstants.STOCK_RECEIPT_DOCUMENT, params).subscribe(res => {
      if (res.Item1 !== undefined && res.Item1 !== null && res.Item2 !== undefined && res.Item2 !== null) {
        if (res.Item1) {
          this.blockScreen = false;
          this.DOCNumber = res.Item3;
          if (type !== '2') {
            this.isSaveSucceed = true;
            this.isViewed = false;
          } else {
            this.isSaveSucceed = false;
            this.loadDocument();
            this.isViewed = false;
          }
          this.onClear();
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: res.Item2 });
        } else {
          this.isViewed = false;
          this.isSaveSucceed = false;
          this.blockScreen = false;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: res.Item2 });
        }
      }
    }, (err: HttpErrorResponse) => {
      this.isViewed = false;
      this.isSaveSucceed = false;
      this.blockScreen = false;
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.NetworkErrorMessage });
      }
    });
  }

  onView() {
    this.messageService.clear();
    this.viewPane = true;
    this.selected = null;
    const params = new HttpParams().set('sValue', this.datepipe.transform(this.viewDate, 'MM/dd/yyyy')).append('GCode', this.ReceivingCode).append('Type', '1');
    this.restAPIService.getByParameters(PathConstants.STOCK_RECEIPT_VIEW_DOCUMENT, params).subscribe((res: any) => {
      if (res !== undefined && res !== null && res.length !== 0) {
        let sno = 1;
        res.forEach(data => {
          data.sno = sno;
          data.OrderDate = this.datepipe.transform(data.OrderDate, 'dd-MM-yyyy');
          data.SRDate = this.datepipe.transform(data.SRDate, 'dd-MM-yyyy');
          sno += 1;
        })
        this.documentViewData = res;
      } else {
        this.documentViewData = [];
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.documentViewData = [];
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }

  onRowSelect(event) {
    this.selected = event;
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
        this.onClear();
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
        let formDate = this.SRDate //this.curMonth + "-" + today + "-" + currentYr;
        this.monthOptions = [{ label: this.datepipe.transform(new Date(formDate), 'MMM'), value: this.curMonth }]
        this.month = this.datepipe.transform(new Date(formDate), 'MMM');
        this.yearOptions = [{ label: res[0].Pallotment.slice(0, 4), value: res[0].Pallotment.slice(0, 4) }]
        this.year = res[0].Pallotment.slice(0, 4);
        this.transactionOptions = [{ label: res[0].TRName, value: res[0].Trcode }];
        this.Trcode = res[0].TRName;
        this.trCode = res[0].Trcode;
        this.TransporterName = (res[0].TransporterName !== undefined && res[0].TransporterName !== null) ? res[0].TransporterName : '-';
        this.checkTrType = ((res[0].Trcode !== null && res[0].Trcode !== undefined) &&
          res[0].Trcode === 'TR023') ? false : true;
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
        this.Remarks = res[0].Remarks.trim();
        this.UnLoadingSlip = res[0].Unloadingslip;
        let sno = 1;
        res.forEach(i => {
          this.itemData.push({
            sno: sno,
            TStockNo: i.TStockNo,
            Scheme: i.Scheme,
            ICode: i.ICode,
            IPCode: i.IPCode,
            NoPacking: i.NoPacking,
            PWeight: i.PWeight,
            GKgs: i.GKgs,
            Nkgs: i.Nkgs,
            WTCode: i.WTCode,
            Moisture: i.Moisture,
            CommodityName: i.ITName,
            SchemeName: i.SCName,
            PackingName: i.PName,
            WmtType: i.WEType,
            StackYear: i.StackYear,
          })
          sno += 1;
        });
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }

  resetForm(receiptForm: NgForm) {
    receiptForm.form.markAsUntouched();
    receiptForm.form.markAsPristine();
  }

  onPrint() {
    if (this.isViewed) {
      this.onSave('2');
    } else {
      this.loadDocument();
      const params = { DOCNumber: this.DOCNumber }
      this.restAPIService.put(PathConstants.STOCK_RECEIPT_DUPLICATE_DOCUMENT, params).subscribe(res => {
        if (res) { this.DOCNumber = null; }
      });
      this.isSaveSucceed = false;
      this.isViewed = false;
    }
  }

  loadDocument() {
    const path = "../../assets/Reports/" + this.username.user + "/";
    const filename = this.ReceivingCode + GolbalVariable.StockReceiptDocument;
    let filepath = path + filename + ".txt";
    var w = window.open(filepath);
    w.print();
    this.messageService.clear();
    this.messageService.clear();
  }

  onClear() {
    this.itemData = [];
    this.curMonth = "0" + (new Date().getMonth() + 1);
    this.month = this.datepipe.transform(new Date(), 'MMM');
    this.monthOptions = [{ label: this.month, value: this.curMonth }];
    this.year = new Date().getFullYear();
    this.yearOptions = [{ label: this.year, value: this.year }];
    this.OrderNo = '-'; this.selectedValues = ['Road']; this.Trcode = null;
    this.DepositorCode = null; this.DepositorType = null; this.TruckMemoNo = '-';
    this.LNo = null; this.LFrom = '-'; this.ManualDocNo = '-'; this.trCode = null;
    this.depositorCode = null; this.depositorType = null; this.ICode = null; this.iCode = null;
    this.IPCode = null; this.ipCode = null; this.TStockNo = null; this.NoPacking = null;
    this.schemeCode = null; this.Scheme = null; this.Remarks = null;
    this.stackCompartment = null; this.TransporterName = '-';
    this.transactionOptions = undefined; this.schemeOptions = []; this.itemDescOptions = [];
    this.depositorNameOptions = []; this.depositorTypeOptions = []; this.wtCode = null;
    this.WTCode = null; this.Moisture = null; this.godownNo = null; this.locationNo = null;
    this.stackOptions = []; this.wmtOptions = undefined; this.packingTypeOptions = undefined;
    this.StackBalance = 0; this.GKgs = 0; this.tareWt = 0; this.NKgs = 0; this.SRNo = null;
    this.TruckMemoDate = new Date(); this.SRDate = new Date(); this.OrderDate = new Date();
    // this.isSaved = false;
  }

  openNext() {
    this.index = (this.index === 2) ? 0 : this.index + 1;
  }

  openPrev() {
    this.index = (this.index === 0) ? 2 : this.index - 1;
  }

  onSubmit(form) {
    this.submitted = true;
    let arr = [];
    let no = 0;
    if (form.invalid) {
      for (var key in form.value) {
        if ((form.value[key] === undefined || form.value[key] === '') && (key !== 'receiptNo' && key !== 'GodownNo' && key !== 'LocNo'
          && key !== 'TareWt' && key !== 'GU/GR' && key !== 'StackBalance')) {
          no += 1;
          arr.push({ label: no, value: no + '.' + key });
        }
      }
      this.missingFields = arr;
    } else if (this.itemData.length === 0) {
      arr.push({ label: '1', value: 'Please add item details! ' });
      this.missingFields = arr;
    } else {
      this.submitted = false;
      this.messageService.clear();
      this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_ALERT, detail: StatusMessage.SuccessValidationMsg });
    }
  }
}