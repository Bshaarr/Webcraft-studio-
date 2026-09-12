import React, { useState } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { Sparkles, X, Loader2 } from 'lucide-react';

export const AIModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const { addComponent } = useEditorStore();

  if (!isOpen) return null;

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setLoading(true);

    setTimeout(() => {
      // AI Engine mockup transforming prompt into dynamic component hierarchy
      addComponent(null, 'hero');
      setLoading(false);
      onClose();
      setPrompt('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-400 font-bold">
            <Sparkles size={18} />
            <span>AI Website Builder</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Describe the website structure or section you want to generate (e.g., "A modern agency hero section with dark theme").
        </p>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="What do you want to build?"
          rows={4}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-sky-500 resize-none"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            Generate Section
          </button>
        </div>
      </div>
    </div>
  );
};
