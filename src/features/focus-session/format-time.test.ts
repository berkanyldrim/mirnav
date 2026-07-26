import { formatClock } from '@/features/focus-session/format-time';

describe('formatClock', () => {
  it('formats zero seconds', () => {
    expect(formatClock(0)).toBe('00:00');
  });

  it('formats seconds under a minute', () => {
    expect(formatClock(59)).toBe('00:59');
  });

  it('formats full minutes', () => {
    expect(formatClock(25 * 60)).toBe('25:00');
  });

  it('formats durations above an hour as minutes', () => {
    expect(formatClock(180 * 60)).toBe('180:00');
  });

  it('clamps negative values to zero', () => {
    expect(formatClock(-5)).toBe('00:00');
  });
});
