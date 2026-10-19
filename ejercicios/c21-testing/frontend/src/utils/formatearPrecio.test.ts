import { describe, it, expect } from 'vitest';
import { formatearPrecio } from './formatearPrecio';

// Escrito con TDD: primero este test (rojo, el módulo no existía), después el
// mínimo para pasarlo, después el caso que rompe la trampa.
describe('formatearPrecio', () => {
  it('4500 → "$ 4.500"', () => {
    expect(formatearPrecio(4500)).toBe('$ 4.500');
  });

  it('1234567 → "$ 1.234.567" (separa los miles con punto)', () => {
    expect(formatearPrecio(1234567)).toBe('$ 1.234.567');
  });

  it('0 → "$ 0"', () => {
    expect(formatearPrecio(0)).toBe('$ 0');
  });
});
