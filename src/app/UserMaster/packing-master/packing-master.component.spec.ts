import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingMasterComponent } from './packing-master.component';

describe('PackingMasterComponent', () => {
  let component: PackingMasterComponent;
  let fixture: ComponentFixture<PackingMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackingMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackingMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
