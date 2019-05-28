import { Component, OnInit } from '@angular/core';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { AuthService } from 'src/app/shared-services/auth.service';
import { TableConstants } from 'src/app/constants/tableconstants';

@Component({
  selector: 'app-cb-statement',
  templateUrl: './cb-statement.component.html',
  styleUrls: ['./cb-statement.component.css']
})
export class CBStatementComponent implements OnInit {
  cbData: any = [];
  column?: any;
  canShowMenu: boolean;
  searchText: string;
  filterArray: any;
  filteredItem: any;
  
  constructor(private restApiService: RestAPIService, private authService: AuthService, private tableConstants: TableConstants) { }
  
  ngOnInit() {
      this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
      this.cbData = [
        { 'id': 1,'Name': 'Ariyalur', 'Capacity': '2500', 'NewRice': '417.251', 'OldRice': '89.732', 'TotalRice': '506.983'},
        { 'id': 2,'Name': 'JayaKondam', 'Capacity': '2500', 'NewRice': '417.251', 'OldRice': '89.732', 'TotalRice': '506.983'},
        { 'id': 3,'Name': 'Senthurai', 'Capacity': '2500', 'NewRice': '417.251', 'OldRice': '89.732', 'TotalRice': '506.983'},
        { 'id': 4,'Name': 'Anna Nagr', 'Capacity': '2500', 'NewRice': '417.251', 'OldRice': '89.732', 'TotalRice': '506.983'},
        { 'id': 5,'Name': 'Manali', 'Capacity': '2500', 'NewRice': '417.251', 'OldRice': '89.732', 'TotalRice': '506.983'},
        { 'id': 6,'Name': 'Sengundram', 'Capacity': '2500', 'NewRice': '417.251', 'OldRice': '89.732', 'TotalRice': '506.983'},
        { 'id': 7,'Name': 'Toll Booth', 'Capacity': '2500', 'NewRice': '417.251', 'OldRice': '89.732', 'TotalRice': '506.983'},
        { 'id': 8,'Name': 'Tondairpet', 'Capacity': '2500', 'NewRice': '417.251', 'OldRice': '89.732', 'TotalRice': '506.983'},
    ]; 
    // this.cbData.forEach(x => {
    //   if (x.id === 3) {
    //     var index = this.cbData.findIndex(index => index.id === x.id);
       
    //     //this.cbData.splice(index + 1, item.length - 1);
    //   }
    // })
    var index = this.cbData.length - 5;
    var item = {'Name':'TOTAL','Capacity': '8500','NewRice': '131.81','OldRice': '572.943','TotalRice': '1885.75'};
    this.cbData.splice(index, 0, item);
     }

     public getColor(name: string): string{
      return name === 'TOTAL' ? "#53aae4" : "white";
   }
}
