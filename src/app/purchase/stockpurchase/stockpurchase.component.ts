import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-stockpurchase',
  templateUrl: './stockpurchase.component.html',
  styleUrls: ['./stockpurchase.component.css']
})
export class StockPurchaseComponent implements OnInit {
  isShowGrid:  boolean;
  canShowMenu: boolean;
  stockPurchaseData: any;
  stockPurchaseDataCoulmns: any;
  depositorTypeOptions: any[];
  depositorName: any;
  depositorType: any;
  itemName: any;
  qty: any;
  orderNumber: any;
  remarks: any;
  stockArray: Array<any> = [];

  constructor(private tableConstants: TableConstants, private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.stockPurchaseDataCoulmns = this.tableConstants.StockPurchase;
  }

  onView() {
    this.isShowGrid = true;
    saveAs("../../assets/Reports/Text/548SDOR.txt", "file.txt");
  }

  search(event) {
    this.depositorTypeOptions = [];
    const types: string[]= ['officer' , 'master' ,'inspector' , 'invegislator'];
    let input = event.query;
    for (let i = 0; i <= types.length; i++) {
      let checkType = types[i];
      if (checkType.indexOf(event.query) == 0) {
        this.depositorTypeOptions.push(checkType);
      }
    }
  }

  onSave() {
    
    this.stockArray.push({
      'depositorName': this.depositorName, 'itemName': this.itemName, 'qty': this.qty, 'orderNumber': this.orderNumber,
      'remarks': this.remarks
    });
    this.stockPurchaseData = this.stockArray;
    this.onClearField();
  }

  onClearField() {
    this.depositorName = this.remarks = this.qty = this.itemName = this.orderNumber = this.depositorType = '';
  }
}
