import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockstatementreportComponent } from './stockstatementreport.component';

describe('StockstatementreportComponent', () => {
  let component: StockstatementreportComponent;
  let fixture: ComponentFixture<StockstatementreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockstatementreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockstatementreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
