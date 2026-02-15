import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComprarBonoPage } from './comprar-bono.page';

describe('ComprarBonoPage', () => {
  let component: ComprarBonoPage;
  let fixture: ComponentFixture<ComprarBonoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprarBonoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
