import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteOffComponent } from './write-off.component';

describe('WriteOffComponent', () => {
  let component: WriteOffComponent;
  let fixture: ComponentFixture<WriteOffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriteOffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteOffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
