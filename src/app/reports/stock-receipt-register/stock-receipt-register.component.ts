import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { SelectItem } from 'primeng/api';
import { HttpParams } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-stock-receipt-register',
  templateUrl: './stock-receipt-register.component.html',
  styleUrls: ['./stock-receipt-register.component.css']
})
export class StockReceiptRegisterComponent implements OnInit {
  stockReceiptRegCols: any;
  stockReceiptRegData: any;
  fromDate: any;
  toDate: any;
  godownOptions: SelectItem[];
  godownName: string;
  g_cd = '548';
  data: any;
  isViewDisabled: boolean;
  isActionDisabled: boolean;
  
  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,
    private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.isViewDisabled = this.isActionDisabled = true;
    this.stockReceiptRegCols = this.tableConstants.StockReceiptRegisterReport;
    this.data = this.roleBasedService.getInstance();
   
    console.log('data', this.data);
  }

  onSelect() {
    let options = [];
    if (this.fromDate !== undefined && this.fromDate !== '' && this.toDate !== undefined && this.toDate !== ''
    && this.g_cd !== '' && this.g_cd !== undefined) {
    this.isViewDisabled = false;
    }
    this.data.forEach(x => {
      options.push({'label': x.Name, 'value': x.Code});
      this.godownOptions = options;
    });
  }

  onView() {
    const params = new HttpParams().set('Fdate', this.datePipe.transform(this.fromDate,'MM-dd-yyyy')).append('ToDate', this.datePipe.transform(this.toDate,'MM-dd-yyyy')).append('GCode', this.g_cd);
    this.restAPIService.getByParameters(PathConstants.STOCK_RECEIPT_REGISTER_REPORT, params).subscribe(res => {
      this.stockReceiptRegData = res;
      if(res !== undefined) {
        this.isActionDisabled = false;
      }
      console.log('res', res);
    })
  }

}
