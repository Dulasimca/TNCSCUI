import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OWSComponent } from './ows.component';

describe('OWSComponent', () => {
  let component: OWSComponent;
  let fixture: ComponentFixture<OWSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OWSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OWSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
