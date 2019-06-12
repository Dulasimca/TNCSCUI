import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { DatePipe } from '@angular/common';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { SelectItem } from 'primeng/api';
import { HttpParams } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { AuthService } from 'src/app/shared-services/auth.service';

@Component({
  selector: 'app-delivery-order-register',
  templateUrl: './delivery-order-register.component.html',
  styleUrls: ['./delivery-order-register.component.css']
})
export class DeliveryOrderRegisterComponent implements OnInit {
  DeliveryReceiptRegCols: any;
  DeliveryReceiptRegData: any;
  fromDate: any;
  toDate: any;
  isViewDisabled: any;
  isActionDisabled: any;
  data: any;
  g_cd='548';
  deliveryOptions: SelectItem[];
  deliveryName: string;
  canShowMenu: boolean;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe,private authService: AuthService, private excelService: ExcelService, private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.isViewDisabled = this.isActionDisabled = true;
    this.DeliveryReceiptRegCols = this.tableConstants.DeliveryMemoRegisterReport;
    this.data = this.roleBasedService.getInstance();
    console.log('data', this.data);
  }

  onSelect() {
    let options = [];
    if (this.fromDate !== undefined && this.fromDate !== '' && this.toDate !== undefined && this.toDate !== '' && this.g_cd !== '' && this.g_cd !== undefined) {
      this.isViewDisabled = false;
    }
    this.data.forEach(element => {
      options.push({ 'label': element.Name, 'value': element.Code });
      this.deliveryOptions = options;
    });
  }

  onView() {
    const params = new HttpParams().set('Fdate', this.datePipe.transform(this.fromDate, 'MM-DD-YYYY')).append('ToDate', this.datePipe.transform(this.toDate, 'MM-DD-YYYY')).append('GCode', this.g_cd);
    this.restAPIService.getByParameters(PathConstants.STOCK_DELIVERY_ORDER_REPORT, params).subscribe(res => {
      if (res !== undefined) {
        this.isActionDisabled = false;
      }
      console.log('res', res);
    })
  }

  exportAsXLSX():void{
    this.excelService.exportAsExcelFile(this.DeliveryReceiptRegData, 'Truck_Memo',this.DeliveryReceiptRegCols);
}
}
