import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentCorrectionComponent } from './document-correction.component';

describe('DocumentCorrectionComponent', () => {
  let component: DocumentCorrectionComponent;
  let fixture: ComponentFixture<DocumentCorrectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentCorrectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentCorrectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
