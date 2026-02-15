import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminPagosPage } from './admin-pagos.page';

describe('AdminPagosPage', () => {
  let component: AdminPagosPage;
  let fixture: ComponentFixture<AdminPagosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPagosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
