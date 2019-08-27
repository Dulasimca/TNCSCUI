import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OapComponent } from './oap.component';

describe('OapComponent', () => {
  let component: OapComponent;
  let fixture: ComponentFixture<OapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
