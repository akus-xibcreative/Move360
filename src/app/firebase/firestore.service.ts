import { inject, Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, collection, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  firestore: Firestore = inject(Firestore)

  constructor() {
    console.log('FirestoreService');
  }

  // === Read === //
  async getUserData(uid: string) {
    const userDoc = doc(this.firestore, `users/${uid}`);
    const docSnap = await getDoc(userDoc);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  }

  // === Create === //
  async createUserDocument(uid: string, userData: any) {
    const userDoc = doc(this.firestore, `users/${uid}`);
    await setDoc(userDoc, userData);
  }

  // === Get All Users === //
  async getAllUsers() {
    const usersCollection = collection(this.firestore, 'users');
    const querySnapshot = await getDocs(usersCollection);
    const users: any[] = [];

    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return users;
  }

  // === Get Grades === //
  async getGrades() {
    const gradesCollection = collection(this.firestore, 'grades');
    const querySnapshot = await getDocs(gradesCollection);
    const grades: any[] = [];

    querySnapshot.forEach((doc) => {
      grades.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return grades;
  }

  // === Get Groups === //
  async getGroups() {
    const groupsCollection = collection(this.firestore, 'groups');
    const querySnapshot = await getDocs(groupsCollection);
    const groups: any[] = [];

    querySnapshot.forEach((doc) => {
      groups.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return groups;
  }

  // === Get Categories === //
  async getCategories() {
    const categoriesCollection = collection(this.firestore, 'user_categories');
    const querySnapshot = await getDocs(categoriesCollection);
    const categories: any[] = [];

    querySnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return categories;
  }
}
