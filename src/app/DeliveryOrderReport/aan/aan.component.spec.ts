import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AanComponent } from './aan.component';

describe('AanComponent', () => {
  let component: AanComponent;
  let fixture: ComponentFixture<AanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
