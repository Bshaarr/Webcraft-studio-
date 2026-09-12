import React, { useState } from 'react';
import { Dashboard } from './pages/Dashboard';
import { Editor } from './pages/Editor';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'editor'>('dashboard');

  return (
    <div className="w-full h-full">
      {currentScreen === 'dashboard' ? (
        <Dashboard onOpenProject={() => setCurrentScreen('editor')} />
      ) : (
        <Editor onNavigateHome={() => setCurrentScreen('dashboard')} />
      )}
    </div>
  );
};

export default App;
