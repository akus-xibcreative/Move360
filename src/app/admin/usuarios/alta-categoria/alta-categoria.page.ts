import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonText, IonButton, IonSearchbar,
  IonCard, IonCardContent,
  IonSkeletonText, IonIcon, SearchbarCustomEvent } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { searchOutline, closeCircleOutline } from 'ionicons/icons';
import { FirestoreService } from '../../../firebase/firestore.service';

addIcons({ searchOutline, closeCircleOutline });

@Component({
  selector: 'app-alta-categoria-usuario',
  templateUrl: './alta-categoria.page.html',
  styleUrls: ['./alta-categoria.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonText, IonButton, IonSearchbar,
    IonCard, IonCardContent, IonSkeletonText, IonIcon
  ]
})
export class AltaCategoriaPage implements OnInit {

  uiState: 'view' | 'new' | 'skeleton' | 'empty' | 'error' = 'skeleton';

  allCategories: any[] = [];
  filteredCategories: any[] = [];

  newCategory: any = {
    id: '',
    desc: '',
    seq: null
  };

  constructor(private firestoreService: FirestoreService) {
      addIcons({searchOutline,closeCircleOutline}); }

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
}
