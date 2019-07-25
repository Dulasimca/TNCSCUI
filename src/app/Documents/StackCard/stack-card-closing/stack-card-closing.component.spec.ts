import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackCardClosingComponent } from './stack-card-closing.component';

describe('StackCardClosingComponent', () => {
  let component: StackCardClosingComponent;
  let fixture: ComponentFixture<StackCardClosingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackCardClosingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackCardClosingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
