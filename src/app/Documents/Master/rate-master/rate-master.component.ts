import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-rate-master',
  templateUrl: './rate-master.component.html',
  styleUrls: ['./rate-master.component.css']
})
export class RateMasterComponent implements OnInit {
  RateMasterCols: any;
  RateMasterData: any;
  canShowMenu: Boolean;
  maxDate: Date;
  effectiveDate: any;
  orderNo: any;
  c_cd: any;
  s_cd: any;
  r_cd: any;
  w_cd: any;
  WeightmentOptions: SelectItem[];
  schemeOptions: SelectItem[];
  receiverOptions: SelectItem[];
  commodityOptions: SelectItem[];
  loading: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
  }

  onDateSelect() { }

  onSelect() { }

  onAdd() { }

  onView() { }

  onCancel() { }

}