import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AltaCategoriaPage } from './alta-categoria.page';

describe('AltaCategoriaPage', () => {
  let component: AltaCategoriaPage;
  let fixture: ComponentFixture<AltaCategoriaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaCategoriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
