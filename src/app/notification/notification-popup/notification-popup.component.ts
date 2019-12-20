import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../shared-services/auth.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { RestAPIService } from '../../shared-services/restAPI.service';
import { HttpParams, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { PathConstants } from '../../constants/path.constants';
import { StatusMessage } from '../../constants/Messages';
import { TableConstants } from '../../constants/tableconstants';

@Component({
  selector: 'app-notification-popup',
  templateUrl: './notification-popup.component.html',
  styleUrls: ['./notification-popup.component.css']
})
export class NotificationPopupComponent implements OnInit {

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
  uploadedFiles: any[] = [];
  Image: any;
  imgsrc = 'https://c.staticblitz.com/assets/client/components/SideMenu/blitz_logo-11cebad97cad4b50bc955cf72f532d1b.png';
  // selectedFile: ImageSnippet;
  selectedFile: File = null;
  noti: any;
  display: boolean = false;

  constructor(private authService: AuthService, private messageService: MessageService, private http: HttpClient, private tableConstant: TableConstants, private restApiService: RestAPIService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.display = true;
    this.noti = (this.authService.isLoggedIn()) ? this.showDialog : null;
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    const params = { 'Type': 1 };
    this.restApiService.getByParameters(PathConstants.NOTIFICATIONS, params).subscribe(res => {
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
    this.selectedRow = event.data;
  }

  showSelectedData(event, selectedRow) {
    this.ID = this.selectedRow.Id;
    this.Notes = this.selectedRow.Notes;
    this.Reason = this.selectedRow.Reason;
    this.isActive = this.selectedRow.isActive;
  }


  onView() {
    const params = { 'Type': 1 };
    this.restApiService.getByParameters(PathConstants.NOTIFICATIONS, params).subscribe(res => {
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
      'Type': 1,
      'ID': 1,
      'Notes': this.Notes,
      'Reason': this.Reason,
      'isActive': 1,
      'ImageName': this.imgsrc
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
          key: 't-err', severity: StatusMessage.SEVERITY_WARNING,
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

  fileChange(e) {
    const file = e.srcElement.files[0];
    this.imgsrc = window.URL.createObjectURL(file);
    this.Image = this.imgsrc;

  }

  onUpload(event) {
    for (let file of event.file) {
      this.uploadedFiles.push(file.name);
      this.Image = this.uploadedFiles;
    }

    this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: 'Image Saved Successfully' });
  }


  onFileselected(event) {
    console.log(event);
    this.selectedFile = <File>event.target.files[0];
  }

  onUp() {
    const fd = new FormData();
    fd.append('image', this.selectedFile, this.selectedFile.name);
    this.http.post("C:\Users\Subash\TNCSCUI\src\assets\layout\images\NotificationPopup", fd).subscribe(res => {
      this.imgsrc = window.URL.createObjectURL(fd);
      console.log(res);
    });
  }

  onClear() {
    this.Notes = this.Reason = this.isActive = this.ID = null;
  }

  showConfirm() {
    this.messageService.clear();
    this.messageService.add({
      key: 'c', sticky: true, severity:'success', summary:'Notification', detail:'Happy New Year'});
}

onConfirm() {
  this.messageService.clear('c');
}

onReject() {
  this.messageService.clear('c');
}

clear() {
  this.messageService.clear();
}

showDialog() {
  this.display = true;
}

  // showAnimationChange(e) {
  //   this.toastObj.animation.show.effect = 'FadeZoomIn';
  // }

  // hideAnimationChange(e) {
  //   this.toastObj.animation.hide.effect = 'FadeZoomIn';
  // }

  // toastShow() {
  //   setTimeout(
  //     () => {
  //       this.toastObj.show();
  //     }, 700);
  // }

  // public get animate(): any {
  //   if (this.enabled) {
  //     return {
  //       type: this.type,
  //       direction: this.direction,
  //       duration: this.duration
  //     };
  //   }

  //   return false;
  // }

  // public get hasDirection(): boolean {
  //   return this.type === 'slide' || this.type === 'expand';
  // }

  // public onToggle(): void {
  //   this.show = !this.show;
  //   this.toggleText = this.show ? "Hide" : "Show";
  // }
}

