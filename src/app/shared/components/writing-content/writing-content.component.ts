import { Component, input } from '@angular/core';

@Component({
  selector: 'app-writing-content',
  templateUrl: './writing-content.component.html',
  styleUrl: './writing-content.component.scss',
})
export class WritingContentComponent {
  readonly html = input.required<string>();
}
