import D1 from '../pages/D1';
import D2 from '../pages/D2';
import D3 from '../pages/D3';
import D4 from '../pages/D4';
import D5 from '../pages/D5';
import D6 from '../pages/D6';
import D7 from '../pages/D7';
import D8 from '../pages/D8';
import Home from '../pages/Home';

export type RouteConfig = {
  path: string;
  label: string;
  day: number;
  component: React.ComponentType<{ inputType: 'sample' | 'full' }>;
  description?: string;
};

export const routes: RouteConfig[] = [
  { path: '/', label: 'Home', day: 0, component: Home, description: 'Home' },
  { path: '/d1', label: 'Day 1', day: 1, component: D1, description: 'Historian Hysteria' },
  { path: '/d2', label: 'Day 2', day: 2, component: D2, description: 'Red-Nosed Reports' },
  { path: '/d3', label: 'Day 3', day: 3, component: D3, description: 'Mull It Over' },
  { path: '/d4', label: 'Day 4', day: 4, component: D4, description: 'Ceres Search' },
  { path: '/d5', label: 'Day 5', day: 5, component: D5, description: 'Print Queue' },
  { path: '/d6', label: 'Day 6', day: 6, component: D6, description: 'Guard Gallivant' },
  { path: '/d7', label: 'Day 7', day: 7, component: D7, description: 'Bridge Repair' },
  { path: '/d8', label: 'Day 8', day: 8, component: D8, description: 'Resonant Collinearity' },
];
