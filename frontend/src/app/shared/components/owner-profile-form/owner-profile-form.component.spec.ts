import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerProfileFormComponent } from './owner-profile-form.component';

describe('OwnerProfileFormComponent', () => {
  let component: OwnerProfileFormComponent;
  let fixture: ComponentFixture<OwnerProfileFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerProfileFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OwnerProfileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
