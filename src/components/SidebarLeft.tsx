import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { Layers, Component, Plus, Trash2 } from 'lucide-react';
import { ComponentType } from '../types';

const availableComponents: Array<{ type: ComponentType; label: string }> = [
  { type: 'hero', label: 'Hero Section' },
  { type: 'container', label: 'Container Box' },
  { type: 'heading', label: 'Heading Title' },
  { type: 'paragraph', label: 'Paragraph' },
  { type: 'button', label: 'Button' },
  { type: 'input', label: 'Input Field' },
];

export const SidebarLeft: React.FC = () => {
  const { activeLeftTab, setActiveLeftTab, addComponent, currentProject, selectedComponentId, setSelectedComponent, deleteComponent } = useEditorStore();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-[calc(100vh-3.5rem)] text-slate-300">
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveLeftTab('components')}
          className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 ${
            activeLeftTab === 'components' ? 'border-sky-500 text-sky-400 bg-slate-800/50' : 'border-transparent hover:text-slate-100'
          }`}
        >
          <Component size={14} />
          Library
        </button>
        <button
          onClick={() => setActiveLeftTab('layers')}
          className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 ${
            activeLeftTab === 'layers' ? 'border-sky-500 text-sky-400 bg-slate-800/50' : 'border-transparent hover:text-slate-100'
          }`}
        >
          <Layers size={14} />
          Tree
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeLeftTab === 'components' && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Click to Add</p>
            {availableComponents.map((item) => (
              <button
                key={item.type}
                onClick={() => addComponent(selectedComponentId, item.type)}
                className="w-full flex items-center justify-between p-2.5 rounded bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 text-sm text-left transition group"
              >
                <span>{item.label}</span>
                <Plus size={14} className="text-slate-500 group-hover:text-sky-400" />
              </button>
            ))}
          </div>
        )}

        {activeLeftTab === 'layers' && (
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Structure Hierarchy</p>
            {currentProject?.pages[0]?.components.map(c => (
              <div 
                key={c.id} 
                onClick={() => setSelectedComponent(c.id)}
                className={`flex items-center justify-between p-2 rounded text-xs cursor-pointer ${
                  selectedComponentId === c.id ? 'bg-sky-600/20 border border-sky-500/50 text-sky-300' : 'hover:bg-slate-800'
                }`}
              >
                <span>{c.name}</span>
                <button onClick={(e) => { e.stopPropagation(); deleteComponent(c.id); }} className="hover:text-red-400">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
