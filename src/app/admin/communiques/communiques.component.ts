import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonText,
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  chevronBackOutline, 
  chevronForwardOutline, 
  calendarOutline 
} from 'ionicons/icons';

addIcons({ chevronBackOutline, chevronForwardOutline, calendarOutline });

@Component({
  selector: 'app-communiques',
  templateUrl: './communiques.component.html',
  styleUrls: ['./communiques.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonText,
    IonButton,
    IonCard,
    IonCardContent,
    IonIcon
  ]
})
export class CommuniquesComponent implements OnInit {

  // Control de modo edición
  isEditMode = false;
  isNewMode = false;
  newCommuniqueData: any = {};

  // Fechas de la semana actual
  currentWeekStart: Date = new Date();
  currentWeekEnd: Date = new Date();
  currentWeekRange: string = '';

  // Control del calendario
  isCalendarOpen = false;
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  weekDays: string[] = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  calendarDays: { day: number, date: Date | null }[] = [];

  // Datos de comunicados (ficticios)
  allCommuniques: any[] = [
    {
      id: '1',
      nombre: 'Torneo Estatal',
      descripcion: 'Se realizará un torneo a nivel estatal para alumnos Grupo B, se seleccionará a los mejores 3 estudiantes de cada Grado para participar a Representarnos',
      fecha: '18/10/2025',
      audiencia: 'Todos'
    },
    {
      id: '2',
      nombre: 'Junta de Padres',
      descripcion: 'Reunión informativa con los padres de familia para discutir el progreso académico del semestre',
      fecha: '25/11/2025',
      audiencia: 'Tutores'
    },
    {
      id: '3',
      nombre: 'Examen Final',
      descripcion: 'Evaluación final del periodo escolar. Favor de presentarse 15 minutos antes',
      fecha: '28/11/2025',
      audiencia: 'Estudiantes'
    },
    {
      id: '4',
      nombre: 'Capacitación Docente',
      descripcion: 'Taller de nuevas metodologías de enseñanza y herramientas digitales',
      fecha: '26/11/2025',
      audiencia: 'Profesores'
    },
    {
      id: '5',
      nombre: 'Evento Cultural',
      descripcion: 'Presentación de danza folklórica y música tradicional. Todos están invitados',
      fecha: '29/11/2025',
      audiencia: 'Todos'
    }
  ];

  filteredCommuniques: any[] = [];

  constructor() { }

  ngOnInit() {
    this.setCurrentWeek();
    this.filterCommuniquesByWeek();
    this.generateCalendar();
  }

  // Cerrar el calendario al hacer clic fuera de él
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.calendar-popup') && !target.closest('.calendar-button')) {
      this.isCalendarOpen = false;
    }
  }

  // Establecer la semana actual (lunes a domingo)
  setCurrentWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Si es domingo (0), retroceder 6 días, sino calcular desde lunes

    this.currentWeekStart = new Date(today);
    this.currentWeekStart.setDate(today.getDate() + diff);
    this.currentWeekStart.setHours(0, 0, 0, 0);

    this.currentWeekEnd = new Date(this.currentWeekStart);
    this.currentWeekEnd.setDate(this.currentWeekStart.getDate() + 6);
    this.currentWeekEnd.setHours(23, 59, 59, 999);

    this.updateWeekRangeDisplay();
  }

  // Actualizar el texto del rango de fechas
  updateWeekRangeDisplay() {
    const formatDate = (date: Date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    };

    this.currentWeekRange = `${formatDate(this.currentWeekStart)} - ${formatDate(this.currentWeekEnd)}`;
  }

  // Filtrar comunicados por semana actual
  filterCommuniquesByWeek() {
    this.filteredCommuniques = this.allCommuniques.filter(comm => {
      const commDate = this.parseDate(comm.fecha);
      return commDate >= this.currentWeekStart && commDate <= this.currentWeekEnd;
    });
  }

  // Convertir fecha en formato DD/MM/YYYY a Date
  parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  // Navegar a la semana anterior
  previousWeek() {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.currentWeekEnd.setDate(this.currentWeekEnd.getDate() - 7);
    this.updateWeekRangeDisplay();
    this.filterCommuniquesByWeek();
  }

  // Navegar a la semana siguiente
  nextWeek() {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.currentWeekEnd.setDate(this.currentWeekEnd.getDate() + 7);
    this.updateWeekRangeDisplay();
    this.filterCommuniquesByWeek();
  }

  // Modo edición
  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      // Restaurar datos originales si cancela
      this.filterCommuniquesByWeek();
    }
    // Si hay modo nuevo activo, cancelarlo
    if (this.isNewMode) {
      this.isNewMode = false;
      this.newCommuniqueData = {};
    }
  }

  saveChanges() {
    if (this.isNewMode) {
      // Guardar nuevo comunicado
      console.log('Guardar nuevo comunicado:', this.newCommuniqueData);
      this.allCommuniques.push({...this.newCommuniqueData});
      this.filterCommuniquesByWeek();
      alert('Nuevo comunicado creado exitosamente (placeholder - pendiente de implementar por backend)');
      this.isNewMode = false;
      this.newCommuniqueData = {};
    } else {
      // Guardar cambios de edición
      console.log('Guardar cambios:', this.filteredCommuniques);
      alert('Cambios guardados exitosamente (placeholder - pendiente de implementar por backend)');
      this.isEditMode = false;
    }
  }

  newCommunique() {
    this.isNewMode = true;
    this.isEditMode = false;
    // Inicializar objeto vacío con el próximo ID
    const nextId = this.allCommuniques.length > 0 
      ? Math.max(...this.allCommuniques.map(c => parseInt(c.id))) + 1 
      : 1;
    this.newCommuniqueData = {
      id: nextId.toString(),
      nombre: '',
      descripcion: '',
      fecha: '',
      audiencia: 'Todos'
    };
    console.log('Modo nuevo comunicado activado');
  }

  cancelNewMode() {
    this.isNewMode = false;
    this.newCommuniqueData = {};
  }

  // Convertir fecha de DD/MM/YYYY a YYYY-MM-DD para el input type="date"
  convertToInputDate(dateStr: string): string {
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
  }

  // Actualizar fecha desde el input y convertir a DD/MM/YYYY
  updateDate(comm: any, event: any) {
    const inputDate = event.target.value; // YYYY-MM-DD
    if (!inputDate) return;
    const [year, month, day] = inputDate.split('-');
    comm.fecha = `${day}/${month}/${year}`;
  }

  // ==================== FUNCIONES DEL CALENDARIO ====================

  // Obtener el nombre del mes y año actual
  get currentMonthYear(): string {
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `${months[this.currentMonth]} ${this.currentYear}`;
  }

  // Alternar visibilidad del calendario
  toggleCalendar(event: Event) {
    event.stopPropagation();
    this.isCalendarOpen = !this.isCalendarOpen;
    if (this.isCalendarOpen) {
      this.generateCalendar();
    }
  }

  // Generar los días del calendario para el mes actual
  generateCalendar() {
    this.calendarDays = [];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    
    // Ajustar el primer día de la semana (lunes = 0, domingo = 6)
    let firstDayOfWeek = firstDay.getDay() - 1;
    if (firstDayOfWeek === -1) firstDayOfWeek = 6; // Si es domingo, mover al final

    // Agregar días vacíos al inicio
    for (let i = 0; i < firstDayOfWeek; i++) {
      this.calendarDays.push({ day: 0, date: null });
    }

    // Agregar los días del mes
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(this.currentYear, this.currentMonth, day);
      this.calendarDays.push({ day, date });
    }
  }

  // Navegar al mes anterior
  previousMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  // Navegar al mes siguiente
  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  // Verificar si una fecha está en la semana actual seleccionada
  isDateInCurrentWeek(date: Date | null): boolean {
    if (!date) return false;
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);
    return dateOnly >= this.currentWeekStart && dateOnly <= this.currentWeekEnd;
  }

  // Verificar si una fecha es hoy
  isToday(date: Date | null): boolean {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  // Seleccionar una fecha y calcular su semana (lunes a domingo)
  selectDate(date: Date | null) {
    if (!date) return;

    const dayOfWeek = date.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    this.currentWeekStart = new Date(date);
    this.currentWeekStart.setDate(date.getDate() + diff);
    this.currentWeekStart.setHours(0, 0, 0, 0);

    this.currentWeekEnd = new Date(this.currentWeekStart);
    this.currentWeekEnd.setDate(this.currentWeekStart.getDate() + 6);
    this.currentWeekEnd.setHours(23, 59, 59, 999);

    this.updateWeekRangeDisplay();
    this.filterCommuniquesByWeek();
    this.isCalendarOpen = false;
  }

}
