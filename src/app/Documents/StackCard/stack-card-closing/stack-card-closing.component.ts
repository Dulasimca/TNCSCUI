import { Component, OnInit } from '@angular/core';
import { TableConstants } from '../../../constants/tableconstants';
import { AuthService } from '../../../shared-services/auth.service';

@Component({
  selector: 'app-stack-card-closing',
  templateUrl: './stack-card-closing.component.html',
  styleUrls: ['./stack-card-closing.component.css']
})
export class StackCardClosingComponent implements OnInit {
  StackClosingData: any;
  StackClosingCols: any;
  canShowMenu: boolean;

  constructor(private tableConstants: TableConstants, private authService : AuthService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.StackClosingCols = this.tableConstants.StackCardClosingEntryReport;
  }

}
