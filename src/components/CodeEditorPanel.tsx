import React from 'react';
import Editor from '@monaco-editor/react';
import { useEditorStore } from '../store/useEditorStore';
import { generateFullCode } from '../engine/generator';

export const CodeEditorPanel: React.FC = () => {
  const { currentProject } = useEditorStore();
  const code = generateFullCode(currentProject?.pages[0]?.components || []);

  return (
    <div className="flex-1 h-full bg-[#1e1e1e]">
      <Editor
        height="100%"
        defaultLanguage="html"
        theme="vs-dark"
        value={code}
        options={{
          readOnly: true,
          fontSize: 13,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
};
