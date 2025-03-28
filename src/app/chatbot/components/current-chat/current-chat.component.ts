import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-current-chat',
  imports: [],
  templateUrl: './current-chat.component.html',
  styleUrl: './current-chat.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentChatComponent { }
