import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AltaGrupoPage } from './alta-grupo.page';

describe('AltaGrupoPage', () => {
  let component: AltaGrupoPage;
  let fixture: ComponentFixture<AltaGrupoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaGrupoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
