import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminCrearUsuarioPage } from './admin-crear-usuario.page';

describe('AdminCrearUsuarioPage', () => {
  let component: AdminCrearUsuarioPage;
  let fixture: ComponentFixture<AdminCrearUsuarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCrearUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
