import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackCardOpeningEntryComponent } from './stack-card-opening-entry.component';

describe('StackCardOpeningEntryComponent', () => {
  let component: StackCardOpeningEntryComponent;
  let fixture: ComponentFixture<StackCardOpeningEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackCardOpeningEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackCardOpeningEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
