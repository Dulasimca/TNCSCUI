import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditInceptionComponent } from './audit-inception.component';

describe('AuditInceptionComponent', () => {
  let component: AuditInceptionComponent;
  let fixture: ComponentFixture<AuditInceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditInceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditInceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
