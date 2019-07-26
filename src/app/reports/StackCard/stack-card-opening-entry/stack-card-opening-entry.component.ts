import { Component, OnInit } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-stack-card-opening-entry',
  templateUrl: './stack-card-opening-entry.component.html',
  styleUrls: ['./stack-card-opening-entry.component.css']
})
export class StackCardOpeningEntryComponent implements OnInit {
  stackOpeningCols: any;
  stackOpeningData: any = [];
  nonEditable: boolean = false;
  RowId: any;
  ClosingDate: Date;
  data: any;
  Opening_Balance: any = []
  godownName: any;
  Location: any;
  Formation: number;
  StackNo: any;
  Date: Date = new Date();
  g_cd: any;
  c_cd: any;
  commodityCd: any;
  selectedRow: any;
  godownOptions: SelectItem[];
  commodityOptions: SelectItem[];
  commoditySelection: any[] = [];
  Weights: number = 0;
  Bags: number = 0;
  canShowMenu: boolean;
  maxDate: Date;
  gdata: any = [];
  isActionDisabled: any;
  isViewDisabled: any;
  allowInput: boolean = true;

  constructor(private tableConstants: TableConstants, private messageService: MessageService, private datepipe: DatePipe, private restAPIService: RestAPIService, private roleBasedService: RoleBasedService, private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.stackOpeningCols = this.tableConstants.StackCardOpeningEntryReport;
    this.gdata = this.roleBasedService.getInstance();
    this.maxDate = new Date();
    if (this.commodityOptions === undefined) {
      this.restAPIService.get(PathConstants.ITEM_MASTER).subscribe(data => {
        if (data !== undefined) {
          data.forEach(y => {
            this.commoditySelection.push({ 'label': y.ITDescription, 'value': y.ITCode });
            this.commodityOptions = this.commoditySelection;
          });
          this.commodityOptions.unshift({ 'label': '-select-', 'value': null });
        }
      })
    }
  
  }

  calculateStackNo() {
    if (this.Location !== undefined && this.Formation !== undefined) {
      this.StackNo = this.Location.toString().toUpperCase() + "/" + this.Formation.valueOf();
    }
  }

  checkDate(value) {
    const date = new Date(value);
    this.stackOpeningData = [];
    this.nonEditable = false;
    const selectedDate = date.getDate();
    const selectedMonth = date.getMonth() + 1;
    if (selectedDate === 1 && selectedMonth === 4) {
      this.allowInput = false;
    } else {
      this.allowInput = true;
    }
  }

  keyPress(event) {
    if(event.target.value.length === 1 && event.keyCode === 191) {
      this.Location = '';
      return false;
    } else if ((event.target.value.length  > 1) && event.keyCode !== 8) {
      // this.Location += '/';
      let index = event.target.value.indexOf('/');
      if(index >= 1) {
        return false;
      } else { return true; }
    } else {
      return event.which > 90;  
    }
  }

  onSelect(selectedItem) {
    let godownSelection = [];
    switch (selectedItem) {
      case 'gd':
        this.messageService.clear();
        if (this.gdata !== undefined) {
          this.gdata.forEach(x => {
            godownSelection.push({ 'label': x.GName, 'value': x.GCode, 'rcode': x.RCode });
            this.godownOptions = godownSelection;
          });
          this.godownOptions.unshift({ 'label': '-select-', 'value': null });
        }
    }
  }

  onChange(e) {
    if (this.commodityOptions !== undefined) {
      const selectedItem = e.value;
      if (selectedItem !== null) {
        this.stackOpeningData = this.stackOpeningData.filter(x => { return x.CommodityName === selectedItem.label });
        if (this.stackOpeningData.length === 0) {
          this.messageService.add({ key: 't-err', severity: 'error', summary: 'Warn Message', detail: 'No matching commodity found!' });
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

  onRowSelect(event, data) {
    this.selectedRow = data;
    this.ClosingDate = null;
    if (this.selectedRow !== undefined) {
      if (this.selectedRow.Flag1 === 'A') {
      this.nonEditable = true;
      this.RowId = this.selectedRow.RowId;
      this.commodityOptions = [{ 'label': this.selectedRow.CommodityName, 'value': this.selectedRow.CommodityCode }];
      this.c_cd = this.selectedRow.CommodityName;
      this.StackNo = this.selectedRow.StackNo.toUpperCase();
      let index;
      index = this.StackNo.toString().indexOf('/', 1);
      const totalLength = this.StackNo.toString().length;
      const trimmedValue = this.StackNo.toString().slice(0, index + 1);
      const nextValue = this.StackNo.toString().slice(index + 1, totalLength);
      let nextIndex = nextValue.toString().indexOf('/', 1);
      const locNo = nextValue.toString().slice(0, nextIndex);
      this.Location = trimmedValue + locNo;
      this.Formation = nextValue.toString().slice(nextIndex + 1, totalLength);
      this.Bags = this.selectedRow.StackBalanceBags;
      this.Weights = this.selectedRow.StackBalanceWeight;
    } else {
      this.messageService.add({ key: 't-err', severity: 'error', summary: 'Warn Message', detail: 'Card already closed!' });
    }
  } 
  }

  onView() {
    this.stackOpeningData = [];
    const params = new HttpParams().set('OBDate', this.datepipe.transform(this.Date, 'MM/dd/yyyy')).append('GCode', this.g_cd.value);
    this.restAPIService.getByParameters(PathConstants.STACK_OPENING_ENTRY_REPORT_GET, params).subscribe((res: any) => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.stackOpeningCols = this.tableConstants.StackCardOpeningEntryReport;
        this.stackOpeningData = res;
        let sno = 0;
        this.stackOpeningData.forEach(x =>{ 
          sno += 1;
          x.SlNo = sno;
          x.ObStackDate = this.datepipe.transform(x.ObStackDate, 'dd-MM-yyyy');
        });
        this.Opening_Balance = this.stackOpeningData.slice(0);
      } else {
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Warn Message', detail: 'Record Not Found!' });
      }
    })
  }

  onClear() {
    this.Location = this.Formation = this.StackNo = this.c_cd = this.commodityCd = this.Date = null;
      this.Bags = this.Weights = 0;
  }

  onSave() {
    if (!this.nonEditable) {
    const params = {
      'GodownCode': this.g_cd.value,
      'CommodityCode': this.c_cd.value,
      'ObStackDate': this.datepipe.transform(this.Date, 'MM/dd/yyyy'),
      'Location': this.Location,
      'Formation': this.Formation,
      'StackNo': this.StackNo,
      'Bags': this.Bags,
      'Weights': this.Weights,
      'RegionCode': this.g_cd.rcode,
      'clstackdate': new Date()
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
  } else {
    const closingParams = {
      'ClosedDate': this.datepipe.transform(this.ClosingDate, 'MM/dd/yyyy'), 
      'RowId': this.RowId };
    this.restAPIService.put(PathConstants.STACK_OPENING_ENTRY_REPORT_PUT, closingParams).subscribe(res => {
      if (res) {
        this.onView();
        this.messageService.add({ key: 't-success', severity: 'success', summary: 'Success Message', detail: 'Card closed!' });
      } else {
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message', detail: 'Please try again!' });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0) {
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message', detail: 'Please try again!' });
      }
    })
  }
}

}