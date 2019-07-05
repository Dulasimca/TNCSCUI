import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { TableConstants } from 'src/app/constants/tableconstants';

@Component({
  selector: 'app-item-master-modification',
  templateUrl: './item-master-modification.component.html',
  styleUrls: ['./item-master-modification.component.css']
})
export class ItemMasterModificationComponent implements OnInit {
  ItemMasterCols: any;
  ItemMasterData: any;
  canShowMenu: Boolean;

  constructor(private tableConstants: TableConstants, private authService: AuthService,) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.ItemMasterCols = this.tableConstants.ItemMasterModification;

  }

}