import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';

@Component({
  selector: 'app-stock-issue-register',
  templateUrl: './stock-issue-register.component.html',
  styleUrls: ['./stock-issue-register.component.css']
})
export class StockIssueRegisterComponent implements OnInit {
stockIssueRegCols: any;
stockIssueRegData: any;
  constructor(private tableConstants: TableConstants, private restAPIService: RestAPIService) { }

  ngOnInit() {
    this.stockIssueRegCols = this.tableConstants.StockIssueRegisterReport;
  }

}
