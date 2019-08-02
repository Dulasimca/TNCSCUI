import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackCardOpeningComponent } from './stack-card-opening.component';

describe('StackCardOpeningComponent', () => {
  let component: StackCardOpeningComponent;
  let fixture: ComponentFixture<StackCardOpeningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackCardOpeningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackCardOpeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
