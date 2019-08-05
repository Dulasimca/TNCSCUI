import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackCardComponent } from './stack-card.component';

describe('StackCardComponent', () => {
  let component: StackCardComponent;
  let fixture: ComponentFixture<StackCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
