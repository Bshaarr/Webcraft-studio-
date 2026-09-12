import React from 'react';
import { Navbar } from '../components/Navbar';
import { SidebarLeft } from '../components/SidebarLeft';
import { SidebarRight } from '../components/SidebarRight';
import { Canvas } from '../components/Canvas';
import { CodeEditorPanel } from '../components/CodeEditorPanel';
import { useEditorStore } from '../store/useEditorStore';

export const Editor: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const { activeBottomTab } = useEditorStore();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950">
      <Navbar onNavigateHome={onNavigateHome} />
      <div className="flex flex-1 overflow-hidden">
        <SidebarLeft />
        {activeBottomTab === 'visual' ? <Canvas /> : <CodeEditorPanel />}
        <SidebarRight />
      </div>
    </div>
  );
};
