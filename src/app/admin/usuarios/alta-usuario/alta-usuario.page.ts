import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonText, IonButton, IonIcon, IonSearchbar,
  IonCard, IonCardContent, IonGrid, IonRow, IonCol,
  IonInput, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonList, IonItem, IonLabel, IonSkeletonText } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { eyeOutline, addOutline, searchOutline, closeOutline, checkmarkOutline, closeCircleOutline } from 'ionicons/icons';
import { AuthenticationService } from '../../../firebase/authentication.service';
import { FirestoreService } from '../../../firebase/firestore.service';

addIcons({ eyeOutline, addOutline, searchOutline, closeOutline, checkmarkOutline });

@Component({
  selector: 'app-alta-usuario',
  templateUrl: './alta-usuario.page.html',
  styleUrls: ['./alta-usuario.page.scss'],
  standalone: true,
  imports: [IonSkeletonText,
    CommonModule, FormsModule,
    IonContent, IonText, IonButton, IonIcon, IonSearchbar,
    IonCard, IonCardContent, IonGrid, IonRow, IonCol,
    IonInput, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonList, IonItem, IonLabel
  ]
})
export class AltaUsuarioPage implements OnInit {

  // Mocks de Estado de la UI
  uiState: 'ver' | 'nuevo' | 'skeleton' | 'empty' | 'error' = 'ver'; // Estado inicial

  // Mock de datos de la tabla (estado 'ver')
  mockUsers: any[] = [];

  // Datos para la fila editable (estado 'nuevo')
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

  // Variables para Popups/Modales mock
  isGradeModalOpen = false;
  isGroupModalOpen = false;
  isCategoryModalOpen = false;

  // Mocks para las opciones de selección
  mockGrades: any[] = [];
  mockGroups: any[] = [];
  mockCategories: any[] = [];

  constructor(
    private authService: AuthenticationService,
    private firestoreService: FirestoreService
  ) {
      addIcons({searchOutline,closeCircleOutline}); }

  async ngOnInit() {
    this.uiState = 'skeleton';

    try {
      // Cargar todos los datos en paralelo antes de mostrar la tabla
      await Promise.all([
        this.loadGrades(),
        this.loadGroups(),
        this.loadCategories()
      ]);

      // Una vez que tenemos las categorías, grados y grupos, cargar usuarios
      await this.loadUsers();
    } catch (error) {
      console.error('Error al inicializar la página:', error);
      this.uiState = 'error';
    }
  }

  // Cargar usuarios desde Firestore
  async loadUsers() {
    try {
      const users = await this.firestoreService.getAllUsers();

      if (users.length === 0) {
        this.uiState = 'empty';
      } else {
        this.mockUsers = users;
        this.uiState = 'ver';
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      this.uiState = 'error';
    }
  }

  // Cargar grados desde Firestore
  async loadGrades() {
    try {
      this.mockGrades = await this.firestoreService.getGrades();
      console.log('Grados cargados:', this.mockGrades);
    } catch (error) {
      console.error('Error al cargar grados:', error);
    }
  }

  // Cargar grupos desde Firestore
  async loadGroups() {
    try {
      this.mockGroups = await this.firestoreService.getGroups();
      console.log('Grupos cargados:', this.mockGroups);
    } catch (error) {
      console.error('Error al cargar grupos:', error);
    }
  }

  // Cargar categorías desde Firestore
  async loadCategories() {
    try {
      this.mockCategories = await this.firestoreService.getCategories();
      console.log('Categorías cargadas:', this.mockCategories);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  }

  // --- Funciones de Comportamiento Visual Mock ---

  // Simula la búsqueda con debounce (solo visual)
  onSearchChange(event: any) {
    const query = event.detail.value.toLowerCase();
    console.log('Buscando (mock):', query);
    // Lógica para mostrar Skeleton o Empty State basado en la búsqueda (Mock)
    if (query === 'error') {
      this.uiState = 'error';
    } else if (query === 'vacio') {
      this.uiState = 'empty';
    } else if (query.length > 0) {
      this.uiState = 'skeleton';
    } else {
      this.uiState = 'ver';
    }
  }

  // Cambia el estado a 'Ver' (muestra la tabla con datos mock)
  changeToViewState() {
    this.uiState = 'ver';
  }

  // Cambia el estado a 'Nuevo' (muestra la fila editable)
  changeToNewState() {
    this.uiState = 'nuevo';
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

  // Cancela la edición y vuelve al estado 'Ver'
  cancelEdit() {
    this.uiState = 'ver';
  }

  // Confirma la edición/creación
  async confirmEdit() {
    try {
      // Validar datos requeridos
      if (!this.newUser.email || !this.newUser.password) {
        alert('Por favor, ingrese correo y contraseña');
        return;
      }

      if (!this.newUser.firstName || !this.newUser.lastName) {
        alert('Por favor, ingrese nombre y apellido');
        return;
      }

      console.log('Datos del nuevo usuario:', this.newUser);

      this.uiState = 'skeleton';

      // Obtener el usuario administrador logueado ANTES de crear el nuevo usuario
      const adminUser = this.authService.getCurrentUser();
      const adminUid = adminUser?.uid || 'admin';

      // Obtener datos del administrador desde Firestore
      let createdByName = 'admin';
      if (adminUid !== 'admin') {
        const adminData = await this.firestoreService.getUserData(adminUid);
        if (adminData) {
          createdByName = `${adminData['firstName']} ${adminData['lastName']}`;
        }
      }

      // Crear usuario en Firebase Authentication
      const userCredential = await this.authService.createUser(
        this.newUser.email,
        this.newUser.password
      );

      const timestamp = new Date();

      // Preparar datos del usuario para Firestore según el esquema
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

      // Guardar datos adicionales en Firestore
      await this.firestoreService.createUserDocument(
        userCredential.user.uid,
        userData
      );

      console.log('Usuario creado exitosamente');
      alert('Usuario creado exitosamente');

      // Recargar la lista de usuarios
      await this.loadUsers();
    } catch (error: any) {
      console.error('Error al crear usuario:', error);
      this.uiState = 'nuevo';

      // Manejar errores específicos de Firebase
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

  // Abre Modales de selección
  openModal(type: 'grade' | 'group' | 'category') {
    if (type === 'grade') this.isGradeModalOpen = true;
    if (type === 'group') this.isGroupModalOpen = true;
    if (type === 'category') this.isCategoryModalOpen = true;
  }

  // Seleccionar grado
  selectGrade(grade: any) {
    this.newUser.grade_id = grade.id;
    this.isGradeModalOpen = false;
  }

  // Seleccionar grupo
  selectGroup(group: any) {
    this.newUser.group_id = group.id;
    this.isGroupModalOpen = false;
  }

  // Seleccionar categoría
  selectCategory(category: any) {
    this.newUser.category_id = category.id;
    this.isCategoryModalOpen = false;
  }

  // Cierra Modales de selección y aplica la selección mock
  closeModal(type: 'grade' | 'group' | 'category', selection: string | null = null) {
    if (selection) {
      this.newUser[type] = selection;
    }
    if (type === 'grade') this.isGradeModalOpen = false;
    if (type === 'group') this.isGroupModalOpen = false;
    if (type === 'category') this.isCategoryModalOpen = false;
  }

  // Obtener la descripción de la categoría a partir del ID
  getCategoryDescription(categoryId: string): string {
    if (!categoryId) return '';
    const category = this.mockCategories.find(cat => cat.id === categoryId);
    return category ? category.desc : categoryId;
  }

  // Obtener la descripción del grado a partir del ID
  getGradeDescription(gradeId: string): string {
    if (!gradeId) return '';
    const grade = this.mockGrades.find(g => g.id === gradeId);
    return grade ? grade.desc : gradeId;
  }

  // Obtener la descripción del grupo a partir del ID
  getGroupDescription(groupId: string): string {
    if (!groupId) return '';
    const group = this.mockGroups.find(g => g.id === groupId);
    return group ? group.desc : groupId;
  }
}
