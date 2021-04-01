import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoqtyabstractrepComponent } from './hoqtyabstractrep.component';

describe('HoqtyabstractrepComponent', () => {
  let component: HoqtyabstractrepComponent;
  let fixture: ComponentFixture<HoqtyabstractrepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoqtyabstractrepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoqtyabstractrepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
