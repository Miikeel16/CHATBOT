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

  enviarPregunta(parameter: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': '*/*'
    });

    const requestBody: ChatRequest = {
      question: parameter
    };

    return this.http.post(environment.chatbotURL, requestBody, { headers });
  }
}

interface ChatRequest {
  question: string;
}