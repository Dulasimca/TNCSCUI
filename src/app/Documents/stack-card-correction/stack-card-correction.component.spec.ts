import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackCardCorrectionComponent } from './stack-card-correction.component';

describe('StackCardCorrectionComponent', () => {
  let component: StackCardCorrectionComponent;
  let fixture: ComponentFixture<StackCardCorrectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackCardCorrectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackCardCorrectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
