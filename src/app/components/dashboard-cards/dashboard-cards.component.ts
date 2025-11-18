import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../../firebase/firestore.service';

// Definimos la interfaz para el tipo de datos de la tarjeta
export interface DashboardCard {
  title: string;
  value: number;
  // Este campo contiene la RUTA del archivo SVG local
  icon: string;
}

@Component({
  selector: 'app-dashboard-cards',
  templateUrl: './dashboard-cards.component.html',
  styleUrls: ['./dashboard-cards.component.scss'],
  standalone: true,
  imports: [CommonModule],

})
export class DashboardCardsComponent implements OnInit {
  // Signal para las tarjetas
  cards = signal<DashboardCard[]>([
    { title: 'Estudiantes', value: 0, icon: 'assets/icon/PhStudent.svg' },
    { title: 'Profesores', value: 0, icon: 'assets/icon/Pencil.svg' },
    { title: 'Tutores', value: 0, icon: 'assets/icon/BxUser.svg' },
    { title: 'Pedidos', value: 0, icon: 'assets/icon/Shopping.svg' },
  ]);

  constructor(private firestoreService: FirestoreService) {}

  async ngOnInit() {
    await this.loadUserCounts();
  }

  async loadUserCounts() {
    try {
      const users = await this.firestoreService.getAllUsers();
      const categories = await this.firestoreService.getCategories();
      const categoryCount = new Map<string, number>();

      users.forEach(user => {
        const categoryId = user.category_id;
        if (categoryId) {
          categoryCount.set(categoryId, (categoryCount.get(categoryId) || 0) + 1);
        }
      });

      // Encontrar los IDs de las categorías específicas
      let estudiantesCount = 0;
      let profesoresCount = 0;
      let tutoresCount = 0;

      categories.forEach(cat => {
        const desc = cat.desc?.toLowerCase() || '';
        const count = categoryCount.get(cat.id) || 0;

        if (desc === 'student') {
          estudiantesCount = count;
        } else if (desc === 'teacher') {
          profesoresCount = count;
        } else if (desc === 'tutor') {
          tutoresCount = count;
        }
      });

      // Actualizar las tarjetas con los valores reales
      this.cards.set([
        { title: 'Estudiantes', value: estudiantesCount, icon: 'assets/icon/PhStudent.svg' },
        { title: 'Profesores', value: profesoresCount, icon: 'assets/icon/Pencil.svg' },
        { title: 'Tutores', value: tutoresCount, icon: 'assets/icon/BxUser.svg' },
        { title: 'Pedidos', value: 0, icon: 'assets/icon/Shopping.svg' },
      ]);
    } catch (error) {
      console.error('Error al cargar conteo de usuarios:', error);
    }
  }
}
