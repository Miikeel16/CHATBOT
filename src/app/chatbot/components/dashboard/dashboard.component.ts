import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'dashboard',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  @ViewChild('txtnew') txtnew!: ElementRef;
  chats = signal<string[]>([]);

  constructor() {
    const stored = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    if (Array.isArray(stored)) {
      this.chats.set(stored);
    }
  }

  /**
   * Agrega un nuevo título al historial de chats.
   */
  nuevoChat(chatTitle: string) {
    if (chatTitle.trim() !== '') {
      this.chats.update(data => [...data, chatTitle]);
      localStorage.setItem('chatHistory', JSON.stringify(this.chats()));
    }
    this.txtnew.nativeElement.value = '';
  }

  /**
   * Elimina un chat del historial por su índice.
   */
  eliminarChat(index: number) {
    this.chats.update(data => {
      const newChats = data.filter((_, i) => i !== index);
      localStorage.setItem('chatHistory', JSON.stringify(newChats));
      return newChats;
    });
  }
}
