import { Component, OnInit } from '@angular/core';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { TreeNode } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { TableConstants } from 'src/app/constants/tableconstants';
import { PathConstants } from 'src/app/constants/path.constants';


@Component({
  selector: 'app-godown-data',
  templateUrl: './godown-data.component.html',
  styleUrls: ['./godown-data.component.css']
})
export class GodownDataComponent implements OnInit {
  data?: any = [];
  column: any;

  constructor(private restApiService: RestAPIService, private http: HttpClient, private tableConstants: TableConstants) { }

  ngOnInit() {
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
    });
  }

}
