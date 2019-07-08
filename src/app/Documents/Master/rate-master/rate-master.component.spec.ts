import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateMasterComponent } from './rate-master.component';

describe('RateMasterComponent', () => {
  let component: RateMasterComponent;
  let fixture: ComponentFixture<RateMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
