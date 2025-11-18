
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginFormComponent } from '../login-form/login-form.component';
import { RecoveryEmailFormComponent } from '../recovery-email-form/recovery-email-form.component';
import { AuthenticationService } from '../../firebase/authentication.service';

export type AuthState = 'login' | 'recover-email';

@Component({
  selector: 'app-auth-flow',
  templateUrl: './auth-flow.component.html',
  styleUrls: ['./auth-flow.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    LoginFormComponent,
    RecoveryEmailFormComponent
  ]
})
export class AuthFlowComponent implements OnInit {
  currentState: AuthState = 'login';

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() { }

  changeState(nextState: AuthState) {
    this.currentState = nextState;
  }

  async handleLogin(credentials: { email: string; password: string }) {
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const user = await this.authService.signIn(credentials.email, credentials.password);
      await loading.dismiss();

      const toast = await this.toastController.create({
        message: '¡Bienvenido!',
        duration: 2000,
        position: 'top',
        color: 'success',
        icon: 'checkmark-circle-outline'
      });
      await toast.present();

      this.router.navigate(['/admin']);
    } catch (error: any) {
      await loading.dismiss();
      console.error('Error de autenticación:', error);

      let errorMessage = 'No se pudo iniciar sesión';

      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'El correo electrónico no es válido';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Esta cuenta ha sido deshabilitada';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No existe una cuenta con este correo';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Contraseña incorrecta';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Credenciales inválidas. Verifica tu correo y contraseña';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos fallidos. Intenta más tarde';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Error de conexión. Verifica tu internet';
          break;
        default:
          errorMessage = error.message || 'Error al iniciar sesión';
      }

      const alert = await this.alertController.create({
        header: 'Error de Autenticación',
        message: errorMessage,
        buttons: ['OK'],
        cssClass: 'custom-alert'
      });
      await alert.present();
    }
  }

  async handleRecoveryEmail(email: string) {
    console.log('Intentando enviar correo de recuperación a:', email);

    const loading = await this.loadingController.create({
      message: 'Enviando correo de recuperación...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      await this.authService.sendPasswordResetEmail(email);
      await loading.dismiss();

      console.log('✅ Correo enviado exitosamente a:', email);

      const alert = await this.alertController.create({
        header: 'Correo Enviado',
        message: `Se ha enviado un correo de recuperación a ${email}.
        Por favor revisa:
        • Bandeja de entrada
        • Carpeta de SPAM/Correo no deseado
        • Puede tardar algunos minutos en llegar

        El enlace incluido en el correo te permitirá restablecer tu contraseña.`,
        buttons: [
          {
            text: 'Entendido',
            handler: () => {
              this.changeState('login');
            }
          }
        ]
      });
      await alert.present();

    } catch (error: any) {
      await loading.dismiss();
      console.error('Error al enviar correo:', error);
      console.error('Código de error:', error.code);
      console.error('Mensaje completo:', error.message);

      let errorMessage = 'No se pudo enviar el correo de recuperación';

      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'El correo electrónico no es válido';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No existe una cuenta con este correo';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos. Intenta más tarde';
          break;
        case 'auth/missing-android-pkg-name':
        case 'auth/missing-continue-uri':
        case 'auth/missing-ios-bundle-id':
        case 'auth/invalid-continue-uri':
        case 'auth/unauthorized-continue-uri':
          errorMessage = 'Error de configuración. Contacta al administrador';
          break;
        default:
          errorMessage = error.message || 'Error al enviar correo';
      }

      const alert = await this.alertController.create({
        header: 'Error',
        message: errorMessage,
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
