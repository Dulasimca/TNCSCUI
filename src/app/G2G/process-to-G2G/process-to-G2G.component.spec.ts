import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessToG2GComponent } from './process-to-G2G.component';

describe('ProcessToG2GComponent', () => {
  let component: ProcessToG2GComponent;
  let fixture: ComponentFixture<ProcessToG2GComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessToG2GComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessToG2GComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
