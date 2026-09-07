import { formatStatus } from './format-status';

describe('formatStatus', () => {
  it('normalizes display status text for CSS classes', () => {
    expect(formatStatus('Needs Review')).toBe('needs-review');
    expect(formatStatus('  Active  ')).toBe('active');
  });
});
