import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-issue-receipt',
  templateUrl: './issue-receipt.component.html',
  styleUrls: ['./issue-receipt.component.css']
})
export class IssueReceiptComponent implements OnInit {
data: any;
col: any;
  constructor() { }

  ngOnInit() {
    this.col = [ { field: 'Delivery Order No', header: 'DeliveryOrderNo' },
    {field: 'Issue Memo No', header: 'IssueMemoNo' },
    { field: 'Delivery Order', header: 'DeliveryOrder' },
    { field: 'Delivery', header: 'Delivery' }]
   

    this.data = [ {'Delivery Order No': '1', 'Issue Memo No': 'A', 'Delivery Order': 'E','Delivery': 'I'},
    {'Delivery Order No': '2', 'Issue Memo No': 'B', 'Delivery Order': 'F','Delivery': 'j'},
    {'Delivery Order No': '3', 'Issue Memo No': 'C', 'Delivery Order': 'G','Delivery': 'k'},
    {'Delivery Order No': '4', 'Issue Memo No': 'D', 'Delivery Order': 'H','Delivery': 'l'}
  ];
  }

}
