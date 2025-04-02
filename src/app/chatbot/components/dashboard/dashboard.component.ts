import { Component, ElementRef, inject, Input, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';
import type { Chats } from '../../interfaces/mensaje.interface';

@Component({
  selector: 'dashboard',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  // Inyección de dependencias para el enrutador y la ruta activada
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  // Referencia al campo de entrada para el nuevo chat
  @ViewChild('txtnew') txtnew!: ElementRef;
  // Se le pasa la lista de chats
  @Input() chats: Chats[] = [];
  // Señal que indica si hay un error en la entrada
  inputError = signal(false);

  ngOnChanges() {
    // Verifica los parámetros de la consulta cada vez que cambien los chats
    this.checkRouteExist();
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

    // Crea un nuevo chat y lo agrega a la lista
    const newChat: Chats = { titulo: chatTitle, mensajes: [] };
    this.chats.push(newChat);
    // Guarda en localStorage
    localStorage.setItem('chatHistory', JSON.stringify(this.chats));
    // Limpia el campo de entrada
    this.txtnew.nativeElement.value = '';
  }

  /**
   * Elimina un chat del historial por su índice.
   * @param index - El índice del chat a eliminar.
   */
  eliminarChat(index: number) {
    // Elimina el chat del array
    this.chats.splice(index, 1);
    // Actualiza localStorage
    localStorage.setItem('chatHistory', JSON.stringify(this.chats));
    // Verifica que exista la ruta en el chatHistory
    this.checkRouteExist();
  }

  // Elimina todos los chats del historial
  eliminarTodosLosChats() {
    // Vacía el array de chats
    this.chats = [];
    // Elimina el historial almacenado
    localStorage.removeItem('chatHistory');
    // Verifica que exista la ruta en el chatHistory
    this.checkRouteExist();
  }

  // Verifica que exista la ruta en el chatHistory
  private checkRouteExist() {
    this.activatedRoute.params
      .pipe(map(params => params['query'])) // Mapea los parámetros de la ruta
      .subscribe(query => {
        // Redirige a raiz si el query no coincide con ningún chat
        if (query && !this.chats.some(chat => chat.titulo === query)) {
          this.router.navigate(['/']);
        }
      });
  }
  isSidebarHidden: boolean = false;

  // Método para alternar la visibilidad de la barra lateral
  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }
}
