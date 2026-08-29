'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface WizardLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  stepDescription?: string;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  showProgress?: boolean;
}

export function WizardLayout({
  children,
  currentStep,
  totalSteps,
  stepTitle,
  stepDescription,
  onBack,
  onNext,
  nextLabel = 'Continue',
  nextDisabled = false,
  showProgress = true,
}: WizardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ChevronLeft size={20} />
            <span className="font-medium">Exit wizard</span>
          </Link>
          
          {showProgress && (
            <div className="flex items-center gap-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-2 w-8 rounded-full transition-colors',
                    i < currentStep ? 'bg-brand-600' : 'bg-slate-200'
                  )}
                />
              ))}
            </div>
          )}
          
          <div className="w-24" /> {/* Spacer for balance */}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{stepTitle}</h1>
          {stepDescription && (
            <p className="text-lg text-slate-600">{stepDescription}</p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          {children}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {onBack ? (
            <button
              onClick={onBack}
              className="px-6 py-3 text-slate-600 font-medium hover:text-slate-900"
            >
              Back
            </button>
          ) : (
            <div />
          )}
          
          {onNext && (
            <button
              onClick={onNext}
              disabled={nextDisabled}
              className={cn(
                'px-8 py-3 rounded-xl font-semibold transition-all',
                nextDisabled
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-600/20'
              )}
            >
              {nextLabel}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
