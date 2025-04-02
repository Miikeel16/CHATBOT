import { Component, ElementRef, inject, Input, input, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';
import type { Chats } from '../../interfaces/mensaje.interface';

@Component({
  selector: 'dashboard',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  // Referencia al campo de entrada para el nuevo chat
  @ViewChild('txtnew') txtnew!: ElementRef;
  @Input() chats: Chats[] = [];
  // Señal que indica si hay un error en la entrada
  inputError = signal(false);

  ngOnChanges() {
    // Verifica los parámetros de la consulta cada vez que cambien los chats
    this.checkQueryParam();
  }

  /**
   * Agrega un nuevo título al historial de chats.
   * @param chatTitle - El título del nuevo chat a agregar.
   */
  nuevoChat(chatTitle: string) {
    // Verifica que el título no esté vacío
    if (chatTitle.trim() === '') return;

    // Verifica si el chat ya existe en el historial
    if (this.chats.some(chat => chat.titulo === chatTitle)) {
      this.inputError.set(true);  // Activa la animación de error
      setTimeout(() => this.inputError.set(false), 500); // Desactiva el error después de 500ms
      return;
    }

    const newChat: Chats = { titulo: chatTitle, mensajes: [] };
    this.chats.push(newChat);
    localStorage.setItem('chatCompleteHistory', JSON.stringify(this.chats));
    // Limpia el campo de entrada
    this.txtnew.nativeElement.value = '';
  }

  /**
   * Elimina un chat del historial por su índice.
   * @param index - El índice del chat a eliminar.
   */
  eliminarChat(index: number) {
    this.chats.splice(index, 1);
    localStorage.setItem('chatCompleteHistory', JSON.stringify(this.chats));
    this.checkQueryParam();
  }
  eliminarTodosLosChats() {
    this.chats = [];  // Vacía el array de chats
    localStorage.removeItem('chatCompleteHistory'); // Elimina el historial almacenado
    this.checkQueryParam();
  }

  private checkQueryParam() {
    this.activatedRoute.params
      .pipe(map(params => params['query']))
      .subscribe(query => {
        if (query && !this.chats.some(chat => chat.titulo === query)) {
          this.router.navigate(['/']);
        }
      });
  }
}
