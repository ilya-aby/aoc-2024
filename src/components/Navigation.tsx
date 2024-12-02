import { Link } from 'react-router-dom';

export default function Navigation() {
  return (
    <nav className='fixed left-0 top-0 flex h-screen w-64 flex-col gap-4 bg-slate-800 p-6'>
      {/* Title */}
      <div>
        <h1 className='font-mono text-lg text-lime-500 [text-shadow:0_0_2px_#00cc00,_0_0_5px_#00cc00]'>
          Advent of Code 2024
        </h1>
        <a
          href='https://github.com/ilya-aby'
          target='_blank'
          rel='noopener noreferrer'
          className='mt-0 text-sm text-slate-400 transition-colors hover:text-slate-300'
        >
          @ilya-aby
        </a>
      </div>
      {/* Navigation Links */}
      <Link to='/' className='text-slate-100 transition-colors hover:text-slate-300'>
        Home
      </Link>
      <Link to='/d1' className='text-slate-100 transition-colors hover:text-slate-300'>
        Day 1
      </Link>
    </nav>
  );
}
