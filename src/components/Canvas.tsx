import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { ComponentData } from '../types';

export const Canvas: React.FC = () => {
  const { currentProject, activePageId, viewMode, selectedComponentId, setSelectedComponent } = useEditorStore();
  const page = currentProject?.pages.find(p => p.id === activePageId);

  const getCanvasWidth = () => {
    switch (viewMode) {
      case 'tablet': return 'w-[768px]';
      case 'mobile': return 'w-[375px]';
      default: return 'w-full max-w-[1200px]';
    }
  };

  const renderRecursive = (comp: ComponentData) => {
    const isSelected = selectedComponentId === comp.id;

    const props = {
      id: comp.id,
      style: comp.styles as React.CSSProperties,
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedComponent(comp.id);
        
        // Execute dynamic visual events
        comp.events.forEach(ev => {
          if (ev.trigger === 'onClick' && ev.action === 'showAlert') {
            alert(ev.payload);
          }
        });
      },
      className: `relative transition-all ${
        isSelected ? 'outline outline-2 outline-sky-500 outline-offset-1 ring-2 ring-sky-500/20' : 'hover:outline hover:outline-1 hover:outline-slate-400'
      }`
    };

    const children = comp.children.map(renderRecursive);

    switch (comp.type) {
      case 'heading':
        return <h2 key={comp.id} {...props}>{comp.content || children}</h2>;
      case 'paragraph':
        return <p key={comp.id} {...props}>{comp.content || children}</p>;
      case 'button':
        return <button key={comp.id} {...props}>{comp.content || children}</button>;
      case 'input':
        return <input key={comp.id} {...props} defaultValue={comp.content} />;
      case 'hero':
      default:
        return <div key={comp.id} {...props}>{comp.content || children}</div>;
    }
  };

  return (
    <div className="flex-1 bg-slate-950 overflow-auto p-8 flex justify-center items-start">
      <div className={`${getCanvasWidth()} min-h-[600px] bg-white text-slate-900 shadow-2xl rounded-sm transition-all duration-300 p-4`}>
        {page?.components.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded p-12">
            Click on any library component on the left sidebar to start building.
          </div>
        ) : (
          page?.components.map(renderRecursive)
        )}
      </div>
    </div>
  );
};
