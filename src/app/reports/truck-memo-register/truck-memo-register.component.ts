import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';

@Component({
  selector: 'app-truck-memo-register',
  templateUrl: './truck-memo-register.component.html',
  styleUrls: ['./truck-memo-register.component.css']
})
export class TruckMemoRegisterComponent implements OnInit {
  TruckMemoRegCols: any;
  TruckMemoRegData: any;

  constructor(private tableConstants: TableConstants, private restAPIService: RestAPIService) { }

  ngOnInit() {
    this.TruckMemoRegCols = this.tableConstants.TruckMemoRegisterReport;
  }

}
