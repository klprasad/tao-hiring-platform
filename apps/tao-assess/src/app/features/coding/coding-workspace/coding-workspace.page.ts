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
  model,
  output,
} from '@angular/core';

import loader from '@monaco-editor/loader';
import type * as Monaco from 'monaco-editor';
import { CODING_LANGUAGE_CONFIGS, getCodingLanguageConfig } from '@tao/utils';
import type { CodingLanguage } from '@tao/utils';

import { AssessmentService } from '../../../core/assessment.service';
import { AssessmentSessionStore } from '../../../core/assessment-session.store';
import { AssessmentQuestionDto } from '../../../models/assessment-session.model';
import { TaoButtonComponent, ToasterService } from '@tao/ui';

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
  private readonly assessmentService = inject(AssessmentService);
  readonly toaster = inject(ToasterService);
  readonly store = inject(AssessmentSessionStore);
  readonly question = input.required<AssessmentQuestionDto>();
  readonly language = model<CodingLanguage | null>(null);
  readonly availableLanguages = Object.values(CODING_LANGUAGE_CONFIGS);
  readonly currentQuestionNumber = computed(() => this.store.currentQuestionNumber() ?? 1);
  readonly languageConfig = computed(() => {
    const language = this.language();
    return language ? this.getLanguageConfig(language) : null;
  });
  readonly formattedQuestion = computed(() => this.formatQuestion(this.question().primaryQuestion));

  readonly continue = output<string>();
  readonly skip = output<boolean>();
  private editor?: Monaco.editor.IStandaloneCodeEditor;
  private model?: Monaco.editor.ITextModel;

  private monaco?: typeof import('monaco-editor');
  private currentQuestionId?: string;
  private viewInitialized = false;

  constructor() {
    effect(() => {
      const question = this.question();
      const questionId = question.questionId;
      if (!this.currentQuestionId) {
        this.currentQuestionId = questionId;
        return;
      }

      if (this.currentQuestionId !== questionId) {
        this.currentQuestionId = questionId;
        this.language.set(null);
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

      const languageId = language ? this.getLanguageConfig(language).monacoId : 'plaintext';
      this.monaco.editor.setModelLanguage(this.model, languageId);
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
      this.model = this.monaco!.editor.createModel('', config?.monacoId ?? 'plaintext');

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
       * Autosave candidate code locally in the store.
       */
      this.editor.onDidChangeModelContent(() => {
        if (!this.editor) {
          return;
        }
      });
    } catch (error) {
      this.toaster.error('Failed to initialize Monaco editor');
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
  }

  /**
   * Continue to next question.
   *
   * Emits the actual source code, not a JSON string.
   */
  next(): void {
    if (!this.editor || !this.language()) {
      return;
    }

    const code = this.editor.getValue();
    if (!code.trim()) {
      return;
    }
    this.continue.emit(code);
  }

  skipQuestion(): void {
    if (!this.editor) {
      return;
    }
    this.skip.emit(true);
  }

  selectLanguage(language: string): void {
    if (getCodingLanguageConfig(language)) {
      this.language.set(language as CodingLanguage);
      this.assessmentService
        .updateCodingLanguage(this.question().questionId, { language })
        .subscribe({
          error: () => this.toaster.error('Unable to update coding language.'),
        });
    }
  }

  onLanguageChange(event: Event): void {
    if (event.target instanceof HTMLSelectElement) {
      this.selectLanguage(event.target.value);
    }
  }

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

  private getLanguageConfig(language: CodingLanguage) {
    return getCodingLanguageConfig(language)!;
  }

  ngOnDestroy(): void {
    this.editor?.dispose();
    this.editor = undefined;

    this.model?.dispose();
    this.model = undefined;

    this.monaco = undefined;
  }
}
