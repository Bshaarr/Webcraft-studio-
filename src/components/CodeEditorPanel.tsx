import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { generateProjectHTML } from '../engine/generator';
import { Copy, Check } from 'lucide-react';

export const CodeEditorPanel: React.FC = () => {
  const { currentProject } = useEditorStore();
  const [copied, setCopied] = React.useState(false);

  const code = currentProject ? generateProjectHTML(currentProject) : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-t border-slate-800 text-xs">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800">
        <span className="font-mono text-sky-400">HTML / Tailwind Output</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          <span>{copied ? 'تم النسخ' : 'نسخ الكود'}</span>
        </button>
      </div>
      <div className="flex-1 p-4 overflow-auto font-mono text-slate-300 bg-slate-950/80 leading-relaxed dir-ltr text-left">
        <pre>{code}</pre>
      </div>
    </div>
  );
};
