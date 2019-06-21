import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { SelectItem } from 'primeng/api';
import { PathConstants } from 'src/app/constants/path.constants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';

@Component({
  selector: 'app-stock-receipt',
  templateUrl: './stock-receipt.component.html',
  styleUrls: ['./stock-receipt.component.css']
})
export class StockReceiptComponent implements OnInit {
  scheme_data: any;
  itemCol: any;
  itemData: any;
  regionName: any;
  godownName: any;
  data: any;
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
  locationNo: any;
  wmtOptions: SelectItem[];
  fromStationOptions: SelectItem[];
  toStationOptions: SelectItem[];
  vehicleOptions: SelectItem[];
  freightOptions: SelectItem[];
  godownNo: any;
  canShowMenu: boolean;
  ReceivingCode: string;
  RCode: number;
  //SR-Details
  SRNo: any;
  SRDate: Date;
  PAllotment: any;
  OrderNo: number;
  OrderDate: Date;
  MTransport: string;
  Trcode: string;
  DepositorType: string;
  DepositorCode: string;
  TruckMemoNo: any;
  TruckMemoDate: Date;
  ManualDocNo: number;
  LNo: any;
  LFrom: any;
  //SR-Item Details
  TStockNo: number;
  Scheme: string;
  ICode: string;
  IPCode: string;
  NoPacking: any;
  GKgs: number;
  Nkgs: number;
  WTCode: string;
  Moisture: string;
  stackBalance: number;
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


  constructor(private authService: AuthService, private roleBasedService: RoleBasedService, private restAPIService: RestAPIService) {
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
    this.itemCol = [
      { field: 'Stack No.', header: 'StackNo' },
      { field: 'Item Description', header: 'ItemDesc' },
      { field: 'Packing Type', header: 'PackingType' },
      { field: 'No. of packing', header: 'No Packing' },
      { field: 'Wmt Type', header: 'WmtType' },
      { field: 'Gross Wt', header: 'GrossWt' },
      { field: 'Net Wt', header: 'NetWT' },
      { field: 'Moisture', header: 'Moisture' },
      { field: 'Scheme', header: 'Scheme' }

    ]
    this.itemData = [
      { 'Stack No.': '1', 'Item Description': 'A', 'Packing Type': '', 'No. of packing': '', 'Wmt Type': '', 'Gross Wt': '', 'Moisture': '', 'Scheme': '', 'Net Wt': '' },
      { 'Stack No.': '2', 'Item Description': 'B', 'Packing Type': '', 'No. of packing': '', 'Wmt Type': '', 'Gross Wt': '', 'Moisture': '', 'Scheme': '', 'Net Wt': '' },
      { 'Stack No.': '3', 'Item Description': 'C', 'Packing Type': '', 'No. of packing': '', 'Wmt Type': '', 'Gross Wt': '', 'Moisture': '', 'Scheme': '', 'Net Wt': '' },
      { 'Stack No.': '4', 'Item Description': 'D', 'Packing Type': '', 'No. of packing': '', 'Wmt Type': '', 'Gross Wt': '', 'Moisture': '', 'Scheme': '', 'Net Wt': '' },
      { 'Stack No.': '5', 'Item Description': 'E', 'Packing Type': '', 'No. of packing': '', 'Wmt Type': '', 'Gross Wt': '', 'Moisture': '', 'Scheme': '', 'Net Wt': '' },
      { 'Stack No.': '6', 'Item Description': 'F', 'Packing Type': '', 'No. of packing': '', 'Wmt Type': '', 'Gross Wt': '', 'Moisture': '', 'Scheme': '', 'Net Wt': '' },
    ];
  }

  onSelect(selectedItem) {
    let transactoinSelection = [];
    let schemeSelection = [];
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