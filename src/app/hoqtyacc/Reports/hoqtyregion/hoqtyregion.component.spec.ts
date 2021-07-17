import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoqtyregionComponent } from './hoqtyregion.component';

describe('HoqtyregionComponent', () => {
  let component: HoqtyregionComponent;
  let fixture: ComponentFixture<HoqtyregionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoqtyregionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoqtyregionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
