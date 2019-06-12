import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { SelectItem } from 'primeng/api';
import { HttpParams } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';

@Component({
  selector: 'app-stock-receipt-register',
  templateUrl: './stock-receipt-register.component.html',
  styleUrls: ['./stock-receipt-register.component.css']
})
export class StockReceiptRegisterComponent implements OnInit {
  stockReceiptRegCols: any;
  stockReceiptRegData: any;
  fromDate: Date;
  toDate: Date;
  godownOptions: SelectItem[];
  godownName: string;
  g_cd = '548';
  data: any;
  isViewDisabled: boolean;
  isActionDisabled: boolean;
  maxDate: Date;
  canShowMenu: boolean;
  
  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,private authService: AuthService,
    private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.isViewDisabled = this.isActionDisabled = true;
    this.stockReceiptRegCols = this.tableConstants.StockReceiptRegisterReport;
    this.data = this.roleBasedService.getInstance();
    this.maxDate = new Date;
  }

  onSelect() {
    let options = [];
    if (this.fromDate !== undefined && this.toDate !== undefined
    && this.g_cd !== '' && this.g_cd !== undefined) {
    this.isViewDisabled = false;
    }
    this.data.forEach(x => {
      options.push({'label': x.GName, 'value': x.GCode});
      this.godownOptions = options;
    });
  }

  onView() {
    this.checkValidDateSelection();
    const params = new HttpParams().set('Fdate', this.datePipe.transform(this.fromDate,'MM-dd-yyyy')).append('ToDate', this.datePipe.transform(this.toDate,'MM-dd-yyyy')).append('GCode', this.g_cd);
    this.restAPIService.getByParameters(PathConstants.STOCK_RECEIPT_REGISTER_REPORT, params).subscribe(res => {
      this.stockReceiptRegData = res;
      if(res !== undefined) {
        this.isActionDisabled = false;
      }
      console.log('res', res);
    })
  }

  onDateSelect() {
   this.checkValidDateSelection();
  }

  checkValidDateSelection() {
    if (this.fromDate !== undefined && this.toDate !== undefined) {
    let selectedFromMonth = this.fromDate.getMonth();
    let selectedToMonth = this.toDate.getMonth();
    let selectedFromYear = this.fromDate.getFullYear();
    let selectedToYear = this.toDate.getFullYear();
    if (selectedFromMonth !== selectedToMonth || selectedFromYear !== selectedToYear) {
      this.fromDate = null;
      this.toDate = null;
    }
  }
  }

}
