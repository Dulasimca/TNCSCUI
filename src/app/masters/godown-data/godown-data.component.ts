import { Component, OnInit, ViewChild } from '@angular/core';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { TreeNode, MessageService } from 'primeng/api';
import { TableConstants } from 'src/app/constants/tableconstants';
import { PathConstants } from 'src/app/constants/path.constants';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AuthService } from 'src/app/shared-services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { StatusMessage } from 'src/app/constants/Messages';
import { DataTable } from 'primeng/primeng';

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
  searchText: any;
  loading: boolean;
  @ViewChild('dt') table: DataTable;

  constructor(private restApiService: RestAPIService, private authService: AuthService,
     private tableConstants: TableConstants, private messageService: MessageService) { }

  ngOnInit() {
    this.canShowMenu = (this.authService.isLoggedIn()) ? this.authService.isLoggedIn() : false;
    this.column = this.tableConstants.GodownMasterData;
    this.loading = true;
    this.restApiService.get(PathConstants.GODOWN_MASTER).subscribe((response: any[]) => {
      if(response !== undefined && response.length !== 0 && response !== null) {
      let treeData = [];
      let childNode: TreeNode;
      let regionData = [];
      response.forEach(x => {
        let list = x.list;
        for (let i = 0; i < list.length; i++) {
          childNode = {
            'data': {
              'serialNo': i + 1 + ")",
              'Name': list[i].Name,
              'Code': list[i].Code,
              'Capacity': list[i].Capacity,
              'Carpet': list[i].Carpet
            }
          }
          regionData.push(childNode);
        }
        var index = response.findIndex(index => index.Name === x.Name);
        treeData.push(Object.assign({},
          {
            "data": {
              "serialNo": index + 1,
              "Name": x.Name,
              "Code": x.Code,
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
      this.loading = false;
    } else {
      this.loading = false;
      this.messageService.clear();
      this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_WARNING, summary: StatusMessage.SUMMARY_WARNING, detail: StatusMessage.NoRecForCombination });
    }
      this.items = [
        {
          label: 'Excel', icon: 'fa fa-table', command: () => {
            this.table.exportCSV();
          }
        },
         {
          label: 'PDF', icon: "fa fa-file-pdf-o", command: () => {
            this.exportAsPDF();
          }
        }]
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.loading = false;
        this.messageService.clear();
        this.messageService.add({ key: 't-err', severity: StatusMessage.SEVERITY_ERROR, summary: StatusMessage.SUMMARY_ERROR, detail: StatusMessage.ErrorMessage });
      }
  });
  }

  onSearch(value) {
    this.data = this.filterArray;
    if (value !== undefined && value !== '') {
      value = value.toString().toUpperCase();
      this.data = this.data.filter(item => {
        return item.data.Name.toString().startsWith(value);
      });
    }
  }



  exportAsPDF() {
    var doc = new jsPDF('p', 'pt', 'a4');
    doc.text("Tamil Nadu Civil Supplies Corporation - Head Office", 100, 30);
    var col = this.column;
    var rows = [];
    this.data.forEach(element => {
      var temp = [element.data.serialNo, element.data.Name, element.data.Code, element.data.Capacity, element.data.Carpet];
      rows.push(temp);
      let childNode = element.children;
      childNode.forEach(element => {
        var temp = [element.data.serialNo, element.data.Name, element.data.Code, element.data.Capacity, element.data.Carpet];
        rows.push(temp);
      })
    });
    doc.autoTable(col, rows);
    doc.save('GODOWN_DATA.pdf');
  }

  print() {
    window.print();
  }

  onRowSelect(index) {
    console.log('orking', index);
  }

  public getColor(name: string, index): string {
    let color;
    this.data.forEach(x => {
      if (x.serialNo - 1 === index) {
        color = "#53aae4";
      } else {
        color = "white"
      }
    })
    return color;
  }
}
