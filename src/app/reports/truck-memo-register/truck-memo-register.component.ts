import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { SelectItem } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { HttpParams } from '@angular/common/http';
import { PathConstants } from 'src/app/constants/path.constants';
import { ExcelService } from 'src/app/shared-services/excel.service';

@Component({
  selector: 'app-truck-memo-register',
  templateUrl: './truck-memo-register.component.html',
  styleUrls: ['./truck-memo-register.component.css']
})
export class TruckMemoRegisterComponent implements OnInit {
  TruckMemoRegCols: any;
  TruckMemoRegData: any;
  fromDate: any;
  toDate: any;
  isViewDisabled: any;
  isActionDisabled: any;
  data: any;
  g_cd = '548';
  truckOptions: SelectItem[];
  truckName: string;
  response: any;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe, private excelService: ExcelService, private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.isViewDisabled = this.isActionDisabled = true;
    this.TruckMemoRegCols = this.tableConstants.TruckMemoRegisterReport;
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
        this.response = res;
      }
      console.log('res', res);
    })
  }

  exportAsXLSX():void{
    this.excelService.exportAsExcelFile(this.TruckMemoRegData, 'Truck_Memo',this.TruckMemoRegCols);
}
}