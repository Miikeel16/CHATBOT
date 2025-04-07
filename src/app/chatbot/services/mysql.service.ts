import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type { Chats } from '../interfaces/mensaje.interface';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MysqlService {
    // Inyección del HttpClient para realizar peticiones HTTP
    private http = inject(HttpClient);

    constructor() { }

    // Método para guardar un mensaje
    guardarMensaje(title: string, content: string, type: 'usuario' | 'bot'): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json', // Tipo de contenido JSON
            'accept': '*/*' // Acepta cualquier tipo de respuesta
        });
        // Realiza una petición POST para guardar el mensaje en la URL definida en el entorno
        return this.http.post<any>(environment.mysqlURL, { title, content, type }, { headers });
    }

    // Método para obtener todos los mensajes
    obtenerMensajes(): Observable<Chats[]> {
        // Realiza una petición GET para obtener los mensajes desde la URL definida en el entorno
        return this.http.get<Chats[]>(environment.mysqlURL);
    }

    // Método para borrar un mensaje por TITLE
    borrarMensaje(title: string): Observable<any> {
        // Realiza una petición DELETE para borrar el mensaje específico usando su TITLE
        return this.http.delete(`${environment.mysqlURL}/${title}`);
    }

    // Método para borrar todos los mensajes
    borrarTodos(): Observable<any> {
        // Realiza una petición DELETE para borrar todos los mensajes
        return this.http.delete(environment.mysqlURL);
    }
}