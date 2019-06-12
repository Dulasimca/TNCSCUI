import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeIssueMemoComponent } from './scheme-issue-memo.component';

describe('SchemeIssueMemoComponent', () => {
  let component: SchemeIssueMemoComponent;
  let fixture: ComponentFixture<SchemeIssueMemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemeIssueMemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeIssueMemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
