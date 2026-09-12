import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { ComponentData } from '../types';
import { Box, Trash2, ChevronRight } from 'lucide-react';

export const LayersPanel: React.FC = () => {
  const { currentProject, activePageId, selectedComponentId, setSelectedComponent, deleteComponent } = useEditorStore();
  const page = currentProject?.pages.find(p => p.id === activePageId);

  const renderTree = (node: ComponentData, depth = 0) => {
    const isSelected = selectedComponentId === node.id;

    return (
      <div key={node.id} className="space-y-1">
        <div
          onClick={(e) => {
            e.stopPropagation();
            setSelectedComponent(node.id);
          }}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          className={`flex items-center justify-between py-1.5 pr-2 rounded text-xs cursor-pointer group transition ${
            isSelected ? 'bg-sky-600/20 text-sky-400 border border-sky-500/40' : 'hover:bg-slate-800 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-1.5 truncate">
            {node.children.length > 0 ? <ChevronRight size={12} className="text-slate-500" /> : <Box size={12} className="text-slate-500" />}
            <span className="truncate">{node.name}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteComponent(node.id);
            }}
            className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 p-1"
          >
            <Trash2 size={12} />
          </button>
        </div>

        {node.children.map(child => renderTree(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="p-3 space-y-1">
      <p className="text-[10px] uppercase font-bold text-slate-500 mb-3 tracking-wider">DOM Tree Structure</p>
      {page?.components.length === 0 ? (
        <p className="text-xs text-slate-500 text-center py-4">No elements in canvas</p>
      ) : (
        page?.components.map(comp => renderTree(comp))
      )}
    </div>
  );
};
