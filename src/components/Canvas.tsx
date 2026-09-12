import React, { useState } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { ComponentData } from '../types';

export const Canvas: React.FC = () => {
  const { currentProject, activePageId, selectedComponentId, setSelectedComponent, updateComponent, viewMode, isPreviewMode } = useEditorStore();
  const [editingId, setEditingId] = useState<string | null>(null);

  const activePage = currentProject?.pages.find((p) => p.id === activePageId) || currentProject?.pages[0];
  const components = activePage?.components || [];

  const handleComponentClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!isPreviewMode) setSelectedComponent(id);
  };

  const handleDoubleClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!isPreviewMode) setEditingId(id);
  };

  const handleContentBlur = (id: string, newContent: string) => {
    setEditingId(null);
    updateComponent(id, { content: newContent });
  };

  const renderComponent = (comp: ComponentData) => {
    const isSelected = comp.id === selectedComponentId && !isPreviewMode;
    const isEditing = comp.id === editingId;
    const style: React.CSSProperties = { ...comp.styles } as any;

    const baseClasses = isPreviewMode
      ? ''
      : `relative transition-all cursor-pointer ${
          isSelected ? 'outline outline-2 outline-sky-500 outline-offset-2' : 'hover:outline hover:outline-1 hover:outline-sky-300'
        }`;

    const executeEvents = () => {
      if (!isPreviewMode) return;
      comp.events?.forEach((ev) => {
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
          <h2
            key={comp.id}
            onClick={handleClick}
            onDoubleClick={(e) => handleDoubleClick(e, comp.id)}
            style={style}
            className={baseClasses}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleContentBlur(comp.id, e.currentTarget.textContent || '')}
          >
            {comp.content || 'عنوان'}
          </h2>
        );

      case 'paragraph':
        return (
          <p
            key={comp.id}
            onClick={handleClick}
            onDoubleClick={(e) => handleDoubleClick(e, comp.id)}
            style={style}
            className={baseClasses}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleContentBlur(comp.id, e.currentTarget.textContent || '')}
          >
            {comp.content || 'فقرة نصية'}
          </p>
        );

      case 'button':
        return (
          <button
            key={comp.id}
            onClick={handleClick}
            onDoubleClick={(e) => handleDoubleClick(e, comp.id)}
            style={style}
            className={baseClasses}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleContentBlur(comp.id, e.currentTarget.textContent || '')}
          >
            {comp.content || 'زر'}
          </button>
        );

      case 'logo':
        return (
          <div
            key={comp.id}
            onClick={handleClick}
            onDoubleClick={(e) => handleDoubleClick(e, comp.id)}
            style={style}
            className={`font-bold flex items-center gap-2 ${baseClasses}`}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) => handleContentBlur(comp.id, e.currentTarget.textContent || '')}
          >
            <span>🛡️</span>
            <span>{comp.content || 'الشعار'}</span>
          </div>
        );

      case 'image':
        return (
          <img
            key={comp.id}
            onClick={handleClick}
            src={comp.src || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop'}
            alt={comp.content || 'صورة'}
            style={style}
            className={baseClasses}
          />
        );

      case 'video':
        return (
          <video key={comp.id} onClick={handleClick} controls style={style} className={baseClasses}>
            <source src={comp.src || 'https://www.w3schools.com/html/mov_bbb.mp4'} type="video/mp4" />
          </video>
        );

      case 'card':
        return (
          <div key={comp.id} onClick={handleClick} style={style} className={`p-4 border rounded-lg bg-white shadow-sm ${baseClasses}`}>
            <h3
              className="font-bold text-lg mb-2"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleContentBlur(comp.id, e.currentTarget.textContent || '')}
            >
              {comp.content || 'عنوان البطاقة'}
            </h3>
            <p className="text-sm text-slate-500">هذه بطاقة تفاعلية توفر إمكانية ترتيب العناصر بسهولة.</p>
          </div>
        );

      default:
        return (
          <div key={comp.id} onClick={handleClick} style={style} className={baseClasses}>
            {comp.content}
            {comp.children?.map((child) => renderComponent(child))}
          </div>
        );
    }
  };

  const getWidthClass = () => {
    if (viewMode === 'mobile') return 'max-w-[375px]';
    if (viewMode === 'tablet') return 'max-w-[768px]';
    return 'w-full';
  };

  return (
    <div
      className={`mx-auto transition-all duration-300 min-h-[600px] bg-white rounded-lg shadow-md p-8 overflow-auto ${getWidthClass()}`}
      onClick={() => setSelectedComponent(null)}
    >
      {components.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg text-slate-400">
          <p>المساحة فارغة، اضغط على الأزرار من القائمة الجانبية لإضافة عناصر أو اختر قالباً جاهزاً.</p>
        </div>
      ) : (
        components.map((comp) => renderComponent(comp))
      )}
    </div>
  );
};
