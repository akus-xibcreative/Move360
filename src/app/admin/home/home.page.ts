import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { PaymentStatusComponent } from 'src/app/components/payment-status/payment-status.component';
import { DashboardCardsComponent } from 'src/app/components/dashboard-cards/dashboard-cards.component';
import { AnnouncementsTableComponent } from 'src/app/components/announcements-table/announcements-table.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    PaymentStatusComponent,
    DashboardCardsComponent,
    AnnouncementsTableComponent,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonGrid,
    IonRow,
    IonCol
  ],
})
export class HomePage {}
