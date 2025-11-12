
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginFormComponent } from '../login-form/login-form.component';
import { RecoveryEmailFormComponent } from '../recovery-email-form/recovery-email-form.component';
import { VerificationCodeFormComponent } from '../verification-code-form/verification-code-form.component';
import { NewPasswordFormComponent } from '../new-password-form/new-password-form.component';

export type EstadoAuth = 'login' | 'recuperar-email' | 'verificar-codigo' | 'nueva-contrasena';

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
    RecoveryEmailFormComponent,
    VerificationCodeFormComponent,
    NewPasswordFormComponent
  ]
})
export class AuthFlowComponent implements OnInit {
  estadoActual: EstadoAuth = 'login';
  constructor() { }
  ngOnInit() { }
  cambiarEstado(nuevoEstado: EstadoAuth) {
    this.estadoActual = nuevoEstado;
    console.log(`Cambiando estado a: ${nuevoEstado}`);
  }


  handleLogin(credenciales: any) {
    console.log('FLujo: Credenciales de Login recibidas. ¡Aquí se llama al Servicio de Auth!');
    // Aquí es donde en el futuro llamarías a tu servicio de Firebase o Backend
    // this.authService.login(credenciales.email, credenciales.password);
  }

  handleRecuperarEmail(email: string) {
    console.log(`FLujo: Solicitando código para email: ${email}.`);
    this.cambiarEstado('verificar-codigo');
  }

  handleVerificarCodigo(codigo: string) {
    console.log(`FLujo: Verificando código: ${codigo}.`);
    this.cambiarEstado('nueva-contrasena');
  }

  handleNuevaContrasena(contrasenas: any) {
    console.log('FLujo: Contraseña nueva establecida.');
    this.cambiarEstado('login');
  }
}
