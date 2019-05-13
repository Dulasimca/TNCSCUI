import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HullingAgenciesComponent } from './hulling-agencies.component';

describe('HullingAgenciesComponent', () => {
  let component: HullingAgenciesComponent;
  let fixture: ComponentFixture<HullingAgenciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HullingAgenciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HullingAgenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
