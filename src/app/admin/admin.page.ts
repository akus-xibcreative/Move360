import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonText } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonText
  ]
})
export class AdminPage implements OnInit {

  userName: string = 'Abner Ku';

  constructor() { }

  ngOnInit() {
  }

}
