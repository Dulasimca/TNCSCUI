import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherSchemeComponent } from './other-scheme.component';

describe('OtherSchemeComponent', () => {
  let component: OtherSchemeComponent;
  let fixture: ComponentFixture<OtherSchemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherSchemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
