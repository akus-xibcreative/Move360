import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

// Definimos la interfaz para el tipo de datos de la tarjeta
export interface DashboardCard {
  title: string;
  value: number;
  // Este campo contiene la RUTA del archivo SVG local
  icon: string;
}

@Component({
  selector: 'app-dashboard-cards',
  // Referenciamos el archivo HTML
  templateUrl: './dashboard-cards.component.html',
  // Referenciamos el archivo SCSS
  styleUrls: ['./dashboard-cards.component.scss'],
  standalone: true,
  imports: [CommonModule],

})
export class DashboardCardsComponent {
  // Input que recibe los datos de las tarjetas desde el componente padre (e.g., el dashboard)
  cards = input<DashboardCard[]>([
    { title: 'Estudiantes', value: 100, icon: 'assets/icon/PhStudent.svg' },
    { title: 'Profesores', value: 15, icon: 'assets/icon/Pencil.svg' },
    { title: 'Tutores', value: 78, icon: 'assets/icon/BxUser.svg' },
    { title: 'Pedidos', value: 45, icon: 'assets/icon/Shopping.svg' },
  ]);
}
