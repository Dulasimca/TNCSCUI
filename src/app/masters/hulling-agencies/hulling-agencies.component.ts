import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { TableConstants } from 'src/app/constants/tableconstants';
import { PathConstants } from 'src/app/constants/path.constants';

@Component({
  selector: 'app-hulling-agencies',
  templateUrl: './hulling-agencies.component.html',
  styleUrls: ['./hulling-agencies.component.css']
})
export class HullingAgenciesComponent implements OnInit {
  data: any;
  column?: any;
  errMessage: string;
  
    constructor(private restApiService: RestAPIService, private http: HttpClient, private tableConstants: TableConstants) { }
  
    ngOnInit() {
      this.column = this.tableConstants.HullingAgenciesData;
      this.restApiService.get(PathConstants.HULLING_AGENCIES).subscribe((response: any[]) => {
        if (response !== undefined){
          this.data = response;
        } else{
          this.errMessage = 'Record Not Found';
        }
        //console.log('res', this.data);
        
      });
        }
    
  }