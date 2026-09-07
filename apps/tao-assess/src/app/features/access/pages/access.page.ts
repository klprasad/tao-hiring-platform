import { Component } from '@angular/core';
import { TaoButtonComponent, TaoInputComponent } from 'tao-ui';

@Component({
  selector: 'tao-access-page',
  imports: [TaoButtonComponent, TaoInputComponent],
  templateUrl: './access.page.html',
  styleUrl: './access.page.scss',
})
export class AccessPage {}
