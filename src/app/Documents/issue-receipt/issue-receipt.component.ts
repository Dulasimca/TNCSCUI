import { Component, OnInit } from '@angular/core';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { SelectItem } from 'primeng/api';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { PathConstants } from 'src/app/constants/path.constants';

@Component({
  selector: 'app-issue-receipt',
  templateUrl: './issue-receipt.component.html',
  styleUrls: ['./issue-receipt.component.css']
})
export class IssueReceiptComponent implements OnInit {
issueData: any;
issueCols: any;
itemCols: any;
itemData: any;
regionName: string;
godownName: string;
scheme_data: any;
monthOptions: SelectItem[];
yearOptions: SelectItem[];
transactionOptions: SelectItem[];
receiverTypeOptions: SelectItem[];
receiverNameOptions: SelectItem[];
schemeOptions: SelectItem[];
itemDescOptions: SelectItem[];
packingTypeOptions: SelectItem[];
wmtOptions: SelectItem[];
moistureOptions: SelectItem[];
selectedValues: string;
month: string;
year: string;
SINo: any;
SIDate: Date;
RCode: any;
GCode: any;
canShowMenu: boolean;
// StockNo: any;
//Issue details
Trcode: string;
DeliveryDate: Date;
DeliveryOrderNo: any;
RTCode: string;
RNCode: string;
WNo: any;
TransporterCharges: any;
VehicleNo: any;
TransporterName: string;
ManualDocNo: any;
Remarks: string;
Scheme: string;
ICode: string;
GodownNo: any;
LocationNo: any;
IPCode: string;
NoPacking: any;
GKgs: any;
NKgs: any;
WTCode: string;
Moisture: string;
TKgs: any;
NewBale: any;
SServiceable: any;
SPatches: any;
Gunnyutilised: any;
GunnyReleased: any;
StackBalance: any;
NStackBalance: any;
CurrentDocQtv: any;



  constructor(private roleBasedService: RoleBasedService, private restAPIService: RestAPIService, private authService: AuthService,) { 
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;

  }

  ngOnInit() {
    this.issueCols = [ { field: 'Delivery Order No', header: 'DeliveryOrderNo' },
    {field: 'Issue Memo No', header: 'IssueMemoNo' },
    { field: 'Delivery Order', header: 'DeliveryOrder' },
    { field: 'Delivery', header: 'Delivery' }]
   

    this.issueData = [ {'Delivery Order No': '1', 'Issue Memo No': 'A', 'Delivery Order': 'E','Delivery': 'I'},
    {'Delivery Order No': '2', 'Issue Memo No': 'B', 'Delivery Order': 'F','Delivery': 'j'},
    {'Delivery Order No': '3', 'Issue Memo No': 'C', 'Delivery Order': 'G','Delivery': 'k'},
    {'Delivery Order No': '4', 'Issue Memo No': 'D', 'Delivery Order': 'H','Delivery': 'l'},
    {'Delivery Order No': '3', 'Issue Memo No': 'C', 'Delivery Order': 'G','Delivery': 'k'},
    {'Delivery Order No': '4', 'Issue Memo No': 'D', 'Delivery Order': 'H','Delivery': 'l'}
  ];

  this.itemCols = [
    { field: 'Stack No.', header:'StackNo' },
    { field: 'Item Description', header:'ItemDesc' },
    { field: 'Packing Type', header:'PackingType' },
    { field: 'No. of packing', header:'No Packing' },
    { field: 'Wmt Type', header:'WmtType' },
    { field: 'Gross Wt', header:'GrossWt' },
    { field: 'Moisture', header:'Moisture' },
    { field: 'Scheme', header:'Scheme' },
    { field: 'Net Wt', header:'NetWT' }
  ]
  this.itemData = [
    { 'Stack No.': '1','Item Description':'A','Packing Type':'','No. of packing':'','Wmt Type': '','Gross Wt': '','Moisture': '','Scheme': '','Net Wt': '' },
    { 'Stack No.': '2','Item Description':'B','Packing Type':'','No. of packing':'','Wmt Type': '','Gross Wt': '','Moisture': '','Scheme': '','Net Wt': '' },
    { 'Stack No.': '3','Item Description':'C','Packing Type':'','No. of packing':'','Wmt Type': '','Gross Wt': '','Moisture': '','Scheme': '','Net Wt': '' },
    { 'Stack No.': '4','Item Description':'D','Packing Type':'','No. of packing':'','Wmt Type': '','Gross Wt': '','Moisture': '','Scheme': '','Net Wt': '' },
    { 'Stack No.': '5','Item Description':'E','Packing Type':'','No. of packing':'','Wmt Type': '','Gross Wt': '','Moisture': '','Scheme': '','Net Wt': '' },
    { 'Stack No.': '6','Item Description':'F','Packing Type':'','No. of packing':'','Wmt Type': '','Gross Wt': '','Moisture': '','Scheme': '','Net Wt': '' },
  ];
  }
  onSelect(selectedItem) {
    let transactoinSelection = [];
    let schemeSelection = [];
    let yearArr = [];
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
        this.monthOptions = [{'label': 'Jan', 'value': 1},
        {'label': 'Feb', 'value': 2},{'label': 'Mar', 'value': 3},{'label': 'Apr', 'value': 4},
        {'label': 'May', 'value': 5},{'label': 'Jun', 'value': 6},{'label': 'Jul', 'value': 7},
        {'label': 'Aug', 'value': 8},{'label': 'Sep', 'value': 9},{'label': 'Oct', 'value': 10},
        {'label': 'Nov', 'value': 11},{'label': 'Dec', 'value': 12}];
        break;
        case 'tr':
        if (this.transactionOptions === undefined) {
          this.restAPIService.get(PathConstants.TRANSACTION_MASTER).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                transactoinSelection.push({ 'label': y.TRName, 'value': y.TRCode });
                this.transactionOptions = transactoinSelection;
              });
              this.transactionOptions.unshift({ 'label': '-', 'value': '-' });
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
  }
}

}
