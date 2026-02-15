import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminCrearClasePage } from './admin-crear-clase.page';

describe('AdminCrearClasePage', () => {
  let component: AdminCrearClasePage;
  let fixture: ComponentFixture<AdminCrearClasePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCrearClasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
