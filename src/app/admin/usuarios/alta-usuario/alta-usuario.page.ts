import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonText, IonButton, IonSearchbar,
  IonCard, IonCardContent, IonContent,
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonList, IonItem, IonLabel, IonSkeletonText, SearchbarCustomEvent, IonIcon } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { searchOutline, closeCircleOutline, ellipsisVertical, createOutline, trashOutline, warningOutline } from 'ionicons/icons';
import { AuthenticationService } from '../../../firebase/authentication.service';
import { FirestoreService } from '../../../firebase/firestore.service';

addIcons({ searchOutline, closeCircleOutline, ellipsisVertical, createOutline, trashOutline, warningOutline });

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

  uiState: 'view' | 'new' | 'edit' | 'skeleton' | 'empty' | 'error' = 'view';

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

  editingUser: any = {
    id: '',
    firstName: '',
    secondName: '',
    lastName: '',
    email: '',
    phone: '',
    category_id: '',
    grade_id: '',
    group_id: ''
  };

  isGradeModalOpen = false;
  isGroupModalOpen = false;
  isCategoryModalOpen = false;
  isDeleteModalOpen = false;

  activeMenuUserId: string | null = null;
  userToDelete: any = null;

  allGrades: any[] = [];
  allGroups: any[] = [];
  allCategories: any[] = [];

  constructor(
    private authService: AuthenticationService,
    private firestoreService: FirestoreService
  ) {
      addIcons({searchOutline, closeCircleOutline, ellipsisVertical, createOutline, trashOutline, warningOutline}); }

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

      // Filtrar solo usuarios activos (metadata.delete_flag === true)
      const activeUsers = users.filter(user => user.metadata?.delete_flag === true);

      if (activeUsers.length === 0) {
        this.uiState = 'empty';
      } else {
        this.allUsers = activeUsers;
        this.filteredUsers = [...activeUsers];
        console.log('Usuarios activos cargados:', activeUsers);
        this.uiState = 'view';
      }
    } catch (error) {
      console.error('Error loading users:', error);
      this.uiState = 'error';
    }
  }

  async loadGrades() {
    try {
      const grades = await this.firestoreService.getGrades();
      // Filtrar solo grados activos (metadata.delete_flag === true)
      this.allGrades = grades.filter(grade => grade.metadata?.delete_flag === true);
      console.log('Grades loaded:', this.allGrades);
    } catch (error) {
      console.error('Error loading grades:', error);
    }
  }

  async loadGroups() {
    try {
      const groups = await this.firestoreService.getGroups();
      // Filtrar solo grupos activos (metadata.delete_flag === true)
      this.allGroups = groups.filter(group => group.metadata?.delete_flag === true);
      console.log('Groups loaded:', this.allGroups);
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  }

  async loadCategories() {
    try {
      const categories = await this.firestoreService.getCategories();
      // Filtrar solo categorías activas (metadata.delete_flag === true)
      this.allCategories = categories.filter(cat => cat.metadata?.delete_flag === true);
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
        metadata: {
          created_at: timestamp,
          updated_at: timestamp,
          created_by: createdByName,
          updated_by: createdByName,
          delete_flag: true
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
    if (this.uiState === 'edit') {
      this.editingUser.grade_id = grade.id;
    } else {
      this.newUser.grade_id = grade.id;
    }
    this.isGradeModalOpen = false;
  }

  selectGroup(group: any) {
    if (this.uiState === 'edit') {
      this.editingUser.group_id = group.id;
    } else {
      this.newUser.group_id = group.id;
    }
    this.isGroupModalOpen = false;
  }

  selectCategory(category: any) {
    if (this.uiState === 'edit') {
      this.editingUser.category_id = category.id;
    } else {
      this.newUser.category_id = category.id;
    }
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

  // Método auxiliar para obtener el ID del usuario
  getUserId(user: any): string {
    return user.id || user.uid || user.email;
  }

  // Verificar si es una de las últimas 2 filas
  isLastRows(index: number): boolean {
    return index >= this.filteredUsers.length - 2;
  }

  // Cerrar menú al hacer clic fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.action-wrapper') && !target.closest('.action-popup')) {
      this.activeMenuUserId = null;
    }
  }

  // Funciones para el menú de acciones
  toggleActionMenu(user: any, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    const userId = this.getUserId(user);
    console.log('Toggle menu para usuario:', userId, user); // Debug
    if (this.activeMenuUserId === userId) {
      this.activeMenuUserId = null;
      console.log('Menú cerrado');
    } else {
      this.activeMenuUserId = userId;
      console.log('Menú abierto para:', userId);
      console.log('activeMenuUserId establecido a:', this.activeMenuUserId);
    }
  }

  editUser(user: any) {
    this.editingUser = {
      id: this.getUserId(user),
      firstName: user.firstName,
      secondName: user.secondName || '',
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      category_id: user.category_id || '',
      grade_id: user.grade_id || '',
      group_id: user.group_id || ''
    };
    this.uiState = 'edit';
    this.activeMenuUserId = null;
  }

  async confirmEditUser() {
    try {
      if (!this.editingUser.firstName || !this.editingUser.lastName) {
        alert('Por favor, ingrese nombre y apellido');
        return;
      }

      if (!this.editingUser.id) {
        alert('Error: No se puede identificar el usuario a actualizar');
        return;
      }

      console.log('Updating user:', this.editingUser);

      this.uiState = 'skeleton';

      const userData = {
        firstName: this.editingUser.firstName,
        secondName: this.editingUser.secondName || '',
        lastName: this.editingUser.lastName,
        phone: this.editingUser.phone || '',
        category_id: this.editingUser.category_id || '',
        grade_id: this.editingUser.grade_id || '',
        group_id: this.editingUser.group_id || ''
      };

      await this.firestoreService.updateUser(
        this.editingUser.id,
        userData
      );

      console.log('User updated successfully');
      alert('Usuario actualizado exitosamente');

      await this.loadUsers();
      this.uiState = 'view';
    } catch (error: any) {
      console.error('Error updating user:', error);
      this.uiState = 'edit';
      alert('Error al actualizar usuario: ' + error.message);
    }
  }

  confirmDelete(user: any) {
    this.userToDelete = user;
    this.isDeleteModalOpen = true;
    this.activeMenuUserId = null;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.userToDelete = null;
  }

  async deleteUser() {
    try {
      if (!this.userToDelete) {
        alert('Error: No se puede identificar el usuario a eliminar');
        this.closeDeleteModal();
        return;
      }

      const userId = this.getUserId(this.userToDelete);
      console.log('Marking user as deleted (soft delete):', userId, this.userToDelete);

      this.closeDeleteModal();
      this.uiState = 'skeleton';

      // Obtener el nombre del usuario actual
      const adminUser = this.authService.getCurrentUser();
      let updatedByName = 'admin';
      if (adminUser) {
        const adminData = await this.firestoreService.getUserData(adminUser.uid);
        if (adminData) {
          updatedByName = `${adminData['firstName']} ${adminData['lastName']}`;
        }
      }

      // Soft delete: cambiar metadata.delete_flag a false y actualizar metadata
      await this.firestoreService.updateUser(userId, {
        'metadata.delete_flag': false,
        'metadata.updated_at': new Date(),
        'metadata.updated_by': updatedByName
      });

      console.log('User marked as deleted (soft delete)');
      alert('Usuario eliminado exitosamente');

      await this.loadUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      this.uiState = 'view';
      alert('Error al eliminar usuario: ' + error.message);
    }
  }
}
