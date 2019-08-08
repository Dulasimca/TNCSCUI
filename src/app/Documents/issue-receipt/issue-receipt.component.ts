import { Component, OnInit } from '@angular/core';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { SelectItem, MessageService, ConfirmationService } from 'primeng/api';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { saveAs } from 'file-saver';

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
  packingTypes: any = [];
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
  isSaveSucceed: boolean;
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
  RegularAdvance: any;
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
  IPCode: any;
  NoPacking: any;
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

  constructor(private roleBasedService: RoleBasedService, private restAPIService: RestAPIService, private messageService: MessageService,
    private authService: AuthService, private tableConstants: TableConstants, private datepipe: DatePipe,
    private confirmationService: ConfirmationService) {
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
    this.month = new Date(this.curMonth).toDateString().slice(4,7);
    this.monthOptions = [{ label: this.month, value: this.curMonth}];
    this.year = new Date().getFullYear();
    this.yearOptions = [{ label: this.year, value: this.year}];
    setTimeout(() => {
      this.regionName = this.data[0].RName;
      this.issuingGodownName = this.data[0].GName;
      this.IssuingCode = this.data[0].GCode;
      this.RCode = this.data[0].RCode;
    }, 1200);
  }
  onSelect(selectedItem) {
    let transactoinSelection = [];
    let schemeSelection = [];
    let yearArr = [];
    let receivorTypeList = [];
    let receivorNameList = [];
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
          this.yearOptions = yearArr;
          this.yearOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        }
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
            }
          })
        break;
      case 'sc':
        if (this.scheme_data !== undefined && this.scheme_data !== null) {
          this.scheme_data.forEach(y => {
            schemeSelection.push({ 'label': y.SName, 'value': y.SCode });
          });
          this.schemeOptions = schemeSelection;
            this.schemeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        }
        break;
      case 'rt':
        if (this.Trcode !== null && this.Trcode.value !== undefined && this.Trcode.value !== '') {
          const params = new HttpParams().set('TRCode', this.Trcode.value).append('GCode', this.IssuingCode);
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
        break;
      case 'rn':
        if (this.Trcode !== null && this.Trcode.value !== undefined && this.Trcode.value !== '' &&
          this.RTCode !== null && this.RTCode.value !== undefined && this.RTCode.value !== '') {
          const params = new HttpParams().set('TyCode', this.RTCode.value).append('TRType', this.transType).append('GCode', this.IssuingCode);
          this.restAPIService.getByParameters(PathConstants.DEPOSITOR_NAME_MASTER, params).subscribe((res: any) => {
            if (res !== null && res !== undefined && res.length !== 0) {
              res.forEach(rn => {
                receivorNameList.push({ 'label': rn.Issuername, 'value': rn.IssuerCode });
              })
              this.receiverNameOptions = receivorNameList;
              this.receiverNameOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
            }
          });
        }
        break;
      case 'i_desc':
        let itemDesc = [];
        if (this.Scheme.value !== undefined && this.Scheme.value !== '' && this.Scheme !== null) {
          const params = new HttpParams().set('SCode', this.Scheme.value);
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
        break;
      case 'st_no':
        let stackNo = [];
        if (this.RCode !== undefined && this.ICode.value !== undefined && this.ICode.value !== '' && this.ICode !== null) {
          const params = new HttpParams().set('GCode', this.IssuingCode).append('ITCode', this.ICode.value);
          this.restAPIService.getByParameters(PathConstants.STACK_DETAILS, params).subscribe((res: any) => {
            if (res !== null && res !== undefined && res.length !== 0) {
              res.forEach(s => {
                stackNo.push({ 'label': s.StackNo, 'value': s.StackNo, 'stack_date': s.ObStackDate, 'stack_yr': s.CurYear });
              })
              this.stackOptions = stackNo;
              this.stackOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
            }
          });
          if (this.TStockNo !== undefined && this.TStockNo !== null) {
            this.stackYear = this.TStockNo.stack_yr;
            let index;
            let s: string;
            index = this.TStockNo.value.toString().indexOf('/', 2);
            const totalLength = this.TStockNo.value.length;
            this.godownNo = this.TStockNo.value.toString().slice(0, index);
            this.locationNo = this.TStockNo.value.toString().slice(index + 1, totalLength);
          }
        }
        break;
      case 'pt':
        if (this.packingTypeOptions === undefined) {
          this.restAPIService.get(PathConstants.PACKING_AND_WEIGHMENT).subscribe((res: any) => {
            if (res !== null && res !== undefined && res.length !== 0) {
              res.Table.forEach(p => {
                this.packingTypes.push({ 'label': p.PName, 'value': p.Pcode, 'weight': p.PWeight });
              })
              this.packingTypeOptions = this.packingTypes;
              this.packingTypeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
            }
          });
        }
        break;
      case 'wmt':
        let weighment = [];
        if (this.wmtOptions === undefined) {
          this.restAPIService.get(PathConstants.PACKING_AND_WEIGHMENT).subscribe((res: any) => {
            if (res !== null && res !== undefined && res.length !== 0) {
              res.Table1.forEach(w => {
                weighment.push({ 'label': w.WEType, 'value': w.WECode });
              })
              this.wmtOptions = weighment;
              this.wmtOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
            }
          });
        }
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
    if (this.NoPacking !== undefined && this.NoPacking !== null
      && this.IPCode !== undefined && this.IPCode.weight !== undefined) {
      this.GKgs = this.NKgs = this.NoPacking * this.IPCode.weight;
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
    let stack_data = event.value;
    const params = {
      TStockNo: stack_data.value,
      StackDate: stack_data.stack_date,
      GCode: this.IssuingCode,
      ICode: this.ICode.value,
      Type: 1
    }
    this.restAPIService.post(PathConstants.STACK_BALANCE, params).subscribe(res => {
      if (res !== null && res !== undefined && res.length !== 0) {
        this.StackBalance = (res[0].StackBalance * 1).toFixed(3);
        this.StackBalance = (this.StackBalance * 1);
        if (this.StackBalance > 0) {
          this.isValidStackBalance = false;
        } else {
          this.isValidStackBalance = true;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message', detail: 'Stack Balance is not sufficient!' });
        }
      }
    })
    if(this.StackBalance > 0 && this.CurrentDocQtv > 0 && this.itemData.length !== 0) {
      this.itemData.forEach(x => {
        if(x.TStockNo === stack_data.value) {
          this.CurrentDocQtv += (x.Nkgs * 1);
          this.NetStackBalance = (this.StackBalance * 1) - (this.CurrentDocQtv * 1);
        } else { this.NetStackBalance = this.CurrentDocQtv = 0; }
      })
    }
  }


  onIssueDetailsEnter() {
    this.DNo = this.DeliveryOrderNo;
    this.DDate = this.DeliveryOrderDate;
    this.SI_Date = this.SIDate;
    this.issueData.push({
      'SINo': (this.SINo !== undefined) ? this.SINo : '-',
      'SIDate': this.datepipe.transform(this.SIDate, 'MM/dd/yyyy'),
      'DNo': this.DeliveryOrderNo,
      'DDate': this.datepipe.transform(this.DeliveryOrderDate, 'MM/dd/yyyy'),
      'RCode': this.RCode, 'GodownCode': this.IssuingCode,
      'DeliveryOrderDate': this.datepipe.transform(this.DeliveryOrderDate, 'dd/MM/yyyy'),
      'IssueMemoDate': this.datepipe.transform(this.SIDate, 'dd/MM/yyyy'),
    });
    if (this.issueData.length !== 0) {
      this.DeliveryOrderDate = this.DeliveryOrderNo = null;
      this.issueData = this.issueData.filter(x => {
         return x.SIDate === this.datepipe.transform(this.SIDate, 'MM/dd/yyyy')
       });
     }
  }

  onItemDetailsEnter() {
    this.itemData.push({
      'TStockNo': (this.TStockNo.value !== undefined) ? this.TStockNo.value : this.TStockNo,
      'ICode': (this.ICode.value !== undefined) ? this.ICode.value: this.iCode,
      'IPCode': (this.IPCode.value !== undefined) ? this.IPCode.value : this.ipCode,
      'NoPacking': this.NoPacking,
      'GKgs': this.GKgs,
      'Nkgs': this.NKgs,
      'WTCode': (this.WTCode.value !== undefined) ? this.WTCode.value : this.wtCode,
      'Moisture': this.Moisture,
      'Scheme': (this.Scheme.value !== undefined) ? this.Scheme.value : this.schemeCode,
      'CommodityName': (this.ICode.label !== undefined) ? this.ICode.label : this.ICode,
      'SchemeName': (this.Scheme.label !== undefined) ? this.Scheme.label : this.Scheme,
      'PackingName': (this.IPCode.label  !== undefined) ? this.IPCode.label : this.IPCode,
      'WmtType': (this.WTCode.label !== undefined) ? this.WTCode.label : this.WTCode
    });
    if (this.itemData.length !== 0) {
      this.StackBalance = (this.StackBalance * 1);
      this.CurrentDocQtv = 0;
      this.itemData.forEach(x => {
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
      this.TStockNo = this.ICode = this.IPCode = this.NoPacking = this.GKgs = this.NKgs =
        this.godownNo = this.locationNo = this.TKgs = this.WTCode = this.Moisture = this.Scheme = null;
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
        this.Scheme = data.SchemeName; this.schemeCode = data.Scheme;
        this.schemeOptions = [{ label: data.SchemeName, value: data.Scheme}];
        this.ICode = data.CommodityName; this.iCode = data.ICode;
        this.itemDescOptions = [{ label: data.CommodityName, value: data.ICode }];
        this.IPCode = data.PackingName; this.ipCode = data.IPCode;
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
        this.StackBalance = (this.StackBalance * 1) - (this.NKgs * 1);
        this.itemData.splice(index, 1);
      break;
    }

  }

  onSave() {
   if (this.SIDate !== undefined && this.SIDate !== null) {
     this.issueData.forEach(x => {
       if (x.SIDate === this.datepipe.transform(this.SIDate, 'MM/dd/yyyy')) {
         this.SIDate = this.SIDate;
       } else {
         this.SIDate = x.SIDate;
       }
     })
   }
    this.IRelates = this.year + '/' + ((this.month.value !== undefined) ? this.month.value : this.curMonth) ;
    const params = {
      'SINo': (this.SINo !== undefined && this.SINo !== null) ? this.SINo : 0,
      'RowId': 0,
      'SIDate': this.SIDate,
      'IRelates': this.IRelates,
      'DNo': (this.DeliveryOrderNo !== null) ? this.DeliveryOrderNo : this.DNo,
      'DDate': (this.DeliveryOrderDate !== null) ? this.datepipe.transform(this.DeliveryOrderDate, 'MM/dd/yyyy') :
        this.datepipe.transform(this.DDate, 'MM/dd/yyyy'),
      'WCCode': this.WNo,
      'IssuingCode': this.IssuingCode,
      'RCode': this.RCode,
      'IssueRegularAdvance': this.RegularAdvance,
      'Trcode': (this.Trcode.value !== undefined) ? this.Trcode.value : this.trCode,
      'Receivorcode': (this.RNCode.value !== undefined) ? this.RNCode.value : this.rnCode,
      'Issuetype': (this.RTCode.value !== undefined) ? this.RTCode.value : this.rtCode,
      'TransporterName': this.TransporterName,
      'TransportingCharge': this.TransporterCharges,
      'ManualDocNo': (this.ManualDocNo === undefined || this.ManualDocNo === null) ? "" : this.ManualDocNo,
      'LorryNo': (this.VehicleNo !== undefined) ? this.VehicleNo : '',
      'NewBale': (this.NewBale !== undefined) ? this.NewBale : '',
      'SoundServiceable': this.SServiceable,
      'ServiceablePatches': this.SPatches,
      'GunnyUtilised': this.Gunnyutilised,
      'GunnyReleased': this.GunnyReleased,
      'IssueItemList': this.itemData,
      'SIDetailsList': this.issueData,
      'Remarks': (this.Remarks !== undefined) ? this.Remarks : '',
      'GodownName': this.issuingGodownName,
      'RegionName': this.regionName,
      'TransactionType': this.Trcode.label,
      'ReceiverName': this.RNCode.label,
      'UserID': this.UserID.user,
      'Loadingslip': (this.SINo === undefined || this.SINo === null) ? 'N' : this.Loadingslip,
      'IssueMemo ': 'F'
    }
    this.restAPIService.post(PathConstants.STOCK_ISSUE_MEMO_DOCUMENTS, params).subscribe(res => {
      if (res !== undefined) {
        if (res) {
          this.isSaveSucceed = true;
          this.messageService.add({ key: 't-err', severity: 'success', summary: 'Success Message', detail: 'Saved Successfully!' });
          this.onClear();
        } else {
          this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message', detail: 'Something went wrong!' });
        }
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0) {
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message', detail: 'Please try again!' });
      }
    });
  }

  onView() {
    this.viewPane = true;
    const params = new HttpParams().set('value', this.datepipe.transform(this.viewDate, 'MM/dd/yyyy')).append('GCode', this.IssuingCode).append('Type', '1');
    this.restAPIService.getByParameters(PathConstants.STOCK_ISSUE_VIEW_DOCUMENTS, params).subscribe((res: any) => {
      if (res !== null && res !== undefined && res.length !== 0) {
        res.forEach(data => {
          data.SIDate = this.datepipe.transform(data.SIDate, 'dd-MM-yyyy');
          data.DDate = this.datepipe.transform(data.DDate, 'dd-MM-yyyy');
        })
        this.issueMemoDocData = res;
      } else {
        this.messageService.add({ key: 't-err', severity: 'warn', summary: 'Warn Message', detail: 'No record found!' });
      }
    });
  }

  onRowSelect(event) {
    this.SINo = event.data.SINo;
  }

  getDocBySINo() {
    this.viewPane = false;
    const params = new HttpParams().set('value', this.SINo).append('Type', '2');
    this.restAPIService.getByParameters(PathConstants.STOCK_ISSUE_VIEW_DOCUMENTS, params).subscribe((res: any) => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.RowId = res[0].RowId;
        this.TransporterName = res[0].TransporterName;
        this.TransporterCharges = res[0].TransportingCharge;
        this.NewBale = res[0].NewBale;
        this.SServiceable = res[0].SoundServiceable;
        this.SPatches = res[0].ServiceablePatches;
        this.GunnyReleased = res[0].GunnyReleased;
        this.Gunnyutilised = res[0].GunnyUtilised;
        this.WNo = res[0].WCCode;
        this.monthOptions = [{ label: new Date(res[0].IRelates.slice(5, 7)).toDateString().slice(4, 7), value: res[0].IRelates.slice(5, 7) }]
        this.month = res[0].IRelates.slice(0, 1);
        this.yearOptions = [{ label: res[0].IRelates.slice(0, 4), value: res[0].IRelates.slice(0, 4) }]
        this.year = res[0].IRelates.slice(3, 6);
        this.transactionOptions = [{ label: res[0].TRName, value: res[0].Trcode }];
        this.Trcode = res[0].TRName;
        this.trCode = res[0].Trcode;
        this.receiverTypeOptions = [{ label: res[0].ReceivorType, value: res[0].issuetype1 }];
        this.RTCode = res[0].ReceivorType;
        this.rtCode = res[0].issuetype1;
        this.receiverNameOptions = [{ label: res[0].DepositorName, value: res[0].Receivorcode }];
        this.RNCode = res[0].ReceivorName;
        this.rnCode = res[0].Receivorcode;
        this.IRelates = res[0].IRelates;
        this.VehicleNo = res[0].LorryNo;
        this.RegularAdvance = res[0].Flag2;
        this.ManualDocNo = res[0].Flag1;
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
            CommodityName: i.ITName,
            SchemeName: i.SchemeName,
            PackingName: i.PName,
            WmtType: i.WEType
          })
          this.issueData.push({
            SINo: i.SINo,
            IssueMemoDate: new Date(i.SIDate),
            SIDate: new Date(i.SIDate),
            DDate: new Date(i.DDate),
            DNo: i.DNo,
            DeliveryOrderDate: new Date(i.DDate)
          })
        })
      } else {
        this.messageService.add({ key: 't-err', severity: 'warn', summary: 'Warn Message', detail: 'No record found!' });
      }
    });
  }

  onClear() {
    this.itemData = this.issueData = [];
    this.trCode = this.Trcode = this.rtCode = this.RTCode = this.rnCode = this.RNCode = this.wtCode
      = this.WTCode = this.WNo = this.RegularAdvance = this.month = this.year = this.VehicleNo =
      this.TransporterCharges = this.TransporterName = this.ManualDocNo = this.Remarks = this.NewBale =
      this.GunnyReleased = this.Gunnyutilised = this.SServiceable = this.SPatches = null;
    this.CurrentDocQtv = this.StackBalance = this.NetStackBalance = 0;
  }


  openNext() {
    this.index = (this.index === 2) ? 0 : this.index + 1;
  }

  openPrev() {
    this.index = (this.index === 0) ? 2 : this.index - 1;
  }

  onPrint() {
    const path = "../../assets/Reports/" + this.UserID.user + "/";
    const filename = this.IssuingCode + GolbalVariable.StockIssueDocument + ".txt";
    saveAs(path + filename, filename);
    this.isSaveSucceed = false;
  }
}
