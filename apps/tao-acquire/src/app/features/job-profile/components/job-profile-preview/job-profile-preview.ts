import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { MatIconModule } from '@angular/material/icon';

import { TaoCardComponent } from '@tao/ui';
import { JobProfileVm } from '../../models/job-profile.vm';
import { JobProfileStatus } from '../../models/job-profile.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { JobProfileService } from '../../data-access/job-profile.service';

export interface JobProfileContent {
  jobTitle: string;
  experienceLevel: string;
  jobProfile: string;
  responsibilities: string[];
  requiredSkills: string[];
  goodToHave: string[];
  education: string[];
  experience: string;
  candidateProfile: string;

  employmentType?: string;
  location?: string;
  qualifications?: string[];
}

interface ParsedMarkdownBlock {
  type: 'h1' | 'h2' | 'h3' | 'paragraph' | 'ul' | 'ol' | 'spacer';

  content?: string;
  items?: string[];
}

@Component({
  selector: 'tao-job-profile-preview',
  standalone: true,
  imports: [MatIconModule, TaoCardComponent],
  templateUrl: './job-profile-preview.html',
  styleUrl: './job-profile-preview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobProfilePreviewComponent {
  private readonly route = inject(ActivatedRoute);
  readonly generatedContent = input<string>('');
  readonly errorMessage = signal('');
  readonly parsedGeneratedContent = computed<ParsedMarkdownBlock[]>(() =>
    this.parseMarkdown(this.generatedContent()),
  );
  readonly hasGeneratedContent = computed(() => this.parsedGeneratedContent().length > 0);
  readonly campaignId = this.resolveCampaignId();
  private resolveCampaignId(): string {
    return (
      this.route.snapshot.paramMap.get('campaignId') ??
      this.route.parent?.snapshot.paramMap.get('campaignId') ??
      this.route.snapshot.queryParamMap.get('campaignId') ??
      ''
    );
  }

  // ==============================================================
  // MARKDOWN PARSER
  // ==============================================================

  private parseMarkdown(markdown: string): ParsedMarkdownBlock[] {
    if (!markdown?.trim()) {
      return [];
    }

    const normalized = this.normalizeMarkdown(markdown);

    const lines = normalized.split('\n');

    const blocks: ParsedMarkdownBlock[] = [];

    let paragraphLines: string[] = [];
    let unorderedItems: string[] = [];
    let orderedItems: string[] = [];

    const flushParagraph = () => {
      if (!paragraphLines.length) {
        return;
      }

      const content = paragraphLines.join(' ').trim();

      if (content) {
        blocks.push({
          type: 'paragraph',
          content: this.parseInlineMarkdown(content),
        });
      }

      paragraphLines = [];
    };

    const flushUnorderedList = () => {
      if (!unorderedItems.length) {
        return;
      }

      blocks.push({
        type: 'ul',
        items: unorderedItems.map((item) => this.parseInlineMarkdown(item)),
      });

      unorderedItems = [];
    };

    const flushOrderedList = () => {
      if (!orderedItems.length) {
        return;
      }

      blocks.push({
        type: 'ol',
        items: orderedItems.map((item) => this.parseInlineMarkdown(item)),
      });

      orderedItems = [];
    };

    const flushLists = () => {
      flushUnorderedList();
      flushOrderedList();
    };

    for (const rawLine of lines) {
      const line = rawLine.trim();

      if (!line) {
        flushParagraph();
        flushLists();

        if (blocks.length && blocks.at(-1)?.type !== 'spacer') {
          blocks.push({
            type: 'spacer',
          });
        }

        continue;
      }

      const h3 = line.match(/^###\s+(.+)$/);

      if (h3) {
        flushParagraph();
        flushLists();

        blocks.push({
          type: 'h3',
          content: this.parseInlineMarkdown(h3[1]),
        });

        continue;
      }

      const h2 = line.match(/^##\s+(.+)$/);

      if (h2) {
        flushParagraph();
        flushLists();

        blocks.push({
          type: 'h2',
          content: this.parseInlineMarkdown(h2[1]),
        });

        continue;
      }

      const h1 = line.match(/^#\s+(.+)$/);

      if (h1) {
        flushParagraph();
        flushLists();

        blocks.push({
          type: 'h1',
          content: this.parseInlineMarkdown(h1[1]),
        });

        continue;
      }

      const unordered = line.match(/^[-*+•]\s+(.+)$/);

      if (unordered) {
        flushParagraph();
        flushOrderedList();

        unorderedItems.push(unordered[1]);

        continue;
      }

      const ordered = line.match(/^\d+[.)]\s+(.+)$/);

      if (ordered) {
        flushParagraph();
        flushUnorderedList();

        orderedItems.push(ordered[1]);

        continue;
      }

      if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
        flushParagraph();
        flushLists();

        blocks.push({
          type: 'spacer',
        });

        continue;
      }

      flushLists();

      paragraphLines.push(line);
    }

    flushParagraph();
    flushLists();

    return blocks.filter((block, index, array) => {
      if (block.type !== 'spacer') {
        return true;
      }

      return (
        index > 0 &&
        index < array.length - 1 &&
        array[index - 1].type !== 'spacer' &&
        array[index + 1].type !== 'spacer'
      );
    });
  }

  private normalizeMarkdown(value: string): string {
    return value
      .replace(/\\([#*_`\[\]])/g, '$1')
      .replace(/\u00a0/g, ' ')
      .replace(/\u202f/g, ' ')
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .trim();
  }

  private parseInlineMarkdown(value: string): string {
    let result = this.escapeHtml(value);

    result = result.replace(/`([^`]+)`/g, '<code>$1</code>');

    result = result.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    );

    result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    result = result.replace(/__(.+?)__/g, '<strong>$1</strong>');

    result = result.replace(/(^|[^\*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');

    result = result.replace(/(^|[^_])_([^_\n]+)_(?!_)/g, '$1<em>$2</em>');

    return result;
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
