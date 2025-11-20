import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, authState, signOut, sendPasswordResetEmail, updateCurrentUser } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  auth: Auth = inject(Auth)
  authState$ = authState(this.auth)

  async signIn(email: string, password: string) {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  async createUser(email: string, password: string) {
    const currentUser = this.auth.currentUser;
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

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

  async sendPasswordResetEmail(email: string) {
    await sendPasswordResetEmail(this.auth, email);
  }
}
