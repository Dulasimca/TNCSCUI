import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { Dropdown } from 'primeng/primeng';
import * as _ from 'lodash';

@Component({
  selector: 'app-hoqtyabstract',
  templateUrl: './hoqtyabstract.component.html',
  styleUrls: ['./hoqtyabstract.component.css']
})
export class HoqtyabstractComponent implements OnInit {
  
  hoqtyacabstractData: any = [];
  fromDate: any = new Date();
  data: any;
  regions: any;
  RCode: any;
  GCode: any;
  qtymonth: any;
  qtyyear: any;
  ITCode: any;
  Trcode: any;
  regionOptions: SelectItem[];
  godownOptions: SelectItem[];
  commodityOptions: SelectItem[];
  transactionOptions: SelectItem[];
  truckName: string;
  canShowMenu: boolean;
  maxDate: Date;
  yearRange: string;
  loading: boolean;
  roleId: any;
  username: any;
  formUser = [];
  loggedInRCode: any;
  Openingbookbalance: any;
  PurchaseReceipt: any; 
  Freerice : any;
  OtherReceipt: any;
  TotalReceipt: any;  
  Openingbalancetotalreceipt: any;
  Issueonsales: any;
  Freeissue: any;
  Otherissue: any;
  Totalissue: any;
  ClosingBookBalance: any;
  CumulativeShortage: any;
  ActualBalance: any;
  RowId: any;
  Savebtn: boolean ;
  Viewbtn: boolean ;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;
  @ViewChild('region', { static: false }) regionPanel: Dropdown;
  @ViewChild('commodity', { static: false }) commodityPanel: Dropdown;
  @ViewChild('transaction', { static: false }) transactionPanel: Dropdown;


  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private messageService: MessageService, private authService: AuthService, private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.data = this.roleBasedService.getInstance();
    this.regions = this.roleBasedService.getRegions();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.maxDate = new Date();
    this.yearRange = (this.maxDate.getFullYear() - 1) + ':' + this.maxDate.getFullYear();    
    this.username = JSON.parse(this.authService.getCredentials());
    this.Openingbookbalance = 0;
    this.PurchaseReceipt = 0; 
    this.Freerice  = 0;
    this.OtherReceipt = 0;
    this.TotalReceipt = 0;  
    this.Openingbalancetotalreceipt = 0;
    this.Issueonsales = 0;
    this.Freeissue = 0;
    this.Otherissue = 0;
    this.Totalissue = 0;
    this.ClosingBookBalance = 0;
    this.CumulativeShortage = 0;
    this.ActualBalance = 0;
    this.RowId = 0;
    this.Savebtn =  false ;
    this.Viewbtn = true ;

  }

  onSelect(item, type) {
    let regionSelection = [];
    let godownSelection = [];
    let transactoinSelection = [];
    let commoditySelection = [];
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
      case 'gd':
        if (type === 'enter') { this.godownPanel.overlayVisible = true; }
        this.data = this.roleBasedService.instance;
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.RCode) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            }
          });
          this.godownOptions = godownSelection;
          if (this.roleId !== 3) {
            this.godownOptions.unshift({ label: 'All', value: 'All' });
          }
        } else {
          this.godownOptions = godownSelection;
        }
        break;
      case 'tr':
          if (type === 'tab') {
            this.transactionPanel.overlayVisible = true;
          }
          this.transactionOptions = [{ label: 'SCM', value: 'SCM' },{ label:'NON-SCM', value: 'NON-SCM' },           
          { label: 'DPC', value: 'DPC' }, { label:'CRS', value: 'CRS' },{ label: 'CS', value: 'CS' }];
        break;
      case 'cd':
        if (type === 'enter') { this.commodityPanel.overlayVisible = true; }
        if (this.commodityOptions === undefined) {
          this.restAPIService.get(PathConstants.ITEM_MASTER).subscribe(data => {
            if (data !== undefined) {
              data.forEach(y => {
                commoditySelection.push({ 'label': y.ITDescription, 'value': y.ITCode });
                this.commodityOptions = commoditySelection;
              });
              this.commodityOptions.unshift({ label: 'All', value: 'All' });
            }
          })
        }
        break;
    }
  }

  onView() {
    //this.onResetTable('');
    // this.checkValidDateSelection();
    this.loading = true;
    const params = {
      'qtyMonth': this.datePipe.transform(this.fromDate, 'MM'),
      'qtyYear': this.datePipe.transform(this.fromDate, 'yyyy'),
      'RCode': this.RCode,
      'ITCode': this.ITCode.value,
      'Trcode': this.Trcode.value,
      'UserName': this.username.user,
    }
    this.restAPIService.getByParameters(PathConstants.HO_QTY_ABSRTACT_GET, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.hoqtyacabstractData = res;
        this.Savebtn =  true ;
        this.Viewbtn = true ;
        //this.RowId = res[0].RowId;
        //this.OrderDate = new Date(res[0].OrderDate);
        this.Openingbookbalance = this.hoqtyacabstractData[0].OB;
        this.PurchaseReceipt = this.hoqtyacabstractData[0].PurchaseReceipt;
        this.Freerice = this.hoqtyacabstractData[0].FreeRice;
        this.OtherReceipt = this.hoqtyacabstractData[0].OtherReceipt;
        this.TotalReceipt = this.hoqtyacabstractData[0].TotalReceipt;
        this.Openingbalancetotalreceipt = this.hoqtyacabstractData[0].TotalReceipt + this.hoqtyacabstractData[0].OB;
        this.Issueonsales = this.hoqtyacabstractData[0].IssueOnSales;
        this.Freeissue = this.hoqtyacabstractData[0].FreeIssues;
        this.Otherissue = this.hoqtyacabstractData[0].OtherIssues;
        this.Totalissue = this.hoqtyacabstractData[0].Totalssues;
        this.ClosingBookBalance = this.hoqtyacabstractData[0].CB;
        this.CumulativeShortage = this.hoqtyacabstractData[0].CS;        
        this.ActualBalance = this.hoqtyacabstractData[0].ActualBalance;
        this.RowId = this.hoqtyacabstractData[0].HOQtyId;
        this.loading = false;
        
      } else {
        this.RowId = 0;
        this.Savebtn =  true ;
        this.Viewbtn = true ;
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
    })
  }
  onSubmit(formUser) {
    
    this.messageService.clear();
    const params = {     
      qtymonth : this.datePipe.transform(this.fromDate, 'MM'),
      qtyyear : this.datePipe.transform(this.fromDate, 'yyyy'),
      RCode : this.RCode,
      ITCode : this.ITCode.value,       
      Trcode : this.Trcode.value,
      OB : this.Openingbookbalance,
      PurchaseReceipt : this.PurchaseReceipt,
      Freerice : this.Freerice,
      OtherReceipt : this.OtherReceipt,
      TotalReceipt : this.TotalReceipt,
      Issueonsales : this.Issueonsales,
      Freeissue : this.Freeissue,
      Otherissue : this.Otherissue,
      TotalIssues : this.Totalissue,
      CB : this.ClosingBookBalance,
      CS : this.CumulativeShortage,
      ActualBalance : this.ActualBalance,
      HOQtyId : this.RowId,
    };
    this.restAPIService.post(PathConstants.HO_QTY_ABSTRACT_POST, params).subscribe(value => {
      if (value) {
        this.onClear();
        this.Savebtn=false
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS,
          summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.SuccessMessage
        });
      } else {        
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING, life: 5000,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.ValidCredentialsErrorMessage
        });
      }
    }, (err: HttpErrorResponse) => { 
      if (err.status === 0 || err.status === 400) {        
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
  }
  onDateSelect() {
    this.checkValidDateSelection();
   this.onResetTable('');
  }

   checkValidDateSelection() {
    if (this.fromDate !== undefined &&  this.fromDate !== '' ) {         
      
      let selectedFromYear = this.fromDate.getFullYear();
      let todaydate =   new Date();
      let curyear = todaydate.getFullYear();
     
     
      if ((selectedFromYear > curyear)) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, 
        summary: StatusMessage.SUMMARY_INVALID, 
        life:5000, detail: StatusMessage.ValidDateErrorMessage });
        
      }
      return this.fromDate
    }
  }  
  onClear() {
    this.PurchaseReceipt = this.Freerice = this.OtherReceipt  =  this.TotalReceipt = this.Openingbookbalance = this.Openingbalancetotalreceipt = 0;
    this.Issueonsales = this.Freeissue = this.Otherissue = this.Totalissue = this.ClosingBookBalance = this.ActualBalance  = this.CumulativeShortage = 0;
    this.Savebtn =  false ;
    this.Viewbtn = true ;
  }
  onResetTable(item) {    
    this.loading = false;
  }
  onClose() {
    this.messageService.clear('t-err');
  }
  onTOTREC() {
    this.TotalReceipt = (this.PurchaseReceipt * 1) + (this.Freerice * 1) + (this.OtherReceipt * 1);  
    this.Openingbalancetotalreceipt = (this.Openingbookbalance * 1) + (this.TotalReceipt * 1)
    this.Totalissue = (this.Issueonsales * 1) + (this.Freeissue * 1) + (this.Otherissue * 1);  
    this.ClosingBookBalance = (this.Openingbalancetotalreceipt * 1) - (this.Totalissue * 1);
    this.ActualBalance = (this.ClosingBookBalance * 1) - (this.CumulativeShortage * 1) ;
    
   }
}
