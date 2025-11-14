
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginFormComponent } from '../login-form/login-form.component';
import { RecoveryEmailFormComponent } from '../recovery-email-form/recovery-email-form.component';
import { VerificationCodeFormComponent } from '../verification-code-form/verification-code-form.component';
import { NewPasswordFormComponent } from '../new-password-form/new-password-form.component';

export type AuthState = 'login' | 'recover-email' | 'verify-code' | 'new-password';

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
  currentState: AuthState = 'login';

  constructor() { }

  ngOnInit() { }

  changeState(nextState: AuthState) {
    this.currentState = nextState;
  }
}
