import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { Type, Square, Layout, MessageSquare, TextCursor } from 'lucide-react';

export const SidebarLeft: React.FC = () => {
  const { addComponent, activeLeftTab, setActiveLeftTab } = useEditorStore();

  const componentsList = [
    { type: 'heading', name: 'Heading', icon: Type },
    { type: 'paragraph', name: 'Paragraph', icon: MessageSquare },
    { type: 'button', name: 'Button', icon: Square },
    { type: 'input', name: 'Input Field', icon: TextCursor },
    { type: 'container', name: 'Container Box', icon: Layout },
  ];

  const handleAddComponent = (type: string) => {
    addComponent(null, type);
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full text-slate-300 select-none">
      <div className="flex border-b border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveLeftTab('components')}
          className={`flex-1 py-3 text-center border-b-2 ${
            activeLeftTab === 'components' ? 'border-sky-500 text-sky-400 bg-slate-800/40' : 'border-transparent hover:text-white'
          }`}
        >
          Components
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {activeLeftTab === 'components' && (
          <div className="grid grid-cols-2 gap-2">
            {componentsList.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.type}
                  onClick={() => handleAddComponent(item.type)}
                  className="flex flex-col items-center justify-center p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-sky-500/50 rounded-lg text-slate-300 hover:text-white transition group"
                >
                  <Icon size={20} className="mb-2 text-sky-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">{item.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};
