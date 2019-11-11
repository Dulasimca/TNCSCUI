import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositorMasterComponent } from './depositor-master.component';

describe('DepositorMasterComponent', () => {
  let component: DepositorMasterComponent;
  let fixture: ComponentFixture<DepositorMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositorMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositorMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
