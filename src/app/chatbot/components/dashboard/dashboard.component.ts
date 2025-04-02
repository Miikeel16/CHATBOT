import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'dashboard',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  // Referencia al campo de entrada para el nuevo chat
  @ViewChild('txtnew') txtnew!: ElementRef;
  // Señal que almacena el historial de chats
  chats = signal<string[]>([]);
  // Señal que indica si hay un error en la entrada
  inputError = signal(false);

  constructor() {
    // Recupera el historial de chats del almacenamiento local
    const stored = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    // Si se recupera un array, lo establece en la señal de chats
    if (Array.isArray(stored)) {
      this.chats.set(stored);
    }
  }

  /**
   * Agrega un nuevo título al historial de chats.
   * @param chatTitle - El título del nuevo chat a agregar.
   */
  nuevoChat(chatTitle: string) {
    // Verifica que el título no esté vacío
    if (chatTitle.trim() === '') return;

    // Verifica si el chat ya existe en el historial
    if (this.chats().includes(chatTitle)) {
      this.inputError.set(true);  // Activa la animación de error
      setTimeout(() => this.inputError.set(false), 500); // Desactiva el error después de 500ms
      return;
    }

    // Agrega el nuevo chat al historial y actualiza el almacenamiento local
    this.chats.update(data => [...data, chatTitle]);
    localStorage.setItem('chatHistory', JSON.stringify(this.chats()));
    // Limpia el campo de entrada
    this.txtnew.nativeElement.value = '';
  }

  /**
   * Elimina un chat del historial por su índice.
   * @param index - El índice del chat a eliminar.
   */
  eliminarChat(index: number) {
    // Actualiza el historial de chats eliminando el chat en el índice especificado
    this.chats.update(data => {
      const newChats = data.filter((_, i) => i !== index);
      // Actualiza el almacenamiento local con el nuevo historial
      localStorage.setItem('chatHistory', JSON.stringify(newChats));
      return newChats;
    });
  }
  eliminarTodosLosChats() {
    this.chats.set([]); // Vacía el array de chats
    localStorage.removeItem('chatHistory'); // Elimina el historial almacenado
  }
  isSidebarHidden: boolean = false;

  // Método para alternar la visibilidad de la barra lateral
  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }
}
