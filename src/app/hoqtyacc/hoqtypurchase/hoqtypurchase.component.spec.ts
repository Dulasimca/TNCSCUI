import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoqtypurchaseComponent } from './hoqtypurchase.component';

describe('HoqtypurchaseComponent', () => {
  let component: HoqtypurchaseComponent;
  let fixture: ComponentFixture<HoqtypurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoqtypurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoqtypurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
