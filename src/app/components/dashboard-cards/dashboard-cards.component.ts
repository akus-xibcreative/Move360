import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../../firebase/firestore.service';

export interface DashboardCard {
  title: string;
  value: number;
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

      let studentsCount = 0;
      let teachersCount = 0;
      let tutorsCount = 0;

      categories.forEach(cat => {
        const desc = cat.desc?.toLowerCase() || '';
        const count = categoryCount.get(cat.id) || 0;

        if (desc === 'student') {
          studentsCount = count;
        } else if (desc === 'teacher') {
          teachersCount = count;
        } else if (desc === 'tutor') {
          tutorsCount = count;
        }
      });

      this.cards.set([
        { title: 'Estudiantes', value: studentsCount, icon: 'assets/icon/PhStudent.svg' },
        { title: 'Profesores', value: teachersCount, icon: 'assets/icon/Pencil.svg' },
        { title: 'Tutores', value: tutorsCount, icon: 'assets/icon/BxUser.svg' },
        { title: 'Pedidos', value: 0, icon: 'assets/icon/Shopping.svg' },
      ]);
    } catch (error) {
      console.error('Error loading user counts:', error);
    }
  }
}

