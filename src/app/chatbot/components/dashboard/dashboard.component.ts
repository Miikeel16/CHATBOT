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
    }
    // Limpia el campo value del input
    this.txtnew.nativeElement.value = '';
  }
}
