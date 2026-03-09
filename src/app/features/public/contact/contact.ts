import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../../core/services/contact.service';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {
  name = signal('');
  email = signal('');
  subject = signal('');
  message = signal('');
  radicateNumber = signal('');

  loading = signal(false);
  success = signal(false);
  error = signal<string | null>(null);

  constructor(private contactService: ContactService) { }

  onSubmit(): void {
    this.error.set(null);
    this.success.set(false);

    if (!this.isFormValid()) {
      this.error.set('Por favor completa todos los campos');
      return;
    }

    this.loading.set(true);

    const contactData = {
      name: this.name(),
      email: this.email(),
      subject: this.subject(),
      message: this.message()
    };

    this.contactService.create(contactData).subscribe({
      next: (response) => {
        this.radicateNumber.set(response.radicateNumber);
        this.success.set(true);
        this.resetForm();
        this.loading.set(false);

        setTimeout(() => {
          this.success.set(false);
          this.radicateNumber.set('');
        }, 5000);
      },
      error: (err: any) => {
        this.error.set('Error al enviar el mensaje. Por favor intenta de nuevo.');
        this.loading.set(false);
        console.error('Error al enviar mensaje:', err);
      }
    });
  }

  isFormValid(): boolean {
    return !!(
      this.name().trim() &&
      this.email().trim() &&
      this.subject().trim() &&
      this.message().trim() &&
      this.isValidEmail(this.email())
    );
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  resetForm(): void {
    this.name.set('');
    this.email.set('');
    this.subject.set('');
    this.message.set('');
  }
}