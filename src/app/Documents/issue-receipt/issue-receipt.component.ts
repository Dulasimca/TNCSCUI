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
    this.col = [ { field: 'vin', header: 'Vin' },
    {field: 'year', header: 'Year' },
    { field: 'brand', header: 'Brand' },
    { field: 'color', header: 'Color' },
    { field: 'vin', header: 'Vin' },
    {field: 'year', header: 'Year' },
    { field: 'brand', header: 'Brand' },
    { field: 'color', header: 'Color' }];
    this.data = [ {'vin': 'ajc', 'year': 'adkahd', 'brand': 'jhgdjagd', 'color': 'hjjfa'},
    {'vin': 'ajc', 'year': 'adkahd', 'brand': 'jhgdjagd', 'color': 'hjjfa'},
    {'vin': 'ajc', 'year': 'adkahd', 'brand': 'jhgdjagd', 'color': 'hjjfa'},
    {'vin': 'ajc', 'year': 'adkahd', 'brand': 'jhgdjagd', 'color': 'hjjfa'},
    {'vin': 'ajc', 'year': 'adkahd', 'brand': 'jhgdjagd', 'color': 'hjjfa'},
    {'vin': 'ajc', 'year': 'adkahd', 'brand': 'jhgdjagd', 'color': 'hjjfa'},
    {'vin': 'ajc', 'year': 'adkahd', 'brand': 'jhgdjagd', 'color': 'hjjfa'},
  ];
  }

}
