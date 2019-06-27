import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { SelectItem } from 'primeng/api';
import { PathConstants } from 'src/app/constants/path.constants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { HttpParams } from '@angular/common/http';
import { TableConstants } from 'src/app/constants/tableconstants';

@Component({
  selector: 'app-stock-receipt',
  templateUrl: './stock-receipt.component.html',
  styleUrls: ['./stock-receipt.component.css']
})
export class StockReceiptComponent implements OnInit {
  scheme_data: any;
  itemCol: any;
  itemData: any = [];
  regionName: any;
  godownName: any;
  data: any;
  selectedValues: string[] = [];
  depositorTypeOptions: SelectItem[];
  depositorNameOptions: SelectItem[];
  transactionOptions: SelectItem[];
  stackOptions: SelectItem[];
  month: string;
  monthOptions: SelectItem[];
  yearOptions: SelectItem[];
  year: string;
  tareWt: number;
  moistureOptions: SelectItem[];
  itemDescOptions: SelectItem[];
  schemeOptions: SelectItem[];
  packingTypeOptions: SelectItem[];
  isDepositorTypeDisabled: boolean = true;
  isDepositorNameDisabled: boolean = true;
  locationNo: any;
  stackYear: any;
  isStackNoEnabled: boolean = true;
  isItemDescEnabled: boolean = true;
  wmtOptions: SelectItem[];
  fromStationOptions: SelectItem[];
  toStationOptions: SelectItem[];
  vehicleOptions: SelectItem[];
  freightOptions: SelectItem[];
  TransType: string;
  godownNo: any;
  OrderNo: number;
  OrderDate: Date;
  canShowMenu: boolean;
  ReceivingCode: string;
  RCode: number;
  //SR-Details
  SRNo: any;
  SRDate: Date;
  PAllotment: any;
  MTransport: string;
  Trcode: any;
  DepositorType: any;
  DepositorCode: any;
  TruckMemoNo: any;
  TruckMemoDate: Date;
  ManualDocNo: number;
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
  StackBalance: number;
  //SR-Freight Details
  TransporterName: string;
  LWBillNo: any;
  LWBillDate: Date;
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
  LDate: Date;
  WNo: any;
  Remarks: string;
  @ViewChild('tabs')
  tabs: ElementRef;
  transactoinSelection: any = [];


  constructor(private authService: AuthService, private tableConstants: TableConstants,
    private roleBasedService: RoleBasedService, private restAPIService: RestAPIService) {
    // if (this.data === undefined) {
    //   this.data = this.roleBasedService.getGodownAndRegion();
    //   setTimeout(() => {
    //    this.regionName = this.data.RName; this.godownName = this.data.GName;
    // },2000);
    // }

  }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.scheme_data = this.roleBasedService.getSchemeData();
    this.itemCol = this.tableConstants.StockReceiptItemColumns;
  }

  onSelect(selectedItem) {
    let schemeSelection = [];
    let depositorNameList = [];
    let yearArr = [];
    let depositorTypeList = [];
    let packingTypes: any = [];
    const range = 3;
    switch (selectedItem) {
      case 'y':
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
        break;
      case 'm':
        this.monthOptions = [{ 'label': 'Jan', 'value': 1 },
        { 'label': 'Feb', 'value': 2 }, { 'label': 'Mar', 'value': 3 }, { 'label': 'Apr', 'value': 4 },
        { 'label': 'May', 'value': 5 }, { 'label': 'Jun', 'value': 6 }, { 'label': 'Jul', 'value': 7 },
        { 'label': 'Aug', 'value': 8 }, { 'label': 'Sep', 'value': 9 }, { 'label': 'Oct', 'value': 10 },
        { 'label': 'Nov', 'value': 11 }, { 'label': 'Dec', 'value': 12 }];
        break;
      case 'tr':
        if (this.transactionOptions === undefined) {
          this.restAPIService.get(PathConstants.TRANSACTION_MASTER).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                this.transactoinSelection.push({ 'label': y.TRName, 'value': y.TRCode, 'transType': y.TransType });
                this.transactionOptions = this.transactoinSelection.slice(0);
                this.isDepositorTypeDisabled = false;
              });
            }
          })
        } else {
          if (this.Trcode.value !== undefined && this.Trcode.value !== '' && this.Trcode !== null) {
            this.isDepositorTypeDisabled = false;
                this.TransType = this.Trcode.transType;
          }
        }
        break;
      case 'sc':
        if (this.scheme_data !== undefined) {
          this.scheme_data.forEach(y => {
            schemeSelection.push({ 'label': y.SName, 'value': y.SCode });
            this.schemeOptions = schemeSelection;
          });
          this.isItemDescEnabled = false;
        }
        break;
      case 'dt':
        if (this.Trcode.value !== undefined && this.Trcode.value !== '' && this.Trcode !== null) {
          const params = new HttpParams().set('TRCode', this.Trcode.value).append('GCode', '002');
          if (this.depositorTypeOptions === undefined) {
            this.restAPIService.getByParameters(PathConstants.DEPOSITOR_TYPE_MASTER, params).subscribe((res: any) => {
              res.forEach(dt => {
                depositorTypeList.push({ 'label': dt.Tyname, 'value': dt.Tycode });
              });
              this.depositorTypeOptions = depositorTypeList;
              this.isDepositorNameDisabled = false;
            });
          }
        }
        break;
      case 'dn':
        if (this.DepositorType.value !== undefined && this.DepositorType.value !== '' && this.DepositorType !== null) {
          const params = new HttpParams().set('TyCode', this.DepositorType.value).append('TRType', this.TransType);
          if (this.depositorNameOptions === undefined) {
            this.restAPIService.getByParameters(PathConstants.DEPOSITOR_NAME_MASTER, params).subscribe((res: any) => {
              res.forEach(dn => {
                depositorNameList.push({ 'label': dn.DepositorName, 'value': dn.DepositorCode });
              })
              this.depositorNameOptions = depositorNameList;
            });
          }
        }
        break;
      case 'i_desc':
        let itemDesc = [];
        if (this.Scheme.value !== undefined && this.Scheme.value !== '' && this.Scheme !== null) {
          const params = new HttpParams().set('SCode', this.Scheme.value);
          if (this.itemDescOptions === undefined) {
            this.restAPIService.getByParameters(PathConstants.COMMODITY_FOR_SCHEME, params).subscribe((res: any) => {
              res.forEach(i => {
                itemDesc.push({ 'label': i.ITDescription, 'value': i.ITCode });
              })
              this.itemDescOptions = itemDesc;
            });
            this.isStackNoEnabled = false;
          }
        }
        break;
      case 'st_no':
        let stackNo = [];
        this.ReceivingCode = '001';
        if (this.ReceivingCode !== undefined && this.ICode.value !== undefined && this.ICode.value !== '' && this.ICode !== null) {
          const params = new HttpParams().set('GCode', this.ReceivingCode).append('ITCode', this.ICode.value);
          if (this.stackOptions === undefined) {
            this.restAPIService.getByParameters(PathConstants.STACK_DETAILS, params).subscribe((res: any) => {
              res.forEach(s => {
                stackNo.push({ 'label': s.StackNo, 'value': s.StackNo, 'stack_yr': s.CurYear });
              })
              this.stackOptions = stackNo;
            });
          } else {
            if (this.TStockNo.value !== undefined && this.TStockNo.value !== '' && this.TStockNo !== null){
              this.stackYear = this.TStockNo.stack_yr;
              // this.godownNo = this.TStockNo.toString().startsWith('/');
            }
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
          });
        } else {
          if (this.IPCode.value !== undefined && this.IPCode.value !== '' && this.IPCode !== null) {
              this.NoPacking = this.IPCode.weight;
              this.GKgs = this.NKgs = this.NoPacking * this.IPCode.weight;
              this.tareWt = this.GKgs - this.NKgs;
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
          });
        }
        break;
    }
  }

  onEnter() {
    this.itemData.push({'TStockNo': this.TStockNo.label, 'Scheme': this.Scheme.label, 'ICode': this.ICode.label,
  'IPCode': this.IPCode.label, 'NoPacking': this.NoPacking, 'GKgs': this.GKgs, 'NKgs': this.NKgs,
'WTCode': this.WTCode.label, 'Moisture': this.Moisture});
  }

  onSave() {
    this.PAllotment = this.month + '/' + this.year;
    if (this.selectedValues.length !== 0) {
      if (this.selectedValues.length === 2) {
        this.MTransport = 'UPCountry';
      } else if (this.selectedValues.length === 1) {
        this.MTransport = (this.selectedValues[0] === 'rail') ? 'Rail' : 'Road';
      }
    }
  }
}