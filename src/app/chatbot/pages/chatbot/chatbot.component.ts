import { Component } from '@angular/core';
import { CurrentChatComponent } from "../../components/current-chat/current-chat.component";
import { QuestionBarComponent } from "../../components/question-bar/question-bar.component";

@Component({
  selector: 'app-chatbot',
  imports: [CurrentChatComponent, QuestionBarComponent],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css',
})
export class ChatbotComponent { }
