import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { StatusMessage } from 'src/app/constants/Messages';
import { Dropdown, ConfirmationService } from 'primeng/primeng';

@Component({
  selector: 'app-stack-card-opening',
  templateUrl: './stack-card-opening.component.html',
  styleUrls: ['./stack-card-opening.component.css']
})
export class StackCardOpeningComponent implements OnInit {
  StackCardOpeningCols: any;
  StackCardOpeningData: any = [];
  data: any;
  GCode: any;
  ITCode: any;
  RCode: any;
  Year: any;
  Status: any;
  regions: any;
  roleId: any;
  regionOptions: SelectItem[];
  godownOptions: SelectItem[];
  YearOptions: SelectItem[];
  commodityOptions: SelectItem[];
  statusOptions: SelectItem[];
  canShowMenu: boolean;
  maxDate: Date;
  loggedInRCode: any;
  loading: boolean;
  @ViewChild('region', { static: false }) RegionPanel: Dropdown;
  @ViewChild('godown', { static: false }) GodownPanel: Dropdown;
  @ViewChild('commodity', { static: false }) CommodityPanel: Dropdown;
  @ViewChild('stackYear', { static: false }) StackYearPanel: Dropdown;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private messageService: MessageService, private authService: AuthService, 
    private restAPIService: RestAPIService, private roleBasedService: RoleBasedService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.regions = this.roleBasedService.getRegions();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.StackCardOpeningCols = this.tableConstants.StackCardOpening;
    this.data = this.roleBasedService.getInstance();
    this.maxDate = new Date();
  }

  onSelect(item, type) {
    let godownSelection = [];
    let YearSelection = [];
    let regionSelection = [];
    let commoditySelection = [];
    switch (item) {
      case 'reg':
          this.regions = this.roleBasedService.regionsData;
          if (type === 'enter') {
            this.RegionPanel.overlayVisible = true;
          }
          if (this.roleId === 1) {
            if (this.regions !== undefined) {
              this.regions.forEach(x => {
                regionSelection.push({ 'label': x.RName, 'value': x.RCode });
              });
              this.regionOptions = regionSelection;
            }
          } else {
            if (this.regions !== undefined) {
              this.regions.forEach(x => {
                if(x.RCode === this.loggedInRCode) {
                regionSelection.push({ 'label': x.RName, 'value': x.RCode });
                }
              });
              this.regionOptions = regionSelection;
            }
          }
        break;
      case 'gd':
        if (type === 'enter') {
          this.GodownPanel.overlayVisible = true;
        }
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode, 'rcode': x.RCode, 'rname': x.RName });
            }
          });
          this.godownOptions = godownSelection;
        }
        break;
      case 'y':
        if (type === 'enter') {
          this.StackYearPanel.overlayVisible = true;
        }
        if (this.YearOptions === undefined) {
          this.restAPIService.get(PathConstants.STACK_YEAR).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                YearSelection.push({ 'label': y.ShortYear });
              });
              this.YearOptions = YearSelection;
            }
          })
        }
        break;
      case 'cd':
        if (type === 'enter') {
          this.CommodityPanel.overlayVisible = true;
        }
        if (this.commodityOptions === undefined) {
          this.restAPIService.get(PathConstants.ITEM_MASTER).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                commoditySelection.push({ 'label': y.ITDescription, 'value': y.ITCode });
              });
              this.commodityOptions = commoditySelection;
              this.commodityOptions.unshift({ label: 'All', value: 'All' });
            } else {
              this.commodityOptions = commoditySelection;
            }
          });
        }
        break;
    }
  }

  onStatus() {
    let StatusSelection = [];
    if (this.statusOptions === undefined) {
      this.statusOptions = StatusSelection;
    }
    this.statusOptions.unshift({ 'label': 'R', 'value': this.statusOptions }, { 'label': 'C', 'value': this.statusOptions });
    this.StackCardOpeningData;
  }


  onView() {
    this.onResetTable('');
    this.loading = true;
    const params = {
      'GCode': this.GCode,
      'StackDate': this.Year.label,
      'ICode': this.ITCode,
      'Type': 2
    };
    this.restAPIService.post(PathConstants.STACK_BALANCE, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.StackCardOpeningData = res.filter((value: { Status: any; }) => { return value.Status === this.Status.label });
        this.loading = false;
        let sno = 0;
        this.StackCardOpeningData.forEach(data => {
          data.Date = this.datePipe.transform(data.Date, 'dd-MM-yyyy');
          data.Truckmemodate = this.datePipe.transform(data.Truckmemodate, 'dd-MM-yyyy');
          data.Quantity = (data.Quantity * 1).toFixed(3);
          sno += 1;
          data.SlNo = sno;
        });
        // if (this.statusOptions !== undefined) {
        // }
      } else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }

  deleteSelectedRow(index, selectedRow) {
    let rowId = selectedRow.Sno;
    const status = selectedRow.Status.trim();
    let stackNo = selectedRow.Stackno.trim();
    if(status !== 'C') {
    const statusOfCard =  stackNo + ' is Running Card! ';
     const httpParams = new HttpParams().set('GCode', this.GCode).append('RowId', rowId);
     let options = { params: httpParams};
    this.confirmationService.confirm({
      message: statusOfCard + ' Are you sure that you want to delete the record?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.restAPIService.delete(PathConstants.STACK_CARD_OPENING_REPORT_DELETE, options).subscribe(res => {
          if(res) {
            this.StackCardOpeningData.splice(index, 1);
            let sno = 0;
            this.StackCardOpeningData.forEach(data => {
              sno += 1;
              data.SlNo = sno;
            });
            this.messageService.clear();
            this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.StackcardDeleted });
          }
        })
      },
      reject: () => {  }
    });
  }
  }

  onResetTable(item) {
    if (item === 'reg') { this.GCode = null; }
    this.StackCardOpeningData = [];
  }

  onPrint() { }
}