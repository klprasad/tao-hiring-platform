import { Component, input } from '@angular/core';

@Component({
  selector: 'tao-document-viewer',
  templateUrl: './tao-document-viewer.component.html',
  styleUrl: './tao-document-viewer.component.scss',
})
export class TaoDocumentViewerComponent {
  readonly title = input('Document');
  readonly content = input('Document preview content.');
}
