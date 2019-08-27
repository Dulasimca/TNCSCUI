import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarginAmountComponent } from './margin-amount.component';

describe('MarginAmountComponent', () => {
  let component: MarginAmountComponent;
  let fixture: ComponentFixture<MarginAmountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarginAmountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarginAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
