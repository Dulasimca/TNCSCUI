import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared-services/auth.service';
import { DatePipe } from '@angular/common';
import { RoleBasedService } from '../common/role-based.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { RestAPIService } from '../shared-services/restAPI.service';
import { PathConstants } from '../constants/path.constants';
import { Router } from '@angular/router';
import { FileUploadModule } from 'primeng/fileupload';
import { StatusMessage } from '../constants/Messages';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  uploadedFiles: any[] = [];
  isValidUser: boolean;
  ChangeForm: FormGroup;
  userName: any;
  password: any;
  OldPassword: any;
  NewPassword: any;
  godownName: string;
  regionName: string;
  timeString: string;
  duration = 120;
  hours: any;
  minutes: any;
  clockDisplay: string;
  interval: number;
  date: any;
  seconds: any;
  data: any;
  constructor(private roleBasedService: RoleBasedService, private router: Router, private restApiService: RestAPIService, private messageService: MessageService, private fb: FormBuilder, private authService: AuthService, private datePipe: DatePipe) { }

  ngOnInit() {
    // this.data = this.roleBasedService.getInstance();
    this.ChangeForm = this.fb.group({
      user: ['', Validators.required],
      pswd: ['', Validators.required],
      Newpswd: ['', Validators.required]
    })
  }

  onLogOut() {
    this.authService.logout();
  }

  onViewUserinfo(event, panel) {
    panel.toggle(event);
    this.userName = JSON.parse(this.authService.getCredentials()).user;
    // this.password = JSON.parse(this.authService.getCredentials()).pswd;
    // if(this.data !== undefined) {
    //  this.data.forEach(x => {
    //   this.godownName = x.GName;
    //   this.regionName = x.RName;
    //  });
    // }
  }

  onForgetPswd() {
    if (this.ChangeForm.invalid) {
      this.messageService.add({ key:'t-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ValidCredentialsErrorMessage });
      return;
    } else {
      let username = new HttpParams().append('userName', this.userName);
      this.restApiService.getByParameters(PathConstants.LOGIN, username).subscribe(res => {
        if (res !== undefined) {
          if (this.userName.toLowerCase() === res[0].userName.toLowerCase() && this.OldPassword === res[0].Pwd && this.OldPassword !== this.NewPassword) {
            this.router.navigate(['Home']);
            this.setUsername(this.userName);
            this.setOldPassword(this.OldPassword);
            this.setNewPassword(this.NewPassword);
          }
        } else {
          this.onClear();
          this.messageService.add({ key:'t-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ValidCredentialsErrorMessage });
        }
      });
    }
  }

  //   onUpload(event) {
  //     for(let image of event.files) {
  //         this.uploadedFiles.push(image);
  //     }

  //     this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  // }

  onNew() {
    let head = JSON.parse(this.authService.getCredentials()).pswd;
    const params = {
      'UserId': this.userName,
      'OldPassword': this.OldPassword,
      'NewPassword': this.NewPassword
    };
    if (this.OldPassword === head) {
      this.restApiService.post(PathConstants.CHANGE_PASSWORD_POST, params).subscribe(res => {
        if (res) {
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_SUCCESS, summary: StatusMessage.SUMMARY_SUCCESS, detail: StatusMessage.PasswordChangeSuccessMessage });
          // setTimeout(this.onTime, 3000);
        } else {
          this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
        }
      });
      // this.router.navigate(['login']);
    } else {
      this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.PasswordMatchErrorMessage });
    }
    this.onClear();
    // this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: 'Error Message', detail: 'Please try again!' });
  }

  onTime() {
    this.router.navigate(['login']);
  }

  onClear() {
    this.OldPassword = this.NewPassword = '';
  }

  setUsername(username) {
    this.userName = username;
  }
  getUsername() {
    return this.userName;
  }
  setOldPassword(OldPassword) {
    this.OldPassword = OldPassword;
  }
  getOldPassword() {
    return this.OldPassword;
  }
  setNewPassword(NewPassword) {
    this.NewPassword = NewPassword;
  }
  getNewPassword() {
    return this.NewPassword;
  }

}
// function showTime() {
//   let todayDate = new Date();
//   let hours: any = todayDate.getHours();
//   let minutes: any = todayDate.getMinutes();
//   let seconds: any = todayDate.getSeconds();
//   let period = 'AM';

//   if (hours === 0) {
//       hours = 12;
//   }
//   if (hours > 12) {
//       hours = hours - 12;
//       period = 'PM';
//   }
//   hours = (hours < 10) ? "0" + hours : hours;
//   minutes = (minutes < 10) ? "0" + minutes : minutes;
//   seconds = (seconds < 10) ? "0" + seconds : seconds;

//   let timer = hours + ':' + minutes + ':' + seconds + period;
//   document.getElementById('displayTimer').innerText = timer;
//   document.getElementById('displayTimer').innerHTML = timer;

//   setTimeout(showTime, 1000);
// }

