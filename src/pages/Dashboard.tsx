import React, { useState } from 'react';
import { useEditorStore } from '../store/useEditorStore';
import { Plus, Trash2, Copy, ExternalLink } from 'lucide-react';

export const Dashboard: React.FC<{ onOpenProject: () => void }> = ({ onOpenProject }) => {
  const { projects, createProject, selectProject, deleteProject, duplicateProject } = useEditorStore();
  const [name, setName] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createProject(name);
    setName('');
    onOpenProject();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-sky-400">WebCraft Studio</h1>
            <p className="text-slate-400 text-sm">Build Visually. Code Automatically.</p>
          </div>

          <form onSubmit={handleCreate} className="flex gap-2">
            <input
              type="text"
              placeholder="Project Name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-900 border border-slate-800 px-3 py-2 rounded text-sm focus:outline-none focus:border-sky-500"
            />
            <button type="submit" className="bg-sky-600 hover:bg-sky-500 px-4 py-2 rounded text-sm font-semibold flex items-center gap-1">
              <Plus size={16} /> New
            </button>
          </form>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((proj) => (
            <div key={proj.id} className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-4 hover:border-slate-700 transition">
              <div>
                <h3 className="font-semibold text-lg text-slate-100">{proj.name}</h3>
                <p className="text-xs text-slate-500">Updated: {proj.updatedAt}</p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
                <button
                  onClick={() => { selectProject(proj.id); onOpenProject(); }}
                  className="bg-sky-600/10 text-sky-400 hover:bg-sky-600 hover:text-white px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1 transition"
                >
                  <ExternalLink size={12} /> Open
                </button>

                <div className="flex gap-1">
                  <button onClick={() => duplicateProject(proj.id)} className="p-1.5 text-slate-400 hover:text-white">
                    <Copy size={14} />
                  </button>
                  <button onClick={() => deleteProject(proj.id)} className="p-1.5 text-slate-400 hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};
