import { Component, ElementRef, signal, ViewChild } from '@angular/core';


@Component({
  selector: 'dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  @ViewChild('txtnew') txtnew!: ElementRef;
  chats=signal<string[]>([]);

  nuevoChat(chatTitle:string){
    if(chatTitle.trim()!=''){
      this.chats.update(data=>[
        ...data, chatTitle
      ])
    }
    this.txtnew.nativeElement.value = '';
  }
}
