import { Component, OnInit } from '@angular/core';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';

@Component({
  selector: 'app-issue-receipt',
  templateUrl: './issue-receipt.component.html',
  styleUrls: ['./issue-receipt.component.css']
})
export class IssueReceiptComponent implements OnInit {
data: any;
col: any;
itemCol: any;
itemData: any;
  canShowMenu: boolean;
  constructor(private restApiService: RestAPIService, private authService: AuthService,) { 
    this.canShowMenu = (this.authService.canShowMenu()) ? this.authService.canShowMenu() : false;

  }

  ngOnInit() {
    this.col = [ { field: 'Delivery Order No', header: 'DeliveryOrderNo' },
    {field: 'Issue Memo No', header: 'IssueMemoNo' },
    { field: 'Delivery Order', header: 'DeliveryOrder' },
    { field: 'Delivery', header: 'Delivery' }]
   

    this.data = [ {'Delivery Order No': '1', 'Issue Memo No': 'A', 'Delivery Order': 'E','Delivery': 'I'},
    {'Delivery Order No': '2', 'Issue Memo No': 'B', 'Delivery Order': 'F','Delivery': 'j'},
    {'Delivery Order No': '3', 'Issue Memo No': 'C', 'Delivery Order': 'G','Delivery': 'k'},
    {'Delivery Order No': '4', 'Issue Memo No': 'D', 'Delivery Order': 'H','Delivery': 'l'},
    {'Delivery Order No': '3', 'Issue Memo No': 'C', 'Delivery Order': 'G','Delivery': 'k'},
    {'Delivery Order No': '4', 'Issue Memo No': 'D', 'Delivery Order': 'H','Delivery': 'l'}
  ];

  this.itemCol = [
    { field: 'Stack No.', header:'StackNo' },
    { field: 'Item Description', header:'ItemDesc' },
    { field: 'Packing Type', header:'PackingType' },
    { field: 'No. of packing', header:'No Packing' },
    { field: 'Wmt Type', header:'WmtType' },
    { field: 'Gross Wt', header:'GrossWt' },
    { field: 'Moisture', header:'Moisture' },
    { field: 'Scheme', header:'Scheme' },
    { field: 'Net Wt', header:'NetWT' }
  ]
  this.itemData = [
    { 'Stack No.': '1','Item Description':'A','Packing Type':'','No. of packing':'','Wmt Type': '','Gross Wt': '','Moisture': '','Scheme': '','Net Wt': '' },
    { 'Stack No.': '2','Item Description':'B','Packing Type':'','No. of packing':'','Wmt Type': '','Gross Wt': '','Moisture': '','Scheme': '','Net Wt': '' },
    { 'Stack No.': '3','Item Description':'C','Packing Type':'','No. of packing':'','Wmt Type': '','Gross Wt': '','Moisture': '','Scheme': '','Net Wt': '' },
    { 'Stack No.': '4','Item Description':'D','Packing Type':'','No. of packing':'','Wmt Type': '','Gross Wt': '','Moisture': '','Scheme': '','Net Wt': '' },
    { 'Stack No.': '5','Item Description':'E','Packing Type':'','No. of packing':'','Wmt Type': '','Gross Wt': '','Moisture': '','Scheme': '','Net Wt': '' },
    { 'Stack No.': '6','Item Description':'F','Packing Type':'','No. of packing':'','Wmt Type': '','Gross Wt': '','Moisture': '','Scheme': '','Net Wt': '' },
  ];
  }

}
