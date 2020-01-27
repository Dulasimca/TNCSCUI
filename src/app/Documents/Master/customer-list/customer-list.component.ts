import { Component, OnInit, ViewChild } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { Dropdown, SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  CustomerCols: any;
  CustomerData: any = [];
  isActive: boolean;
  godownOptions: SelectItem[];
  godownCode: any;
  canShowMenu: Boolean;
  loading: boolean;
  isSaveSucceed: boolean;
  @ViewChild('godown', { static: false }) godownPanel: Dropdown;

  constructor(private tableConstants: TableConstants, private authService: AuthService,) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.CustomerCols = this.tableConstants.GodownCustomerList;
  }

  onSelect(type) {
    if (type === 'enter') {
      this.godownPanel.overlayVisible = true;
    }
  }

  onView() { }

  exportAsXLSX() { }

  onPrint() { }

}
