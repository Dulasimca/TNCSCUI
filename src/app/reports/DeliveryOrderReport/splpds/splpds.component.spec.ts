import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SplpdsComponent } from './splpds.component';

describe('SplpdsComponent', () => {
  let component: SplpdsComponent;
  let fixture: ComponentFixture<SplpdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SplpdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplpdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
