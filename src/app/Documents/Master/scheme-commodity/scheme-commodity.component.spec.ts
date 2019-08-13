import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeCommodityComponent } from './scheme-commodity.component';

describe('SchemeCommodityComponent', () => {
  let component: SchemeCommodityComponent;
  let fixture: ComponentFixture<SchemeCommodityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemeCommodityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeCommodityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
