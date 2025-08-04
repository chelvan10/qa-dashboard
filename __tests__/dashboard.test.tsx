import { render, screen } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import Dashboard from '../src/app/dashboard/page';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  getSession: jest.fn(() => Promise.resolve({
    user: { email: 'test@example.com', role: 'executive' }
  })),
}));

// Mock Chart.js
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="line-chart">Line Chart</div>,
  Doughnut: () => <div data-testid="doughnut-chart">Doughnut Chart</div>,
  Bar: () => <div data-testid="bar-chart">Bar Chart</div>,
}));

jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
  },
  CategoryScale: {},
  LinearScale: {},
  PointElement: {},
  LineElement: {},
  Title: {},
  Tooltip: {},
  Legend: {},
  ArcElement: {},
  BarElement: {},
}));

describe('QE Dashboard', () => {
  it('renders dashboard navigation', async () => {
    render(<Dashboard />);
    
    // Wait for component to load
    await screen.findByText('QE Dashboard');
    
    expect(screen.getByText('QE Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Executive')).toBeInTheDocument();
    expect(screen.getByText('Manager')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
  });

  it('displays executive KPIs', async () => {
    render(<Dashboard />);
    
    // Wait for executive dashboard to load
    await screen.findByText('Executive KPIs');
    
    expect(screen.getByText('Executive KPIs')).toBeInTheDocument();
    expect(screen.getByText('Trend Analysis')).toBeInTheDocument();
  });

  it('renders gauge charts for executive metrics', async () => {
    render(<Dashboard />);
    
    // Wait for charts to render
    await screen.findByText('Executive KPIs');
    
    const doughnutCharts = screen.getAllByTestId('doughnut-chart');
    expect(doughnutCharts.length).toBeGreaterThan(0);
  });
});
