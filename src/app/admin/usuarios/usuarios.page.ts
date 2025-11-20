import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SubNavbarComponent } from 'src/app/shared/sub-navbar/sub-navbar.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SubNavbarComponent
  ]
})
export class UsuariosPage {}
