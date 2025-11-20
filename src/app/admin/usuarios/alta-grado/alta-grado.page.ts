import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonText, IonButton, IonSearchbar,
IonCard, IonCardContent,
IonSkeletonText, IonIcon, SearchbarCustomEvent } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { searchOutline, closeCircleOutline } from 'ionicons/icons';
import { FirestoreService } from '../../../firebase/firestore.service';

addIcons({ searchOutline, closeCircleOutline });

@Component({
  selector: 'app-alta-grado',
  templateUrl: './alta-grado.page.html',
  styleUrls: ['./alta-grado.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonText, IonButton, IonSearchbar,
    IonCard, IonCardContent, IonSkeletonText, IonIcon
  ]
})
export class AltaGradoPage implements OnInit {

  uiState: 'view' | 'new' | 'skeleton' | 'empty' | 'error' = 'skeleton';

  allGrades: any[] = [];
  filteredGrades: any[] = [];

  newGrade: any = {
    id: '',
    desc: '',
    seq: null
  };

  constructor(private firestoreService: FirestoreService) {
      addIcons({searchOutline,closeCircleOutline});

  }

  async ngOnInit() {
    await this.loadGrades();
  }

  async loadGrades() {
    try {
      this.uiState = 'skeleton';
      const grades = await this.firestoreService.getGrades();

      if (grades.length === 0) {
        this.uiState = 'empty';
      } else {
        this.allGrades = grades;
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

      const gradeData = {
        desc: this.newGrade.desc,
        seq: Number(this.newGrade.seq)
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
}
