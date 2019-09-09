import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckMemoComponent } from './truck-memo.component';

describe('TruckMemoComponent', () => {
  let component: TruckMemoComponent;
  let fixture: ComponentFixture<TruckMemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckMemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckMemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
