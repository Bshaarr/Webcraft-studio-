import React, { useState } from 'react';
import { Dashboard } from './pages/Dashboard';
import { Editor } from './pages/Editor';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'editor'>('dashboard');

  return (
    <div className="w-full h-screen overflow-hidden bg-slate-950 text-slate-100">
      {currentPage === 'dashboard' ? (
        <Dashboard onOpenEditor={() => setCurrentPage('editor')} />
      ) : (
        <Editor onNavigateHome={() => setCurrentPage('dashboard')} />
      )}
    </div>
  );
};

export default App;
