import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMasterModificationComponent } from './item-master-modification.component';

describe('ItemMasterModificationComponent', () => {
  let component: ItemMasterModificationComponent;
  let fixture: ComponentFixture<ItemMasterModificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemMasterModificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMasterModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
