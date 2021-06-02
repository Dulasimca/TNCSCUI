import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HoqtyfreereceiptComponent } from './hoqtyfreereceipt.component';

describe('HoqtyfreereceiptComponent', () => {
  let component: HoqtyfreereceiptComponent;
  let fixture: ComponentFixture<HoqtyfreereceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoqtyfreereceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoqtyfreereceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
