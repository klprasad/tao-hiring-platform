import { Component, input } from '@angular/core';
import { TaoButtonComponent } from '../../native-controls/tao-button/tao-button.component';
@Component({
  selector: 'tao-document-viewer',
  imports: [TaoButtonComponent],
  templateUrl: './tao-document-viewer.component.html',
  styleUrl: './tao-document-viewer.component.scss',
})
export class TaoDocumentViewerComponent {
  readonly title = input('Document');
  readonly content = input('Document preview content.');
}
