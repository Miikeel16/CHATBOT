import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-chatbot',
  imports: [],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatbotComponent { }
