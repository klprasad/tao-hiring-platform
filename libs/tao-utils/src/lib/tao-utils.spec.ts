import { formatStatus } from './format-status';
import { TaoValidators } from './validators';

describe('formatStatus', () => {
  it('normalizes display status text for CSS classes', () => {
    expect(formatStatus('Needs Review')).toBe('needs-review');
    expect(formatStatus('  Active  ')).toBe('active');
  });

  it('validates alphabetic values', () => {
    const validator = TaoValidators.alphabetic();

    expect(validator({ value: 'TAO' } as never)).toBeNull();
    expect(validator({ value: 'TAO 22' } as never)).toEqual({
      pattern: { actualValue: 'TAO 22', requiredPattern: '/^[A-Za-z]+$/' },
    });
  });

  it('validates numbers, alphanumeric values, and email addresses', () => {
    expect(TaoValidators.numeric()({ value: '123' } as never)).toBeNull();
    expect(TaoValidators.alphanumeric()({ value: 'TAO22' } as never)).toBeNull();
    expect(TaoValidators.email()({ value: 'candidate@example.com' } as never)).toBeNull();
    expect(TaoValidators.email()({ value: 'not-an-email' } as never)).toEqual({
      pattern: { actualValue: 'not-an-email', requiredPattern: '/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/' },
    });
  });
});
