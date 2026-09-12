import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { Navbar } from '../components/Navbar';
import { SidebarLeft } from '../components/SidebarLeft';
import { SidebarRight } from '../components/SidebarRight';
import { Canvas } from '../components/Canvas';
import { CodeEditorPanel } from '../components/CodeEditorPanel';

export const Editor: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const { isPreviewMode, showCodePanel } = useEditorStore();

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Navbar onNavigateHome={onNavigateHome} />

      <div className="flex flex-1 overflow-hidden relative">
        {!isPreviewMode && <SidebarLeft />}
        
        <main className="flex-1 bg-slate-900/50 p-6 overflow-auto flex flex-col items-center justify-between">
          <Canvas />
          {showCodePanel && (
            <div className="w-full h-64 mt-4 border-t border-slate-800 rounded-t-lg overflow-hidden shadow-2xl z-20">
              <CodeEditorPanel />
            </div>
          )}
        </main>

        {!isPreviewMode && <SidebarRight />}
      </div>
    </div>
  );
};
