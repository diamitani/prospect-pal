/**
 * Prospect PAL Pipeline Rail Component
 * Visual 9-node pipeline display
 */

'use client';

import { cn } from '@/lib/utils';
import { PIPELINE_STAGES } from '@/lib/pal/types';

interface PipelineRailProps {
  activeNodes?: number[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PipelineRail({ 
  activeNodes = [1,2,3,4,5,6,7,8,9], 
  size = 'md',
  className 
}: PipelineRailProps) {
  const row1 = PIPELINE_STAGES.slice(0, 5);
  const row2 = PIPELINE_STAGES.slice(5, 8);
  
  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <div className="flex items-center gap-2">
        {row1.map((stage, i) => (
          <div key={stage.id} className="flex items-center gap-2">
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white',
              activeNodes.includes(stage.number) ? `bg-${stage.color}-600` : 'bg-slate-200'
            )}>
              {stage.number}
            </div>
            {i < row1.length - 1 && <span className="text-slate-300">→</span>}
          </div>
        ))}
      </div>
      <div className="h-4 border-l-2 border-slate-300" />
      <div className="flex items-center gap-2">
        {[...row2].reverse().map((stage, i) => (
          <div key={stage.id} className="flex items-center gap-2">
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white',
              activeNodes.includes(stage.number) ? 'bg-brand-600' : 'bg-slate-200'
            )}>
              {stage.number}
            </div>
            {i < row2.length - 1 && <span className="text-slate-300">←</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
