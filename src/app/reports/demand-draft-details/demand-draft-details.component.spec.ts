import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandDraftDetailsComponent } from './demand-draft-details.component';

describe('DemandDraftDetailsComponent', () => {
  let component: DemandDraftDetailsComponent;
  let fixture: ComponentFixture<DemandDraftDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandDraftDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandDraftDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
