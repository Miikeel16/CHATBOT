import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private http = inject(HttpClient);

  constructor() { }

  enviarPregunta(parameter: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': '*/*'
    });

    const requestBody: ChatRequest = {
      question: parameter
    };

    return this.http.post(environment.chatbotURL, requestBody, { headers });
    // Pruebas sin conexión
    // return this.http.get(environment.chatbotURL);
  }
}

interface ChatRequest {
  question: string;
}