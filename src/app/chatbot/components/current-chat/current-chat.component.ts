import { AfterViewChecked, Component, ElementRef, input, ViewChild } from '@angular/core';
import { Mensajes } from '../../interfaces/mensaje.interface';

@Component({
  selector: 'chat-current',
  imports: [],
  templateUrl: './current-chat.component.html',
})
export class CurrentChatComponent implements AfterViewChecked {
  // Referencia al contenedor del chat
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  // Lista de mensajes que se mostrarán en el chat
  mensajes = input<Mensajes[]>();

  /**
   * Se ejecuta después de que la vista ha sido inicializada.
   * Desplaza el contenedor del chat hacia abajo.
   */
  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  /**
   * Se ejecuta después de cada verificación de la vista.
   * Desplaza el contenedor del chat hacia abajo si hay nuevos mensajes.
   */
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  /**
   * Desplaza el contenedor del chat hacia la parte inferior.
   */
  scrollToBottom(): void {
    const chat = this.scrollContainer.nativeElement;
    // Ajusta el desplazamiento al final del contenedor
    chat.scrollTop = chat.scrollHeight;
  }
}
