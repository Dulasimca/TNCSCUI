import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { SelectItem, MessageService } from 'primeng/api';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { DatePipe } from '@angular/common';
import { TableConstants } from 'src/app/constants/tableconstants';
import { PathConstants } from 'src/app/constants/path.constants';
import { Dropdown } from 'primeng/primeng';
import { RoleBasedService } from 'src/app/common/role-based.service';
import { HttpErrorResponse } from '@angular/common/http';
import { StatusMessage } from 'src/app/constants/Messages';

@Component({
  selector: 'app-regionallotment',
  templateUrl: './regionallotment.component.html',
  styleUrls: ['./regionallotment.component.css']
})
export class RegionAllotmentComponent implements OnInit {
  canShowMenu: boolean;
  regionName: any;
  tenderAllotmentRegionWiseCols: any[];
  tenderAllotmentRegionWiseData: any;
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
  regions: any; commodityOptions: SelectItem[];
  partyNameOptions: SelectItem[];
  regionOptions: SelectItem[];
  RegionAllotmentID: any;
  rCode: any;
  AllottedQty: any;
  isViewed: boolean = false;
  showGrid: boolean;
  selected: any;
  @ViewChild('commodity') commodityPanel: Dropdown;
  @ViewChild('region') regionPanel: Dropdown;
  @ViewChild('Party') partyNamePanel: Dropdown;

  constructor(private authService: AuthService, private  tableConstants: TableConstants, private roleBasedService: RoleBasedService,
    private restApiService: RestAPIService, private datePipe: DatePipe, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.tenderAllotmentCols = this.tableConstants.TenderAllotmentDetailsCols;
    this.regions = this.roleBasedService.getRegions();
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.restApiService.get(PathConstants.PURCHASE_TENDER_ALLOTMENT_DETAILS_GET).subscribe(data => {
      if(data !== undefined && data !== null && data.length !== 0) {
        let sno = 1;
        data.forEach(x => {
          x.SlNo = sno;
          sno += 1;
          x.TargetDate = this.datePipe.transform(x.TargetDate, 'dd/MM/yyyy');
        });
        this.tenderAllotmentData = data;
      } 
    })
  }

  onSelect(id, type) {
    let commoditySelection = [];
    let regionSelection = [];
    let partyNameSelection = [];
    switch(id) {
      case 'comm':
          if (type === 'enter') {
            this.commodityPanel.overlayVisible = true;
          }
            this.restApiService.get(PathConstants.COMMODITY_BREAK_ITEM_MASTER_MODIFICATION).subscribe(data => {
            if(data !== undefined && data !== null && data.length !== 0) {
              data.forEach(x => {
                commoditySelection.push({ label: x.ITDescription, value: x.ITCode });
              })
              this.commodityOptions = commoditySelection;
              this.commodityOptions.unshift({ label: '-select-', value: null });
            } else { this.commodityOptions = commoditySelection; }
          })
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
              if(x.RCode === this.loggedInRCode) {
              regionSelection.push({ 'label': x.RName, 'value': x.RCode });
              }
            });
            this.regionOptions = regionSelection;
            this.regionOptions.unshift({ label: '-select-', value: null });
          }
        }
        break;
        case 'p_id':
            if(type === 'enter') { this.partyNamePanel.overlayVisible = true; }
            this.restApiService.get(PathConstants.PURCHASE_PARTYNAME_DETAILS).subscribe(data => {
              if(data !== undefined && data !== null && data.length !== 0) {
                data.forEach(x => {
                  partyNameSelection.push({ label: x.PartyName, value: x.PartyID });
                })
                this.partyNameOptions = partyNameSelection;
                this.partyNameOptions.unshift({ label: '-select-', value: null });
              } else { this.partyNameOptions = partyNameSelection; }
            })
            break;
    }
  }

  onSelectedRow(data) {
    this.showPane = true;
    this.AllotmentID = data.AllotmentID;
    this.AllottedQty = (data.Quantity * 1);
}

calculateQty(value) {
  if(value !== undefined && value !== null) {
    const Qty = (value * 1);
    const ExistingQty = (this.AllottedQty * 1);
    if(Qty > ExistingQty) {
      this.Quantity = null;
      this.messageService.clear();
      this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: 'Exceeding!' });
    }
  }
}

onRowSelect(event) {
  this.selected = event;
  this.RegionAllotmentID = event.data.RegAllotmentID;
  this.AllotmentID = event.data.TenderAllotmentID;
  this.rCode = event.data.RCode;
  this.RCode = event.data.RName;
  this.regionOptions = [{ label: event.data.RName, value: event.data.RCode }];
  this.Quantity = (event.data.Quantity * 1);
  this.Remarks = event.data.Remarks;
 // this.AllottedQty = 
}

  onView() {
    this.showGrid = true;
    this.selected = null;
   }

   getRegTenderData() {
     this.showGrid = false;
   }

  onSave() {
    const RegAllotmentID = (this.RegionAllotmentID !== undefined && this.RegionAllotmentID !== null) ? this.RegionAllotmentID : 0;
    const params = {
      'RegAllotmentID': RegAllotmentID,
      'TenderAllotmentID': this.AllotmentID,
      'RCode': this.RCode,
      'Quantity': this.Quantity,
      'Remarks': (this.Remarks !== undefined && this.Remarks !== null) ? this.Remarks : ''
    }

    this.restApiService.post(PathConstants.PURCHASE_TENDER_ALLOTMENT_TO_REGIONAL_POST, params).subscribe(res => {
      if (res.Item1) {
        this.onClear();
        this.onView();
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
    this.showPane = false; this.showGrid = false;
    this.AllottedQty = 0; this.Quantity = null;
    this.PartyCode = null; this.partyID = null; this.partyNameOptions = [];
    this.iCode = null; this.ICode = null; this.commodityOptions = [];
    this.RCode = null; this.rCode = null; this.regionOptions = [];
  }

}
