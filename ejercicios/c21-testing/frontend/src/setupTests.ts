import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
// Suma los matchers del DOM (toBeInTheDocument, toHaveTextContent...) al expect de Vitest.
import '@testing-library/jest-dom/vitest';

// Desmonta lo que renderizó cada test. Sin `globals: true` en Vitest, Testing
// Library no lo hace sola: los componentes se acumulan y un test ve el DOM del anterior.
afterEach(cleanup);
