import { inject, Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, collection, getDocs, deleteDoc, addDoc, query, where, updateDoc } from '@angular/fire/firestore';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  firestore: Firestore = inject(Firestore)
  authService: AuthenticationService = inject(AuthenticationService)

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
    await updateDoc(gradeDoc, gradeData);
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
    await updateDoc(groupDoc, groupData);
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
    await updateDoc(categoryDoc, categoryData);
  }

  async deleteCategory(categoryId: string) {
    const categoryDoc = doc(this.firestore, `user_categories/${categoryId}`);
    await deleteDoc(categoryDoc);
  }

  async updateUser(uid: string, userData: any) {
    const userDoc = doc(this.firestore, `users/${uid}`);
    await updateDoc(userDoc, userData);
  }

  async deleteUser(uid: string) {
    const userDoc = doc(this.firestore, `users/${uid}`);
    await deleteDoc(userDoc);
  }

  // --- tutor_students collection helpers ---
  async createTutorStudentRelation(tutorUid: string, tutorName: string, studentUid: string, studentName: string) {
    const tutorStudentsCollection = collection(this.firestore, 'tutor_students');
    const currentUser = this.authService.getCurrentUser();

    // Obtener nombre del usuario actual para metadata
    let createdByName = 'system';
    if (currentUser) {
      const userData = await this.getUserData(currentUser.uid);
      if (userData) {
        createdByName = `${userData['firstName']} ${userData['lastName']}`;
      }
    }

    const data = {
      tutor_uid: tutorUid,
      tutor_name: tutorName,
      student_uid: studentUid,
      student_name: studentName,
      metadata: {
        created_at: new Date(),
        created_by: createdByName,
        updated_at: new Date(),
        updated_by: createdByName
      }
    };

    await addDoc(tutorStudentsCollection, data);
  }

  async getAllTutorStudentRelations() {
    const tutorStudentsCollection = collection(this.firestore, 'tutor_students');
    const querySnapshot = await getDocs(tutorStudentsCollection);
    const relations: any[] = [];

    querySnapshot.forEach((docSnap) => {
      relations.push({ id: docSnap.id, ...docSnap.data() });
    });

    return relations;
  }

  async getTutorStudentRelationsByTutor(tutorUid: string) {
    const tutorStudentsCollection = collection(this.firestore, 'tutor_students');
    const q = query(tutorStudentsCollection, where('tutor_uid', '==', tutorUid));
    const querySnapshot = await getDocs(q);
    const relations: any[] = [];

    querySnapshot.forEach((docSnap) => {
      relations.push({ id: docSnap.id, ...docSnap.data() });
    });

    return relations;
  }

  // --- payments collection helpers ---
  async createPayment(studentUid: string, studentName: string, payerUid: string, payerName: string, amountDue: number, membershipStart: Date, membershipEnd: Date) {
    const paymentsCollection = collection(this.firestore, 'payments');
    const currentUser = this.authService.getCurrentUser();

    // Obtener nombre del usuario actual para metadata
    let createdByName = 'system';
    if (currentUser) {
      const userData = await this.getUserData(currentUser.uid);
      if (userData) {
        createdByName = `${userData['firstName']} ${userData['lastName']}`;
      }
    }

    const now = new Date();

    const data = {
      student_uid: studentUid,
      student_name: studentName,
      payer_uid: payerUid,
      payer_name: payerName,
      amount_due: amountDue,
      status: false, // false = Pendiente, true = Pagado
      membership_start: membershipStart,
      membership_end: membershipEnd,
      metadata: {
        created_at: now,
        created_by: createdByName,
        updated_at: now,
        updated_by: createdByName
      }
    };

    await addDoc(paymentsCollection, data);
  }

  async getAllPayments() {
    const paymentsCollection = collection(this.firestore, 'payments');
    const querySnapshot = await getDocs(paymentsCollection);
    const payments: any[] = [];

    querySnapshot.forEach((docSnap) => {
      payments.push({ id: docSnap.id, ...docSnap.data() });
    });

    return payments;
  }

  async updatePayment(paymentId: string, paymentData: any) {
    const paymentDoc = doc(this.firestore, `payments/${paymentId}`);
    await updateDoc(paymentDoc, paymentData);
  }
}
