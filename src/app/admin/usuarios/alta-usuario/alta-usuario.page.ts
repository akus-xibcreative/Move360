import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonText, IonButton, IonIcon, IonSearchbar,
  IonCard, IonCardContent, IonGrid, IonRow, IonCol,
  IonInput, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonList, IonItem, IonLabel, IonSkeletonText } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { eyeOutline, addOutline, searchOutline, closeOutline, checkmarkOutline } from 'ionicons/icons';

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
  mockUsers = [
    { id: 1, nombre: 'Juan', apellidos: 'Pérez García', contrasena: '*******', correo: 'juan.perez@tkd.com', grado: 'Roja', grupo: 'Adultos', categoria: 'A', celular: '5511223344' },
    { id: 2, nombre: 'Ana', apellidos: 'López Hernández', contrasena: '*******', correo: 'ana.lopez@tkd.com', grado: 'Azul', grupo: 'Jóvenes', categoria: 'B', celular: '5511223345' },
    { id: 3, nombre: 'Pedro', apellidos: 'Ramírez Soto', contrasena: '*******', correo: 'pedro.ramirez@tkd.com', grado: 'Negra', grupo: 'Adultos', categoria: 'A', celular: '5511223346' },
  ];

  // Datos para la fila editable (estado 'nuevo')
  newUser: any = { id: '', nombre: '', apellidos: '', contrasena: '', correo: '', grado: '', grupo: '', categoria: '', celular: '' };

  // Variables para Popups/Modales mock
  isGradoModalOpen = false;
  isGrupoModalOpen = false;
  isCategoriaModalOpen = false;

  // Mocks para las opciones de selección
  mockGrados = ['Blanca', 'Amarilla', 'Azul', 'Roja', 'Negra'];
  mockGrupos = ['Infantil', 'Jóvenes', 'Adultos'];
  mockCategorias = ['A', 'B', 'C'];

  constructor() { }

  ngOnInit() {
    // Para demostrar los estados visuales al cargar la página:
    // this.uiState = 'skeleton'; // Descomentar para ver el estado Skeleton
    // this.uiState = 'empty';    // Descomentar para ver el estado Vacío
    // this.uiState = 'error';    // Descomentar para ver el estado Error
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
  cambiarAEstadoVer() {
    this.uiState = 'ver';
  }

  // Cambia el estado a 'Nuevo' (muestra la fila editable)
  cambiarAEstadoNuevo() {
    this.uiState = 'nuevo';
    this.newUser = { id: '', nombre: '', apellidos: '', contrasena: '', correo: '', grado: '', grupo: '', categoria: '', celular: '' }; // Limpiar datos
  }

  // Cancela la edición y vuelve al estado 'Ver'
  cancelarEdicion() {
    this.uiState = 'ver';
  }

  // Confirma la edición/creación (simulado)
  confirmarEdicion() {
    console.log('Confirmando nuevo usuario (mock):', this.newUser);
    // Lógica visual: Volver al estado 'Ver' y mostrar un mensaje mock
    this.uiState = 'ver';
  }

  // Abre Modales de selección
  openModal(type: 'grado' | 'grupo' | 'categoria') {
    if (type === 'grado') this.isGradoModalOpen = true;
    if (type === 'grupo') this.isGrupoModalOpen = true;
    if (type === 'categoria') this.isCategoriaModalOpen = true;
  }

  // Cierra Modales de selección y aplica la selección mock
  closeModal(type: 'grado' | 'grupo' | 'categoria', selection: string | null = null) {
    if (selection) {
      this.newUser[type] = selection;
    }
    if (type === 'grado') this.isGradoModalOpen = false;
    if (type === 'grupo') this.isGrupoModalOpen = false;
    if (type === 'categoria') this.isCategoriaModalOpen = false;
  }
}
