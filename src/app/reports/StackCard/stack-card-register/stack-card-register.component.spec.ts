import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackCardRegisterComponent } from './stack-card-register.component';

describe('StackCardRegisterComponent', () => {
  let component: StackCardRegisterComponent;
  let fixture: ComponentFixture<StackCardRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackCardRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackCardRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
