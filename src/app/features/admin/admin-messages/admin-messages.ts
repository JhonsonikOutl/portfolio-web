import { Component, OnInit, signal, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../../core/services/contact.service';
import { ContactMessage } from '../../../shared/models/contact.model';
import { EmailService } from '../../../core/services/email.service';
import { NotificationService } from '../../../core/services/notification.service';

type FilterType = 'all' | 'unread' | 'read';

@Component({
  selector: 'app-admin-messages',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-messages.html',
  styleUrl: './admin-messages.css',
  encapsulation: ViewEncapsulation.None
})
export class AdminMessages implements OnInit {
  allMessages = signal<ContactMessage[]>([]);
  filteredMessages = signal<ContactMessage[]>([]);
  loading = signal(true);
  
  activeFilter = signal<FilterType>('all');
  
  selectedMessage = signal<ContactMessage | null>(null);
  showDetailModal = signal(false);
  showReplyModal = signal(false);
  replyBody = signal('');
  sendingReply = signal(false);
  showDeleteModal = signal(false);
  messageToDelete = signal<ContactMessage | null>(null);

  constructor(
    private contactService: ContactService,
    private emailService: EmailService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  /**
   * Cargar todos los mensajes
   */
  loadMessages(): void {
    this.loading.set(true);
    this.contactService.getAll().subscribe({
      next: (messages) => {
        const sorted = messages.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.allMessages.set(sorted);
        this.applyFilter();
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar mensajes:', error);
        this.notificationService.error('Error al cargar los mensajes');
        this.loading.set(false);
      }
    });
  }

  /**
   * Aplicar filtro
   */
  applyFilter(): void {
    const filter = this.activeFilter();
    const all = this.allMessages();

    if (filter === 'unread') {
      this.filteredMessages.set(all.filter(m => !m.isRead));
    } else if (filter === 'read') {
      this.filteredMessages.set(all.filter(m => m.isRead));
    } else {
      this.filteredMessages.set(all);
    }
  }

  /**
   * Cambiar filtro
   */
  setFilter(filter: FilterType): void {
    this.activeFilter.set(filter);
    this.applyFilter();
  }

  /**
   * Contar mensajes no leídos
   */
  get unreadCount(): number {
    return this.allMessages().filter(m => !m.isRead).length;
  }

  /**
   * Abrir modal de detalles
   */
  viewDetails(message: ContactMessage): void {
    this.showReplyModal.set(false);
    this.showDeleteModal.set(false);    
    this.selectedMessage.set(message);
    this.showDetailModal.set(true);
    this.cdr.detectChanges();

    if (!message.isRead && message.id) {
      this.markAsRead(message.id, false);
    }
  }

  /**
   * Cerrar modal de detalles
   */
  closeDetailModal(): void {
    this.showDetailModal.set(false);
    this.selectedMessage.set(null);
  }

  /**
   * Marcar como leído
   */
  markAsRead(id: string, reload: boolean = true): void {
    this.contactService.markAsRead(id).subscribe({
      next: () => {
        this.allMessages.update(messages =>
          messages.map(m => m.id === id ? { ...m, isRead: true } : m)
        );
        if (reload) {
          this.applyFilter();
          this.notificationService.success('Mensaje marcado como leído');
        }
      },
      error: (error) => {
        console.error('Error al marcar como leído:', error);
        this.notificationService.error('Error al marcar el mensaje como leído');
      }
    });
  }

  /**
   * Abrir modal de respuesta
   */
  openReplyModal(message: ContactMessage): void {
    this.showDetailModal.set(false);
    this.showDeleteModal.set(false);
    this.selectedMessage.set(message);
    this.replyBody.set('');
    this.showReplyModal.set(true);
    this.cdr.detectChanges();
  }

  /**
   * Cerrar modal de respuesta
   */
  closeReplyModal(): void {
    this.showReplyModal.set(false);
    this.selectedMessage.set(null);
    this.replyBody.set('');
  }

  /**
   * Enviar respuesta
   */
  sendReply(): void {
    const message = this.selectedMessage();
    const body = this.replyBody().trim();

    if (!message || !message.id || !body) {
      this.notificationService.warning('Por favor completa todos los campos');
      return;
    }

    this.sendingReply.set(true);

    this.emailService.replyToContact(message.id, { body, isHtml: true }).subscribe({
      next: (response) => {
        this.notificationService.success('Respuesta enviada exitosamente');
        this.closeReplyModal();
        this.loadMessages();
        this.sendingReply.set(false);
      },
      error: (error) => {
        console.error('Error al enviar respuesta:', error);
        const errorMessage = error.error?.message || 'Error al enviar la respuesta. Intenta nuevamente.';
        this.notificationService.error(errorMessage);
        
        this.sendingReply.set(false);
      }
    });
  }

  /**
   * Confirmar eliminación
   */
  confirmDelete(message: ContactMessage): void {
    this.messageToDelete.set(message);
    this.showDeleteModal.set(true);
  }

  /**
   * Cancelar eliminación
   */
  cancelDelete(): void {
    this.showDeleteModal.set(false);
    this.messageToDelete.set(null);
  }

  /**
   * Eliminar mensaje
   */
  deleteMessage(): void {
    const message = this.messageToDelete();
    if (!message || !message.id) return;

    this.contactService.delete(message.id).subscribe({
      next: () => {
        this.allMessages.update(messages => messages.filter(m => m.id !== message.id));
        this.applyFilter();
        this.showDeleteModal.set(false);
        this.messageToDelete.set(null);
        this.notificationService.success('Mensaje eliminado correctamente');
      },
      error: (error) => {
        console.error('Error al eliminar mensaje:', error);
        this.notificationService.error('Error al eliminar el mensaje');
      }
    });
  }

  /**
   * Formatear fecha
   */
  formatDate(date: Date | string): string {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  /**
   * Obtener preview del mensaje
   */
  getPreview(message: string): string {
    return message.length > 100 ? message.substring(0, 100) + '...' : message;
  }
}