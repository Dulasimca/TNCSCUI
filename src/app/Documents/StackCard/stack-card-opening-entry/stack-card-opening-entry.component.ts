import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem, MessageService, ConfirmationService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { StatusMessage } from 'src/app/constants/Messages';
import { NgForm } from '@angular/forms';
import { Toast } from 'primeng/toast';

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
  ClosingDate: any;
  data: any;
  Opening_Balance: any = []
  godownName: any;
  Location: string;
  Formation: string;
  StackNo: string;
  Date: any;
  GCode: any;
  ICode: any;
  selectedRow: any;
  godownOptions: SelectItem[];
  commodityOptions: SelectItem[];
  currYearOptions: SelectItem[];
  commoditySelection: any[] = [];
  CommodityLabel: any[] = [];
  Weights: any = 0;
  Bags: any = 0;
  canShowMenu: boolean;
  maxDate: Date;
  gdata: any = [];
  allowInput: boolean = true;
  isSlash: boolean = false;
  openView: boolean = false;
  newEntry: boolean;
  curYear_data: any;
  cardExits: boolean;
  flag: boolean;
  totalRecords: number;
  blockScreen: boolean;
  CDate: string;
  showDialog: boolean;
  loading: boolean;
  activateLoader: boolean;
  CurrYear: any;
  RCode: string;
  CommodityCode: any;
  @ViewChild('f', { static: false }) ngForm: NgForm;


  constructor(private tableConstants: TableConstants, private messageService: MessageService,
    private datepipe: DatePipe, private restAPIService: RestAPIService,
    private roleBasedService: RoleBasedService, private authService: AuthService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.gdata = this.roleBasedService.getInstance();
    const maxDate = new Date(JSON.parse(this.authService.getServerDate()));
    this.maxDate = (maxDate !== null && maxDate !== undefined) ? maxDate : new Date();
    this.Date = this.maxDate;
    this.restAPIService.get(PathConstants.STACK_YEAR).subscribe(data => {
      if (data !== null && data !== undefined) {
        this.curYear_data = data;
      }
    });
    if (this.commodityOptions === undefined) {
      this.restAPIService.get(PathConstants.ITEM_MASTER).subscribe(data => {
        if (data !== undefined) {
          data.forEach(y => {
            this.commoditySelection.push({ 'label': y.ITDescription, 'value': y.ITCode, 'group': y.GRName });
          });
          this.commodityOptions = this.commoditySelection;
          this.CommodityLabel = this.commoditySelection;
          this.commodityOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        }
      })
    }
    let currYrSelection = [];
    this.restAPIService.get(PathConstants.STACKCARD_YEAR_GET).subscribe(res => {
      res.forEach(s => {
        currYrSelection.push({ label: s.StackYear, value: s.StackYear });
      });
    });
    this.currYearOptions = currYrSelection;
    this.currYearOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
    this.RCode = this.authService.getUserAccessible().rCode;
  }

  calculateStackNo() {
    if (this.Location !== undefined && this.Location !== null && this.Formation !== undefined && this.Formation !== null) {
      this.StackNo = this.Location.toString().toUpperCase() + "/" + this.Formation;
      this.StackNo = this.StackNo.replace("//", "/");
      if (this.StackNo !== undefined && this.stackOpeningData.length !== 0) {
        this.stackOpeningData.forEach(x => {
          if (x.StackNo.toString().trim() === this.StackNo && x.Flag1 === 'R') {
            this.confirmationService.confirm({
              message: 'You have entered running stack card number! Do you want close this current stack card or try new entry?',
              header: 'Confirmation',
              icon: 'pi pi-exclamation-triangle',
              accept: () => {
                this.nonEditable = true;
                this.RowId = x.RowId;
                this.flag = true;
              },
              reject: () => {
                this.newEntry = true;
              }
            });
          } else if (x.StackNo.toString().trim() === this.StackNo && x.Flag1 === 'C') {
            if (this.curYear_data !== undefined && this.curYear_data !== null) {
              this.curYear_data.forEach(cy => {
                if ((this.Date >= new Date(Date.parse(cy.FromDate))) && (this.Date <= new Date(Date.parse(cy.ToDate)))) {
                  if (cy.ShortYear === x.CurYear) {
                    this.cardExits = true;
                  } else { this.cardExits = false; }
                }
              });
            }
          } else {
            this.StackNo = this.StackNo;
            this.newEntry = false;
          }
        });
      }
    }
  }

  checkDate(value) {
    const date = new Date(value);
    this.nonEditable = false;
    const selectedDate = date.getDate();
    const selectedMonth = date.getMonth() + 1;
    if (selectedDate === 1 && selectedMonth === 4) {
      this.allowInput = false;
      this.Bags = 0;
      this.Weights = 0;
      this.flag = false;
    } else {
      this.allowInput = true;
      this.Bags = 0;
      this.Weights = 0;
    }
  }

  keyPress(event) {
    if ((event.keyCode >= 32 && event.keyCode <= 46) || (event.keyCode >= 58 && event.keyCode <= 64) || (event.keyCode >= 91 && event.keyCode <= 96) || (event.keyCode >= 123 && event.keyCode <= 127)) {
      return false;
    }
    else if (event.target.value.length == 0 && event.keyCode == 47) {
      return false;
    }
    else if ((event.target.value.length >= 1) && event.keyCode == 47) {
      let index = this.Location.indexOf('/');
      if (index < 0) {
        this.isSlash = false;
      }
      if (event.keyCode == 47 && !this.isSlash) {
        this.isSlash = true;
        return true;
      }
      else { return false; }
    }
    else {
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
          });
          this.godownOptions = godownSelection;
          this.godownOptions.unshift({ 'label': '-select-', 'value': null, disabled: true });
        }
        break;
      case 'cy':
        this.messageService.clear();
        if (this.CurrYear !== undefined && this.CurrYear !== null) {
          this.onView();
        } else {
          this.openView = false;
        }
        break;
      case 'cd':
        this.commodityOptions = this.CommodityLabel;
    }
  }

  onRowSelect(event, data) {
    this.selectedRow = data;
    this.ClosingDate = null;
    this.CDate = null;
    if (this.selectedRow !== undefined) {
      this.activateLoader = true;
      if (this.selectedRow.Flag1 === 'R') {
        this.nonEditable = true;
        this.flag = true;
        // this.disableCDate = false;
        this.RowId = this.selectedRow.RowId;
        this.commodityOptions = [{ label: data.CommodityName, value: data.CommodityCode }];
        this.ICode = data.CommodityName;
        this.Date = new Date(this.selectedRow.StackDate);
        this.StackNo = this.selectedRow.StackNo.trim().toUpperCase();
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
        this.CurrYear = data.CurYear;
        this.CommodityCode = data.CommodityCode;
        const params = {
          'GCode': this.GCode,
          'StackDate': this.datepipe.transform(this.Date, 'MM/dd/yyyy'),
          'ICode': this.CommodityCode,
          'StackYear': this.CurrYear,
          'TStockNo': this.StackNo,
          'Type': 4
        };
        this.restAPIService.post(PathConstants.STACK_BALANCE, params).subscribe(res => {
          if (res) {
            if (res.length === 1 && res[0].AckDate === 'Total') {
              this.activateLoader = false;
              this.ClosingDate = null;
              this.CDate = null;
            } else {
              res.forEach(x => {
                if (x.StackNo.trim() === this.StackNo) {
                  this.ClosingDate = this.datepipe.transform(x.SDate, 'dd/MM/yyyy');
                  this.CDate = this.datepipe.transform(x.SDate, 'MM/dd/yyyy');
                  // setTimeout(function(){
                  this.activateLoader = false;
                  // },500);
                }
              });
            }
          }
        });
      } else if (this.selectedRow.Flag1 === 'C') {
        this.nonEditable = true;
        this.RowId = this.selectedRow.RowId;
        this.Date = new Date(this.selectedRow.StackDate);
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
        this.ClosingDate = (this.selectedRow.clstackdate !== undefined && this.selectedRow.clstackdate !== null) ? this.selectedRow.clstackdate : null;
        this.CDate = (this.selectedRow.closingStackDate !== undefined && this.selectedRow.closingStackDate !== null)
          ? this.datepipe.transform(this.selectedRow.closingStackDate, 'MM/dd/yyyy') : null;
        //   this.disableCDate = (this.selectedRow.clstackdate !== undefined && this.selectedRow.clstackdate !== null) ? true : false;
        this.activateLoader = false;
        this.flag = (this.selectedRow.clstackdate !== undefined && this.selectedRow.clstackdate !== null) ? false : true;
      } else {
        this.onClear();
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING,
          life: 5000, detail: StatusMessage.StackCardClosedMessage
        });
      }
    }
  }

  onView() {
    if (this.CurrYear !== undefined && this.CurrYear !== null && this.GCode !== null
      && this.GCode !== undefined) {
      this.loading = true;
      this.stackOpeningData.length = 0;
      const params = new HttpParams().set('ICode', this.ICode).append('GCode', this.GCode).append('CurYear', this.CurrYear);
      this.restAPIService.getByParameters(PathConstants.STACK_OPENING_ENTRY_REPORT_GET, params).subscribe((res: any) => {
        if (res.Table !== undefined && res.Table !== null && res.Table.length !== 0) {
          this.openView = true;
          this.stackOpeningCols = this.tableConstants.StackCardOpeningEntryReport;
          this.loading = false;
          let sno = 0;
          res.Table.forEach(i => {
            sno += 1;
            this.stackOpeningData.push({
              SlNo: sno,
              RowId: i.RowId,
              ObStackDate: this.datepipe.transform(i.ObStackDate, 'dd-MM-yyyy'),
              StackDate: i.ObStackDate,
              clstackdate: this.datepipe.transform(i.clstackdate, 'dd-MM-yyyy'),
              closingStackDate: i.clstackdate,
              CommodityName: i.CommodityName,
              CommodityCode: i.CommodityCode,
              StackNo: i.StackNo,
              StackBalanceBags: i.StackBalanceBags,
              StackBalanceWeight: i.StackBalanceWeight,
              CurYear: i.CurYear,
              Flag1: i.Flag1
            })
          });
          this.totalRecords = this.stackOpeningData.length;
          this.Opening_Balance = this.stackOpeningData.slice(0);
        } else {
          this.loading = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
            summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage
          });
        }
      }, (err: HttpErrorResponse) => {
        this.loading = false;
        if (err.status === 0 || err.status === 400) {
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
            summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
          });
        } else {
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
            summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.NetworkErrorMessage
          });
        }
      });
    }
  }

  onClear() {
    this.nonEditable = false; this.openView = false;
    this.Location = null; this.Formation = null; this.StackNo = null;
    this.Bags = 0; this.Weights = 0; this.CurrYear = null;
    this.newEntry = false; this.cardExits = false;
    this.blockScreen = false; this.loading = false;
    this.flag = false; this.CDate = null;
    this.Date = this.maxDate; this.ClosingDate = null;
    this.ngForm.form.controls.LocNo.reset();
    this.ngForm.form.controls.FormationNo.reset();
    this.showDialog = false;
    this.activateLoader = false;
    this.CommodityCode = null;
    this.commodityOptions = undefined;
    this.ICode = null;
  }

  onSave() {
    this.messageService.clear();
    this.blockScreen = true;
    if (this.newEntry) {
      this.stackOpeningData.forEach(x => {
        if (x.StackNo.toString().trim() === this.StackNo) {
          this.onClear();
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR,
            life: 5000, detail: StatusMessage.RunningStackCardErrMessage
          });
        }
      });
    } else if (this.cardExits) {
      this.messageService.clear();
      this.messageService.add({
        key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING,
        life: 5000, detail: StatusMessage.StackCardClosedMessage
      });
      this.onClear();
    } else {
      this.postData();
    }
  }

  postData() {
    if (!this.nonEditable) {
      const params = {
        'GodownCode': this.GCode,
        'CommodityCode': this.ICode,
        'ObStackDate': this.datepipe.transform(this.Date, 'MM/dd/yyyy'),
        'CurrYear': this.CurrYear,
        'Location': this.Location,
        'Formation': this.Formation,
        'StackNo': this.StackNo,
        'Bags': this.Bags,
        'Weights': this.Weights,
        'RegionCode': this.RCode,
        'clstackdate': new Date()
      };
      this.restAPIService.post(PathConstants.STACK_OPENING_ENTRY_REPORT_POST, params).subscribe(res => {
        if (res.Item1) {
          this.blockScreen = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR,
            life: 5000, detail: StatusMessage.ExistingStackCardErrMessage
          });
        } else if (res.Item2) {
          this.onView();
          this.blockScreen = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS,
            summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.SuccessMessage
          });
        } else {
          this.blockScreen = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
            summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
          });
        }
      }, (err: HttpErrorResponse) => {
        this.blockScreen = false;
        if (err.status === 0 || err.status === 400) {
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
            summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
          });
        } else {
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
            summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.NetworkErrorMessage
          });
        }
      });
      this.onClear();
    } else {
      this.showDialog = true;
    }
  }

  saveClosingDate() {
    if (this.ClosingDate < this.Date) {
      this.blockScreen = false;
      this.messageService.clear();
      this.messageService.add({
        key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING,
        life: 5000, detail: StatusMessage.StackCardClosingDateErrMessage
      });
    } else {
      const closingParams = {
        'ClosedDate': (this.CDate !== null && this.CDate !== undefined) ?
          this.CDate : this.datepipe.transform(this.ClosingDate, 'MM/dd/yyyy'),
        'RowId': this.RowId
      };
      this.restAPIService.put(PathConstants.STACK_OPENING_ENTRY_REPORT_PUT, closingParams).subscribe(res => {
        if (res) {
          this.onView();
          this.onClear();
          this.nonEditable = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS,
            life: 5000, detail: StatusMessage.StackCardClosedSucceesMessage
          });
        } else {
          this.blockScreen = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
            summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
          });
        }
      }, (err: HttpErrorResponse) => {
        this.blockScreen = false;
        if (err.status === 0 || err.status === 400) {
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
            summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
          });
        } else {
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
            summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.NetworkErrorMessage
          });
        }
      });
    }
  }

  onClose() {
    this.messageService.clear('t-err');
  }
}