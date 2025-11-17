import { Component, OnInit } from '@angular/core';
import { IonList, IonItem, IonIcon, IonLabel, IonContent, IonAvatar, IonText } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { personOutline, peopleOutline, bookOutline, schoolOutline, mailOutline, cartOutline, homeOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
addIcons({ personOutline, peopleOutline, bookOutline, schoolOutline, mailOutline, cartOutline, homeOutline });

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonList, IonItem, IonIcon, IonLabel, IonContent, IonAvatar, IonText]
})
export class NavbarComponent implements OnInit {



  menuItems = [
    { title: 'Inicio', url: '/admin/home' }, 
    { title: 'Usuarios', url: '/admin/usuarios' },
    { title: 'Estudiante', url: '/admin/estudiante' },
    { title: 'Profesor', url: '/admin/profesor' },
    { title: 'Tutor', url: '/admin/tutor' },
    { title: 'Comunicados', url: '/admin/comunicados' },
    { title: 'Productos', url: '/admin/productos'},
  ];

  constructor() { }

  ngOnInit() {}

}
