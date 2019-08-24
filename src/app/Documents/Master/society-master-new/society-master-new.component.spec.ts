import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocietyMasterNewComponent } from './society-master-new.component';

describe('SocietyMasterNewComponent', () => {
  let component: SocietyMasterNewComponent;
  let fixture: ComponentFixture<SocietyMasterNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocietyMasterNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocietyMasterNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
