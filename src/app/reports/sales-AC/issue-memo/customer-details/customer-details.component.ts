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
  filterArray: any;
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
    this.IssueMemoCustomerDetailsCols = this.tableConstants.IssueMemoCustomerDetail;
    this.items = [
      {
        label: 'View', icon: 'fa fa-table', command: () => {
          this.onView();
        }
      },
        {
        label: 'Abstract', icon: "fa fa-file-pdf-o", command: () => {
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
              godownSelection.push({ label: x.GName, value: x.GCode });
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
          'ReceviorType': this.ReceivorType.value,
          'SocietyCode': (this.Society !== undefined) ? this.Society.value : '0',
          'Type': 2
        };
          this.restAPIService.post(PathConstants.SOCIETY_MASTER_POST, shop_params).subscribe(shops => {
            shops.forEach(value => {
              if (value.TransType === 'I') {
                shopSelection.push({ label: value.TRName, value: value.TRCode });
              }
              this.shopNameOptions = shopSelection;
              this.shopNameOptions.unshift({ label: 'All', value: 'All '});
            });
          });
        break;
      case 'r':
        if (type === 'enter') {
          this.receiverPanel.overlayVisible = true;
        }
        const r_params = new HttpParams().set('TRCode', 'All');
        this.restAPIService.getByParameters(PathConstants.DEPOSITOR_TYPE_MASTER, r_params).subscribe(res => {
          res.forEach(s => {
            receiverSelection.push({ label: s.Tyname, value: s.Tycode });
          });
          this.receiverOptions = receiverSelection;
        });
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
      'SCode': this.Society.value,
      'TCode': this.ReceivorType.value,
      'Fdate': this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'),
      'Tdate': this.datePipe.transform(this.toDate, 'MM/dd/yyyy'),
      'GName': this.GCode.label,
      'RName': this.RCode.label,
      'UserName': this.username.user,
      'Type': 1
    };
    this.restAPIService.post(PathConstants.ISSUE_MEMO_CUTOMER_DETAILS_POST, params).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.filterArray = res;
        this.loading = false;
        this.IssueMemoCustomerDetailsData = res;
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
      } (err: HttpErrorResponse) => {
        if (err.status === 0 || err.status === 400) {
          this.loading = false;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
        }
      }
    });
  }

  onAbstract() {
    const params = {
      'GCode': this.GCode,
      'SCode': this.Society.value,
      'TCode': this.ReceivorType.value,
      'Fdate': this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'),
      'Tdate': this.datePipe.transform(this.toDate, 'MM/dd/yyyy'),
      'GName': this.GCode.label,
      'RName': this.RCode.label,
      'UserName': this.username.user,
      'Type': 2
    };
    this.restAPIService.post(PathConstants.ISSUE_MEMO_CUTOMER_DETAILS_POST, params).subscribe(res => {
      if (res !== undefined && res.length !== 0 && res !== null) {
        this.IssueMemoCustomerDetailsCols = this.tableConstants.IssueMemoAbstract;
        this.loading = false;
        this.IssueMemoCustomerDetailsData = res;
        this.filterArray = [];
        // this.filterArray = res;
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
      } (err: HttpErrorResponse) => {
        if (err.status === 0 || err.status === 400) {
          this.loading = false;
          this.messageService.clear();
          this.messageService.add({
            key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
            summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
          });
        }
      }
    });
  }

  onResetTable(item) {
    if(item === 'reg') { this.GCode = null; }
    else if(item === 'rec') { this.Shop = null; this.Society = null; }
    this.IssueMemoCustomerDetailsData.length = 0;
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

  // onPrint() {
  //   if (this.filterArray) {
  //     const path = "../../assets/Reports/" + this.username.user + "/";
  //     const filename = this.GCode + GolbalVariable.SalesIssueMemoFileName + ".txt";
  //     saveAs(path + filename, filename);
  //   } else {
  //     const path = "../../assets/Reports/" + this.username.user + "/";
  //     const filename = this.GCode + GolbalVariable.SalesIssueMemoAbstractFileName + ".txt";
  //     saveAs(path + filename, filename);
  //   }
  // }

  onPrint() {
    const path = "../../assets/Reports/" + this.username.user + "/";
    if (this.filterArray === undefined) {
      const filename1 = this.GCode + GolbalVariable.SalesIssueMemoAbstractFileName + ".txt";
      saveAs(path + filename1, filename1);
    } else {
      const filename2 = this.GCode + GolbalVariable.SalesIssueMemoFileName + ".txt";
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

