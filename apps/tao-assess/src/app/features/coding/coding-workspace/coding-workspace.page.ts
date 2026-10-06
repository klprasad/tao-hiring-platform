import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';

import loader from '@monaco-editor/loader';
import type * as Monaco from 'monaco-editor';

import { AssessmentSessionStore } from '../../../core/assessment-session.store';
import { AssessmentQuestionDto } from '../../../models/assessment-session.model';
import { TaoButtonComponent } from '@tao/ui';

export type CodingLanguage = 'csharp' | 'java' | 'python' | 'typescript' | 'javascript';

interface MonacoLanguageConfig {
  id: CodingLanguage;
  monacoId: string;
  label: string;
  fileName: string;
  icon: string;
}

@Component({
  selector: 'tao-coding-workspace',
  standalone: true,
  imports: [TaoButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './coding-workspace.page.html',
  styleUrl: './coding-workspace.page.scss',
})
export class CodingWorkspacePage implements AfterViewInit, OnDestroy {
  @ViewChild('editorHost', { static: true })
  private readonly editorHost!: ElementRef<HTMLDivElement>;

  readonly store = inject(AssessmentSessionStore);
  readonly question = input.required<AssessmentQuestionDto>();
  readonly language = input<CodingLanguage>('csharp');
  readonly currentQuestionNumber = computed(() => this.store.currentQuestionNumber() ?? 1);
  readonly languageConfig = computed(() => this.getLanguageConfig(this.language()));

  /**
   * Formatted question HTML.
   *
   * We don't use ngx-markdown.
   */
  readonly formattedQuestion = computed(() => this.formatQuestion(this.question().primaryQuestion));

  /**
   * Emits actual source code.
   *
   * Do NOT JSON.stringify here.
   */
  readonly continue = output<string>();
  private editor?: Monaco.editor.IStandaloneCodeEditor;
  private model?: Monaco.editor.ITextModel;

  /**
   * Correct type for the Monaco namespace returned
   * by loader.init().
   */
  private monaco?: typeof import('monaco-editor');
  private saveTimer?: ReturnType<typeof setTimeout>;
  private currentQuestionId?: string;
  private viewInitialized = false;

  constructor() {
    /**
     * Detect question changes.
     *
     * When Question 1 -> Question 2 happens,
     * clear the existing Monaco editor.
     */
    effect(() => {
      const question = this.question();

      const questionId = question.questionId;

      if (!this.viewInitialized) {
        this.currentQuestionId = questionId;
        return;
      }

      if (this.currentQuestionId && this.currentQuestionId !== questionId) {
        this.currentQuestionId = questionId;

        this.resetEditor();
      }
    });

    /**
     * Change Monaco language when the language input changes.
     */
    effect(() => {
      const language = this.language();

      if (!this.model || !this.monaco) {
        return;
      }

      const config = this.getLanguageConfig(language);
      this.monaco.editor.setModelLanguage(this.model, config.monacoId);
    });
  }

  async ngAfterViewInit(): Promise<void> {
    try {
      /**
       * loader.init() returns the Monaco namespace.
       */
      this.monaco = await loader.init();

      const config = this.languageConfig();

      /**
       * Always create a new question with
       * an empty editor.
       */
      this.model = this.monaco!.editor.createModel('', config.monacoId);

      this.editor = this.monaco!.editor.create(this.editorHost.nativeElement, {
        model: this.model,
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
        quickSuggestions: true,
        parameterHints: {
          enabled: true,
        },
      });

      this.viewInitialized = true;
      this.currentQuestionId = this.question().questionId;

      /**
       * Always start clean.
       */
      this.store.setCodingCode('');
      this.store.setCodingSaveState('saved');

      /**
       * Autosave candidate code locally in the store.
       */
      this.editor.onDidChangeModelContent(() => {
        if (!this.editor) {
          return;
        }

        const value = this.editor.getValue();
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
   * Reset Monaco when the question changes.
   */
  private resetEditor(): void {
    if (!this.editor || !this.model) {
      return;
    }

    /**
     * Clear existing content.
     */
    this.editor.setValue('');

    /**
     * Move cursor to beginning.
     */
    this.editor.setPosition({
      lineNumber: 1,
      column: 1,
    });

    /**
     * Reset scroll.
     */
    this.editor.setScrollPosition({
      scrollTop: 0,
      scrollLeft: 0,
    });

    /**
     * Clear undo history so previous question's
     * code cannot be recovered using Ctrl+Z.
     */
    this.editor.pushUndoStop();

    /**
     * Reset store.
     */
    this.store.setCodingCode('');
    this.store.setCodingSaveState('saved');
  }

  /**
   * Continue to next question.
   *
   * Emits the actual source code, not a JSON string.
   */
  next(): void {
    if (!this.editor) {
      return;
    }

    const code = this.editor.getValue();

    if (!code.trim()) {
      return;
    }

    this.continue.emit(code);
  }

  /**
   * Convert the assessment question into readable HTML.
   *
   * Supported syntax:
   *
   * ### Heading
   * **bold**
   * `inline code`
   * - bullet
   * 1. numbered item
   * ```csharp
   * code
   * ```
   */
  private formatQuestion(value: string): string {
    if (!value) {
      return '';
    }

    const escaped = this.escapeHtml(value);

    const lines = escaped.replace(/\r\n/g, '\n').split('\n');

    const html: string[] = [];

    let inCodeBlock = false;
    let codeLanguage = '';
    let codeLines: string[] = [];

    let inUnorderedList = false;
    let inOrderedList = false;

    const closeLists = () => {
      if (inUnorderedList) {
        html.push('</ul>');
        inUnorderedList = false;
      }

      if (inOrderedList) {
        html.push('</ol>');
        inOrderedList = false;
      }
    };

    const formatInline = (line: string): string => {
      return (
        line
          /**
           * Inline code first.
           */
          .replace(/`([^`]+)`/g, '<code>$1</code>')

          /**
           * Bold.
           */
          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      );
    };

    for (const line of lines) {
      const trimmed = line.trim();

      /**
       * Code block start/end.
       */
      if (trimmed.startsWith('```')) {
        if (!inCodeBlock) {
          closeLists();

          inCodeBlock = true;

          codeLanguage = trimmed.substring(3).trim();

          codeLines = [];

          continue;
        }

        inCodeBlock = false;

        const languageClass = codeLanguage ? ` language-${codeLanguage}` : '';

        html.push(
          `<pre class="question-code${languageClass}"><code>${codeLines.join('\n')}</code></pre>`,
        );

        codeLanguage = '';

        codeLines = [];

        continue;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        continue;
      }

      /**
       * Empty line.
       */
      if (!trimmed) {
        closeLists();

        html.push('<div class="question-spacer"></div>');

        continue;
      }

      /**
       * H1/H2/H3 headings.
       */
      if (trimmed.startsWith('### ')) {
        closeLists();

        html.push(`<h3>${formatInline(trimmed.substring(4))}</h3>`);

        continue;
      }

      if (trimmed.startsWith('## ')) {
        closeLists();

        html.push(`<h2>${formatInline(trimmed.substring(3))}</h2>`);

        continue;
      }

      if (trimmed.startsWith('# ')) {
        closeLists();

        html.push(`<h1>${formatInline(trimmed.substring(2))}</h1>`);

        continue;
      }

      /**
       * Unordered list.
       */
      const unorderedMatch = trimmed.match(/^[-*]\s+(.+)$/);

      if (unorderedMatch) {
        if (inOrderedList) {
          html.push('</ol>');
          inOrderedList = false;
        }

        if (!inUnorderedList) {
          html.push('<ul>');
          inUnorderedList = true;
        }

        html.push(`<li>${formatInline(unorderedMatch[1])}</li>`);

        continue;
      }

      /**
       * Ordered list.
       */
      const orderedMatch = trimmed.match(/^\d+\.\s+(.+)$/);

      if (orderedMatch) {
        if (inUnorderedList) {
          html.push('</ul>');
          inUnorderedList = false;
        }

        if (!inOrderedList) {
          html.push('<ol>');
          inOrderedList = true;
        }

        html.push(`<li>${formatInline(orderedMatch[1])}</li>`);

        continue;
      }

      /**
       * Normal paragraph.
       */
      closeLists();

      html.push(`<p>${formatInline(trimmed)}</p>`);
    }

    closeLists();

    if (inCodeBlock && codeLines.length) {
      html.push(`<pre class="question-code"><code>${codeLines.join('\n')}</code></pre>`);
    }

    return html.join('');
  }

  /**
   * Escape backend content before generating HTML.
   *
   * This is important because the question ultimately
   * goes through [innerHTML].
   */
  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private getLanguageConfig(language: CodingLanguage): MonacoLanguageConfig {
    const configs: Record<CodingLanguage, MonacoLanguageConfig> = {
      csharp: {
        id: 'csharp',
        monacoId: 'csharp',
        label: 'C#',
        fileName: 'Solution.cs',
        icon: 'C#',
      },

      java: {
        id: 'java',
        monacoId: 'java',
        label: 'Java',
        fileName: 'Solution.java',
        icon: 'Java',
      },

      python: {
        id: 'python',
        monacoId: 'python',
        label: 'Python',
        fileName: 'solution.py',
        icon: 'Py',
      },

      typescript: {
        id: 'typescript',
        monacoId: 'typescript',
        label: 'TypeScript',
        fileName: 'solution.ts',
        icon: 'TS',
      },

      javascript: {
        id: 'javascript',
        monacoId: 'javascript',
        label: 'JavaScript',
        fileName: 'solution.js',
        icon: 'JS',
      },
    };

    return configs[language];
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

    this.monaco = undefined;
  }
}
