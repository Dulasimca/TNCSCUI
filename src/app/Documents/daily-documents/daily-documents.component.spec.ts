import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyDocumentsComponent } from './daily-documents.component';

describe('DailyDocumentsComponent', () => {
  let component: DailyDocumentsComponent;
  let fixture: ComponentFixture<DailyDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
