import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GodownProfileComponent } from './godown-profile.component';

describe('GodownProfileComponent', () => {
  let component: GodownProfileComponent;
  let fixture: ComponentFixture<GodownProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GodownProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GodownProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
