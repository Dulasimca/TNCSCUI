import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-society-wise-commodity-abstract',
  templateUrl: './society-wise-commodity-abstract.component.html',
  styleUrls: ['./society-wise-commodity-abstract.component.css']
})
export class SocietyWiseCommodityAbstractComponent implements OnInit {
  brkUpViewDisplay: boolean = false;
  schemeWiseBrkUp: boolean = false;
  schemeAbstractBrkUp: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  viewBreakup(event) {
    const id = event.target.attributes.id;
    console.log('id', id);
    this.brkUpViewDisplay = true;
  }


}
