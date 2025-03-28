import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private http = inject(HttpClient);

  constructor() { }

  enviarPregunta(question: string): Observable<any> { // Reemplaza 'any' con el tipo correcto de la respuesta
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': '*/*' //  Aunque el servidor probablemente infiera el accept, lo incluimos por consistencia
    });

    const requestBody: ChatRequest = {
      question: question
    };

    return this.http.post<any>(environment.chatbotURL, requestBody, { headers });  // Reemplaza 'any' con el tipo correcto de la respuesta
  }
}

interface ChatRequest {
  question: string;
}