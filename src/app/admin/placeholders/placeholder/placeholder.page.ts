import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonText } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-placeholder',
  template: `
    <ion-content class="placeholder-content">
      <ion-text color="medium">
        <h2>Página en construcción</h2>
        <p>Esta es la vista para: <strong>{{ pageName }}</strong>. <br> (Implementación pendiente, solo visual)</p>
      </ion-text>
    </ion-content>
  `,
  styles: [`
    .placeholder-content {
      --background: transparent;
      padding: 20px;
      text-align: center;
      h2 { font-size: 20px; font-weight: 600; margin-bottom: 5px; }
      strong { color: #4D82BC; }
    }
  `],
  standalone: true,
  imports: [CommonModule, IonContent, IonText]
})
export class PlaceholderPage {

  pageName: string = 'Módulo Desconocido';

  constructor(private route: ActivatedRoute) {
    const url = this.route.snapshot.url.map(segment => segment.path).join('/');
    this.pageName = url.length > 0 ? url.replace('/', ' / ') : 'Inicio Administrativo';
  }
}
