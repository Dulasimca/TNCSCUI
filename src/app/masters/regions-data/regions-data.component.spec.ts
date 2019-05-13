import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionsDataComponent } from './regions-data.component';

describe('RegionsDataComponent', () => {
  let component: RegionsDataComponent;
  let fixture: ComponentFixture<RegionsDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegionsDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
