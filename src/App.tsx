import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import D1 from './pages/D1';

function Home() {
  return <div>Home Page</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Parent Container */}
      <div className='min-h-screen bg-slate-900'>
        {/* Navigation Bar */}
        <Navigation />
        {/* Main Container */}
        <main className='ml-64 p-6 text-slate-100'>
          {/* Route Definitions */}
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/d1' element={<D1 />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
