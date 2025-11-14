import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, authState, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  auth: Auth = inject(Auth)
  authState$ = authState(this.auth)

  constructor() {}

  // === Auth User === //
  async signIn(email: string, password: string) {
    const user = await signInWithEmailAndPassword(this.auth, email, password)
    return user;
  }

  async signOut() {
    await signOut(this.auth);
  }
}
