import { Component, OnInit, ViewChild } from '@angular/core';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { SelectItem, MessageService, ConfirmationService } from 'primeng/api';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { Dropdown, Dialog } from 'primeng/primeng';
import { StatusMessage } from 'src/app/constants/Messages';
import { NgForm } from '@angular/forms';
import { Toast } from 'primeng/toast';

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
  maxDate: Date;
  scheme_data: any;
  stackYear: any;
  issueMemoDocData: any = [];
  issueMemoDocCols: any;
  viewDate: Date;
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
  isValidStackBalance: boolean = false;
  isReceivorNameDisabled: boolean;
  isReceivorTypeDisabled: boolean;
  isSaveSucceed: boolean = false;
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
  allotmentGroup: string;
  allotmentScheme: string;
  transType: string = 'I';
  TKgs: any;
  month: string;
  year: any;
  curMonth: any;
  SINo: any;
  SIDate: Date;
  IssuingCode: any;
  RCode: any;
  StackBalance: any = 0;
  RegularAdvance: string;
  RowId: any;
  DDate: Date;
  SI_Date: Date;
  DNo: any;
  canShowMenu: boolean;
  ///Issue details
  Trcode: any;
  IRelates: any;
  DeliveryOrderDate: Date;
  DeliveryOrderNo: any;
  RTCode: any;
  RNCode: any;
  IssCode: any;
  WNo: any = '-';
  TransporterCharges: any = 0;
  VehicleNo: any;
  TransporterName: string = '-';
  ManualDocNo: any = '-';
  Remarks: string;
  //Issue item
  Scheme: any;
  ICode: any;
  TStockNo: any;
  StackDate: Date;
  IPCode: any;
  NoPacking: any;
  PWeight: any;
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
  isViewed: boolean = false;
  blockScreen: boolean;
  checkTrType: boolean = true;
  stackCompartment: any;
  DOCNumber: any;
  selectedIndex: any;
  submitted: boolean;
  missingFields: any;
  field: any;
  selected: any;
  disableYear: boolean;
  ACSCode: string;
  allotmentDetails: any[] = [];
  QuantityLimit: any;
  exceedAllotBal: boolean;
  AllotmentQty: any;
  BalanceQty: any;
  IssueQty: any;
  AllotmentStatus: any;
  itemGRName: string;
  categoryTypeCodeList: any = [];
  SocietyCode: any;
  SocietyName: any;
  disableSave: boolean;
  showPreview: boolean;
  PreSIDate: any;
  PreWNo: any;
  PreRegAdv: any;
  PreTransaction: any;
  PreRecType: any;
  PreRecName: any;
  PreMonth: any;
  PreYear: any;
  PreVehicleNo: any;
  PreTransporterCharges: any;
  PreManualDocNo: any;
  PreRemarks: any;
  PreTransporterName: any;
  @ViewChild('tr', { static: false }) transactionPanel: Dropdown;
  @ViewChild('y', { static: false }) yearPanel: Dropdown;
  @ViewChild('rt', { static: false }) receivorTypePanel: Dropdown;
  @ViewChild('rn', { static: false }) receivorNamePanel: Dropdown;
  @ViewChild('sc', { static: false }) schemePanel: Dropdown;
  @ViewChild('i_desc', { static: false }) commodityPanel: Dropdown;
  @ViewChild('st_no', { static: false }) stackNoPanel: Dropdown;
  @ViewChild('pt', { static: false }) packingPanel: Dropdown;
  @ViewChild('wmt', { static: false }) weightmentPanel: Dropdown;

  constructor(private roleBasedService: RoleBasedService, private restAPIService: RestAPIService, private messageService: MessageService,
    private authService: AuthService, private tableConstants: TableConstants, private datepipe: DatePipe) {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;

  }

  ngOnInit() {
    this.scheme_data = this.roleBasedService.getSchemeData();
    this.issueCols = this.tableConstants.StockIssueMemoIssueDetailsColumns;
    this.itemCols = this.tableConstants.StockIssueMemoItemDetailsColumns;
    this.issueMemoDocCols = this.tableConstants.StockIssueMemoViewBySINOCols;
    this.UserID = JSON.parse(this.authService.getCredentials());
    const maxDate = new Date(JSON.parse(this.authService.getServerDate()));
    this.maxDate = (maxDate !== null && maxDate !== undefined) ? maxDate : new Date();
    this.viewDate = this.maxDate;
    this.SIDate = this.maxDate;
    this.DDate = this.maxDate;
    this.DeliveryOrderDate = this.maxDate;
    this.curMonth = "0" + (new Date().getMonth() + 1);
    this.month = this.datepipe.transform(new Date(), 'MMM');
    this.year = new Date().getFullYear();
    this.yearOptions = [{ label: this.year, value: this.year }];
    this.regionName = this.authService.getUserAccessible().rName;
    this.issuingGodownName = this.authService.getUserAccessible().gName;
    this.IssuingCode = this.authService.getUserAccessible().gCode;
    this.RCode = this.authService.getUserAccessible().rCode;
    this.checkAllotmentStatus('Allotment');
    this.restAPIService.get(PathConstants.CATEGORY_TYPECODE_DISTINCT_GET).subscribe(res => {
      if (res.length !== 0 && res !== null && res !== undefined) {
        this.categoryTypeCodeList = res;
      }
    });
  }

  onSelect(selectedItem, type) {
    let transactoinSelection = [];
    let schemeSelection = [];
    let yearArr = [];
    let receivorTypeList = [];
    let itemDesc = [];
    let receivorNameList = [];
    let stackNo = [];
    let packingTypes = [];
    let weighment = [];
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
      case 'tr':
        if (type === 'tab') {
          this.transactionPanel.overlayVisible = true;
        }
        // if(this.transactionOptions === undefined) {
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
          } else {
            this.transactionOptions = transactoinSelection;
          }
        });
        // }
        break;
      case 'sc':
        if (type === 'tab') {
          this.schemePanel.overlayVisible = true;
        }
        if (this.scheme_data !== undefined && this.scheme_data !== null) {
          this.scheme_data.forEach(y => {
            schemeSelection.push({ 'label': y.SName, 'value': y.SCode, 'ascheme': y.AScheme });
          });
          this.schemeOptions = schemeSelection;
          this.schemeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        } else {
          this.schemeOptions = schemeSelection;
        }
        break;
      case 'rt':
        if (type === 'tab') {
          this.receivorTypePanel.overlayVisible = true;
        }
        if (this.Trcode !== null && this.Trcode !== undefined) {
          if ((this.Trcode.value !== undefined && this.Trcode.value !== null) ||
            (this.trCode !== null && this.trCode !== undefined)) {
            const params = new HttpParams().set('TRCode', (this.Trcode.value !== undefined) ? this.Trcode.value : this.trCode).append('GCode', this.IssuingCode);
            this.restAPIService.getByParameters(PathConstants.DEPOSITOR_TYPE_MASTER, params).subscribe((res: any) => {
              if (res !== null && res !== undefined && res.length !== 0) {
                res.forEach(rt => {
                  receivorTypeList.push({ 'label': rt.Tyname, 'value': rt.Tycode });
                });
                this.receiverTypeOptions = receivorTypeList;
                this.receiverTypeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
              }
            });
          }
        } else {
          this.receiverTypeOptions = receivorTypeList;
        }
        break;
      case 'rn':
        if (type === 'tab') {
          this.receivorNamePanel.overlayVisible = true;
        }
        if (this.Trcode !== null && this.RTCode !== null && this.Trcode !== undefined && this.RTCode !== undefined) {
          if ((this.Trcode.value !== undefined && this.Trcode.value !== null &&
            this.RTCode.value !== undefined && this.RTCode.value !== null) || (this.rtCode !== null && this.rtCode !== undefined
              && this.trCode !== null && this.trCode !== undefined)) {
            const params = new HttpParams().set('TyCode', (this.RTCode.value !== undefined) ? this.RTCode.value : this.rtCode).append('TRType', this.transType).append('GCode', this.IssuingCode)
              .append('TRCode', (this.Trcode.value !== undefined) ? this.Trcode.value : this.trCode);
            this.restAPIService.getByParameters(PathConstants.DEPOSITOR_NAME_MASTER, params).subscribe((res: any) => {
              if (res !== null && res !== undefined && res.length !== 0) {
                res.forEach(rn => {
                  receivorNameList.push({
                    'label': rn.DepositorName, 'value': rn.DepositorCode,
                    'SocietyName': rn.Societyname, 'ACSCode': rn.ACSCode, 'SocietyCode': rn.Societycode
                  });
                });
                this.receiverNameOptions = receivorNameList;
                this.receiverNameOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
              }
            });
            if (this.RNCode !== undefined && this.RNCode !== null) {
              if (this.RNCode.value !== undefined && this.RNCode.value !== null) {
                const acs_code = (this.RNCode.ACSCode !== null && this.RNCode.ACSCode !== undefined) ? this.RNCode.ACSCode.trim() : '';
                this.IssCode = this.RNCode.value.trim() + '-' + acs_code;
                this.SocietyName = (this.RNCode.SocietyCode !== null && this.RNCode.SocietyCode !== undefined) ? this.RNCode.SocietyName.trim() : '';
                // if(this.categoryTypeCodeList.length !== 0) {
                //   this.categoryTypeCodeList.forEach(i => {
                //      if(i === this.RNCode)
                //   })
                // }
              }
            }
          }
        } else {
          this.receiverNameOptions = receivorNameList;
        }
        break;
      case 'i_desc':
        if (type === 'tab') {
          this.commodityPanel.overlayVisible = true;
        }
        if (this.Scheme !== null && this.Scheme !== undefined) {
          if ((this.Scheme.value !== undefined && this.Scheme.value !== null) || (this.schemeCode !== undefined && this.schemeCode !== null)) {
            const params = new HttpParams().set('SCode', (this.Scheme.value !== undefined) ? this.Scheme.value : this.schemeCode);
            this.restAPIService.getByParameters(PathConstants.COMMODITY_FOR_SCHEME, params).subscribe((res: any) => {
              if (res !== null && res !== undefined && res.length !== 0) {
                res.forEach(i => {
                  itemDesc.push({ 'label': i.ITDescription, 'value': i.ITCode, 'GRName': i.GRName, 'group': i.Allotmentgroup });
                });
                this.itemDescOptions = itemDesc;
                this.itemDescOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
              }
            });
          }
        } else {
          this.itemDescOptions = itemDesc;
        }
        break;
      case 'st_no':
        if (type === 'tab') {
          this.stackNoPanel.overlayVisible = true;
        }
        if (this.RCode !== undefined && this.ICode !== undefined && this.ICode !== null) {
          if ((this.ICode.value !== undefined && this.ICode.value !== null) || (this.iCode !== undefined && this.iCode !== null)) {
            const params = new HttpParams().set('GCode', this.IssuingCode)
              .append('ITCode', (this.ICode.value !== undefined && this.ICode.value !== null) ? this.ICode.value : this.iCode)
              .append('TRCode', (this.Trcode.value !== undefined && this.Trcode.value !== null) ? this.Trcode.value : this.trCode)
              .append('SchemeCode', (this.Scheme.value !== undefined && this.Scheme.value !== null) ? this.Scheme.value : this.schemeCode);
            this.restAPIService.getByParameters(PathConstants.STACK_DETAILS, params).subscribe((res: any) => {
              if (res !== null && res !== undefined && res.length !== 0) {
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
        if (type === 'tab') {
          this.packingPanel.overlayVisible = true;
        }
        // if (this.packingTypeOptions === undefined) {
        this.restAPIService.get(PathConstants.PACKING_AND_WEIGHMENT).subscribe((res: any) => {
          if (res !== null && res !== undefined && res.length !== 0) {
            res.Table.forEach(p => {
              packingTypes.push({ 'label': p.PName, 'value': p.Pcode, 'weight': p.PWeight });
            })
            this.packingTypeOptions = packingTypes;
            this.packingTypeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
          } else {
            this.packingTypeOptions = packingTypes;
          }
        });
        //  }
        break;
      case 'wmt':
        if (type === 'tab') {
          this.weightmentPanel.overlayVisible = true;
        }
        // if (this.wmtOptions === undefined) {
        this.restAPIService.get(PathConstants.PACKING_AND_WEIGHMENT).subscribe((res: any) => {
          if (res !== null && res !== undefined && res.length !== 0) {
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

  onChangeIssuer() {
    if (this.RNCode !== null && this.RNCode !== undefined && this.RNCode.value !== null
      && this.RNCode.value !== undefined) {
      const Tycode = (this.RTCode.value !== null && this.RTCode.value !== undefined) ?
        this.RTCode.value : this.rtCode;
      const SocietyCode = (this.RNCode.SocietyCode !== null && this.RNCode.SocietyCode !== undefined) ?
        this.RNCode.SocietyCode : this.SocietyCode;
      const ACSCode = (this.RNCode.ACSCode !== null && this.RNCode.ACSCode !== undefined) ?
        this.RNCode.ACSCode : this.ACSCode;
      this.checkFieldsOfIssuer(SocietyCode, Tycode, ACSCode);
    }
  }

  refreshSelect(id) {
    switch (id) {
      case 'tr':
        this.receiverNameOptions = []; this.receiverTypeOptions = [];
        this.rtCode = null; this.RTCode = null;
        this.rnCode = null; this.RNCode = null;
        this.IssCode = null; this.SocietyName = null;
        this.SocietyCode = null;
        break;
      case 'sc':
        this.itemDescOptions = []; this.stackOptions = [];
        this.iCode = null; this.ICode = null;
        this.TStockNo = null; this.QuantityLimit = null;
        this.allotmentScheme = null;
        break;
      case 'i_desc':
        this.stackOptions = [];
        this.TStockNo = null;
        this.QuantityLimit = null;
        this.allotmentGroup = null;
        this.checkAllotmentBalance('1');
        break;
      case 'rt':
        this.receiverNameOptions = [];
        this.rnCode = null; this.RNCode = null;
        this.IssCode = null; this.SocietyName = null;
        this.SocietyCode = null;
        break;
      case 'pt':
        this.onCalculateKgs();
        break;
    }
  }

  showIssuerCode() {
    if (this.RNCode !== undefined && this.RNCode !== null &&
      this.RNCode.value !== undefined && this.RNCode.value !== null) {
      const acs_code = (this.RNCode.ACSCode !== null) ? this.RNCode.ACSCode.trim() : '';
      this.IssCode = this.RNCode.value.trim() + '-' + acs_code;
      this.SocietyName = (this.RNCode.SocietyCode !== null) ? this.RNCode.SocietyName.trim() : '';
    }
  }

  checkFieldsOfIssuer(SocietyCode, Tycode, ACSCode) {
    if (Tycode === 'TY002' || Tycode === 'TY003' || Tycode === 'TY004') {
      if ((SocietyCode === null || SocietyCode === undefined || SocietyCode === '')
        && (ACSCode === null || ACSCode === undefined || ACSCode === '')) {
        this.disableSave = true;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR,
          life: 5000, detail: StatusMessage.NoSocietyAndACSCodeForIssue + this.RNCode.label
        });
      } else if (SocietyCode === null || SocietyCode === undefined || SocietyCode === '') {
        this.disableSave = true;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR,
          life: 5000, detail: StatusMessage.NoSocietyCodeForIssue + this.RNCode.label
        });
      } else if (ACSCode === null || ACSCode === undefined || ACSCode === '') {
        this.disableSave = true;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR,
          life: 5000, detail: StatusMessage.NoACSCodeForIssue + this.RNCode.label
        });
      } else {
        this.disableSave = false;
        this.messageService.clear();
      }
    } else {
      this.disableSave = false;
    }
  }


  parseMoisture(event) {
    let totalLength = event.target.value.length;
    let value = (this.Moisture !== undefined && this.Moisture !== null) ? this.Moisture : '';
    let findDot = value.indexOf('.');
    if ((event.keyCode >= 32 && event.keyCode <= 47) || (event.keyCode >= 58 && event.keyCode <= 64)
      || (event.keyCode >= 91 && event.keyCode <= 95) || (event.keyCode >= 123 && event.keyCode <= 127)
      || (findDot > 1)) {
      return false;
    } else if (totalLength === 1 && event.keyCode === 190) {
      return true;
    }
    else if (totalLength >= 2 && event.keyCode !== 8) {
      if (findDot < 0) {
        let checkValue: any = value.slice(0, 2);
        checkValue = (checkValue * 1);
        if (checkValue > 25) {
          let startValue = value.slice(0, 1);
          let endValue = value.slice(1, totalLength);
          this.Moisture = startValue + '.' + endValue;
        } else {
          let startValue = value.slice(0, 2);
          let endValue = value.slice(2, totalLength);
          endValue = (endValue !== undefined && endValue !== '') ? endValue : '';
          this.Moisture = (endValue.trim() !== '') ? (startValue + '.' + endValue) : startValue;
        }
      }
    } else {
      return true;
    }
  }

  onCalculateKgs() {
    this.messageService.clear();
    if (this.NoPacking !== undefined && this.NoPacking !== null
      && this.IPCode !== undefined && this.IPCode !== null) {
      this.NoPacking = (this.NoPacking * 1);
      let wt = (this.IPCode.weight !== undefined && this.IPCode.weight !== null) ? this.IPCode.weight : this.PWeight;
      this.GKgs = ((this.NoPacking * 1) * (wt * 1)).toFixed(3);
      this.NKgs = ((this.NoPacking * 1) * (wt * 1)).toFixed(3);
      this.TKgs = ((this.GKgs * 1) - (this.NKgs * 1)).toFixed(3);
    } else {
      this.GKgs = null; this.NKgs = null; this.TKgs = null;
    }
  }

  onCalculateWt(value, id) {
    let kgs = (value * 1);
    if (kgs !== null && kgs !== undefined) {
      if (id === 'gross') { this.NKgs = kgs; }
    }
    if (this.GKgs !== undefined && this.GKgs !== null && this.NKgs !== undefined && this.NKgs !== null) {
      let grossWt = (this.GKgs * 1);
      let netWt = (this.NKgs * 1);
      if (grossWt < netWt) {
        this.NKgs = null; this.GKgs = null; this.TKgs = null;
      } else if (grossWt >= netWt) {
        this.TKgs = (grossWt - netWt).toFixed(3);
      } else {
        this.TKgs = (grossWt - netWt).toFixed(3);
      }
    }
  }

  onStackNoChange(event) {
    this.messageService.clear();
    this.stackCompartment = null;
    const hasValue = (event.value !== undefined && event.value !== null) ? event.value : event;
    if (hasValue !== undefined && hasValue !== null) {
      const trcode = (this.Trcode.value !== null && this.Trcode.value !== undefined) ?
        this.Trcode.value : this.trCode;
      const itemGroup: string = (this.ICode.GRName !== undefined && this.ICode.GRName !== null) ?
        this.ICode.GRName : this.itemGRName;
      const schCode: string = (this.Scheme.value !== null && this.Scheme.value !== undefined) ?
        this.Scheme.value : this.schemeCode;
      this.checkTrType = (trcode === 'TR024' || (schCode === 'SC025' && itemGroup === 'M024')) ? false : true;
      this.stackYear = (this.stackYear !== undefined && this.stackYear !== null &&
        hasValue.stack_yr !== null && hasValue.stack_yr !== undefined) ? this.stackYear : this.TStockNo.stack_yr;
      let index;
      let TStockNo = (this.TStockNo.value !== undefined && this.TStockNo.value !== null) ?
        this.TStockNo.value : this.TStockNo;
      if (TStockNo !== undefined && TStockNo !== null) {
        index = TStockNo.toString().indexOf('/', 2);
        const totalLength = TStockNo.length;
        this.godownNo = TStockNo.toString().slice(0, index);
        this.locationNo = TStockNo.toString().slice(index + 1, totalLength);
      } else {
        this.godownNo = null; this.stackYear = null;
        this.locationNo = null; this.stackCompartment = null;
      }
    } else {
      this.godownNo = null; this.stackYear = null;
      this.locationNo = null; this.stackCompartment = null;
    }
    let stack_data = (event.value !== undefined) ? event.value : event;
    let ind;
    let stockNo: string = (stack_data.value !== undefined && stack_data.value !== null) ? stack_data.value
      : (stack_data.stack_no !== undefined && stack_data.stack_no !== null) ? stack_data.stack_no : '';
    ind = stockNo.indexOf('/', 2);
    const totalLength = stockNo.length;
    this.godownNo = stockNo.slice(0, ind);
    this.locationNo = stockNo.slice(ind + 1, totalLength);
    const params = {
      DocNo: (this.SINo !== undefined && this.SINo !== null) ? this.SINo : 0,
      TStockNo: stockNo,
      StackYear: stack_data.stack_yr,
      StackDate: this.datepipe.transform(stack_data.stack_date, 'MM/dd/yyyy'),
      GCode: this.IssuingCode,
      ICode: (this.ICode.value !== undefined && this.ICode.value !== null) ? this.ICode.value : this.iCode,
      Type: 1
    };
    this.restAPIService.post(PathConstants.STACK_BALANCE, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.StackBalance = (res[0].StackBalance * 1).toFixed(3);
        // this.StackBalance = (this.StackBalance * 1);
        if ((this.StackBalance * 1) > 0 || !this.checkTrType) {
          this.isValidStackBalance = false;
          this.CurrentDocQtv = 0; this.NetStackBalance = 0;
          if (this.itemData.length !== 0) {
            this.itemData.forEach(x => {
              if (x.TStockNo.trim() === stockNo.trim()) {
                this.CurrentDocQtv += (x.Nkgs * 1);
                this.NetStackBalance = ((this.StackBalance * 1) - (this.CurrentDocQtv * 1)).toFixed(3);
                this.NetStackBalance = (this.NetStackBalance * 1);
              }
            });
          }
        } else {
          this.isValidStackBalance = true;
          this.clearItemDetails();
          this.CurrentDocQtv = 0;
          this.NetStackBalance = 0;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.NotSufficientStackBalance });
        }
      }
    });
  }

  clearItemDetails() {
    this.IPCode = null; this.WTCode = null;
    this.NoPacking = 0; this.GKgs = 0; this.NKgs = 0;
    this.TKgs = 0; this.Moisture = '';
  }

  checkRegAdv(value) {
    let issue_date = new Date(this.SIDate);
    const stockDate = issue_date.getDate();
    const stockMonth = issue_date.getMonth() + 1; //SIDate month
    const stockYear = issue_date.getFullYear(); //SIDate year
    if (value !== null && value !== undefined && value.toUpperCase() === 'R') {
      this.curMonth = (stockMonth <= 9) ? '0' + stockMonth : stockMonth;
      this.month = this.datepipe.transform(issue_date, 'MMM');
      this.year = stockYear;
      this.yearOptions = [{ label: this.year, value: this.year }];
      this.disableYear = true;
    } else if (value !== undefined && value.toUpperCase().trim() === 'A') {
      this.curMonth = (stockMonth !== 12) ? ((stockMonth <= 9) ? '0' + (stockMonth + 1) : (stockMonth + 1)) : '01';
      // let nextMonth = (stockMonth === 12) ? 0 : stockMonth + 1;
      let formDate = this.curMonth + "-" + '01' + "-" + stockYear;
      this.month = this.datepipe.transform(formDate, 'MMM');
      this.year = (stockMonth !== 12) ? stockYear : stockYear + 1;
      this.yearOptions = [{ label: this.year, value: this.year }];
      this.disableYear = true;
    }
    this.ICode = null;
    this.QuantityLimit = null;
    this.itemDescOptions = [];
    this.getAllotmentDetails();
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

  onIssueDetailsEnter() {
    this.DNo = this.DeliveryOrderNo;
    this.DDate = this.DeliveryOrderDate;
    this.SI_Date = this.SIDate;
    this.issueData.push({
      SINo: (this.SINo !== undefined && this.SINo !== null) ? this.SINo : '-',
      SIDate: this.datepipe.transform(this.SIDate, 'MM/dd/yyyy'),
      DNo: this.DeliveryOrderNo,
      DDate: this.datepipe.transform(this.DeliveryOrderDate, 'MM/dd/yyyy'),
      RCode: this.RCode, GodownCode: this.IssuingCode,
      DeliveryOrderDate: this.datepipe.transform(this.DeliveryOrderDate, 'dd/MM/yyyy'),
      IssueMemoDate: this.datepipe.transform(this.SIDate, 'dd/MM/yyyy'),
    });
    if (this.issueData.length !== 0) {
      this.DeliveryOrderDate = new Date(); this.DeliveryOrderNo = null;
      this.issueData = this.issueData.filter(x => {
        return x.SIDate === this.datepipe.transform(this.SIDate, 'MM/dd/yyyy')
      });
    }
  }

  onItemDetailsEnter() {
    this.messageService.clear();
    let totalBags = 0;
    let totalGkgs = 0;
    let totalNkgs = 0;
    let index = this.itemData.length;
    if (this.itemData.length !== 0 && this.itemData[index - 1].TStockNo === 'Total') {
      this.itemData.splice(index - 1, 1);
    }
    this.itemData.push({
      TStockNo: (this.TStockNo.value !== undefined && this.TStockNo.value !== null) ?
        this.TStockNo.value.trim() + ((this.stackCompartment !== undefined && this.stackCompartment !== null) ? this.stackCompartment.toUpperCase() : '')
        : this.TStockNo.trim() + ((this.stackCompartment !== undefined && this.stackCompartment !== null) ? this.stackCompartment.toUpperCase() : ''),
      ICode: (this.ICode.value !== undefined && this.ICode.value !== null) ? this.ICode.value : this.iCode,
      ItemGRName: (this.ICode.GRName !== undefined && this.ICode.GRName !== null) ? this.ICode.GRName : this.itemGRName,
      IPCode: (this.IPCode.value !== undefined && this.IPCode.value !== null) ? this.IPCode.value : this.ipCode,
      NoPacking: this.NoPacking,
      GKgs: this.GKgs,
      Nkgs: this.NKgs,
      WTCode: (this.WTCode.value !== undefined && this.WTCode.value !== null) ? this.WTCode.value : this.wtCode,
      Moisture: this.Moisture,
      Scheme: (this.Scheme.value !== undefined && this.Scheme.value !== null) ? this.Scheme.value : this.schemeCode,
      AllotmentScheme: (this.Scheme.ascheme !== undefined && this.Scheme.ascheme !== null) ? this.Scheme.ascheme : this.allotmentScheme,
      AllotmentGroup: (this.ICode.group !== undefined && this.ICode.group !== null) ? this.ICode.group : this.allotmentGroup,
      CommodityName: (this.ICode.label !== undefined) ? this.ICode.label : this.ICode,
      SchemeName: (this.Scheme.label !== undefined) ? this.Scheme.label : this.Scheme,
      PackingName: (this.IPCode.label !== undefined) ? this.IPCode.label : this.IPCode,
      WmtType: (this.WTCode.label !== undefined) ? this.WTCode.label : this.WTCode,
      PWeight: (this.IPCode.weight !== undefined) ? this.IPCode.weight : this.PWeight,
      StackDate: (this.TStockNo.stack_date !== undefined && this.TStockNo.stack_date !== null) ?
        new Date(this.TStockNo.stack_date) : this.StackDate,
      StackYear: (this.stackYear !== undefined && this.stackYear !== null) ? this.stackYear : '-'
    });
    if (this.itemData.length !== 0) {
      this.StackBalance = (this.StackBalance * 1).toFixed(3);
      this.CurrentDocQtv = 0;
      let sno = 1;
      let stock_no = (this.TStockNo.value !== undefined && this.TStockNo.value !== null) ? this.TStockNo.value : this.TStockNo;
      ///calculating current document quantity based on stock number
      this.itemData.forEach(x => {
        x.sno = sno;
        if (x.TStockNo.trim() === stock_no.trim()) {
          this.CurrentDocQtv += (x.Nkgs * 1);
        }
        sno += 1;
        totalBags += x.NoPacking;
        totalGkgs += (x.GKgs * 1);
        totalNkgs += (x.Nkgs * 1);
      });
      ///end
      this.CurrentDocQtv = (this.CurrentDocQtv * 1).toFixed(3);
      let lastIndex = this.itemData.length - 1;
      if (this.checkTrType) {
        if ((this.CurrentDocQtv * 1) > this.StackBalance) {
          this.messageService.clear();
          this.itemData.splice(lastIndex, 1);
          ///calculating current document quantity based on stock number after splicing data from table
          this.CurrentDocQtv = 0;
          this.itemData.forEach(x => {
            if (x.TStockNo.trim() === stock_no.trim()) {
              this.CurrentDocQtv += (x.Nkgs * 1);
            }
          });
          ///end
          this.NoPacking = null;
          this.GKgs = null; this.NKgs = null; this.TKgs = null;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR,
            life: 5000, detail: StatusMessage.ExceedingStackBalance
          });

          if (this.itemData.length !== 0) {
            sno = 1;
            totalNkgs = 0;
            totalBags = 0;
            totalGkgs = 0;
            this.itemData.forEach(x => {
              x.sno = sno;
              sno += 1;
              totalBags += x.NoPacking;
              totalGkgs += (x.GKgs * 1);
              totalNkgs += (x.Nkgs * 1);
            });
            var item = { TStockNo: 'Total', NoPacking: totalBags, GKgs: totalGkgs.toFixed(3), Nkgs: totalNkgs.toFixed(3) };
            index = this.itemData.length;
            this.itemData.splice(index, 0, item);
          }
        } else {
          this.checkAllotmentBalance('2');
          this.NetStackBalance = ((this.StackBalance * 1) - (this.CurrentDocQtv * 1)).toFixed(3);
          this.NetStackBalance = (this.NetStackBalance * 1);
          var item = { TStockNo: 'Total', NoPacking: totalBags, GKgs: totalGkgs.toFixed(3), Nkgs: totalNkgs.toFixed(3) };
          index = this.itemData.length;
          this.itemData.splice(index, 0, item);
          this.TStockNo = null; this.ICode = null; this.IPCode = null; this.NoPacking = null;
          this.GKgs = null; this.NKgs = null; this.godownNo = null; this.locationNo = null;
          this.TKgs = null; this.WTCode = null; this.Moisture = null;
          this.Scheme = null; this.selectedIndex = null; this.QuantityLimit = null;
          this.schemeOptions = []; this.itemDescOptions = []; this.stackOptions = [];
          this.packingTypeOptions = []; this.wmtOptions = []; this.stackCompartment = null;
        }
      } else {
        this.checkAllotmentBalance('2');
        sno = 1;
        totalNkgs = 0;
        totalBags = 0;
        totalGkgs = 0;
        this.itemData.forEach(x => {
          x.sno = sno;
          sno += 1;
          totalBags += x.NoPacking;
          totalGkgs += (x.GKgs * 1);
          totalNkgs += (x.Nkgs * 1);
        });
        var item = { TStockNo: 'Total', NoPacking: totalBags, GKgs: totalGkgs.toFixed(3), Nkgs: totalNkgs.toFixed(3) };
        index = this.itemData.length;
        this.itemData.splice(index, 0, item);
        this.TStockNo = null; this.ICode = null; this.IPCode = null; this.NoPacking = null;
        this.GKgs = null; this.NKgs = null; this.godownNo = null; this.locationNo = null;
        this.TKgs = null; this.WTCode = null; this.Moisture = null;
        this.Scheme = null; this.selectedIndex = null; this.QuantityLimit = null;
        this.schemeOptions = []; this.itemDescOptions = []; this.stackOptions = [];
        this.packingTypeOptions = []; this.wmtOptions = []; this.stackCompartment = null;
      }
    }
  }

  deleteRow(id, data, rowIndex) {
    this.selectedIndex = rowIndex;
    switch (id) {
      case 'issue':
        this.SIDate = new Date(data.SIDate);
        this.SINo = data.SINo;
        this.DeliveryOrderNo = data.DNo;
        this.DeliveryOrderDate = new Date(data.DDate);
        this.issueData.splice(rowIndex, 1);
        break;
      case 'item':
        if (data.TStockNo !== 'Total') {
          this.TStockNo = data.TStockNo;
          this.stackOptions = [{ label: data.TStockNo, value: data.TStockNo }];
          this.StackDate = data.StackDate;
          this.Scheme = data.SchemeName;
          this.schemeCode = data.Scheme;
          this.allotmentGroup = data.AllotmentGroup;
          this.allotmentScheme = data.AllotmentScheme;
          this.schemeOptions = [{ label: data.SchemeName, value: data.Scheme }];
          this.ICode = data.CommodityName; this.iCode = data.ICode;
          this.itemDescOptions = [{ label: data.CommodityName, value: data.ICode }];
          this.itemGRName = data.ItemGRName;
          this.IPCode = data.PackingName; this.ipCode = data.IPCode;
          this.PWeight = (data.PWeight * 1);
          this.packingTypeOptions = [{ label: data.PackingName, value: data.IPCode }];
          this.WTCode = data.WmtType; this.wtCode = data.WTCode;
          this.wmtOptions = [{ label: data.WmtType, value: data.WTCode }];
          this.NoPacking = (data.NoPacking * 1),
            this.GKgs = (data.GKgs * 1).toFixed(3);
          this.NKgs = (data.Nkgs * 1).toFixed(3);
          this.stackYear = data.StackYear;
          const trcode = (this.Trcode.value !== null && this.Trcode.value !== undefined) ?
            this.Trcode.value : this.trCode;
          this.checkTrType = (trcode === 'TR024' || (data.Scheme === 'SC025' && data.ItemGRName === 'M024')) ? false : true;
          this.Moisture = ((data.Moisture * 1) !== 0) ? (data.Moisture * 1).toFixed(2) : (data.Moisture * 1).toFixed(0);
          if (this.TStockNo !== undefined && this.TStockNo !== null) {
            let index;
            index = this.TStockNo.toString().indexOf('/', 2);
            const totalLength = this.TStockNo.length;
            this.godownNo = this.TStockNo.toString().slice(0, index);
            this.locationNo = this.TStockNo.toString().slice(index + 1, totalLength);
          }
          this.TKgs = (this.GKgs !== undefined && this.NKgs !== undefined) ? ((this.GKgs * 1) - (this.NKgs * 1)).toFixed(3) : 0;
          this.itemData.splice(rowIndex, 1);
          if (this.itemData.length === 1 && this.itemData[0].TStockNo === 'Total') {
            this.itemData.length = 0;
          } else {
            let sno = 1;
            let totalBags = 0;
            let totalGkgs = 0;
            let totalNkgs = 0;
            let lastIndex = this.itemData.length;
            this.itemData.splice(lastIndex - 1, 1);
            this.itemData.forEach(x => {
              x.sno = sno;
              sno += 1;
              totalBags += (x.NoPacking * 1);
              totalGkgs += (x.GKgs * 1);
              totalNkgs += (x.Nkgs * 1);
            });
            this.itemData.push({ TStockNo: 'Total', NoPacking: totalBags, GKgs: totalGkgs.toFixed(3), Nkgs: totalNkgs.toFixed(3) });
          }
          const list = { stack_no: this.TStockNo, stack_date: this.StackDate, stack_yr: this.stackYear }
          this.onStackNoChange(list);
          this.checkAllotmentBalance('1');
          break;
        }
    }
  }

  onSave(type) {
    this.messageService.clear();
    this.blockScreen = true;
    this.RowId = (this.RowId !== undefined && this.RowId !== null) ? this.RowId : 0;
    this.SINo = (this.SINo !== undefined && this.SINo !== null) ? this.SINo : 0;
    this.Loadingslip = (this.SINo !== 0) ? this.Loadingslip : 'N';
    this.IRelates = this.year + '/' + this.curMonth
    const params = {
      'Type': type,
      'SINo': this.SINo,
      'RowId': this.RowId,
      'SIDate': this.datepipe.transform(this.SIDate, 'MM/dd/yyyy'),
      'IRelates': this.IRelates,
      'DNo': (this.DeliveryOrderNo !== null) ? this.DeliveryOrderNo : this.DNo,
      'DDate': (this.DeliveryOrderDate !== null) ? this.datepipe.transform(this.DeliveryOrderDate, 'MM/dd/yyyy') :
        this.datepipe.transform(this.DDate, 'MM/dd/yyyy'),
      'WCCode': this.WNo,
      'IssuingCode': this.IssuingCode,
      'RCode': this.RCode,
      'IssueRegularAdvance': this.RegularAdvance.toUpperCase(),
      'Trcode': (this.Trcode.value !== undefined) ? this.Trcode.value : this.trCode,
      'Receivorcode': (this.RNCode.value !== undefined) ? this.RNCode.value : this.rnCode,
      'Issuetype': (this.RTCode.value !== undefined) ? this.RTCode.value : this.rtCode,
      'IssuerName': (this.RTCode.label !== undefined) ? this.RTCode.label : this.RTCode,
      'TransporterName': (this.TransporterName.length !== 0 && this.TransporterName !== '') ? this.TransporterName : '-',
      'TransportingCharge': this.TransporterCharges,
      'ManualDocNo': (this.ManualDocNo === undefined || this.ManualDocNo === null) ? "" : this.ManualDocNo,
      'LorryNo': (this.VehicleNo !== undefined && this.VehicleNo !== null) ? this.VehicleNo.toUpperCase() : '-',
      'NewBale': (this.NewBale !== undefined && this.NewBale !== null) ? this.NewBale : 0,
      'SoundServiceable': (this.SServiceable !== undefined && this.SServiceable !== null) ? this.SServiceable : 0,
      'ServiceablePatches': (this.SPatches !== undefined && this.SPatches !== null) ? this.SPatches : 0,
      'GunnyUtilised': (this.Gunnyutilised !== undefined && this.Gunnyutilised !== null) ? this.Gunnyutilised : 0,
      'GunnyReleased': (this.GunnyReleased !== undefined && this.GunnyReleased !== null) ? this.GunnyReleased : 0,
      'IssueItemList': this.itemData,
      'SIDetailsList': this.issueData,
      'Remarks': (this.Remarks !== null && this.Remarks.trim() !== '') ? this.Remarks.trim() : '-',
      'GodownName': this.issuingGodownName,
      'RegionName': this.regionName,
      'TransactionType': (this.Trcode.label !== undefined && this.Trcode.label !== null) ? this.Trcode.label : this.Trcode,
      'ReceiverName': (this.RNCode.label !== undefined && this.RNCode.label !== null) ? this.RNCode.label : this.RNCode,
      'IssuerCode': (this.IssCode !== undefined && this.IssCode !== null) ? this.IssCode : '-',
      'UserID': this.UserID.user,
      'Loadingslip': this.Loadingslip,
      'IssueMemo ': 'F'
    };
    this.restAPIService.post(PathConstants.STOCK_ISSUE_MEMO_DOCUMENTS, params).subscribe(res => {
      if (res.Item1 !== undefined && res.Item1 !== null && res.Item2 !== undefined && res.Item2 !== null) {
        if (res.Item1) {
          if (type !== '2') {
            this.isSaveSucceed = true;
            this.isViewed = false;
          } else {
            this.isSaveSucceed = false;
            this.loadDocument();
            this.isViewed = false;
          }
          this.DOCNumber = res.Item3;
          this.blockScreen = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS,
            life: 5000, detail: res.Item2
          });

          this.onClear();
        } else {
          this.isViewed = false;
          this.isSaveSucceed = false;
          this.blockScreen = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
            summary: StatusMessage.SUMMARY_ERROR, detail: res.Item2
          });
        }
      }
    }, (err: HttpErrorResponse) => {
      this.isSaveSucceed = false;
      this.isViewed = false;
      this.blockScreen = false;
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.NetworkErrorMessage
        });
      }
    });
  }

  onView() {
    this.viewPane = true;
    this.selected = null;
    this.messageService.clear();
    const params = new HttpParams().set('value', this.datepipe.transform(this.viewDate, 'MM/dd/yyyy')).append('GCode', this.IssuingCode).append('Type', '1');
    this.restAPIService.getByParameters(PathConstants.STOCK_ISSUE_VIEW_DOCUMENTS, params).subscribe((res: any) => {
      if (res.Table !== null && res.Table !== undefined && res.Table.length !== 0) {
        let sno = 1;
        res.Table.forEach(data => {
          data.sno = sno;
          data.SIDate = this.datepipe.transform(data.SIDate, 'dd-MM-yyyy');
          data.DDate = this.datepipe.transform(data.DDate, 'dd-MM-yyyy');
          sno += 1;
        });
        this.issueMemoDocData = res.Table;
      } else {
        this.issueMemoDocData = [];
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.issueMemoDocData = [];
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
  }

  checkAllotmentStatus(value) {
    this.restAPIService.getByParameters(PathConstants.SETTINGS_GET, { sValue: value }).subscribe(status => {
      this.AllotmentStatus = status[0].TNCSCValue;
    });
  }

  getAllotmentDetails() {
    if (!this.isViewed) {
      this.showIssuerCode();
    }
    if (this.AllotmentStatus === 'YES') {
      if (this.RegularAdvance !== null && this.RegularAdvance !== undefined && ((this.rnCode !== undefined &&
        this.rnCode !== null) || (typeof this.RNCode !== 'string'))
        && this.IssCode !== null && this.IssCode !== undefined) {
        const params = {
          'GCode': this.IssuingCode,
          'RCode': this.RCode,
          'RNCode': (this.RNCode.value !== undefined && this.RNCode.value === null) ? this.RNCode.value : this.rnCode,
          'IssRegAdv': this.RegularAdvance.toUpperCase(),
          'Month': ((this.curMonth * 1) < 9) ? ('0' + (this.curMonth * 1)) : this.curMonth,
          'Year': this.year,
          'ACSCode': (this.ACSCode !== undefined && this.ACSCode !== null) ? this.ACSCode : this.RNCode.ACSCode
        };
        this.allotmentDetails.length = 0;
        this.restAPIService.post(PathConstants.ALLOTMENT_BALANCE_POST, params).subscribe(res => {
          res.forEach(x => {
            this.allotmentDetails.push({
              AllotmentQty: x.AllotmentQty,
              IssueQty: x.IssueQty,
              AllotmentScheme: x.AllotmentSchemeCode,
              AllotmentGroup: x.AllotmentGroup,
              BalanceQty: x.BalanceQty
            });
          });
        });
      }
    } else {
      this.allotmentDetails.length = 0;
    }
    // }
  }

  checkAllotmentBalance(type) {
    if (this.ICode !== null && this.ICode !== undefined && this.RegularAdvance !== null
      && this.RegularAdvance !== undefined && this.RegularAdvance !== '') {
      if ((this.ICode.value !== null && this.ICode.value !== undefined) || (this.iCode !== null && this.iCode !== undefined)) {
        const allotmentGroup = (this.allotmentGroup !== null && this.allotmentGroup !== undefined) ?
          this.allotmentGroup : this.ICode.group;
        const allotmentScheme = (this.allotmentScheme !== null && this.allotmentScheme !== undefined) ?
          this.allotmentScheme : this.Scheme.ascheme;
        if (this.allotmentDetails !== undefined && this.allotmentDetails !== null
          && this.allotmentDetails.length !== 0 && (allotmentGroup !== undefined && allotmentGroup !== '' && allotmentGroup !== null) &&
          (allotmentScheme !== undefined && allotmentScheme !== '' && allotmentScheme !== null)) {
          const allot_Group = (this.ICode.group !== undefined && this.ICode.group !== null) ? this.ICode.group : this.allotmentGroup;
          const allot_schemeCode = (this.Scheme.ascheme !== undefined && this.Scheme.ascheme !== null) ? this.Scheme.ascheme : this.allotmentScheme;
          let percentAQty = 0;
          if (type === '1') {
            for (let a = 0; a < this.allotmentDetails.length; a++) {
              if (this.allotmentDetails[a].AllotmentGroup.trim() === allot_Group.trim() &&
                this.allotmentDetails[a].AllotmentScheme === allot_schemeCode) {
                this.AllotmentQty = (this.allotmentDetails[a].AllotmentQty * 1);
                percentAQty = (this.RegularAdvance.toUpperCase().trim() === 'A') ? (((this.AllotmentQty * 1) * 60) / 100) : (this.AllotmentQty * 1);
                this.IssueQty = (this.allotmentDetails[a].IssueQty * 1);
                this.BalanceQty = (this.allotmentDetails[a].BalanceQty * 1);
                this.QuantityLimit = ' ALLOT_QTY ' + ': ' + this.AllotmentQty.toFixed(3) +
                  ((this.RegularAdvance.toUpperCase().trim() === 'A') ? ('/' + percentAQty.toFixed(3)) : '')
                  + '  ' + ' ISS_QTY ' + ': ' + this.IssueQty.toFixed(3) + '  ' + ' BAL_QTY ' + ': ' + this.BalanceQty.toFixed(3);
                /// ---------------- Allotment balance check ------------------ ///
                if ((this.BalanceQty * 1) <= 0 && this.itemData.length === 0 && (this.RegularAdvance.toUpperCase().trim() === 'R')) {
                  this.exceedAllotBal = true;
                  this.messageService.clear();
                  this.messageService.add({
                    key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING,
                    life: 5000, detail: StatusMessage.AllotmentIssueQuantityValidation
                  });
                }
                ///Else Part
                else if ((percentAQty * 1) <= 0 && this.itemData.length === 0 && (this.RegularAdvance.toUpperCase().trim() === 'A')) {
                  this.exceedAllotBal = true;
                  this.messageService.clear();
                  this.messageService.add({
                    key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING,
                    life: 5000, detail: StatusMessage.AllotmentPercentQtyValidation
                  });
                } else {
                  this.exceedAllotBal = false;
                }
                break;
              } else {
                this.exceedAllotBal = true;
                this.QuantityLimit = StatusMessage.NoAllotmentBalance;
                continue;
                /// ------------------ END ----------------------- ///
              }
            }
          } else if (type === '2') {
            /// ---------------- Allotment balance check ------------------ ///
            if (this.BalanceQty !== null && this.BalanceQty !== undefined && this.exceedAllotBal) {
              percentAQty = (this.RegularAdvance.toUpperCase().trim() === 'A') ? (((this.AllotmentQty * 1) * 60) / 100) : (this.AllotmentQty * 1);
              if (this.RegularAdvance.toUpperCase().trim() === 'R') {
                let netWt = 0;
                if ((this.BalanceQty * 1) <= 0 && this.itemData.length === 0) {
                  this.exceedAllotBal = true;
                  this.messageService.clear();
                  this.messageService.add({
                    key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING,
                    life: 5000, detail: StatusMessage.AllotmentIssueQuantityValidation
                  });
                } else if (this.itemData.length !== 0) {
                  this.itemData.forEach(x => {
                    if (x.AllotmentGroup.toString().trim() === allot_Group.trim() && x.AllotmentScheme === allot_schemeCode) {
                      netWt += (x.Nkgs * 1);
                    }
                  });
                  if ((this.BalanceQty * 1) < netWt) {
                    this.exceedAllotBal = true;
                    this.messageService.clear();
                    this.messageService.add({
                      key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING,
                      life: 5000, detail: StatusMessage.ExceedingAllotmentQty
                    });
                  }
                }
              } else if (this.RegularAdvance.toUpperCase().trim() === 'A') {
                let netWt = 0;
                if ((percentAQty * 1) <= 0 && this.itemData.length === 0) {
                  this.exceedAllotBal = true;
                  this.messageService.clear();
                  this.messageService.add({
                    key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING,
                    life: 5000, detail: StatusMessage.AllotmentPercentQtyValidation
                  });
                } else if (this.itemData.length !== 0) {
                  this.itemData.forEach(x => {
                    if (x.AllotmentGroup.toString().trim() === allot_Group.trim() && x.AllotmentScheme === allot_schemeCode) {
                      netWt += (x.Nkgs * 1);
                    }
                  });
                  if ((percentAQty * 1) < netWt) {
                    this.exceedAllotBal = true;
                    this.messageService.clear();
                    this.messageService.add({
                      key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING,
                      life: 5000, detail: StatusMessage.ExceedingAllotmentQtyOfPercent
                    });
                  }
                }
              } else {
                this.messageService.clear();
              }
            }
            /// ------------------ END ----------------------- ///

          } else {
            /// ---------------- Allotment balance check ------------------ ///
            this.QuantityLimit = null;
            this.exceedAllotBal = false;
            /// ------------------ END ----------------------- ///
          }
        } else if (this.AllotmentStatus !== 'NO') {
          this.QuantityLimit = null;
        } else {
          this.QuantityLimit = StatusMessage.NoAllotmentBalance;
        }
      }
    } else {
      this.QuantityLimit = null;
      this.exceedAllotBal = false;
    }
  }

  onRowSelect(event) {
    this.selected = event;
    this.SINo = event.data.SINo;
  }

  getDocBySINo() {
    this.messageService.clear();
    this.viewPane = false;
    this.isSaveSucceed = false;
    this.isViewed = true;
    this.itemData = []; this.issueData = [];
    const params = new HttpParams().set('value', this.SINo).append('Type', '2');
    this.restAPIService.getByParameters(PathConstants.STOCK_ISSUE_VIEW_DOCUMENTS, params).subscribe((res: any) => {
      if (res.Table !== undefined && res.Table.length !== 0 && res.Table !== null) {
        this.onClear();
        this.RowId = res.Table[0].RowId;
        this.SINo = res.Table[0].SINo;
        this.SIDate = new Date(res.Table[0].SIDate);
        this.TransporterName = (res.Table[0].TransporterName !== undefined && res.Table[0].TransporterName !== null) ? res.Table[0].TransporterName : '-';
        this.TransporterCharges = res.Table[0].TransportingCharge;
        this.NewBale = (res.Table[0].NewBale !== null && res.Table[0].NewBale !== undefined) ? res.Table[0].NewBale : 0;
        this.SServiceable = (res.Table[0].SoundServiceable !== null && res.Table[0].SoundServiceable !== undefined) ?
          res.Table[0].SoundServiceable : 0;
        this.SPatches = (res.Table[0].ServiceablePatches !== null && res.Table[0].ServiceablePatches !== undefined)
          ? res.Table[0].ServiceablePatches : 0;
        this.GunnyReleased = (res.Table[0].GunnyReleased !== null && res.Table[0].GunnyReleased !== undefined) ?
          res.Table[0].GunnyReleased : 0;
        this.Gunnyutilised = (res.Table[0].GunnyUtilised !== null && res.Table[0].GunnyUtilised !== undefined) ?
          res.Table[0].GunnyUtilised : 0;
        this.WNo = res.Table[0].WCCode;
        let currentYr = new Date().getFullYear();
        let today = new Date().getDate();
        this.curMonth = res.Table[0].IRelates.slice(5, 7);
        let formDate = this.curMonth + "-" + today + "-" + currentYr;
        this.month = this.datepipe.transform(new Date(formDate), 'MMM');
        this.yearOptions = [{ label: res.Table[0].IRelates.slice(0, 4), value: res.Table[0].IRelates.slice(0, 4) }]
        this.year = res.Table[0].IRelates.slice(0, 4);
        this.RegularAdvance = res.Table[0].Flag2;
        this.checkRegAdv(this.RegularAdvance);
        this.transactionOptions = [{ label: res.Table[0].TRName, value: res.Table[0].Trcode }];
        this.Trcode = res.Table[0].TRName;
        this.trCode = res.Table[0].Trcode;
        this.checkTrType = (res.Table[0].Trcode === 'TR024') ? false : true;
        this.receiverTypeOptions = [{ label: res.Table[0].ReceivorType, value: res.Table[0].issuetype1 }];
        this.RTCode = res.Table[0].ReceivorType;
        this.rtCode = res.Table[0].issuetype1;
        this.receiverNameOptions = [{ label: res.Table[0].ReceivorName, value: res.Table[0].Receivorcode }];
        this.RNCode = res.Table[0].ReceivorName;
        this.rnCode = res.Table[0].Receivorcode;
        this.ACSCode = (res.Table[0].ACSCode !== null) ? res.Table[0].ACSCode.trim() : '';
        this.SocietyCode = (res.Table[0].Societycode !== null && res.Table[0].Societycode !== undefined) ?
          res.Table[0].Societycode : '';
        this.SocietyName = (res.Table[0].Societyname !== null && res.Table[0].Societyname !== undefined) ?
          res.Table[0].Societyname : '';
        this.IssCode = this.rnCode + '-' + this.ACSCode;
        this.checkFieldsOfIssuer(res.Table[0].Societycode.trim(), res.Table[0].issuetype1, res.Table[0].ACSCode.trim());
        this.IRelates = res.Table[0].IRelates;
        this.VehicleNo = res.Table[0].LorryNo.toUpperCase();
        this.ManualDocNo = res.Table[0].Flag1;
        this.Loadingslip = res.Table[0].Loadingslip;
        this.Remarks = res.Table[0].Remarks.trim();
        let sno = 1;
        let totalBags = 0;
        let totalGkgs = 0;
        let totalNkgs = 0;
        res.Table.forEach(i => {
          this.itemData.push({
            sno: sno,
            TStockNo: i.TStockNo,
            ICode: i.ICode,
            IPCode: i.IPCode,
            NoPacking: i.NoPacking,
            GKgs: i.GKgs,
            Nkgs: i.Nkgs,
            WTCode: i.WTCode,
            Moisture: i.Moisture,
            Scheme: i.Scheme,
            ItemGRName: i.GRName,
            CommodityName: i.ITName,
            SchemeName: i.SchemeName,
            AllotmentGroup: i.Allotmentgroup,
            AllotmentScheme: i.AllotmentScheme,
            PackingName: i.PName,
            WmtType: i.WEType,
            PWeight: i.PWeight,
            StackDate: i.StackDate,
            StackYear: i.StackYear,
            RCode: i.RCode
          })
          sno += 1;
          totalBags += i.NoPacking;
          totalGkgs += (i.GKgs * 1);
          totalNkgs += (i.Nkgs * 1);
        })
        res.Table1.forEach(j => {
          this.issueData.push({
            SINo: j.SINo,
            IssueMemoDate: this.datepipe.transform(new Date(j.SIDate), 'dd-MM-yyyy'),
            SIDate: this.datepipe.transform(new Date(j.SIDate), 'MM/dd/yyyy'),
            DDate: this.datepipe.transform(new Date(j.DDate), 'MM/dd/yyyy'),
            DNo: j.DNo,
            DeliveryOrderDate: this.datepipe.transform(new Date(j.DDate), 'dd-MM-yyyy'),
            GodownCode: this.IssuingCode,
            DORowid: j.Rowid,
            RCode: j.RCode
          })
        })
        this.itemData.push({ TStockNo: 'Total', NoPacking: totalBags, GKgs: totalGkgs.toFixed(3), Nkgs: totalNkgs.toFixed(3) });
        this.getAllotmentDetails();
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: err.message
        });
      }
    });
  }

  resetForm(issueMemoForm: NgForm) {
    issueMemoForm.form.markAsUntouched();
    issueMemoForm.form.markAsPristine();
  }

  resetFields() {
    this.RegularAdvance = null;
    this.curMonth = "0" + (new Date().getMonth() + 1);
    this.month = this.datepipe.transform(new Date(), 'MMM');
  }

  onClear() {
    this.itemData = []; this.issueData = [];
    this.trCode = null; this.Trcode = null;
    this.rtCode = null; this.RTCode = null;
    this.rnCode = null; this.RNCode = null;
    this.wtCode = null; this.WTCode = null;
    this.WNo = '-'; this.RegularAdvance = null;
    this.ACSCode = null; this.SocietyCode = null;
    this.VehicleNo = null; this.Remarks = null; this.DeliveryOrderNo = null;
    this.TransporterCharges = 0; this.TransporterName = '-'; this.ManualDocNo = '-';
    this.NewBale = 0; this.GunnyReleased = 0; this.Gunnyutilised = 0;
    this.SServiceable = 0; this.SPatches = 0; this.CurrentDocQtv = 0;
    this.StackBalance = 0; this.NetStackBalance = 0; this.SINo = null;
    this.godownNo = null; this.locationNo = null; this.stackCompartment = null;
    this.NoPacking = null; this.GKgs = 0; this.NKgs = 0; this.TKgs = 0;
    this.curMonth = "0" + (new Date().getMonth() + 1);
    this.month = this.datepipe.transform(new Date(), 'MMM');
    this.year = new Date().getFullYear();
    this.SIDate = this.maxDate;
    this.yearOptions = [{ label: this.year, value: this.year }];
    this.Moisture = null; this.schemeCode = null; this.Scheme = null;
    this.iCode = null; this.ICode = null;
    this.ipCode = null; this.IPCode = null; this.tStockCode = null;
    this.TStockNo = null; this.stackYear = null; this.IssCode = null;
    this.SocietyName = null; this.SocietyCode = null;
    this.packingTypeOptions = undefined; this.transactionOptions = undefined;
    this.itemDescOptions = []; this.schemeOptions = [];
    this.stackOptions = []; this.wmtOptions = undefined;
    this.receiverNameOptions = []; this.receiverTypeOptions = [];
    this.allotmentDetails = []; this.exceedAllotBal = false;
    this.QuantityLimit = null; this.disableSave = false;
    this.AllotmentQty = 0; this.IssueQty = 0; this.BalanceQty = 0;
    ///Preview Data Clear
    this.PreTransaction = null; this.PreTransporterCharges = null;
    this.PreTransporterName = null; this.PreVehicleNo = null;
    this.PreWNo = null; this.PreYear = null; this.PreMonth = null;
    this.PreManualDocNo = null; this.PreRecName = null;
    this.PreRecType = null; this.PreRegAdv = null;
    this.PreRemarks = null; this.PreSIDate = null;
    this.showPreview = false;
  }

  openNext() {
    this.index = (this.index === 2) ? 0 : this.index + 1;
  }

  openPrev() {
    this.index = (this.index === 0) ? 2 : this.index - 1;
  }

  loadDocument() {
    const path = "../../assets/Reports/" + this.UserID.user + "/";
    const filename = this.IssuingCode + GolbalVariable.StockIssueDocument;
    let filepath = path + filename + ".txt";
    var w = window.open(filepath);
    w.print();
  }

  onPrint() {
    if (this.isViewed) {
      this.onSave('2');
    } else {
      this.loadDocument();
      const params = { DOCNumber: this.DOCNumber }
      this.restAPIService.put(PathConstants.STOCK_ISSUE_DUPLICATE_DOCUMENT, params).subscribe(res => {
        if (res) { this.DOCNumber = null; }
      });
      this.isSaveSucceed = false;
      this.isViewed = false;
    }
  }

  onSubmit(form) {
    this.submitted = true;
    let arr = [];
    let no = 0;
    if (form.invalid) {
      for (var key in form.value) {
        if ((form.value[key] === undefined || form.value[key] === '' || (key === 'DONO' && this.issueData.length === 0))
          && (key !== 'StockIssueNo' && key !== 'GodownNo' && key !== 'LocNo'
            && key !== 'TareWt' && key !== 'GU/GR' && key !== 'StackBal' &&
            key !== 'CurDocQty' && key !== 'NetStackBal' && key != 'QtyLimit')) {
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
      this.messageService.add({
        key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS,
        summary: StatusMessage.SUMMARY_ALERT, detail: StatusMessage.SuccessValidationMsg
      });
    }
  }

  viewPreview(f) {
    this.showPreview = true;
    // this.PreSIDate = this.datepipe.transform(f.value['StockIssueDate'], 'dd/MM/yyyy');
    this.PreWNo = (f.value['WCNo'] !== null) ? f.value['WCNo'].toString().toUpperCase() : f.value['WCNo'];
    this.PreRegAdv = (f.value['IssueRegAdv'] !== null) ? f.value['IssueRegAdv'].toString().toUpperCase()
      : f.value['IssueRegAdv'];
    this.PreTransaction = (f.value['TansactionType'] !== null) ?
      ((f.value['TansactionType'].label !== undefined)
        ? f.value['TansactionType'].label : f.value['TansactionType']) : '';
    this.PreRecType = (f.value['ReceivorType'] !== null) ?
      ((f.value['ReceivorType'].label !== undefined)
        ? f.value['ReceivorType'].label : f.value['ReceivorType']) : '';
    this.PreRecName = (f.value['ReceivorName'] !== null) ?
      ((f.value['ReceivorName'].label !== undefined)
        ? f.value['ReceivorName'].label : f.value['ReceivorName']) : '';
    this.PreMonth = (f.value['Month'] !== null) ? f.value['Month'].toString().toUpperCase() : f.value['Month'];
    this.PreYear = f.value['Year'];
    this.PreVehicleNo = (f.value['VechileNum'] !== null) ? f.value['VechileNum'].toString().toUpperCase()
      : f.value['VechileNum'];
    this.PreTransporterCharges = f.value['TCharges'];
    this.PreTransporterName = (f.value['TransportersName'] !== null) ?
      f.value['TransportersName'].toString().toUpperCase() : f.value['TransportersName'];
    this.PreManualDocNo = (f.value['ManualDocNum'] !== null) ?
      f.value['ManualDocNum'].toString().toUpperCase() : f.value['ManualDocNum'];
    this.PreRemarks = f.value['RemarksText'];
  }

  onClose() {
    this.messageService.clear('t-err');
  }

}
