import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toasts = signal<Toast[]>([]);
  private nextId = 0;

  getToasts() {
    return this.toasts.asReadonly();
  }

  success(message: string) {
    this.show('success', message);
  }

  error(message: string) {
    this.show('error', message);
  }

  info(message: string) {
    this.show('info', message);
  }

  warning(message: string) {
    this.show('warning', message);
  }

  private show(type: Toast['type'], message: string) {
    const id = this.nextId++;
    const toast: Toast = { id, type, message };
    
    this.toasts.update(toasts => [...toasts, toast]);

    setTimeout(() => this.remove(id), 5000);
  }

  remove(id: number) {
    this.toasts.update(toasts => toasts.filter(t => t.id !== id));
  }
}