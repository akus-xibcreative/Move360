import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Importa todos los módulos de Ionic que el HTML necesita
import {
  IonItem,
  IonInput,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-recovery-email-form',
  templateUrl: './recovery-email-form.component.html',
  styleUrls: ['./recovery-email-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonItem,
    IonInput,
    IonButton,
    IonIcon
  ],
})
export class RecoveryEmailFormComponent {

  // Modelo de datos para el input
  email: string = '';

  // Eventos de salida para notificar al componente padre (AuthFlowComponent)
  @Output() emailSubmit = new EventEmitter<string>();
  @Output() goToLogin = new EventEmitter<void>();

  constructor() {}

  /**
   * Maneja el envío del formulario.
   * Emite el email ingresado al componente padre.
   */
  onSubmit() {
    // Aquí podrías añadir validación básica si fuera necesario
    if (this.email) {
      this.emailSubmit.emit(this.email);
    }
  }

  /**
   * Llama al evento para navegar de regreso a la pantalla de Login.
   */
  onGoToLogin() {
    this.goToLogin.emit();
  }
}
