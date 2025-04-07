import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type { Chats } from '../interfaces/mensaje.interface';

@Injectable({ providedIn: 'root' })
export class MysqlService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3301/messages';

    constructor() { }

    guardarMensaje(title: string, content: string, type: 'usuario' | 'bot'): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'accept': '*/*'
        });
        return this.http.post<any>(this.apiUrl, { title, content, type }, { headers });
    }

    obtenerMensajes(): Observable<Chats[]> {
        return this.http.get<Chats[]>(this.apiUrl);
    }

    borrarMensaje(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    borrarTodos(): Observable<any> {
        return this.http.delete(this.apiUrl);
    }
}