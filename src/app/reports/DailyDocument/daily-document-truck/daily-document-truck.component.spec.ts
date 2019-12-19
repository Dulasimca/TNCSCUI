import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyDocumentTruckComponent } from './daily-document-truck.component';

describe('DailyDocumentTruckComponent', () => {
  let component: DailyDocumentTruckComponent;
  let fixture: ComponentFixture<DailyDocumentTruckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyDocumentTruckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyDocumentTruckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
