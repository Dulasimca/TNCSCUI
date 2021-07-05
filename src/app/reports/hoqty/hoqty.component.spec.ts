import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoqtyComponent } from './hoqty.component';

describe('HoqtyComponent', () => {
  let component: HoqtyComponent;
  let fixture: ComponentFixture<HoqtyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoqtyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoqtyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
