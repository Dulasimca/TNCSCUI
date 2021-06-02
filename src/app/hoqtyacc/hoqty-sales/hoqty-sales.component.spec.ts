import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoqtySalesComponent } from './hoqty-sales.component';

describe('HoqtySalesComponent', () => {
  let component: HoqtySalesComponent;
  let fixture: ComponentFixture<HoqtySalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoqtySalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoqtySalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
