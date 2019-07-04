import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckTransitComponent } from './truck-transit.component';

describe('TruckTransitComponent', () => {
  let component: TruckTransitComponent;
  let fixture: ComponentFixture<TruckTransitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckTransitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckTransitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
