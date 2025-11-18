import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, authState, signOut, sendPasswordResetEmail, updateCurrentUser } from '@angular/fire/auth';

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

  async createUser(email: string, password: string) {
    const currentUser = this.auth.currentUser;

    // Crear el nuevo usuario
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

    // Restaurar la sesión del usuario administrador
    if (currentUser) {
      await updateCurrentUser(this.auth, currentUser);
    }

    return userCredential;
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
