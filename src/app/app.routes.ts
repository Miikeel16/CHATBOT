import { Routes } from '@angular/router';
import { QuestionBarComponent } from './chatbot/components/question-bar/question-bar.component';
import { LoginComponent } from './chatbot/components/login/login.component';
import { RegisterComponent } from './chatbot/components/register/register.component';

export const routes: Routes = [
  {
    path: '',
    component: QuestionBarComponent,
  },
  { path: 'login',
    component: LoginComponent,
  },
  { path: 'register',
    component: RegisterComponent,
  },
  {
    path: ':query',
    component: QuestionBarComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
