import { Component, OnInit, ViewChild } from '@angular/core';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { SelectItem, MessageService } from 'primeng/api';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GolbalVariable } from 'src/app/common/globalvariable';
import * as jsPDF from 'jspdf';
import { Dropdown } from 'primeng/primeng';
import { StatusMessage } from 'src/app/constants/Messages';

@Component({
  selector: 'app-truck-receipt',
  templateUrl: './truck-receipt.component.html',
  styleUrls: ['./truck-receipt.component.css']
})
export class TruckReceiptComponent implements OnInit {
  viewPane: boolean = false;
  isValidStackBalance: boolean;
  isSaveSucceed: boolean = false;
  viewDate: Date = new Date();
  data: any;
  username: any;
  regions: any;
  godowns: any;
  itemCols: any;
  itemData: any = [];
  truckMemoViewCol: any;
  truckMemoViewData: any = [];
  index: number = 0;
  maxDate: Date = new Date();
  selectedValues: string[] = ['Road'];
  enableReceivorRegn: boolean = true;
  disableRailHead: boolean = true;
  transactionOptions: SelectItem[];
  toRailHeadOptions: SelectItem[];
  toStationOptions: SelectItem[];
  fromStationOptions: SelectItem[];
  receivorTypeOptions: SelectItem[];
  receivorNameOptions: SelectItem[];
  receivorRegionOptions: SelectItem[];
  schemeOptions: SelectItem[];
  stackOptions: SelectItem[];
  itemDescOptions: SelectItem[];
  packingTypeOptions: SelectItem[];
  wmtOptions: SelectItem[];
  freightOptions: SelectItem[];
  vehicleOptions: SelectItem[];
  stackYear: any;
  scheme_data: any;
  godownName: string;
  regionName: string;
  canShowMenu: boolean;
  RowId: any;
  MTransport: any;
  TKgs: number;
  STNo: any;
  STDate: Date = new Date();
  Trcode: any;
  trCode: any;
  transType: string = "I";
  OrderNo: any;
  OrderDate: Date = new Date();
  RNo: any;
  RDate: Date = new Date();
  LorryNo: any;
  RHCode: any;
  rhCode: any;
  RTCode: any;
  RNCode: any;
  rnCode: any;
  RCode: any;
  GCode: any;
  RRCode: any;
  ManualDocNo: any;
  Scheme: any;
  schemeCode: any;
  TStockNo: any;
  StackDate: Date;
  ICode: any;
  iCode: any;
  GodownNo: any;
  LocationNo: any;
  IPCode: any;
  ipCode: any;
  PWeight: any;
  NoPacking: any;
  GKgs: any;
  NKgs: any;
  WTCode: any;
  wtCode: any;
  Moisture: string;
  StackBalance: any = 0;
  CurrentDocQtv: any = 0;
  NetStackBalance: any = 0;
  TransporterName: string = '-';
  LWBillNo: any = '-';
  WHDNo: any = '-';
  HCharges: any = 0;
  WCharges: any = 0;
  Kilometers: any = 0;
  FreightAmount: any = 0;
  LWBillDate: Date = new Date();
  Gunnyutilised: any = 0;
  GunnyReleased: any = 0;
  FCode: string;
  VCode: string;
  FStation: any;
  fStationCode: any;
  TStation: any;
  tStationCode: any;
  RRNo: any = '-';
  LDate: Date = new Date();
  WNo: any = '-';
  RailFreightAmt: any = 0;
  Remarks: string;
  IssueSlip: any;
  STTDetails: any = [];
  isViewed: boolean = false;
  blockScreen: boolean;
  @ViewChild('tr') transactionPanel: Dropdown;
  @ViewChild('sc') schemePanel: Dropdown;
  @ViewChild('rt') receivorTypePanel: Dropdown;
  @ViewChild('rn') receivorNamePanel: Dropdown;
  @ViewChild('rr') receivorRegionPanel: Dropdown;
  @ViewChild('i_desc') commodityPanel: Dropdown;
  @ViewChild('wmt') weighmentPanel: Dropdown;
  @ViewChild('pt') packingPanel: Dropdown;
  @ViewChild('st_no') stackPanel: Dropdown;
  @ViewChild('fs') fromStationPanel: Dropdown;
  @ViewChild('ts') toStationPanel: Dropdown;
  @ViewChild('fc') freightPanel: Dropdown;
  @ViewChild('vc') vehiclePanel: Dropdown;
  @ViewChild('rh') railHeadPanel: Dropdown;

  constructor(private roleBasedService: RoleBasedService, private authService: AuthService,
    private restAPIService: RestAPIService, private tableConstants: TableConstants,
    private datepipe: DatePipe, private http: HttpClient,
    private messageService: MessageService) {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;

  }

  ngOnInit() {
    this.scheme_data = this.roleBasedService.getSchemeData();
    this.itemCols = this.tableConstants.TruckMemoItemDetails;
    this.truckMemoViewCol = this.tableConstants.TruckMemoViewDocumentCols;
    this.data = this.roleBasedService.getInstance();
    this.regions = this.roleBasedService.getRegions();
    this.godowns = this.roleBasedService.getGodowns();
    this.username = JSON.parse(this.authService.getCredentials());
    this.fromStationOptions = [{ label: '-', value: '-' }];
    this.fStationCode = '-';
    this.FStation = '-';
    this.toStationOptions = [{ label: '-', value: '-' }];
    this.tStationCode = '-';
    this.TStation = '-';
    this.freightOptions = [{ label: '-', value: '-' }];
    this.FCode = '-';
    this.vehicleOptions = [{ label: '-', value: '-' }];
    this.VCode = '-';
    setTimeout(() => {
      this.regionName = this.data[0].RName;
      this.godownName = this.data[0].GName;
      this.GCode = this.data[0].GCode;
      this.RCode = this.data[0].RCode;
    }, 1200);
  }

  onSelect(selectedItem, type) {
    let transactoinSelection = [];
    let railHeads = [];
    let fromStation = [];
    let stackNo = [];
    let toStation = [];
    let schemeSelection = [];
    let receivorTypeList = [];
    let packingTypes = [];
    let receivorNameList: any = []; 
    let weighment = [];
    let regionsData = [];
    let itemDesc = [];
    switch (selectedItem) {
      case 'tr':
        if(type === 'enter') {
        this.transactionPanel.overlayVisible = true;
        }
        transactoinSelection.push({ 'label': 'Transfer', 'value': 'TR004', 'transType': this.transType },
          { 'label': 'Internal Transfer', 'value': 'TR021', 'transType': this.transType });
        this.transactionOptions = transactoinSelection;
        this.transactionOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        this.enableReceivorRegn = (this.Trcode.value === 'TR021' || this.trCode === 'TR021') ? true : false;
        break;
      case 'sc':
          if(type === 'enter') {
            this.schemePanel.overlayVisible = true;
            }
        if (this.scheme_data !== undefined && this.scheme_data !== null) {
          this.scheme_data.forEach(y => {
            schemeSelection.push({ 'label': y.SName, 'value': y.SCode });
            this.schemeOptions = schemeSelection;
          });
          this.schemeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        } else {
          this.schemeOptions = schemeSelection;
        }
        break;
      case 'rt':
          if(type === 'enter') {
            this.receivorTypePanel.overlayVisible = true;
            }if (this.Trcode !== null && this.Trcode !== undefined) {
        if ((this.Trcode.value !== undefined && this.Trcode.value !== null) || (this.trCode !== null && this.trCode !== undefined)) {
          const params = new HttpParams().set('TRCode', (this.Trcode.value !== undefined) ? this.Trcode.value : this.trCode).append('GCode', this.GCode);
          this.restAPIService.getByParameters(PathConstants.DEPOSITOR_TYPE_MASTER, params).subscribe((res: any) => {
      if (res !== undefined && res !== null && res.length !== 0) {
        res.forEach(rt => {
              if (this.Trcode.label === 'Transfer') {
                receivorTypeList.push({ 'label': rt.Tyname, 'value': rt.Tycode });
              } else {
                receivorTypeList.push({ 'label': rt.Tyname, 'value': rt.Tycode });
              }
            });
            this.receivorTypeOptions = receivorTypeList;
          }
            // this.isReceivorNameDisabled = false;
            this.receivorTypeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
          });
        }
      } else {
        this.receivorTypeOptions = receivorTypeList;
      }
        break;
      case 'rn':
          if(type === 'enter') {
            this.receivorNamePanel.overlayVisible = true;
            }
        if(this.Trcode !== null && this.RTCode !== null && this.Trcode !== undefined && this.RTCode !== undefined) {
        if ((this.Trcode.value !== undefined && this.Trcode.value !== null &&
          this.RTCode.value !== undefined && this.RTCode.value !== null) || 
          (this.trCode !== undefined && this.trCode !== null)) {
            const params = new HttpParams().set('TyCode', this.RTCode.value).append('TRType', this.transType)
            .append('GCode', this.GCode).append('TRCode', (this.Trcode.value !== undefined) ? this.Trcode.value : this.trCode);
            this.restAPIService.getByParameters(PathConstants.DEPOSITOR_NAME_MASTER, params).subscribe((res: any) => {
              if (res !== undefined && res !== null && res.length !== 0) {
                res.forEach(rn => {
                  if ((this.Trcode.value === 'TR004' || this.trCode === 'TR004') 
                  && (this.RRCode !== null && this.RRCode !== undefined)) {
                    if(rn.RCode === this.RRCode.value) {
                    receivorNameList.push({ 'label': rn.DepositorName, 'value': rn.DepositorCode, 'IssuerRegion': rn.IssuerRegion });
                    }
                  } else {
                    receivorNameList.push({ 'label': rn.DepositorName, 'value': rn.DepositorCode, 'IssuerRegion': rn.IssuerRegion });
                  }
                })
              this.receivorNameOptions = receivorNameList;
              }
              this.receivorNameOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
            });
          }
      } else {
        this.receivorNameOptions = receivorNameList;
      }
        break;
      case 'rr':
        if(type === 'enter') {
          this.receivorRegionPanel.overlayVisible = true;
          }
        if (this.regions !== undefined && this.regions !== null) {
          this.regions.forEach(r => {
            if (r.RCode !== this.RCode) {
            regionsData.push({ 'label': r.RName, 'value': r.RCode });
            }
          })
          this.receivorRegionOptions = regionsData;
          this.receivorRegionOptions.unshift({ 'label': '-select-', 'value': null });
        } else {
          this.receivorRegionOptions = regionsData;
        }
        break;
      case 'rh':
        // if (this.toRailHeadOptions === undefined) {
          if(type === 'enter') {
            this.railHeadPanel.overlayVisible = true;
            }
          const rail_params = new HttpParams().set('TyCode', 'TY016').append('TRType', this.transType)
          .append('GCode', this.GCode).append('TRCode', (this.Trcode.value !== undefined) ? this.Trcode.value : this.trCode);
          this.restAPIService.getByParameters(PathConstants.DEPOSITOR_NAME_MASTER, rail_params).subscribe((res: any) => {
            if (res !== undefined && res !== null && res.length !== 0) {
              res.forEach(rh => {
              railHeads.push({ 'label': rh.DepositorName, 'value': rh.DepositorCode });
            })
            this.toRailHeadOptions = railHeads;
          }
            this.toRailHeadOptions.unshift({ label: '-select-', value: null });
          });
        // }
        break;
      case 'fs':
        // if (this.fromStationOptions === undefined) {
          if(type === 'enter') {
            this.fromStationPanel.overlayVisible = true;
            }
          const fromStation_params = new HttpParams().set('TyCode', 'TY016').append('TRType', this.transType)
          .append('GCode', this.GCode).append('TRCode', (this.Trcode.value !== undefined) ? this.Trcode.value : this.trCode);
          this.restAPIService.getByParameters(PathConstants.DEPOSITOR_NAME_MASTER, fromStation_params).subscribe((res: any) => {
            if (res !== undefined && res !== null && res.length !== 0) {
              res.forEach(fs => {
              fromStation.push({ 'label': fs.DepositorName, 'value': fs.DepositorCode });
            })
            this.fromStationOptions = fromStation;
          }
            this.fromStationOptions.unshift({ label: '-select-', value: null });
          });
        // }
        break;
      case 'ts':
        // if (this.toStationOptions === undefined) {
          if(type === 'enter') {
            this.toStationPanel.overlayVisible = true;
            }
          const toStation_params = new HttpParams().set('TyCode', 'TY016').append('TRType', this.transType)
          .append('GCode', this.GCode).append('TRCode', (this.Trcode.value !== undefined) ? this.Trcode.value : this.trCode);
          this.restAPIService.getByParameters(PathConstants.DEPOSITOR_NAME_MASTER, toStation_params).subscribe((res: any) => {
            if (res !== undefined && res !== null && res.length !== 0) {
              res.forEach(ts => {
              toStation.push({ 'label': ts.DepositorName, 'value': ts.DepositorCode });
            })
            this.toStationOptions = toStation;
          }
            this.toStationOptions.unshift({ label: '-select-', value: null });
          });
        // }
        break;
      case 'i_desc':
        if(type === 'enter') {
          this.commodityPanel.overlayVisible = true;
          }
        if (this.Scheme !== undefined && this.Scheme !== null) {
        if ((this.Scheme.value !== undefined && this.Scheme.value !== null) || (this.schemeCode !== undefined && this.schemeCode !== null)){
          const params = new HttpParams().set('SCode', (this.Scheme.value !== undefined) ? this.Scheme.value : this.schemeCode);
          this.restAPIService.getByParameters(PathConstants.COMMODITY_FOR_SCHEME, params).subscribe((res: any) => {
            if (res !== undefined && res !== null && res.length !== 0) {
              res.forEach(i => {
              itemDesc.push({ 'label': i.ITDescription, 'value': i.ITCode });
            })
            this.itemDescOptions = itemDesc;
          }
            this.itemDescOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
          });
        }
        } else {
          this.itemDescOptions = itemDesc;
        }
        break;
      case 'st_no':
        if(type === 'enter') {
          this.stackPanel.overlayVisible = true;
          }
        if (this.RCode !== undefined && this.ICode !== undefined  && this.ICode !== null) {
        if ((this.ICode.value !== undefined && this.ICode.value !== null) || (this.iCode !== null && this.iCode !== undefined)) {
          const params = new HttpParams().set('GCode', this.GCode).append('ITCode', (this.ICode.value !== undefined) ? this.ICode.value : this.iCode);
          this.restAPIService.getByParameters(PathConstants.STACK_DETAILS, params).subscribe((res: any) => {
            if (res !== undefined && res !== null && res.length !== 0) {
              res.forEach(s => {
              stackNo.push({ 'label': s.StackNo, 'value': s.StackNo, 'stack_date': s.ObStackDate, 'stack_yr': s.CurYear });
            })
            this.stackOptions = stackNo;
          }
            this.stackOptions.unshift({ label: '-select-', value: null, disabled: true });
          });
        }
      } else {
        this.stackOptions = stackNo;
      }
        break;
      case 'pt':
          if(type === 'enter') {
            this.packingPanel.overlayVisible = true;
            }
        // if (this.packingTypeOptions === undefined) {
          this.restAPIService.get(PathConstants.PACKING_AND_WEIGHMENT).subscribe((res: any) => {
            if (res !== undefined && res !== null && res.length !== 0) {
              res.Table.forEach(p => {
              packingTypes.push({ 'label': p.PName, 'value': p.Pcode, 'weight': p.PWeight });
            })
            this.packingTypeOptions = packingTypes;
          }
            this.packingTypeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
          });
        // } 
        break;
      case 'wmt':
        // if (this.wmtOptions === undefined) {
          if(type === 'enter') {
            this.weighmentPanel.overlayVisible = true;
            }
          this.restAPIService.get(PathConstants.PACKING_AND_WEIGHMENT).subscribe((res: any) => {
            if (res !== undefined && res !== null && res.length !== 0) {
              res.Table1.forEach(w => {
              weighment.push({ 'label': w.WEType, 'value': w.WECode });
            })
            this.wmtOptions = weighment;
          }
            this.wmtOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
          });
        // }
        break;
      case 'fc':
          if(type === 'enter') {
            this.freightPanel.overlayVisible = true;
            }
        // if (this.freightOptions === undefined) {
        this.freightOptions = [{ label: '-select-', value: null }, { label: 'PAID', value: 'PAID' }, { label: 'PAY', value: 'PAY' }];
        // }
        break;
      case 'vc':
        // if(this.vehicleOptions === undefined) {
          if(type === 'enter') {
            this.vehiclePanel.overlayVisible = true;
            }
        this.vehicleOptions = [{ label: '-select-', value: null }, { label: 'CASUAL', value: 'CASUAL' },
        { label: 'CONTRACT', value: 'CONTRACT' }, { label: 'GOVT', value: 'GOVT' }];
        // }
        break;
    }
  }

  refreshSelect(id) {
    switch (id) {
      case 'tr':
        this.receivorNameOptions = []; this.receivorTypeOptions = [];
        this.rnCode = null; this.RTCode = null; this.RNCode = null;
        break;
      case 'sc':
        this.itemDescOptions = []; this.stackOptions = [];
        this.iCode = null; this.ICode = null; this.TStockNo = null;
        break;
        case 'i_desc':
        this.stackOptions = [];
        this.TStockNo = null;
        break;
      case 'rr':
        this.receivorNameOptions = []; this.receivorTypeOptions = [];
        this.rnCode = null; this.RTCode = null; this.RNCode = null;
        break;
        case 'rt':
        this.receivorNameOptions = [];
        this.rnCode = null; this.RNCode = null;
        break;
    }
  }

  onSelectTransportMode() {
    if (this.selectedValues.length !== 0) {
      if (this.selectedValues.length === 1) {
        this.disableRailHead = (this.selectedValues[0] === 'Rail') ? false : true;
      } else if (this.selectedValues.length === 2) {
        this.disableRailHead = false;
      }
    }
  }

  deleteRow(data, index) {
    this.TStockNo = data.TStockNo;
        this.stackOptions = [{ label: data.TStockNo, value: data.TStockNo }];
        this.Scheme = data.SchemeName; this.schemeCode = data.Scheme;
        this.schemeOptions = [{ label: data.SchemeName, value: data.Scheme}];
        this.StackDate = data.StackDate;
        this.ICode = data.ITDescription; this.iCode = data.ICode;
        this.itemDescOptions = [{ label: data.ITDescription, value: data.ICode }];
        this.IPCode = data.PackingType; this.ipCode = data.IPCode;
        this.PWeight = (data.PWeight * 1);
        this.packingTypeOptions = [{ label: data.PackingType, value: data.IPCode }];
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
          this.GodownNo = this.TStockNo.toString().slice(0, index);
          this.LocationNo = this.TStockNo.toString().slice(index + 1, totalLength);
        }
        this.TKgs = (this.GKgs !== undefined && this.NKgs !== undefined) ? ((this.GKgs * 1) - (this.NKgs * 1)) : 0;
        this.itemData.splice(index, 1);
        const list = { stack_no: this.TStockNo, stack_date: this.StackDate} 
        this.onStackNoChange(list);
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
        let checkValue: any = this.Moisture.toString().slice(0, 2);
      checkValue = (checkValue * 1);
        if (checkValue > 25) {
          let startValue = this.Moisture.toString().slice(0, 1);
          let endValue = this.Moisture.toString().slice(1, totalLength);
          this.Moisture = startValue + '.' + endValue;
        } else {
          let startValue = this.Moisture.toString().slice(0, 2);
          let endValue = this.Moisture.toString().slice(2, totalLength);
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

  openNext() {
    this.index = (this.index === 2) ? 0 : this.index + 1;
  }

  openPrev() {
    this.index = (this.index === 0) ? 2 : this.index - 1;
  }

  onClear() {
    this.itemData = []; this.STTDetails =  [];
    this.STDate = new Date(); this.OrderDate = new Date(); this.RDate = new Date();
    this.LWBillDate = new Date(); this.LDate = new Date();
    this.Trcode = null; this.trCode = null; this.rnCode = null;
    this.OrderNo = null; this.selectedValues = ['Road']; this.RNo = null; this.LorryNo = null;
    this.RRCode = null; this.RHCode = null; this.rhCode = null;
    this.RTCode = null; this.RNCode = null; this.ManualDocNo = null; this.Remarks = null;
    this.TransporterName = '-'; this.LWBillNo = '-';
    this.FreightAmount = 0; this.Kilometers = 0; this.WHDNo = 0; this.WCharges = 0;
    this.HCharges = 0; this.TStation = '-'; this.FStation = '-';
    this.fStationCode = '-'; this.tStationCode = '-';
    this.GunnyReleased = 0; this.Gunnyutilised = 0; this.STNo = null;
    this.FCode = '-'; this.VCode = '-'; this.RRNo = 0; this.WNo = 0; this.RailFreightAmt = 0;
    this.CurrentDocQtv = 0; this.StackBalance = 0; this.NetStackBalance = 0;
    this.transactionOptions = []; this.toRailHeadOptions = [];
    this.freightOptions = [{ label: '-', value: '-' }];
    this.vehicleOptions = [{ label: '-', value: '-' }];
    this.fromStationOptions = [{ label: '-', value: '-' }];
    this.toStationOptions = [{ label: '-', value: '-' }];
  }

  onCalculateWt() {
    if (this.GKgs !== undefined && this.NKgs !== undefined)  {
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
      this.GodownNo = TStockNo.toString().slice(0, index);
      this.LocationNo = TStockNo.toString().slice(index + 1, totalLength);
    } else {
      this.GodownNo = this.stackYear = this.LocationNo = null;
    }
    let stack_data = (event.value !== undefined) ? event.value : event;
    const params = {
      TStockNo: (stack_data.value !== undefined && stack_data.value !== null) ? stack_data.value : stack_data.stack_no,
      StackDate: this.datepipe.transform(stack_data.stack_date, 'MM/dd/yyyy'),
      GCode: this.GCode,
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
        if(this.itemData.length !== 0) {
          this.itemData.forEach(x => {
            if(x.TStockNo === stack_data.value) {
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

  onEnter() {
    this.messageService.clear();
    this.itemData.push({
      TStockNo: (this.TStockNo.value !== undefined && this.TStockNo.value !== null) ? this.TStockNo.value : this.TStockNo,
      ITDescription: (this.ICode.label !== undefined && this.ICode.label !== null) ? this.ICode.label : this.ICode,
      PackingType: (this.IPCode.label !== undefined && this.IPCode.label !== null) ? this.IPCode.label : this.IPCode,
      IPCode: (this.IPCode.value !== this.IPCode.value !== null) ? this.IPCode.value : this.ipCode,
      ICode: (this.ICode.value !== undefined && this.ICode.value) ? this.ICode.value : this.iCode,
      NoPacking: this.NoPacking,
      WmtType: (this.WTCode.label !== undefined && this.WTCode.label !== null) ? this.WTCode.label : this.WTCode,
      WTCode: (this.WTCode.value !== undefined && this.WTCode.value !== null) ? this.WTCode.value : this.wtCode,
      GKgs: this.GKgs, Nkgs: this.NKgs, Moisture: (this.Moisture === undefined) ? 0 : this.Moisture,
      SchemeName: (this.Scheme.label !== undefined && this.Scheme.label !== null) ? this.Scheme.label : this.Scheme,
      Scheme: (this.Scheme.value !== undefined && this.Scheme.value !== null) ? this.Scheme.value : this.schemeCode,
      PWeight: (this.IPCode.weight  !== undefined) ? this.IPCode.weight : this.PWeight,
      StackDate: (this.TStockNo.stack_date !== undefined && this.TStockNo.stack_date !== null) ?
       new Date(this.TStockNo.stack_date) : this.StackDate, Rcode: this.RCode
    })
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
        this.itemData = this.itemData.splice(lastIndex, 1);
        this.CurrentDocQtv = 0;
        this.NetStackBalance = 0;
        this.NoPacking = null;
        this.GKgs = null; this.NKgs = null; this.TKgs = null;
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ExceedingStackBalance });
      } else {
        this.NetStackBalance = (this.StackBalance * 1) - (this.CurrentDocQtv * 1);
        this.TStockNo = null; this.ICode = null; this.IPCode = null; this.NoPacking = null;
      this.GKgs = null; this.NKgs = null; this.GodownNo = null; this.LocationNo = null;
      this.TKgs = null; this.WTCode = null; this.Moisture = null; this.Scheme = null;
      this.schemeOptions = []; this.itemDescOptions = []; this.stackOptions = [];
      this.packingTypeOptions = []; this.wmtOptions = [];
      }
      }
  }

  onRowSelect(event) {
    this.STNo = event.data.STNo;
  }

  onView() {
    this.viewPane = true;
    this.truckMemoViewData = [];
    this.messageService.clear();
    const params = new HttpParams().set('sValue', this.datepipe.transform(this.viewDate, 'MM/dd/yyyy')).append('GCode', this.GCode).append('Type', '1');
    this.restAPIService.getByParameters(PathConstants.STOCK_TRUCK_MEMO_VIEW_DOCUMENT, params).subscribe((res: any) => {
      if (res !== undefined && res !== null && res.length !== 0) {
        res.forEach(data => {
        data.STDate = this.datepipe.transform(data.STDate, 'dd-MM-yyyy');
      })
      this.truckMemoViewData = res;
    } else {
      this.truckMemoViewData = [];
      this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage });
    }
    });
  }

  getDocBySTNo() {
    this.messageService.clear();
    this.itemData = []; 
    this.viewPane = false;
    this.isViewed = true;
    const params = new HttpParams().set('sValue', this.STNo).append('Type', '2').append('GCode', this.GCode);
    this.restAPIService.getByParameters(PathConstants.STOCK_TRUCK_MEMO_VIEW_DOCUMENT, params).subscribe((res: any) => {
      if (res !== undefined && res.length !== 0) {
        this.STNo = res[0].STNo;
        this.RowId = res[0].RowId;
        this.STDate = new Date(res[0].STDate);
        this.transactionOptions = [{label: res[0].TransactionName, value: res[0].TrCode}];
        this.Trcode = res[0].TransactionName;
        this.trCode = res[0].TrCode;
        this.enableReceivorRegn = (this.Trcode.value === 'TR021' || this.trCode === 'TR021') ? true : false;
        this.OrderDate = new Date(res[0].MDate);
        this.OrderNo = res[0].MNo;
        this.RNo = res[0].RNo;
        this.RDate = new Date(res[0].RDate);
        this.LorryNo = res[0].LNo;
        if (res[0].TransportMode !== 'UPCountry') {
          this.selectedValues = [];
          this.selectedValues.push(res[0].TransportMode);
          this.disableRailHead = (res[0].TransportMode === 'Rail') ? false : true;
        } else {
          this.selectedValues = [];
          this.selectedValues.push('Road', 'Rail');
          this.disableRailHead = false;
        }
        if (res[0].RailHead !== null) {
        this.toRailHeadOptions = [{label: res[0].RHName, value: res[0].RailHead}];
        this.RHCode = res[0].RHName;
        this.rhCode = res[0].RailHead }
        this.receivorNameOptions = [{ label: res[0].ReceivorName, value: res[0].ReceivingCode}];
        this.RNCode = res[0].ReceivorName,
        this.rnCode = res[0].ReceivingCode,
        this.ManualDocNo = res[0].Flag1;
        this.TransporterName = res[0].TransporterName;
        this.LWBillDate = new Date(res[0].LWBillDate);
        this.LWBillNo = res[0].LWBillNo;
        this.FreightAmount = res[0].FreightAmount;
        this.Kilometers = res[0].Kilometers;
        this.WHDNo = res[0].WHDNo;
        this.WCharges = res[0].WCharges;
        this.HCharges = res[0].HCharges;
        this.GunnyReleased = res[0].GunnyReleased;
        this.Gunnyutilised = res[0].GunnyUtilised;
        this.freightOptions = [{ label: res[0].FCode, value: res[0].FCode }];
        this.FCode = res[0].FCode;
        this.vehicleOptions = [{ label: res[0].Vcode, value: res[0].Vcode }],
        this.VCode = res[0].Vcode;
        this.fromStationOptions = [{ label: res[0].FromStation, value: res[0].FStation }],
        this.FStation = res[0].FromStation;
        this.fStationCode = res[0].FStation;
        this.toStationOptions = [{ label: res[0].ToStation, value: res[0].TStation }],
        this.TStation = res[0].ToStation;
        this.tStationCode = res[0].TStation;
        this.RRNo = res[0].RRNo;
        this.RailFreightAmt = res[0].RFreightAmount;
        this.LDate = new Date(res[0].LDate);
        this.WNo = res[0].Wno;
        this.Remarks = res[0].Remarks;
        this.IssueSlip = res[0].IssueSlip;
        res.forEach(i => {
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
            ITDescription: i.ITName,
            SchemeName: i.SchemeName,
            PackingType: i.PName,
            WmtType: i.WEType,
            PWeight: i.PWeight,
            StackDate: i.StackDate,
            RCode: i.RCode
          })
        });
      } else {
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage });
      }
    });
  }

  onSave(type) {
    this.messageService.clear();
    this.blockScreen = true;
    if (this.selectedValues.length !== 0) {
      if (this.selectedValues.length === 2) {
        this.MTransport = 'UPCountry';
      } else if (this.selectedValues.length === 1) {
        this.MTransport = (this.selectedValues[0] === 'Rail') ? 'Rail' : 'Road';
      }
    }
    this.STTDetails.push({
      TransportMode: this.MTransport,
      TransporterName: this.TransporterName,
      LWBillNo: this.LWBillNo,
      LWBillDate: this.datepipe.transform(this.LWBillDate, 'MM/dd/yyyy'),
      FreightAmount: this.FreightAmount,
      Kilometers: this.Kilometers,
      WHDNo: (this.WHDNo !== undefined && this.WHDNo !== null) ? this.WHDNo : 0,
      WCharges: (this.WCharges !== null && this.WCharges !== undefined) ? this.WCharges : 0,
      HCharges: (this.HCharges !== null && this.HCharges !== undefined) ? this.HCharges : 0,
      FStation: (this.FStation !== null && this.FStation !== undefined) ? ((this.FStation.value !== undefined) ? this.FStation.value : this.fStationCode) : '-',
      TStation: (this.TStation !== null && this.TStation !== undefined) ? ((this.TStation.value !== undefined) ? this.TStation.value : this.tStationCode) : '-',
      Remarks: this.Remarks,
      FCode: this.FCode,
      Vcode: this.VCode,
      LDate: this.datepipe.transform(this.LDate, 'MM/dd/yyyy'),
      LNo: this.LorryNo,
      Wno: (this.WNo !== undefined && this.WNo !== null) ? this.WNo : 0,
      RRNo: (this.RRNo !== undefined && this.RRNo !== null) ? this.RRNo : 0,
      RailHead: (this.RHCode !== undefined && this.RHCode !== null) ? ((this.RHCode.value !== undefined && this.RHCode.value !== null) ? this.RHCode.value : this.rhCode) : '-',
      RFreightAmount: (this.RailFreightAmt !== undefined && this.RailFreightAmt !== null) ? this.RailFreightAmt : 0,
      Rcode: this.RCode
    })
    this.RowId = (this.RowId !== undefined && this.RowId !== null) ? this.RowId : 0;
    this.STNo = (this.STNo !== undefined && this.STNo !== null) ? this.STNo : 0;
    this.IssueSlip = (this.STNo !== 0) ? this.IssueSlip : 'N'
    const params = {
      'Type': type,
      'STNo': this.STNo,
      'RowId': this.RowId,
      'STDate': this.datepipe.transform(this.STDate, 'MM/dd/yyyy'),
      'TrCode': (this.Trcode.value !== undefined && this.Trcode.value !== null) ? this.Trcode.value : this.trCode,
      'MNo': this.OrderNo,
      'MDate': this.datepipe.transform(this.OrderDate, 'MM/dd/yyyy'),
      'RNo': this.RNo,
      'RDate': this.datepipe.transform(this.RDate, 'MM/dd/yyyy'),
      'LorryNo': this.LorryNo.toString().toUpperCase(),
      'ReceivingCode': (this.RNCode.value !== undefined && this.RNCode.value !== null) ? this.RNCode.value : this.rnCode,
      'IssuingCode': this.GCode,
      'RCode': this.RCode,
      'GunnyUtilised': (this.Gunnyutilised !== undefined && this.Gunnyutilised !== null) ? this.Gunnyutilised : 0,
      'GunnyReleased': (this.GunnyReleased !== undefined && this.GunnyReleased !== null) ? this.GunnyReleased : 0,
      'GodownName': this.godownName,
      'TransactionName': (this.Trcode.label !== undefined && this.Trcode.value !== null) ? this.Trcode.value : this.Trcode,
      'ReceivingName': (this.RNCode.label !== undefined && this.RNCode.label !== null) ? this.RNCode.label : this.RNCode,
      'ManualDocNo': this.ManualDocNo,
      'RegionName': this.regionName,
      'RailHeadName': (this.RHCode !== undefined && this.RHCode !== null) ?  
      ((this.RHCode.label !== undefined) ? this.RHCode.label : this.RHCode) : '-',
      'IssueSlip': this.IssueSlip,
      'UserID': this.username.user,
      'documentSTItemDetails': this.itemData,
      'documentSTTDetails': this.STTDetails
    };
    this.restAPIService.post(PathConstants.STOCK_TRUCK_MEMO_DOCUMENT, params).subscribe(res => {
      if (res.Item1 !== undefined && res.Item1 !== null && res.Item2 !== undefined && res.Item2 !== null) {
        if (res.Item1) {
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: res.Item2 });
          this.onClear();
          this.isSaveSucceed = true;
          this.isViewed = true;
          this.blockScreen = false;
        } else {
          this.blockScreen = false;
          this.isSaveSucceed = false;
          this.isViewed = true;
          this.STTDetails = [];
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: res.Item2 });
        }
      }
    },(err: HttpErrorResponse) => {
      this.isSaveSucceed = false;
      this.isViewed = false;
      this.blockScreen = false;
       if (err.status === 0) {
        this.STTDetails = [];
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }

  onPrint() {
    if(this.isViewed) {
      this.onSave('2');
    }
    const path = "../../assets/Reports/" + this.username.user + "/";
    const filename = this.GCode + GolbalVariable.StockTruckMemoDocument;
    let filepath = path + filename + ".txt";
    this.http.get(filepath, {responseType: 'text'})
      .subscribe(data => {
        if(data !== null && data !== undefined) {
        var doc = new jsPDF({
          orientation: 'potrait',
        })
        doc.setFont('courier');
        doc.setFontSize(9);
        doc.text(data, 2, 2)
        doc.save(filename + '.pdf');
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
      });
  }
}
