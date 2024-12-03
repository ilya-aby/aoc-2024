import { Link } from 'react-router-dom';
import { routes } from '../routes/routes';

export default function Navigation() {
  return (
    <nav className='fixed left-0 top-0 flex h-screen w-80 flex-col gap-1 bg-gray-900 p-4'>
      {/* Title */}
      <div>
        <h1 className='font-mono text-lg tracking-tighter text-lime-500 [text-shadow:0_0_1px_#84cc16,_0_0_1px_#84cc16]'>
          <span className='mr-1 text-yellow-300'>*</span>Advent of Code 2024
        </h1>
      </div>
      {/* Navigation Links */}
      <div className='mt-8 flex flex-col gap-1'>
        {routes.map((route) => (
          <Link
            key={route.path}
            to={route.path}
            className='rounded-lg px-4 py-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-200'
          >
            {route.label}
          </Link>
        ))}
      </div>
      {/* Footer */}
      <div className='mt-auto'>
        <a
          href='https://github.com/ilya-aby'
          target='_blank'
          rel='noopener noreferrer'
          className='mt-0 px-4 text-sm text-gray-400 transition-colors hover:text-gray-200'
        >
          @ilya-aby
        </a>
      </div>
    </nav>
  );
}
