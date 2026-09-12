import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { Monitor, Tablet, Smartphone, Undo, Redo, Save, Download, Play, Code } from 'lucide-react';
import JSZip from 'jszip';
import { generateFullCode } from '../engine/generator';

export const Navbar: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const { viewMode, setViewMode, currentProject, activeBottomTab, setActiveBottomTab, undo, redo } = useEditorStore();

  const handleExportZIP = () => {
    if (!currentProject) return;
    const zip = new JSZip();
    const htmlContent = generateFullCode(currentProject.pages[0]?.components || []);
    zip.file("index.html", htmlContent);
    
    zip.generateAsync({ type: "blob" }).then((content) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(content);
      a.download = `${currentProject.name.toLowerCase().replace(/\s+/g, '-')}.zip`;
      a.click();
    });
  };

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 text-white select-none">
      <div className="flex items-center gap-3">
        <button onClick={onNavigateHome} className="font-bold text-lg text-sky-400 hover:text-sky-300">
          WebCraft Studio
        </button>
        <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">v1.0.0</span>
      </div>

      {/* Viewport Control */}
      <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
        <button
          onClick={() => setViewMode('desktop')}
          className={`p-1.5 rounded ${viewMode === 'desktop' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}
          title="Desktop View"
        >
          <Monitor size={16} />
        </button>
        <button
          onClick={() => setViewMode('tablet')}
          className={`p-1.5 rounded ${viewMode === 'tablet' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}
          title="Tablet View"
        >
          <Tablet size={16} />
        </button>
        <button
          onClick={() => setViewMode('mobile')}
          className={`p-1.5 rounded ${viewMode === 'mobile' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'}`}
          title="Mobile View"
        >
          <Smartphone size={16} />
        </button>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        <button onClick={undo} className="p-1.5 hover:bg-slate-800 rounded text-slate-300">
          <Undo size={16} />
        </button>
        <button onClick={redo} className="p-1.5 hover:bg-slate-800 rounded text-slate-300">
          <Redo size={16} />
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        <button
          onClick={() => setActiveBottomTab(activeBottomTab === 'code' ? 'visual' : 'code')}
          className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded font-medium border ${
            activeBottomTab === 'code' ? 'border-sky-500 bg-sky-500/10 text-sky-400' : 'border-slate-700 hover:bg-slate-800'
          }`}
        >
          <Code size={14} />
          {activeBottomTab === 'code' ? 'Visual Mode' : 'Code Mode'}
        </button>

        <button
          onClick={handleExportZIP}
          className="flex items-center gap-1 text-xs bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded font-medium transition"
        >
          <Download size={14} />
          Export ZIP
        </button>
      </div>
    </header>
  );
};
