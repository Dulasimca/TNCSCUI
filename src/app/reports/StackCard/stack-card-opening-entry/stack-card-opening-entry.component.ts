import { Component, OnInit } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { unsupported } from '@angular/compiler/src/render3/view/util';
import { DatePipe } from '@angular/common';

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
  Location: any;
  Formation: number;
  StackNo: any;
  Year: any;
  SRDate: any;
  g_cd: any;
  c_cd: any;
  gCode: any;
  rCode: any;
  commodityCd: any;
  disableOkButton: boolean = true;
  selectedRow: any;
  godownOptions: SelectItem[];
  commodityOptions: SelectItem[];
  commoditySelection: any[] = [];
  Weights: number;
  Bags: number;
  canShowMenu: boolean;
  yearOptions: SelectItem[];
  year: string;
  maxDate: Date;
  viewPane: boolean;
  rData: any = [];
  gdata: any = [];
  viewDate: Date = new Date();
  roleId: any;
  rName: any;
  loggedInGCode: any;
  loggedInRCode: any;
  isActionDisabled: any;
  isViewDisabled: any;

  constructor(private tableConstants: TableConstants, private messageService: MessageService, private datepipe: DatePipe, private restAPIService: RestAPIService, private roleBasedService: RoleBasedService, private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.stackOpeningCols = this.tableConstants.StackCardOpeningEntryReport;
    this.roleId = this.authService.getUserAccessible().roleId;
    this.loggedInGCode = this.authService.getUserAccessible().gCode;
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.maxDate = new Date();
    this.restAPIService.get(PathConstants.GODOWN_MASTER).subscribe((res: any) => {
      let gList;
      if (res !== undefined) {
        if (this.roleId === '3') {
          this.data = res.filter(x => {
            if (x.Code === this.loggedInRCode) {
              gList = x.list;
              this.rData.push({ 'RName': x.Name, 'RCode': x.Code })
              this.rCode = this.rData[0].RCode;
              this.rName = this.rData[0].RName;
              gList.filter(y => {
                if (y.GCode === this.loggedInGCode) {
                  this.gdata.push({ 'GName': y.Name, 'GCode': y.GCode })
                  this.godownName = this.gdata[0].GName;
                  this.gCode = this.gdata[0].GCode;
                }
              })
            }
          })
        } else if (this.roleId === '2') {
          this.data = res.filter(x => {
            if (x.Code === this.loggedInRCode) {
              gList = x.list;
              this.rData.push({ 'RName': x.Name, 'RCode': x.Code })
              gList.forEach(y => {
                this.gdata.push({ 'GName': y.Name, 'GCode': y.GCode })
              })
            }
          })
        } else {
          this.data = res.forEach(x => {
            gList = x.list;
            gList.forEach(y => {
              this.gdata.push({ 'GName': y.Name, 'GCode': y.GCode })
            })
          });
        }
      }
    });
    if (this.commodityOptions === undefined) {
      this.restAPIService.get(PathConstants.ITEM_MASTER).subscribe(data => {
        if (data !== undefined) {
          data.forEach(y => {
            this.commoditySelection.push({ 'label': y.ITDescription, 'value': y.ITCode });
            this.commodityOptions = this.commoditySelection;
          });
          this.commodityOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        }
      })
    }
  }

  calculateStackNo() {
    if (this.Location !== undefined && this.Formation !== undefined) {
      this.StackNo = this.Location + this.Formation.valueOf();
      this.Bags = 0;
      this.Weights = 0;
    }
  }

    validateLocation(value) {
      if (value.length === 1 && value === '/') {
        this.Location = '';
    }

  }

  onSelect(selectedItem) {
    let godownSelection = [];
    switch (selectedItem) {
      case 'gd':
        if (this.gdata !== undefined) {
          this.gdata.forEach(x => {
            godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            this.godownOptions = godownSelection;
          });
          this.godownOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        }
    }
  }

  onChange(e) {
    if (this.commodityOptions !== undefined) {
      const selectedItem = e.value;
      if (selectedItem !== null) {
        this.stackOpeningData = this.stackOpeningData.filter(x => { return x.ITDescription === selectedItem.label });
        if (this.stackOpeningData.length === 0) {
          this.messageService.add({ key: 't-warn', severity: 'warn', summary: 'Warn Message', detail: 'Record not found!' });
        }
      } else {
        this.stackOpeningData = this.Opening_Balance;
      }
    }
  }

  onCommodityClicked() {
    if (this.commodityOptions !== undefined && this.commodityOptions.length <= 1) {
      this.commodityOptions = this.commoditySelection;
    }
  }

  onRowSelect(event) {
    this.disableOkButton = false;
    this.selectedRow = event.SRDate;
  }

  showSelectedData() {
    this.viewPane = false;
    this.commodityOptions = [{ 'label': this.selectedRow.ITDescription, 'value': this.selectedRow.CommodityCode }];
    this.c_cd = this.selectedRow.ITDescription;
    this.SRDate = this.selectedRow.SRDate;
    this.commodityCd = this.selectedRow.CommodityCode;
    this.Location = this.selectedRow.Location;
    this.Formation = this.selectedRow.Formation;
    this.StackNo = this.selectedRow.StackNo;
    this.Bags = this.selectedRow.Bags;
    this.Weights = this.selectedRow.Weights;
  }

  onView() {
    this.stackOpeningData = [];
    this.viewPane = true;
    const params = new HttpParams().set('sValue', this.datepipe.transform(this.viewDate, 'MM/dd/yyyy')).append('GCode', (this.gCode !== undefined) ? this.gCode : this.g_cd.value);
    this.restAPIService.getByParameters(PathConstants.STACK_OPENING_ENTRY_REPORT_GET, params).subscribe((res: any) => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.viewPane = true;
        this.stackOpeningCols = this.tableConstants.StackCardOpeningEntryReport;
        this.stackOpeningData = res;
        this.stackOpeningData.forEach(x => x.GodownName = (this.godownName !== undefined) ? this.godownName : this.g_cd.label);
        this.SRDate = this.datepipe.transform(this.SRDate, 'dd-MM-yyyy');
        this.Opening_Balance = this.stackOpeningData.slice(0);
      } else {
        this.viewPane = false;
        this.messageService.add({ key: 't-warn', severity: 'warn', summary: 'Warn Message', detail: 'Record Not Found!' });
      }
    })
  }

  onClear() {
    this.Location = this.Formation = this.StackNo = this.Bags =
      this.c_cd = this.commodityCd = this.Weights = this.Year = this.g_cd = null;
  }

  onSave() {
    const params = {
      'GodownCode': (this.gCode !== undefined) ? this.gCode : this.g_cd.value,
      'CommodityCode': (this.c_cd.value !== null && this.c_cd.value !== undefined) ? this.c_cd.value : this.commodityCd,
      'SRDate': this.datepipe.transform(this.SRDate, 'MM/dd/yyyy'),
      'Location': this.Location,
      'Formation': this.Formation,
      'StackNo': this.StackNo,
      'Bags': this.Bags,
      'Weights': this.Weights
    };
    this.restAPIService.post(PathConstants.STACK_OPENING_ENTRY_REPORT_POST, params).subscribe(res => {
      if (res) {
        this.messageService.add({ key: 't-success', severity: 'success', summary: 'Success Message', detail: 'Saved Successfully!' });
      } else {
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message', detail: 'Please try again!' });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0) {
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message', detail: 'Please try again!' });
      }
    })
    this.onClear();
  }

}