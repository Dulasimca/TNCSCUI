import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopSocietUpdateMasterComponent } from './shopSocietyUpdate.component';

describe('ShopSocietUpdateMasterComponent', () => {
  let component: ShopSocietUpdateMasterComponent;
  let fixture: ComponentFixture<ShopSocietUpdateMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopSocietUpdateMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopSocietUpdateMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
