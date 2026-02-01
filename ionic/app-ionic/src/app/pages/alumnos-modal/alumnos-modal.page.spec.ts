import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlumnosModalPage } from './alumnos-modal.page';

describe('AlumnosModalPage', () => {
  let component: AlumnosModalPage;
  let fixture: ComponentFixture<AlumnosModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumnosModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
