import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { CurrentChatComponent } from '../current-chat/current-chat.component';
import { ChatbotService } from '../../services/chatbot.service';
import { Mensajes } from '../../interfaces/mensaje.interface';
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

  /**
   * Envía un mensaje al chatbot y actualiza la cadena de chat.
   *
   * @param mensaje - El mensaje que se enviará a la API.
   */
  enviarMensaje(mensaje: string) {
    if (mensaje.trim() != '') {
      // Limpia el campo de entrada
      this.txtChat.nativeElement.value = '';
      this.chainChat.update(info => [
        ...info,
        { texto: mensaje, tipo: 'usuario' } // Agrega el mensaje del usuario
      ])
      this.chatbot.enviarPregunta(mensaje).subscribe({
        next: (resp) => {
          const jsonString = JSON.stringify(resp);
          const jsonArray = JSON.parse(jsonString);
          this.chainChat.update(info => [
            ...info,
            { texto: jsonArray.answare, tipo: 'bot' } // Agrega la respuesta de la API
          ])
        }, error: (err) => {
          this.chainChat.update(info => [
            ...info,
            { texto: 'Error', tipo: 'bot' } // Manejo de errores
          ])
        }
      }
      );
    }
  }
}
