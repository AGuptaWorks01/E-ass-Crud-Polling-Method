import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDltComponent } from './add-edit-dlt.component';

describe('AddEditDltComponent', () => {
  let component: AddEditDltComponent;
  let fixture: ComponentFixture<AddEditDltComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditDltComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditDltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
