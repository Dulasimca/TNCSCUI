import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FCIDataComponent } from './fcidata.component';

describe('FCIDataComponent', () => {
  let component: FCIDataComponent;
  let fixture: ComponentFixture<FCIDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FCIDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FCIDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
