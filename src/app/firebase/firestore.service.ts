import { inject, Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  firestore: Firestore = inject(Firestore)

  constructor() {
    console.log('FirestoreService');
  }

  // === Create === //
  async createDocument() {
    console.log('CreateDocument')
  }
}
