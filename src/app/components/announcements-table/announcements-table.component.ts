import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importamos los componentes de Ionic necesarios para la tabla
import { IonGrid, IonRow, IonCol, IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-announcements-table',
  standalone: true,
  imports: [CommonModule, IonGrid, IonRow, IonCol, IonButton, IonIcon],
  templateUrl: './announcements-table.component.html',
  styleUrls: ['./announcements-table.component.scss'],
})
export class AnnouncementsTableComponent {
  announcements = [
    { id: 1, name: 'Reunión de Padres', detail: 'Agenda para la junta bimestral...', date: '2024-11-15' },
    { id: 2, name: 'Horarios de Exámenes', detail: 'Fechas y aulas asignadas...', date: '2024-11-20' },
    { id: 3, name: 'Feria de Ciencias', detail: 'Convocatoria y bases del concurso...', date: '2024-11-28' },
    { id: 4, name: 'Cierre Administrativo', detail: 'Recordatorio para entrega de documentos...', date: '2024-12-05' },
  ];
}
