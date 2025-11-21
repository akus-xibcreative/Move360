import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonText, IonButton, IonSearchbar,
  IonCard, IonCardContent,
  IonSkeletonText, IonIcon, SearchbarCustomEvent, IonModal } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { searchOutline, closeCircleOutline, ellipsisVertical, createOutline, trashOutline, warningOutline } from 'ionicons/icons';
import { FirestoreService } from '../../../firebase/firestore.service';

addIcons({ searchOutline, closeCircleOutline, ellipsisVertical, createOutline, trashOutline, warningOutline });

@Component({
  selector: 'app-alta-categoria-usuario',
  templateUrl: './alta-categoria.page.html',
  styleUrls: ['./alta-categoria.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonText, IonButton, IonSearchbar,
    IonCard, IonCardContent, IonSkeletonText, IonIcon,
    IonModal
  ]
})
export class AltaCategoriaPage implements OnInit {

  uiState: 'view' | 'new' | 'edit' | 'skeleton' | 'empty' | 'error' = 'skeleton';

  allCategories: any[] = [];
  filteredCategories: any[] = [];

  newCategory: any = {
    id: '',
    desc: '',
    seq: null
  };

  editingCategory: any = {
    id: '',
    desc: '',
    seq: null
  };

  activeMenuId: string | null = null;
  isDeleteModalOpen = false;
  itemToDelete: any = null;

  constructor(private firestoreService: FirestoreService) {
      addIcons({searchOutline, closeCircleOutline, ellipsisVertical, createOutline, trashOutline, warningOutline}); }

  async ngOnInit() {
    await this.loadCategories();
  }

  async loadCategories() {
    try {
      this.uiState = 'skeleton';
      const categories = await this.firestoreService.getCategories();

      if (categories.length === 0) {
        this.uiState = 'empty';
      } else {
        this.allCategories = categories;
        this.filteredCategories = [...this.allCategories];
        this.uiState = 'view';
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      this.uiState = 'error';
    }
  }

  changeToViewState() {
    this.uiState = 'view';
  }

  changeToNewState() {
    this.uiState = 'new';
    this.newCategory = {
      id: '',
      desc: '',
      seq: null
    };
  }

  async confirmCategory() {
    try {
      if (!this.newCategory.id || !this.newCategory.desc || !this.newCategory.seq) {
        alert('Por favor, complete todos los campos');
        return;
      }

      if (this.newCategory.seq < 1) {
        alert('La secuencia debe ser un número positivo');
        return;
      }

      this.uiState = 'skeleton';

      const categoryData = {
        desc: this.newCategory.desc,
        seq: Number(this.newCategory.seq)
      };

      await this.firestoreService.createCategory(this.newCategory.id.toUpperCase(), categoryData);

      console.log('Category created successfully');
      alert('Categoría creada exitosamente');

      await this.loadCategories();
    } catch (error: any) {
      console.error('Error creating category:', error);
      this.uiState = 'new';
      alert('Error al crear categoría: ' + error.message);
    }
  }

  filterCategories(event: SearchbarCustomEvent) {
    const query = event.detail.value?.toLowerCase() || '';

    if (query === '') {
      this.filteredCategories = [...this.allCategories];
      this.uiState = this.filteredCategories.length === 0 ? 'empty' : 'view';
      return;
    }

    this.filteredCategories = this.allCategories.filter(category =>{
      return category.id?.toLowerCase().indexOf(query) > -1 ||
             category.desc?.toLowerCase().indexOf(query) > -1;
    });

    this.uiState = this.filteredCategories.length === 0 ? 'empty' : 'view';
  }

  onlyNumbers(event: any) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
    this.newCategory.seq = event.target.value;
  }

  // Funciones para el menú de acciones
  getCategoryId(category: any): string {
    return category.id || category.desc;
  }

  isLastRows(index: number): boolean {
    return index >= this.filteredCategories.length - 2;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.action-wrapper') && !target.closest('.action-popup')) {
      this.activeMenuId = null;
    }
  }

  toggleActionMenu(category: any, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    const categoryId = this.getCategoryId(category);
    if (this.activeMenuId === categoryId) {
      this.activeMenuId = null;
    } else {
      this.activeMenuId = categoryId;
    }
  }

  editCategory(category: any) {
    this.editingCategory = {
      id: category.id,
      desc: category.desc,
      seq: category.seq
    };
    this.uiState = 'edit';
    this.activeMenuId = null;
  }

  async confirmEditCategory() {
    try {
      if (!this.editingCategory.desc || !this.editingCategory.seq) {
        alert('Por favor, complete todos los campos');
        return;
      }

      if (this.editingCategory.seq < 1) {
        alert('La secuencia debe ser un número positivo');
        return;
      }

      this.uiState = 'skeleton';

      const categoryData = {
        desc: this.editingCategory.desc,
        seq: Number(this.editingCategory.seq)
      };

      await this.firestoreService.updateCategory(this.editingCategory.id, categoryData);

      console.log('Category updated successfully');
      alert('Categoría actualizada exitosamente');

      await this.loadCategories();
      this.uiState = 'view';
    } catch (error: any) {
      console.error('Error updating category:', error);
      this.uiState = 'edit';
      alert('Error al actualizar categoría: ' + error.message);
    }
  }

  confirmDelete(category: any) {
    this.itemToDelete = category;
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
        alert('Error: No se puede identificar la categoría a eliminar');
        this.closeDeleteModal();
        return;
      }

      const categoryId = this.getCategoryId(this.itemToDelete);
      console.log('Deleting category:', categoryId);

      this.closeDeleteModal();
      this.uiState = 'skeleton';

      await this.firestoreService.deleteCategory(categoryId);

      console.log('Category deleted successfully');
      alert('Categoría eliminada exitosamente');

      await this.loadCategories();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      this.uiState = 'view';
      alert('Error al eliminar categoría: ' + error.message);
    }
  }
}
