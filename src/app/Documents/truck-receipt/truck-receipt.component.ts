import { Component, OnInit } from '@angular/core';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { SelectItem } from 'primeng/api';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-truck-receipt',
  templateUrl: './truck-receipt.component.html',
  styleUrls: ['./truck-receipt.component.css']
})
export class TruckReceiptComponent implements OnInit {
  itemCols: any;
  itemData: any = [];
  enteredItemDetails: any = [];
  index: number = 0;
  selectedValues: boolean;
  transactionOptions: SelectItem[];
  toRailHeadOptions: SelectItem[];
  receivorTypeOptions: SelectItem[];
  receivorNameOptions: SelectItem[];
  receivorRegionOptions: SelectItem[];
  schemeOptions: SelectItem[];
  stackOptions: SelectItem[];
  itemDescOptions: SelectItem[];
  packingTypeOptions: SelectItem[];
  wmtOptions: SelectItem[];
  moistureOptions: SelectItem[];
  freightOptions: SelectItem[];
  vehicleOptions: SelectItem[];
  fromStationOptions: SelectItem[];
  toStationOptions: SelectItem[];
  stackYear: any;
  scheme_data: any;
  godownName: string;
  regionName: string;
  canShowMenu: boolean;
  TKgs: number;
  TruckNo: any;
  Trcode: any;
  OrderNo: any;
  OrderDate: Date;
  ROrderNo: any;
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
  Moisture: number;
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
    private restAPIService: RestAPIService, private tableConstants: TableConstants) { 
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;

  }

  ngOnInit() {
    this.scheme_data = this.roleBasedService.getSchemeData();
    this.itemCols = this.tableConstants.TruckMemoItemDetails;
  }

  onSelect(selectedItem) {
    let transactoinSelection = [];
    let schemeSelection = [];
    let receivorTypeList = [];
    let receivorNameList = [];
    let packingTypes = [];
    switch(selectedItem) {
        case 'tr':
        if (this.transactionOptions === undefined) {
          this.restAPIService.get(PathConstants.TRANSACTION_MASTER).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                transactoinSelection.push({ 'label': y.TRName, 'value': y.TRCode, 'transType': y.TransType });
                this.transactionOptions = transactoinSelection;
              });
              // this.isReceivorTypeDisabled = false;
              this.transactionOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
            }
          })
        }
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
              res.forEach(dt => {
                receivorTypeList.push({ 'label': dt.Tyname, 'value': dt.Tycode });
              });
              this.receivorTypeOptions = receivorTypeList;
              // this.isReceivorNameDisabled = false;
              this.receivorTypeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
            });
        }
        break;
      case 'rn':
        if (this.Trcode !== null && this.Trcode.value !== undefined && this.Trcode.value !== '' &&
          this.RTCode !== null && this.RTCode.value !== undefined && this.RTCode.value !== '') {
          const params = new HttpParams().set('TyCode', this.RTCode.value).append('TRType', this.Trcode.transType);
            this.restAPIService.getByParameters(PathConstants.DEPOSITOR_NAME_MASTER, params).subscribe((res: any) => {
              res.forEach(dn => {
                receivorNameList.push({ 'label': dn.DepositorName, 'value': dn.DepositorCode });
              })
              this.receivorNameOptions = receivorNameList;
              this.receivorNameOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
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
          const params = new HttpParams().set('GCode', this.RCode).append('ITCode', this.ICode.value);
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
      }
    }

  openNext() {
    this.index = (this.index === 2) ? 0 : this.index + 1;
  }
  
  openPrev() {
    this.index = (this.index === 0) ? 2 : this.index - 1;
  }
}
