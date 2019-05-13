import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CRSDataComponent } from './crsdata.component';

describe('CRSDataComponent', () => {
  let component: CRSDataComponent;
  let fixture: ComponentFixture<CRSDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CRSDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CRSDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
