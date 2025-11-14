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

  passwordVisible = false;
  get passwordType(): string { return this.passwordVisible ? 'text' : 'password'; }

  @Output() goToRecovery = new EventEmitter<void>();
  @Output() loginSubmit = new EventEmitter<{ email: string; password: string }>();

  togglePasswordVisibility(): void { this.passwordVisible = !this.passwordVisible; }

  onSubmit(): void {
    if (!this.email || !this.password) return;
    this.loginSubmit.emit({ email: this.email, password: this.password });
  }

  onGoToRecovery(): void { this.goToRecovery.emit(); }
}
