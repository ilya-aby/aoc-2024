import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
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

  const handleSkipBack = () => setCurrentFrame(0);
  const handleSkipForward = () => setCurrentFrame(frames.length - 1);

  return (
    <div className='relative w-full overflow-x-auto'>
      <div className='inline-flex min-w-fit flex-col'>
        <GridViz grid={frames[currentFrame]} className={className} showAxes={showAxes} />

        <div className='mt-2 w-full max-w-xl'>
          <input
            type='range'
            min={0}
            max={frames.length - 1}
            value={currentFrame}
            onChange={(e) => setCurrentFrame(Number(e.target.value))}
            className='h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700'
          />
        </div>

        <div className='flex w-full max-w-xl items-center justify-between'>
          <div className='flex items-center gap-2'>
            <button
              className='rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800'
              onClick={handleSkipBack}
            >
              <SkipBack className='h-8 w-8 rounded-full p-1 hover:bg-gray-100/20 hover:text-green-400' />
            </button>
            <button
              className='rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800'
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ?
                <Pause className='h-8 w-8 rounded-full p-1 hover:bg-gray-100/20 hover:text-green-400' />
              : <Play className='h-8 w-8 rounded-full p-1 hover:bg-gray-100/20 hover:text-green-400' />
              }
            </button>
            <button
              className='rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800'
              onClick={handleSkipForward}
            >
              <SkipForward className='h-8 w-8 rounded-full p-1 hover:bg-gray-100/20 hover:text-green-400' />
            </button>
          </div>

          <div className='text-sm tabular-nums text-gray-500 dark:text-gray-400'>
            {currentFrame + 1} / {frames.length}
          </div>
        </div>
      </div>
    </div>
  );
};
