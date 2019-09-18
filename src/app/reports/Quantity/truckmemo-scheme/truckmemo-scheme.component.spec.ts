import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TruckMemoSchemeComponent } from './truckmemo-scheme.component';

describe('TruckMemoSchemeComponent', () => {
  let component: TruckMemoSchemeComponent;
  let fixture: ComponentFixture<TruckMemoSchemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TruckMemoSchemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckMemoSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
