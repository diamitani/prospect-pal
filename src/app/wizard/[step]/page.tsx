"use client";

import { WizardLayout } from '@/components/wizard/WizardLayout';
import { useState } from 'react';

export default function Step1Page() {
  const [answers, setAnswers] = useState({
    companyName: '',
    companyBackground: '',
    companyProduct: '',
  });

  const isValid = answers.companyName && answers.companyProduct;

  return (
    <WizardLayout
      currentStep={1}
      totalSteps={7}
      stepTitle="Tell us about your company"
      stepDescription="This helps us understand who we're crafting campaigns for."
      onBack={() => {}}
      onNext={() => {}}
      nextDisabled={!isValid}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Company name
          </label>
          <input
            type="text"
            value={answers.companyName}
            onChange={(e) => setAnswers({ ...answers, companyName: e.target.value })}
            placeholder="Acme Inc"
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            What does your company do?
          </label>
          <textarea
            value={answers.companyBackground}
            onChange={(e) => setAnswers({ ...answers, companyBackground: e.target.value })}
            placeholder="We help SaaS companies automate their customer onboarding..."
            rows={3}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            What specific outcome do you deliver?
          </label>
          <textarea
            value={answers.companyProduct}
            onChange={(e) => setAnswers({ ...answers, companyProduct: e.target.value })}
            placeholder="Reduce customer churn by 30% in 90 days"
            rows={2}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>
    </WizardLayout>
  );
}
