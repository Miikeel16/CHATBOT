export interface Chats {
    titulo: string;
    mensajes: Mensajes[];
}
/**
 * Interfaz que representa un mensaje en el sistema del chatbot.
 * @interface Mensajes
 * @property {string} texto - El contenido del mensaje.
 * @property {'usuario' | 'bot'} tipo - Indica el tipo de remitente del mensaje.
 * Puede ser 'usuario' para mensajes enviados por el usuario o 'bot' para mensajes recibidos por la API.
 */
export interface Mensajes {
    texto: string;
    tipo: 'usuario' | 'bot'
}
