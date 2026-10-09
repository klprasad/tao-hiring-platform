import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  input,
} from '@angular/core';
import loader from '@monaco-editor/loader';
import type * as Monaco from 'monaco-editor';
import { TaoCardComponent } from '@tao/ui';
import { AssessmentQuestionCodeResponse } from '../../models/assessment-result.models';

export type CodingLanguage = 'csharp' | 'java' | 'python' | 'typescript' | 'javascript';

interface MonacoLanguageConfig {
  monacoId: string;
  label: string;
}

@Component({
  selector: 'tao-candidate-code-viewer',
  standalone: true,
  imports: [TaoCardComponent],
  templateUrl: './candidate-code-viewer.html',
  styleUrl: './candidate-code-viewer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandidateCodeViewer implements AfterViewInit, OnDestroy {
  @ViewChild('editorHost', { static: true })
  private readonly editorHost!: ElementRef<HTMLDivElement>;

  readonly response = input.required<AssessmentQuestionCodeResponse>();
  readonly language = input<CodingLanguage>('csharp');

  private editor?: Monaco.editor.IStandaloneCodeEditor;
  private model?: Monaco.editor.ITextModel;
  private monaco?: typeof import('monaco-editor');

  async ngAfterViewInit(): Promise<void> {
    try {
      this.monaco = await loader.init();
      if (!this.monaco) {
        return;
      }
      const config = this.getLanguageConfig(this.language());
      this.model = this.monaco.editor.createModel(this.response().code, config.monacoId);

      this.editor = this.monaco.editor.create(this.editorHost.nativeElement, {
        model: this.model,
        theme: 'vs-dark',
        readOnly: true,
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
        renderLineHighlight: 'none',
        overviewRulerBorder: false,
        hideCursorInOverviewRuler: true,
        scrollbar: {
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10,
        },
      });
    } catch {
      // Keep the results page usable even when Monaco cannot be initialized.
    }
  }

  ngOnDestroy(): void {
    this.editor?.dispose();
    this.editor = undefined;

    this.model?.dispose();
    this.model = undefined;

    this.monaco = undefined;
  }

  private getLanguageConfig(language: CodingLanguage): MonacoLanguageConfig {
    const configs: Record<CodingLanguage, MonacoLanguageConfig> = {
      csharp: { monacoId: 'csharp', label: 'C#' },
      java: { monacoId: 'java', label: 'Java' },
      python: { monacoId: 'python', label: 'Python' },
      typescript: { monacoId: 'typescript', label: 'TypeScript' },
      javascript: { monacoId: 'javascript', label: 'JavaScript' },
    };

    return configs[language];
  }
}
