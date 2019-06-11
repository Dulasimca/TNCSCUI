import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckMemoRegisterComponent } from './truck-memo-register.component';

describe('TruckMemoRegisterComponent', () => {
  let component: TruckMemoRegisterComponent;
  let fixture: ComponentFixture<TruckMemoRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckMemoRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckMemoRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
