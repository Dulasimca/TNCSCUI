import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderAllotementDetailsComponent } from './tender-allotement-details.component';

describe('TenderAllotementDetailsComponent', () => {
  let component: TenderAllotementDetailsComponent;
  let fixture: ComponentFixture<TenderAllotementDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenderAllotementDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenderAllotementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
