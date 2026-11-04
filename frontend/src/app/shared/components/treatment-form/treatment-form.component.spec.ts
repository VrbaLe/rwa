import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentFormComponent } from './treatment-form.component';

describe('TreatmentFormComponent', () => {
  let component: TreatmentFormComponent;
  let fixture: ComponentFixture<TreatmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreatmentFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TreatmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
