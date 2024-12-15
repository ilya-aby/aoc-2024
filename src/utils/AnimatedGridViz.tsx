import { useEffect, useState } from 'react';
import { GridCell, GridViz } from './GridViz';

type AnimatedGridVizProps = {
  frames: GridCell[][][];
  speed?: number;
  playing?: boolean;
  className?: string;
  showAxes?: boolean;
  framesPerRender?: number;
};

export const AnimatedGridViz = ({
  frames,
  speed = 500,
  playing = true,
  className = '',
  showAxes = false,
  framesPerRender = 1,
}: AnimatedGridVizProps) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(playing);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + framesPerRender) % frames.length);
    }, speed);

    return () => clearInterval(interval);
  }, [frames.length, speed, isPlaying, framesPerRender]);

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-center gap-4'>
        <button
          className='transition-opacity hover:opacity-80'
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <div className='text-sm text-gray-400'>
          Frame {currentFrame + 1} of {frames.length}
        </div>
        <input
          type='range'
          min={0}
          max={frames.length - 1}
          value={currentFrame}
          onChange={(e) => setCurrentFrame(Number(e.target.value))}
          className='w-48'
        />
      </div>
      <GridViz grid={frames[currentFrame]} className={className} showAxes={showAxes} />
    </div>
  );
};
