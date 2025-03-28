import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { CurrentChatComponent } from '../current-chat/current-chat.component';
import { ChatbotService } from '../../services/chatbot.service';
import { Mensajes } from '../../interfaces/mensaje.interface';

@Component({
  selector: 'chat-question-bar',
  imports: [CurrentChatComponent],
  templateUrl: './question-bar.component.html',
})
export class QuestionBarComponent {
  chatbot = inject(ChatbotService);
  chainChat = signal<Mensajes[]>([]);

  // @Output() mensajeEnviado = new EventEmitter<string>();
  // nuevoMensaje: string = '';

  enviarMensaje(mensaje: string) {
    if (mensaje.trim() !== '') {
      // this.mensajeEnviado.emit(mensaje);
      this.chainChat.update(info => [
        ...info,
        { texto: mensaje, tipo: 'usuario' }
      ])
      this.chatbot.enviarPregunta(mensaje).subscribe((resp) => {
        const jsonString = JSON.stringify(resp);
        const jsonArray = JSON.parse(jsonString);
        this.chainChat.update(info => [
          ...info,
          { texto: jsonArray.answare, tipo: 'bot' }
        ])
      }
      );
    }
  }
}
