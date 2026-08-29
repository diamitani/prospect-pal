/**
 * Tool Picker Component
 * Select from preset tools or add custom
 */

'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ToolPickerProps {
  category: 'leadSource' | 'enrichment' | 'crm' | 'sequencer' | 'llm';
  selected: string;
  onSelect: (tool: string) => void;
  className?: string;
}

const categories: Record<string, { id: string; name: string }[]> = {
  leadSource: [
    { id: 'apollo', name: 'Apollo.io' },
    { id: 'linkedin', name: 'LinkedIn Sales Nav' },
    { id: 'csv', name: 'CSV Upload' },
    { id: 'hubspot_list', name: 'HubSpot List' },
  ],
  enrichment: [
    { id: 'clay', name: 'Clay' },
    { id: 'clearbit', name: 'Clearbit' },
    { id: 'none', name: 'No enrichment' },
  ],
  crm: [
    { id: 'hubspot', name: 'HubSpot' },
    { id: 'salesforce', name: 'Salesforce' },
    { id: 'pipedrive', name: 'Pipedrive' },
    { id: 'attio', name: 'Attio' },
  ],
  sequencer: [
    { id: 'smartlead', name: 'Smartlead' },
    { id: 'instantly', name: 'Instantly' },
    { id: 'lemlist', name: 'Lemlist' },
  ],
  llm: [
    { id: 'claude', name: 'Claude 3.5 Sonnet' },
    { id: 'gpt4', name: 'GPT-4o' },
  ],
};

const titles: Record<string, string> = {
  leadSource: 'Lead Source',
  enrichment: 'Enrichment',
  crm: 'CRM',
  sequencer: 'Email Sequencer',
  llm: 'AI Model',
};

export function ToolPicker({ category, selected, onSelect, className }: ToolPickerProps) {
  const options = categories[category] || [];
  const [custom, setCustom] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="font-semibold text-slate-700">{titles[category]}</h3>
      <div className="grid grid-cols-2 gap-3">
        {options.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onSelect(tool.id)}
            className={cn(
              'p-4 rounded-xl border-2 text-left transition-all',
              selected === tool.id
                ? 'border-brand-600 bg-brand-50'
                : 'border-slate-200 hover:border-brand-300'
            )}
          >
            {selected === tool.id && (
              <Check size={16} className="float-right text-brand-600" />
            )}
            <span className="font-medium text-slate-700">{tool.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
