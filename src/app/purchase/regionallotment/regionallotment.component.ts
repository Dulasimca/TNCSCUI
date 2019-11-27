import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { SelectItem, MessageService } from 'primeng/api';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { DatePipe } from '@angular/common';
import { TableConstants } from 'src/app/constants/tableconstants';
import { PathConstants } from 'src/app/constants/path.constants';
import { Dropdown, Calendar, ConfirmationService } from 'primeng/primeng';
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
  tenderAllotmentRegionWiseCols: any[];
  tenderAllotmentRegionWiseData: any = [];
  tenderAllotmentCols: any;
  tenderAllotmentData: any = [];
  PartyCode: any;
  partyID: any;
  Quantity: any;
  Remarks: any;
  showPane: boolean;
  AllotmentID: any;
  PartyRegion: any;
  RCode: any;
  ICode: any;
  iCode: any;
  roleId: any;
  loggedInRCode: string;
  regions: any;
  partyNameOptions: SelectItem[];
  regionOptions: SelectItem[];
  partyRegionOptions: SelectItem[];
  orderNoOptions: SelectItem[];
  spellOptions: SelectItem[];
  rCode: any;
  AllottedQty: any;
  isViewed: boolean = false;
  Commodity: any;
  Rate: any;
  Spell: any;
  OrderNo: any;
  TotalDays: any;
  TargetDate: any;
  showErrMsg: boolean = false;
  RegAllotmentID: any;
  tDate: any;
  blockRegQty: boolean;
  allotmentList: any = [];
  blockEntry: boolean;
  spellCode: any;
  splicedQty: any;
  selectedOrderNo: any;
  selectedParty: any;
  selectedPartyID: any;
  selectedSpell: any;
  selectedSpellCode: any;
  RegAllottedQty: any;
  RegQty: any;
  isSelected: boolean = false;
  showRErrMsg: boolean;
  splicedRegQty: any;
  blockScreen: boolean;
  loading: boolean;
  completedDate: Date;
  PartyRCode: any;
  selectedPartyRegion: any;
  @ViewChild('orderNum') oredrNoPanel: Dropdown;
  @ViewChild('partyregion') partyRegionPanel: Dropdown;
  @ViewChild('region') regionPanel: Dropdown;
  @ViewChild('party') partyNamePanel: Dropdown;
  @ViewChild('spell') spellPanel: Dropdown;
  @ViewChild('f') form: NgForm;
  @ViewChild('rf') regForm: NgForm;



  constructor(private authService: AuthService, private tableConstants: TableConstants, private roleBasedService: RoleBasedService,
    private restApiService: RestAPIService, private datePipe: DatePipe,
    private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.regions = this.roleBasedService.getRegions();
    this.roleId = JSON.parse(this.authService.getUserAccessible().roleId);
    this.loggedInRCode = this.authService.getUserAccessible().rCode;
    this.tenderAllotmentRegionWiseCols = this.tableConstants.TenderAllotmentToRegionCols;
    this.tenderAllotmentCols = this.tableConstants.TenderAllotmentDetailsCols;
  }

  onSelect(id, type) {
    let oredrNoSelection = [];
    let regionSelection = [];
    let partyRegionSelection = [];
    let partyNameSelection = [];
    switch (id) {
      case 'order':
        if (type == 'enter') {
          this.oredrNoPanel.overlayVisible = true;
        }
        const params = new HttpParams().set('Type', '1');
        this.restApiService.getByParameters(PathConstants.PURCHASE_TENDER_ORDER_NO_GET, params).subscribe(res => {
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
        this.spellOptions = [{ label: '-select-', value: null }, { label: 'Spell1', value: 1 }, { label: 'Spell2', value: 2 },
        { label: 'Spell3', value: 3 }, { label: 'Spell4', value: 4 }, { label: 'Spell5', value: 5 }];
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
      case 'preg':
        this.regions = this.roleBasedService.regionsData;
        if (type === 'enter') {
          this.partyRegionPanel.overlayVisible = true;
        }
        if (this.roleId === 1) {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              partyRegionSelection.push({ 'label': x.RName, 'value': x.RCode });
            });
            this.partyRegionOptions = partyRegionSelection;
            this.partyRegionOptions.unshift({ label: '-select-', value: null });
          }
        } else {
          if (this.regions !== undefined) {
            this.regions.forEach(x => {
              if (x.RCode === this.loggedInRCode) {
                regionSelection.push({ 'label': x.RName, 'value': x.RCode });
              }
            });
            this.partyRegionOptions = regionSelection;
            this.partyRegionOptions.unshift({ label: '-select-', value: null });
          }
        }
        break;
      case 'p_id':
        if (type === 'enter') { this.partyNamePanel.overlayVisible = true; }
        if (this.PartyRegion !== undefined && this.PartyRegion !== null) {
          const params = new HttpParams().set('RCode', this.PartyRegion).append('Type', '1');
          this.restApiService.getByParameters(PathConstants.PARTY_MASTER, params).subscribe(data => {
            if (data !== undefined && data !== null && data.length !== 0) {
              data.forEach(p => {
                partyNameSelection.push({ label: p.PartyName, value: p.PartyID });
              })
              this.partyNameOptions = partyNameSelection;
              this.partyNameOptions.unshift({ label: '-select-', value: null });
            } else { this.partyNameOptions = partyNameSelection; }
          })
        } else {
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: 'Please select the region!' });
        }
        break;
    }
  }

  onChangeOrderNo(type) {
    if (this.OrderNo !== undefined && this.OrderNo !== null) {
      this.loading = true;
      const rcode = (this.RCode !== undefined && this.RCode !== null) ? ((this.RCode.value !== null && this.RCode.value !== undefined) ? this.RCode.value : this.rCode) : '-';
      const params = {
        'OrderNo': (this.OrderNo !== undefined) ? this.OrderNo : '',
        'RCode': rcode,
        'Spell': (this.selectedSpellCode !== null && this.selectedSpellCode !== undefined) ? this.selectedSpellCode : 0,
        'Type': type,
        'PartyCode': (this.selectedPartyID !== undefined && this.selectedPartyID !== null) ? this.selectedPartyID : 0
      };
      this.restApiService.post(PathConstants.PURCHASE_TENDER_DATA_BY_ORDER_NO, params).subscribe(data => {
        if (data !== undefined && data !== null && data.length !== 0) {
          if (type === '1') {
            this.loading = false;
            this.tenderAllotmentData = [];
            let sno = 1;
            let totalQty = 0;
            data.forEach(x => {
              this.AllottedQty = ((x.Quantity !== null && x.Quantity !== undefined) ? (x.Quantity * 1) : 0)
                + ((x.AdditionalQty !== null && x.AdditionalQty !== undefined) ? (x.AdditionalQty * 1) : 0);
              this.Commodity = x.ITDescription;
              this.completedDate = new Date(x.CompletedDate);
              x.SlNo = sno;
              sno += 1;
              x.tDate = this.datePipe.transform(x.TargetDate, 'MM/dd/yyyy');
              x.TargetDate = this.datePipe.transform(x.TargetDate, 'dd/MM/yyyy');
              x.SpellName = 'Spell' + x.Spell;
              totalQty += (x.AssignedQty * 1);
            })
            if (data[0].PartyCode !== null && data[0].PartyCode !== undefined && data[0].Spell !== null &&
              data[0].Spell !== undefined && data[0].AssignedQty !== null && data[0].AssignedQty !== undefined) {
              this.tenderAllotmentData = data;
              this.tenderAllotmentData.push({ OrderNumber: 'Total', AssignedQty: totalQty });
            } else {
              this.tenderAllotmentData = [];
            }
            if ((this.AllottedQty * 1) === totalQty) {
              this.blockEntry = true;
            } else {
              this.blockEntry = false;
            }
          } else {
            this.tenderAllotmentRegionWiseData = [];
            this.loading = false;
            let sno = 1;
            let totalQty = 0;
            data.forEach(x => {
              x.SlNo = sno;
              sno += 1;
              x.SpellName = 'Spell' + x.Spell;
              x.SelectedOrderNo = this.selectedOrderNo;
              totalQty += (x.Quantity * 1);
            })
            if (data[0].RCode !== null && data[0].RCode !== undefined && data[0].Quantity !== null &&
              data[0].Quantity !== undefined) {
              this.tenderAllotmentRegionWiseData = data;
              this.tenderAllotmentRegionWiseData.push({ SelectedOrderNo: 'Total', Quantity: totalQty });
            } else {
              this.tenderAllotmentRegionWiseData = [];
            }

            if ((this.RegAllottedQty * 1) === totalQty) {
              this.blockRegQty = true;
            } else {
              this.blockRegQty = false;
            }
          }
        } else {
          this.loading = false;
          // this.messageService.clear();
          // this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecordMessage });
        }
      });
    } else {
      this.onClear('3');
    }
  }

  checkTargetDate(date) {
    if (date !== null && date !== undefined && this.completedDate !== null && this.completedDate !== undefined) {
      const cDate = this.completedDate.getDate();
      const cMonth = this.completedDate.getMonth() + 1;
      const cYear = this.completedDate.getFullYear();
      const getTargetDate = new Date(date);
      const tDate = getTargetDate.getDate();
      const tMnth = getTargetDate.getMonth() + 1;
      const tYear = getTargetDate.getFullYear();
      if ((cDate === tDate && (cMonth < tMnth && cYear <= tYear)) || (cMonth < tMnth && cYear <= tYear)
        || (cDate < tDate && (cMonth === tMnth && cYear === tYear)) || (cYear < tYear)) {
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_ALERT, detail: StatusMessage.PurchaseTargetDateValidation });
      }
    }
  }

  calculateQty(value, type) {
    if (value !== null && value !== undefined && value !== '') {
      let Qty = (value * 1);
      switch (type) {
        case '1':
          if (this.AllottedQty !== undefined && this.AllottedQty !== null) {
            let AllottedQty = (this.AllottedQty * 1);
            if (Qty > AllottedQty) {
              this.Quantity = null;
              this.showErrMsg = true;
            } else if (this.tenderAllotmentData.length !== 0) {
              let enteredQty = 0;
              this.tenderAllotmentData.forEach(x => {
                if (x.OrderNumber === 'Total') {
                  enteredQty += (x.AssignedQty * 1);
                }
              })
              let remainingQty = ((AllottedQty * 1) - (enteredQty * 1));
              if (Qty > remainingQty && remainingQty !== 0) {
                this.Quantity = null;
                this.showErrMsg = true;
              } else {
                this.showErrMsg = false;
              }
            } else if (this.tenderAllotmentData.length === 0 && this.isViewed) {
              const splicedQty = (this.splicedQty !== null && this.splicedQty !== undefined) ? (this.splicedQty * 1) : 0;
              let remainingQty = (AllottedQty * 1);
              if (Qty > remainingQty && remainingQty !== 0) {
                this.Quantity = null;
                this.showErrMsg = true;
              } else {
                this.showErrMsg = false;
              }
            } else {
              this.showErrMsg = false;
            }
          }
          break;
        case '2':
          if (this.RegAllottedQty !== undefined && this.RegAllottedQty !== null) {
            let RegAllottedQty = (this.RegAllottedQty * 1);
            if (Qty > RegAllottedQty) {
              this.RegQty = null;
              this.showRErrMsg = true;
            } else if (this.tenderAllotmentRegionWiseData.length !== 0) {
              let enteredQty = 0;
              this.tenderAllotmentRegionWiseData.forEach(x => {
                if (x.SelectedOrderNo === 'Total') {
                  enteredQty += (x.Quantity * 1);
                }
              })
              let remainingQty = ((RegAllottedQty * 1) - (enteredQty * 1));
              if (Qty > remainingQty && remainingQty !== 0) {
                this.RegQty = null;
                this.showRErrMsg = true;
              } else {
                this.showRErrMsg = false;
              }
            } else if (this.tenderAllotmentData.length === 0 && this.isSelected) {
              const splicedRegQty = (this.splicedRegQty !== null && this.splicedRegQty !== undefined) ? (this.splicedRegQty * 1) : 0;
              let remainingQty = (RegAllottedQty * 1);
              if (Qty > remainingQty && remainingQty !== 0) {
                this.RegQty = null;
                this.showRErrMsg = true;
              } else {
                this.showRErrMsg = false;
              }
            } else {
              this.showRErrMsg = false;
            }
          }
          break;
      }
    }
  }

  onSelectedRow(data, index, type) {
    if (type === '1') {
      this.isViewed = true;
      this.form.form.markAsUntouched();
      this.form.form.markAsPristine();
      this.AllotmentID = data.AllotmentID;
      this.PartyCode = data.PartyName;
      this.partyID = data.PartyCode;
      this.partyNameOptions = [{ label: data.PartyName, value: data.PartyCode }];
      this.Spell = data.SpellName;
      this.spellCode = data.Spell;
      this.spellOptions = [{ label: data.SpellName, value: data.Spell }];
      this.PartyRegion = data.PartyRegion;
      this.PartyRCode = data.PartyRCode;
      this.partyRegionOptions = [{ label: data.PartyRegion, value: data.PartyRCode }];
      this.Quantity = (data.AssignedQty * 1);
      this.TargetDate = data.TargetDate;
      this.tDate = data.tDate;
      this.TotalDays = data.TotalDays;
      this.Rate = data.Rate;
      this.Remarks = data.Remarks;
      this.partyNamePanel.showClear = false;
      this.spellPanel.showClear = false;
      this.oredrNoPanel.showClear = false;
      this.tenderAllotmentData.splice(index, 1);
      this.splicedQty = this.tenderAllotmentData[index].AssignedQty;
      if (this.tenderAllotmentData.length === 1 && this.tenderAllotmentData[0].OrderNumber === 'Total') {
        this.tenderAllotmentData = [];
      } else {
        const lastIndex = this.tenderAllotmentData.length - 1;
        let sno = 1;
        let totalQty = 0;
        this.tenderAllotmentData.forEach(x => {
          if (x.OrderNumber !== 'Total') {
            x.SlNo = sno;
            sno += 1;
            totalQty += (x.AssignedQty * 1);
          }
        })
        this.tenderAllotmentData[lastIndex].AssignedQty = totalQty;
        if ((this.AllottedQty * 1) === totalQty) {
          this.blockEntry = true;
        } else {
          this.blockEntry = false;
        }
      }
    } else if (type === '2') {
      this.tenderAllotmentRegionWiseData.length = 0;
      this.showPane = true;
      this.selectedPartyRegion = data.PartyRegion;
      this.selectedOrderNo = data.OrderNumber;
      this.selectedParty = data.PartyName;
      this.selectedPartyID = data.PartyCode;
      this.selectedSpell = data.SpellName;
      this.selectedSpellCode = data.Spell;
      this.RegAllottedQty = (data.AssignedQty * 1);
      this.onChangeOrderNo(type);
    } else {
      this.RegAllotmentID = data.RegAllotementID;
      this.isSelected = true;
      this.rCode = data.RCode;
      this.RCode = data.RName;
      this.regionOptions = [{ label: data.RName, value: data.RCode }];
      this.Spell = data.Spell;
      this.RegQty = (data.Quantity * 1);
      this.regionPanel.showClear = false;
      this.tenderAllotmentRegionWiseData.splice(index, 1);
      this.splicedRegQty = this.tenderAllotmentRegionWiseData[index].Quantity;
      if (this.tenderAllotmentRegionWiseData.length === 1 && this.tenderAllotmentRegionWiseData[0].SelectedOrderNo === 'Total') {
        this.tenderAllotmentRegionWiseData = [];
      } else {
        const lastIndex = this.tenderAllotmentRegionWiseData.length - 1;
        let sno = 1;
        let totalQty = 0;
        this.tenderAllotmentRegionWiseData.forEach(x => {
          if (x.SelectedOrderNo !== 'Total') {
            x.SlNo = sno;
            sno += 1;
            totalQty += (x.Quantity * 1);
          }
        })
        this.tenderAllotmentRegionWiseData[lastIndex].Quantity = totalQty;
        if ((this.RegAllottedQty * 1) === totalQty) {
          this.blockRegQty = true;
        } else {
          this.blockRegQty = false;
        }
      }
    }
  }

  checkDuplicates(type): boolean {
    let result: boolean;
    if (type === '1') {
      if (this.tenderAllotmentData.length !== 0) {
        for (let k = 0; k < this.tenderAllotmentData.length - 1; k++) {
          if (this.tenderAllotmentData[k].Spell === this.Spell
            && this.tenderAllotmentData[k].PartyCode === this.PartyCode.value) {
            result = false;
            break;
          } else {
            result = true;
            continue;
          }
        }
      } else { result = true; }
      return result;
    } else if (type === '2') {
      if (this.tenderAllotmentRegionWiseData.length !== 0) {
        for (let k = 0; k < this.tenderAllotmentRegionWiseData.length - 1; k++) {
          if (this.tenderAllotmentRegionWiseData[k].RCode === this.RCode.value
            && this.tenderAllotmentRegionWiseData[k].PartyCode === this.selectedPartyID) {
            result = false;
            break;
          } else {
            result = true;
            continue;
          }
        }
      } else {
        result = true;
      }
      return result;
    }
    else {
      return false;
    }

  }

  resetFields(id) {
    if (id === 'preg') { this.PartyCode = null; }
  }

  onSave(type) {
    let result = this.checkDuplicates(type);
    if (type === '1' && result) {
      this.blockScreen = true;
      const AllotmentID = (this.AllotmentID !== undefined && this.AllotmentID !== null) ? this.AllotmentID : 0;
      const params = {
        'AllotmentID': AllotmentID,
        'PartyCode': (this.PartyCode.value !== undefined && this.PartyCode.value !== null) ? this.PartyCode.value : this.partyID,
        'AssignedQty': this.Quantity,
        'Rate': this.Rate,
        'OrderNumber': this.OrderNo,
        'TotalDays': this.TotalDays,
        'Spell': (this.spellCode !== null && this.spellCode !== undefined) ? this.spellCode : this.Spell,
        'TargetDate': (this.tDate !== undefined && this.tDate !== null) ? this.tDate : this.datePipe.transform(this.TargetDate, 'MM/dd/yyyy'),
        'Remarks': (this.Remarks !== undefined && this.Remarks !== null) ? this.Remarks : ''
      }
      this.restApiService.post(PathConstants.PURCHASE_TENDER_ALLOTMENT_DETAILS_POST, params).subscribe(res => {
        if (res.Item1) {
          this.onChangeOrderNo(type);
          this.onClear(type);
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.SuccessMessage });
        } else {
          this.isViewed = false;
          this.blockScreen = false;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
        }
      }, (err: HttpErrorResponse) => {
        if (err.status === 0 || err.status === 400) {
          this.isViewed = false;
          this.blockScreen = false;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
        } else {
          this.isViewed = false;
          this.blockScreen = false;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.NetworkErrorMessage });
        }
      });
    } else if (type === '1' && !result) {
      this.messageService.clear();
      this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: 'you cannot allot same party for same spell again!' });
    } else if (type === '2' && result) {
      this.blockScreen = true;
      const RegAllotmentID = (this.RegAllotmentID !== undefined && this.RegAllotmentID !== null) ? this.RegAllotmentID : 0;
      const params = {
        'RegAllotmentID': RegAllotmentID,
        'RCode': (this.RCode.value !== undefined && this.RCode.value !== null) ? this.RCode.value : this.rCode,
        'OrderNumber': this.selectedOrderNo,
        'Spell': this.selectedSpellCode,
        'Quantity': this.RegQty,
        'PartyCode': this.selectedPartyID
      }
      this.restApiService.post(PathConstants.PURCHASE_TENDER_ALLOTMENT_TO_REGIONAL_POST, params).subscribe(res => {
        if (res.Item1) {
          this.onChangeOrderNo(type);
          this.onClear(type);
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: res.Item2 });
        } else {
          this.blockScreen = false;
          this.isSelected = false;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: res.Item2 });
        }
      }, (err: HttpErrorResponse) => {
        if (err.status === 0 || err.status === 400) {
          this.blockScreen = false;
          this.isSelected = false;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
        } else {
          this.blockScreen = false;
          this.isSelected = false;
          this.messageService.clear();
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.NetworkErrorMessage });
        }
      });
    } else {
      this.blockScreen = false;
      this.messageService.clear();
      this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: 'you cannot allot same region for same spell and party again!' });
    }
  }

  onClear(type) {
    if (type === '1') {
      this.form.controls.target_Date.reset();
      this.form.controls.party_Name.reset();
      this.form.controls.assigning_qty.reset();
      this.form.controls.total_days.reset();
      this.form.controls.rate.reset();
      this.form.controls.remarks_text.reset();
      this.form.controls.spell_cycle.reset();
      this.form.controls.party_region.reset();
      this.form.form.markAsUntouched();
      this.form.form.markAsPristine();
      this.AllotmentID = null;
      this.showPane = false; this.showErrMsg = false;
      this.Quantity = null; this.tDate = null;
      this.PartyRegion = null; this.PartyRCode = null; this.partyRegionOptions = [];
      this.PartyCode = null; this.partyID = null; this.partyNameOptions = [];
      this.Spell = null; this.spellCode = null; this.spellOptions = [];
      this.TotalDays = null; this.TargetDate = null;
      this.isViewed = false; this.tenderAllotmentRegionWiseData = [];
      this.Rate = null; this.Remarks = null; this.blockEntry = false;
      this.splicedQty = 0; this.blockScreen = false;
    } else if (type === '2') {
      this.regForm.controls.region_name.reset();
      this.regForm.controls.splitted_reg_qty.reset();
      this.regForm.form.markAsUntouched();
      this.regForm.form.markAsPristine();
      this.RegAllotmentID = null; this.isSelected = false;
      this.RCode = null; this.rCode = null; this.regionOptions = [];
      this.blockRegQty = false; this.splicedRegQty = 0;
      this.tenderAllotmentRegionWiseData = [];
      this.blockScreen = false;
    } else if (type === '3') {
      this.form.controls.commdity_type.reset();
      this.form.controls.order_Num.reset();
      this.form.controls.total_Qty.reset();
      this.form.controls.target_Date.reset();
      this.form.controls.party_Name.reset();
      this.form.controls.assigning_qty.reset();
      this.form.controls.total_days.reset();
      this.form.controls.rate.reset();
      this.form.controls.remarks_text.reset();
      this.form.controls.spell_cycle.reset();
      this.form.controls.party_region.reset();
      this.form.form.markAsUntouched();
      this.form.form.markAsPristine();
      this.showPane = false; this.showErrMsg = false;
      this.AllottedQty = 0; this.Quantity = null;
      this.PartyCode = null; this.partyID = null; this.partyNameOptions = [];
      this.PartyRegion = null; this.PartyRCode = null; this.partyRegionOptions = [];
      this.OrderNo = null; this.orderNoOptions = [];
      this.TotalDays = null; this.TargetDate = null;
      this.isViewed = false; this.tenderAllotmentData = [];
      this.Rate = null; this.Remarks = null; this.splicedQty = 0;
      this.Commodity = null; this.blockEntry = false;
      this.AllotmentID = null; this.blockScreen = false;
    } else {
      this.regForm.controls.selected_order_Num.reset();
      this.regForm.controls.selected_commdity_type.reset();
      this.regForm.controls.selected_party_name.reset();
      this.regForm.controls.selected_spell.reset();
      this.regForm.controls.selected_total_Qty.reset();
      this.regForm.controls.region_name.reset();
      this.regForm.controls.selected_party_region.reset();
      this.regForm.controls.splitted_reg_qty.reset();
      this.regForm.form.markAsUntouched();
      this.regForm.form.markAsPristine();
      this.selectedPartyRegion = null; this.Commodity = null;
      this.selectedPartyID = null; this.selectedParty = null;
      this.selectedSpellCode = null; this.selectedSpell = null;
      this.selectedOrderNo = null; this.RegAllottedQty = null;
      this.RegAllotmentID = null; this.RegQty = null;
      this.RCode = null; this.rCode = null; this.regionOptions = [];
      this.tenderAllotmentRegionWiseData = [];
      this.blockRegQty = false; this.splicedRegQty = 0;
      this.RegAllotmentID = null; this.blockScreen = false;
      this.isSelected = false;
    }
  }
}
