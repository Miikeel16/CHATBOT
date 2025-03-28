import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CurrentChatComponent } from '../current-chat/current-chat.component';
import { ChatbotService } from '../../services/chatbot.service';

@Component({
  selector: 'chat-question-bar',
  imports: [CurrentChatComponent],
  templateUrl: './question-bar.component.html',
})
export class QuestionBarComponent {
  chatbot = inject(ChatbotService);

  @Output() mensajeEnviado = new EventEmitter<string>();
  nuevoMensaje: string = '';

  enviarMensaje(mensaje: string) {
    console.log(mensaje);
    if (mensaje.trim() !== '') {
      this.mensajeEnviado.emit(mensaje);
    }
  }

  // TODO Arreglar error
  enviarPregunta() {
    this.chatbot.enviarPregunta("Hola").subscribe((resp) => {
      console.log(resp);
    }
    );
  }
}
