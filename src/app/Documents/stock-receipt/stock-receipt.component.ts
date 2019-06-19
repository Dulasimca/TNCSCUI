import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-stock-receipt',
  templateUrl: './stock-receipt.component.html',
  styleUrls: ['./stock-receipt.component.css']
})
export class StockReceiptComponent implements OnInit {
  canShowMenu: boolean;
  itemCol: any;
  itemData: any;
  regionName: any;
  godownName: any;
  data: any;
  stockDate: Date;
  month: string;
  monthOptions: SelectItem[];
  yearOptions: SelectItem[];
  year: string;
  allotmentOrderNo: number;
  allotmentOrderDate: Date;
  roadSelected: boolean;
  railSelected: boolean;
  transactionOptions: SelectItem[];
  tr_cd: string;
  depositorTypeOptions: SelectItem[];
  depositorNameOptions: SelectItem[];
  dt_cd: string;
  dn_cd: string;
  truckMemoNo: any;
  date: Date;
  manualDocNo: number;
  vehicleNo: any;
  from: any;
  schemeOptions: SelectItem[];
  sc_cd: string;
  itemDescOptions: SelectItem[];
  wmtOptions: SelectItem[];
  wmt: string;
  moistureOptions: SelectItem[];
  moisture: string;
  tareWt: number;
  stackBalance: number;
  transporterName: string;
  lorryBillNo: any;
  no: any;
  wayBillDate: Date;
  kms: number;
  freightAmount: number;
  noOfPacking: any;
  grossWt: number;
  netWt: number;
  item_cd: string;
  godownNo: string;
  locationNo: any;
  packingTypeOptions: SelectItem[];
  p_cd: string;
  warehouseDeposit: any;
  wmtCharges: number;
  handlingCharges: number;
  unservicable: any;
  servicableGunny: any;
  gunnyWithPatches: any;
  freightOptions: SelectItem[];
  ft_cd: string;
  v_cd: string;
  vehicleOptions: SelectItem[];
  gunnyUtilized: any;
  gunnyReleased: any;
  mno: any;
  stackNo: number;
  fromStationOptions: SelectItem[];
  toStationOptions: SelectItem[];
  toStation: string;
  fromStation: string;
  rrNo: any;
  loadingDate: Date;
  wagonNo: any;
  remarks: string;


  constructor(private authService: AuthService, private roleBasedService: RoleBasedService) {
    if (this.data === undefined) {
      this.data = this.roleBasedService.getGodownAndRegion();
      setTimeout(() => {
       this.regionName = this.data.RName; this.godownName = this.data.GName;
    },2000);
    }
  }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    

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
  }
}

  // ngAfterViewInit() {
  // }

}
