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
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { StatusMessage } from 'src/app/constants/Messages';

@Component({
  selector: 'app-godownallotment',
  templateUrl: './godownallotment.component.html',
  styleUrls: ['./godownallotment.component.css']
})
export class GodownAllotmentComponent implements OnInit {
canShowMenu: boolean;
regionOptions: SelectItem[];
RCode: any;
rCode: any;
orderNoOptions: SelectItem[];
OrderNo: any;
Commodity: any;
AllottedQty: any;
maxDate: Date = new Date();
PartyName: any;
Quantity: any;
showErrMsg: boolean;
Remarks: any;
godownOptions: SelectItem[];
GCode: any;
gCode: any;
showPane: boolean;
fromDate: Date = new Date();
toDate: Date = new Date();
selected: any;
gdnTenderAllotmentCols: any;
gdnTenderAllotmentData: any = [];
data = [];
loggedInRCode: string;
isViewed: boolean;
regions: any;
roleId; any;
regionSelection: any = [];
RegAllotmentID: any;
GodownAllotementID: any;
Spell: any;
spellOptions: SelectItem[];
spellCode: any;
@ViewChild('godown', { static: false }) godownPanel: Dropdown;
@ViewChild('region', { static: false }) regionPanel: Dropdown;
@ViewChild('orderNum', { static: false }) oredrNoPanel: Dropdown;
@ViewChild('spell', { static: false }) spellPanel: Dropdown;
@ViewChild('f', { static: false }) form: NgForm;
  isDataAvailable: boolean;

  constructor(private authService: AuthService, private restApiService: RestAPIService, private messageService: MessageService,
    private tableConstants: TableConstants, private datepipe: DatePipe, private roleBasedService: RoleBasedService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.data = this.roleBasedService.getInstance();
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.regions = this.roleBasedService.getRegions();
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    }

  onSelect(id, type) {
    let oredrNoSelection = [];
    let godownSelection = [];
    let regionSelection = [];
    switch (id) {
      case 'order':
        if (type == 'tab') {
          this.oredrNoPanel.overlayVisible = true;
        }
        if((this.RCode.value !== undefined && this.RCode.value !== null) || (this.rCode !== undefined && this.rCode !== null)) {
          const params = new HttpParams().set('Type', '1')
          .append('RCode', (this.RCode.value !== undefined && this.RCode.value !== null) ? this.RCode.value : this.rCode);
          this.restApiService.getByParameters(PathConstants.PURCHASE_TENDER_ORDER_NO_GET, params).subscribe(res => {
            if (res.Table !== undefined && res.Table !== null && res.Table.length !== 0) {
              res.Table.forEach(o => {
                oredrNoSelection.push({ label: o.OrderNumber, value: o.OrderNumber });
              })
              this.orderNoOptions = oredrNoSelection;
              this.orderNoOptions.unshift({ label: '-select-', value: null });
            }
            else { this.orderNoOptions.unshift({ label: '-select-', value: null }); }
          })
        } 
        break;
        case 'reg':
            if (type === 'tab') {
              this.regionPanel.overlayVisible = true;
            }
            this.regions = this.roleBasedService.regionsData;
            if (this.roleId === 1) {
              if (this.regions !== undefined) {
                this.regions.forEach(x => {
                  regionSelection.push({ 'label': x.RName, 'value': x.RCode });
                });
                this.regionOptions = regionSelection;
                this.regionOptions.unshift({ label: '-select-', value: null });
              } else { this.regionOptions = regionSelection; }
            } else {
              if (this.regions !== undefined) {
                this.regions.forEach(x => {
                  if (x.RCode === this.loggedInRCode) {
                    regionSelection.push({ 'label': x.RName, 'value': x.RCode });
                  }
                });
                this.regionOptions = regionSelection;
                this.regionOptions.unshift({ label: '-select-', value: null });
              } else { this.regionOptions = regionSelection; }
            }
          break;
          case 'spell':
              if (type == 'tab') {
                this.spellPanel.overlayVisible = true;
              }
                this.spellOptions = [{ label: '-select-', value: null }, { label: 'Spell1', value: 1 }, { label: 'Spell2', value: 2 },
                { label: 'Spell3', value: 3 }, { label: 'Spell4', value: 4 }, { label: 'Spell5', value: 5 }];
              break;
        case 'gd':
        if (type === 'tab') {
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
          this.godownOptions.unshift({ label: '-select-', value: null });
        } else {
          this.godownOptions = godownSelection;
        }
        break;
    }
  }

  onChangeList() { 
    if(this.OrderNo !== undefined && this.OrderNo !== null && this.Spell !== undefined && this.Spell !== null) {
      let rcode = (this.RCode.value !== null && this.RCode.value !== undefined) ? this.RCode.value : this.rCode;
      let spell = (this.Spell.value !== undefined && this.Spell.value !== null) ? this.Spell.value : this.spellCode;
      const params = new HttpParams().set('OrderNo', (this.OrderNo !== undefined) ? this.OrderNo : '')
      .append('RCode', rcode).append('Spell', spell).append('Type', '2');
      this.restApiService.getByParameters(PathConstants.PURCHASE_TENDER_DATA_BY_ORDER_NO, params).subscribe(data => {
        if (data.Table !== undefined && data.Table !== null && data.Table.length !== 0) {
          this.AllottedQty = 0;
          data.Table.forEach(x => {
            this.Commodity = x.ITDescription;
            this.PartyName = x.PartyName;
            this.RegAllotmentID = x.RegAllotementID;
            this.AllottedQty += (x.Quantity * 1);
          })
        } else {
          this.Commodity = null; this.PartyName = null;
          this.AllottedQty = 0; this.RegAllotmentID = null;
        }
        if(data.Table1.length !== 0 && data.Table1 !== null && data.Table1 !== undefined) {
          this.isDataAvailable = true;
          data.Table1.forEach(x => {
          this.Quantity = x.Quantity;
          this.Remarks = x.Remarks;
          this.GCode = x.GName;
          this.gCode = x.GCode;
          this.godownOptions = [{ label: x.GName, value: x.GCode }];
          this.godownPanel.showClear = false;
          });
        } else {
          this.isDataAvailable = false;
          this.Quantity = null; this.Remarks = null;
          this.GCode = null; this.godownOptions = [];
        }
      })
    } else {
      this.Commodity = null; this.PartyName = null;
      this.AllottedQty = 0; this.RegAllotmentID = null;
      this.isDataAvailable = false;
      this.GCode = null; this.Quantity = null;
    }
  }

  calculateQty(value) { 
    if(value !== null && value !== undefined) {
      const qty = (value * 1);
      const allottedQty = (this.AllottedQty * 1);
      if(qty > allottedQty) {
        this.Quantity = null;
        this.showErrMsg = true;
      } else {
        this.showErrMsg = false;
      }
    }
  }

  onView() { 
    this.showPane = true;
    this.selected = null;
    // const params = new HttpParams().set('value1', this.datePipe.transform(this.fromDate, 'MM/dd/yyyy'))
    // .append('value2', this.datePipe.transform(this.toDate, 'MM/dd/yyyy'));
    this.restApiService.get(PathConstants.PURCHASE_TENDER_ALLOTMENT_TO_GODOWN_GET).subscribe(data => {
      if(data.length !== 0 && data !== null && data !== undefined) {
        this.gdnTenderAllotmentCols = this.tableConstants.TenderAllotmentToGodownCols;
        this.gdnTenderAllotmentData = data;
        let sno = 1;
        this.gdnTenderAllotmentData.forEach(x => {
          x.SlNo = sno;
          sno += 1;
        })
      } else {
        this.gdnTenderAllotmentData = [];
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      } else {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.NetworkErrorMessage });
      }
    });
  }

  onRowSelect(event) { 
    this.selected = event;
    this.GodownAllotementID = event.data.GodownAllotementID;
  }

  onSelectedRow() { 
    this.showPane = false;
    this.isViewed = true;
    this.isDataAvailable = false;
    this.rCode = this.selected.data.RCode;
    this.RCode = this.selected.data.RName;
    this.regionOptions = [{ label: this.selected.data.RName, value: this.selected.data.RCode }];
    this.Quantity = (this.selected.data.Quantity * 1);
    this.Remarks = this.selected.data.Remarks;
    this.GCode = this.selected.data.GName;
    this.gCode = this.selected.data.GCode;
    this.godownOptions = [{ label: this.selected.data.GName, value: this.selected.data.GCode }];
    this.OrderNo = this.selected.data.OrderNumber;
    this.orderNoOptions = [{ label: this.selected.data.OrderNumber, value: this.selected.data.OrderNumber }];
    this.spellCode = this.selected.data.Spell;
    this.Spell = 'Spell' + this.selected.data.Spell;
    this.spellOptions = [{ label: this.Spell, value: this.spellCode }];
    // if(this.OrderNo !== null && this.OrderNo !== undefined && this.rCode !== null && this.rCode !== undefined) {
    //   this.onChangeList();
    // }
    this.AllottedQty = (this.selected.data.AllottedQty * 1);
    this.Commodity = this.selected.data.ITDescription;
    this.PartyName = this.selected.data.PartyName;
    this.RegAllotmentID = this.selected.data.TenderAllotmentID;
  }

  onSave() {
    const GodownAllotementID = (this.GodownAllotementID !== undefined && this.GodownAllotementID !== null) ? this.GodownAllotementID : 0;
    const params = {
      'GodownAllotementID': GodownAllotementID,
      'RegAllotementID': this.RegAllotmentID,
      'OrderNumber': this.OrderNo,
      'GCode': (this.gCode !== undefined && this.gCode !== null) ? this.gCode : this.GCode,
      'Quantity': this.Quantity,
      'Remarks': (this.Remarks !== undefined && this.Remarks !== null) ? this.Remarks : ''
    }

    this.restApiService.post(PathConstants.PURCHASE_TENDER_ALLOTMENT_TO_GODOWN_POST, params).subscribe(res => {
      if (res.Item1) {
        this.onClear();
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: res.Item2 });
      } else {
        this.isViewed = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: res.Item2 });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.isViewed = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      } else {
        this.isViewed = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.NetworkErrorMessage });
      }
    });
   }

   onClear() {
    this.form.controls.region_name.reset();
    this.form.controls.order_Num.reset();
    this.form.controls.commdity_type.reset();
    this.form.controls.total_Qty.reset();
    this.form.controls.party_name.reset();
    this.form.controls.godown_name.reset();
    this.form.controls.assigning_qty.reset();
    this.form.controls.remarks_text.reset();
    this.form.controls.spell_cycle.reset();
    this.gdnTenderAllotmentData = [];
    this.OrderNo = null; this.orderNoOptions = [];
    this.Commodity = null; this.PartyName = null; this.AllottedQty = null;
    this.rCode = null; this.RCode = null; this,this.regionOptions = [];
    this.GCode = null; this.gCode = null; this.godownOptions = [];
    this.Remarks = null; this.Quantity = null; 
    this.RegAllotmentID = null; this.GodownAllotementID = null;
    this.isViewed = false; this.isDataAvailable = false;
    this.spellCode = null; this.Spell = null; this.spellOptions = [];
   }

}
