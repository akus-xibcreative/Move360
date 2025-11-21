import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonText, IonButton, IonSearchbar,
  IonCard, IonCardContent,
  IonSkeletonText, IonIcon, IonModal, SearchbarCustomEvent} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { searchOutline, closeCircleOutline, ellipsisVertical, createOutline, trashOutline, warningOutline } from 'ionicons/icons';
import { FirestoreService } from '../../../firebase/firestore.service';

addIcons({ searchOutline, closeCircleOutline, ellipsisVertical, createOutline, trashOutline, warningOutline });

@Component({
  selector: 'app-alta-grupo',
  templateUrl: './alta-grupo.page.html',
  styleUrls: ['./alta-grupo.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonText, IonButton, IonSearchbar,
    IonCard, IonCardContent, IonSkeletonText, IonIcon, IonModal
  ]
})
export class AltaGrupoPage implements OnInit {

  uiState: 'view' | 'new' | 'edit' | 'skeleton' | 'empty' | 'error' = 'skeleton';

  allGroups: any[] = [];
  filteredGroups: any[] = [];

  newGroup: any = {
    id: '',
    desc: '',
    seq: null
  };

  activeMenuId: string | null = null;

  editingGroup: any = {
    id: '',
    desc: '',
    seq: null
  };

  isDeleteModalOpen = false;
  itemToDelete: any = null;

  constructor(private firestoreService: FirestoreService) {
      addIcons({searchOutline, closeCircleOutline, ellipsisVertical, createOutline, trashOutline, warningOutline}); }

  async ngOnInit() {
    await this.loadGroups();
  }

  async loadGroups() {
    try {
      this.uiState = 'skeleton';
      const groups = await this.firestoreService.getGroups();

      if (groups.length === 0) {
        this.uiState = 'empty';
      } else {
        this.allGroups = groups;
        this.filteredGroups = [...this.allGroups];
        this.uiState = 'view';
      }
    } catch (error) {
      console.error('Error loading groups:', error);
      this.uiState = 'error';
    }
  }

  changeToViewState() {
    this.uiState = 'view';
  }

  changeToNewState() {
    this.uiState = 'new';
    this.newGroup = {
      id: '',
      desc: '',
      seq: null
    };
  }

  async confirmGroup() {
    try {
      if (!this.newGroup.id || !this.newGroup.desc || !this.newGroup.seq) {
        alert('Por favor, complete todos los campos');
        return;
      }

      if (this.newGroup.seq < 1) {
        alert('La secuencia debe ser un número positivo');
        return;
      }

      this.uiState = 'skeleton';

      const groupData = {
        desc: this.newGroup.desc,
        seq: Number(this.newGroup.seq)
      };

      await this.firestoreService.createGroup(this.newGroup.id.toUpperCase(), groupData);

      console.log('Group created successfully');
      alert('Grupo creado exitosamente');

      await this.loadGroups();
    } catch (error: any) {
      console.error('Error creating group:', error);
      this.uiState = 'new';
      alert('Error al crear grupo: ' + error.message);
    }
  }

  filterGroups(event: SearchbarCustomEvent) {
    const query = event.detail.value?.toLowerCase() || '';

    if(query === ''){
      this.filteredGroups = [...this.allGroups];
      this.uiState = this.filteredGroups.length === 0 ? 'empty' : 'view';
      return;
    }

    this.filteredGroups = this.allGroups.filter(group => {
      return group.id?.toLowerCase().indexOf(query) > -1 ||
             group.desc?.toLowerCase().indexOf(query) > -1;
    });

    this.uiState = this.filteredGroups.length === 0 ? 'empty' : 'view';
  }

  onlyNumbers(event: any) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
    this.newGroup.seq = event.target.value;
  }

  // Funciones para el menú de acciones
  getGroupId(group: any): string {
    return group.id || group.desc;
  }

  isLastRows(index: number): boolean {
    return index >= this.filteredGroups.length - 2;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.action-wrapper') && !target.closest('.action-popup')) {
      this.activeMenuId = null;
    }
  }

  toggleActionMenu(group: any, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    const groupId = this.getGroupId(group);
    if (this.activeMenuId === groupId) {
      this.activeMenuId = null;
    } else {
      this.activeMenuId = groupId;
    }
  }

  editGroup(group: any) {
    this.editingGroup = {
      id: group.id,
      desc: group.desc,
      seq: group.seq
    };
    this.uiState = 'edit';
    this.activeMenuId = null;
  }

  async confirmEditGroup() {
    try {
      if (!this.editingGroup.desc || !this.editingGroup.seq) {
        alert('Por favor, complete todos los campos');
        return;
      }

      if (this.editingGroup.seq < 1) {
        alert('La secuencia debe ser un número positivo');
        return;
      }

      this.uiState = 'skeleton';

      const groupData = {
        desc: this.editingGroup.desc,
        seq: Number(this.editingGroup.seq)
      };

      await this.firestoreService.updateGroup(this.editingGroup.id, groupData);

      console.log('Group updated successfully');
      alert('Grupo actualizado exitosamente');

      await this.loadGroups();
      this.uiState = 'view';
    } catch (error: any) {
      console.error('Error updating group:', error);
      this.uiState = 'edit';
      alert('Error al actualizar grupo: ' + error.message);
    }
  }

  confirmDelete(group: any) {
    this.itemToDelete = group;
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
        alert('Error: No se puede identificar el grupo a eliminar');
        this.closeDeleteModal();
        return;
      }

      const groupId = this.getGroupId(this.itemToDelete);
      console.log('Deleting group:', groupId);

      this.closeDeleteModal();
      this.uiState = 'skeleton';

      await this.firestoreService.deleteGroup(groupId);

      console.log('Group deleted successfully');
      alert('Grupo eliminado exitosamente');

      await this.loadGroups();
    } catch (error: any) {
      console.error('Error deleting group:', error);
      this.uiState = 'view';
      alert('Error al eliminar grupo: ' + error.message);
    }
  }
}
