import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService } from '../firebase/authentication.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, CommonModule],
})
export class HomePage {
  userEmail: string | null = null;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private alertController: AlertController
  ) {
    const user = this.authService.getCurrentUser();
    this.userEmail = user?.email || null;
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cerrar Sesión',
          role: 'confirm',
          handler: async () => {
            await this.authService.signOut();
            this.router.navigate(['/auth']);
          }
        }
      ]
    });

    await alert.present();
  }
}
