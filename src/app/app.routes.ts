import { Routes } from '@angular/router';
import { ChatbotComponent } from './chatbot/pages/chatbot/chatbot.component';

export const routes: Routes = [
  {
    path: '',
    component: ChatbotComponent,
  },
  {
    path:'**',
    redirectTo: '',
  },




];
