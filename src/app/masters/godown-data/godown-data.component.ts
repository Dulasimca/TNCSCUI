import { Component, OnInit } from '@angular/core';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { TreeNode } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { TableConstants } from 'src/app/constants/tableconstants';
import { PathConstants } from 'src/app/constants/path.constants';
import { ExcelService } from 'src/app/shared-services/excel.service';
import { LoginService } from 'src/app/login/login.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { element } from '@angular/core/src/render3';
import { AuthService } from 'src/app/shared-services/auth.service';

@Component({
  selector: 'app-godown-data',
  templateUrl: './godown-data.component.html',
  styleUrls: ['./godown-data.component.css']
})
export class GodownDataComponent implements OnInit {
  data?: any = [];
  column: any;
  items: any;
  canShowMenu: boolean;
  filterArray: any;

  constructor(private restApiService: RestAPIService, private authService: AuthService,
    private http: HttpClient, private tableConstants: TableConstants, private excelService: ExcelService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn() !== undefined) ? this.authService.isLoggedIn() : false;
    this.column = this.tableConstants.GodownMasterData;
    this.restApiService.get(PathConstants.GODOWN_MASTER).subscribe((response: any[]) => {
      let treeData = [];
      let childNode: TreeNode;
      let regionData = [];
      response.forEach(x => {
        let list = x.list;
        for (let i = 0; i < list.length; i++) {
          childNode = { 'data': {
            'Name': list[i].Name,
            'Capacity': list[i].Capacity,
            'Carpet': list[i].Carpet
          }}
          regionData.push(childNode);
        }
        treeData.push(Object.assign({},
          {
            "data": {
              "Name": x.Name,
              "Capacity": x.Capacity,
              "Carpet": x.Carpet
            },
            "children": regionData
          },
        ));
        regionData = [];
      });
      this.data = treeData;
      this.filterArray = treeData;
      
      this.items = [
        {
          label: 'Excel', icon: 'fa fa-table', command: () => {
            this.exportAsXLSX();
        }},
        {
          label: 'PDF', icon: "fa fa-file-pdf-o" , command: () => {
           this.exportAsPDF();
          }
        }]
    });
  }
  onSearch(value) {
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.data = this.data.filter(item => {
          return item.data.Name.toString().startsWith(value);
      });
       } else {
         this.data = this.filterArray;
       }
  }
  exportAsXLSX():void{
    this.excelService.exportAsExcelFile(this.data,'GODOWN_DATA');
  }
  exportAsPDF() {
    var doc = new jsPDF();
    var col = this.column;
    col.push({'field': 'District', 'header': 'District'});
    var rows = [];
    this.data.forEach(element => {
      var temp = [element.data.Name,element.data.Capacity,element.data.Carpet];
          rows.push(temp);
    });
      doc.autoTable(col,rows);
      doc.save('GODOWN_DATA.pdf');
    
  //  })
  }
}
