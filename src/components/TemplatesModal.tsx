import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { LayoutTemplate, X, Check } from 'lucide-react';

const availableTemplates = [
  { id: 'tpl-1', name: 'SaaS Landing Page', description: 'Clean layout with Hero, Features, and CTA.' },
  { id: 'tpl-2', name: 'Portfolio Minimal', description: 'Personal showcase with project cards.' },
  { id: 'tpl-3', name: 'Business Agency', description: 'Corporate template with service grids.' }
];

export const TemplatesModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { addComponent } = useEditorStore();

  if (!isOpen) return null;

  const handleApply = () => {
    addComponent(null, 'hero');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-sky-400 font-bold">
            <LayoutTemplate size={20} />
            <span>Choose a Starter Template</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {availableTemplates.map((tpl) => (
            <div
              key={tpl.id}
              onClick={handleApply}
              className="bg-slate-950 border border-slate-800 hover:border-sky-500/50 p-4 rounded-lg cursor-pointer transition flex flex-col justify-between space-y-3 group"
            >
              <div>
                <h4 className="font-semibold text-sm text-slate-200 group-hover:text-sky-400">{tpl.name}</h4>
                <p className="text-xs text-slate-400 mt-1">{tpl.description}</p>
              </div>

              <button className="w-full bg-slate-800 hover:bg-sky-600 text-xs py-1.5 rounded text-slate-300 hover:text-white font-medium flex items-center justify-center gap-1">
                <Check size={12} /> Use Template
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
