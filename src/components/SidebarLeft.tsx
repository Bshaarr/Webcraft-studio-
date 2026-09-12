import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { Type, Square, Layout, MessageSquare, TextCursor, Image, Video, Sparkles, CreditCard, ShieldAlert } from 'lucide-react';

export const SidebarLeft: React.FC = () => {
  const { addComponent, activeLeftTab, setActiveLeftTab, loadTemplate } = useEditorStore();

  const componentsList = [
    { type: 'heading', name: 'العنوان', icon: Type },
    { type: 'paragraph', name: 'الفقرة', icon: MessageSquare },
    { type: 'button', name: 'الزر', icon: Square },
    { type: 'input', name: 'حقل إدخال', icon: TextCursor },
    { type: 'image', name: 'صورة', icon: Image },
    { type: 'logo', name: 'شعار', icon: ShieldAlert },
    { type: 'video', name: 'فيديو', icon: Video },
    { type: 'card', name: 'بطاقة', icon: CreditCard },
    { type: 'container', name: 'حاوية Box', icon: Layout },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full text-slate-300 select-none">
      <div className="flex border-b border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveLeftTab('components')}
          className={`flex-1 py-3 text-center border-b-2 ${
            activeLeftTab === 'components' ? 'border-sky-500 text-sky-400 bg-slate-800/40' : 'border-transparent hover:text-white'
          }`}
        >
          العناصر
        </button>
        <button
          onClick={() => setActiveLeftTab('templates')}
          className={`flex-1 py-3 text-center border-b-2 ${
            activeLeftTab === 'templates' ? 'border-sky-500 text-sky-400 bg-slate-800/40' : 'border-transparent hover:text-white'
          }`}
        >
          القوالب الجاهزة
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
                  onClick={() => addComponent(null, item.type)}
                  className="flex flex-col items-center justify-center p-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-sky-500/50 rounded-lg text-slate-300 hover:text-white transition group"
                >
                  <Icon size={20} className="mb-2 text-sky-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">{item.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {activeLeftTab === 'templates' && (
          <div className="flex flex-col gap-3">
            <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-lg">
              <div className="flex items-center gap-2 text-sky-400 font-semibold mb-1 text-sm">
                <Sparkles size={16} />
                <span>صفحة هبوط متكاملة</span>
              </div>
              <p className="text-xs text-slate-400 mb-3">قالب يحتوي على شعار، عنوان رئيسي، فقرة وزر تفاعلي.</p>
              <button
                onClick={() => loadTemplate('landing')}
                className="w-full bg-sky-600 hover:bg-sky-500 text-white text-xs py-2 rounded font-medium transition"
              >
                تطبيق القالب
              </button>
            </div>

            <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-lg">
              <div className="flex items-center gap-2 text-sky-400 font-semibold mb-1 text-sm">
                <Sparkles size={16} />
                <span>صفحة تعريفية شخصية</span>
              </div>
              <p className="text-xs text-slate-400 mb-3">قالب بروفايل شخصي للمطور مخصص للتنسيق السريع.</p>
              <button
                onClick={() => loadTemplate('portfolio')}
                className="w-full bg-sky-600 hover:bg-sky-500 text-white text-xs py-2 rounded font-medium transition"
              >
                تطبيق القالب
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
