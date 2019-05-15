import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared-services/auth.service';
import { RestAPIService } from '../shared-services/restAPI.service';
import { PathConstants } from '../constants/path.constants';
import { HttpParams } from '@angular/common/http';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted: boolean;
  isViewLogin = false;
  roleId: number;
  openPanel: boolean;
  userName: string;
  password: any;
  @Output() loggingIn = new EventEmitter<boolean>();

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService,
    private restApiService: RestAPIService, private loginService: LoginService) {
    this.isViewLogin = true;

  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  get formControls() {
    return this.loginForm.controls;
  }

  onSignIn() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.loginForm.value))
    this.authService.login(this.loginForm.value);
    let username = new HttpParams().append('userName', this.userName);
    this.restApiService.getByParameters(PathConstants.LOGIN, username).subscribe(credentials => {
      if (credentials !== undefined) {
      if (this.userName.toLowerCase() === credentials[0].UserName.toLowerCase() && this.password === credentials[0].Pwd) {
        this.router.navigate(['home']);
        this.roleId = credentials[0].RoleId;
        this.loginService.setValue(this.roleId);
      } else {
        this.clearFields();
        console.log('invalid user');
      }
    }
    });
  }
  clearFields() {
    this.userName = this.password = '';
  }
}
