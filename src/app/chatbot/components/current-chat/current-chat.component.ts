import { Component, input } from '@angular/core';
import { Mensajes } from '../../interfaces/mensaje.interface';

@Component({
  selector: 'chat-current',
  imports: [],
  templateUrl: './current-chat.component.html',
})
export class CurrentChatComponent {
  mensajes = input<Mensajes[]>();
}
