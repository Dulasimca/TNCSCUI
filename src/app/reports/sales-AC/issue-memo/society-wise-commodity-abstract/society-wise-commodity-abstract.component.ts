import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { RoleBasedService } from 'src/app/common/role-based.service';

@Component({
  selector: 'app-society-wise-commodity-abstract',
  templateUrl: './society-wise-commodity-abstract.component.html',
  styleUrls: ['./society-wise-commodity-abstract.component.css']
})
export class SocietyWiseCommodityAbstractComponent implements OnInit {
  canShowMenu: boolean;
  showCommodityAbstract: boolean = false;
  showCommodityBreakup: boolean = false;
  showSchemeCommodityBreakup: boolean = false;
  showSchemeAbstract: boolean = false;
  abstractOptions: SelectItem[];
  godownOptions: SelectItem[];
  a_cd: string;
  g_cd: any;
  data: any; 

  constructor(private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.data = this.roleBasedService.getInstance();
  }

  onSelect(selectedItem) {
    let godownSelection = [];
    switch (selectedItem) {
      case 'customer':
        break;
      case 'godown':
        this.data = this.roleBasedService.instance;
          if (this.data !== undefined) {
            this.data.forEach(x => {
                godownSelection.push({ 'label': x.GName, 'value': x.GCode });
                this.godownOptions = godownSelection;
              });
            }
        break;
      case 'abstract':
        this.abstractOptions = [{ 'label': 'Society Wise Commodity Breakup', 'value': 'society_c_a' },
        { 'label': 'Society Wise Date Wise Commodity Abstract', 'value': 'date_c_b' },
        { 'label': 'Society Wise Scheme Wise Commodity Breakup', 'value': 'scheme_c_b' },
        { 'label': 'Society Wise Scheme Wise Commodity Abstract', 'value': 'scheme_c_a' }];
        this.showPane();
        break;
    }
  }

  showPane() {
    switch (this.a_cd) {
      case 'society_c_a':
        this.showCommodityAbstract = true;
        this.showCommodityBreakup = false;
        this.showSchemeAbstract = false;
        this.showSchemeCommodityBreakup = false;
        break;
      case 'date_c_b':
        this.showCommodityAbstract = false;
        this.showCommodityBreakup = true;
        this.showSchemeAbstract = false;
        this.showSchemeCommodityBreakup = false;
        break;
      case 'scheme_c_b':
        this.showCommodityAbstract = false;
        this.showCommodityBreakup = false;
        this.showSchemeAbstract = false;
        this.showSchemeCommodityBreakup = true;
        break;
      case 'scheme_c_a':
        this.showCommodityAbstract = false;
        this.showCommodityBreakup = false;
        this.showSchemeAbstract = true;
        this.showSchemeCommodityBreakup = false;
        break;
    }

  }


}
