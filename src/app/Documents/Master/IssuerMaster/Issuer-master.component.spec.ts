import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuerMasterComponent } from './Issuer-master.component';


describe('IssuerMasterComponent', () => {
  let component: IssuerMasterComponent;
  let fixture: ComponentFixture<IssuerMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuerMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuerMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
