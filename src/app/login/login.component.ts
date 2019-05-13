import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared-services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted: boolean;
  isViewLogin = false;
  openPanel: boolean;
  @Output() loggingIn = new EventEmitter<boolean>();

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService) {
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
    this.router.navigate(['home']);


  }
}
