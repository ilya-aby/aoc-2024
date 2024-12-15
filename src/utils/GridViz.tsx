export type GridCell = string | number | boolean | null | undefined;

type GridVizProps = {
  grid: GridCell[][];
  className?: string;
  showAxes?: boolean;
};

export const GridViz = ({ grid, className = '', showAxes = false }: GridVizProps) => {
  if (!grid) return null;
  const maxRowDigits = grid.length.toString().length;

  return (
    <div className={`overflow-x-auto whitespace-pre font-mono ${className}`}>
      {/* Column numbers header */}
      {showAxes && (
        <div className='px-1 text-gray-500'>
          {' '.repeat(maxRowDigits + 1)}
          {grid[0]?.map((_, i) => `${i.toString().padStart(0)} `).join('')}
        </div>
      )}

      <div className='flex'>
        {/* Row numbers column */}
        {showAxes && (
          <div className='text-gray-500'>
            {grid.map((_, i) => (
              <div key={i}>{i.toString().padStart(maxRowDigits)} </div>
            ))}
          </div>
        )}

        {/* Grid content */}
        <div className='border border-gray-400 px-1'>
          {grid.map((row, rowIndex) => (
            <div key={rowIndex}>
              {row
                .map((cell) =>
                  cell === true ? '■'
                  : cell === false ? '□'
                  : String(cell ?? ' '),
                )
                .join(' ')}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
