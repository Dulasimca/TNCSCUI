import { Component, OnInit } from '@angular/core';
import { SelectItem, MessageService, ConfirmationService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { reject } from 'q';

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
  Location: string;
  Formation: string;
  StackNo: string;
  Date: Date = new Date();
  GCode: any;
  ICode: any;
  CurYear: any;
  selectedRow: any;
  godownOptions: SelectItem[];
  commodityOptions: SelectItem[];
  curYearOptions: SelectItem[];
  commoditySelection: any[] = [];
  Weights: number = 0;
  Bags: number = 0;
  canShowMenu: boolean;
  maxDate: Date;
  gdata: any = [];
  isActionDisabled: any;
  isViewDisabled: any;
  allowInput: boolean = true;
  isSlash: boolean = false;
  openView: boolean = false;

  constructor(private tableConstants: TableConstants, private messageService: MessageService, 
    private datepipe: DatePipe, private restAPIService: RestAPIService, 
    private roleBasedService: RoleBasedService, private authService: AuthService,
    private confirmationService: ConfirmationService) { }

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
    if (this.Location !== undefined && this.Location !== null && this.Formation !== undefined && this.Formation !== null) {
      this.StackNo = this.Location.toString().toUpperCase() + "/" + this.Formation;
      this.StackNo =this.StackNo.replace("//","/");
      if  (this.StackNo !== undefined && this.stackOpeningData.length !== 0) {
        this.stackOpeningData.forEach(x => {
          if (x.StackNo.toString().trim() === this.StackNo && x.Flag1 === 'R') {
            this.confirmationService.confirm({
              message: 'You have entered running stack card number! Do you want close this current stack card or try new entry?',
              header: 'Confirmation',
              icon: 'pi pi-exclamation-triangle',
              accept: () => {
                this.nonEditable = true;
              },
              reject: () => {
                this.onClear();
              }
            });
          } else if (x.StackNo.toString().trim() === this.StackNo && x.Flag1 === 'C') {
            this.onClear();
            this.messageService.add({ key: 't-err', severity: 'warn', summary: 'Warning Message!', detail: 'Card has been closed already!' });
          }
        })
      }
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
     if((event.keyCode>=32 && event.keyCode <=46)|| (event.keyCode >= 58 && event.keyCode <= 64) || (event.keyCode >=91 && event.keyCode <= 96) || (event.keyCode >=123 && event.keyCode <= 127))
    {
      return false;
    }
     else if(event.target.value.length == 0 && event.keyCode == 47) {
      return false;
    } 
    else if ((event.target.value.length  >= 1) && event.keyCode == 47) 
    {
      let index =this.Location.indexOf('/');
      if(index<0)
      {
        this.isSlash=false;
      }
     if(event.keyCode == 47 && !this.isSlash)
     {
      this.isSlash=true;
      return true;
     }
     else { return false; }
    } 
    else{
      return true;
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
        case 'cd':
          this.messageService.clear();
            if (this.ICode !== undefined && this.ICode.value !== null) {
                this.onView();
            } else {
              this.openView = false;
            }
          break;
          case 'cy':
            if (this.stackOpeningData.length !== 0 && this.stackOpeningData !== undefined) {
              this.stackOpeningData = this.stackOpeningData.filter(x => {
                return x.CurYear === this.CurYear
              })
            }
            break;
    }
  }

  onRowSelect(event, data) {
    this.selectedRow = data;
    this.ClosingDate = null;
    if (this.selectedRow !== undefined) {
      if (this.selectedRow.Flag1 === 'R') {
      this.nonEditable = true;
      this.RowId = this.selectedRow.RowId;
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
      this.onClear();
      this.messageService.add({ key: 't-err', severity: 'warn', summary: 'Warning Message!', detail: 'Card has been closed  already!' });
    }
  } 
  }

  onView() {
      this.openView = true;
      this.stackOpeningData = [];
      const params = new HttpParams().set('ICode', this.ICode.value).append('GCode', this.GCode.value);
      this.restAPIService.getByParameters(PathConstants.STACK_OPENING_ENTRY_REPORT_GET, params).subscribe((res: any) => {
        if (res.Table !== undefined && res.Table !== null && res.Table.length !== 0) {
          this.stackOpeningCols = this.tableConstants.StackCardOpeningEntryReport;
          this.stackOpeningData = res.Table;
          if (res.Table1 !== undefined && res.Table1 !== null) {
            res.Table1.forEach(cy => {
              this.curYearOptions = [{ label: cy.CurYear, value: cy.CurYear }];
            })
          }
          let sno = 0;
          this.stackOpeningData.forEach(x => {
            sno += 1;
            x.SlNo = sno;
            x.ObStackDate = this.datepipe.transform(x.ObStackDate, 'dd-MM-yyyy');
          });
          this.Opening_Balance = this.stackOpeningData.slice(0);
        } else {
          this.openView = false;
          this.messageService.add({ key: 't-err', severity: 'warn', summary: 'Warning Message!', detail: 'Record Not Found!' });
        }
      });
  }

  onClear() {
    this.nonEditable = false;
    this.Location = this.Formation = this.StackNo = null;
      this.Bags = this.Weights = 0;
  }

  onSave() {
    this.messageService.clear();
    if (!this.nonEditable) {
    const params = {
      'GodownCode': this.GCode.value,
      'CommodityCode': this.ICode.value,
      'ObStackDate': this.datepipe.transform(this.Date, 'MM/dd/yyyy'),
      'Location': this.Location,
      'Formation': this.Formation,
      'StackNo': this.StackNo,
      'Bags': this.Bags,
      'Weights': this.Weights,
      'RegionCode': this.GCode.rcode,
      'clstackdate': new Date()
    };
    this.restAPIService.post(PathConstants.STACK_OPENING_ENTRY_REPORT_POST, params).subscribe(res => {
      if (res) {
        this.onView();
        this.messageService.add({ key: 't-err', severity: 'success', summary: 'Success Message!', detail: 'Saved Successfully!' });
      } else {
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message!', detail: 'Please try again!' });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0) {
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message!', detail: 'Please try again!' });
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
        this.onClear();
        this.nonEditable = false;
        this.messageService.add({ key: 't-err', severity: 'success', summary: 'Success Message!', detail: 'Card closed!' });
      } else {
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message!', detail: 'Please try again!' });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0) {
        this.messageService.add({ key: 't-err', severity: 'error', summary: 'Error Message!', detail: 'Please try again!' });
      }
    })
  }
}

}
