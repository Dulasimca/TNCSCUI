import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckToRegionComponent } from './truck-to-region.component';

describe('TruckToRegionComponent', () => {
  let component: TruckToRegionComponent;
  let fixture: ComponentFixture<TruckToRegionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckToRegionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckToRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
