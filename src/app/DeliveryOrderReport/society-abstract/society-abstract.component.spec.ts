import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocietyAbstractComponent } from './society-abstract.component';

describe('SocietyAbstractComponent', () => {
  let component: SocietyAbstractComponent;
  let fixture: ComponentFixture<SocietyAbstractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocietyAbstractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocietyAbstractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
