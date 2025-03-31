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
  @ViewChild('txtchat') txtChat!: ElementRef;
  chatbot = inject(ChatbotService);
  chainChat = signal<Mensajes[]>([]);

  enviarMensaje(mensaje: string) {
    if (mensaje.trim() != '') {
      this.txtChat.nativeElement.value = '';
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
