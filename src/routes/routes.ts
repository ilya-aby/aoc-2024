import D1 from '../pages/D1';
import D10 from '../pages/D10';
import D11 from '../pages/D11';
import D12 from '../pages/D12';
import D13 from '../pages/D13';
import D14 from '../pages/D14';
import D2 from '../pages/D2';
import D3 from '../pages/D3';
import D4 from '../pages/D4';
import D5 from '../pages/D5';
import D6 from '../pages/D6';
import D7 from '../pages/D7';
import D8 from '../pages/D8';
import D9 from '../pages/D9';
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
  { path: '/d9', label: 'Day 9', day: 9, component: D9, description: 'Disk Fragmenter' },
  { path: '/d10', label: 'Day 10', day: 10, component: D10, description: 'Hoof It' },
  { path: '/d11', label: 'Day 11', day: 11, component: D11, description: 'Plutonian Pebbles' },
  { path: '/d12', label: 'Day 12', day: 12, component: D12, description: 'Garden Groups' },
  { path: '/d13', label: 'Day 13', day: 13, component: D13, description: 'Claw Contraption' },
  { path: '/d14', label: 'Day 14', day: 14, component: D14, description: 'Tractor Beam' },
];
