import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonText, IonButton, IonSearchbar,
IonCard, IonCardContent,
IonSkeletonText, IonIcon, IonModal, SearchbarCustomEvent } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { searchOutline, closeCircleOutline, ellipsisVertical, createOutline, trashOutline, warningOutline } from 'ionicons/icons';
import { FirestoreService } from '../../../firebase/firestore.service';
import { AuthenticationService } from '../../../firebase/authentication.service';

addIcons({ searchOutline, closeCircleOutline, ellipsisVertical, createOutline, trashOutline, warningOutline });

@Component({
  selector: 'app-alta-grado',
  templateUrl: './alta-grado.page.html',
  styleUrls: ['./alta-grado.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonText, IonButton, IonSearchbar,
    IonCard, IonCardContent, IonSkeletonText, IonIcon, IonModal
  ]
})
export class AltaGradoPage implements OnInit {

  uiState: 'view' | 'new' | 'edit' | 'skeleton' | 'empty' | 'error' = 'skeleton';

  allGrades: any[] = [];
  filteredGrades: any[] = [];

  newGrade: any = {
    id: '',
    desc: '',
    seq: null
  };

  activeMenuId: string | null = null;

  editingGrade: any = {
    id: '',
    desc: '',
    seq: null
  };

  isDeleteModalOpen = false;
  itemToDelete: any = null;

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthenticationService
  ) {
      addIcons({searchOutline, closeCircleOutline, ellipsisVertical, createOutline, trashOutline, warningOutline});

  }

  async ngOnInit() {
    await this.loadGrades();
  }

  async loadGrades() {
    try {
      this.uiState = 'skeleton';
      const grades = await this.firestoreService.getGrades();

      // Filtrar solo grados activos (metadata.delete_flag === true)
      const activeGrades = grades.filter(grade => grade.metadata?.delete_flag === true);

      if (activeGrades.length === 0) {
        this.uiState = 'empty';
      } else {
        this.allGrades = activeGrades;
        this.filteredGrades = [...this.allGrades];
        this.uiState = 'view';
      }
    } catch (error) {
      console.error('Error loading grades:', error);
      this.uiState = 'error';
    }
  }

  changeToViewState() {
    this.uiState = 'view';
  }

  changeToNewState() {
    this.uiState = 'new';
    this.newGrade = {
      id: '',
      desc: '',
      seq: null
    };
  }

  async confirmGrade() {
    try {
      if (!this.newGrade.id || !this.newGrade.desc || !this.newGrade.seq) {
        alert('Por favor, complete todos los campos');
        return;
      }

      if (this.newGrade.seq < 1) {
        alert('La secuencia debe ser un número positivo');
        return;
      }

      this.uiState = 'skeleton';

      const adminUser = this.authService.getCurrentUser();
      let createdByName = 'admin';
      if (adminUser) {
        const adminData = await this.firestoreService.getUserData(adminUser.uid);
        if (adminData) {
          createdByName = `${adminData['firstName']} ${adminData['lastName']}`;
        }
      }

      const timestamp = new Date();

      const gradeData = {
        desc: this.newGrade.desc,
        seq: Number(this.newGrade.seq),
        metadata: {
          created_at: timestamp,
          updated_at: timestamp,
          created_by: createdByName,
          updated_by: createdByName,
          delete_flag: true
        }
      };

      await this.firestoreService.createGrade(this.newGrade.id.toUpperCase(), gradeData);

      console.log('Grade created successfully');
      alert('Grado creado exitosamente');

      await this.loadGrades();
    } catch (error: any) {
      console.error('Error creating grade:', error);
      this.uiState = 'new';
      alert('Error al crear grado: ' + error.message);
    }
  }

  filterGrades(event: SearchbarCustomEvent) {
    const query = event.detail.value?.toLowerCase() || '';

    if(query === '') {
      this.filteredGrades = [...this.allGrades];
      this.uiState = this.filteredGrades.length === 0 ? 'empty' : 'view';
      return;
    }

    this.filteredGrades = this.allGrades.filter(grade => {
      return grade.id?.toLowerCase().indexOf(query) > -1 ||
             grade.desc?.toLowerCase().indexOf(query) > -1;
    });

    this.uiState = this.filteredGrades.length === 0 ? 'empty' : 'view';
  }

  onlyNumbers(event: any) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
    this.newGrade.seq = event.target.value;
  }

  // Funciones para el menú de acciones
  getGradeId(grade: any): string {
    return grade.id || grade.desc;
  }

  isLastRows(index: number): boolean {
    return index >= this.filteredGrades.length - 2;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.action-wrapper') && !target.closest('.action-popup')) {
      this.activeMenuId = null;
    }
  }

  toggleActionMenu(grade: any, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    const gradeId = this.getGradeId(grade);
    if (this.activeMenuId === gradeId) {
      this.activeMenuId = null;
    } else {
      this.activeMenuId = gradeId;
    }
  }

  editGrade(grade: any) {
    this.editingGrade = {
      id: grade.id,
      desc: grade.desc,
      seq: grade.seq
    };
    this.uiState = 'edit';
    this.activeMenuId = null;
  }

  async confirmEditGrade() {
    try {
      if (!this.editingGrade.desc || !this.editingGrade.seq) {
        alert('Por favor, complete todos los campos');
        return;
      }

      if (this.editingGrade.seq < 1) {
        alert('La secuencia debe ser un número positivo');
        return;
      }

      this.uiState = 'skeleton';

      const gradeData = {
        desc: this.editingGrade.desc,
        seq: Number(this.editingGrade.seq)
      };

      await this.firestoreService.updateGrade(this.editingGrade.id, gradeData);

      console.log('Grade updated successfully');
      alert('Grado actualizado exitosamente');

      await this.loadGrades();
      this.uiState = 'view';
    } catch (error: any) {
      console.error('Error updating grade:', error);
      this.uiState = 'edit';
      alert('Error al actualizar grado: ' + error.message);
    }
  }

  confirmDelete(grade: any) {
    this.itemToDelete = grade;
    this.isDeleteModalOpen = true;
    this.activeMenuId = null;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.itemToDelete = null;
  }

  async deleteItem() {
    try {
      if (!this.itemToDelete) {
        alert('Error: No se puede identificar el grado a eliminar');
        this.closeDeleteModal();
        return;
      }

      const gradeId = this.getGradeId(this.itemToDelete);
      console.log('Marking grade as deleted (soft delete):', gradeId);

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

      // Soft delete: cambiar metadata.delete_flag a false
      await this.firestoreService.updateGrade(gradeId, {
        'metadata.delete_flag': false,
        'metadata.updated_at': new Date(),
        'metadata.updated_by': updatedByName
      });

      console.log('Grade marked as deleted (soft delete)');
      alert('Grado eliminado exitosamente');

      await this.loadGrades();
    } catch (error: any) {
      console.error('Error deleting grade:', error);
      this.uiState = 'view';
      alert('Error al eliminar grado: ' + error.message);
    }
  }
}
