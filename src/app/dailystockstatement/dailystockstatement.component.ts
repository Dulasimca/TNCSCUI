import { Component, OnInit } from '@angular/core';
import { TableConstants } from '../shared/tableconstants';
import { AuthService } from '../shared-services/auth.service';

@Component({
  selector: 'app-dailystockstatement',
  templateUrl: './dailystockstatement.component.html',
  styleUrls: ['./dailystockstatement.component.css']
})
export class DailyStockStatementComponent implements OnInit {
  dailyStockDataCoulmns: any;
  dailyStockData: any;
  fromDate: Date;
  toDate: Date;

  constructor(private tableConstants: TableConstants, private authService: AuthService) { }

  ngOnInit() {
    this.dailyStockDataCoulmns = this.tableConstants.DailyStockStatement;
    this.dailyStockData = [
      {
        "commodity": "Bengal Gram", "openingBalance": "0.00", "totalReceipt": "0", "grandTotalIssue": "0", "saleIssue": "0", "totalIssue": "0", "otherISsue": "0.00",
        "bookBalance": "0", "woff": "0.00", "physicalBalance": "0.00"
      },
      {
        "commodity": "Bengal Gram", "openingBalance": "0.00", "totalReceipt": "0", "grandTotalIssue": "0", "saleIssue": "0", "totalIssue": "0", "otherISsue": "0.00",
        "bookBalance": "0", "woff": "0.00", "physicalBalance": "0.00"
      },
      {
        "commodity": "Bengal Gram", "openingBalance": "0.00", "totalReceipt": "0", "grandTotalIssue": "0", "saleIssue": "0", "totalIssue": "0", "otherISsue": "0.00",
        "bookBalance": "0", "woff": "0.00", "physicalBalance": "0.00"
      },
      {
        "commodity": "Bengal Gram", "openingBalance": "0.00", "totalReceipt": "0", "grandTotalIssue": "0", "saleIssue": "0", "totalIssue": "0", "otherISsue": "0.00",
        "bookBalance": "0", "woff": "0.00", "physicalBalance": "0.00"
      },
      {
        "commodity": "Bengal Gram", "openingBalance": "0.00", "totalReceipt": "0", "grandTotalIssue": "0", "saleIssue": "0", "totalIssue": "0", "otherISsue": "0.00",
        "bookBalance": "0", "woff": "0.00", "physicalBalance": "0.00"
      },
      {
        "commodity": "Bengal Gram", "openingBalance": "0.00", "totalReceipt": "0", "grandTotalIssue": "0", "saleIssue": "0", "totalIssue": "0", "otherISsue": "0.00",
        "bookBalance": "0", "woff": "0.00", "physicalBalance": "0.00"
      },
      {
        "commodity": "Bengal Gram", "openingBalance": "0.00", "totalReceipt": "0", "grandTotalIssue": "0", "saleIssue": "0", "totalIssue": "0", "otherISsue": "0.00",
        "bookBalance": "0", "woff": "0.00", "physicalBalance": "0.00"
      },
      {
        "commodity": "Bengal Gram", "openingBalance": "0.00", "totalReceipt": "0", "grandTotalIssue": "0", "saleIssue": "0", "totalIssue": "0", "otherISsue": "0.00",
        "bookBalance": "0", "woff": "0.00", "physicalBalance": "0.00"
      },
      {
        "commodity": "Bengal Gram", "openingBalance": "0.00", "totalReceipt": "0", "grandTotalIssue": "0", "saleIssue": "0", "totalIssue": "0", "otherISsue": "0.00",
        "bookBalance": "0", "woff": "0.00", "physicalBalance": "0.00"
      },
      {
        "commodity": "Bengal Gram", "openingBalance": "0.00", "totalReceipt": "0", "grandTotalIssue": "0", "saleIssue": "0", "totalIssue": "0", "otherISsue": "0.00",
        "bookBalance": "0", "woff": "0.00", "physicalBalance": "0.00"
      },
      {
        "commodity": "Bengal Gram", "openingBalance": "0.00", "totalReceipt": "0", "grandTotalIssue": "0", "saleIssue": "0", "totalIssue": "0", "otherISsue": "0.00",
        "bookBalance": "0", "woff": "0.00", "physicalBalance": "0.00"
      },

      {
        "commodity": "Bengal Gram", "openingBalance": "0.00", "totalReceipt": "0", "grandTotalIssue": "0", "saleIssue": "0", "totalIssue": "0", "otherISsue": "0.00",
        "bookBalance": "0", "woff": "0.00", "physicalBalance": "0.00"
      },
      {
        "commodity": "Bengal Gram", "openingBalance": "0.00", "totalReceipt": "0", "grandTotalIssue": "0", "saleIssue": "0", "totalIssue": "0", "otherISsue": "0.00",
        "bookBalance": "0", "woff": "0.00", "physicalBalance": "0.00"
      },
      {
        "commodity": "Bengal Gram", "openingBalance": "0.00", "totalReceipt": "0", "grandTotalIssue": "0", "saleIssue": "0", "totalIssue": "0", "otherISsue": "0.00",
        "bookBalance": "0", "woff": "0.00", "physicalBalance": "0.00"
      },
      {
        "commodity": "Bengal Gram", "openingBalance": "0.00", "totalReceipt": "0", "grandTotalIssue": "0", "saleIssue": "0", "totalIssue": "0", "otherISsue": "0.00",
        "bookBalance": "0", "woff": "0.00", "physicalBalance": "0.00"
      },
      {
        "commodity": "Bengal Gram", "openingBalance": "0.00", "totalReceipt": "0", "grandTotalIssue": "0", "saleIssue": "0", "totalIssue": "0", "otherISsue": "0.00",
        "bookBalance": "0", "woff": "0.00", "physicalBalance": "0.00"
      },
      {
        "commodity": "Bengal Gram", "openingBalance": "0.00", "totalReceipt": "0", "grandTotalIssue": "0", "saleIssue": "0", "totalIssue": "0", "otherISsue": "0.00",
        "bookBalance": "0", "woff": "0.00", "physicalBalance": "0.00"
      },
      {
        "commodity": "Bengal Gram", "openingBalance": "0.00", "totalReceipt": "0", "grandTotalIssue": "0", "saleIssue": "0", "totalIssue": "0", "otherISsue": "0.00",
        "bookBalance": "0", "woff": "0.00", "physicalBalance": "0.00"
      },
      {
        "commodity": "Bengal Gram", "openingBalance": "0.00", "totalReceipt": "0", "grandTotalIssue": "0", "saleIssue": "0", "totalIssue": "0", "otherISsue": "0.00",
        "bookBalance": "0", "woff": "0.00", "physicalBalance": "0.00"
      }
    ]
  }

}
