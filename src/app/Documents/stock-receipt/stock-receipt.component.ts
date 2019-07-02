import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { SelectItem } from 'primeng/api';
import { PathConstants } from 'src/app/constants/path.constants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { HttpParams } from '@angular/common/http';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';

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
  entryList: any = [];
  regionName: any;
  godownName: any;
  data: any;
  selectedValues: string[] = [];
  depositorTypeOptions: SelectItem[];
  depositorNameOptions: SelectItem[];
  transactionOptions: SelectItem[];
  stackOptions: SelectItem[];
  month: any;
  monthOptions: SelectItem[];
  yearOptions: SelectItem[];
  year: any;
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
  OrderNo: any;
  OrderDate: Date;
  StackBalance: number;
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
  Moisture: number;
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
    private roleBasedService: RoleBasedService, private restAPIService: RestAPIService,
    private datepipe: DatePipe) {
  }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.scheme_data = this.roleBasedService.getSchemeData();
    this.data = this.roleBasedService.getInstance();
    this.itemCol = this.tableConstants.StockReceiptItemColumns;
    setTimeout(() => {
      this.regionName = this.data.rgData[0].RName;
      this.godownName = this.data.rgData[1].GName;
    },1200);
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
        this.monthOptions = [{ 'label': 'Jan', 'value': '01' },
        { 'label': 'Feb', 'value': '02' }, { 'label': 'Mar', 'value': '03' }, { 'label': 'Apr', 'value': '04' },
        { 'label': 'May', 'value': '05' }, { 'label': 'Jun', 'value': '06' }, { 'label': 'Jul', 'value': '07' },
        { 'label': 'Aug', 'value': '08' }, { 'label': 'Sep', 'value': '09' }, { 'label': 'Oct', 'value': '10' },
        { 'label': 'Nov', 'value': '11' }, { 'label': 'Dec', 'value': '12' }];
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
            this.restAPIService.getByParameters(PathConstants.DEPOSITOR_TYPE_MASTER, params).subscribe((res: any) => {
              res.forEach(dt => {
                depositorTypeList.push({ 'label': dt.Tyname, 'value': dt.Tycode });
              });
              this.depositorTypeOptions = depositorTypeList;
              this.isDepositorNameDisabled = false;
            });
          }
        break;
      case 'dn':
        if (this.DepositorType.value !== undefined && this.DepositorType.value !== '' && this.DepositorType !== null) {
          const params = new HttpParams().set('TyCode', this.DepositorType.value).append('TRType', this.TransType);
            this.restAPIService.getByParameters(PathConstants.DEPOSITOR_NAME_MASTER, params).subscribe((res: any) => {
              res.forEach(dn => {
                depositorNameList.push({ 'label': dn.DepositorName, 'value': dn.DepositorCode });
              })
              this.depositorNameOptions = depositorNameList;
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
            });
            this.isStackNoEnabled = false;
          }
        break;
      case 'st_no':
        let stackNo = [];
        this.ReceivingCode = '001';
        if (this.ReceivingCode !== undefined && this.ICode.value !== undefined && this.ICode.value !== '' && this.ICode !== null) {
          const params = new HttpParams().set('GCode', this.ReceivingCode).append('ITCode', this.ICode.value);
            this.restAPIService.getByParameters(PathConstants.STACK_DETAILS, params).subscribe((res: any) => {
              res.forEach(s => {
                stackNo.push({ 'label': s.StackNo, 'value': s.StackNo, 'stack_yr': s.CurYear });
              })
              this.stackOptions = stackNo;
            });
          } else {
            if (this.TStockNo.value !== undefined && this.TStockNo.value !== '' && this.TStockNo !== null) {
              this.stackYear = this.TStockNo.stack_yr;
              // this.godownNo = this.TStockNo.toString().startsWith('/');
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
    this.itemData.push({
      'TStockNo': this.TStockNo.label, 'Scheme': this.Scheme.label, 'ICode': this.ICode.label,
      'IPCode': this.IPCode.label, 'NoPacking': this.NoPacking, 'GKgs': this.GKgs, 'NKgs': this.NKgs,
      'WTCode': this.WTCode.label, 'Moisture': this.Moisture
    });
    this.entryList.push({
      'TStockNo': this.TStockNo.value, 'Scheme': this.Scheme.value, 'ICode': this.ICode.value,
      'IPCode': this.IPCode.value, 'NoPacking': this.NoPacking, 'GKgs': this.GKgs, 'NKgs': this.NKgs,
      'WTCode': this.WTCode.value, 'Moisture': this.Moisture
    });
  }

  onSave() {
    this.PAllotment = this.month.value + '/' + this.year.label;
    if (this.selectedValues.length !== 0) {
      if (this.selectedValues.length === 2) {
        this.MTransport = 'UPCountry';
      } else if (this.selectedValues.length === 1) {
        this.MTransport = (this.selectedValues[0] === 'rail') ? 'Rail' : 'Road';
      }
    }
    const params = {
      'SRDate': this.datepipe.transform(this.SRDate, 'MM/dd/yyyy'),
      'Pallotment': this.PAllotment,
      'OrderNo': this.OrderNo,
      'OrderDate': this.datepipe.transform(this.OrderDate, 'MM/dd/yyyy'),
      'ReceivingCode': this.ReceivingCode,
      'RCode': this.RCode,
      'MTransport': this.MTransport,
      'Trcode': this.Trcode.value,
      'DepositorType': this.DepositorType.value,
      'DepositorCode': this.DepositorCode.value,
      'TruckMemoNo': this.TruckMemoNo,
      'TruckMemoDate': this.datepipe.transform(this.TruckMemoDate, 'MM/dd/yyyy'),
      'ManualDocNo': this.ManualDocNo,
      'LNo': this.LNo,
      'LFrom': this.LFrom,
      'TStockNo': this.TStockNo.value,
      'Scheme': this.Scheme.value,
      'ICode': this.ICode.value,
      'IPCode': this.IPCode.value,
      'NoPacking': this.NoPacking,
      'GKgs': this.GKgs,
      'NKgs': this.NKgs,
      'WTCode': this.WTCode.value,
      'Moisture': this.Moisture,
      'ItemList': this.entryList
    }
    this.restAPIService.post(PathConstants.STOCK_RECEIPT_DOCUMENTS, params).subscribe(res => {
      console.log('res', res);
    });
  }

  openNext() {
    this.index = (this.index === 2) ? 0 : this.index + 1;
  }

  openPrev() {
    this.index = (this.index === 0) ? 2 : this.index - 1;
  }
}