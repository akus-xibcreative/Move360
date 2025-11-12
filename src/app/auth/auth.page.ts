import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
// Importa el componente que contendrá todo el flujo de formularios
import { AuthFlowComponent } from './auth-flow/auth-flow.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  // Necesitas importar AuthFlowComponent aquí
  imports: [IonicModule, CommonModule, FormsModule, AuthFlowComponent]
})
export class AuthPage {
  constructor() { }
}
