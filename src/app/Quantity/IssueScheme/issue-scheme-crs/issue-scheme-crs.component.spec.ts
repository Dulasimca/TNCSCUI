import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueSchemeCrsComponent } from './issue-scheme-crs.component';

describe('IssueSchemeCrsComponent', () => {
  let component: IssueSchemeCrsComponent;
  let fixture: ComponentFixture<IssueSchemeCrsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueSchemeCrsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueSchemeCrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
