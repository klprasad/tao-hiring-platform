import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
  input,
  output,
} from '@angular/core';

import loader from '@monaco-editor/loader';
import type * as Monaco from 'monaco-editor';

import { AssessmentSessionStore } from '../../../core/assessment-session.store';
import { AssessmentQuestionDto } from '../../../models/assessment-session.model';

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

  readonly question = input.required<AssessmentQuestionDto>();

  /**
   * Emits the candidate's code as a JSON string.
   */
  readonly continue = output<string>();

  private editor?: Monaco.editor.IStandaloneCodeEditor;

  private model?: Monaco.editor.ITextModel;

  private saveTimer?: ReturnType<typeof setTimeout>;

  async ngAfterViewInit(): Promise<void> {
    try {
      const monaco = await loader.init();

      const model = monaco.editor.createModel(this.store.codingCode(), 'csharp');

      this.model = model;

      const editor = monaco.editor.create(this.editorHost.nativeElement, {
        model,
        theme: 'vs-dark',
        automaticLayout: true,

        minimap: {
          enabled: false,
        },

        fontSize: 14,
        lineHeight: 22,

        tabSize: 4,
        insertSpaces: true,

        wordWrap: 'off',
        scrollBeyondLastLine: false,
        smoothScrolling: true,

        padding: {
          top: 16,
          bottom: 16,
        },

        renderLineHighlight: 'line',
        overviewRulerBorder: false,
        hideCursorInOverviewRuler: true,

        scrollbar: {
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10,
        },
      });

      this.editor = editor;

      editor.onDidChangeModelContent(() => {
        const value = editor.getValue();

        this.store.setCodingCode(value);
        this.store.setCodingSaveState('saving');

        if (this.saveTimer) {
          clearTimeout(this.saveTimer);
        }

        this.saveTimer = setTimeout(() => {
          this.store.setCodingSaveState('saved');
        }, 700);
      });
    } catch (error) {
      console.error('Failed to initialize Monaco editor', error);

      this.store.setCodingSaveState('error');
    }
  }

  /**
   * Emits the current editor content as a JSON string.
   */
  next(): void {
    if (!this.editor) {
      return;
    }

    const code = this.editor.getValue();

    /*
     * Convert the C# source code into a JSON string.
     *
     * Example:
     *
     * C#:
     * public class Test {}
     *
     * Result:
     * "\"public class Test {}\""
     */
    const response = JSON.stringify(code);

    this.continue.emit(response);
  }

  ngOnDestroy(): void {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
      this.saveTimer = undefined;
    }

    this.editor?.dispose();
    this.editor = undefined;

    this.model?.dispose();
    this.model = undefined;
  }
}
