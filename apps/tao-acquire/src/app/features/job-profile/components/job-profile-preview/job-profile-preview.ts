import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';

import { TaoCardComponent } from '@tao/ui';

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
  readonly originalJobDescription = input.required<string>();

  readonly generatedContent = input<string>('');

  readonly jobProfile = computed<JobProfileContent | null>(() =>
    this.parseJobDescription(this.originalJobDescription()),
  );

  readonly parsedGeneratedContent = computed<ParsedMarkdownBlock[]>(() =>
    this.parseMarkdown(this.generatedContent()),
  );

  readonly hasGeneratedContent = computed(() => this.parsedGeneratedContent().length > 0);

  readonly hasResponsibilities = computed(
    () => (this.jobProfile()?.responsibilities?.length ?? 0) > 0,
  );

  readonly hasRequiredSkills = computed(() => (this.jobProfile()?.requiredSkills?.length ?? 0) > 0);

  readonly hasGoodToHave = computed(() => (this.jobProfile()?.goodToHave?.length ?? 0) > 0);

  readonly hasEducation = computed(() => (this.jobProfile()?.education?.length ?? 0) > 0);

  readonly hasQualifications = computed(() => (this.jobProfile()?.qualifications?.length ?? 0) > 0);

  readonly hasExperience = computed(() => !!this.jobProfile()?.experience);

  readonly hasEmploymentType = computed(() => !!this.jobProfile()?.employmentType);

  readonly hasLocation = computed(() => !!this.jobProfile()?.location);

  // ==============================================================
  // JOB DESCRIPTION PARSING
  // ==============================================================

  private parseJobDescription(value: string): JobProfileContent | null {
    if (!value?.trim()) {
      return null;
    }

    const normalized = this.normalizeText(value);

    /*
     * First try structured JSON.
     */
    try {
      const parsed = JSON.parse(normalized);

      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return this.mapJsonJobProfile(parsed);
      }
    } catch {
      /*
       * Not JSON.
       *
       * Continue with plain text parser.
       */
    }

    return this.parsePlainTextJobDescription(normalized);
  }

  private mapJsonJobProfile(parsed: Record<string, unknown>): JobProfileContent {
    return {
      jobTitle: this.toString(parsed['jobTitle']),

      experienceLevel: this.toString(parsed['experienceLevel']),

      jobProfile: this.toString(parsed['jobProfile']),

      responsibilities: this.toStringArray(parsed['responsibilities']),

      requiredSkills: this.toStringArray(parsed['requiredSkills']),

      goodToHave: this.toStringArray(parsed['goodToHave']),

      education: this.toStringArray(parsed['education']),

      experience: this.toString(parsed['experience']),

      candidateProfile: this.toString(parsed['candidateProfile']),

      employmentType: this.toString(parsed['employmentType']),

      location: this.toString(parsed['location']),

      qualifications: this.toStringArray(parsed['qualifications']),
    };
  }

  // ==============================================================
  // PLAIN TEXT JOB DESCRIPTION
  // ==============================================================

  private parsePlainTextJobDescription(value: string): JobProfileContent {
    /*
     * Fix cases such as:
     *
     * Senior .NET Developer  About the Role
     */
    const prepared = value.replace(/^(.+?)\s+About the Role\b/i, '$1\n\nAbout the Role');

    const lines = prepared
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (!lines.length) {
      return this.emptyJobProfile();
    }

    const jobTitle = this.cleanText(lines[0]);

    const sections = this.extractSections(lines);

    const aboutRole = this.getSection(sections, [
      'About the Role',
      'About Role',
      'Job Profile',
      'Role Summary',
      'Summary',
    ]);

    const responsibilities = this.getSection(sections, [
      'Key Responsibilities',
      'Responsibilities',
      'Roles and Responsibilities',
    ]);

    const requiredSkills = this.getSection(sections, [
      'Required Skills',
      'Required Skill',
      'Essential Skills',
    ]);

    const preferredSkills = this.getSection(sections, [
      'Preferred Skills',
      'Preferred Skill',
      'Good to Have',
      'Good-to-Have',
    ]);

    const qualifications = this.getSection(sections, [
      'Qualifications',
      'Education',
      'Educational Qualifications',
    ]);

    const experience = this.getSection(sections, ['Experience', 'Required Experience']);

    const niceToHave = this.getSection(sections, ['Nice to Have', 'Nice-to-Have']);

    const employmentType = this.getSection(sections, ['Employment Type']);

    const location = this.getSection(sections, ['Location']);

    const candidateProfile = this.getSection(sections, [
      'Candidate Profile',
      'Ideal Candidate',
      'Candidate Requirements',
    ]);

    const preferred = [...this.toList(preferredSkills), ...this.toList(niceToHave)];

    return {
      jobTitle,

      experienceLevel: this.detectExperienceLevel(experience, jobTitle),

      jobProfile: this.joinSection(aboutRole),

      responsibilities: this.toList(responsibilities),

      requiredSkills: this.toList(requiredSkills),

      goodToHave: preferred,

      education: this.toList(qualifications),

      qualifications: this.toList(qualifications),

      experience: this.joinSection(experience),

      candidateProfile: this.joinSection(candidateProfile),

      employmentType: this.joinSection(employmentType),

      location: this.joinSection(location),
    };
  }

  private extractSections(lines: string[]): Map<string, string[]> {
    const sections = new Map<string, string[]>();

    let currentSection = '__INTRO__';

    sections.set(currentSection, []);

    for (const line of lines) {
      const sectionName = this.detectSectionName(line);

      if (sectionName) {
        currentSection = sectionName;

        if (!sections.has(currentSection)) {
          sections.set(currentSection, []);
        }

        continue;
      }

      sections.get(currentSection)!.push(line);
    }

    return sections;
  }

  private detectSectionName(line: string): string | null {
    const normalized = this.normalizeSectionName(line);

    const sections = [
      'about the role',
      'about role',
      'job profile',
      'role summary',
      'summary',

      'key responsibilities',
      'responsibilities',
      'roles and responsibilities',

      'required skills',
      'required skill',
      'essential skills',

      'preferred skills',
      'preferred skill',

      'good to have',
      'good-to-have',

      'qualifications',
      'education',
      'educational qualifications',

      'experience',
      'required experience',

      'nice to have',
      'nice-to-have',

      'candidate profile',
      'ideal candidate',
      'candidate requirements',

      'employment type',
      'location',
    ];

    return sections.find((section) => normalized === section) ?? null;
  }

  private getSection(sections: Map<string, string[]>, names: string[]): string[] {
    for (const name of names) {
      const key = this.normalizeSectionName(name);

      const section = sections.get(key);

      if (section) {
        return section;
      }
    }

    return [];
  }

  private normalizeSectionName(value: string): string {
    return value
      .replace(/[:#]+$/, '')
      .replace(/\u00a0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  private joinSection(lines: string[]): string {
    return lines
      .map((line) => this.cleanText(line))
      .filter(Boolean)
      .join(' ');
  }

  private toList(lines: string[]): string[] {
    if (!lines?.length) {
      return [];
    }

    const cleaned = lines
      .map((line) =>
        line
          .replace(/^[-*•]\s*/, '')
          .replace(/^\d+[.)]\s*/, '')
          .trim(),
      )
      .filter(Boolean);

    if (cleaned.length > 1) {
      return cleaned;
    }

    if (!cleaned.length) {
      return [];
    }

    return this.splitSentences(cleaned[0]);
  }

  private splitSentences(value: string): string[] {
    if (value.length < 120 || !value.includes('. ')) {
      return [value];
    }

    return value
      .split(/(?<=[.!?])\s+(?=[A-Z])/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  private detectExperienceLevel(experience: string[], jobTitle: string): string {
    const text = [jobTitle, ...experience].join(' ').toLowerCase();

    if (text.includes('fresher') || text.includes('entry level')) {
      return 'Fresher / Entry Level';
    }

    if (text.includes('5+') || text.includes('senior') || text.includes('lead')) {
      return 'Senior';
    }

    if (text.includes('3+') || text.includes('mid-level') || text.includes('mid level')) {
      return 'Mid Level';
    }

    return '';
  }

  private emptyJobProfile(): JobProfileContent {
    return {
      jobTitle: '',
      experienceLevel: '',
      jobProfile: '',
      responsibilities: [],
      requiredSkills: [],
      goodToHave: [],
      education: [],
      experience: '',
      candidateProfile: '',
      employmentType: '',
      location: '',
      qualifications: [],
    };
  }

  private toString(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
  }

  private toStringArray(value: unknown): string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .filter((item) => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  private normalizeText(value: string): string {
    return value
      .replace(/\u00a0/g, ' ')
      .replace(/\u202f/g, ' ')
      .replace(/\u2007/g, ' ')
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .trim();
  }

  private cleanText(value: string): string {
    return value
      .replace(/\u00a0/g, ' ')
      .replace(/\u202f/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
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
