import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationPopupComponent } from './notification-popup.component';

describe('NotificationPopupComponent', () => {
  let component: NotificationPopupComponent;
  let fixture: ComponentFixture<NotificationPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
