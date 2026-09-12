import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { ComponentData } from '../types';
import { Trash2, Plus } from 'lucide-react';

export const SidebarRight: React.FC = () => {
  const { currentProject, activePageId, selectedComponentId, updateComponentStyle, updateComponentContent, addEventToComponent, deleteComponent } = useEditorStore();

  const findComponent = (components: ComponentData[], id: string): ComponentData | null => {
    for (const c of components) {
      if (c.id === id) return c;
      const found = findComponent(c.children, id);
      if (found) return found;
    }
    return null;
  };

  const activePage = currentProject?.pages.find(p => p.id === activePageId);
  const selectedComp = selectedComponentId && activePage ? findComponent(activePage.components, selectedComponentId) : null;

  if (!selectedComp) {
    return (
      <aside className="w-72 bg-slate-900 border-l border-slate-800 p-4 text-slate-500 text-xs text-center flex flex-col justify-center">
        Select any component from the Canvas or Tree to adjust settings.
      </aside>
    );
  }

  return (
    <aside className="w-72 bg-slate-900 border-l border-slate-800 p-4 text-slate-300 text-xs overflow-y-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="font-semibold text-slate-100">{selectedComp.name}</span>
        <button onClick={() => deleteComponent(selectedComp.id)} className="text-red-400 hover:text-red-300">
          <Trash2 size={14} />
        </button>
      </div>

      {/* Content Editor */}
      {selectedComp.content !== undefined && (
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-slate-500">Content Text</label>
          <input
            type="text"
            value={selectedComp.content}
            onChange={(e) => updateComponentContent(selectedComp.id, e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-white focus:outline-none focus:border-sky-500"
          />
        </div>
      )}

      {/* Styling Controls */}
      <div className="space-y-3">
        <p className="text-[10px] uppercase font-bold text-slate-500">Visual Styling</p>

        <div>
          <label className="text-slate-400 block mb-1">Background Color</label>
          <input
            type="color"
            value={selectedComp.styles.backgroundColor || '#ffffff'}
            onChange={(e) => updateComponentStyle(selectedComp.id, 'backgroundColor', e.target.value)}
            className="w-full bg-slate-800 h-8 rounded border border-slate-700 cursor-pointer"
          />
        </div>

        <div>
          <label className="text-slate-400 block mb-1">Text Color</label>
          <input
            type="color"
            value={selectedComp.styles.color || '#000000'}
            onChange={(e) => updateComponentStyle(selectedComp.id, 'color', e.target.value)}
            className="w-full bg-slate-800 h-8 rounded border border-slate-700 cursor-pointer"
          />
        </div>

        <div>
          <label className="text-slate-400 block mb-1">Font Size (px)</label>
          <input
            type="text"
            value={selectedComp.styles.fontSize || '16px'}
            onChange={(e) => updateComponentStyle(selectedComp.id, 'fontSize', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-white"
          />
        </div>

        <div>
          <label className="text-slate-400 block mb-1">Padding</label>
          <input
            type="text"
            value={selectedComp.styles.padding || '10px'}
            onChange={(e) => updateComponentStyle(selectedComp.id, 'padding', e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-white"
          />
        </div>
      </div>

      {/* Visual Events Manager */}
      <div className="space-y-2 border-t border-slate-800 pt-4">
        <p className="text-[10px] uppercase font-bold text-slate-500">Visual Events</p>
        <button
          onClick={() => addEventToComponent(selectedComp.id, { id: `ev-${Date.now()}`, trigger: 'onClick', action: 'showAlert', payload: 'Action Triggered!' })}
          className="w-full flex items-center justify-center gap-1 border border-slate-700 hover:bg-slate-800 p-1.5 rounded text-sky-400"
        >
          <Plus size={12} /> Add OnClick Alert
        </button>

        {selectedComp.events.map((ev) => (
          <div key={ev.id} className="bg-slate-800/80 p-2 rounded border border-slate-700/50">
            <span className="text-sky-400 font-mono">{ev.trigger}</span> → {ev.action} ("{ev.payload}")
          </div>
        ))}
      </div>
    </aside>
  );
};
