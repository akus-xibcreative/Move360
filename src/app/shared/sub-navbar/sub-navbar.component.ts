import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sub-navbar',
  templateUrl: './sub-navbar.component.html',
  styleUrls: ['./sub-navbar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class SubNavbarComponent {

  menuItems = [
    { title: 'Alta de usuario', url: 'alta-usuario' },
    { title: 'Alta de grado', url: 'alta-grado' },
    { title: 'Alta de grupo', url: 'alta-grupo' },
    { title: 'Alta de categoría de usuario', url: 'alta-categoria' },
  ];
}
