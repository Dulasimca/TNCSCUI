import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared-services/auth.service';
import { RestAPIService } from '../shared-services/restAPI.service';
import { PathConstants } from '../constants/path.constants';
import { HttpParams } from '@angular/common/http';
import { LoginService } from './login.service';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  roleId: number;
  godownCode: any;
  regionCode: any;
  openPanel: boolean;
  userName: string;
  password: any;
  isChecked: boolean;
  @Output() loggingIn = new EventEmitter<boolean>();

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService,
    private restApiService: RestAPIService, private loginService: LoginService, private messageService: MessageService) {

  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      user: ['', Validators.required],
      pswd: ['', Validators.required]
    })
    this.isChecked = JSON.parse(this.authService.checkLoggedIn());
    // if (this.isChecked) {
    //   this.userName =  (this.authService.getCredentials() !== null) ? this.authService.getCredentials() : this.userName;
    //  }
  }

  get formControls() {
    return this.loginForm.controls;
  }

  onSignIn() {
    if (this.loginForm.invalid) {
      this.messageService.add({severity:'error', summary:'Error!', detail:'Please enter a valid credentials!'});
      return;
    } else {
    let username = new HttpParams().append('userName', this.userName);
    this.restApiService.getByParameters(PathConstants.LOGIN, username).subscribe(credentials => {
      if (credentials !== undefined) {
      if (this.userName.toLowerCase() === credentials[0].UserName.toLowerCase() && this.password === credentials[0].Pwd.toLowerCase()) {
        this.router.navigate(['Home']);
        this.roleId = credentials[0].RoleId;
        this.godownCode = (this.roleId !== undefined && this.roleId !== 1) ? credentials[0].GodownCode : 0;
        this.regionCode = (this.roleId !== undefined && this.roleId !== 1) ? credentials[0].RegionCode : 0;
        this.loginService.setValue(this.roleId);
        this.loginService.setUsername(this.userName);
        this.authService.login(this.loginForm.value, this.roleId, this.godownCode, this.regionCode);
      } else {
        this.clearFields();
        this.messageService.add({severity:'error', summary:'Error!', detail:'Validation Failed!'});
      }
    }
    });
  }
  }

  toggleVisibility(e) {
    this.authService.isKeepMeLoggedIn(e.target.checked);
    let check: any = this.authService.checkLoggedIn();
    this.isChecked = (check !== undefined && 
    check !== null) ? check : false;
   
  }

  clearFields() {
    this.userName = this.password = '';
  }
}
