import { Component, OnInit } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams } from '@angular/common/http';
import { unsupported } from '@angular/compiler/src/render3/view/util';

@Component({
  selector: 'app-stack-card-opening-entry',
  templateUrl: './stack-card-opening-entry.component.html',
  styleUrls: ['./stack-card-opening-entry.component.css']
})
export class StackCardOpeningEntryComponent implements OnInit {
  stackOpeningCols: any;
  stackOpeningData: any = [];
  data: any;
  Opening_Balance: any = []
  godownName: any;
  Location: number;
  Formation: number;
  StackNo: number;
  Year: any;
  fromDate: any;
  toDate: any;
  g_cd: any;
  c_cd: any;
  gCode: any;
  rCode: any;
  commodityCd: any;
  disableOkButton: boolean = true;
  selectedRow: any;
  godownOptions: SelectItem[];
  commodityOption: SelectItem[];
  Weights: number;
  Bags: number;
  canShowMenu: boolean;
  yearOptions: SelectItem[];
  year: string;
  viewPane: boolean;
  isActionDisabled: any;
  isViewDisabled: any;

  constructor(private tableConstants: TableConstants, private messageService: MessageService, private restAPIService: RestAPIService, private roleBasedService: RoleBasedService, private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    this.isViewDisabled = this.isActionDisabled = true;
    this.stackOpeningCols = this.tableConstants.StackCardOpeningEntryReport;
    setTimeout(() => {
      this.godownName = this.data.rgData[1].GName;
      this.gCode = this.data.rgData[1].GCode;
      this.rCode = this.data.rgData[0].RCode;
    }, 1200);
    let commoditySelection = [];
    if (this.commodityOption === undefined) {
      this.restAPIService.get(PathConstants.ITEM_MASTER).subscribe(data => {
        if (data !== undefined) {
          data.forEach(x => {
            commoditySelection.push({ 'label': x.ITDescription, 'value': x.ITCode });
         this.commodityOption = commoditySelection;
          });
          this.commodityOption.unshift({ 'label': '-select-', 'value': null, disabled: true });
        }
      })
    }

  }

  onSelect(item) {
    let godownSelection = [];
    switch (item) {
      case 'gd':
        if (this.data.godownData === undefined) {
          this.data.godownData.forEach(x => {
            godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            this.godownOptions = godownSelection;
          });
          this.godownOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        }
      }
    }
  //       break;
  //     case 'cd':
  //       if(this.commodityOption === undefined){
  //       this.restAPIService.get(PathConstants.ITEM_MASTER).subscribe(data => {
  //         if (data !== undefined) {
  //           data.forEach(y => {
  //             commoditySelection.push({ 'label': y.ITDescription, 'value': y.ITCode });
  //             this.commodityOption = commoditySelection;
  //           });
  //         }
  //       })
  //     }
  //     break;
  //   }
  //   if (this.fromDate !== undefined && this.toDate !== undefined
  //     && this.g_cd.value !== '' && this.g_cd.value !== undefined && this.g_cd !==  null
  //      && this.c_cd.value !== undefined && this.c_cd.value !== '' && this.c_cd !== null) {
  //     this.isViewDisabled = false;
  //   }
  // }

  onChange(e) {
    if (this.commodityOption !== undefined) {
      const selectedItem = e.value;
      if (selectedItem !== null) {
        this.stackOpeningData = this.stackOpeningData.filter(x => { return x.ITDescription === selectedItem.label });
        if (this.stackOpeningData.length === 0) {
          this.messageService.add({ key: 't-err', severity: 'warn', summary: 'Warn Message', detail: 'No record for selected item, Please try another!' });
        }
      } else {
        console.log(this.Opening_Balance)
        this.stackOpeningData = this.Opening_Balance;
      }
    }
  }

  onRowSelect(event) {
    this.disableOkButton = false;
    this.selectedRow = event.data;
  }

  showSelectedData() {
    this.viewPane = false;
    this.commodityOption = [{ 'label': this.selectedRow.ITDescription, 'value': this.selectedRow.CommodityCode }];
    this.c_cd = this.selectedRow.ITDescription;
    this.commodityCd = this.selectedRow.CommodityCode;
    this.Location = this.selectedRow.Location;
    this.Formation = this.selectedRow.Formation;
    this.StackNo = this.selectedRow.StackNo;
    this.Bags = this.selectedRow.Bags;
    this.Weights = this.selectedRow.Weights;
  }

  onSave() {
    const params = {
      'GodownCode': this.gCode,
      'CommodityCode': (this.c_cd.value !== null && this.c_cd.value !== undefined) ? this.c_cd.value : this.commodityCd,
      'obDate': this.Year.value,
      'Location': this.Location,
      'Formation': this.Formation,
      'StackNo': this.StackNo,
      'Bags': this.Bags,
      'Weights': this.Weights
    };
    this.restAPIService.post(PathConstants.OPENING_BALANCE_MASTER_POST, params).subscribe(res => {
      if (res) {
        this.messageService.add({ key: 't-err', severity: 'success', summary: 'Success Message', detail: 'Saved Successfully!' });
      } else {
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message', detail: 'Something went wrong!' });
      }
    })
  }
}
