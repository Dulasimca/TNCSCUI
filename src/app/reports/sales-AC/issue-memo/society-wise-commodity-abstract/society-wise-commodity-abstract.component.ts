import { Component, OnInit } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { Router } from '@angular/router';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { StatusMessage } from 'src/app/constants/Messages';

@Component({
  selector: 'app-society-wise-commodity-abstract',
  templateUrl: './society-wise-commodity-abstract.component.html',
  styleUrls: ['./society-wise-commodity-abstract.component.css']
})
export class SocietyWiseCommodityAbstractComponent implements OnInit {
  canShowMenu: boolean;
  showCommodityAbstract: boolean = false;
  showCommodityBreakup: boolean = false;
  showSchemeCommodityBreakup: boolean = false;
  showSchemeAbstract: boolean = false;
  abstractOptions: SelectItem[];
  godownOptions: SelectItem[];
  a_cd: string;
  g_cd: any;
  data: any;
  fromDate: any;
  toDate: any;
  isActionDisabled: boolean;
  deliveryReceiptRegCols: any;
  maxDate: Date;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe, private messageService: MessageService,
    private authService: AuthService, private excelService: ExcelService, private router: Router,
    private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    this.isActionDisabled = true;
    this.deliveryReceiptRegCols = this.tableConstants.DeliveryMemoRegisterReport;
    this.maxDate = new Date();
  }

  onSelect(selectedItem) {
    let godownSelection = [];
    switch (selectedItem) {
      case 'customer':
        break;
      case 'godown':
        this.data = this.roleBasedService.instance;
        if (this.data !== undefined) {
          this.data.forEach(x => {
            godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            this.godownOptions = godownSelection;
          });
        }
        break;
      case 'abstract':
        this.abstractOptions = [{ 'label': 'Society Wise Commodity Breakup', 'value': 'society_c_a' },
        { 'label': 'Society Wise Date Wise Commodity Abstract', 'value': 'date_c_b' },
        { 'label': 'Society Wise Scheme Wise Commodity Breakup', 'value': 'scheme_c_b' },
        { 'label': 'Society Wise Scheme Wise Commodity Abstract', 'value': 'scheme_c_a' }];
        this.showPane();
        break;
    }
  }

  onResetTable() {
    this.isActionDisabled = true;
  }

  onDateSelect() {
    this.checkValidDateSelection();
    this.onResetTable();
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
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_INVALID, detail: StatusMessage.ValidDateErrorMessage });
        this.fromDate = this.toDate = '';
      }
      return this.fromDate, this.toDate;
    }
  }

  showPane() {
    switch (this.a_cd) {
      case 'society_c_a':
        this.showCommodityAbstract = true;
        this.showCommodityBreakup = false;
        this.showSchemeAbstract = false;
        this.showSchemeCommodityBreakup = false;
        break;
      case 'date_c_b':
        this.showCommodityAbstract = false;
        this.showCommodityBreakup = true;
        this.showSchemeAbstract = false;
        this.showSchemeCommodityBreakup = false;
        break;
      case 'scheme_c_b':
        this.showCommodityAbstract = false;
        this.showCommodityBreakup = false;
        this.showSchemeAbstract = false;
        this.showSchemeCommodityBreakup = true;
        break;
      case 'scheme_c_a':
        this.showCommodityAbstract = false;
        this.showCommodityBreakup = false;
        this.showSchemeAbstract = true;
        this.showSchemeCommodityBreakup = false;
        break;
    }

  }
}
