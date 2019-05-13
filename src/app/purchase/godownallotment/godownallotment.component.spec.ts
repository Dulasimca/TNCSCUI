import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GodownallotmentComponent } from './godownallotment.component';

describe('GodownallotmentComponent', () => {
  let component: GodownallotmentComponent;
  let fixture: ComponentFixture<GodownallotmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GodownallotmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GodownallotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
