import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';
import { Validators, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-employee-master',
  templateUrl: './employee-master.component.html',
  styleUrls: ['./employee-master.component.css']
})
export class EmployeeMasterComponent implements OnInit {
  employeeName: any;
  employeeUser: any;
  canShowMenu: boolean;
  formUser = [];
  maxDate: Date;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
  //   this.user_data = new FormGroup({
  //  });

  }

  onDateSelect() {
    
  }
  onSubmit(form) {
    console.log('form values ', form);
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(form));
  }
}