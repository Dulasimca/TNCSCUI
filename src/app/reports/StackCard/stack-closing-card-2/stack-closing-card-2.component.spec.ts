import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackClosingCard2Component } from './stack-closing-card-2.component';

describe('StackClosingCard-2Component', () => {
  let component: StackClosingCard2Component;
  let fixture: ComponentFixture<StackClosingCard2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackClosingCard2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackClosingCard2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
