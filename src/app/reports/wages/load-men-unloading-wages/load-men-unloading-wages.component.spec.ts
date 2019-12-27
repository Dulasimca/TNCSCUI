import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadMenUnloadingWagesComponent } from './load-men-unloading-wages.component';

describe('LoadMenUnloadingWagesComponent', () => {
  let component: LoadMenUnloadingWagesComponent;
  let fixture: ComponentFixture<LoadMenUnloadingWagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadMenUnloadingWagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadMenUnloadingWagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
