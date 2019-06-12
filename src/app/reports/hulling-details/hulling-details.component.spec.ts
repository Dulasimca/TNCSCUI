import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HullingDetailsComponent } from './hulling-details.component';

describe('HullingDetailsComponent', () => {
  let component: HullingDetailsComponent;
  let fixture: ComponentFixture<HullingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HullingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HullingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
