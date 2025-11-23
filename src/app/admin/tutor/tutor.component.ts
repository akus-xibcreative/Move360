import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonText, 
  IonButton, 
  IonSearchbar, 
  IonCard, 
  IonCardContent,
  SearchbarCustomEvent 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tutor',
  templateUrl: './tutor.component.html',
  styleUrls: ['./tutor.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonText,
    IonButton,
    IonSearchbar,
    IonCard,
    IonCardContent
  ]
})
export class TutorComponent implements OnInit {

  allTutors: any[] = [
    {
      id: '1',
      nombre: 'Edwin',
      apellidos: 'Verastegui Cervantes',
      estudiante: 'Luis Verastegui',
      correo: 'edwin673@gmail.com',
      telefono: '9842348789',
      membresia: '11/06/25 - 11/12/25',
      ultimaSesion: '26/10/2025',
      pago: 'Pendiente'
    },
    {
      id: '2',
      nombre: 'María',
      apellidos: 'González López',
      estudiante: 'Ana González',
      correo: 'maria.gonzalez@gmail.com',
      telefono: '9841234567',
      membresia: '01/08/25 - 01/02/26',
      ultimaSesion: '20/11/2025',
      pago: 'Pagado'
    },
    {
      id: '3',
      nombre: 'Carlos',
      apellidos: 'Ramírez Hernández',
      estudiante: 'Pedro Ramírez',
      correo: 'carlos.ramirez@hotmail.com',
      telefono: '9849876543',
      membresia: '15/09/25 - 15/03/26',
      ultimaSesion: '21/11/2025',
      pago: 'Pagado'
    },
    {
      id: '4',
      nombre: 'Laura',
      apellidos: 'Martínez Sánchez',
      estudiante: 'Sofía Martínez',
      correo: 'laura.martinez@yahoo.com',
      telefono: '9845678901',
      membresia: '10/10/25 - 10/04/26',
      ultimaSesion: '18/11/2025',
      pago: 'Pendiente'
    },
    {
      id: '5',
      nombre: 'Roberto',
      apellidos: 'Torres García',
      estudiante: 'Miguel Torres',
      correo: 'roberto.torres@outlook.com',
      telefono: '9842345678',
      membresia: '05/11/25 - 05/05/26',
      ultimaSesion: '22/11/2025',
      pago: 'Pagado'
    }
  ];

  filteredTutors: any[] = [];
  isFilterPopupOpen = false;
  selectedFilter: string = '';
  currentSearchQuery: string = '';
  
  // Modo edición
  isEditMode = false;
  
  // Popup de estudiantes
  isStudentPopupOpen = false;
  currentTutor: any = null;
  selectedStudent: any = null;
  studentSearchQuery: string = '';
  
  // Lista de estudiantes (datos de ejemplo)
  allStudents: any[] = [
    { id: '1', nombre: 'Josmar Arturo', estudiante: 'Choc Cano' },
    { id: '2', nombre: 'Luis', estudiante: 'Verastegui' },
    { id: '3', nombre: 'Ana', estudiante: 'González' },
    { id: '4', nombre: 'Pedro', estudiante: 'Ramírez' },
    { id: '5', nombre: 'Sofía', estudiante: 'Martínez' },
    { id: '6', nombre: 'Miguel', estudiante: 'Torres' },
    { id: '7', nombre: 'Carolina', estudiante: 'López' },
    { id: '8', nombre: 'Diego', estudiante: 'Hernández' }
  ];
  
  filteredStudents: any[] = [];

  constructor() { }

  ngOnInit() {
    this.filteredTutors = [...this.allTutors];
  }

  onSearchChange(event: SearchbarCustomEvent) {
    const query = event.detail.value?.toLowerCase() || '';
    this.currentSearchQuery = query;
    this.applyFilters();
  }

  toggleFilterPopup(event: Event) {
    event.stopPropagation();
    this.isFilterPopupOpen = !this.isFilterPopupOpen;
  }

  applyFilter() {
    this.applyFilters();
    this.isFilterPopupOpen = false;
  }

  applyFilters() {
    let result = [...this.allTutors];

    // Filtrar por búsqueda de nombre
    if (this.currentSearchQuery !== '') {
      result = result.filter(tutor => {
        return tutor.nombre?.toLowerCase().includes(this.currentSearchQuery) ||
               tutor.apellidos?.toLowerCase().includes(this.currentSearchQuery);
      });
    }

    // Filtrar por estado de pago
    if (this.selectedFilter !== '') {
      result = result.filter(tutor => tutor.pago === this.selectedFilter);
    }

    this.filteredTutors = result;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    // Solo cerrar el popup de filtros, no afectar el modo de edición
    if (this.isFilterPopupOpen) {
      this.isFilterPopupOpen = false;
    }
  }

  // Funciones de modo edición
  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    console.log('toggleEditMode - isEditMode:', this.isEditMode);
    if (!this.isEditMode) {
      // Restaurar datos originales si cancela
      this.filteredTutors = [...this.allTutors];
      this.applyFilters();
    }
  }

  saveChanges() {
    console.log('Guardar cambios:', this.filteredTutors);
    alert('Cambios guardados exitosamente (placeholder - pendiente de implementar por backend)');
    this.isEditMode = false;
  }

  // Funciones del popup de estudiantes
  openStudentPopup(tutor: any, event: Event) {
    event.stopPropagation();
    this.currentTutor = tutor;
    this.isStudentPopupOpen = true;
    this.filteredStudents = [...this.allStudents];
    this.studentSearchQuery = '';
    this.selectedStudent = null;
  }

  closeStudentPopup() {
    this.isStudentPopupOpen = false;
    this.currentTutor = null;
    this.selectedStudent = null;
    this.studentSearchQuery = '';
  }

  filterStudents() {
    const query = this.studentSearchQuery.toLowerCase();
    
    if (query === '') {
      this.filteredStudents = [...this.allStudents];
      return;
    }

    this.filteredStudents = this.allStudents.filter(student => {
      return student.nombre?.toLowerCase().includes(query) ||
             student.estudiante?.toLowerCase().includes(query);
    });
  }

  selectStudent(student: any) {
    this.selectedStudent = student;
  }

  assignStudent() {
    if (this.currentTutor && this.selectedStudent) {
      this.currentTutor.estudiante = `${this.selectedStudent.nombre} ${this.selectedStudent.estudiante}`;
      this.closeStudentPopup();
    }
  }

  // Función para actualizar membresía al cambiar estado de pago
  onPagoChange(tutor: any) {
    if (tutor.pago === 'Pagado') {
      // Calcular nueva fecha de membresía (1 mes desde hoy)
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}/${month}/${year}`;
      };

      tutor.membresia = `${formatDate(today)} - ${formatDate(nextMonth)}`;
    }
    // Si cambia a Pendiente, la membresía se mantiene congelada
  }

}
