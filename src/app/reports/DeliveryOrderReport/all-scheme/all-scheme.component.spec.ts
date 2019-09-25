import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSchemeComponent } from '././all-scheme.component';

describe('AllSchemeComponent', () => {
  let component: AllSchemeComponent;
  let fixture: ComponentFixture<AllSchemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllSchemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
