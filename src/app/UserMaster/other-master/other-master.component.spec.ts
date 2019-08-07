import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherMasterComponent } from './other-master.component';

describe('OtherMasterComponent', () => {
  let component: OtherMasterComponent;
  let fixture: ComponentFixture<OtherMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
