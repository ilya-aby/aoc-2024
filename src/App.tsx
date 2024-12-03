import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ButtonGroup from './components/ButtonGroup';
import Navigation from './components/Navigation';
import { routes } from './routes/routes';

type InputType = 'sample' | 'full';

export default function App() {
  const [inputType, setInputType] = useState<InputType>('sample');

  return (
    <BrowserRouter>
      <div className='min-h-screen bg-gray-800'>
        {/* Navigation Bar */}
        <Navigation />
        {/* Main Container */}
        <main className='relative ml-80'>
          {/* Input Selector */}
          <div className='absolute right-4 top-8'>
            <ButtonGroup inputType={inputType} setInputType={setInputType} />
          </div>
          {/* Route Definitions */}
          <div className='p-8 text-gray-100'>
            <Routes>
              {routes.map(({ path, component: Component }) => (
                <Route key={path} path={path} element={<Component inputType={inputType} />} />
              ))}
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}
