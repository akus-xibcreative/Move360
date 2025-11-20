import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonText, IonButton, IonSearchbar,
  IonCard, IonCardContent, IonContent,
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonList, IonItem, IonLabel, IonSkeletonText, SearchbarCustomEvent, IonIcon } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { searchOutline, closeCircleOutline } from 'ionicons/icons';
import { AuthenticationService } from '../../../firebase/authentication.service';
import { FirestoreService } from '../../../firebase/firestore.service';

addIcons({ searchOutline, closeCircleOutline });

@Component({
  selector: 'app-alta-usuario',
  templateUrl: './alta-usuario.page.html',
  styleUrls: ['./alta-usuario.page.scss'],
  standalone: true,
  imports: [IonSkeletonText, IonIcon, IonContent,
    CommonModule, FormsModule,
    IonText, IonButton, IonSearchbar,
    IonCard, IonCardContent,
    IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonList, IonItem, IonLabel
  ]
})
export class AltaUsuarioPage implements OnInit {

  uiState: 'view' | 'new' | 'skeleton' | 'empty' | 'error' = 'view';

  allUsers: any[] = [];
  filteredUsers: any[] = [];

  newUser: any = {
    firstName: '',
    secondName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    category_id: '',
    grade_id: '',
    group_id: ''
  };

  isGradeModalOpen = false;
  isGroupModalOpen = false;
  isCategoryModalOpen = false;

  allGrades: any[] = [];
  allGroups: any[] = [];
  allCategories: any[] = [];

  constructor(
    private authService: AuthenticationService,
    private firestoreService: FirestoreService
  ) {
      addIcons({searchOutline,closeCircleOutline}); }

  async ngOnInit() {
    this.uiState = 'skeleton';

    try {
      await Promise.all([
        this.loadGrades(),
        this.loadGroups(),
        this.loadCategories()
      ]);

      await this.loadUsers();
    } catch (error) {
      console.error('Error initializing page:', error);
      this.uiState = 'error';
    }
  }

  async loadUsers() {
    try {
      const users = await this.firestoreService.getAllUsers();

      if (users.length === 0) {
        this.uiState = 'empty';
      } else {
        this.allUsers = users;
        this.filteredUsers = [...users];
        this.uiState = 'view';
      }
    } catch (error) {
      console.error('Error loading users:', error);
      this.uiState = 'error';
    }
  }

  async loadGrades() {
    try {
      this.allGrades = await this.firestoreService.getGrades();
      console.log('Grades loaded:', this.allGrades);
    } catch (error) {
      console.error('Error loading grades:', error);
    }
  }

  async loadGroups() {
    try {
      this.allGroups = await this.firestoreService.getGroups();
      console.log('Groups loaded:', this.allGroups);
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  }

  async loadCategories() {
    try {
      this.allCategories = await this.firestoreService.getCategories();
      console.log('Categories loaded:', this.allCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }



  filterUsers(event: SearchbarCustomEvent) {
    const query = event.detail.value?.toLowerCase() || '';

    if (query === '') {
      this.filteredUsers = [...this.allUsers];
      this.uiState = 'view';
      return;
    }

    this.filteredUsers = this.allUsers.filter((user: any) => {
      return user.firstName.toLowerCase().indexOf(query) > -1;
    });
    if (this.filteredUsers.length === 0) {
      this.uiState = 'empty';
    } else {
      this.uiState = 'view';
    }
  }

  onSearchChange(event: SearchbarCustomEvent) {
    this.filterUsers(event);
    const query = event.detail.value?.toLowerCase() || '';
    if (query === 'error-test') {
      this.uiState = 'error';
    }
  }

  changeToViewState() {
    this.uiState = 'view';
  }

  changeToNewState() {
    this.uiState = 'new';
    this.newUser = {
      firstName: '',
      secondName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      category_id: '',
      grade_id: '',
      group_id: ''
    };
  }

  async confirmEdit() {
    try {
      if (!this.newUser.email || !this.newUser.password) {
        alert('Por favor, ingrese correo y contraseña');
        return;
      }

      if (!this.newUser.firstName || !this.newUser.lastName) {
        alert('Por favor, ingrese nombre y apellido');
        return;
      }

      console.log('New user data:', this.newUser);

      this.uiState = 'skeleton';

      const adminUser = this.authService.getCurrentUser();
      const adminUid = adminUser?.uid || 'admin';

      let createdByName = 'admin';
      if (adminUid !== 'admin') {
        const adminData = await this.firestoreService.getUserData(adminUid);
        if (adminData) {
          createdByName = `${adminData['firstName']} ${adminData['lastName']}`;
        }
      }

      const userCredential = await this.authService.createUser(
        this.newUser.email,
        this.newUser.password
      );

      const timestamp = new Date();

      const userData = {
        firstName: this.newUser.firstName,
        secondName: this.newUser.secondName || '',
        lastName: this.newUser.lastName,
        email: this.newUser.email,
        phone: this.newUser.phone || '',
        category_id: this.newUser.category_id || '',
        grade_id: this.newUser.grade_id || '',
        group_id: this.newUser.group_id || '',
        status: true,
        delete_flag: false,
        metadata: {
          created_at: timestamp,
          updated_at: timestamp,
          created_by: createdByName,
          updated_by: createdByName,
          delete_flag: false
        }
      };

      await this.firestoreService.createUserDocument(
        userCredential.user.uid,
        userData
      );

      console.log('User created successfully');
      alert('Usuario creado exitosamente');

      await this.loadUsers();
    } catch (error: any) {
      console.error('Error creating user:', error);
      this.uiState = 'new';

      if (error.code === 'auth/email-already-in-use') {
        alert('Este correo ya está registrado');
      } else if (error.code === 'auth/weak-password') {
        alert('La contraseña debe tener al menos 6 caracteres');
      } else if (error.code === 'auth/invalid-email') {
        alert('El correo electrónico no es válido');
      } else {
        alert('Error al crear usuario: ' + error.message);
      }
    }
  }

  openModal(type: 'grade' | 'group' | 'category') {
    if (type === 'grade') this.isGradeModalOpen = true;
    if (type === 'group') this.isGroupModalOpen = true;
    if (type === 'category') this.isCategoryModalOpen = true;
  }

  selectGrade(grade: any) {
    this.newUser.grade_id = grade.id;
    this.isGradeModalOpen = false;
  }

  selectGroup(group: any) {
    this.newUser.group_id = group.id;
    this.isGroupModalOpen = false;
  }

  selectCategory(category: any) {
    this.newUser.category_id = category.id;
    this.isCategoryModalOpen = false;
  }

  closeModal(type: 'grade' | 'group' | 'category') {
    if (type === 'grade') this.isGradeModalOpen = false;
    if (type === 'group') this.isGroupModalOpen = false;
    if (type === 'category') this.isCategoryModalOpen = false;
  }

  getCategoryDescription(categoryId: string): string {
    if (!categoryId) return '';
    const category = this.allCategories.find(cat => cat.id === categoryId);
    return category ? category.desc : categoryId;
  }

  getGradeDescription(gradeId: string): string {
    if (!gradeId) return '';
    const grade = this.allGrades.find(g => g.id === gradeId);
    return grade ? grade.desc : gradeId;
  }

  getGroupDescription(groupId: string): string {
    if (!groupId) return '';
    const group = this.allGroups.find(g => g.id === groupId);
    return group ? group.desc : groupId;
  }
}
