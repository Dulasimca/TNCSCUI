import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Dropdown, MessageService } from 'primeng/primeng';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { HttpErrorResponse } from '@angular/common/http';
import { StatusMessage } from 'src/app/constants/Messages';
import { PathConstants } from 'src/app/constants/path.constants';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TableConstants } from 'src/app/constants/tableconstants';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-hoqty',
  templateUrl: './hoqty.component.html',
  styleUrls: ['./hoqty.component.css']
})
export class HoqtyComponent implements OnInit {
  hoQtyExcelFileName: string;
  hoQtyDetailsCols: any;
  hoQtyDetailsData: any = [];
  canShowMenu: boolean;
  roleId: any;
  data: any = [];
  regions: any = [];
  loggedInRCode: string;
  maxDate: Date;
  yearRange: string;
  username: any;
  regionOptions: SelectItem[];
  RCode: any;
  commodityOptions: SelectItem[];
  ITCode: any;
  locationOptions: SelectItem[];
  Location: any;
  FromDate: any = new Date();
  commoditySelection: any = [];
  locationSelection: any = [];
  loading: boolean;
  type: number;
  header: string;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;
  @ViewChild('commodity', { static: false }) commodityPanel: Dropdown;
  @ViewChild('location', { static: false }) locationPanel: Dropdown;
  @ViewChild('dt', { static: false }) table: Table;

  constructor(private authService: AuthService, private roleBasedService: RoleBasedService,
    private restApiService: RestAPIService, private messageService: MessageService,
    private datePipe: DatePipe, private router: Router, private tableConstants: TableConstants) {
    if (this.router.url.endsWith('HoQty/freereceipt')) {
      this.type = 2;
      this.hoQtyDetailsCols = this.tableConstants.HOQtyFreeReceiptColumns;
      this.header = 'Head Office Quantity Account Free Receipts';
      this.hoQtyExcelFileName = 'HO_QTY_FREE_RECEIPT_REPORT';
    } else if (this.router.url.endsWith('HoQty/otherreceipt')) {
      this.type = 3;
      this.hoQtyDetailsCols = this.tableConstants.HOQtyOtherReceiptColumns;
      this.header = 'Head Office Quantity Account Other Receipts';
      this.hoQtyExcelFileName = 'HO_QTY_OTHER_RECEIPT_REPORT';
    } else if (this.router.url.endsWith('HoQty/freeissue')) {
      this.type = 4;
      this.hoQtyDetailsCols = this.tableConstants.HOQtyFreeIssueColumns;
      this.header = 'Head Office Quantity Account Free Issues';
      this.hoQtyExcelFileName = 'HO_QTY_FREE_ISSUE_REPORT';
    } else if (this.router.url.endsWith('HoQty/otherissue')) {
      this.type = 5;
      this.hoQtyDetailsCols = this.tableConstants.HOQtyOtherIssueColumns;
      this.header = 'Head Office Quantity Account Other Issues';
      this.hoQtyExcelFileName = 'HO_QTY_OTHER_ISSUE_REPORT';
    } else if (this.router.url.endsWith('HoQty/purchase')) {
      this.type = 6;
      this.hoQtyDetailsCols = this.tableConstants.HOQtyPurchaseColumns;
      this.header = 'Head Office Quantity Account Purchase';
      this.hoQtyExcelFileName = 'HO_QTY_PURCHASE_REPORT';
    } else if (this.router.url.endsWith('HoQty/sales')) {
      this.type = 7;
      this.hoQtyDetailsCols = this.tableConstants.HOQtySalesColumns;
      this.header = 'Head Office Quantity Account Sales';
      this.hoQtyExcelFileName = 'HO_QTY_SALES_REPORT';
    } else {
      this.type = 0;
    }
  }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.data = this.roleBasedService.getInstance();
    this.regions = this.roleBasedService.getRegions();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.maxDate = new Date();
    this.yearRange = (this.maxDate.getFullYear() - 1) + ':' + this.maxDate.getFullYear();
    this.username = JSON.parse(this.authService.getCredentials());
    this.onLoad();
  }

  onSelect(item, type) {
    let regionSelection = [];
    switch (item) {
      case 'reg':
        this.regions = this.roleBasedService.regionsData;
        if (type === 'enter') {
          this.regionPanel.overlayVisible = true;
        }
        if (this.roleId === 1) {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              regionSelection.push({ 'label': x.RName, 'value': x.RCode });
            });
            this.regionOptions = regionSelection;
            this.regionOptions.unshift({ label: 'All', value: 'All' });
          }
        } else {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              if (x.RCode === this.loggedInRCode) {
                regionSelection.push({ 'label': x.RName, 'value': x.RCode });
              }
            });
            this.regionOptions = regionSelection;
          }
        }
        break;
      case 'lc':
        if (type === 'tab') {
          this.locationPanel.overlayVisible = true;
        }
        this.locationOptions = this.locationSelection;
        this.locationOptions.unshift({ label: 'All', value: 'All' });
        break;
      case 'cd':
        if (type === 'enter') { this.commodityPanel.overlayVisible = true; }
        this.commodityOptions = this.commoditySelection;
        this.commodityOptions.unshift({ label: 'All', value: 'All' });
        break;
    }
  }

  onLoad() {
    //commodity details
    this.restApiService.get(PathConstants.ITEM_MASTER).subscribe(data => {
      if (data !== undefined) {
        data.forEach(y => {
          this.commoditySelection.push({ 'label': y.ITDescription, 'value': y.ITCode });
        });
      }
    })
    //location details
    this.restApiService.get(PathConstants.LOCATION_MASTER).subscribe(data => {
      if (data !== undefined) {
        data.forEach(y => {
          this.locationSelection.push({ 'label': y.LocationName, 'value': y.LocationID });
        });
      }
    })
  }

  onView() {
    const params = {
      'qtyMonth': this.datePipe.transform(this.FromDate, 'MM'),
      'qtyYear': this.datePipe.transform(this.FromDate, 'yyyy'),
      'RCode': this.RCode,
      'ITCode': this.ITCode.value,
      'Trcode': this.Location.label,
      'Location': this.Location.value,
      'UserName': this.username.user,
      'Type': this.type
    }
    this.table.reset();
    this.hoQtyDetailsData.length = 0;
    this.restApiService.getByParameters(PathConstants.HO_QTY_ABSRTACTREP_GET, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        // res.forEach(x => { x.CreatedDate = this.datePipe.transform(new Date(x.CreatedDate), 'dd-MM-yyyy') });
        this.hoQtyDetailsData = res;
        this.loading = false;
      } else {
        this.hoQtyDetailsData.length = 0;
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    })
  }

}
