import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import type { Chats, Mensajes } from '../../interfaces/mensaje.interface';
import { CurrentChatComponent } from '../current-chat/current-chat.component';
import { ChatbotService } from '../../services/chatbot.service';
import { DashboardComponent } from "../dashboard/dashboard.component";

@Component({
  selector: 'chat-question-bar',
  imports: [CurrentChatComponent, DashboardComponent],
  templateUrl: './question-bar.component.html',
})
export class QuestionBarComponent {
  // Referencia al campo de entrada de texto del mensaje
  @ViewChild('txtchat') txtChat!: ElementRef;
  // Inyección del servicio del chatbot con la API
  chatbot = inject(ChatbotService);
  // Señal que almacena la cadena de mensajes del chat
  chainChat = signal<Mensajes[]>([]);

  isLoading = signal<boolean>(false);
  chat = signal<Chats[]>([]);
  query = toSignal(
    inject(ActivatedRoute).params.pipe(map(params => params['query']))
  );

  constructor() {
    // Recupera el historial de chats del almacenamiento local
    const stored = JSON.parse(localStorage.getItem('chatCompleteHistory') || '[]');
    // Si se recupera un array, lo establece en la señal de chats
    if (Array.isArray(stored)) {
      this.chat.set(stored);
    }
  }

  /**
   * Envía un mensaje al chatbot y actualiza la cadena de chat.
   * @param mensaje - El mensaje que se enviará a la API.
   */
  enviarMensaje(mensaje: string) {
    if (this.isLoading()) return;

    // Verifica que el mensaje no esté vacío
    if (mensaje.trim() != '') {
      this.isLoading.set(true);
      // Limpia el campo de entrada
      this.txtChat.nativeElement.value = '';

      // Agrega el mensaje del usuario a la cadena de chat
      this.chainChat.update(info => [
        ...info,
        { texto: mensaje, tipo: 'usuario' } // Agrega el mensaje del usuario
      ])
      this.guardarChat(mensaje, 'usuario');

      // Envía el mensaje al chatbot y maneja la respuesta
      this.chatbot.enviarPregunta(mensaje).subscribe({
        next: (resp) => {
          // Convierte la respuesta a JSON y la parsea
          const jsonString = JSON.stringify(resp);
          const jsonArray = JSON.parse(jsonString);

          // Agrega la respuesta del bot a la cadena de chat
          this.chainChat.update(info => [
            ...info,
            { texto: jsonArray.answare, tipo: 'bot' } // Agrega la respuesta de la API
          ])

          this.guardarChat(jsonArray.answare, 'bot');
          this.isLoading.set(false);
        }, error: (err) => {
          // Manejo de errores: agrega un mensaje de error a la cadena de chat
          this.chainChat.update(info => [
            ...info,
            { texto: 'Error', tipo: 'bot' } // Mensaje de errpr
          ])

          this.guardarChat('Error', 'bot');
          this.isLoading.set(false);
        }
      });
    }
  }

  guardarChat(contenido: string, tipoUser: 'usuario' | 'bot') {
    this.chat.update(data => {
      const nuevoTitulo = this.query() ? this.query() : null;
      const index = data.findIndex(item => item.titulo === nuevoTitulo);
      if (index !== -1) {
        data[index].mensajes.push({ texto: contenido, tipo: tipoUser });
      } else {
        data.push({
          titulo: nuevoTitulo,
          mensajes: [{ texto: contenido, tipo: tipoUser }]
        });
      }
      return data;
    })
    if (this.query() !== undefined) {
      localStorage.setItem('chatCompleteHistory', JSON.stringify(this.chat()));
    }
    const chatHistory = JSON.parse(localStorage.getItem('chatCompleteHistory') || '[]');
    const filteredHistory = chatHistory.filter((item: { titulo: string | null; }) => item.titulo !== null);
    localStorage.setItem('chatCompleteHistory', JSON.stringify(filteredHistory));
    console.log(this.chat());
  }
}
