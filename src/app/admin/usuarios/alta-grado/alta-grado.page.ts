import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonText, IonButton, IonIcon, IonSearchbar,
  IonCard, IonCardContent, IonGrid, IonRow, IonCol,
  IonSkeletonText, IonHeader } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, addOutline, searchOutline } from 'ionicons/icons';

addIcons({ eyeOutline, addOutline, searchOutline });

@Component({
  selector: 'app-alta-grado',
  templateUrl: './alta-grado.page.html',
  styleUrls: ['./alta-grado.page.scss'],
  standalone: true,
  imports: [IonHeader,
    CommonModule,
    IonContent, IonText, IonButton, IonIcon, IonSearchbar,
    IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonSkeletonText
  ]
})
export class AltaGradoPage implements OnInit {

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
