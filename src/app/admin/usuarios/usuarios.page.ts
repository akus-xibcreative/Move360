import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SubNavbarComponent } from 'src/app/shared/sub-navbar/sub-navbar.component';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // Importante para que <router-outlet> funcione en el template
    SubNavbarComponent, // Importamos el sub-menú horizontal
    IonContent,
  ]
})
export class UsuariosPage implements OnInit {

  constructor() { }

  ngOnInit() {
    // Inicialización si fuera necesaria. Por ahora, este componente es solo un contenedor de rutas.
  }

}
