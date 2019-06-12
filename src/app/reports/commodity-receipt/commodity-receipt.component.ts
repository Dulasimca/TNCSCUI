import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/shared-services/auth.service';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { HttpParams } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';

@Component({
  selector: 'app-commodity-receipt',
  templateUrl: './commodity-receipt.component.html',
  styleUrls: ['./commodity-receipt.component.css']
})
export class CommodityReceiptComponent implements OnInit{
  CommodityReceiptCols: any;
  CommodityReceiptData: any;
  fromDate: any;
  toDate: any;
  isViewDisabled: any;
  isActionDisabled: any;
  data: any;
  g_cd = '548';
  truckOptions: SelectItem[];
  truckName: string;
  canShowMenu: boolean;


  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,private authService: AuthService, private excelService: ExcelService, private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.isViewDisabled = this.isActionDisabled = true;
    this.CommodityReceiptCols = this.tableConstants.CommodityReceiptReport;
    this.data = this.roleBasedService.getInstance();
    console.log('data', this.data);
  }

  onSelect() {
    let options = [];
    if (this.fromDate !== undefined && this.fromDate !== '' && this.toDate !== undefined && this.toDate !== '' && this.g_cd !== '' && this.g_cd !== undefined) {
      this.isViewDisabled = false;
    }
    this.data.forEach(x => {
      options.push({ 'label': x.Name, 'value': x.Code });
      this.truckOptions = options;
    });
  }

  onView() {
    const params = new HttpParams().set('Fdate', this.datePipe.transform(this.fromDate, 'MM-DD-YYYY')).append('ToDate', this.datePipe.transform(this.toDate, 'MM-DD-YYYY')).append('GCode', this.g_cd);
    this.restAPIService.getByParameters(PathConstants.STOCK_TRUCK_MEMO_REPORT, params).subscribe(res => {
      if (res !== undefined) {
        this.isActionDisabled = false;
      }
      console.log('res', res);
    })
  }

  exportAsXLSX():void{
    this.excelService.exportAsExcelFile(this.CommodityReceiptData, 'Truck_Memo',this.CommodityReceiptCols);
}
}