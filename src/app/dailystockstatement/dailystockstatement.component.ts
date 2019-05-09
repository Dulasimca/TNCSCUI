import { Component, OnInit } from '@angular/core';
import { TableConstants } from '../shared/tableconstants';

@Component({
  selector: 'app-dailystockstatement',
  templateUrl: './dailystockstatement.component.html',
  styleUrls: ['./dailystockstatement.component.css']
})
export class DailyStockStatementComponent implements OnInit {
  dailyStockDataCoulmns: any;
  dailyStockData: any;

  constructor(private tableConstants: TableConstants) { }

  ngOnInit() {
    this.dailyStockDataCoulmns = this.tableConstants.DailyStockStatement;
  }

}
