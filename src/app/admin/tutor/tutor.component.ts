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
import { FirestoreService } from '../../firebase/firestore.service';

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

  allTutors: any[] = [];
  filteredTutors: any[] = [];
  isFilterPopupOpen = false;
  selectedFilter: string = '';
  currentSearchQuery: string = '';

  // Modo edición
  isEditMode = false;

  // Popup de estudiantes
  isStudentPopupOpen = false;
  currentTutor: any = null;
  // Soportar multiple selection
  selectedStudents: any[] = [];
  studentSearchQuery: string = '';

  // Lista de estudiantes
  allStudents: any[] = [];
  filteredStudents: any[] = [];

  // Relaciones tutor-student
  tutorStudentRelations: any[] = [];

  // Pagos
  allPayments: any[] = [];

  constructor(private firestoreService: FirestoreService) { }

  async ngOnInit() {
    await this.loadPayments();
    await this.loadTutorStudentRelations();
    await this.loadStudents();
    await this.loadTutors();
  }

  async loadTutors() {
    try {
      const allUsers = await this.firestoreService.getAllUsers();
      const now = new Date();
      // Filtrar solo tutores activos (metadata.delete_flag === true)
      const tutorUsers = allUsers.filter(user =>
        user.category_id === 'CAT-03' && user.metadata?.delete_flag === true
      );

      this.allTutors = [];

      for (const user of tutorUsers) {
        // Buscar todos los pagos asociados al tutor (uno por estudiante)
        const payments = this.allPayments.filter(p => p.payer_uid === user.id);

        if (payments.length === 0) {
          // Si no tiene pagos, crear una fila sin estudiante
          this.allTutors.push({
            ...user,
            pago: 'Pendiente',
            status: false,
            membership_start: null,
            membership_end: null,
            studentNames: null,
            paymentId: null
          });
        } else {
          // Crear una fila por cada pago (estudiante)
          for (const payment of payments) {
            let pagoStatus = 'Pendiente';
            let status = false;
            let membershipStart = null;
            let membershipEnd = null;

            // Convertir membership_end para verificar expiración
            if (payment.membership_end?.toDate) {
              membershipEnd = payment.membership_end.toDate();
            } else if (payment.membership_end?.seconds) {
              membershipEnd = new Date(payment.membership_end.seconds * 1000);
            } else if (payment.membership_end) {
              membershipEnd = new Date(payment.membership_end);
            }

            const hasExpired = membershipEnd && membershipEnd < now;

            // Si la membresía expiró, el status debe ser false (Pendiente)
            if (hasExpired) {
              status = false;
              pagoStatus = 'Pendiente';

              // Actualizar el status en la base de datos si cambió
              if (payment.status === true) {
                this.firestoreService.updatePayment(payment.id, {
                  status: false,
                  'metadata.updated_at': now
                });
              }
            } else {
              status = payment.status;
              pagoStatus = payment.status ? 'Pagado' : 'Pendiente';
            }

            // Convertir membership_start
            if (payment.membership_start?.toDate) {
              membershipStart = payment.membership_start.toDate();
            } else if (payment.membership_start?.seconds) {
              membershipStart = new Date(payment.membership_start.seconds * 1000);
            } else if (payment.membership_start) {
              membershipStart = new Date(payment.membership_start);
            }

            this.allTutors.push({
              ...user,
              pago: pagoStatus,
              status: status,
              membership_start: membershipStart,
              membership_end: membershipEnd,
              studentNames: payment.student_name || '-',
              student_uid: payment.student_uid,
              paymentId: payment.id
            });
          }
        }
      }

      this.filteredTutors = [...this.allTutors];
    } catch (error) {
      console.error('Error al cargar tutores:', error);
    }
  }

  async loadStudents() {
    try {
      const allUsers = await this.firestoreService.getAllUsers();
      // Filtrar solo estudiantes activos (metadata.delete_flag === true)
      this.allStudents = allUsers.filter(user =>
        user.category_id === 'CAT-04' && user.metadata?.delete_flag === true
      );
      // Al abrir popup, queremos excluir estudiantes ya asignados en tutor_students
      this.filteredStudents = [...this.allStudents];
    } catch (error) {
      console.error('Error al cargar estudiantes:', error);
    }
  }

  async loadTutorStudentRelations() {
    try {
      this.tutorStudentRelations = await this.firestoreService.getAllTutorStudentRelations();
    } catch (error) {
      console.error('Error al cargar relaciones tutor_students:', error);
      this.tutorStudentRelations = [];
    }
  }

  async loadPayments() {
    try {
      this.allPayments = await this.firestoreService.getAllPayments();
    } catch (error) {
      console.error('Error al cargar pagos:', error);
      this.allPayments = [];
    }
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
        return tutor.firstName?.toLowerCase().includes(this.currentSearchQuery) ||
               tutor.lastName?.toLowerCase().includes(this.currentSearchQuery) ||
               tutor.email?.toLowerCase().includes(this.currentSearchQuery);
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

  async saveChanges() {
    try {
      console.log('Guardando cambios:', this.filteredTutors);

      // Guardar cada tutor modificado en la base de datos
      for (const tutor of this.allTutors) {
        // Actualizar el status del pago en la colección payments
        if (tutor.paymentId) {
          const now = new Date();
          const updateData: any = {
            status: tutor.status,
            'metadata.updated_at': now
          };

          // Si el status cambió a true (Pagado), actualizar las fechas de membresía
          if (tutor.status === true) {
            const membershipStart = now;
            const membershipEnd = new Date(now);
            membershipEnd.setMonth(membershipEnd.getMonth() + 1); // Membresía de 1 mes

            updateData.membership_start = membershipStart;
            updateData.membership_end = membershipEnd;
          }

          await this.firestoreService.updatePayment(tutor.paymentId, updateData);
        }
      }

      alert('Cambios guardados exitosamente');
      this.isEditMode = false;

      // Recargar los datos para reflejar los cambios
      await this.loadPayments();
      await this.loadTutors();
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      alert('Error al guardar los cambios. Por favor, intenta nuevamente.');
    }
  }

  // Funciones del popup de estudiantes
  openStudentPopup(tutor: any, event: Event) {
    event.stopPropagation();
    this.currentTutor = tutor;
    this.isStudentPopupOpen = true;

    // Obtener los UIDs de estudiantes ya asignados a otros tutores (desde tutor_students)
    const assignedStudentUids = this.tutorStudentRelations
      .filter(r => r.tutor_uid !== tutor.id)
      .map(r => r.student_uid);

    // Filtrar estudiantes que no estén asignados
    this.filteredStudents = this.allStudents.filter(
      student => !assignedStudentUids.includes(student.id)
    );

    this.studentSearchQuery = '';
    this.selectedStudents = [];
  }

  closeStudentPopup() {
    this.isStudentPopupOpen = false;
    this.currentTutor = null;
    this.selectedStudents = [];
    this.studentSearchQuery = '';
  }

  filterStudents() {
    const query = this.studentSearchQuery.toLowerCase();

    // Obtener los UIDs de estudiantes ya asignados a otros tutores (desde tutor_students)
    const assignedStudentUids = this.tutorStudentRelations
      .filter(r => r.tutor_uid !== this.currentTutor?.id)
      .map(r => r.student_uid);

    // Filtrar estudiantes que no estén asignados
    let availableStudents = this.allStudents.filter(
      student => !assignedStudentUids.includes(student.id)
    );

    if (query === '') {
      this.filteredStudents = availableStudents;
      return;
    }

    this.filteredStudents = availableStudents.filter(student => {
      return student.firstName?.toLowerCase().includes(query) ||
             student.lastName?.toLowerCase().includes(query) ||
             student.email?.toLowerCase().includes(query);
    });
  }

  selectStudent(student: any) {
    // Toggle selection to allow multiple students
    const idx = this.selectedStudents.findIndex(s => s.id === student.id);
    if (idx > -1) {
      this.selectedStudents.splice(idx, 1);
    } else {
      this.selectedStudents.push(student);
    }
  }

  assignStudent() {
    if (!this.currentTutor || this.selectedStudents.length === 0) {
      return;
    }

    const tutorUid = this.currentTutor.id;

    (async () => {
      try {
        const now = new Date();
        const membershipStart = now;
        const membershipEnd = new Date(now);
        membershipEnd.setMonth(membershipEnd.getMonth() + 1); // Membresía de 1 mes

        for (const student of this.selectedStudents) {
          // Crear relación tutor-estudiante
          const studentName = `${student.firstName} ${student.lastName}`;
          const tutorName = `${this.currentTutor.firstName} ${this.currentTutor.lastName}`;
          await this.firestoreService.createTutorStudentRelation(tutorUid, tutorName, student.id, studentName);

          // Crear pago para este estudiante (el pagador es el tutor)
          const payerName = `${this.currentTutor.firstName} ${this.currentTutor.lastName}`;
          await this.firestoreService.createPayment(
            student.id,
            studentName,
            tutorUid,
            payerName,
            0, // Ajusta amount_due según necesites
            membershipStart,
            membershipEnd
          );
        }

        // Recargar relaciones y datos locales para reflejar los cambios
        await this.loadTutorStudentRelations();
        // actualizar representación inmediata del tutor
        const rels = this.tutorStudentRelations.filter(r => r.tutor_uid === tutorUid);
        this.currentTutor.student_uids = rels.map(r => r.student_uid);
        this.currentTutor.studentNames = this.currentTutor.student_uids.map((uid: any) => {
          const s = this.allStudents.find(st => st.id === uid);
          return s ? `${s.firstName} ${s.lastName}` : uid;
        }).join(', ');
        this.currentTutor.membership_start = membershipStart;
        this.currentTutor.membership_end = membershipEnd;

        this.closeStudentPopup();
      } catch (error) {
        console.error('Error asignando estudiante(s):', error);
        alert('Error asignando estudiante(s). Por favor intenta nuevamente.');
      }
    })();
  }

  // Función para actualizar estado al cambiar pago
  onPagoChange(tutor: any) {
    // Actualizar el campo status según el pago
    tutor.status = tutor.pago === 'Pagado';
  }

  // Helper para verificar si un estudiante está seleccionado
  isStudentSelected(student: any): boolean {
    return this.selectedStudents.some(s => s.id === student.id);
  }

}
