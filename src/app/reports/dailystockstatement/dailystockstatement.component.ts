import { Component, OnInit } from '@angular/core';
import { TableConstants } from 'src/app/constants/tableconstants';
import { RestAPIService } from 'src/app/shared-services/restAPI.service';
import { PathConstants } from 'src/app/constants/path.constants';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-dailystockstatement',
  templateUrl: './dailystockstatement.component.html',
  styleUrls: ['./dailystockstatement.component.css']
})
export class DailyStockStatementComponent implements OnInit {
  dailyStockDataCoulmns: any;
  dailyStockData: any;
  fromDate: Date;
  toDate: Date;

  constructor(private tableConstants: TableConstants, private restApiService: RestAPIService) { }

  ngOnInit() {
    this.dailyStockDataCoulmns = this.tableConstants.DailyStockStatement;
    this.restApiService.get(PathConstants.DAILY_STOCK_STATEMENT).subscribe((response: any[]) => {
      let treeData = [];
      let childNode: TreeNode;
      let regionChildNode: TreeNode;
      let regionData = [];
      let godownData = [];
      response.forEach(x => {
        let list = x.ListItems;
        for (let i = 0; i < list.length; i++) {
          let godownList = list[i].ListItems;
          for (let i = 0; i < godownList.length; i++) {
            regionChildNode = { 'data': {
              'Name': godownList[i].Name,
              'OpeningBalance': godownList[i].OpeningBalance,
              "ClosingBalance": godownList[i].ClosingBalance,
                "TotalReceipt": godownList[i].TotalReceipt,
                "Receipt": parseInt(godownList[i].OpeningBalance, 0) + parseInt(godownList[i].TotalReceipt, 0),
                "IssueSales": godownList[i].IssueSales,
                "IssueOthers": godownList[i].IssueOthers,
                "TotalIssue": parseInt(godownList[i].IssueSales, 0) + parseInt(godownList[i].IssueOthers, 0),
                "CS Balance": godownList[i].CSBalance,
                "Shortage": godownList[i].Shortage,
                "PhycialBalance": godownList[i].PhycialBalance
            }}
            godownData.push(regionChildNode);
          }
          childNode = { 'data': {
            'Name': list[i].Name,
            'OpeningBalance': list[i].OpeningBalance,
            "ClosingBalance": list[i].ClosingBalance,
              "TotalReceipt": list[i].TotalReceipt,
              "Receipt": parseInt(list[i].OpeningBalance, 0) + parseInt(list[i].TotalReceipt, 0),
              "IssueSales": list[i].IssueSales,
              "IssueOthers": list[i].IssueOthers,
              "TotalIssue": parseInt(list[i].IssueSales, 0) + parseInt(list[i].IssueOthers, 0),
              "CS Balance": list[i].CSBalance,
              "Shortage": list[i].Shortage,
              "PhycialBalance": list[i].PhycialBalance
          }, "children": godownData}
          regionData.push(childNode);
        godownData = [];
                 }
        treeData.push(Object.assign({},
          {
            "data": {
              "Name": x.Name,
              "OpeningBalance": x.OpeningBalance,
              "ClosingBalance": x.ClosingBalance,
              "TotalReceipt": x.TotalReceipt,
              "Receipt": parseInt(x.OpeningBalance, 0) + parseInt(x.TotalReceipt, 0),
              "IssueSales": x.IssueSales,
              "IssueOthers": x.IssueOthers,
              "TotalIssue": parseInt(x.IssueSales, 0) + parseInt(x.IssueOthers, 0),
              "CS Balance": x.CSBalance,
              "Shortage": x.Shortage,
              "PhycialBalance": x.PhycialBalance
            },
            "children": regionData,
          },
        ));
        regionData = [];
      });
      this.dailyStockData = treeData;
       });
      }
}