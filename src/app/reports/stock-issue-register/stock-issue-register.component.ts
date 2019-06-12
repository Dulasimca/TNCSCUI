import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';

@Component({
  selector: 'app-stock-issue-register',
  templateUrl: './stock-issue-register.component.html',
  styleUrls: ['./stock-issue-register.component.css']
})
export class StockIssueRegisterComponent implements OnInit {
stockIssueRegCols: any;
stockIssueRegData: any;
canShowMenu: boolean;

  constructor(private tableConstants: TableConstants, private restAPIService: RestAPIService, private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.stockIssueRegCols = this.tableConstants.StockIssueRegisterReport;
  }

}
