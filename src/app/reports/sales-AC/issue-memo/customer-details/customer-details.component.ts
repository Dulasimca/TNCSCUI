import { Component, OnInit, ViewChild } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { SelectItem, MessageService } from 'primeng/api';
import { StatusMessage } from 'src/app/constants/Messages';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Dropdown } from 'primeng/primeng';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { GolbalVariable } from 'src/app/common/globalvariable';
import { saveAs } from 'file-saver';
import * as Rx from 'rxjs';
import * as _ from 'lodash';


@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {
  IssueMemoCustomerDetailsCols: any;
  IssueMemoCustomerDetailsData: any = [];
  AbstractData: any;
  AbstractCols: any;
  canShowMenu: boolean;
  godownOptions: SelectItem[];
  shopNameOptions: SelectItem[];
  receiverOptions: SelectItem[];
  regionOptions: SelectItem[];
  societyOptions: SelectItem[];
  isAbstract: boolean = true;
  Society: any;
  ReceivorType: any;
  Shop: any;
  RCode: any;
  GCode: any;
  data: any;
  fromDate: any = new Date();
  toDate: any = new Date();
  deliveryReceiptRegCols: any;
  maxDate: Date;
  roleId: any;
  username: any;
  loggedInRCode: any;
  regions: any;
  loading: boolean;
  items: any[];
  disableSociety: boolean = true;
  @ViewChild('godown') godownPanel: Dropdown;
  @ViewChild('region') regionPanel: Dropdown;
  @ViewChild('shop') shopPanel: Dropdown;
  @ViewChild('society') societyPanel: Dropdown;
  @ViewChild('receivor') receiverPanel: Dropdown;


  constructor(private tableConstants: TableConstants, private datePipe: DatePipe, private messageService: MessageService,
    private authService: AuthService, private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.regions = this.roleBasedService.getRegions();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.maxDate = new Date();
    this.username = JSON.parse(this.authService.getCredentials());
    this.items = [
      {
        label: 'View', command: () => {
          this.onView();
        }
      },
        {
        label: 'Abstract', command: () => {
          this.onAbstract();
        }
      }]
  }

  onSelect(item, type) {
    let regionSelection = [];
    let godownSelection = [];
    let shopSelection = [];
    let receiverSelection = [];
    let societySelection = [];
    switch (item) {
      case 'reg':
        this.regions = this.roleBasedService.regionsData;
        if (type === 'enter') {
          this.regionPanel.overlayVisible = true;
        }
        if (this.roleId === 1) {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              regionSelection.push({ label: x.RName, value: x.RCode });
            });
            this.regionOptions = regionSelection;
          }
        } else {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              if (x.RCode === this.loggedInRCode) {
                regionSelection.push({ label: x.RName, value: x.RCode });
              }
            });
            this.regionOptions = regionSelection;
          }
        }
        break;
      case 'gd':
          if (type === 'enter') {
            this.godownPanel.overlayVisible = true;
          }
          if (this.data !== undefined) {
            this.data.forEach(x => {
              if (x.RCode === this.RCode.value) {
                godownSelection.push({ 'label': x.GName, 'value': x.GCode });
              } else {
            this.godownOptions = godownSelection;
              }
            });
            this.godownOptions = godownSelection;
          }
        break;
      case 'sh':
        if (type === 'enter') {
          this.shopPanel.overlayVisible = true;
        }
        const shop_params = {
          'GCode': this.GCode.value,
          'ReceivorType': this.ReceivorType.value,
          'SocietyCode': (this.Society !== undefined && this.Society !== null && this.Society.value !== undefined) ? this.Society.value : '0',
          'Type': 2
        };
          this.restAPIService.post(PathConstants.SOCIETY_MASTER_POST, shop_params).subscribe(shops => {
            shops.forEach(value => {
                shopSelection.push({ label: value.Issuername, value: value.IssuerCode });
            });
            this.shopNameOptions = shopSelection;
            this.shopNameOptions.unshift({ label: 'All', value: 'All'});
          });
        break;
      case 'r':
        if (type === 'enter') {
          this.receiverPanel.overlayVisible = true;
        }
        if(this.receiverOptions === undefined) {
        const params = new HttpParams().set('TRCode', 'All');
        this.restAPIService.getByParameters(PathConstants.DEPOSITOR_TYPE_MASTER, params).subscribe(res => {
          res.forEach(s => {
            receiverSelection.push({ label: s.Tyname, value: s.Tycode });
          });
          this.receiverOptions = receiverSelection;
        });
      }
        break;
      case 's':
        if (type === 'enter') {
          this.societyPanel.overlayVisible = true;
        }
          const params = {
            'GCode': this.GCode.value,
            'ReceivorType': this.ReceivorType.value,
            'Type': 1
          };
          this.restAPIService.post(PathConstants.SOCIETY_MASTER_POST, params).subscribe(res => {
           res.forEach(value => {
             societySelection.push({ label: value.SocietyName,  value: value.SocietyCode });
           })
            this.societyOptions = societySelection;
          });
        break;
    }
  }

  onView() {
    const params = {
      'GCode': this.GCode.value,
      'RCode': this.RCode.value,
      'SCode': (this.Society !== undefined && this.Society !== null && this.Society.value !== undefined) ?
      this.Society.value : '0',
      'ShopCode': this.Shop.value,
      'ReceivorType': this.ReceivorType.value,
      'Fdate': this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'),
      'Tdate': this.datePipe.transform(this.toDate, 'MM/dd/yyyy'),
      'GName': this.GCode.label,
      'RName': this.RCode.label,
      'UserName': this.username.user,
      'Type': 1
    };
    this.onResetTable('');
    this.restAPIService.post(PathConstants.ISSUE_MEMO_CUTOMER_DETAILS_POST, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.isAbstract = false;
        this.IssueMemoCustomerDetailsCols = this.tableConstants.IssueMemoCustomerDetail;
        this.loading = false;
        this.IssueMemoCustomerDetailsData = res;
        let sno = 0;
        let TotalQuantity = 0;
          ///Sorting Array
          let sortedArray = _.sortBy(this.IssueMemoCustomerDetailsData, 'Date', 'Coop');
          this.IssueMemoCustomerDetailsData = sortedArray;
          ///End
        this.IssueMemoCustomerDetailsData.forEach(data => {
          data.Date = this.datePipe.transform(data.Date, 'dd/MM/yyyy');
          sno += 1;
          data.SlNo = sno;
          TotalQuantity += (data.Quantity !== undefined && data.Quantity !== null) ? (data.Quantity * 1) : 0;
        });

        ///Grand total display
        this.IssueMemoCustomerDetailsData.push(
          {
            Quantity: TotalQuantity.toFixed(3),
            Ackno: 'Grand Total'
          }
        );
        ///End

           ///Grouping Array based on 'Commodity' & sum
           let groupedData;
           Rx.Observable.from(this.IssueMemoCustomerDetailsData)
             .groupBy((x: any) => x.Coop) // using groupBy from Rxjs
             .flatMap(group => group.toArray())// GroupBy dont create a array object so you have to flat it
             .map(g => {// mapping 
               return {
                Coop: g[0].Coop,//take the first name because we grouped them by name
                 Quantity: _.sumBy(g, 'Quantity') // using lodash to sum quantity
               }
             })
             .toArray() //.toArray because I guess you want to loop on it with ngFor      
             .do(sum => sum) // just for debug
             .subscribe(d => { groupedData = d; console.log('data', groupedData); });
           ///End
   
           ///Inserting total in an array
           let index = 0;
           let item;
           for (let i = 0; i < this.IssueMemoCustomerDetailsData.length; i++) {
             if (this.IssueMemoCustomerDetailsData[i].Coop !== groupedData[index].Coop && groupedData[index].Coop !== undefined) {
               item = {
                Ackno: 'TOTAL',
                 Quantity: (groupedData[index].Quantity * 1).toFixed(3),
               };
               this.IssueMemoCustomerDetailsData.splice(i, 0, item);
               index += 1;
             }
           }
           ///End 
        } else {
          this.loading = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
            summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination
          });
        }
    },(err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }

  onAbstract() {
    const params = {
      'GCode': this.GCode.value,
      'SCode': (this.Society !== undefined && this.Society !== null && this.Society.value !== undefined) ?
      this.Society.value : '0',
      'ReceivorType': this.ReceivorType.value,
      'ShopCode': this.Shop.value,
      'Fdate': this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'),
      'Tdate': this.datePipe.transform(this.toDate, 'MM/dd/yyyy'),
      'GName': this.GCode.label,
      'RName': this.RCode.label,
      'UserName': this.username.user,
      'Type': 2
    };
    this.onResetTable('');
    this.restAPIService.post(PathConstants.ISSUE_MEMO_CUTOMER_DETAILS_POST, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.IssueMemoCustomerDetailsCols = this.tableConstants.IssueMemoAbstract;
        this.loading = false;
        this.IssueMemoCustomerDetailsData = res;
        this.isAbstract = true;
        let sno = 0;
        this.IssueMemoCustomerDetailsData.forEach(data => {
          data.Date = this.datePipe.transform(data.Date, 'dd/MM/yyyy');
          sno += 1;
          data.SlNo = sno;
        });
        } else {
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
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
            summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
          });
        }
    });
  }

  onResetTable(item) {
    if(item === 'reg') { this.GCode = null; }
    else if(item === 'rec') { 
      this.Shop = null;
      this.Society = null;
      if(this.ReceivorType !== undefined && this.ReceivorType.value !== undefined) {
        if(this.ReceivorType.value === 'TY002' || this.ReceivorType.value === 'TY003' || this.ReceivorType.value === 'TY004') {
        this.disableSociety = false;
        } else { this.disableSociety = true; }
      }
     }
    else if(item === 'soc') { this.Shop = null; }
    this.IssueMemoCustomerDetailsData = [];
  }

  onDateSelect() {
    this.checkValidDateSelection();
    this.onResetTable('');
  }

  checkValidDateSelection() {
    if (this.fromDate !== undefined && this.toDate !== undefined && this.fromDate !== '' && this.toDate !== '') {
      let selectedFromDate = this.fromDate.getDate();
      let selectedToDate = this.toDate.getDate();
      let selectedFromMonth = this.fromDate.getMonth();
      let selectedToMonth = this.toDate.getMonth();
      let selectedFromYear = this.fromDate.getFullYear();
      let selectedToYear = this.toDate.getFullYear();
      if ((selectedFromDate > selectedToDate && ((selectedFromMonth >= selectedToMonth && selectedFromYear >= selectedToYear) ||
        (selectedFromMonth === selectedToMonth && selectedFromYear === selectedToYear))) ||
        (selectedFromMonth > selectedToMonth && selectedFromYear === selectedToYear) || (selectedFromYear > selectedToYear)) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_INVALID, detail: StatusMessage.ValidDateErrorMessage });
        this.fromDate = this.toDate = '';
      }
      return this.fromDate, this.toDate;
    }
  }

  onPrint() {
    const path = "../../assets/Reports/" + this.username.user + "/";
    if (this.isAbstract === true) {
      const filename1 = this.GCode.value + GolbalVariable.SalesIssueMemoAbstractFileName + ".txt";
      saveAs(path + filename1, filename1);
    } else {
      const filename2 = this.GCode.value + GolbalVariable.SalesIssueMemoFileName + ".txt";
      saveAs(path + filename2, filename2);

    }
  }

  exportAsPDF() {
    var doc = new jsPDF('p', 'pt', 'a4');
    doc.text("Tamil Nadu Civil Supplies Corporation - Head Office", 100, 30);
    if (this.IssueMemoCustomerDetailsData || this.AbstractData) {
      if (this.AbstractData) {
        var col = this.AbstractCols;
        var rows = [];
        this.AbstractData.forEach(element => {
          var temp = [element.SlNo, element.society, element.Commodity, element.Quantity];
          rows.push(temp);
        });
        doc.autoTable(col, rows);
        doc.save('Issue_Memo_Abstract.pdf');
      } else if (this.IssueMemoCustomerDetailsData) {
        var col = this.IssueMemoCustomerDetailsCols;
        var rows = [];
        this.IssueMemoCustomerDetailsData.forEach(element => {
          var temp = [element.SlNo, element.Ackno, element.Date, element.tyname, element.Coop, element.Scheme, element.Commodity, element.Quantity, element.Society, element.Rate, element.value];
          rows.push(temp);
        });
        doc.autoTable(col, rows);
        doc.save('Issue_Memo_Customer_Details_Data.pdf');
      }
    }
  }
}

