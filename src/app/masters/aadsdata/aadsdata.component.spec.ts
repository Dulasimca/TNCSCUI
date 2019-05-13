import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AADSDataComponent } from './aadsdata.component';

describe('AADSDataComponent', () => {
  let component: AADSDataComponent;
  let fixture: ComponentFixture<AADSDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AADSDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AADSDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
