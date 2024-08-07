import { ChartData, ChartOptions } from 'chart.js';

export interface ChartProps {
  data: ChartData<'line' | 'bar' | 'doughnut'>;
  options?: ChartOptions<'line' | 'bar' | 'doughnut'>;
  title: string;
}

