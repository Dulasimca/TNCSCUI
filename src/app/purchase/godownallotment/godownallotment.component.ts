import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-godownallotment',
  templateUrl: './godownallotment.component.html',
  styleUrls: ['./godownallotment.component.css']
})
export class GodownAllotmentComponent implements OnInit {
canShowMenu: boolean;
tenderAllotmentGodwonWiseCols: any;
tenderAllotmentGodwonWiseData: any = [];
orderNumberOptions: any[];
depositorNameOptions: any[];
godownOptions: SelectItem[];
commodityOptions: SelectItem[];
partyNameOptions: SelectItem[];
GCode: any;
RCode: any;
ICode: any;
PartyCode: any;
Quantity: any;
AllottedQty: any;
Remarks: any;
orderNumber: any;
godownName: any;
showPane: boolean;
isViewed: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
  }

  onSelect(id, type) {
    
  }

  calculateQty(value) {
    
  }

  onView() { }

  onSave() { }


}
