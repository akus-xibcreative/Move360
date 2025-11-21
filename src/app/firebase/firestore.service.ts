import { inject, Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, collection, getDocs, deleteDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  firestore: Firestore = inject(Firestore)

  async getUserData(uid: string) {
    const userDoc = doc(this.firestore, `users/${uid}`);
    const docSnap = await getDoc(userDoc);
    return docSnap.exists() ? docSnap.data() : null;
  }

  async createUserDocument(uid: string, userData: any) {
    const userDoc = doc(this.firestore, `users/${uid}`);
    await setDoc(userDoc, userData);
  }

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

  async createGrade(gradeId: string, gradeData: any) {
    const gradeDoc = doc(this.firestore, `grades/${gradeId}`);
    await setDoc(gradeDoc, gradeData);
  }

  async updateGrade(gradeId: string, gradeData: any) {
    const gradeDoc = doc(this.firestore, `grades/${gradeId}`);
    await setDoc(gradeDoc, gradeData, { merge: true });
  }

  async deleteGrade(gradeId: string) {
    const gradeDoc = doc(this.firestore, `grades/${gradeId}`);
    await deleteDoc(gradeDoc);
  }

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

  async createGroup(groupId: string, groupData: any) {
    const groupDoc = doc(this.firestore, `groups/${groupId}`);
    await setDoc(groupDoc, groupData);
  }

  async updateGroup(groupId: string, groupData: any) {
    const groupDoc = doc(this.firestore, `groups/${groupId}`);
    await setDoc(groupDoc, groupData, { merge: true });
  }

  async deleteGroup(groupId: string) {
    const groupDoc = doc(this.firestore, `groups/${groupId}`);
    await deleteDoc(groupDoc);
  }

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

  async createCategory(categoryId: string, categoryData: any) {
    const categoryDoc = doc(this.firestore, `user_categories/${categoryId}`);
    await setDoc(categoryDoc, categoryData);
  }

  async updateCategory(categoryId: string, categoryData: any) {
    const categoryDoc = doc(this.firestore, `user_categories/${categoryId}`);
    await setDoc(categoryDoc, categoryData, { merge: true });
  }

  async deleteCategory(categoryId: string) {
    const categoryDoc = doc(this.firestore, `user_categories/${categoryId}`);
    await deleteDoc(categoryDoc);
  }

  async updateUser(uid: string, userData: any) {
    const userDoc = doc(this.firestore, `users/${uid}`);
    await setDoc(userDoc, userData, { merge: true });
  }

  async deleteUser(uid: string) {
    const userDoc = doc(this.firestore, `users/${uid}`);
    await deleteDoc(userDoc);
  }
}
