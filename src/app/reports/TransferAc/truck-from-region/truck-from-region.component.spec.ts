import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckFromRegionComponent } from './truck-from-region.component';

describe('TruckFromRegionComponent', () => {
  let component: TruckFromRegionComponent;
  let fixture: ComponentFixture<TruckFromRegionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckFromRegionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckFromRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
