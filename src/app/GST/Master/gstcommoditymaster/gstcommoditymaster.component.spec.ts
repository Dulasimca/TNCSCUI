import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GstcommoditymasterComponent } from './gstcommoditymaster.component';

describe('GstcommoditymasterComponent', () => {
  let component: GstcommoditymasterComponent;
  let fixture: ComponentFixture<GstcommoditymasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GstcommoditymasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GstcommoditymasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
