import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';

/** Validador personalizado para asegurar que los campos de contraseña y confirmación
 * son iguales.
 */
export function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');

  if (password?.value !== confirmPassword?.value && confirmPassword?.dirty) {
    // Retorna el error si no coinciden
    return { passwordsNotMatching: true };
  }
  return null; // Retorna nulo si son iguales o si aún no se toca
}

@Component({
  selector: 'app-new-password-form',
  templateUrl: './new-password-form.component.html',
  styleUrls: ['../auth-flow/auth-flow.component.scss'], // Reutiliza estilos globales
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class NewPasswordFormComponent implements OnInit {
  passwordForm!: FormGroup;

  // Emite la nueva contraseña al padre
  @Output() passwordSubmit = new EventEmitter<any>();
  // Emite el evento para volver al Login
  @Output() goToLogin = new EventEmitter<void>();


  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    }, {
      // Aplica el validador a nivel de FormGroup
      validators: passwordsMatchValidator
    });
  }

  get passwordControls() {
    return this.passwordForm.controls;
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      this.passwordSubmit.emit({ newPassword: this.passwordForm.value.newPassword });
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }
}
