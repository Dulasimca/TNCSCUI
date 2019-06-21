import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckTransferComponent } from './truck-transfer.component';

describe('TruckTransferComponent', () => {
  let component: TruckTransferComponent;
  let fixture: ComponentFixture<TruckTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
