import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginFormComponent {

  // Propiedades para enviar datos al componente padre
  // Esto debe coincidir con los nombres en el AuthFlowComponent
  @Output() loginSubmit = new EventEmitter<any>();
  @Output() goToRecuperar = new EventEmitter<void>();

  // Variables para enlazar a los campos del formulario
  public email = '';
  public password = '';

  constructor() { }

  /**
   * Método que se llama cuando el usuario hace clic en el botón "Acceder".
   * Emite los datos del formulario al componente padre.
   */
  onSubmit() {
    this.loginSubmit.emit({
      email: this.email,
      password: this.password
    });
    // console.log('Login data submitted:', this.email);
  }

  /**
   * MÉTODO CORREGIDO:
   * Este método es llamado por el botón "Olvidaste tu Contraseña" en el HTML.
   * Su única tarea es activar el EventEmitter goToRecuperar.
   */
  onGoToRecuperar() {
    this.goToRecuperar.emit();
  }
}
