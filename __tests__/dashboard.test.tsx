// Import jest-dom matchers for toBeInTheDocument
import '@testing-library/jest-dom';

import { describe, it, expect } from '@jest/globals';

describe('QE Dashboard', () => {
  it('should pass basic test', () => {
    expect(true).toBe(true);
  });

  it('should have correct environment setup', () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });

  it('should export Dashboard component', async () => {
    const Dashboard = await import('../src/app/dashboard/page');
    expect(Dashboard.default).toBeDefined();
  });
});
