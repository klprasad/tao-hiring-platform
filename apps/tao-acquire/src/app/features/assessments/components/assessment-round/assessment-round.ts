import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';

import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';

import {
  AssessmentRoundVm,
  AssessmentDifficulty,
  AssessmentPriority,
  AssessmentCompetencyVm,
} from '../../models/assessment-strategy.models';
import { TaoButtonComponent, TaoInputComponent, TaoSelectComponent } from '@tao/ui';
type CompetencyForm = FormGroup<{
  name: FormControl<string>;
  priority: FormControl<AssessmentPriority>;
  minimumPassPercentage: FormControl<number>;
}>;

type RoundForm = FormGroup<{
  displayType: FormControl<string>;
  difficulty: FormControl<AssessmentDifficulty>;
  durationInMinutes: FormControl<number>;
  targetQuestionCount: FormControl<number>;
  competencies: FormArray<CompetencyForm>;
}>;
@Component({
  selector: 'tao-assessment-round',
  imports: [
    MatIconModule,
    ReactiveFormsModule,
    TaoButtonComponent,
    TaoInputComponent,
    TaoSelectComponent,
  ],
  templateUrl: './assessment-round.html',
  styleUrl: './assessment-round.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssessmentRound {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly round = input.required<AssessmentRoundVm>();

  /**
   * Whether this round is currently being edited.
   */
  readonly editing = input(false);

  /**
   * Raised when user clicks Edit.
   */
  readonly edit = output<number>();

  /**
   * Raised when user saves the round.
   */
  readonly save = output<AssessmentRoundVm>();

  /**
   * Raised when user cancels editing.
   */
  readonly cancel = output<number>();

  readonly difficulties: AssessmentDifficulty[] = ['Easy', 'Medium', 'Hard'];

  readonly priorities: AssessmentPriority[] = ['Low', 'Medium', 'High'];

  readonly roundForm = this.fb.group({
    displayType: this.fb.control('', Validators.required),
    difficulty: this.fb.control<AssessmentDifficulty>('Medium', Validators.required),
    durationInMinutes: this.fb.control(0, [
      Validators.required,
      Validators.min(1),
      Validators.max(480),
    ]),
    targetQuestionCount: this.fb.control(0, [
      Validators.required,
      Validators.min(1),
      Validators.max(100),
    ]),
    competencies: this.fb.array<CompetencyForm>([]),
  });

  readonly competencies = computed(() => this.roundForm.controls.competencies);

  constructor() {
    effect(() => {
      if (this.editing()) {
        this.loadRound(this.round());
      }
    });
  }

  get competencyForms(): FormArray<CompetencyForm> {
    return this.roundForm.controls.competencies;
  }

  private loadRound(round: AssessmentRoundVm): void {
    this.roundForm.patchValue({
      displayType: round.type,
      difficulty: round.difficulty,
      durationInMinutes: round.durationInMinutes,
      targetQuestionCount: round.targetQuestionCount,
    });

    this.competencyForms.clear();

    for (const competency of round.competencies) {
      this.competencyForms.push(this.createCompetencyForm(competency));
    }
  }

  private createCompetencyForm(competency?: AssessmentCompetencyVm): CompetencyForm {
    return this.fb.group({
      name: this.fb.control(competency?.name ?? '', Validators.required),

      priority: this.fb.control<AssessmentPriority>(
        competency?.priority ?? 'High',
        Validators.required,
      ),

      minimumPassPercentage: this.fb.control(competency?.minimumPassPercentage ?? 80, [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
      ]),
    });
  }

  addCompetency(): void {
    this.competencyForms.push(this.createCompetencyForm());
  }

  removeCompetency(index: number): void {
    this.competencyForms.removeAt(index);
  }
  onEdit(): void {
    this.loadRound(this.round());
    this.edit.emit(this.round().order);
  }

  onCancel(): void {
    this.cancel.emit(this.round().order);
  }

  onSave(): void {
    if (this.roundForm.invalid) {
      this.roundForm.markAllAsTouched();
      return;
    }

    const value = this.roundForm.getRawValue();

    const updatedRound: AssessmentRoundVm = {
      ...this.round(),

      type: value.displayType,

      difficulty: value.difficulty,

      durationInMinutes: value.durationInMinutes,

      targetQuestionCount: value.targetQuestionCount,

      competencies: value.competencies.map((competency) => ({
        name: competency.name,
        priority: competency.priority,
        minimumPassPercentage: competency.minimumPassPercentage,
      })),
    };

    this.save.emit(updatedRound);
  }
}
