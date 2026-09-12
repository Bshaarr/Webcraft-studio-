import { create } from 'zustand';
import { ComponentData, ProjectData, ViewMode, ActiveTab } from '../types';

interface EditorState {
  currentProject: ProjectData | null;
  selectedComponentId: string | null;
  viewMode: ViewMode;
  activeBottomTab: ActiveTab;
  history: ProjectData[];
  historyIndex: number;

  // Actions
  setProject: (project: ProjectData) => void;
  setSelectedComponentId: (id: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setActiveBottomTab: (tab: ActiveTab) => void;
  
  addComponent: (parentId: string | null, type: string) => void;
  updateComponent: (id: string, updates: Partial<ComponentData>) => void;
  deleteComponent: (id: string) => void;
  
  saveCurrentState: () => void;
  undo: () => void;
  redo: () => void;
}

const initialProject: ProjectData = {
  id: 'proj-1',
  name: 'My WebCraft Project',
  pages: [
    {
      id: 'page-1',
      name: 'Home Page',
      components: []
    }
  ]
};

export const useEditorStore = create<EditorState>((set, get) => ({
  currentProject: initialProject,
  selectedComponentId: null,
  viewMode: 'desktop',
  activeBottomTab: 'visual',
  activePageId: 'page-1',
  history: [initialProject],
  historyIndex: 0,

  setProject: (project) => set({ currentProject: project }),
  setSelectedComponentId: (id) => set({ selectedComponentId: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setActiveBottomTab: (tab) => set({ activeBottomTab: tab }),

  saveCurrentState: () => {
    const { currentProject, history, historyIndex } = get();
    if (!currentProject) return;

    const newHistory = history.slice(0, historyIndex + 1);
    set({
      history: [...newHistory, JSON.parse(JSON.stringify(currentProject))],
      historyIndex: newHistory.length
    });
  },

  addComponent: (parentId: string | null, type: string) => {
    const { currentProject } = get();
    if (!currentProject) return;

    const activePageId = currentProject.pages[0]?.id || 'page-1';

    const newComp: ComponentData = {
      id: `comp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: type as any,
      name: type.charAt(0).toUpperCase() + type.slice(1),
      styles: { 
        padding: '12px', 
        margin: '8px 0',
        backgroundColor: type === 'button' ? '#0284c7' : type === 'container' ? '#f8fafc' : 'transparent',
        color: type === 'button' ? '#ffffff' : '#0f172a',
        borderRadius: '6px',
        border: type === 'container' ? '1px solid #e2e8f0' : 'none'
      },
      attributes: {},
      events: [],
      children: [],
      content: type === 'button' ? 'New Button' : type === 'heading' ? 'New Heading' : type === 'paragraph' ? 'Sample Text Paragraph' : type === 'input' ? 'Placeholder Text' : ''
    };

    const updateRecursive = (list: ComponentData[]): ComponentData[] => {
      return list.map(item => {
        if (item.id === parentId) {
          return { ...item, children: [...item.children, newComp] };
        }
        if (item.children && item.children.length > 0) {
          return { ...item, children: updateRecursive(item.children) };
        }
        return item;
      });
    };

    const updatedPages = currentProject.pages.map(page => {
      if (page.id === activePageId) {
        if (!parentId) {
          return { ...page, components: [...page.components, newComp] };
        }
        return { ...page, components: updateRecursive(page.components) };
      }
      return page;
    });

    const updatedProj = { ...currentProject, pages: updatedPages };
    set({ currentProject: updatedProj, selectedComponentId: newComp.id });
    get().saveCurrentState();
  },

  updateComponent: (id: string, updates: Partial<ComponentData>) => {
    const { currentProject } = get();
    if (!currentProject) return;

    const updateRecursive = (list: ComponentData[]): ComponentData[] => {
      return list.map(item => {
        if (item.id === id) {
          return { ...item, ...updates };
        }
        if (item.children && item.children.length > 0) {
          return { ...item, children: updateRecursive(item.children) };
        }
        return item;
      });
    };

    const updatedPages = currentProject.pages.map(page => ({
      ...page,
      components: updateRecursive(page.components)
    }));

    set({ currentProject: { ...currentProject, pages: updatedPages } });
    get().saveCurrentState();
  },

  deleteComponent: (id: string) => {
    const { currentProject } = get();
    if (!currentProject) return;

    const deleteRecursive = (list: ComponentData[]): ComponentData[] => {
      return list
        .filter(item => item.id !== id)
        .map(item => ({
          ...item,
          children: item.children ? deleteRecursive(item.children) : []
        }));
    };

    const updatedPages = currentProject.pages.map(page => ({
      ...page,
      components: deleteRecursive(page.components)
    }));

    set({ 
      currentProject: { ...currentProject, pages: updatedPages },
      selectedComponentId: null 
    });
    get().saveCurrentState();
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      set({
        currentProject: JSON.parse(JSON.stringify(history[prevIndex])),
        historyIndex: prevIndex
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      set({
        currentProject: JSON.parse(JSON.stringify(history[nextIndex])),
        historyIndex: nextIndex
      });
    }
  }
}));
