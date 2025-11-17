import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonText, IonButton, IonIcon, IonSearchbar,
  IonCard, IonCardContent, IonGrid, IonRow, IonCol,
  IonSkeletonText, IonHeader, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, addOutline, searchOutline } from 'ionicons/icons';

addIcons({ eyeOutline, addOutline, searchOutline });

@Component({
  selector: 'app-alta-categoria-usuario',
  templateUrl: './alta-categoria.page.html',
  styleUrls: ['./alta-categoria.page.scss'],
  standalone: true,
  imports: [IonToolbar, IonHeader,
    CommonModule,
    IonContent, IonText, IonButton, IonIcon, IonSearchbar,
    IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonSkeletonText
  ]
})
export class AltaCategoriaPage implements OnInit {

  // Estado mock para simular la visualización de la tabla o el formulario de alta.
  uiState: 'ver' | 'nuevo' = 'ver';

  constructor() { }

  ngOnInit() {}

  // Simulación del cambio de estado
  cambiarAEstadoVer() {
    this.uiState = 'ver';
  }

  cambiarAEstadoNuevo() {
    this.uiState = 'nuevo';
  }
}
