import { AfterViewChecked, Component, ElementRef, HostListener, input, ViewChild } from '@angular/core';
import { Mensajes } from '../../interfaces/mensaje.interface';

@Component({
  selector: 'chat-current',
  imports: [],
  templateUrl: './current-chat.component.html',
})
export class CurrentChatComponent implements AfterViewChecked {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  mensajes = input<Mensajes[]>();

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  scrollToBottom(): void {
    const chat = this.scrollContainer.nativeElement;
    chat.scrollTop = chat.scrollHeight;
  }
}
