import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { Validators, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-godown-profile',
  templateUrl: './godown-profile.component.html',
  styleUrls: ['./godown-profile.component.css']
})
export class GodownProfileComponent implements OnInit  {
  username: any;
  userdata: any;
  canShowMenu: boolean;
  formUser = [];

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
  //   this.user_data = new FormGroup({
  //  });

  }
  onSubmit(form) {
    console.log('form values ', form);
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(form));
  }
}
