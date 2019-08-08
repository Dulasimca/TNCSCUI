import { Component, OnInit } from '@angular/core';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { SelectItem, ConfirmationService, MessageService } from 'primeng/api';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-truck-receipt',
  templateUrl: './truck-receipt.component.html',
  styleUrls: ['./truck-receipt.component.css']
})
export class TruckReceiptComponent implements OnInit {
  viewPane: boolean = false;
  isValidStackBalance: boolean;
  isSaveSucceed: boolean = true;
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
  isRailSelected: boolean = false;
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
  receivorNameList: any = [];
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
  transType: any;
  OrderNo: any;
  OrderDate: Date = new Date();
  RNo: any;
  RDate: Date = new Date();
  LorryNo: any;
  RHCode: any;
  rhCode: any;
  RTCode: any;
  rtCode: any;
  RNCode: any;
  RCode: any;
  GCode: any;
  RRCode: any;
  ManualDocNo: any;
  RRemarks: string;
  Scheme: any;
  schemeCode: any;
  TStockNo: any;
  ICode: any;
  iCode: any;
  GodownNo: any;
  LocationNo: any;
  IPCode: any;
  ipCode: any;
  NoPacking: number;
  GKgs: number;
  NKgs: number;
  WTCode: any;
  wtCode: any;
  Moisture: string;
  StackBalance: number = 0;
  CurrentDocQtv: any;
  NetStackBalance: any;
  TransporterName: string;
  LWBillNo: any;
  WHDNo: any;
  HCharges: any;
  WCharges: any;
  Kilometers: number;
  FreightAmount: number;
  LWBillDate: Date = new Date();
  Gunnyutilised: any;
  GunnyReleased: any;
  FCode: string;
  VCode: string;
  FStation: any;
  fStationCode: any;
  TStation: any;
  tStationCode: any;
  RRNo: any;
  LDate: Date = new Date();
  WNo: any;
  RailFreightAmt: any;
  Remarks: string;
  IssueSlip: any;
  STTDetails: any = [];
  LNO_Regex: RegExp = /[a-zA-Z]{2}[0-9]{2}[a-zA-Z]{2}[0-9]{4}$/; 

  constructor(private roleBasedService: RoleBasedService, private authService: AuthService,
    private restAPIService: RestAPIService, private tableConstants: TableConstants,
    private datepipe: DatePipe, private confirmationService: ConfirmationService,
    private messageService: MessageService) {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;

  }

  ngOnInit() {
    this.scheme_data = this.roleBasedService.getSchemeData();
    this.itemCols = this.tableConstants.TruckMemoItemDetails;
    this.data = this.roleBasedService.getInstance();
    this.regions = this.roleBasedService.getRegions();
    this.godowns = this.roleBasedService.getGodowns();
    this.username = JSON.parse(this.authService.getCredentials());
    setTimeout(() => {
      this.regionName = this.data[0].RName;
      this.godownName = this.data[0].GName;
      this.GCode = this.data[0].GCode;
      this.RCode = this.data[0].RCode;
    }, 1200);
  }

  onSelect(selectedItem) {
    let transactoinSelection = [];
    let railHeads = []; let fromStation = [];
    let toStation = [];
    let schemeSelection = [];
    let receivorTypeList = [];
    let packingTypes = [];
    switch (selectedItem) {
      case 'tr':
        transactoinSelection.push({ 'label': 'Transfer', 'value': 'TR004', 'transType': 'I' },
          { 'label': 'Internal Transfer', 'value': 'TR021', 'transType': 'I' });
        this.transactionOptions = transactoinSelection;
        this.transactionOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        this.isRailSelected = (this.Trcode.value === 'TR021') ? true : false;
        break;
      case 'sc':
        if (this.scheme_data !== undefined && this.scheme_data !== null) {
          this.scheme_data.forEach(y => {
            schemeSelection.push({ 'label': y.SName, 'value': y.SCode });
            this.schemeOptions = schemeSelection;
          });
          this.schemeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        }
        break;
      case 'rt':
        if (this.Trcode !== null && this.Trcode !== undefined) {
        if (this.Trcode.value !== undefined && this.Trcode.value !== '') {
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
      }
        break;
      case 'rn':
        this.receivorNameList = [];
        if(this.Trcode !== null && this.RTCode !== null && this.Trcode !== undefined && this.RTCode !== undefined) {
        if (this.Trcode.value !== undefined && this.Trcode.value !== '' &&
          this.RTCode.value !== undefined && this.RTCode.value !== '') {
            let rt_code = (this.RTCode.value !== undefined) ? this.RTCode.value : this.rtCode;
          if (rt_code === 'TY008') {
            if (this.godowns !== undefined) {
              this.godowns.forEach(g => {
                this.receivorNameList.push({ 'label': g.GName, 'value': g.GCode, 'rcode': g.RCode });
              })
              if (this.RRCode !== undefined) {
                this.receivorNameList = this.receivorNameList.filter(x => {
                  return x.rcode === this.RRCode.value
                });
              }
              this.receivorNameOptions = this.receivorNameList;
              this.receivorNameOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
            }
          } else {
            const params = new HttpParams().set('TyCode', rt_code).append('TRType', (this.Trcode.transType !== undefined) ? this.Trcode.transType : this.transType).append('GCode', this.GCode);
            this.restAPIService.getByParameters(PathConstants.DEPOSITOR_NAME_MASTER, params).subscribe((res: any) => {
              if (res !== undefined && res !== null && res.length !== 0) {
                res.forEach(rn => {
                  this.receivorNameList.push({ 'label': rn.Issuername, 'value': rn.IssuerCode, 'IssuerRegion': rn.IssuerRegion });
                })
              this.receivorNameOptions = this.receivorNameList;
              }
              this.receivorNameOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
            });
          }
        }
      }
        break;
      case 'rr':
        let regionsData = [];
        if (this.regions !== undefined && this.regions !== null && this.receivorRegionOptions === undefined) {
          this.regions.forEach(r => {
            if (r.Rcode !== this.RCode) {
            regionsData.push({ 'label': r.RName, 'value': r.RCode });
            }
          })
          this.receivorRegionOptions = regionsData;
          this.receivorRegionOptions.unshift({ 'label': '-select-', 'value': null });
        }
        break;
      case 'rh':
        if (this.toRailHeadOptions === undefined) {
          const params = new HttpParams().set('TyCode', 'TY016').append('TRType',  (this.Trcode.transType !== undefined) ? this.Trcode.transType : this.transType).append('GCode', this.GCode);
          this.restAPIService.getByParameters(PathConstants.DEPOSITOR_NAME_MASTER, params).subscribe((res: any) => {
            if (res !== undefined && res !== null && res.length !== 0) {
              res.forEach(rh => {
              railHeads.push({ 'label': rh.RYName, 'value': rh.RYCode });
            })
            this.toRailHeadOptions = railHeads;
          }
            this.toRailHeadOptions.unshift({ label: '-select-', value: null });
          });
        }
        break;
      case 'fs':
        if (this.fromStationOptions === undefined) {
          const params = new HttpParams().set('TyCode', 'TY016').append('TRType',  (this.Trcode.transType !== undefined) ? this.Trcode.transType : this.transType).append('GCode', this.GCode);
          this.restAPIService.getByParameters(PathConstants.DEPOSITOR_NAME_MASTER, params).subscribe((res: any) => {
            if (res !== undefined && res !== null && res.length !== 0) {
              res.forEach(fs => {
              fromStation.push({ 'label': fs.RYName, 'value': fs.RYCode });
            })
            this.fromStationOptions = fromStation;
          }
            this.fromStationOptions.unshift({ label: '-select-', value: null });
          });
        }
        break;
      case 'ts':
        if (this.toStationOptions === undefined) {
          const params = new HttpParams().set('TyCode', 'TY016').append('TRType',  (this.Trcode.transType !== undefined) ? this.Trcode.transType : this.transType).append('GCode', this.GCode);
          this.restAPIService.getByParameters(PathConstants.DEPOSITOR_NAME_MASTER, params).subscribe((res: any) => {
            if (res !== undefined && res !== null && res.length !== 0) {
              res.forEach(ts => {
              toStation.push({ 'label': ts.RYName, 'value': ts.RYCode });
            })
            this.toStationOptions = toStation;
          }
            this.toStationOptions.unshift({ label: '-select-', value: null });
          });
        }
        break;
      case 'i_desc':
        let itemDesc = [];
        if (this.Scheme !== undefined && this.Scheme !== null) {
        if (this.Scheme.value !== undefined && this.Scheme.value !== '') {
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
        }
        break;
      case 'st_no':
        let stackNo = [];
        if (this.RCode !== undefined && this.ICode !== undefined  && this.ICode !== null) {
        if (this.ICode.value !== undefined && this.ICode.value !== '') {
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
          if (this.TStockNo !== undefined && this.TStockNo !== null) {
            this.stackYear = this.TStockNo.stack_yr;
            let index;
            index = this.TStockNo.value.toString().indexOf('/', 2);
            const totalLength = this.TStockNo.value.length;
            this.GodownNo = this.TStockNo.value.toString().slice(0, index);
            this.LocationNo = this.TStockNo.value.toString().slice(index + 1, totalLength);
          } else {
            this.GodownNo = this.stackYear = this.LocationNo = null;
          }
        }
      }
        break;
      case 'pt':
        if (this.packingTypeOptions === undefined) {
          this.restAPIService.get(PathConstants.PACKING_AND_WEIGHMENT).subscribe((res: any) => {
            if (res !== undefined && res !== null && res.length !== 0) {
              res.Table.forEach(p => {
              packingTypes.push({ 'label': p.PName, 'value': p.Pcode, 'weight': p.PWeight });
            })
            this.packingTypeOptions = packingTypes;
          }
            this.packingTypeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
          });
        } 
        break;
      case 'wmt':
        let weighment = [];
        if (this.wmtOptions === undefined) {
          this.restAPIService.get(PathConstants.PACKING_AND_WEIGHMENT).subscribe((res: any) => {
            if (res !== undefined && res !== null && res.length !== 0) {
              res.Table1.forEach(w => {
              weighment.push({ 'label': w.WEType, 'value': w.WECode });
            })
            this.wmtOptions = weighment;
          }
            this.wmtOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
          });
        }
        break;
      case 'fc':
        if (this.freightOptions === undefined) {
        this.freightOptions = [{ label: '-select-', value: null }, { label: 'PAID', value: 'PAID' }, { label: 'PAY', value: 'PAY' }];
        }
        break;
      case 'vc':
        if(this.vehicleOptions === undefined) {
        this.vehicleOptions = [{ label: '-select-', value: null }, { label: 'CASUAL', value: 'CASUAL' },
        { label: 'CONTRACT', value: 'CONTRACT' }, { label: 'GOVT', value: 'GOVT' }];
        }
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

  deleteRow(id, index) {
    switch (id) {
      case 'item':
        this.confirmationService.confirm({
          message: 'Are you sure that you want to proceed?',
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.itemData.splice(index, 1);
          }
        });
        break;
      case 'view':
        this.confirmationService.confirm({
          message: 'Are you sure that you want to proceed?',
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            //  this.documentViewData.splice(index, 1);
          }
        });
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
    if (this.NoPacking !== undefined && this.NoPacking !== null
      && this.IPCode !== undefined && this.IPCode.weight !== undefined) {
      this.GKgs = this.NKgs = this.NoPacking * this.IPCode.weight;
      this.TKgs = this.GKgs - this.NKgs;
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
    this.itemData = this.STTDetails =  [];
    this.STDate = this.OrderDate = this.RDate = this.LWBillDate = this.LDate = new Date();
    this.Trcode = this.OrderNo = this.selectedValues = this.RNo = this.LorryNo = 
    this.RHCode = this.RTCode = this.RNCode = this.ManualDocNo = this.Remarks = this.RRemarks= 
    this.TransporterName = this.LWBillNo = this.FreightAmount = this.Kilometers =
    this.WHDNo = this.WCharges = this.HCharges = this.TStation =
    this.FStation = this.GunnyReleased = this.Gunnyutilised =
    this.FCode = this.VCode = this.RRNo = this.WNo = this.RailFreightAmt = null;
    this.CurrentDocQtv = this.StackBalance = this.NetStackBalance = 0;
  }

  onStackNoChange(event) {
    let stack_data = event.value;
    const params = {
      TStockNo: stack_data.value,
      StackDate: stack_data.stack_date,
      GCode: this.GCode,
      ICode: this.ICode.value,
      Type: 1
    }
    this.restAPIService.post(PathConstants.STACK_BALANCE, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.StackBalance = (res[0].StackBalance * 1);
      if (this.StackBalance > 0) {
        this.isValidStackBalance = false;
      } else {
        this.isValidStackBalance = true;
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message', detail: 'Stack Balance is not sufficient!' });
      }
    }
    })
  }

  onEnter() {
    this.itemData.push({TStockNo: this.TStockNo.value, ITDescription: this.ICode.label,
      PackingType: this.IPCode.label, IPCode: this.IPCode.value, ICode: this.ICode.value,
      NoPacking: this.NoPacking, WmtType: this.WTCode.label, WTCode: this.WTCode.value,
      GKgs: this.GKgs, Nkgs: this.NKgs, Moisture: (this.Moisture === undefined) ? 0 : this.Moisture,
      SchemeName: this.Scheme.label,
      Scheme: this.Scheme.value, Rcode: this.RCode
    })
    if (this.itemData.length !== 0) {
      this.StackBalance = (this.StackBalance * 1);
      this.itemData.forEach(x => 
        {
          if (x.TStockNo === this.TStockNo.value) {
            this.CurrentDocQtv += (x.Nkgs * 1);
          } 
        });
      let lastIndex = this.itemData.length;
      if (this.CurrentDocQtv > this.StackBalance) {
        this.itemData = this.itemData.splice(lastIndex, 1);
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message', detail: 'Exceeding the stack balance!' });
      } else {
        this.NetStackBalance = (this.StackBalance * 1) - (this.CurrentDocQtv * 1);
      }
      this.TStockNo = this.ICode = this.IPCode = this.NoPacking = this.WTCode = this.Moisture
        = this.GKgs = this.NKgs = this.Scheme = this.GodownNo = this.LocationNo = this.stackYear = null;
    }
  }

  onRowSelect(event) {
    this.STNo = event.data.STNo;
  }

  onView() {
    this.viewPane = true;
    const params = new HttpParams().set('sValue', this.datepipe.transform(this.viewDate, 'MM/dd/yyyy')).append('Type', '1');
    this.restAPIService.getByParameters(PathConstants.STOCK_TRUCK_MEMO_VIEW_DOCUMENT, params).subscribe((res: any) => {
      if (res !== undefined && res !== null && res.length !== 0) {
        res.forEach(data => {
        data.OrderDate = this.datepipe.transform(data.OrderDate, 'dd-MM-yyyy');
        data.SRDate = this.datepipe.transform(data.SRDate, 'dd-MM-yyyy');
      })
      this.truckMemoViewData = res;
    } else {
      this.messageService.add({ key: 't-err', severity: 'warn', summary: 'Warn Message', detail: 'No record found!' });
    }
    });
  }

  getDocBySTNo() {
    this.viewPane = false;
    const params = new HttpParams().set('sValue', this.STNo).append('Type', '2');
    this.restAPIService.getByParameters(PathConstants.STOCK_TRUCK_MEMO_VIEW_DOCUMENT, params).subscribe((res: any) => {
      if (res !== undefined && res.length !== 0) {
        this.STNo = res[0].STNo,
        this.STDate = new Date(res[0].STDate),
        this.transactionOptions = [{label: res[0].TransactionName, value: res[0].TrCode}];
        this.Trcode = res[0].TransactionName,
        this.trCode = res[0].TrCode,
        this.OrderDate = new Date(res[0].MDate),
        this.OrderNo = res[0].MNo,
        this.RNo = res[0].RNo,
        this.RDate = new Date(res[0].RDate),
        this.LorryNo = res[0].LNo,
        this.selectedValues = res[0].TransportMode,
        this.toRailHeadOptions = [{label: res[0].RHName, value: res[0].RailHead}];
        this.RHCode = res[0].RHName,
        this.rhCode = res[0].RailHead,
        this.receivorTypeOptions = [{label: res[0].ReceivorType, value: res[0].ReceivingCode}];
        this.rtCode = res[0].ReceivingCode,
        this.RTCode = res[0].ReceivorType,
        this.transType = res[0].TRType,
        this.ManualDocNo = res[0].ManualDocNo,
        this.schemeOptions = [{label: res[0].SchemeName, value: res[0].Scheme}];
        this.Scheme = res[0].SchemeName,
        this.schemeCode = res[0].Scheme,
        this.itemDescOptions = [{label: res[0].CommodityName, value: res[0].ICode}];
        this.ICode = res[0].CommodityName,
        this.iCode = res[0].ICode,
        this.packingTypeOptions = [{label: res[0].PackingName, value: res[0].IPCode}];
        this.IPCode = res[0].PackingName,
        this.ipCode = res[0].IPCode,
        this.wmtOptions = [{label: res[0].WmtType, value: res[0].WTCode}];
        this.WTCode = res[0].WmtType,
        this.wtCode = res[0].WTCode,
        this.NoPacking = res[0].NoPacking,
        this.GKgs = res[0].GKgs,
        this.NKgs = res[0].Nkgs,
        this.TKgs = (this.GKgs * 1) - (this.NKgs * 1),
        this.Moisture = (res[0].Moisture * 1).toFixed(2),
        /// ---- stack table ----
        // this.StackBalance = res[0].StackBalance,
        // this.NetStackBalance = res[0].NetStackBalance,
        // this.CurrentDocQtv = res[0].CurrentDocQtv,
        /// ---end----
        this.TransporterName = res[0].TransporterName,
        this.LWBillDate = new Date(res[0].LWBillDate),
        this.LWBillNo = res[0].LWBillNo,
        this.FreightAmount = res[0].FreightAmount,
        this.Kilometers = res[0].Kilometers,
        this.WHDNo = res[0].WHDNo,
        this.WCharges = res[0].WCharges,
        this.HCharges = res[0].HCharges,
        this.GunnyReleased = res[0].GunnyReleased,
        this.Gunnyutilised = res[0].GunnyUtilised,
        this.freightOptions = [{ label: res[0].FCode, value: res[0].FCode }],
        this.FCode = res[0].FCode,
        this.vehicleOptions = [{ label: res[0].Vcode, value: res[0].Vcode }],
        this.VCode = res[0].Vcode,
        this.fromStationOptions = [{ label: res[0].FromStation, value: res[0].FStation }],
        this.FStation = res[0].FromStation,
        this.fStationCode = res[0].FStation,
        this.toStationOptions = [{ label: res[0].ToStation, value: res[0].TStation }],
        this.TStation = res[0].ToStation,
        this.tStationCode = res[0].TStation,
        this.RRNo = res[0].RRNo,
        this.RailFreightAmt = res[0].RFreightAmount,
        this.LDate = new Date(res[0].LDate),
        this.Remarks = res[0].Remarks
      } else {
        this.messageService.add({ key: 't-err', severity: 'warn', summary: 'Warn Message', detail: 'No record found!' });
      }
    });
  }

  onSave() {
    if (this.selectedValues.length !== 0) {
      if (this.selectedValues.length === 2) {
        this.MTransport = 'UPCountry';
      } else if (this.selectedValues.length === 1) {
        this.MTransport = (this.selectedValues[0] === 'rail') ? 'Rail' : 'Road';
      }
    }
    this.STTDetails.push({
      TransportMode: this.MTransport,
      TransporterName: this.TransporterName,
      LWBillNo: this.LWBillNo,
      LWBillDate: this.datepipe.transform(this.LWBillDate, 'MM/dd/yyyy'),
      FreightAmount: this.FreightAmount,
      Kilometers: this.Kilometers,
      WHDNo: this.WHDNo,
      WCharges: this.WCharges,
      HCharges: this.HCharges,
      FStation: this.FStation.value,
      TStation: this.TStation.value,
      Remarks: this.Remarks,
      FCode: this.FCode,
      Vcode: this.VCode,
      LDate: this.datepipe.transform(this.LDate, 'MM/dd/yyyy'),
      LNo: this.LorryNo,
      Wno: this.WNo,
      RRNo: this.RRNo,
      RailHead: (this.RHCode !== undefined && this.RHCode !== null) ? this.RHCode.value : ((this.rhCode === undefined || this.rhCode === null) ? '-' : this.rhCode),
      RailHeadName: (this.RHCode !== undefined && this.RHCode !== null) ?  this.RHCode.label : ((this.rhCode === undefined || this.rhCode === null) ? '-' : this.RHCode),
      RFreightAmount: this.RailFreightAmt,
      Rcode: this.RCode
    })
    this.RowId = (this.RowId !== undefined) ? this.RowId : 0;
    this.STNo = (this.STNo !== undefined) ? this.STNo : 0;
    this.IssueSlip = (this.STNo !== 0) ? this.IssueSlip : 'N'
    const params = {
      'STNo': this.STNo,
      'RowId': this.RowId,
      'STDate': this.datepipe.transform(this.STDate, 'MM/dd/yyyy'),
      'TrCode': this.Trcode.value,
      'MNo': this.OrderNo,
      'MDate': this.datepipe.transform(this.OrderDate, 'MM/dd/yyyy'),
      'RNo': this.RNo,
      'RDate': this.datepipe.transform(this.RDate, 'MM/dd/yyyy'),
      'LorryNo': this.LorryNo,
      'ReceivingCode': this.RNCode.value,
      'IssuingCode': this.GCode,
      'RCode': this.RCode,
      'GunnyUtilised': this.Gunnyutilised,
      'GunnyReleased': this.GunnyReleased,
      'GodownName': this.godownName,
      'TransactionName': this.Trcode.label,
      'ReceivingName': this.RTCode.label,
      'ManualDocNo': this.ManualDocNo,
      'RegionName': this.regionName,
      'IssueSlip': this.IssueSlip,
      'UserID': this.username.user,
      'documentSTItemDetails': this.itemData,
      'documentSTTDetails': this.STTDetails
    };
    this.restAPIService.post(PathConstants.STOCK_TRUCK_MEMO_DOCUMENT, params).subscribe(res => {
      if (res !== undefined) {
        if (res) {
          this.messageService.add({ key: 't-err', severity: 'success', summary: 'Success Message', detail: 'Saved Successfully!' });
          this.onClear();
          this.isSaveSucceed = false;
        } else {
          this.STTDetails = [];
          this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message', detail: 'Something went wrong!' });
        }
      }
    },(err: HttpErrorResponse) => {
      if (err.status === 0) {
        this.STTDetails = [];
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message', detail: 'Please try again!' });
      }
    });
  }

  onPrint() {
    const path = "../../assets/Reports/" + this.username.user + "/";
    const filename = this.GCode + GolbalVariable.StocTruckMemoRegFilename + ".txt";
    saveAs(path + filename, filename);
  }
}
