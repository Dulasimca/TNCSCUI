import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { Validators, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrls: ['./user-master.component.css']
})
export class UserMasterComponent implements OnInit {
  username: any;
  user_data: any;
  canShowMenu: Boolean;

  constructor(private authService: AuthService,) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.username = new FormControl('agustin', Validators.required);
    this.user_data = new FormGroup({
      username: new FormControl('agustin', Validators.required),
   });

  }
  
}