import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonText, IonButton, IonSearchbar,
  IonCard, IonCardContent,
  IonSkeletonText, IonIcon, SearchbarCustomEvent} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { searchOutline, closeCircleOutline } from 'ionicons/icons';
import { FirestoreService } from '../../../firebase/firestore.service';

addIcons({ searchOutline, closeCircleOutline });

@Component({
  selector: 'app-alta-grupo',
  templateUrl: './alta-grupo.page.html',
  styleUrls: ['./alta-grupo.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonText, IonButton, IonSearchbar,
    IonCard, IonCardContent, IonSkeletonText, IonIcon
  ]
})
export class AltaGrupoPage implements OnInit {

  uiState: 'view' | 'new' | 'skeleton' | 'empty' | 'error' = 'skeleton';

  allGroups: any[] = [];
  filteredGroups: any[] = [];

  newGroup: any = {
    id: '',
    desc: '',
    seq: null
  };

  constructor(private firestoreService: FirestoreService) {
      addIcons({searchOutline,closeCircleOutline}); }

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
}
