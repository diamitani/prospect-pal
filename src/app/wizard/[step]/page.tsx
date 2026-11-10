"use client";

import { WizardLayout } from '@/components/wizard/WizardLayout';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const TOTAL = 5;

const STEPS: Record<number, { title: string; description: string }> = {
  1: {
    title: "Tell us about your company",
    description: "This helps us understand who we're crafting campaigns for.",
  },
  2: {
    title: "Who are you targeting?",
    description: "ICP, persona, and buying signals.",
  },
  3: {
    title: "Your tool stack",
    description: "Lead source → CRM → email sequencer.",
  },
  4: {
    title: "Campaign settings",
    description: "Trigger type and approval policy.",
  },
  5: {
    title: "Review",
    description: "Confirm the brief, then compile or start a prospecting run.",
  },
};

export default function WizardStepPage() {
  const params = useParams();
  const router = useRouter();
  const raw = Array.isArray(params.step) ? params.step[0] : params.step;
  const step = Number(raw);
  const valid = Number.isInteger(step) && step >= 1 && step <= TOTAL;
  const current = valid ? step : 1;

  const [answers, setAnswers] = useState({
    companyName: '',
    companyBackground: '',
    companyProduct: '',
    icp: '',
    persona: '',
    dataTool: '',
    crm: '',
    sequencer: '',
    trigger: 'search',
    approval: 'draft-only',
  });

  const meta = STEPS[current] ?? STEPS[1];

  function goNext() {
    if (current < TOTAL) {
      router.push(`/wizard/${current + 1}`);
    } else {
      router.push('/dashboard');
    }
  }

  function goBack() {
    if (current <= 1) router.push('/wizard');
    else router.push(`/wizard/${current - 1}`);
  }

  const canContinue =
    current === 1
      ? Boolean(answers.companyName && answers.companyProduct)
      : current === 2
        ? Boolean(answers.icp)
        : true;

  return (
    <WizardLayout
      currentStep={current}
      totalSteps={TOTAL}
      stepTitle={meta.title}
      stepDescription={meta.description}
      onBack={goBack}
      onNext={goNext}
      nextLabel={current === TOTAL ? 'Go to dashboard' : 'Continue'}
      nextDisabled={!canContinue}
    >
      <div className="space-y-6">
        {current === 1 && (
          <>
            <Field
              label="Company name"
              value={answers.companyName}
              onChange={(v) => setAnswers({ ...answers, companyName: v })}
              placeholder="Acme Inc"
            />
            <Area
              label="What does your company do?"
              value={answers.companyBackground}
              onChange={(v) => setAnswers({ ...answers, companyBackground: v })}
              placeholder="We help SaaS companies automate their customer onboarding..."
            />
            <Area
              label="What specific outcome do you deliver?"
              value={answers.companyProduct}
              onChange={(v) => setAnswers({ ...answers, companyProduct: v })}
              placeholder="Reduce customer churn by 30% in 90 days"
              rows={2}
            />
          </>
        )}
        {current === 2 && (
          <>
            <Area
              label="Ideal customer profile"
              value={answers.icp}
              onChange={(v) => setAnswers({ ...answers, icp: v })}
              placeholder="B2B SaaS, 50–500 employees, Series A+, US"
            />
            <Field
              label="Primary persona"
              value={answers.persona}
              onChange={(v) => setAnswers({ ...answers, persona: v })}
              placeholder="VP Sales, Head of RevOps"
            />
          </>
        )}
        {current === 3 && (
          <>
            <Field
              label="Lead source / data tool"
              value={answers.dataTool}
              onChange={(v) => setAnswers({ ...answers, dataTool: v })}
              placeholder="Free path (DuckDuckGo + X + MX) or Apollo / Clay"
            />
            <Field
              label="CRM"
              value={answers.crm}
              onChange={(v) => setAnswers({ ...answers, crm: v })}
              placeholder="HubSpot"
            />
            <Field
              label="Sequencer (optional)"
              value={answers.sequencer}
              onChange={(v) => setAnswers({ ...answers, sequencer: v })}
              placeholder="Smartlead / Instantly / drafts only"
            />
          </>
        )}
        {current === 4 && (
          <>
            <label className="block text-sm font-semibold text-slate-700">Trigger</label>
            <select
              className="w-full px-4 py-3 border border-slate-300 rounded-xl"
              value={answers.trigger}
              onChange={(e) => setAnswers({ ...answers, trigger: e.target.value })}
            >
              <option value="search">Daily search</option>
              <option value="csv">CSV / webhook</option>
            </select>
            <label className="block text-sm font-semibold text-slate-700">Approval policy</label>
            <select
              className="w-full px-4 py-3 border border-slate-300 rounded-xl"
              value={answers.approval}
              onChange={(e) => setAnswers({ ...answers, approval: e.target.value })}
            >
              <option value="draft-only">Draft only (never auto-send)</option>
              <option value="human">Human approval required</option>
            </select>
          </>
        )}
        {current === 5 && (
          <div className="text-sm text-slate-700 space-y-2">
            <p><strong>Company:</strong> {answers.companyName || '—'}</p>
            <p><strong>Offer:</strong> {answers.companyProduct || '—'}</p>
            <p><strong>ICP:</strong> {answers.icp || '—'}</p>
            <p><strong>Stack:</strong> {[answers.dataTool, answers.crm, answers.sequencer].filter(Boolean).join(' → ') || '—'}</p>
            <p><strong>Policy:</strong> {answers.approval}</p>
            <p className="text-slate-500 pt-2">
              Note: this wizard does not persist answers yet. Use the dashboard to start a prospecting run.
            </p>
          </div>
        )}
      </div>
    </WizardLayout>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
    </div>
  );
}

function Area({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
    </div>
  );
}
