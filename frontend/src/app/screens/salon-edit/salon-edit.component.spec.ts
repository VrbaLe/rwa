import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalonEditComponent } from './salon-edit.component';

describe('SalonEditComponent', () => {
  let component: SalonEditComponent;
  let fixture: ComponentFixture<SalonEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalonEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalonEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
