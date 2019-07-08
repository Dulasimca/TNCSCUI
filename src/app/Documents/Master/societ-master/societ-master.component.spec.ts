import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocietMasterComponent } from './societ-master.component';

describe('SocietMasterComponent', () => {
  let component: SocietMasterComponent;
  let fixture: ComponentFixture<SocietMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocietMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocietMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
