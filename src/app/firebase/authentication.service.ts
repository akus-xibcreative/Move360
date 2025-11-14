import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, authState, signOut, sendPasswordResetEmail } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  auth: Auth = inject(Auth)
  authState$ = authState(this.auth)

  constructor() {}

  // === Auth User === //
  async signIn(email: string, password: string) {
    const user = await signInWithEmailAndPassword(this.auth, email, password);
    return user;
  }

  async signOut() {
    await signOut(this.auth);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  // === Password Recovery === //
  async sendPasswordResetEmail(email: string) {
    await sendPasswordResetEmail(this.auth, email);
  }
}
