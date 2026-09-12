import React, { useState } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { Plus, Folder, Trash2, Copy, Phone, Mail, Facebook, Code } from 'lucide-react';

export const Dashboard: React.FC<{ onOpenEditor: () => void }> = ({ onOpenEditor }) => {
  const { projects, createProject, selectProject, deleteProject, duplicateProject } = useEditorStore();
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const name = newProjectName.trim() || 'مشروع جديد';
    createProject(name);
    setNewProjectName('');
    onOpenEditor();
  };

  const handleOpen = (id: string) => {
    selectProject(id);
    onOpenEditor();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 flex flex-col justify-between">
      <div className="max-w-5xl mx-auto w-full">
        <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-sky-400 flex items-center gap-2">
              <Code size={28} /> WebCraft Studio
            </h1>
            <p className="text-slate-400 text-sm mt-1">منصة بناء وتصميم واجهات المواقع بدون كود</p>
          </div>
        </header>

        <form onSubmit={handleCreate} className="flex gap-3 mb-8">
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="اسم المشروع الجديد..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sky-500"
          />
          <button
            type="button"
            onClick={() => handleCreate()}
            className="bg-sky-600 hover:bg-sky-500 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 transition cursor-pointer"
          >
            <Plus size={18} />
            مشروع جديد
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-slate-900 border border-slate-800 rounded-lg p-5 hover:border-slate-700 transition relative group"
            >
              <div className="flex items-center gap-3 mb-3">
                <Folder className="text-sky-400" size={24} />
                <h3 className="font-semibold text-lg truncate">{proj.name}</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">تاريخ التعديل: {proj.updatedAt || 'اليوم'}</p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
                <button
                  onClick={() => handleOpen(proj.id)}
                  className="text-xs bg-sky-600/20 text-sky-400 hover:bg-sky-600/30 px-3 py-1.5 rounded font-medium"
                >
                  فتح المحرر
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => duplicateProject(proj.id)}
                    className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                    title="نسخ"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={() => deleteProject(proj.id)}
                    className="p-1.5 hover:bg-slate-800 rounded text-red-400 hover:text-red-300"
                    title="حذف"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* بطاقة المطور بشار عنيزان */}
      <footer className="max-w-5xl mx-auto w-full mt-12 pt-6 border-t border-slate-800/80 text-center text-slate-400 text-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div>
            <p className="text-slate-200 font-semibold text-sm">تم تطوير المنصة بواسطة المهندس <span className="text-sky-400">بشار عنيزان</span></p>
            <p className="text-slate-500 mt-0.5">مطور تطبيقات ومهندس حلول برمجية</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <a href="tel:0930971491" className="flex items-center gap-1.5 hover:text-sky-400 transition bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
              <Phone size={14} className="text-sky-400" />
              <span>0930971491</span>
            </a>
            <a href="mailto:bsharabomorad0@gmail.com" className="flex items-center gap-1.5 hover:text-sky-400 transition bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
              <Mail size={14} className="text-sky-400" />
              <span>bsharabomorad0@gmail.com</span>
            </a>
            <a href="https://www.facebook.com/share/1BRkWgTJ1T/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-sky-400 transition bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
              <Facebook size={14} className="text-sky-400" />
              <span>Facebook</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
