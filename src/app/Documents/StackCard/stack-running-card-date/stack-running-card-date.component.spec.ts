import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackRunningCardDateComponent } from './stack-running-card-date.component';

describe('StackRunningCardDateComponent', () => {
  let component: StackRunningCardDateComponent;
  let fixture: ComponentFixture<StackRunningCardDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackRunningCardDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackRunningCardDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
