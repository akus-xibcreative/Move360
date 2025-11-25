import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommuniquesComponent } from './communiques.component';

describe('CommuniquesComponent', () => {
  let component: CommuniquesComponent;
  let fixture: ComponentFixture<CommuniquesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CommuniquesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommuniquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
