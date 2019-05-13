import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GodownDataComponent } from './godown-data.component';

describe('GodownDataComponent', () => {
  let component: GodownDataComponent;
  let fixture: ComponentFixture<GodownDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GodownDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GodownDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
