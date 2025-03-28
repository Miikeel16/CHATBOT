import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-question-bar',
  imports: [],
  templateUrl: './question-bar.component.html',
  styleUrl: './question-bar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionBarComponent { }
