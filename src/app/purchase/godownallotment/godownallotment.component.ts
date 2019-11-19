import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { SelectItem, MessageService } from 'primeng/api';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { DatePipe } from '@angular/common';
import { TableConstants } from 'src/app/constants/tableconstants';
import { Dropdown } from 'primeng/primeng';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-godownallotment',
  templateUrl: './godownallotment.component.html',
  styleUrls: ['./godownallotment.component.css']
})
export class GodownAllotmentComponent implements OnInit {
canShowMenu: boolean;
orderNoOptions: SelectItem[];
OrderNo: any;
Commodity: any;
AllottedQty: any;
isDataAvailable: boolean;
TargetDate: any;
maxDate: Date = new Date();
PartyCode: any;
partyID: any;
partyNameOptions: SelectItem[];
Quantity: any;
showErrMsg: boolean;
TotalDays: any;
Rate: any;
Remarks: any;
godownOptions: SelectItem[];
GCode: any;
gCode: any;
NetWt: any;
spellOptions: SelectItem[];
Spell: any;
itemList: any = [];
tenderAllotmentGodownWiseCols: any;
tenderAllotmentGodownWiseData: any;
showPane: boolean;
fromDate: Date = new Date();
toDate: Date = new Date();
selected: any;
gdnTenderAllotmentCols: any;
gdnTenderAllotmentData: any = [];
data = [];
loggedInRCode: string;
isViewed: boolean;
@ViewChild('godown') godownPanel: Dropdown;
@ViewChild('orderNum') oredrNoPanel: Dropdown;
@ViewChild('party') partyNamePanel: Dropdown;
@ViewChild('spell') spellPanel: Dropdown;
@ViewChild('f') form: NgForm;

  constructor(private authService: AuthService, private restApiService: RestAPIService, private messageService: MessageService,
    private tableConstants: TableConstants, private datepipe: DatePipe, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
  }

  onSelect(id, type) {
    let oredrNoSelection = [];
    let godownSelection = [];
    let partyNameSelection = [];
    switch (id) {
      case 'order':
        if (type == 'enter') {
          this.oredrNoPanel.overlayVisible = true;
        }
          this.restApiService.get(PathConstants.PURCHASE_TENDER_ORDER_NO_GET).subscribe(res => {
            if (res !== undefined && res !== null && res.length !== 0) {
              res.forEach(o => {
                oredrNoSelection.push({ label: o.OrderNumber, value: o.OrderNumber });
              })
              this.orderNoOptions = oredrNoSelection;
              this.orderNoOptions.unshift({ label: '-select-', value: null });
            }
            else { this.orderNoOptions.unshift({ label: '-select-', value: null }); }
          })
        break;
      case 'spell':
        if (type == 'enter') {
          this.spellPanel.overlayVisible = true;
        }
        if (this.spellOptions === undefined) {
          this.spellOptions = [{ label: '-select-', value: null }, { label: 'Spell1', value: 1 }, { label: 'Spell2', value: 2 },
          { label: 'Spell3', value: 3 }, { label: 'Spell4', value: 4 }, { label: 'Spell5', value: 5 }];
        }
        break;
        case 'gd':
        if (type === 'enter') {
          this.godownPanel.overlayVisible = true;
        }
        this.data = this.roleBasedService.instance;
        if (this.data !== undefined) {
          this.data.forEach(x => {
            if (x.RCode === this.loggedInRCode) {
              godownSelection.push({ 'label': x.GName, 'value': x.GCode });
            }
          });
          this.godownOptions = godownSelection;
        }
        break;
      case 'p_id':
        if (type === 'enter') { this.partyNamePanel.overlayVisible = true; }
        this.restApiService.get(PathConstants.PURCHASE_PARTYNAME_DETAILS).subscribe(data => {
          if (data !== undefined && data !== null && data.length !== 0) {
            data.forEach(p => {
              partyNameSelection.push({ label: p.PartyName, value: p.PartyID });
            })
            this.partyNameOptions = partyNameSelection;
            this.partyNameOptions.unshift({ label: '-select-', value: null });
          } else { this.partyNameOptions = partyNameSelection; }
        })
        break;
    }
  }

  onChangeOrderNo() { }

  calculateQty(value) { }

  onEnter() { }

  onView() { }

  onRowSelect(event) { }

  onSelectedRow(data, index) { }

  getTenderData() { }

  onSave() { }


}
