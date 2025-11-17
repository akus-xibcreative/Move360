import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DashboardCardsComponent } from './dashboard-cards.component';

describe('DashboardCardsComponent', () => {
  let component: DashboardCardsComponent;
  let fixture: ComponentFixture<DashboardCardsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [DashboardCardsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
