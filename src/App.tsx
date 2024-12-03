import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import { routes } from './routes/routes';

export default function App() {
  return (
    <BrowserRouter>
      {/* Parent Container */}
      <div className='min-h-screen bg-gray-800'>
        {/* Navigation Bar */}
        <Navigation />
        {/* Main Container */}
        <main className='ml-80 p-4 text-gray-100'>
          {/* Route Definitions */}
          <Routes>
            {routes.map(({ path, component: Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
