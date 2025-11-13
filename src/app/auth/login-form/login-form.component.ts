import { Component, EventEmitter, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class LoginFormComponent {
  email = '';
  password = '';

  passwordVisible: boolean = false;
  get passwordType(): string {
    return this.passwordVisible ? 'text' : 'password';
  }

  @Output() goToRecuperar = new EventEmitter<void>();

  @Output() loginSubmit = new EventEmitter<{ email: string, password: string }>();

  constructor() {}


  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(): void {
    if (this.email && this.password) {
      this.loginSubmit.emit({ email: this.email, password: this.password });
    }
  }

  onGoToRecuperar(): void {
    this.goToRecuperar.emit();
  }
}
