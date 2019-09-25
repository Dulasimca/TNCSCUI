import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherSchemesComponent } from './other-schemes.component';

describe('OtherSchemesComponent', () => {
  let component: OtherSchemesComponent;
  let fixture: ComponentFixture<OtherSchemesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherSchemesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherSchemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
