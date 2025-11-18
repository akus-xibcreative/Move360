import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonText } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { AuthenticationService } from '../firebase/authentication.service';
import { FirestoreService } from '../firebase/firestore.service';

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

  userName: string = '';

  constructor(
    private authService: AuthenticationService,
    private firestoreService: FirestoreService
  ) { }

  async ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      const userData = await this.firestoreService.getUserData(user.uid);

      if (userData) {
        this.userName = `${userData['firstName']} ${userData['lastName']}`;
      } else {
        this.userName = user.email || 'Usuario';
      }
    }
  }

}
