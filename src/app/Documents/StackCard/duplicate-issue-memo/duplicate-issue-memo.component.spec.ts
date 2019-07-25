import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateIssueMemoComponent } from './duplicate-issue-memo.component';

describe('DuplicateIssueMemoComponent', () => {
  let component: DuplicateIssueMemoComponent;
  let fixture: ComponentFixture<DuplicateIssueMemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuplicateIssueMemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateIssueMemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
