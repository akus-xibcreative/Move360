import { Component } from '@angular/core';
import { IonList, IonItem, IonLabel, IonContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonList, IonItem, IonLabel, IonContent]
})
export class NavbarComponent {

  constructor(private router: Router) {}

  menuItems = [
    { title: 'Inicio', url: '/admin/home' },
    { title: 'Usuarios', url: '/admin/usuarios' },
    { title: 'Estudiante', url: '/admin/estudiante' },
    { title: 'Profesor', url: '/admin/profesor' },
    { title: 'Tutor', url: '/admin/tutor' },
    { title: 'Comunicados', url: '/admin/comunicados' },
    { title: 'Productos', url: '/admin/productos'},
  ];

  navigateToHome() {
    this.router.navigate(['/admin/home']);
  }
}
