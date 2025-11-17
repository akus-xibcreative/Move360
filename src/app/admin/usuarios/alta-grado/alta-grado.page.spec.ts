import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AltaGradoPage } from './alta-grado.page';

describe('AltaGradoPage', () => {
  let component: AltaGradoPage;
  let fixture: ComponentFixture<AltaGradoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaGradoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
