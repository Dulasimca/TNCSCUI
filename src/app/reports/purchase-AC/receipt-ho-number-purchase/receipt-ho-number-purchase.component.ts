import { Component, OnInit } from '@angular/core';
import { SelectItem, MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';

@Component({
  selector: 'app-receipt-ho-number-purchase',
  templateUrl: './receipt-ho-number-purchase.component.html',
  styleUrls: ['./receipt-ho-number-purchase.component.css']
})
export class ReceiptHONumberPurchaseComponent implements OnInit {
  receiptHOPurchaseCols: any;
  receiptHOPurchaseData: any;
  fromDate: any;
  toDate: any;
  isViewDisabled: any;
  isActionDisabled: any;
  data: any;
  g_cd: any;
  godownOptions: SelectItem[];
  canShowMenu: boolean;
  maxDate: Date;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe, private messageService: MessageService,
     private authService: AuthService, private excelService: ExcelService, 
    private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

    ngOnInit() {
      this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
      this.isViewDisabled = this.isActionDisabled = true;
      this.receiptHOPurchaseCols = this.tableConstants.CommodityReceiptReport;
      this.data = this.roleBasedService.getInstance();
      this.maxDate = new Date();
    }
  
    onSelect() {
      let godownSelection = [];
      if (this.data !== undefined) {
        this.data.forEach(x => {
            godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            this.godownOptions = godownSelection;
          });
        }
      if (this.fromDate !== undefined && this.toDate !== undefined
        && this.g_cd !== '' && this.g_cd !== undefined) {
        this.isViewDisabled = false;
      }
    }
  
    onView() {
      this.checkValidDateSelection();
      const params = { 
        
      }
      this.restAPIService.post('', params).subscribe(res => {
        this.receiptHOPurchaseData = res;
        if (res !== undefined && this.receiptHOPurchaseData.length !== 0) {
          this.isActionDisabled = false;
        } else {
          this.messageService.add({ key: 't-err', severity: 'warn', summary: 'Warning!', detail: 'No record for this combination' });
        }
      })
    }

    onDateSelect() {
      this.checkValidDateSelection();
      this.onResetTable();
      if (this.fromDate !== undefined && this.toDate !== undefined && this.g_cd !== '' && this.g_cd !== undefined) {
        this.isViewDisabled = false;
      }
    }

    checkValidDateSelection() {
      if (this.fromDate !== undefined && this.toDate !== undefined && this.fromDate !== '' && this.toDate !== '') {
        let selectedFromDate = this.fromDate.getDate();
        let selectedToDate = this.toDate.getDate();
        let selectedFromMonth = this.fromDate.getMonth();
        let selectedToMonth = this.toDate.getMonth();
        let selectedFromYear = this.fromDate.getFullYear();
        let selectedToYear = this.toDate.getFullYear();
        if (selectedFromMonth !== selectedToMonth || selectedFromYear !== selectedToYear) {
          this.messageService.add({ key: 't-err', severity: 'error', summary: 'Invalid Date', detail: 'Please select a date within a month' });
          this.fromDate = this.toDate = '';
        } else if (selectedFromDate >= selectedToDate) {
          this.messageService.add({ key: 't-err', severity: 'error', summary: 'Invalid Date', detail: 'Please select a valid date range' });
          this.fromDate = this.toDate = '';
        }
        return this.fromDate, this.toDate;
      }
    }
  
    onResetTable() {
      this.receiptHOPurchaseData = [];
      this.isActionDisabled = true;
    }
  
    exportAsXLSX(): void {
      this.excelService.exportAsExcelFile(this.receiptHOPurchaseData, 'RECEIPT-HO-PURCHASE', this.receiptHOPurchaseCols);
    }
  }
