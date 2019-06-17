import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GunnyGuGrComponent } from './gunny-gu-gr.component';

describe('GunnyGuGrComponent', () => {
  let component: GunnyGuGrComponent;
  let fixture: ComponentFixture<GunnyGuGrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GunnyGuGrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GunnyGuGrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
