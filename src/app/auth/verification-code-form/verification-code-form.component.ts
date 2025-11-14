import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verification-code-form',
  templateUrl: './verification-code-form.component.html',
  styleUrls: ['./verification-code-form.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class VerificationCodeFormComponent implements OnInit {
  codeForm!: FormGroup;

  // Emite el código al padre
  @Output() codeSubmit = new EventEmitter<string>();
  // Emite el evento para volver al Login
  @Output() goToLogin = new EventEmitter<void>();

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.codeForm = this.fb.group({
      // Código de 6 dígitos numéricos
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern('^[0-9]*$')]],
    });
  }

  onSubmit() {
    if (this.codeForm.valid) {
      this.codeSubmit.emit(this.codeForm.value.code);
    } else {
      this.codeForm.markAllAsTouched();
    }
  }
}
