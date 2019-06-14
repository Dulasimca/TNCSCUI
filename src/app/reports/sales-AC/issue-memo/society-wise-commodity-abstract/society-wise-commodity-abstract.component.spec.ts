import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocietyWiseCommodityAbstractComponent } from './society-wise-commodity-abstract.component';

describe('SocietyWiseCommodityAbstractComponent', () => {
  let component: SocietyWiseCommodityAbstractComponent;
  let fixture: ComponentFixture<SocietyWiseCommodityAbstractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocietyWiseCommodityAbstractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocietyWiseCommodityAbstractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
