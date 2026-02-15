import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BonosPage } from './bonos.page';

describe('BonosPage', () => {
  let component: BonosPage;
  let fixture: ComponentFixture<BonosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BonosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
