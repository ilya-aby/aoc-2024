interface ButtonGroupProps {
  inputType: 'sample' | 'full';
  setInputType: (type: 'sample' | 'full') => void;
}

export default function ButtonGroup({ inputType, setInputType }: ButtonGroupProps) {
  return (
    <span className='isolate inline-flex rounded-md shadow-sm'>
      <button
        type='button'
        onClick={() => setInputType('sample')}
        className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-700 focus:z-10 ${
          inputType === 'sample' ?
            'bg-gray-900 text-gray-100 hover:bg-gray-800'
          : 'bg-gray-600 text-gray-900 hover:bg-gray-600'
        }`}
      >
        Sample
      </button>
      <button
        type='button'
        onClick={() => setInputType('full')}
        className={`relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-700 focus:z-10 ${
          inputType === 'full' ?
            'bg-gray-900 text-gray-100 hover:bg-gray-800'
          : 'bg-gray-600 text-gray-900 hover:bg-gray-600'
        }`}
      >
        Full
      </button>
    </span>
  );
}
