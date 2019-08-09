import { Component, OnInit, ɵConsole } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { SelectItem, ConfirmationService, MessageService } from 'primeng/api';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { DatePipe } from '@angular/common';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-delivery-receipt',
  templateUrl: './delivery-receipt.component.html',
  styleUrls: ['./delivery-receipt.component.css']
})
export class DeliveryReceiptComponent implements OnInit {
  data: any;
  isSaveSucceed: boolean = true;
  username: any;
  viewDate: Date = new Date();
  viewPane: boolean = false;
  deliveryCols: any;
  deliveryData: any = [];
  deliveryViewCols: any;
  deliveryViewData: any = [];
  index: number = 0;
  scheme_data: any[];
  itemCols: any;
  itemData: any = [];
  paymentCols: any;
  paymentData: any = [];
  paymentBalCols: any;
  paymentBalData: any = [];
  itemSchemeCols: any;
  itemSchemeData: any = [];
  maxDate: Date = new Date();
  transactionOptions: SelectItem[];
  yearOptions: SelectItem[];
  receivorTypeOptions: SelectItem[];
  partyNameOptions: SelectItem[];
  monthOptions: SelectItem[];
  itemDescOptions: SelectItem[];
  schemeOptions: SelectItem[];
  rateInTermsOptions: SelectItem[];
  marginSchemeOptions: SelectItem[];
  marginRateInTermsOptions: SelectItem[];
  paymentOptions: SelectItem[];
  selectedItem: boolean;
  RegionName: any;
  GodownName: any;
  marginItemDescOptions: SelectItem[];
  marginTotal: any = 0;
  totalAmount: any = 0;
  canShowMenu: boolean;
  rowId: any;
  UnLoadingSlip: any;
  DeliveryDate: Date = new Date();
  DeliveryOrderNo: any;
  Trcode: any;
  trCode: any;
  TransType: any;
  IndentNo: number;
  OrderPeriod: any;
  PermitDate: Date = new Date();
  PMonth: any;
  PYear: any;
  RCode: string;
  GCode: string;
  PName: any;
  pCode: any;
  RTCode: any;
  rtCode: any;
  Remarks: string;
  Scheme: any;
  schemeCode: any;
  MarginScheme: any;
  marginSchemeCode: any;
  ICode: any;
  iCode: any;
  MICode: any;
  miCode: any;
  NKgs: any;
  Rate: any;
  RateTerm: any;
  rateTerm: any;
  TotalAmount: any = 0;
  MarginNKgs: any;
  MarginRate: any;
  MarginAmount: any = 0;
  MarginRateInTerms: any;
  marginRateInTerms: any;
  GrandTotal: any = 0;
  Payment: string;
  ChequeNo: any;
  ChequeDate: Date = new Date();
  PAmount: any = 0;
  PayableAt: any;
  OnBank: any;
  PrevOrderNo: any;
  PrevOrderDate: Date;
  AdjusmentAmount: any = 0;
  AdjustmentType: string;
  OtherAmount: any = 0;
  Balance: any = 0;
  DueAmount: any = 0;
  PaidAmount: any = 0;
  BalanceAmount: any = 0;
  MarginItem: string;
  curMonth: any;

  constructor(private tableConstants: TableConstants, private roleBasedService: RoleBasedService,
    private restAPIService: RestAPIService, private authService: AuthService, private messageService: MessageService,
    private datepipe: DatePipe,  private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.scheme_data = this.roleBasedService.getSchemeData();
    this.data = this.roleBasedService.getInstance();
    this.username = JSON.parse(this.authService.getCredentials());
    this.deliveryCols = this.tableConstants.DeliveryDocumentcolumns;
    this.deliveryViewCols = this.tableConstants.DeliveryDocumentViewCols;
    this.itemCols = this.tableConstants.DeliveryItemColumns;
    this.paymentCols = this.tableConstants.DeliveryPaymentcolumns;
    this.paymentBalCols = this.tableConstants.DeliveryPaymentBalanceCols;
    this.itemSchemeCols = this.tableConstants.DeliveryItemSchemeColumns;
    this.curMonth = "0" + (new Date().getMonth() + 1);
    this.PMonth = this.datepipe.transform(new Date(), 'MMM');
    this.monthOptions = [{ label: this.PMonth, value: this.curMonth}];
    setTimeout(() => {
      this.GodownName = this.data[0].GName;
      this.RegionName = this.data[0].RName;
      this.GCode = this.data[0].GCode;
      this.RCode = this.data[0].RCode;
    }, 300);
  }
  customSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.brand.toLocaleLowerCase().indexOf(term) > -1 || item.id.toLocaleLowerCase().indexOf(term) > -1;
}

  onSelect(selectedItem) {
    let transactoinSelection = [];
    let schemeSelection = [];
    let marginSchemeSelection = [];
    let commoditySelection = [];
    let marginCommoditySelection = [];
    let receivorTypeList = [];
    let weighment = [];
    let marginWeighment = [];
    let partyNameList = [];
    let yearArr = [];
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
        this.monthOptions = [{ 'label': 'Jan', 'value': 1 },
        { 'label': 'Feb', 'value': 2 }, { 'label': 'Mar', 'value': 3 }, { 'label': 'Apr', 'value': 4 },
        { 'label': 'May', 'value': 5 }, { 'label': 'Jun', 'value': 6 }, { 'label': 'Jul', 'value': 7 },
        { 'label': 'Aug', 'value': 8 }, { 'label': 'Sep', 'value': 9 }, { 'label': 'Oct', 'value': 10 },
        { 'label': 'Nov', 'value': 11 }, { 'label': 'Dec', 'value': 12 }];
        this.monthOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        break;
      case 'tr':
        if (this.transactionOptions === undefined) {
          this.restAPIService.get(PathConstants.TRANSACTION_MASTER).subscribe(data => {
            if (data !== undefined && data !== null && data.length !== 0) {
              data.forEach(y => {
                transactoinSelection.push({ 'label': y.TRName, 'value': y.TRCode, 'transType': y.TransType });
                this.transactionOptions = transactoinSelection;
              });
              this.transactionOptions.unshift({ 'label': '-select', 'value': null });
            }
          })
        }
        break;
      case 'scheme':
        if (this.scheme_data !== undefined && this.scheme_data !== null) {
          this.scheme_data.forEach(y => {
            schemeSelection.push({ 'label': y.SName, 'value': y.SCode });
            this.schemeOptions = schemeSelection;
          });
          this.schemeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        }
        break;
        case 'margin_scheme':
        if (this.scheme_data !== undefined && this.scheme_data !== null) {
          this.scheme_data.forEach(y => {
            marginSchemeSelection.push({ 'label': y.SName, 'value': y.SCode });
            this.marginSchemeOptions = marginSchemeSelection;
          });
          this.marginSchemeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        }
        break;
      case 'rt':
       if (this.Trcode !== null && this.Trcode !== undefined) {
        if (this.Trcode !== null && this.Trcode.value !== undefined && this.Trcode.value !== '') {
          const params = new HttpParams().set('TRCode', (this.Trcode.value !== undefined) ? this.Trcode.value : this.trCode).append('GCode', this.GCode);
          this.restAPIService.getByParameters(PathConstants.DEPOSITOR_TYPE_MASTER, params).subscribe((res: any) => {
            if (res !== null && res !== undefined && res.length !== 0) {
              res.forEach(dt => {
              receivorTypeList.push({ 'label': dt.Tyname, 'value': dt.Tycode });
            });
            this.receivorTypeOptions = receivorTypeList;
          }
            // this.isReceivorNameDisabled = false;
            this.receivorTypeOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
          });
        }
      }
        break;
      case 'pn':
       if (this.RTCode !== undefined && this.Trcode !== null && this.RTCode !== null && this.Trcode !== undefined) {
         if (this.Trcode.value !== undefined && this.Trcode.value !== '' && this.RTCode.value !== undefined && this.RTCode.value !== '') {
           const params = new HttpParams().set('TyCode', (this.RTCode.value !== undefined) ? this.RTCode.value : this.rtCode)
             .append('TRType', (this.Trcode.transType !== undefined) ? this.Trcode.transType : this.TransType);
           this.restAPIService.getByParameters(PathConstants.DEPOSITOR_NAME_MASTER, params).subscribe((res: any) => {
             if (res !== null && res !== undefined && res.length !== 0) {
               res.forEach(dn => {
                 partyNameList.push({ 'label': dn.DepositorName, 'value': dn.DepositorCode });
               })
               this.partyNameOptions = partyNameList;
             }
             this.partyNameOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
           });
         }
       }
        break;
      case 'commodity':
       if (this.Scheme !== null && this.Scheme !== undefined) {
         if (this.Scheme.value !== undefined && this.Scheme.value !== '') {
           const params = new HttpParams().set('SCode', (this.Scheme.value !== undefined) ? this.Scheme.value : this.schemeCode);
           this.restAPIService.getByParameters(PathConstants.COMMODITY_FOR_SCHEME, params).subscribe((res: any) => {
            if (res !== null && res !== undefined && res.length !== 0) {
              if (!this.selectedItem) {
               res.forEach(i => {
                 commoditySelection.push({ 'label': i.ITDescription, 'value': i.ITCode });
               });
             } else {
               let filteredArr = res.filter(x => {
                 return x.Allotmentgroup === 'RICE';
               })
               filteredArr.forEach(i => {
                 commoditySelection.push({ 'label': i.ITDescription, 'value': i.ITCode });
               })
             }
             this.itemDescOptions = commoditySelection;
            }
             this.itemDescOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
           });
        }
      }
        break;
        case 'margin_commodity':
           if (this.MarginScheme !== null && this.MarginScheme !== undefined) {
             if (this.MarginScheme.value !== undefined && this.MarginScheme.value !== '') {
               const params = new HttpParams().set('SCode', (this.MarginScheme.value !== undefined) ? this.MarginScheme.value : this.schemeCode);
               this.restAPIService.getByParameters(PathConstants.COMMODITY_FOR_SCHEME, params).subscribe((res: any) => {
                if (res !== null && res !== undefined && res.length !== 0) {
                 if (!this.selectedItem) {
                   res.forEach(i => {
                     marginCommoditySelection.push({ 'label': i.ITDescription, 'value': i.ITCode });
                   });
                 } else {
                   let filteredArr = res.filter(x => {
                     return x.Allotmentgroup === 'RICE';
                   })
                   filteredArr.forEach(i => {
                     marginCommoditySelection.push({ 'label': i.ITDescription, 'value': i.ITCode });
                   })
                 }
                 this.marginItemDescOptions = marginCommoditySelection;
                }
                 this.marginItemDescOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
               });
             }
          }
            break;
        case 'wmt':
        if (this.rateInTermsOptions === undefined) {
          this.restAPIService.get(PathConstants.BASIC_WEIGHT_MASTER).subscribe((res: any) => {
            if (res !== null && res !== undefined && res.length !== 0) {
              res.forEach(w => {
              if (w.Basicweight !== 'GRAMS') {
              weighment.push({ 'label': w.Basicweight, 'value': w.Basicweight }); }
            })
            this.rateInTermsOptions = weighment;
          }
            this.rateInTermsOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
          });
        }
        break;
        case 'margin_wmt':
        if (this.marginRateInTermsOptions === undefined) {
          this.restAPIService.get(PathConstants.BASIC_WEIGHT_MASTER).subscribe((res: any) => {
            if (res !== null && res !== undefined && res.length !== 0) {
              res.forEach(w => {
                if (w.Basicweight !== 'GRAMS') {
                  marginWeighment.push({ 'label': w.Basicweight, 'value': w.Basicweight });
                }
              })
              this.marginRateInTermsOptions = marginWeighment;
            }
              this.marginRateInTermsOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
          });
        }
        break;
      case 'pay':
        if (this.paymentOptions === undefined) {
          this.paymentOptions = [
            { label: 'Adjustment', value: 'A' }, { label: 'Cash', value: 'C' },
            { label: 'Cheque', value: 'CH'},{ label: 'Draft', value: 'DD'},{ label: 'Ocr', value: 'O'},
            { label: 'PayOrder', value: 'PO'}];
          }
          break;
    }
  }

  onRowSelect(event) {
    this.DeliveryOrderNo = event.data.Dono;
  }

  openNext() {
    this.index = (this.index === 2) ? 0 : this.index + 1;
  }

  openPrev() {
    this.index = (this.index === 0) ? 2 : this.index - 1;
  }

  checkPayment() { 
    const params = {
      Type: 1,
      DoDate: this.datepipe.transform(this.DeliveryDate, 'MM/dd/yyyy'),
      GCode: this.GCode,
      DoNo: (this.DeliveryOrderNo !== undefined) ? this.DeliveryOrderNo : 0,
      ReceivorCode: (this.PName !== undefined && this.PName !== null) ?
       ((this.pCode !== undefined) ? this.pCode : this.PName.value) : this.pCode
    }
    this.restAPIService.post(PathConstants.STOCK_PAYMENT_DETAILS_DOCUMENT, params).subscribe(res => {
      if (res !== null && res !== undefined && res.length !== 0) {
      this.deliveryData = res;
      } else {
        this.messageService.add({ key: 't-err', severity: 'warn', summary: 'Warn Message', detail: 'No data for this combination!' })
      }
    });
  }

  onView() {
    this.viewPane = true;
    const params = new HttpParams().set('sValue', this.datepipe.transform(this.viewDate, 'MM/dd/yyyy')).append('Type', '1');
    this.restAPIService.getByParameters(PathConstants.STOCK_DELIVERY_ORDER_VIEW_DOCUMENT, params).subscribe((res: any) => {
      if (res !== null && res !== undefined && res.length !== 0) {
        res.forEach(data => {
        data.OrderDate = this.datepipe.transform(data.OrderDate, 'dd-MM-yyyy');
        data.SRDate = this.datepipe.transform(data.SRDate, 'dd-MM-yyyy');
      })
      this.deliveryViewData = res;
     }  else {
      this.messageService.add({ key: 't-err', severity: 'warn', summary: 'Warn Message', detail: 'No data for this combination!' })
    }
    });
  }


  deleteRow(id, data, index) {
    switch(id) {
      case 'delivery':
          this.confirmationService.confirm({
            message: 'Are you sure that you want to proceed?',
                header: 'Confirmation',
                icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deliveryData.splice(index, 1);
            }
        });
        break;
      case 'item':
        this.Scheme = data.SchemeName;
        this.schemeCode = data.Scheme;
        this.iCode = data.ItemCode;
        this.ICode = data.ITDescription;
        this.NKgs = (data.Nkgs * 1).toFixed(3);
        this.Rate = (data.Rate * 1).toFixed(2);
        this.RateTerm = data.UnitMeasure;
        this.rateTerm = data.Wtype;
        this.TotalAmount = (data.Total * 1).toFixed(2);
        this.itemData.splice(index, 1);
        break;
        case 'scheme':
          this.marginSchemeCode = data.SchemeCode;
          this.MarginScheme = data.SchemeName;
          this.MICode = data.ITDescription;
          this.miCode = data.ItemCode;
          this.MarginRateInTerms = data.RateInTerms;
          this.marginRateInTerms = data.MarginWtype;
          this.MarginNKgs = (data.MarginNkgs * 1).toFixed(3);
          this.MarginRate = (data.MarginRate * 1).toFixed(2);
          this.MarginAmount = (data.MarginAmount * 1).toFixed(2);
          this.itemSchemeData.splice(index, 1);
        break;
        case 'payment':
            this.confirmationService.confirm({
              message: 'Are you sure that you want to proceed?',
                  header: 'Confirmation',
                  icon: 'pi pi-exclamation-triangle',
              accept: () => {
                  this.paymentData.splice(index, 1);
              }
          });
          break;
          case 'prevBal':
              this.confirmationService.confirm({
                message: 'Are you sure that you want to proceed?',
                    header: 'Confirmation',
                    icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    this.paymentBalData.splice(index, 1);
                }
            });
            break;
    }
  }

  onEnter(id) {
    switch (id) {
      case 'Item':
        this.itemData.push({
          'ITDescription': this.ICode.label, 'UnitMeasure': this.RateTerm.label,
          'SchemeName': this.Scheme.label, 'Itemcode': this.ICode.value, 'NetWeight': this.NKgs, 'Wtype': this.RateTerm.value,
          'Scheme': this.Scheme.value, 'Rate': this.Rate, 'Total': this.TotalAmount, 'RCode': this.RCode
        });
        if (this.itemData.length !== 0) {
            this.totalAmount = 0;
            this.itemData.forEach(x => this.totalAmount += (x.Total * 1));
            this.GrandTotal = ((this.totalAmount * 1) - (this.marginTotal * 1)).toFixed(2);
            this.DueAmount = this.GrandTotal;
            this.Scheme = this.ICode = this.NKgs = this.RateTerm = this.Rate = this.TotalAmount = null;
        }
        break;
      case 'MarginItem':
        this.itemSchemeData.push({
          'ITDescription': this.MICode.label, 'RateInTerms': this.MarginRateInTerms.label,
          'SchemeName': this.MarginScheme.label, 'ItemCode': this.MICode.value, 'MarginNkgs': this.MarginNKgs,
           'MarginWtype': this.MarginRateInTerms.value, 'SchemeCode': this.MarginScheme.value, 'MarginRate': this.MarginRate, 'MarginAmount': this.MarginAmount, 'RCode': this.RCode
        });
        if (this.itemSchemeData.length !== 0) {
          this.marginTotal = 0;
          this.itemSchemeData.forEach(y => this.marginTotal += (y.MarginAmount * 1));
          this.GrandTotal = ((this.totalAmount * 1) - (this.marginTotal * 1)).toFixed(2);
          this.DueAmount = this.GrandTotal;
          this.MarginScheme = this.MICode = this.MarginNKgs = this.MarginRateInTerms = this.MarginRate = this.MarginAmount = null;
        }
        break;
      case 'Payment':
        this.paymentData.push({
          PaymentMode: this.Payment, ChequeNo: this.ChequeNo,
          ChDate: this.datepipe.transform(this.ChequeDate, 'MM/dd/yyyy'), RCode: this.RCode,
          PaymentAmount: this.PAmount, payableat: this.PayableAt, bank: this.OnBank
        })
        let lastIndex = this.paymentData.length;
        if (this.paymentData.length !== 0) {
          this.PaidAmount += (this.PAmount * 1);
          this.DueAmount = (this.DueAmount !== undefined) ? this.DueAmount : this.GrandTotal;
          this.BalanceAmount = (this.DueAmount !== undefined && this.PaidAmount !== undefined) ?
            ((this.DueAmount > this.PaidAmount) ? ((this.DueAmount * 1) - (this.PaidAmount * 1)).toFixed(2) :
              (this.paymentData = this.paymentData.splice(lastIndex, 1), this.BalanceAmount = null,
                this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message', detail: 'No due is pending!' })
              )) : 0;
          this.ChequeDate = new Date();
          this.Payment = this.PayableAt = this.ChequeNo = this.OnBank = this.PAmount = null;
        }
        break;
      case 'Adjustment':
        this.paymentBalData.push({
          AdjustedDoNo: this.PrevOrderNo,
          AdjustDate: this.datepipe.transform(this.PrevOrderDate, 'MM/dd/yyyy'),
          Amount: this.AdjusmentAmount, AdjustmentType: this.AdjustmentType, RCode: this.RCode,
          AmountNowAdjusted: this.OtherAmount, Balance: this.Balance
        });
        if (this.paymentBalData.length !== 0) {
          this.PrevOrderDate =  new Date();
            this.PrevOrderNo = this.AdjusmentAmount = this.AdjustmentType = this.Balance = this.OtherAmount = null;
          }
        break;
    }
  }

  rateWithQtyCalculation(selectedWt, amnt, qty) {
    let total: any = 0;
    switch (selectedWt) {
      case 'KGS':
        total = (qty * amnt).toFixed(2);
        break;
      case 'QUINTALL':
        total = ((qty / 100) * amnt).toFixed(2);
        break;
      case 'TONS':
        total = ((qty / 1000) * amnt).toFixed(2);
        break;
      case 'LTRS':
        total = (qty * amnt).toFixed(2);
        break;
      case 'NOS':
        total = (qty * amnt).toFixed(2);
        break;
      case 'KILOLTRS':
        total = ((qty / 1000) * amnt).toFixed(2);
        break;
    }
    return total;
  }

  calculateTotal() {
   if (this.NKgs !== undefined && this.Rate !== undefined && this.NKgs !== null && this.Rate !== null) {
      this.TotalAmount = this.rateWithQtyCalculation(this.RateTerm.value, this.Rate, this.NKgs);
    }
    if (this.MarginNKgs !== undefined && this.MarginRate !== undefined && this.MarginNKgs !== null && this.MarginRate !== null) {
      this.MarginAmount = this.rateWithQtyCalculation(this.MarginRateInTerms.value, this.MarginRate, this.MarginNKgs);
    }
  }

  onCalculateBalance() {
    if (this.DueAmount !== undefined && this.PaidAmount !== undefined &&
      this.OtherAmount !== undefined && this.AdjusmentAmount !== undefined &&
      this.DueAmount !== null && this.PaidAmount !== null &&
      this.OtherAmount !== null && this.AdjusmentAmount !== null) {
      if (this.AdjustmentType === 'Credit') {
        this.Balance = (((this.AdjusmentAmount * 1) + (this.PaidAmount * 1)) -
          ((this.DueAmount * 1) + (this.OtherAmount * 1)));
      } else {
        this.Balance = (((this.AdjusmentAmount * 1) + (this.DueAmount * 1) + (this.OtherAmount * 1)) -
          ((this.PaidAmount * 1)));
      }
    }
  }

  getPreviousBalance() {
    const params = {
      Type: 2,
      DoDate: this.datepipe.transform(this.DeliveryDate, 'MM/dd/yyyy'),
      GCode: this.GCode,
      DoNo: (this.DeliveryOrderNo !== undefined) ? this.DeliveryOrderNo : 0,
      ReceivorCode: this.PName.value }
      this.restAPIService.post(PathConstants.STOCK_PAYMENT_DETAILS_DOCUMENT, params).subscribe(res => {
        if (res !== null && res !== undefined && res.length !== 0) {
          this.PrevOrderNo = res[0].Dono;
          this.PrevOrderDate = new Date(res[0].DoDate);
          this.AdjusmentAmount = (res[0].Balance * 1);
          } else {
            this.messageService.add({ key: 't-err', severity: 'warn', summary: 'Warn Message', detail: 'No data for this combination!' })
          }
    })
  }

  onPrint() {
    const path = "../../assets/Reports/" + this.username.user + "/";
    const filename = this.GCode + GolbalVariable.StockDORegFilename + ".txt";
    saveAs(path + filename, filename);
   }

  onClear() {
    this.itemData = this.deliveryData = this.itemSchemeData = this.paymentBalData = this.paymentData = [];
    this.BalanceAmount = this.DueAmount = this.PaidAmount = this.GrandTotal = this.Trcode =
    this.IndentNo = this.PMonth = this.PYear = this.RTCode = this.PName = this.Remarks = null;
  }

  getDocByDoNo() {
    this.messageService.clear();
    this.itemData = this.itemSchemeData = this.paymentBalData = this.paymentData = [];
    this.viewPane = false;
    const params = new HttpParams().set('sValue', this.DeliveryOrderNo).append('Type', '2');
    this.restAPIService.getByParameters(PathConstants.STOCK_TRUCK_MEMO_VIEW_DOCUMENT, params).subscribe((res: any) => {
      if (res !== undefined && res.length !== 0) {
        this.DeliveryOrderNo = res[0].Dono;
        this.DeliveryDate = new Date(res[0].DDate);
        this.trCode = res[0].Trcode;
        this.Trcode = res[0].TrName;
        this.transactionOptions = [{ label: res[0].TrName, value: res[0].Trcode }];
        this.IndentNo = res[0].IndentNo;
        this.PermitDate = new Date(res[0].PermitDate);
        let currentYr = new Date().getFullYear();
        let today = new Date().getDate();
        this.curMonth = res[0].IRelates.slice(5, 7);
        let formDate = this.curMonth + "-" + today + "-" + currentYr;
        this.monthOptions = [{ label: this.datepipe.transform(new Date(formDate), 'MMM'), value: this.curMonth }]
        this.PMonth = this.datepipe.transform(new Date(formDate), 'MMM');
        this.yearOptions = [{label: res[0].Pallotment.slice(0, 4), value: res[0].Pallotment.slice(0, 4)}]
        this.PYear = res[0].Pallotment.slice(0, 4);
        this.PName = res[0].ReceivorName;
        this.pCode = res[0].ReceivorCode;
        this.partyNameOptions = [{ label: res[0].ReceivorName, value: res[0].ReceivorCode }];
        this.Remarks = (res[0].Remarks.toString().trim() !== '') ? res[0].Remarks : '-';
        this.GrandTotal = (res[0].GrandTotal * 1);
        res.forEach(i => {
          this.itemData.push({
            ITDescription: i.ITDescription,
            NetWeight: (i.Nkgs * 1),
            UnitMeasure: i.UnitMeasure,
            SchemeName: i.SchemeName,
            Rate: (i.Rate * 1),
            Total: (i.TotalAmount * 1),
            ItemCode: i.ItemCode,
            Scheme: i.Scheme,
          });
          this.itemSchemeData.push({});
          this.paymentBalData.push({});
          this.paymentData.push({});
        });
      }
    });
  }

  onSave() {
    this.OrderPeriod = this.PYear + '/' + ((this.PMonth.value !== undefined) ? this.PMonth.value : this.curMonth) ;
    this.DeliveryOrderNo = (this.DeliveryOrderNo !== undefined) ? this.DeliveryOrderNo : 0;
    this.rowId = (this.rowId !== undefined) ? this.rowId : 0;
    const params = {
      'Dono': this.DeliveryOrderNo,
      'RowId': this.rowId,
      'DoDate': this.datepipe.transform(this.DeliveryDate, 'MM/dd/yyyy'),
      'TransactionCode': (this.Trcode.value !== undefined) ? this.Trcode.value : this.trCode,
      'IndentNo': this.IndentNo,
      'PermitDate': this.datepipe.transform(this.PermitDate, 'MM/dd/yyyy'),
      'OrderPeriod': this.OrderPeriod,
      'ReceivorCode': (this.PName.value !== undefined) ? this.PName.value : this.pCode,
      'IssuerCode': this.GCode,
      'IssuerType': (this.RTCode.value !== undefined) ? this.RTCode.value : this.rtCode,
      'GrandTotal': this.GrandTotal,
      'Regioncode': this.RCode,
      'Remarks': this.Remarks,
      'deliverytype': '',
      'GodownName': this.GodownName,
      'TransactionName': this.Trcode.label,
      'RegionName': this.RegionName,
      'UnLoadingSlip': (this.DeliveryOrderNo === 0) ? 'N' : this.UnLoadingSlip,
      'UserID': this.username.user,
      'documentDeliveryItems': this.itemData,
      'deliveryMarginDetails': this.itemSchemeData,
      'deliveryPaymentDetails': this.paymentData,
      'deliveryAdjustmentDetails': this.paymentBalData
    };
    this.restAPIService.post(PathConstants.STOCK_DELIVERY_ORDER_DOCUMENT, params).subscribe(res => {
        if (res) {
          this.isSaveSucceed = false;
          this.onClear();
          this.messageService.add({ key: 't-err', severity: 'success', summary: 'Success Message', detail: 'Saved Successfully!' });
        } else {
          this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message', detail: 'Something went wrong!' });
        }
    },(err: HttpErrorResponse) => {
      if (err.status === 0) {
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message', detail: 'Please try again!' });
      }
    });
   }
}
