import { Component, ElementRef, signal, ViewChild } from '@angular/core';


@Component({
  selector: 'dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  // Referencia al campo de entrada para el nuevo chat
  @ViewChild('txtnew') txtnew!: ElementRef;
  // Señal que almacena la lista de títulos de chats
  chats = signal<string[]>([]);

  constructor() {
    // Recupera el historial de chats del localStorage y lo parsea
    const stored = JSON.parse(localStorage.getItem('chatHistory') || '{}');
    // Itera sobre el historial recuperado y lo agrega a la lista de chats
    for (let index = 0; index < stored.length; index++) {
      const element = stored[index];
      this.chats.update(data => [
        ...data, element // Agrega cada elemento al estado actual de chats
      ])
    }
  }

  /**
   * Agrega un nuevo titulo al historico de chats.
   *
   * @param chatTitle - Título del nuevo chat a agregar.
   */
  nuevoChat(chatTitle: string) {
    if (chatTitle.trim() != '') {
      this.chats.update(data => [
        ...data, chatTitle // Agrega el nuevo título a la lista existente
      ])
      // Guarda el historial actualizado en el localStorage
      localStorage.setItem('chatHistory', JSON.stringify(this.chats()));
    }
    // Limpia el campo value del input
    this.txtnew.nativeElement.value = '';
  }
}
