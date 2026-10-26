import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalonCardComponent } from './salon-card.component';

describe('SalonCardComponent', () => {
  let component: SalonCardComponent;
  let fixture: ComponentFixture<SalonCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalonCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalonCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
