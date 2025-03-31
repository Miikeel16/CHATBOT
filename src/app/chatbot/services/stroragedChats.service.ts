import { effect, Injectable } from '@angular/core';

const loadfromLocalStorage = () => {
  const newChatsTitle = localStorage.getItem('chatTitle')
  return newChatsTitle ? JSON.parse(newChatsTitle) : [];
}

@Injectable({
  providedIn: 'root'
})
export class StroragedChatsService {
  saveToLocalStorage = effect(()=>{
    localStorage.setItem('chatTitle', JSON.stringify(this.chats()))
  })
    constructor() { }

}
