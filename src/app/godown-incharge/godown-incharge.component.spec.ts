import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GodownInchargeComponent } from './godown-incharge.component';

describe('GodownInchargeComponent', () => {
  let component: GodownInchargeComponent;
  let fixture: ComponentFixture<GodownInchargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GodownInchargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GodownInchargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
