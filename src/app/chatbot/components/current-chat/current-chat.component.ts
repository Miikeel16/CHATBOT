import { Component, input, signal } from '@angular/core';
import { mensajes } from '../interfaces/mensaje.interface';

@Component({
  selector: 'chat-current',
  imports: [],
  templateUrl: './current-chat.component.html',
  styleUrl: './current-chat.component.css',
})
export class CurrentChatComponent {
  data = input<string>();

  mensajes=signal<mensajes[]>([]);

  recibirMensaje(data:string) {
    this.mensajes.update(mensaje => [
      ...mensaje,
      { texto: data, tipo: 'usuario' }
    ]);
  }



}
