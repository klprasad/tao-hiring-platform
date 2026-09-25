import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import loader from '@monaco-editor/loader';
import type * as Monaco from 'monaco-editor';
import { AssessmentSessionStore } from '../../../core/assessment-session.store';

@Component({
  selector: 'tao-coding-workspace',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './coding-workspace.page.html',
  styleUrl: './coding-workspace.page.scss',
})
export class CodingWorkspacePage implements AfterViewInit, OnDestroy {
  @ViewChild('editorHost', { static: true })
  private readonly editorHost!: ElementRef<HTMLDivElement>;

  readonly store = inject(AssessmentSessionStore);

  private readonly router = inject(Router);
  private editor?: Monaco.editor.IStandaloneCodeEditor;
  private model?: Monaco.editor.ITextModel;
  private monaco?: typeof Monaco;
  private saveTimer?: ReturnType<typeof setTimeout>;

  async ngAfterViewInit(): Promise<void> {
    try {
      const monaco = await loader.init();
      this.monaco = monaco;

      this.model = monaco.editor.createModel(this.store.codingCode(), 'csharp');

      this.editor = monaco.editor.create(this.editorHost.nativeElement, {
        model: this.model,
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 14,
        lineHeight: 22,
        tabSize: 4,
        insertSpaces: true,
        wordWrap: 'off',
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        padding: { top: 16, bottom: 16 },
        renderLineHighlight: 'line',
        overviewRulerBorder: false,
        hideCursorInOverviewRuler: true,
        scrollbar: {
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10,
        },
      });
      if (this.editor)
        this.editor.onDidChangeModelContent(() => {
          const value = this.editor?.getValue() ?? '';
          this.store.setCodingCode(value);
          this.store.setCodingSaveState('saving');

          if (this.saveTimer) {
            clearTimeout(this.saveTimer);
          }

          // Mock autosave. Replace this block with the real save API.
          this.saveTimer = setTimeout(() => {
            this.store.setCodingSaveState('saved');
          }, 700);
        });
    } catch {
      this.store.setCodingSaveState('error');
    }
  }

  next(): void {
    this.store.nextQuestion();
    void this.router.navigate(['/session/demo-session/question']);
  }

  ngOnDestroy(): void {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
    }

    this.editor?.dispose();
    this.model?.dispose();
  }
}
