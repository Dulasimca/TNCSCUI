import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandDraftComponent } from './demand-draft.component';

describe('DemandDraftComponent', () => {
  let component: DemandDraftComponent;
  let fixture: ComponentFixture<DemandDraftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandDraftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
