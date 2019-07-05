import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocietMasterEntryComponent } from './societ-master-entry.component';

describe('SocietMasterEntryComponent', () => {
  let component: SocietMasterEntryComponent;
  let fixture: ComponentFixture<SocietMasterEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocietMasterEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocietMasterEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
