import { Component, OnInit } from '@angular/core';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { SelectItem } from 'primeng/api';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-truck-receipt',
  templateUrl: './truck-receipt.component.html',
  styleUrls: ['./truck-receipt.component.css']
})
export class TruckReceiptComponent implements OnInit {
  data: any;
  regions: any;
  godowns: any;
  itemCols: any;
  itemData: any = [];
  enteredItemDetails: any = [];
  index: number = 0;
  maxDate: Date = new Date();
  selectedValues: string[];
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
  STDate: Date;
  Trcode: any;
  OrderNo: any;
  OrderDate: Date;
  RNo: any;
  RDate: Date;
  LorryNo: any;
  RHCode: any;
  RTCode: any;
  RNCode: any;
  RCode: any;
  GCode: any;
  RRCode: any;
  ManualDocNo: any;
  Region: string;
  Scheme: any;
  TStockNo: any;
  ICode: any;
  GodownNo: any;
  LocationNo: any;
  IPCode: any;
  NoPacking: number;
  GKgs: number;
  NKgs: number;
  WTCode: string;
  Moisture: string;
  StackBalance: number;
  CurrentDocQtv: any;
  NetStackBalance: any;
  TransporterName: string;
  LWBillNo: any;
  WHDNo: any;
  HCharges: any;
  WCharges: any;
  Kilometers: number;
  FreightAmount: number;
  LWBillDate: Date;
  Gunnyutilised: any;
  GunnyReleased: any;
  FCode: string;
  VCode: string;
  FStation: string;
  TStation: string;
  RRNo: any;
  LDate: Date;
  WNo: any;
  RailFreightAmt: any;
  Remarks: string;

  constructor(private roleBasedService: RoleBasedService, private authService: AuthService,
    private restAPIService: RestAPIService, private tableConstants: TableConstants, private datepipe: DatePipe) {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;

  }

  ngOnInit() {
    this.scheme_data = this.roleBasedService.getSchemeData();
    this.itemCols = this.tableConstants.TruckMemoItemDetails;
    this.data = this.roleBasedService.getInstance();
    this.regions = this.roleBasedService.getRegions();
    this.godowns = this.roleBasedService.getGodowns();
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
        if (this.scheme_data !== undefined) {
          this.scheme_data.forEach(y => {
            schemeSelection.push({ 'label': y.SName, 'value': y.SCode });
            this.schemeOptions = schemeSelection;
          });
          this.schemeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        }
        break;
      case 'rt':
        if (this.Trcode !== null && this.Trcode.value !== undefined && this.Trcode.value !== '') {
          const params = new HttpParams().set('TRCode', this.Trcode.value).append('GCode', this.GCode);
          this.restAPIService.getByParameters(PathConstants.DEPOSITOR_TYPE_MASTER, params).subscribe((res: any) => {
            res.forEach(rt => {
              if (this.Trcode.label === 'Transfer') {
                receivorTypeList.push({ 'label': rt.Tyname, 'value': rt.Tycode });
              } else {
                receivorTypeList.push({ 'label': rt.Tyname, 'value': rt.Tycode });
              }
            });
            this.receivorTypeOptions = receivorTypeList;
            // this.isReceivorNameDisabled = false;
            this.receivorTypeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
          });
        }
        break;
      case 'rn':
        this.receivorNameList = [];
        if (this.Trcode !== null && this.Trcode.value !== undefined && this.Trcode.value !== '' &&
          this.RTCode !== null && this.RTCode.value !== undefined && this.RTCode.value !== '') {
          if (this.RTCode.value === 'TY008') {
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
            }
          } else {
            const params = new HttpParams().set('TyCode', this.RTCode.value).append('TRType', this.Trcode.transType).append('GCode', this.GCode);
            this.restAPIService.getByParameters(PathConstants.DEPOSITOR_NAME_MASTER, params).subscribe((res: any) => {
              res.forEach(rn => {
                this.receivorNameList.push({ 'label': rn.Issuername, 'value': rn.IssuerCode, 'IssuerRegion': rn.IssuerRegion });
              })
            this.receivorNameOptions = this.receivorNameList;
            });
          }
           this.receivorNameOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        }
        break;
      case 'rr':
        let regionsData = [];
        if (this.regions !== undefined && this.receivorRegionOptions === undefined) {
          this.regions.forEach(r => {
            regionsData.push({ 'label': r.RName, 'value': r.RCode });
          })
          this.receivorRegionOptions = regionsData;
          this.receivorRegionOptions.unshift({ 'label': '-select-', 'value': null });
        }
        break;
        case 'rh':
          if(this.toRailHeadOptions === undefined) {
            const params = new HttpParams().set('TyCode', 'TY016').append('TRType', this.Trcode.transType).append('GCode', this.GCode);
            this.restAPIService.getByParameters(PathConstants.DEPOSITOR_NAME_MASTER, params).subscribe((res: any) => {
              res.forEach(rh => {
                railHeads.push({ 'label': rh.RYName, 'value': rh.RYCode });
              })
            this.toRailHeadOptions = railHeads;
            this.toRailHeadOptions.unshift({ label: '-select-', value: null });
          });
          }
          break;
          case 'fs':
              if(this.fromStationOptions === undefined) {
                const params = new HttpParams().set('TyCode', 'TY016').append('TRType', this.Trcode.transType).append('GCode', this.GCode);
                this.restAPIService.getByParameters(PathConstants.DEPOSITOR_NAME_MASTER, params).subscribe((res: any) => {
                  res.forEach(fs => {
                    fromStation.push({ 'label': fs.RYName, 'value': fs.RYCode });
                  })
                this.fromStationOptions = fromStation;
                this.fromStationOptions.unshift({ label: '-select-', value: null });
                });
              }
            break;
            case'ts':
            if(this.toStationOptions === undefined) {
              const params = new HttpParams().set('TyCode', 'TY016').append('TRType', this.Trcode.transType).append('GCode', this.GCode);
              this.restAPIService.getByParameters(PathConstants.DEPOSITOR_NAME_MASTER, params).subscribe((res: any) => {
                res.forEach(ts => {
                  toStation.push({ 'label': ts.RYName, 'value': ts.RYCode });
                })
              this.toStationOptions = toStation;
              this.toStationOptions.unshift({ label: '-select-', value: null });
            });
            }
            break;
      case 'i_desc':
        let itemDesc = [];
        if (this.Scheme.value !== undefined && this.Scheme.value !== '' && this.Scheme !== null) {
          const params = new HttpParams().set('SCode', this.Scheme.value);
          this.restAPIService.getByParameters(PathConstants.COMMODITY_FOR_SCHEME, params).subscribe((res: any) => {
            res.forEach(i => {
              itemDesc.push({ 'label': i.ITDescription, 'value': i.ITCode });
            })
            this.itemDescOptions = itemDesc;
            this.itemDescOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
          });
        }
        break;
      case 'st_no':
        let stackNo = [];
        if (this.RCode !== undefined && this.ICode.value !== undefined && this.ICode.value !== '' && this.ICode !== null) {
          const params = new HttpParams().set('GCode', this.GCode).append('ITCode', this.ICode.value);
          this.restAPIService.getByParameters(PathConstants.STACK_DETAILS, params).subscribe((res: any) => {
            res.forEach(s => {
              stackNo.push({ 'label': s.StackNo, 'value': s.StackNo, 'stack_yr': s.CurYear });
            })
            this.stackOptions = stackNo;
            this.stackOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
          });
          if (this.TStockNo.value !== undefined && this.TStockNo.value !== '' && this.TStockNo !== null) {
            this.stackYear = this.TStockNo.stack_yr;
            let index;
            index = this.TStockNo.value.toString().indexOf('/', 1);
            const totalLength = this.TStockNo.value.length;
            this.GodownNo = this.TStockNo.value.toString().slice(0, index);
            this.LocationNo = this.TStockNo.value.toString().slice(index + 1, totalLength);
          }
        }
        break;
      case 'pt':
        if (this.packingTypeOptions === undefined) {
          this.restAPIService.get(PathConstants.PACKING_AND_WEIGHMENT).subscribe((res: any) => {
            res.Table.forEach(p => {
              packingTypes.push({ 'label': p.PName, 'value': p.Pcode, 'weight': p.PWeight });
            })
            this.packingTypeOptions = packingTypes;
            this.packingTypeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
          });
        } else {
          if (this.IPCode.value !== undefined && this.IPCode.value !== '' && this.IPCode !== null) {
            this.NoPacking = this.IPCode.weight;
            this.GKgs = this.NKgs = this.NoPacking * this.IPCode.weight;
            this.TKgs = this.GKgs - this.NKgs;
          } else {
            this.NoPacking = this.GKgs = this.NKgs = 0;
          }
        }
        break;
      case 'wmt':
        let weighment = [];
        if (this.wmtOptions === undefined) {
          this.restAPIService.get(PathConstants.PACKING_AND_WEIGHMENT).subscribe((res: any) => {
            res.Table1.forEach(w => {
              weighment.push({ 'label': w.WEType, 'value': w.WECode });
            })
            this.wmtOptions = weighment;
            this.wmtOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
          });
        }
        break;
        case 'fc':
          this.freightOptions = [ {label: '-select-', value: null}, {label: 'PAID', value: 'PAID' }, {label: 'PAY', value: 'PAY' }];
          break;
        case 'vc':
            this.vehicleOptions = [{ label: '-select-', value: null}, { label: 'CASUAL', value: 'CASUAL'},
             { label: 'CONTRACT', value: 'CONTRACT' }, { label: 'GOVT', value: 'GOVT'}];
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

  numberValidation(event) {
      if ((event.keyCode >= 32 && event.keyCode <= 47) || (event.keyCode >= 58 && event.keyCode <= 64) 
      || (event.keyCode >= 91 && event.keyCode <= 96) || (event.keyCode >= 123 && event.keyCode <= 127)) {
        return false;
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

  onSave() {
    if (this.selectedValues.length !== 0) {
      if (this.selectedValues.length === 2) {
        this.MTransport = 'UPCountry';
      } else if (this.selectedValues.length === 1) {
        this.MTransport = (this.selectedValues[0] === 'rail') ? 'Rail' : 'Road';
      }
    }
    const params = {
      'STNo': (this.STNo !== undefined) ? this.STNo : 0,
      'RowId': (this.RowId !== undefined) ? this.RowId : 0,
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


    };
  }
}
