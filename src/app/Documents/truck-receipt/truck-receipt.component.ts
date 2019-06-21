import { Component, OnInit } from '@angular/core';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-truck-receipt',
  templateUrl: './truck-receipt.component.html',
  styleUrls: ['./truck-receipt.component.css']
})
export class TruckReceiptComponent implements OnInit {
  itemCols: any;
  itemData: any;
  selectedValues: boolean;
  transactionOptions: SelectItem[];
  toRailHeadOptions: SelectItem[];
  receivorTypeOptions: SelectItem[];
  receivorNameOptions: SelectItem[];
  receivorRegionOptions: SelectItem[];
  schemeOptions: SelectItem[];
  itemDescOptions: SelectItem[];
  packingTypeOptions: SelectItem[];
  wmtOptions: SelectItem[];
  moistureOptions: SelectItem[];
  freightOptions: SelectItem[];
  vehicleOptions: SelectItem[];
  fromStationOptions: SelectItem[];
  toStationOptions: SelectItem[];
  godownName: string;
  regionName: string;
  canShowMenu: boolean;
  TruckNo: any;
  Trcode: string;
  OrderNo: any;
  OrderDate: Date;
  ROrderNo: any;
  RDate: Date;
  LorryNo: any;
  RHCode: string;
  RTCode: string;
  RNCode: string;
  RCode: string;
  GCode: string;
  RRCode: string;
  ManualDocNo: any;
  Region: string;
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
  TareWt: any;
  StackBalance: any;
  CurrentDocQtv: any;
  NetStackBalance: any;
  TransporterName: string;
  LWBillNo: any;
  WHDNo: any;
  HCharges: any;
  WCharges: any;
  Kilometers: number;
  FreightAmount: number;
  LWBillDate: Date;
  Gunnyutilised: any;
  GunnyReleased: any;
  FCode: string;
  VCode: string;
  FStation: string;
  TStation: string;
  RRNo: any;
  LDate: Date;
  WNo: any;
  RailFreightAmt: any;
  Remarks: string;

  constructor(private restApiService: RestAPIService, private authService: AuthService,) { 
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;

  }

  ngOnInit() {
    this.itemCols = [
      { field: 'Stack No.', header:'StackNo' },
      { field: 'Item Description', header:'ItemDesc' },
      { field: 'Packing Type', header:'PackingType' },
      { field: 'No. of packing', header:'No Packing' },
      { field: 'Wmt Type', header:'WmtType' },
      { field: 'Gross Wt', header:'GrossWt' },
      { field: 'Net Wt', header:'NetWT' },
      { field: 'Moisture', header:'Moisture' },
      { field: 'Scheme', header:'Scheme' }
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

}
