import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadMenWagesComponent } from './load-men-wages.component';

describe('LoadMenWagesComponent', () => {
  let component: LoadMenWagesComponent;
  let fixture: ComponentFixture<LoadMenWagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadMenWagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadMenWagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
