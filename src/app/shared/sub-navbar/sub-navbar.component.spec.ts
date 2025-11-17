import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubNavbarComponent } from './sub-navbar.component';

describe('SubNavbarComponent', () => {
  let component: SubNavbarComponent;
  let fixture: ComponentFixture<SubNavbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SubNavbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
