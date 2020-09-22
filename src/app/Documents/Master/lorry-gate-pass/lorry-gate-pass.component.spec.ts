import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LorryGatePassComponent } from './lorry-gate-pass.component';

describe('LorryGatePassComponent', () => {
  let component: LorryGatePassComponent;
  let fixture: ComponentFixture<LorryGatePassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LorryGatePassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LorryGatePassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
