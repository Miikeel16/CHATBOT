import { Component, EventEmitter, Output } from '@angular/core';
import { CurrentChatComponent } from '../current-chat/current-chat.component';

@Component({
  selector: 'chat-question-bar',
  imports: [CurrentChatComponent],
  templateUrl: './question-bar.component.html',
  styleUrl: './question-bar.component.css',
})
export class QuestionBarComponent {
  @Output() mensajeEnviado = new EventEmitter<string>();
  nuevoMensaje: string = '';

  enviarMensaje(mensaje: string) {
    console.log(mensaje);
    if (mensaje.trim() !== '') {
      this.mensajeEnviado.emit(mensaje);
    }
  }
}
