import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { Trash2, Link as LinkIcon, Palette } from 'lucide-react';

export const SidebarRight: React.FC = () => {
  const { currentProject, activePageId, selectedComponentId, updateComponent, deleteComponent } = useEditorStore();

  const activePage = currentProject?.pages.find((p) => p.id === activePageId);

  const findComponent = (comps: any[], id: string): any => {
    for (const c of comps) {
      if (c.id === id) return c;
      if (c.children?.length) {
        const found = findComponent(c.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedComp = selectedComponentId ? findComponent(activePage?.components || [], selectedComponentId) : null;

  if (!selectedComp) {
    return (
      <aside className="w-72 bg-slate-900 border-l border-slate-800 p-4 text-slate-400 text-xs flex items-center justify-center text-center">
        حدد أي عنصر داخل مساحة العمل لتعديل الخصائص والألوان.
      </aside>
    );
  }

  return (
    <aside className="w-72 bg-slate-900 border-l border-slate-800 flex flex-col h-full text-slate-300 select-none text-xs">
      <div className="p-3 border-b border-slate-800 flex items-center justify-between font-semibold text-white">
        <span>خصائص: {selectedComp.name}</span>
        <button
          onClick={() => deleteComponent(selectedComp.id)}
          className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-slate-800"
          title="حذف العنصر"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        <div>
          <label className="block text-slate-400 mb-1">المحتوى / النص</label>
          <input
            type="text"
            value={selectedComp.content || ''}
            onChange={(e) => updateComponent(selectedComp.id, { content: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-white focus:outline-none focus:border-sky-500"
          />
        </div>

        {(selectedComp.type === 'image' || selectedComp.type === 'video') && (
          <div>
            <label className="block text-slate-400 mb-1 flex items-center gap-1">
              <LinkIcon size={12} /> رابط المصدر (URL)
            </label>
            <input
              type="text"
              value={selectedComp.src || ''}
              onChange={(e) => updateComponent(selectedComp.id, { src: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-white focus:outline-none focus:border-sky-500"
            />
          </div>
        )}

        <div className="border-t border-slate-800 pt-3">
          <label className="block text-slate-400 mb-2 font-semibold flex items-center gap-1">
            <Palette size={14} /> التنسيق والألوان
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-500 mb-1">لون النص</label>
              <input
                type="color"
                value={selectedComp.styles?.color || '#000000'}
                onChange={(e) => updateComponent(selectedComp.id, { styles: { color: e.target.value } })}
                className="w-full h-8 bg-slate-800 border border-slate-700 rounded cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">لون الخلفية</label>
              <input
                type="color"
                value={selectedComp.styles?.backgroundColor || '#ffffff'}
                onChange={(e) => updateComponent(selectedComp.id, { styles: { backgroundColor: e.target.value } })}
                className="w-full h-8 bg-slate-800 border border-slate-700 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-slate-400 mb-1">حجم الخط (px)</label>
          <input
            type="text"
            value={selectedComp.styles?.fontSize || ''}
            onChange={(e) => updateComponent(selectedComp.id, { styles: { fontSize: e.target.value } })}
            placeholder="مثال: 20px"
            className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-white focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>
    </aside>
  );
};
