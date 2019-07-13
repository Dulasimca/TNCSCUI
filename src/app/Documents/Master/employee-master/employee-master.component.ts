import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared-services/auth.service';

@Component({
  selector: 'app-employee-master',
  templateUrl: './employee-master.component.html',
  styleUrls: ['./employee-master.component.css']
})
export class EmployeeMasterComponent implements OnInit {
  employeeUser: [];
  canShowMenu: Boolean;

  constructor(private authService: AuthService,) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;

  }
  onSubmit(form) {
    console.log('form values ', form);
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(form));
  }

}
