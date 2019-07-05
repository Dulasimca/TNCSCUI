import { Component, OnInit } from '@angular/core';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { SelectItem } from 'primeng/api';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams } from '@angular/common/http';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';

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
entryList: any = [];
regionName: string;
issuingGodownName: string;
scheme_data: any;
stackYear: any;
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
selectedValues: string;
isReceivorNameDisabled: boolean;
isReceivorTypeDisabled: boolean;
locationNo: any;
godownNo: any;
trCode: string;
wtCode: string;
iCode: string;
ipCode: string;
tStockCode: string;
depositorCode: string;
schemeCode: string;
TKgs: any;
month: string;
year: string;
SINo: any;
SIDate: Date;
RCode: any;
GCode: any;
StackBalance: any;
canShowMenu: boolean;
//Issue details
Trcode: any;
DeliveryOrderDate: Date;
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
NoPacking: number;
GKgs: number;
NKgs: number;
WTCode: any;
Moisture: number;
NewBale: any;
SServiceable: any;
SPatches: any;
Gunnyutilised: any;
GunnyReleased: any;
NStackBalance: any;
CurrentDocQtv: any;
index: number = 0;

  constructor(private roleBasedService: RoleBasedService, private restAPIService: RestAPIService, 
    private authService: AuthService, private tableConstants: TableConstants, private datepipe: DatePipe) { 
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;

  }

  ngOnInit() {
    this.scheme_data = this.roleBasedService.getSchemeData();
    this.issueCols = this.tableConstants.StockIssueMemoIssueDetailsColumns;
    this.itemCols = this.tableConstants.StockIssueMemoItemDetailsColumns;
  }
  onSelect(selectedItem) {
    let transactoinSelection = [];
    let schemeSelection = [];
    let yearArr = [];
    let receivorTypeList = [];
    let receivorNameList = [];
    const range = 3;
    switch(selectedItem) {
    case 'y':
      const year = new Date().getFullYear();
      for (let i = 0; i < range ; i ++) {
        if (i === 0) {
          yearArr.push({'label': (year - 1).toString(), 'value': year - 1});
        } else if (i === 1) {
          yearArr.push({'label': (year).toString(), 'value': year});
        } else {
          yearArr.push({'label': (year + 1).toString(), 'value': year + 1});
        }
      }
      this.yearOptions = yearArr;
      break;
      case 'm':
        this.monthOptions = [{'label': 'Jan', 'value': '01'},
        {'label': 'Feb', 'value': '02'},{'label': 'Mar', 'value': '03'},{'label': 'Apr', 'value': '04'},
        {'label': 'May', 'value': '05'},{'label': 'Jun', 'value': '06'},{'label': 'Jul', 'value': '07'},
        {'label': 'Aug', 'value': '08'},{'label': 'Sep', 'value': '09'},{'label': 'Oct', 'value': '10'},
        {'label': 'Nov', 'value': '11'},{'label': 'Dec', 'value': '12'}];
        break;
        case 'tr':
        if (this.transactionOptions === undefined) {
          this.restAPIService.get(PathConstants.TRANSACTION_MASTER).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                transactoinSelection.push({ 'label': y.TRName, 'value': y.TRCode, 'transType': y.TransType });
                this.transactionOptions = transactoinSelection;
              });
              this.isReceivorTypeDisabled = false;
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
        }
        break;
        case 'rt':
        if (this.Trcode !== null && this.Trcode.value !== undefined && this.Trcode.value !== '') {
          const params = new HttpParams().set('TRCode', this.Trcode.value).append('GCode', '002');
          if (this.receiverTypeOptions === undefined) {
            this.restAPIService.getByParameters(PathConstants.DEPOSITOR_TYPE_MASTER, params).subscribe((res: any) => {
              res.forEach(dt => {
                receivorTypeList.push({ 'label': dt.Tyname, 'value': dt.Tycode });
              });
              this.receiverTypeOptions = receivorTypeList;
              this.isReceivorNameDisabled = false;
            });
          }
        }
        break;
      case 'rn':
        if (this.Trcode !== null && this.Trcode.value !== undefined && this.Trcode.value !== '' &&
          this.RTCode !== null && this.RTCode.value !== undefined && this.RTCode.value !== '') {
          const params = new HttpParams().set('TyCode', this.RTCode.value).append('TRType', this.Trcode.transType);
          if (this.receiverNameOptions === undefined) {
            this.restAPIService.getByParameters(PathConstants.DEPOSITOR_NAME_MASTER, params).subscribe((res: any) => {
              res.forEach(dn => {
                receivorNameList.push({ 'label': dn.DepositorName, 'value': dn.DepositorCode });
              })
              this.receiverNameOptions = receivorNameList;
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
            }
          }
          break;
        case 'st_no':
          let stackNo = [];
          this.RCode = '001';
          if (this.RCode !== undefined && this.ICode.value !== undefined && this.ICode.value !== '' && this.ICode !== null) {
            const params = new HttpParams().set('GCode', this.RCode).append('ITCode', this.ICode.value);
            if (this.stackOptions === undefined) {
              this.restAPIService.getByParameters(PathConstants.STACK_DETAILS, params).subscribe((res: any) => {
                res.forEach(s => {
                  stackNo.push({ 'label': s.StackNo, 'value': s.StackNo });
                })
                this.stackOptions = stackNo;
              });
            }
            let stockNo = this.TStockNo.value;
            this.godownNo = (stockNo !== null && stockNo !== undefined && stockNo !== '') ? stockNo.toString().split('/') : '';
          }
          break;
          case 'pt':
        if (this.packingTypeOptions === undefined) {
          this.restAPIService.get(PathConstants.PACKING_AND_WEIGHMENT).subscribe((res: any) => {
            res.Table.forEach(p => {
              this.packingTypes.push({ 'label': p.PName, 'value': p.Pcode, 'weight': p.PWeight });
            })
            this.packingTypeOptions = this.packingTypes;
          });
        } else {
          if (this.IPCode.value !== undefined && this.IPCode.value !== '' && this.IPCode !== null) {
            this.NoPacking = this.IPCode.weight;
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

onIssueDetailsEnter() { 
  this.issueData.push({'SINo': this.SINo, 'SIDate': this.datepipe.transform(this.SIDate, 'MM/dd/yyyy'),
'DeliveryOrderNo': this.DeliveryOrderNo, 'DeliveryOrderDate': this.datepipe.transform(this.DeliveryOrderDate, 'MM/dd/yyyy')});
 }

onItemDetailsEnter() {
  this.itemData.push({ 'TStockNo': this.TStockNo.label, 'ICode': this.ICode.label, 'IPCode': this.IPCode.label,
 'NoPacking': this.NoPacking, 'GKgs': this.GKgs, 'NKgs': this.NKgs, 'WTCode': this.WTCode.label, 'Moisture': this.Moisture,
 'Scheme': this.Scheme.label
});
this.entryList.push({ 'TStockNo': this.TStockNo.value, 'ICode': this.ICode.value, 'IPCode': this.IPCode.value,
 'NoPacking': this.NoPacking, 'GKgs': this.GKgs, 'NKgs': this.NKgs, 'WTCode': this.WTCode.value, 'Moisture': this.Moisture,
 'Scheme': this.Scheme.value
});
}

onSave() { }

openNext() {
  this.index = (this.index === 2) ? 0 : this.index + 1;
}

openPrev() {
  this.index = (this.index === 0) ? 2 : this.index - 1;
}
}
