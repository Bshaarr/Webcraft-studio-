import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { ComponentData } from '../types';

export const Canvas: React.FC = () => {
  const { currentProject, activePageId, selectedComponentId, setSelectedComponent } = useEditorStore();

  const activePage = currentProject?.pages.find(p => p.id === activePageId) || currentProject?.pages[0];
  const components = activePage?.components || [];

  const handleComponentClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedComponent(id);
  };

  const renderComponent = (comp: ComponentData) => {
    const isSelected = comp.id === selectedComponentId;
    const style: React.CSSProperties = { ...comp.styles } as any;

    const baseClasses = `relative transition-all cursor-pointer ${
      isSelected ? 'outline outline-2 outline-sky-500 outline-offset-2' : 'hover:outline hover:outline-1 hover:outline-sky-300'
    }`;

    const executeEvents = () => {
      comp.events?.forEach(ev => {
        if (ev.trigger === 'click' || (ev.trigger as string) === 'onClick') {
          if (ev.action === 'showAlert') alert(ev.payload);
          if (ev.action === 'openUrl') window.open(ev.payload, '_blank');
        }
      });
    };

    const handleClick = (e: React.MouseEvent) => {
      handleComponentClick(e, comp.id);
      executeEvents();
    };

    switch (comp.type) {
      case 'heading':
        return (
          <h2 key={comp.id} onClick={handleClick} style={style} className={baseClasses}>
            {comp.content || 'Heading'}
          </h2>
        );
      case 'paragraph':
        return (
          <p key={comp.id} onClick={handleClick} style={style} className={baseClasses}>
            {comp.content || 'Paragraph'}
          </p>
        );
      case 'button':
        return (
          <button key={comp.id} onClick={handleClick} style={style} className={baseClasses}>
            {comp.content || 'Button'}
          </button>
        );
      case 'input':
        return (
          <input
            key={comp.id}
            onClick={handleClick}
            style={style}
            className={baseClasses}
            placeholder={comp.content || 'Input...'}
            readOnly
          />
        );
      default:
        return (
          <div key={comp.id} onClick={handleClick} style={style} className={baseClasses}>
            {comp.content}
            {comp.children?.map(child => renderComponent(child))}
          </div>
        );
    }
  };

  return (
    <div
      className="w-full h-full min-h-[500px] bg-white rounded-lg shadow-sm p-6 overflow-auto"
      onClick={() => setSelectedComponent(null)}
    >
      {components.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg text-slate-400">
          <p>المساحة فارغة، أضف عناصر من القائمة الجانبية</p>
        </div>
      ) : (
        components.map(comp => renderComponent(comp))
      )}
    </div>
  );
};
