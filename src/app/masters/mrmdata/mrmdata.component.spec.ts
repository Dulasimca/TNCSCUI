import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MRMDataComponent } from './mrmdata.component';

describe('MRMDataComponent', () => {
  let component: MRMDataComponent;
  let fixture: ComponentFixture<MRMDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MRMDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MRMDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
