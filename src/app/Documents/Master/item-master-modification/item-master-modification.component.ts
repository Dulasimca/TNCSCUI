import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';

@Component({
  selector: 'app-item-master-modification',
  templateUrl: './item-master-modification.component.html',
  styleUrls: ['./item-master-modification.component.css']
})
export class ItemMasterModificationComponent implements OnInit {
  ItemMasterCols: any;
  ItemMasterData: any;
  canShowMenu: boolean;
  loading: boolean = false;

  constructor(private tableConstants: TableConstants, private authService: AuthService, private restApiService: RestAPIService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.ItemMasterCols = this.tableConstants.ItemMasterModification;
    this.restApiService.get(PathConstants.COMMODITY_BREAK_ITEM_MASTER_MODIFICATION).subscribe(value => {
      if (value !== undefined) {
        this.loading = false;
        this.ItemMasterData = value;
        let sno = 0;
        this.ItemMasterData.forEach(data => {
          sno += 1;
          data.SlNo = sno;
        });
      }
    });
  }
}