import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoqtyabstractComponent } from './hoqtyabstract.component';

describe('HoqtyabstractComponent', () => {
  let component: HoqtyabstractComponent;
  let fixture: ComponentFixture<HoqtyabstractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoqtyabstractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoqtyabstractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
