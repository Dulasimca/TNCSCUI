import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommodityIssueMemoComponent } from './commodity-issue-memo.component';

describe('CommodityIssueMemoComponent', () => {
  let component: CommodityIssueMemoComponent;
  let fixture: ComponentFixture<CommodityIssueMemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommodityIssueMemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommodityIssueMemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
