import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../shared-services/auth.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { RestAPIService } from '../../shared-services/restAPI.service';
import { HttpParams, HttpErrorResponse, HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { PathConstants } from '../../constants/path.constants';
import { StatusMessage } from '../../constants/Messages';
import { TableConstants } from '../../constants/tableconstants';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { GolbalVariable } from 'src/app/common/globalvariable';

@Component({
  selector: 'app-notification-popup',
  templateUrl: './notification-popup.component.html',
  styleUrls: ['./notification-popup.component.css'],
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
  TNCSCKey: string = 'Notification';
  public progress: number;
  public message: string;
  magpath: string;
  imgUrl = 'C:/LocalRepository/TNCSCUI/dist/GoodsStock/assets/layout/images/NotificationPopup/MCHNY.jpg';
  imgPost = "C:\LocalRepository\TNCSCUI\dist\GoodsStock\assets\layout\images\NotificationPopup\MCHNY.jpg";
  fileToUpload: File = null;
  bearerToken  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

  constructor(private sanitizer: DomSanitizer, private authService: AuthService, private messageService: MessageService, private http: HttpClient, private tableConstant: TableConstants, private restApiService: RestAPIService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    const param = { 'Type': 1 };
    this.restApiService.getByParameters(PathConstants.NOTIFICATIONS, param).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.NotificationsCols = this.tableConstant.NotificationPopup;
        this.NotificationsData = res;
        // this.imgPost = this.imgUrl + this.NotificationsData[0].ImageName;
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

  upload(files) {
    if (files.length === 0)
      return;

    const formData = new FormData();

    for (let file of files)
      formData.append(file.name, file);

    this.noti = files;
    // var reader = new FileReader();
    // reader.onload = (event: any) => {
    //   this.imgUrl = event.target.result;
    // }
    // reader.readAsDataURL(this.noti);
    // const uploadReq = new HttpRequest("POST", '/assets/layout/images/NotificationPopup/', formData,

    const uploadReq = new HttpRequest("POST", 'http://localhost:55922/api/Upload', formData,
      {
        reportProgress: true,
      });

    this.http.request(uploadReq).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress)
        this.progress = Math.round(100 * event.loaded / event.total);
      else if (event.type === HttpEventType.Response)
        this.message = event.body.toString();
    });
  }


  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);

    //Show image 
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imgPost = event.target.result;
    }
    reader.readAsDataURL(this.noti);
  }

  transform(imgPost) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(imgPost);
    // this.ImagePath = this._DomSanitizationService.bypassSecurityTrustUrl(this.FilePath);
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
        this.NotificationsCols = this.tableConstant.NotificationPopup;
        this.NotificationsData = res;
        // this.imgPost = this.imgUrl + this.NotificationsData[0].ImageName;
       
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
    this.loadDocument();
    const params = {
      'Type': 1,
      'ID': 1,
      'Notes': this.Notes,
      'Reason': this.Reason,
      'isActive': 1,
      'ImageName': this.noti[0].name
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

  loadDocument() {
    const path = "../../assets/NotificationPopup/";
    const filename = GolbalVariable.PopupImage;
    let filepath = path + filename + ".jpg";
    var w = window.open(filepath);
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

  showDialog() {
    const param = { 'Type': 1 };
    this.restApiService.getByParameters(PathConstants.NOTIFICATIONS, param).subscribe(res => {
      if (res !== undefined && res !== null && res.length !== 0) {
        this.NotificationsData = res[0];
        this.NotificationsData = this.NotificationsData.Notes;
      }
    });
    const params = { 'sValue': this.TNCSCKey };
    this.restApiService.getByParameters(PathConstants.TNCSC_SETTINGS, params).subscribe(res => {
      if (res !== undefined) {
        this.noti = res[0];
        if (this.noti.TNCSCValue === 'NO') {
          this.display = false;
        }
        if (this.noti.TNCSCValue === 'YES') {
          this.display = true;
        }
      }
    });
  }
}
