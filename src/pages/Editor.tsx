import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { Navbar } from '../components/Navbar';
import { SidebarLeft } from '../components/SidebarLeft';
import { SidebarRight } from '../components/SidebarRight';
import { Canvas } from '../components/Canvas';

export const Editor: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const { isPreviewMode } = useEditorStore();

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <Navbar onNavigateHome={onNavigateHome} />

      <div className="flex flex-1 overflow-hidden">
        {!isPreviewMode && <SidebarLeft />}
        
        <main className="flex-1 bg-slate-900/50 p-6 overflow-auto flex items-center justify-center">
          <Canvas />
        </main>

        {!isPreviewMode && <SidebarRight />}
      </div>
    </div>
  );
};
