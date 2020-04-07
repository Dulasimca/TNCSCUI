import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Dropdown, MessageService } from 'primeng/primeng';
import { Table } from 'primeng/table';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { StatusMessage } from 'src/app/constants/Messages';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-stock-commodity',
  templateUrl: './stock-commodity.component.html',
  styleUrls: ['./stock-commodity.component.css']
})
export class StockCommodityComponent implements OnInit {
  canShowMenu: boolean;
  commodityOptions: SelectItem[];
  maxDate: Date = new Date();
  loading: boolean;
  FromDate: any = new Date();
  ToDate: any = new Date();
  username: any;
  stockCommodityData: any = [];
  stockCommodityCols: any;
  ITCode: any;
  roleId: any;
  IsGodownSelected: boolean = false;
  @ViewChild('commodity', { static: false }) commodityPanel: Dropdown;
  @ViewChild('dt', { static: false }) table: Table;

  constructor(private tableConstants: TableConstants, private restApiService: RestAPIService,
    private authService: AuthService, private datePipe: DatePipe, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.stockCommodityCols = this.tableConstants.StockCommodityReport.slice(0);
    this.username = JSON.parse(this.authService.getCredentials());
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    let commoditySelection = [];
    this.restApiService.get(PathConstants.ITEM_MASTER).subscribe(data => {
      if (data !== undefined) {
        data.forEach(y => {
          commoditySelection.push({ 'label': y.ITDescription, 'value': y.ITCode });
          this.commodityOptions = commoditySelection;
        });
      }
    })
  }

  onSelect(item, type) {
          if (type === 'enter') { 
            this.commodityPanel.overlayVisible = true; 
          }
  }

  onView() {
    this.onResetTable('');
    this.checkValidDateSelection();
    this.loading = true;
    const params = {
      'FromDate': this.datePipe.transform(this.FromDate, 'MM/dd/yyyy'),
      'ToDate': this.datePipe.transform(this.ToDate, 'MM/dd/yyyy'),
      'CommodityCode': this.ITCode.value,
      'CommodityName': this.ITCode.label,
      'UserName': this.username.user,
      'IsGodown': (this.IsGodownSelected) ? 'YES' : 'NO'
    }
    this.restApiService.post(PathConstants.STOCK_COMMODITY_REPORT, params).subscribe((res: any) => {
      if (res !== undefined && res.length !== 0) {
        this.stockCommodityData = res;
        let sno = 1;
        this.stockCommodityData.forEach(data => {
          data.SlNo = sno;
          data.OpeningBalance = (data.OpeningBalance * 1).toFixed(3);
          data.Receipt = (data.TotalReceipt * 1).toFixed(3);
          data.TotalReceipt = (((data.TotalReceipt * 1) + (data.OpeningBalance * 1)).toFixed(3));
          data.TotalIssue = ((data.IssueSales * 1) + (data.IssueOthers * 1)).toFixed(3);
          data.ClosingBalance = (data.ClosingBalance * 1).toFixed(3);
          data.CSBalance = (data.CSBalance * 1).toFixed(3);
          data.Shortage = (data.Shortage * 1).toFixed(3);
          data.PhycialBalance = (data.PhycialBalance * 1).toFixed(3);
          sno += 1;
        });
        this.loading = false;
      } else {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-error', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-error', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
    });
  }

  onDateSelect() {
    this.checkValidDateSelection();
    this.onResetTable('');
  }

  checkValidDateSelection() {
    if (this.FromDate !== undefined && this.ToDate !== undefined && this.FromDate !== '' && this.ToDate !== '') {
      let selectedFromDate = this.FromDate.getDate();
      let selectedToDate = this.ToDate.getDate();
      let selectedFromMonth = this.FromDate.getMonth();
      let selectedToMonth = this.ToDate.getMonth();
      let selectedFromYear = this.FromDate.getFullYear();
      let selectedToYear = this.ToDate.getFullYear();
      if ((selectedFromDate > selectedToDate && ((selectedFromMonth >= selectedToMonth && selectedFromYear >= selectedToYear) ||
        (selectedFromMonth === selectedToMonth && selectedFromYear === selectedToYear))) ||
        (selectedFromMonth > selectedToMonth && selectedFromYear === selectedToYear) || (selectedFromYear > selectedToYear)) {
        this.messageService.clear();
        this.messageService.add({ key: 't-error', severity: StatusMessage.SEVERITY_ERROR, life:5000
        ,summary: StatusMessage.SUMMARY_INVALID, detail: StatusMessage.ValidDateErrorMessage });
        this.FromDate = this.ToDate = '';
      }
      return this.FromDate, this.ToDate;
    }
  }
  
  onResetTable(item) {
    this.stockCommodityData = [];
    this.table.reset();
    this.loading = false;
  }

  onClose()
  {
    this.messageService.clear('t-err');
  }

}
