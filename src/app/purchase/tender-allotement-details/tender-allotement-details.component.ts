import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Dropdown, MessageService } from 'primeng/primeng';
import { NgForm } from '@angular/forms';
import { TableConstants } from 'src/app/constants/tableconstants';
import { AuthService } from 'src/app/shared-services/auth.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { DatePipe } from '@angular/common';
import { StatusMessage } from 'src/app/constants/Messages';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-tender-allotement-details',
  templateUrl: './tender-allotement-details.component.html',
  styleUrls: ['./tender-allotement-details.component.css']
})
export class TenderAllotementDetailsComponent implements OnInit {
  isShowGrid: boolean;
  canShowMenu: boolean;
  tenderAllotmentData: any;
  tenderAllotmentCols: any;
  tenderIdOptions: SelectItem[];
  partyNameOptions: SelectItem[];
  TotalDays: any;
  PartyType: any;
  TargetDate: any;
  maxDate: Date = new Date();
  TenderId: any;
  Quantity: any;
  Remarks: any;
  isViewed: boolean;
  AllotmentID: any;
  TenderDetID: any;
  PartyCode: any;
  tenderAllotmentGodwonWiseData : any;
  tenderAllotmentGodwonWiseCols: any;
  showPane:any;
  regionOptions:any;
  GCode:any;
  commodityOptions:any;
  ICode:any;

  @ViewChild('TenderID') tenderIDPanel: Dropdown;
  @ViewChild('Party') partyNamePanel: Dropdown;
  @ViewChild('f') form: NgForm;
  
  constructor(private authService: AuthService, private  tableConstants: TableConstants, 
    private restApiService: RestAPIService, private datePipe: DatePipe, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.tenderAllotmentCols = this.tableConstants.TenderAllotmentDetailsCols;
  }

  onSelect(type, id) {
    let partyNameSelection = [];
    let tenderIDSelection = [];
    switch(id){
      case 't_id':
        if(type === 'enter') { this.tenderIDPanel.overlayVisible = true; }
        this.restApiService.get(PathConstants.PURCHASE_TENDERID_DETAILS).subscribe(data => {
          if(data !== undefined && data !== null && data.length !== 0) {
            data.forEach(x => {
              tenderIDSelection.push({ label: x.TenderId, value: x.TenderDetID });
            })
            this.tenderIdOptions = tenderIDSelection;
            this.tenderIdOptions.unshift({ label: '-select-', value: null });
          } else { this.tenderIdOptions = tenderIDSelection; }
        })
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

  onView() {
    this.isShowGrid = true;
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

  onSelectedRow(data) {
        this.isViewed = true;
        this.AllotmentID = data.AllotmentID;
        this.TenderId = data.TenderID;
        this.TenderDetID = data.TenderDetID;
        this.tenderIdOptions = [{ label: data.TenderID, value: data.TenderDetID }];
        this.TargetDate = data.TargetDate;
        this.Quantity = data.Quantity;
        this.Remarks = data.Remarks;
        this.TotalDays = data.TotalDays;
        this.PartyType = data.PartyName;
        this.PartyCode = data.PartyCode;
        this.partyNameOptions = [{ label: data.PartyName, value: data.PartyCode }];
  }

  onSave() {
    const AllotmentID = (this.AllotmentID !== undefined && this.AllotmentID !== null) ? this.AllotmentID : 0;
    const params = {
      'AllotmentID': AllotmentID,
      'PartyCode': (this.PartyType.value !== undefined && this.PartyType.value !== null) ? this.PartyType.value : this.PartyCode,
      'TenderDetId': (this.TenderId.value !== undefined && this.TenderId.value !== null) ? this.TenderId.value : this.TenderDetID,
      'Quantity': this.Quantity,
      'TotalDays': this.TotalDays,
      'TargetDate': this.datePipe.transform(this.TargetDate, 'MM/dd/yyyy'),
      'Remarks': (this.Remarks !== undefined && this.Remarks !== null) ? this.Remarks : ''
    }
    this.restApiService.post(PathConstants.PURCHASE_TENDER_ALLOTMENT_DETAILS_POST, params).subscribe(res => {
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
    this.form.controls.Tender_Id.reset();
    this.form.controls.qty.reset();
    this.form.controls.Party_Name.reset();
    this.form.controls.Target_Date.reset();
    this.form.controls.Total_Days.reset();
    this.form.controls.RemarksText.reset();
    this.isViewed = false;
    this.PartyType = null; this.PartyCode = null; this.partyNameOptions = []; 
    this.TenderId = null; this.TenderDetID = null; this.tenderIdOptions = [];
    this.TargetDate = null; this.Quantity = null;
    this.TotalDays = null; this.Remarks = null; this.AllotmentID = null;
  }

}
