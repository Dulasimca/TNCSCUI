import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { PathConstants } from 'src/app/constants/path.constants';

@Component({
  selector: 'app-schemes',
  templateUrl: './schemes.component.html',
  styleUrls: ['./schemes.component.css']
})
export class SchemesComponent implements OnInit {
  data: any;
  column?: any;
errMessage: string;

  constructor(private restApiService: RestAPIService, private http: HttpClient, private tableConstants: TableConstants) { }

  ngOnInit() {
    this.column = this.tableConstants.SchemeData;
    this.restApiService.get(PathConstants.SCHEMES).subscribe((response: any[]) => {
      if (response !== undefined){
        this.data = response;
      } else{
        this.errMessage = 'Record Not Found';
      }
      
      //console.log('res', this.data);
      
    });
  }
}
