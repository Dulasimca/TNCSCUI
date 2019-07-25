import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';

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

  constructor(private tableConstants: TableConstants, private authService : AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.stackReceiptCols = this.tableConstants.StackReceiptEntryReport;
  }

}
