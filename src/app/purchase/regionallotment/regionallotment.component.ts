import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { SelectItem, MessageService } from 'primeng/api';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { DatePipe } from '@angular/common';
import { TableConstants } from 'src/app/constants/tableconstants';
import { PathConstants } from 'src/app/constants/path.constants';
import { Dropdown } from 'primeng/primeng';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { StatusMessage } from 'src/app/constants/Messages';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-regionallotment',
  templateUrl: './regionallotment.component.html',
  styleUrls: ['./regionallotment.component.css']
})
export class RegionAllotmentComponent implements OnInit {
  canShowMenu: boolean;
  maxDate: Date = new Date();
  regionName: any;
  tenderAllotmentRegionWiseCols: any[];
  tenderAllotmentRegionWiseData: any = [];
  tenderAllotmentCols: any;
  tenderAllotmentData: any;
  PartyCode: any;
  partyID: any;
  Quantity: any;
  Remarks: any;
  showPane: boolean;
  AllotmentID: any;
  RCode: any;
  ICode: any;
  iCode: any;
  roleId: any;
  loggedInRCode: string;
  regions: any;
  partyNameOptions: SelectItem[];
  regionOptions: SelectItem[];
  orderNoOptions: SelectItem[];
  spellOptions: SelectItem[];
  rCode: any;
  AllottedQty: any;
  isViewed: boolean = false;
  isDataAvailable: boolean;
  Commodity: any;
  Rate: any;
  Spell: any;
  OrderNo: any;
  TotalDays: any;
  TargetDate: any;
  NetWt: any;
  showErrMsg: boolean = false;
  itemList: any = [];
  @ViewChild('orderNum') oredrNoPanel: Dropdown;
  @ViewChild('region') regionPanel: Dropdown;
  @ViewChild('party') partyNamePanel: Dropdown;
  @ViewChild('spell') spellPanel: Dropdown;
  @ViewChild('f') form: NgForm;

  constructor(private authService: AuthService, private tableConstants: TableConstants, private roleBasedService: RoleBasedService,
    private restApiService: RestAPIService, private datePipe: DatePipe, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.regions = this.roleBasedService.getRegions();
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.loggedInRCode = this.authService.getUserAccessible().rCode;

  }

  onSelect(id, type) {
    let oredrNoSelection = [];
    let regionSelection = [];
    let partyNameSelection = [];
    switch (id) {
      case 'order':
        if (type == 'enter') {
          this.oredrNoPanel.overlayVisible = true;
        }
        if (this.orderNoOptions === undefined) {
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
        }
        break;
      case 'spell':
      case 'order':
        if (type == 'enter') {
          this.spellPanel.overlayVisible = true;
        }
        if (this.spellOptions === undefined) {
          this.spellOptions = [{ label: '-select-', value: null }, { label: 'Spell1', value: 1 }, { label: 'Spell2', value: 2 },
          { label: 'Spell3', value: 3 }, { label: 'Spell4', value: 4 }, { label: 'Spell5', value: 5 }];
        }
        break;
      case 'reg':
        this.regions = this.roleBasedService.regionsData;
        if (type === 'enter') {
          this.regionPanel.overlayVisible = true;
        }
        if (this.roleId === 1) {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              regionSelection.push({ 'label': x.RName, 'value': x.RCode });
            });
            this.regionOptions = regionSelection;
            this.regionOptions.unshift({ label: '-select-', value: null });
          }
        } else {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              if (x.RCode === this.loggedInRCode) {
                regionSelection.push({ 'label': x.RName, 'value': x.RCode });
              }
            });
            this.regionOptions = regionSelection;
            this.regionOptions.unshift({ label: '-select-', value: null });
          }
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

  onChangeOrderNo() {
    const params = new HttpParams().set('value', (this.OrderNo !== undefined) ? this.OrderNo : '').append('Type', '2');
    this.restApiService.getByParameters(PathConstants.PURCHASE_TENDER_ALLOTMENT_DETAILS_GET, params).subscribe(data => {
      if (data !== undefined && data !== null && data.length !== 0) {
        data.forEach(x => {
          this.AllottedQty = (x.Quantity * 1);
          this.Commodity = x.ITDescription;
          this.TotalDays = (x.TotalDays * 1);
          this.Quantity = (x.AssignedQty * 1);
          this.Rate = (x.Rate * 1);
          this.Remarks = x.Remarks;
          this.TargetDate = this.datePipe.transform(x.TargetDate, 'dd/MM/yyyy');
          this.partyID = x.PartyCode;
          this.PartyCode = x.PartyName;
          this.partyNameOptions = [{ label: x.PartyName, value: x.PartyCode }];
        })
        if(this.partyID !== null && this.partyID !== undefined && this.PartyCode !== undefined
          && this.PartyCode !== null && this.Quantity !== undefined && this.Quantity !== null
          && this.Rate !== null && this.Rate !== undefined){
            this.isDataAvailable = true;
        } else {
          this.isDataAvailable = false;
        }
      }
    });
  }

  calculateQty(value) {
    if (value !== null && value !== undefined && value !== '') {
      let Qty = (value * 1);
      if (this.AllottedQty !== undefined && this.AllottedQty !== null) {
        let AllottedQty = (this.AllottedQty * 1);
        if (Qty > AllottedQty) {
          this.Quantity = null;
          this.showErrMsg = true;
        } else {
          this.showErrMsg = false;
        }
      }
    }
  }

  onView() {
    this.showPane = true;
    this.restApiService.get(PathConstants.PURCHASE_TENDER_ALLOTMENT_DETAILS_GET).subscribe(data => {
      if(data.length !== 0 && data !== null && data !== undefined) {
        this.tenderAllotmentCols = this.tableConstants.TenderAllotmentDetailsCols;
        this.tenderAllotmentData = data;
        let sno = 1;
        this.tenderAllotmentData.forEach(x => {
          x.SlNo = sno;
          sno += 1;
          x.Quantity = ((x.AllottedQty !== undefined && x.AllottedQty !== null) ? (x.AllottedQty * 1) : 0)
          + ((x.AssignedQty !== undefined && x.AssignedQty !== null) ? (x.AssignedQty * 1) : 0);
          x.TargetDate = this.datePipe.transform(x.TargetDate, 'dd/MM/yyyy');
        })
      }
    })
  }

  onEnter() {
    let sno = 1;
    this.itemList.push({
      OrderNumber: this.OrderNo,
      RCode: this.RCode.value,
      RName: this.RCode.label,
      Spell: this.Spell.value,
      Quantity: this.NetWt,
      SpellName: this.Spell.label,
    })
    this.tenderAllotmentRegionWiseCols = this.tableConstants.TenderAllotmentToRegionCols;
    this.tenderAllotmentRegionWiseData = this.itemList;
    this.tenderAllotmentRegionWiseData.forEach(x => {
      x.SlNo = sno;
      sno += 1;
    })
  }

  onSave(type) {
    if(type === '1') {
    const AllotmentID = (this.AllotmentID !== undefined && this.AllotmentID !== null) ? this.AllotmentID : 0;
    const params = {
      'AllotmentID': AllotmentID,
      'PartyCode': this.PartyCode,
      'AssignedQty': this.Quantity,
      'Rate': this.Rate,
      'Spell': this.Spell,
      'OrderNumber': this.OrderNo,
      'TotalDays': this.TotalDays,
      'TargetDate': this.datePipe.transform(this.TargetDate, 'MM/dd/yyyy'),
      'Remarks': (this.Remarks !== undefined && this.Remarks !== null) ? this.Remarks : ''
    }

    this.restApiService.post(PathConstants.PURCHASE_TENDER_ALLOTMENT_DETAILS_POST, params).subscribe(res => {
      if (res.Item1) {
      //  this.onClear();
        this.isDataAvailable = true;
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
  else {
    this.restApiService.post(PathConstants.PURCHASE_TENDER_ALLOTMENT_TO_REGIONAL_POST, this.itemList).subscribe(res => {
      // if(res.Item1) {
        
      // }
    })
  }
  }

  onClear() {
    this.form.controls.commdity_type.reset();
    this.form.controls.order_Num.reset();
    this.form.controls.total_Qty.reset();
    this.form.controls.target_Date.reset();
    this.form.controls.party_Name.reset();
    this.form.controls.assigning_qty.reset();
    this.form.controls.total_days.reset();
    this.form.controls.rate.reset();
    this.form.controls.spell_cycle.reset();
    this.form.controls.remarks_text.reset();
    this.showPane = false; this.showErrMsg = false;
    this.AllottedQty = 0; this.Quantity = null;
    this.PartyCode = null; this.partyID = null; this.partyNameOptions = [];
    this.OrderNo = null; this.orderNoOptions = undefined;
    this.RCode = null; this.rCode = null; this.regionOptions = [];
    this.TotalDays = null; this.TargetDate = null;
    this.isViewed = false; this.tenderAllotmentRegionWiseData = [];
    this.spellOptions = undefined; this.Spell = null;
    this.Rate = null; this.Remarks = null;
    this.Commodity = null;
  }

}
