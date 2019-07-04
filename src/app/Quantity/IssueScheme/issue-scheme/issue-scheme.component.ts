import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-issue-scheme',
  templateUrl: './issue-scheme.component.html',
  styleUrls: ['./issue-scheme.component.css']
})
export class IssueSchemeComponent implements OnInit {
  IssueSchemeCols: any;
  IssueSchemeData: any;

  constructor() { }

  ngOnInit() {
  }

}
