import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonText, IonPopover, IonList, IonItem, IonLabel, IonIcon } from '@ionic/angular/standalone';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { AuthenticationService } from '../firebase/authentication.service';
import { FirestoreService } from '../firebase/firestore.service';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';

addIcons({ logOutOutline });

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    IonContent, IonText, IonPopover, IonList, IonItem, IonLabel, IonIcon
  ]
})
export class AdminPage implements OnInit {

  userName: string = '';
  isPopoverOpen = false;

  constructor(
    private authService: AuthenticationService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {
      addIcons({logOutOutline}); }

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

  togglePopover(event: Event) {
    this.isPopoverOpen = !this.isPopoverOpen;
  }

  async logout() {
    this.isPopoverOpen = false;
    await this.authService.signOut();
    this.router.navigate(['/auth']);
  }

}
