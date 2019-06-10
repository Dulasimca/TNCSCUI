import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';

@Component({
  selector: 'app-stock-receipt',
  templateUrl: './stock-receipt.component.html',
  styleUrls: ['./stock-receipt.component.css']
})
export class StockReceiptComponent implements OnInit {
  canShowMenu: boolean;
  itemCol: any;
  itemData: any;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.canShowMenu()) ? this.authService.canShowMenu() : false;
    this.itemCol = [
      { field: 'Stack No.', header:'StackNo' },
      { field: 'Item Description', header:'ItemDesc' },
      { field: 'Packing Type', header:'PackingType' },
      { field: 'No. of packing', header:'No Packing' },
      { field: 'Wmt Type', header:'WmtType' },
      { field: 'Gross Wt', header:'GrossWt' },
      { field: 'Net Wt', header:'NetWT' },
      { field: 'Moisture', header:'Moisture' },
      { field: 'Scheme', header:'Scheme' }
      
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
