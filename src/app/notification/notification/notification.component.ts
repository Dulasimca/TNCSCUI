import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared-services/auth.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { RestAPIService } from '../../shared-services/restAPI.service';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from '../../constants/path.constants';
import { StatusMessage } from '../../constants/Messages';
import { TableConstants } from '../../constants/tableconstants';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  NotificationsData: any;
  NotificationsCols: any;
  ID: any;
  Notes: any;
  Reason: any;
  isActive: any;
  canShowMenu: boolean;
  date: any;
  loading: boolean;
  selectedRow: any;

  constructor(private authService: AuthService, private tableConstant: TableConstants, private restApiService: RestAPIService, private datePipe: DatePipe, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.restApiService.get(PathConstants.NOTIFICATIONS).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.NotificationsCols = this.tableConstant.NotificationCols;
        this.NotificationsData = res;
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
  }

  onRowSelect(event) {
    // this.disableOkButton = false;
    this.selectedRow = event.data;
  }

  showSelectedData(event, selectedRow) {
    // this.viewPane = false;
    // this.isViewed = true;
    this.ID = this.selectedRow.Id;
    this.Notes = this.selectedRow.Notes;
    this.Reason = this.selectedRow.Reason;
    this.isActive = this.selectedRow.isActive;
  }


  onView() {
    this.restApiService.get(PathConstants.NOTIFICATIONS).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.NotificationsCols = this.tableConstant.NotificationCols;
        this.NotificationsData = res;
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
  }
  
  onSubmit() {
    const params = {
      'ID': (this.ID !== undefined && this.ID !== null) ? this.ID : '',
      'Notes': this.Notes,
      'Reason': this.Reason,
      'isActive': this.isActive
    };
    this.restApiService.post(PathConstants.NOTIFICATIONS_POST, params).subscribe(res => {
      if (res) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS,
          summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.SuccessMessage
        });
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING, life: 200, sticky: true,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.ValidCredentialsErrorMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
    this.onClear();
  }

  onUpdate() {
    const params = {
      'ID': (this.ID !== undefined && this.ID !== null) ? this.ID : '',
      'Notes': this.Notes,
      'Reason': this.Reason,
      'isActive': 0
    };
    this.restApiService.post(PathConstants.NOTIFICATIONS_POST, params).subscribe(res => {
      if (res) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS,
          summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.SuccessMessage
        });
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING, life: 200, sticky: true,
          summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.ValidCredentialsErrorMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: StatusMessage.SEVERITY_ERROR,
          summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage
        });
      }
    });
    this.onClear();
  }

  onClear() {
    this.Notes = this.Reason = this.isActive = this.ID = null;
  }
}
