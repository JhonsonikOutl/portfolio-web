import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SendEmail {
  to: string;
  subject: string;
  body: string;
  isHtml?: boolean;
}

export interface ReplyEmail {
  body: string;
  isHtml?: boolean;
}

export interface EmailResponse {
  message: string;
  sentTo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = `${environment.apiUrl}/email`;

  constructor(private http: HttpClient) {}

  /**
   * Enviar email genérico
   */
  send(email: SendEmail): Observable<EmailResponse> {
    return this.http.post<EmailResponse>(`${this.apiUrl}/send`, email);
  }

  /**
   * Responder a un mensaje de contacto con soporte HTML
   */
  replyToContact(messageId: string, reply: ReplyEmail): Observable<EmailResponse> {
    return this.http.post<EmailResponse>(`${this.apiUrl}/reply/${messageId}`, reply);
  }
}