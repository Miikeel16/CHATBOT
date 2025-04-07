import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import type { Chats, Mensajes } from '../../interfaces/mensaje.interface';
import { ChatbotService } from '../../services/chatbot.service';
import { MysqlService } from '../../services/mysql.service';
import { CurrentChatComponent } from '../current-chat/current-chat.component';
import { DashboardComponent } from "../dashboard/dashboard.component";

@Component({
  selector: 'chat-question-bar',
  imports: [CurrentChatComponent, DashboardComponent],
  templateUrl: './question-bar.component.html',
})
export class QuestionBarComponent {
  // Referencia al campo de entrada de texto del mensaje
  @ViewChild('txtchat') txtChat!: ElementRef;
  // Inyección del servicio del chatbot con la API
  chatbot = inject(ChatbotService);
  mysql = inject(MysqlService);
  // Señal que almacena la cadena de mensajes del chat
  chainChat = signal<Mensajes[]>([]);
  // Señal para indicar si se está cargando
  isLoading = signal<boolean>(false);
  // Señal que almacena el historial de chats
  chat = signal<Chats[]>([]);

  // Obtiene el parámetro 'query' de la ruta activa
  query = toSignal(
    inject(ActivatedRoute).params.pipe(map(params => params['query']))
  );

  constructor() {
    // Recupera el historial de chats del almacenamiento local
    const stored = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    // Si se recupera un array, lo establece en la señal de chats
    if (Array.isArray(stored) && stored.length > 0) {
      this.chat.set(stored);
    } else {
      this.mysql.obtenerMensajes().subscribe(
        (data) => {
          this.chat.set(this.groupByTitle(data));
          localStorage.setItem('chatHistory', JSON.stringify(this.groupByTitle(data)));
        },
        (error) => {
          console.error('Error al obtener el historial de la base de datos: ', error);
        }
      );
    }
  }

  private groupByTitle(data: any[]): Chats[] {
    const grouped: { [key: string]: Chats } = {};

    data.forEach(item => {
      const { title, content, type } = item;

      // Si el título no existe en el objeto agrupado, inicializa un nuevo objeto Chats
      if (!grouped[title]) {
        grouped[title] = { titulo: title, mensajes: [] };
      }

      // Agrega el mensaje al array de mensajes correspondiente
      grouped[title].mensajes.push({ texto: content, tipo: type });
    });

    // Devuelve un array de Chats a partir del objeto agrupado
    return Object.values(grouped);
  }

  /**
   * Envía un mensaje al chatbot y actualiza la cadena de chat.
   * @param mensaje - El mensaje que se enviará a la API.
   */
  enviarMensaje(mensaje: string) {
    // Evita enviar una petición si ya se está cargando
    if (this.isLoading()) return;

    // Verifica que el mensaje no esté vacío
    if (mensaje.trim() != '') {
      // Activa la señal de carga
      this.isLoading.set(true);
      // Limpia el campo de entrada
      this.txtChat.nativeElement.value = '';

      // Agrega el mensaje del usuario a la cadena de chat
      this.chainChat.update(info => [
        ...info,
        { texto: mensaje, tipo: 'usuario' } // Agrega el mensaje del usuario
      ])
      // Guarda el mensaje en el historial
      this.guardarChat(mensaje, 'usuario');

      // Envía el mensaje al chatbot y maneja la respuesta
      this.chatbot.enviarPregunta(mensaje).subscribe({
        next: (resp) => {
          // Convierte la respuesta a JSON y la parsea
          const jsonString = JSON.stringify(resp);
          const jsonArray = JSON.parse(jsonString);

          // Agrega la respuesta del bot a la cadena de chat
          this.chainChat.update(info => [
            ...info,
            { texto: jsonArray.answare, tipo: 'bot' } // Agrega la respuesta de la API
          ])

          // Guarda la respuesta en el historial
          this.guardarChat(jsonArray.answare, 'bot');
          // Desactiva la señal de carga
          this.isLoading.set(false);
        }, error: (err) => {
          // Manejo de errores: agrega un mensaje de error a la cadena de chat
          this.chainChat.update(info => [
            ...info,
            { texto: 'Error', tipo: 'bot' } // Mensaje de errpr
          ])

          // Guarda la respuesta en el historial
          this.guardarChat('Error', 'bot');
          // Desactiva la señal de carga
          this.isLoading.set(false);
        }
      });
    }
  }

  /**
   * Guarda el chat en el historial.
   * @param contenido - Contenido del mensaje.
   * @param tipoUser - Tipo de usuario ('usuario' o 'bot').
   */
  guardarChat(contenido: string, tipoUser: 'usuario' | 'bot') {
    this.chat.update(data => {
      // Obtiene el título del chat
      const nuevoTitulo = this.query() ? this.query() : null;
      // Busca el índice del chat
      const index = data.findIndex(item => item.titulo === nuevoTitulo);

      // Si el chat ya existe, agrega el nuevo mensaje
      if (index !== -1) {
        data[index].mensajes.push({ texto: contenido, tipo: tipoUser });
      } else {
        // Si no existe, crea un nuevo chat
        data.push({
          titulo: nuevoTitulo,
          mensajes: [{ texto: contenido, tipo: tipoUser }]
        });
      }

      // Devuelve el nuevo estado del historial
      return data;
    })

    // Guarda el historial en localStorage si hay un título
    if (this.query() !== undefined) {
      localStorage.setItem('chatHistory', JSON.stringify(this.chat()));
      this.mysql.guardarMensaje(this.query(), contenido, tipoUser).subscribe(
        // response => {
        //   console.log('Message saved successfully:', response);
        // }
      );
    }

    // Filtra el historial para eliminar entradas con título nulo
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    const filteredHistory = chatHistory.filter((item: { titulo: string | null; }) => item.titulo !== null);

    // Actualiza localStorage
    localStorage.setItem('chatHistory', JSON.stringify(filteredHistory));

  }
}
