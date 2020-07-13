import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LorryMasterComponent } from './lorry-master.component';

describe('LorryMasterComponent', () => {
  let component: LorryMasterComponent;
  let fixture: ComponentFixture<LorryMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LorryMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LorryMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
