import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SPLPDSComponent } from './splpds.component';

describe('SPLPDSComponent', () => {
  let component: SPLPDSComponent;
  let fixture: ComponentFixture<SPLPDSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SPLPDSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SPLPDSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
