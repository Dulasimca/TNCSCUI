import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessToGPSComponent } from './process-to-gps.component';

describe('ProcessToGPSComponent', () => {
  let component: ProcessToGPSComponent;
  let fixture: ComponentFixture<ProcessToGPSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessToGPSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessToGPSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
