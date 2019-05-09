import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailystockstatementComponent } from './dailystockstatement.component';

describe('DailystockstatementComponent', () => {
  let component: DailystockstatementComponent;
  let fixture: ComponentFixture<DailystockstatementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailystockstatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailystockstatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
