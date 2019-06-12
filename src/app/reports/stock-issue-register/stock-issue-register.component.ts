import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams } from '@angular/common/http';
import { SelectItem } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { ExcelService } from 'src/app/shared-services/excel.service';

@Component({
  selector: 'app-stock-issue-register',
  templateUrl: './stock-issue-register.component.html',
  styleUrls: ['./stock-issue-register.component.css']
})
export class StockIssueRegisterComponent implements OnInit {
  stockIssueRegCols: any;
  stockIssueRegData: any;
  fromDate: any;
  toDate: any;
  isViewDisabled: any;
  isActionDisabled: any;
  data: any;
  g_cd= '548';
  godownOptions: SelectItem[];
  godownName: string;

  constructor(private tableConstants: TableConstants, private datePipe: DatePipe, private excelService: ExcelService, private restAPIService: RestAPIService, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.isViewDisabled = this.isActionDisabled = true;
    this.stockIssueRegCols = this.tableConstants.StockIssueRegisterReport;
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
      this.godownOptions = options;
    });
  }

  onView() {
    const params = new HttpParams().set('Fdate', this.datePipe.transform(this.fromDate, 'MM-DD-YYYY')).append('ToDate', this.datePipe.transform(this.toDate, 'MM-DD-YYYY')).append('GCode', this.g_cd);
    this.restAPIService.getByParameters(PathConstants.STOCK_ISSUE_REGISTER_REPORT, params).subscribe(res => {
      if (res !== undefined) {
        this.isActionDisabled = false;
      }
      console.log('res', res);
    })
  }

  exportAsXLSX():void{
    this.excelService.exportAsExcelFile(this.stockIssueRegData, 'Truck_Memo',this.stockIssueRegCols);
}
}
