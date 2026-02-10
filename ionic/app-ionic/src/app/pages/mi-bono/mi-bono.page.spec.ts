import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiBonoPage } from './mi-bono.page';

describe('MiBonoPage', () => {
  let component: MiBonoPage;
  let fixture: ComponentFixture<MiBonoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MiBonoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
