import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnnouncementsTableComponent } from './announcements-table.component';

describe('AnnouncementsTableComponent', () => {
  let component: AnnouncementsTableComponent;
  let fixture: ComponentFixture<AnnouncementsTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AnnouncementsTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnnouncementsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
