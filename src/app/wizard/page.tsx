"use client";

import { WizardLayout } from '@/components/wizard/WizardLayout';
import { PipelineRail } from '@/components/pipeline/PipelineRail';

export default function WizardIntroPage() {
  return (
    <WizardLayout
      currentStep={0}
      totalSteps={7}
      stepTitle="Build your prospect automation"
      stepDescription="In a few minutes, we'll configure your outbound campaign with the 9-node pipeline."
      onNext={() => {}}
      nextLabel="Start"
    >
      <div className="space-y-8">
        {/* 9-Node Pipeline Preview */}
        <div className="bg-slate-50 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4 text-center">
            Your pipeline architecture
          </h3>
          <PipelineRail activeNodes={[1, 2, 3, 4, 5, 6, 7, 8, 9]} size="sm" />
        </div>

        {/* What to expect */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-800">What we'll configure:</h3>
          
          <div className="grid gap-3">
            <StepItem number={1} title="Company basics" desc="What you do and who you help" />
            <StepItem number={2} title="Target audience" desc="ICP, persona, and buying signals" />
            <StepItem number={3} title="Tool stack" desc="Lead source → CRM → email sequencer" />
            <StepItem number={4} title="Campaign settings" desc="Trigger type and approval policy" />
            <StepItem number={0} title="Review & compile" desc="Generate your workflow" highlight />
          </div>
        </div>

        {/* Time estimate */}
        <div className="flex items-center gap-3 text-sm text-slate-500 bg-blue-50 p-4 rounded-lg">
          <span className="text-xl">⏱️</span>
          <span>Takes about 5-7 minutes. You can save and resume anytime.</span>
        </div>
      </div>
    </WizardLayout>
  );
}

function StepItem({ 
  number, 
  title, 
  desc, 
  highlight 
}: { 
  number: number; 
  title: string; 
  desc: string;
  highlight?: boolean;
}) {
  return (
    <div className={`flex items-center gap-4 p-3 rounded-lg ${highlight ? 'bg-brand-50 border border-brand-200' : ''}`}>
      {number > 0 ? (
        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">
          {number}
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-sm font-bold text-white">
          ✓
        </div>
      )}
      <div>
        <p className="font-medium text-slate-800">{title}</p>
        <p className="text-sm text-slate-500">{desc}</p>
      </div>
    </div>
  );
}
