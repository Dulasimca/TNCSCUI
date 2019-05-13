import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionallotmentComponent } from './regionallotment.component';

describe('RegionallotmentComponent', () => {
  let component: RegionallotmentComponent;
  let fixture: ComponentFixture<RegionallotmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegionallotmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionallotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
