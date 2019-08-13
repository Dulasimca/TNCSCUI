import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';

@Component({
  selector: 'app-scheme-commodity',
  templateUrl: './scheme-commodity.component.html',
  styleUrls: ['./scheme-commodity.component.css']
})
export class SchemeCommodityComponent implements OnInit {
  SchemeCommodityCols: any;
  SchemeCommodityData: any;
  canShowMenu: boolean;
  loading: boolean = false;


  constructor(private tableConstants: TableConstants, private authService: AuthService, private restApiService: RestAPIService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.SchemeCommodityCols = this.tableConstants.SchemeCommodity;
    this.restApiService.get(PathConstants.SCHEME_COMMODITY).subscribe(res => {
      if (res !== undefined) {
        this.loading = false;
        this.SchemeCommodityData = res;
        let sno = 0;
        this.SchemeCommodityData.forEach(data => {
          sno += 1;
          data.SlNo = sno;
        });
      }
    });
  }
}