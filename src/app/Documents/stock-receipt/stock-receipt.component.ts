import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { SelectItem, MessageService } from 'primeng/api';
import { PathConstants } from 'src/app/constants/path.constants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { HttpParams } from '@angular/common/http';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-stock-receipt',
  templateUrl: './stock-receipt.component.html',
  styles: [`
        :host ::ng-deep button {
            margin-right: .25em;
        }

        :host ::ng-deep .custom-toast .ui-toast-message {
            color: #ffffff;
            background: #FC466B;
            background: -webkit-linear-gradient(to right, #3F5EFB, #FC466B);
            background: linear-gradient(to right, #3F5EFB, #FC466B);
        }

        :host ::ng-deep .custom-toast .ui-toast-close-icon {
            color: #ffffff;
        }
    `],
  styleUrls: ['./stock-receipt.component.css']
})
export class StockReceiptComponent implements OnInit {
  index: number = 0;
  scheme_data: any;
  itemCol: any;
  itemData: any = [];
  documentViewCol: any;
  documentViewData: any = [];
  entryList: any = [];
  regionName: any;
  godownName: any;
  data: any;
  RowId: any;
  selectedValues: string[] = [];
  depositorTypeOptions: SelectItem[];
  depositorNameOptions: SelectItem[];
  transactionOptions: SelectItem[];
  stackOptions: SelectItem[];
  month: any;
  monthOptions: SelectItem[];
  yearOptions: SelectItem[];
  year: any;
  disableOkButton: boolean = true;
  isViewClicked: boolean = false;
  tareWt: number;
  maxDate: Date;
  enableActions: boolean = true;
  viewDate: Date = new Date();
  moistureOptions: SelectItem[];
  itemDescOptions: SelectItem[];
  schemeOptions: SelectItem[];
  packingTypeOptions: SelectItem[];
  isDepositorTypeDisabled: boolean = true;
  isDepositorNameDisabled: boolean = true;
  locationNo: any;
  transactoinSelection: any = [];
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
  TransType: string;
  godownNo: any;
  OrderNo: any;
  OrderDate: Date;
  StackBalance: number;
  viewPane: boolean;
  canShowMenu: boolean;
  ReceivingCode: string;
  RCode: number;
  //SR-Details
  SRNo: any;
  SRDate: Date = new Date();
  PAllotment: any;
  MTransport: string;
  Trcode: any;
  DepositorType: any;
  DepositorCode: any;
  TruckMemoNo: any;
  TruckMemoDate: any;
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
  username: any;
  UnLoadingSlip: any;

  constructor(private authService: AuthService, private tableConstants: TableConstants,
    private roleBasedService: RoleBasedService, private restAPIService: RestAPIService,
    private datepipe: DatePipe, private messageService: MessageService) {
  }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.scheme_data = this.roleBasedService.getSchemeData();
    this.data = this.roleBasedService.getInstance();
    this.itemCol = this.tableConstants.StockReceiptItemColumns;
    this.documentViewCol = this.tableConstants.StockReceiptDocumentViewCols;
    this.maxDate = new Date();
    this.username = JSON.parse(this.authService.getCredentials());
    setTimeout(() => {
      this.regionName = this.data[0].RName;
      this.godownName = this.data[0].GName;
      this.ReceivingCode = this.data[0].GCode;
      this.RCode = this.data[0].RCode;
    }, 1200);
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
        this.yearOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        break;
      case 'm':
        this.monthOptions = [{ 'label': 'Jan', 'value': '01' },
        { 'label': 'Feb', 'value': '02' }, { 'label': 'Mar', 'value': '03' }, { 'label': 'Apr', 'value': '04' },
        { 'label': 'May', 'value': '05' }, { 'label': 'Jun', 'value': '06' }, { 'label': 'Jul', 'value': '07' },
        { 'label': 'Aug', 'value': '08' }, { 'label': 'Sep', 'value': '09' }, { 'label': 'Oct', 'value': '10' },
        { 'label': 'Nov', 'value': '11' }, { 'label': 'Dec', 'value': '12' }];
        this.monthOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        break;
      case 'tr':
        if (this.transactionOptions === undefined) {
          this.restAPIService.get(PathConstants.TRANSACTION_MASTER).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                this.transactoinSelection.push({ 'label': y.TRName, 'value': y.TRCode, 'transType': y.TransType });
                this.transactionOptions = this.transactoinSelection.slice(0);
              });
              this.transactionOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
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
          this.schemeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
          this.isItemDescEnabled = (this.Scheme !== null && this.Scheme !== undefined) ? false : true;
        }
        break;
      case 'dt':
        this.isViewClicked = false;
        if (this.Trcode.value !== undefined && this.Trcode.value !== '' && this.Trcode !== null) {
          const params = new HttpParams().set('TRCode', this.Trcode.value).append('GCode', this.ReceivingCode);
          this.restAPIService.getByParameters(PathConstants.DEPOSITOR_TYPE_MASTER, params).subscribe((res: any) => {
            res.forEach(dt => {
              depositorTypeList.push({ 'label': dt.Tyname, 'value': dt.Tycode });
            });
            this.depositorTypeOptions = depositorTypeList;
            this.isDepositorNameDisabled = (this.DepositorType !== null && this.DepositorType !== undefined) ? false : true;
            this.depositorTypeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
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
            this.depositorNameOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
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
          this.isStackNoEnabled = (this.ICode !== null && this.ICode !== undefined) ? false : true;
        }
        break;
      case 'st_no':
        let stackNo = [];
        if (this.ReceivingCode !== undefined && this.ICode.value !== undefined && this.ICode.value !== '' && this.ICode !== null) {
          const params = new HttpParams().set('GCode', this.ReceivingCode).append('ITCode', this.ICode.value);
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
            this.godownNo = this.TStockNo.value.toString().slice(0, index);
            this.locationNo = this.TStockNo.value.toString().slice(index + 1, totalLength);
          }
        }
        break;
      case 'pt':
        if (this.packingTypeOptions === undefined && !this.isViewClicked) {
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
            this.tareWt = this.GKgs - this.NKgs;
          } else {
            this.NoPacking = this.GKgs = this.NKgs = 0;
          }
        }
        break;
      case 'wmt':
        let weighment = [];
        if (this.wmtOptions === undefined && !this.isViewClicked) {
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

  deleteRow(id, index) {
    switch(id) {
      case 'item':
        this.itemData.splice(index, 1);
        break;
      case 'view':
        this.documentViewData.splice(index, 1);
        break;
    }
  }

  onEnter() {
    this.ICode = this.TStockNo = this.Scheme = this.IPCode = this.WTCode = this.Moisture = this.NoPacking
    = this.GKgs = this.NKgs = this.WTCode = this.tareWt = null;
    this.itemData.push({
      'TStockNo': this.TStockNo.label, 'Scheme': this.Scheme.label, 'ICode': this.ICode.label,
      'IPCode': this.IPCode.label, 'NoPacking': this.NoPacking, 'GKgs': this.GKgs, 'Nkgs': this.NKgs,
      'WTCode': this.WTCode.label, 'Moisture': this.Moisture
    });
    this.entryList.push({
      'TStockNo': this.TStockNo.value, 'Scheme': (this.Scheme.value !== undefined) ? this.Scheme.value : this.schemeCode,
      'ICode': (this.ICode.value !== undefined) ? this.ICode.value : this.iCode,
      'IPCode': (this.IPCode.value !== undefined) ? this.IPCode.value : this.ipCode,
      'NoPacking': this.NoPacking, 'GKgs': this.GKgs, 'Nkgs': this.NKgs,
      'WTCode': (this.WTCode.value !== undefined) ? this.WTCode.value : this.wtCode,
      'Moisture': this.Moisture,
      'CommodityName': (this.ICode.label !== undefined) ? this.ICode.label : this.ICode,
      'SchemeName': (this.Scheme.label !== undefined) ? this.Scheme.label : this.Scheme,
      'PackingName': (this.IPCode.label !== undefined) ? this.IPCode.label : this.IPCode
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
      'SRNo': (this.SRNo !== undefined) ? this.SRNo : 0,
      'RowId': (this.RowId !== undefined) ? this.RowId : 0,
      'SRDate': this.datepipe.transform(this.SRDate, 'MM/dd/yyyy'),
      'PAllotment': this.PAllotment,
      'OrderNo': this.OrderNo,
      'OrderDate': this.datepipe.transform(this.OrderDate, 'MM/dd/yyyy'),
      'ReceivingCode': this.ReceivingCode,
      'RCode': this.RCode,
      'MTransport': (this.MTransport !== undefined) ? this.MTransport : '',
      'Trcode': (this.Trcode.value !== undefined) ? this.Trcode.value : this.trCode,
      'DepositorType': (this.DepositorType.value !== undefined) ? this.DepositorType.value : this.depositorType,
      'DepositorCode': (this.DepositorCode.value !== undefined) ? this.DepositorCode.value : this.depositorCode,
      'TruckMemoNo': this.TruckMemoNo,
      'TruckMemoDate': this.datepipe.transform(this.TruckMemoDate, 'MM/dd/yyyy'),
      'ManualDocNo': this.ManualDocNo,
      'LNo': (this.LNo !== undefined) ? this.LNo : '',
      'LFrom': (this.LFrom !== undefined) ? this.LFrom : '',
      'ItemList': this.entryList,
      'Remarks': (this.Remarks !== undefined) ? this.Remarks : '',
      'GodownName': this.godownName,
      'TransactionType': (this.DepositorType.label !== undefined) ? this.DepositorType.label : this.DepositorType,
      'DepositorName': (this.DepositorCode.label !== undefined) ? this.DepositorCode.label : this.DepositorCode,
      'UserID': this.username.user,
      'RegionName': this.regionName,
      'UnLoadingSlip': (this.SRNo === 0) ? 'N' : this.UnLoadingSlip
    }
    this.restAPIService.post(PathConstants.STOCK_RECEIPT_DOCUMENTS, params).subscribe(res => {
      if (res !== undefined) {
        if (res) {
          this.messageService.add({ key: 't-err', severity: 'success', summary: 'Success Message', detail: 'Saved Successfully!' });
        } else {
          this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message', detail: 'Something went wrong!' });
        }
      }
    });
  }

  onView() {
    this.viewPane = this.isViewClicked = true;
    const params = new HttpParams().set('sValue', this.datepipe.transform(this.viewDate, 'MM/dd/yyyy')).append('Type', '1');
    this.restAPIService.getByParameters(PathConstants.STOCK_RECEIPT_VIEW_DOCUMENTS, params).subscribe((res: any) => {
      res.forEach(data => {
        data.OrderDate = this.datepipe.transform(data.OrderDate, 'dd-MM-yyyy');
        data.SRDate = this.datepipe.transform(data.SRDate, 'dd-MM-yyyy');
      })
      this.documentViewData = res;
    });
  }

  onRowSelect(event) {
    this.SRNo = event.data.SRNo;
    this.disableOkButton = false;
  }

  getDocBySRNo() {
    this.viewPane = this.enableActions = false;
    const params = new HttpParams().set('sValue', this.SRNo).append('Type', '2');
    this.restAPIService.getByParameters(PathConstants.STOCK_RECEIPT_VIEW_DOCUMENTS, params).subscribe((res: any) => {
      if (res !== undefined && res.length !== 0) {
        this.SRNo = res[0].SRNO;
        this.SRDate = res[0].SRDate;
        this.RowId = res[0].RowId;
        this.OrderDate = new Date(res[0].OrderDate);
        this.OrderNo = res[0].OrderNo;
        this.TruckMemoDate = new Date(res[0].TruckMemoDate);
        this.TruckMemoNo = res[0].TruckMemoNo;
        this.LNo = res[0].LNo;
        this.LFrom = res[0].LFrom;
        this.month = res[0].Pallotment.slice(0, 1);
        this.year = res[0].Pallotment.slice(3, 6);
        this.transactionOptions = [{ 'label': res[0].TRName, 'value': res[0].Trcode }];
        this.Trcode = res[0].TRName;
        this.trCode = res[0].Trcode;
        this.wmtOptions = [{ 'label': res[0].WEType, 'value': res[0].WTCode }];
        this.WTCode = res[0].WEType;
        this.wtCode = res[0].WTCode;
        this.NoPacking = res[0].NoPacking;
        this.GKgs = res[0].GKgs;
        this.NKgs = res[0].Nkgs;
        this.Moisture = res[0].Moisture;
        this.itemDescOptions = [{ 'label': res[0].ITName, 'value': res[0].ICode }];
        this.ICode = res[0].ITName;
        this.iCode = res[0].ITCode;
        this.packingTypeOptions = [{ 'label': res[0].PName, 'value': res[0].IPCode }];
        this.IPCode = res[0].PName;
        this.ipCode = res[0].IPCode;
        this.schemeOptions = [{ 'label': res[0].SCName, 'value': res[0].Scheme }];
        this.Scheme = res[0].SCName;
        this.schemeCode = res[0].Scheme;
        this.stackOptions = [{ 'label': res[0].TStockNo, 'value': res[0].TStockNo }];
        this.TStockNo = res[0].TStockNo;
        this.depositorTypeOptions = [{ 'label': res[0].DepositorType, 'value': res[0].IssuerType }];
        this.DepositorType = res[0].DepositorType;
        this.depositorType = res[0].IssuerType;
        this.depositorNameOptions = [{ 'label': res[0].DepositorName, 'value': res[0].IssuingCode }];
        this.DepositorCode = res[0].DepositorName;
        this.depositorCode = res[0].IssuingCode;
        this.PAllotment = res[0].Pallotment;
        this.LNo = res[0].LNo;
        this.selectedValues = res[0].TransportMode;
        this.ManualDocNo = res[0].Flag1;
        this.UnLoadingSlip = res[0].UnLoadingSlip;
      }
    });
  }

  onPrint() {
  const path = "../../assets/Reports/";
  const filename = this.ReceivingCode + GolbalVariable.StockReceiptDocument + ".txt";
 // saveAs(path + filename, filename);
    
  }

  onClear() {
    this.itemData = this.entryList = [];

  }

  openNext() {
    this.index = (this.index === 2) ? 0 : this.index + 1;
  }

  openPrev() {
    this.index = (this.index === 0) ? 2 : this.index - 1;
  }
}