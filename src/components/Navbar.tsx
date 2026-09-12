import React from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { Monitor, Tablet, Smartphone, Eye, Home, Code, Phone, Facebook, Mail } from 'lucide-react';

export const Navbar: React.FC<{ onNavigateHome: () => void }> = ({ onNavigateHome }) => {
  const { currentProject, viewMode, setViewMode, isPreviewMode, setIsPreviewMode } = useEditorStore();

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 text-slate-300 select-none">
      <div className="flex items-center gap-4">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 hover:text-white bg-slate-800 px-3 py-1.5 rounded-md text-xs font-medium transition"
        >
          <Home size={16} />
          <span>المشاريع</span>
        </button>
        <span className="text-slate-700">|</span>
        <div className="flex items-center gap-2">
          <Code className="text-sky-400" size={18} />
          <h1 className="font-semibold text-white text-sm">{currentProject?.name || 'WebCraft Studio'}</h1>
        </div>
      </div>

      {/* معلن اسم المطور بشار عنيزان */}
      <div className="hidden lg:flex items-center gap-4 text-xs bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/60">
        <span className="text-slate-400">تطوير: <strong className="text-sky-400">بشار عنيزان</strong></span>
        <a href="tel:0930971491" className="flex items-center gap-1 hover:text-sky-400 transition" title="اتصال">
          <Phone size={12} /> 0930971491
        </a>
        <a href="mailto:bsharabomorad0@gmail.com" className="flex items-center gap-1 hover:text-sky-400 transition" title="البريد الإلكتروني">
          <Mail size={12} /> البريد
        </a>
        <a href="https://www.facebook.com/share/1BRkWgTJ1T/" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-sky-400 transition" title="فيسبوك">
          <Facebook size={12} /> فيسبوك
        </a>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('desktop')}
            className={`p-1.5 rounded ${viewMode === 'desktop' ? 'bg-sky-600 text-white' : 'hover:text-white'}`}
            title="عرض الحاسوب"
          >
            <Monitor size={16} />
          </button>
          <button
            onClick={() => setViewMode('tablet')}
            className={`p-1.5 rounded ${viewMode === 'tablet' ? 'bg-sky-600 text-white' : 'hover:text-white'}`}
            title="عرض اللوح الذكي"
          >
            <Tablet size={16} />
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`p-1.5 rounded ${viewMode === 'mobile' ? 'bg-sky-600 text-white' : 'hover:text-white'}`}
            title="عرض الهاتف"
          >
            <Smartphone size={16} />
          </button>
        </div>

        <button
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            isPreviewMode ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
        >
          <Eye size={16} />
          <span>{isPreviewMode ? 'إغلاق المعاينة' : 'معاينة المباشرة'}</span>
        </button>
      </div>
    </header>
  );
};
