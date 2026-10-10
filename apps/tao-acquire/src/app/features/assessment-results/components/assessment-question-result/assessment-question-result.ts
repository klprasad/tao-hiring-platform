import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { TaoButtonComponent, TaoCardComponent, TaoProgressComponent } from '@tao/ui';
import { AssessmentQuestionResult } from '../../models/assessment-result.models';

@Component({
  selector: 'tao-assessment-question-result',
  standalone: true,
  imports: [TaoCardComponent, TaoProgressComponent, TaoButtonComponent],
  templateUrl: './assessment-question-result.html',
  styleUrl: './assessment-question-result.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssessmentQuestionResultComponent {
  readonly result = input.required<AssessmentQuestionResult>();
  readonly roundType = input.required<string>();
  readonly responseRequested = output<void>();
  readonly formattedQuestion = computed(() => this.formatQuestion(this.result().primaryQuestion));
  isCodingRound(): boolean {
    return this.roundType().trim().toLowerCase().includes('coding');
  }

  canViewResponse(): boolean {
    return this.isCodingRound() ? this.result().hasCandidateCode : this.result().hasConversation;
  }

  trackCompetency(_: number, name: string): string {
    return name;
  }

  formatScore(value: number | null): string {
    return value === null ? 'Not scored' : `${value}%`;
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
  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
