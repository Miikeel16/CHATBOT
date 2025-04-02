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
   * @param mensaje - El mensaje que se enviará a la API.
   */
  enviarMensaje(mensaje: string) {
    // Verifica que el mensaje no esté vacío
    if (mensaje.trim() != '') {
      // Limpia el campo de entrada
      this.txtChat.nativeElement.value = '';

      // Agrega el mensaje del usuario a la cadena de chat
      this.chainChat.update(info => [
        ...info,
        { texto: mensaje, tipo: 'usuario' } // Agrega el mensaje del usuario
      ])

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
        }, error: (err) => {
          // Manejo de errores: agrega un mensaje de error a la cadena de chat
          this.chainChat.update(info => [
            ...info,
            { texto: 'Error', tipo: 'bot' } // Mensaje de errpr
          ])
        }
      });
    }
  }
}
