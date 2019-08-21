import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-stack-receipt-entry',
  templateUrl: './stack-receipt-entry.component.html',
  styleUrls: ['./stack-receipt-entry.component.css']
})
export class StackReceiptEntryComponent implements OnInit {
  stackReceiptCols: any;
  stackReceiptData: any;
  isViewDisabled: boolean;
  canShowMenu: boolean;

  constructor(private tableConstants: TableConstants, private restApiService: RestAPIService, private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.stackReceiptCols = this.tableConstants.StackReceiptEntryReport;
  }

 
}
