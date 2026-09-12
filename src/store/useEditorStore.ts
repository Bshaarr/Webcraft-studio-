import { create } from 'zustand';
import { ComponentData, ProjectData, ViewMode, ActiveTab, ActiveLeftTab, VisualEvent } from '../types';

interface EditorState {
  projects: ProjectData[];
  currentProject: ProjectData | null;
  selectedComponentId: string | null;
  viewMode: ViewMode;
  activeBottomTab: ActiveTab;
  activeLeftTab: ActiveLeftTab;
  activePageId: string;
  history: ProjectData[];
  historyIndex: number;

  // Actions
  createProject: (name: string) => void;
  selectProject: (id: string) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  setProject: (project: ProjectData) => void;
  
  setSelectedComponentId: (id: string | null) => void;
  setSelectedComponent: (id: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setActiveBottomTab: (tab: ActiveTab) => void;
  setActiveLeftTab: (tab: ActiveLeftTab) => void;
  setActivePageId: (pageId: string) => void;
  
  addComponent: (parentId: string | null, type: string) => void;
  updateComponent: (id: string, updates: Partial<ComponentData>) => void;
  updateComponentStyle: (id: string, styleKey: string, value: string) => void;
  updateComponentContent: (id: string, content: string) => void;
  addEventToComponent: (id: string, event: VisualEvent) => void;
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
  projects: [initialProject],
  currentProject: initialProject,
  selectedComponentId: null,
  viewMode: 'desktop',
  activeBottomTab: 'visual',
  activeLeftTab: 'components',
  activePageId: 'page-1',
  history: [initialProject],
  historyIndex: 0,

  createProject: (name) => {
    const newProj: ProjectData = {
      id: `proj-${Date.now()}`,
      name: name || 'Untitled Project',
      pages: [{ id: 'page-1', name: 'Home Page', components: [] }]
    };
    set((state) => ({
      projects: [...state.projects, newProj],
      currentProject: newProj
    }));
  },

  selectProject: (id) => {
    const proj = get().projects.find((p) => p.id === id);
    if (proj) set({ currentProject: proj });
  },

  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      currentProject: state.currentProject?.id === id ? null : state.currentProject
    }));
  },

  duplicateProject: (id) => {
    const target = get().projects.find((p) => p.id === id);
    if (!target) return;
    const dup: ProjectData = {
      ...JSON.parse(JSON.stringify(target)),
      id: `proj-${Date.now()}`,
      name: `${target.name} (Copy)`
    };
    set((state) => ({ projects: [...state.projects, dup] }));
  },

  setProject: (project) => set({ currentProject: project }),
  setSelectedComponentId: (id) => set({ selectedComponentId: id }),
  setSelectedComponent: (id) => set({ selectedComponentId: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setActiveBottomTab: (tab) => set({ activeBottomTab: tab }),
  setActiveLeftTab: (tab) => set({ activeLeftTab: tab }),
  setActivePageId: (pageId) => set({ activePageId: pageId }),

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
    const { currentProject, activePageId } = get();
    if (!currentProject) return;

    const targetPageId = activePageId || currentProject.pages[0]?.id || 'page-1';

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
      return list.map((item: ComponentData) => {
        if (item.id === parentId) {
          return { ...item, children: [...item.children, newComp] };
        }
        if (item.children && item.children.length > 0) {
          return { ...item, children: updateRecursive(item.children) };
        }
        return item;
      });
    };

    const updatedPages = currentProject.pages.map((page) => {
      if (page.id === targetPageId) {
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
      return list.map((item: ComponentData) => {
        if (item.id === id) {
          return { ...item, ...updates };
        }
        if (item.children && item.children.length > 0) {
          return { ...item, children: updateRecursive(item.children) };
        }
        return item;
      });
    };

    const updatedPages = currentProject.pages.map((page) => ({
      ...page,
      components: updateRecursive(page.components)
    }));

    set({ currentProject: { ...currentProject, pages: updatedPages } });
    get().saveCurrentState();
  },

  updateComponentStyle: (id: string, styleKey: string, value: string) => {
    const { currentProject, updateComponent } = get();
    if (!currentProject) return;

    const findComponent = (list: ComponentData[]): ComponentData | null => {
      for (const item of list) {
        if (item.id === id) return item;
        if (item.children) {
          const res = findComponent(item.children);
          if (res) return res;
        }
      }
      return null;
    };

    const targetPage = currentProject.pages[0];
    if (!targetPage) return;
    const comp = findComponent(targetPage.components);

    if (comp) {
      const updatedStyles = { ...comp.styles, [styleKey]: value };
      updateComponent(id, { styles: updatedStyles });
    }
  },

  updateComponentContent: (id: string, content: string) => {
    get().updateComponent(id, { content });
  },

  addEventToComponent: (id: string, event: VisualEvent) => {
    const { currentProject, updateComponent } = get();
    if (!currentProject) return;

    const findComponent = (list: ComponentData[]): ComponentData | null => {
      for (const item of list) {
        if (item.id === id) return item;
        if (item.children) {
          const res = findComponent(item.children);
          if (res) return res;
        }
      }
      return null;
    };

    const targetPage = currentProject.pages[0];
    if (!targetPage) return;
    const comp = findComponent(targetPage.components);

    if (comp) {
      const updatedEvents = [...comp.events, event];
      updateComponent(id, { events: updatedEvents });
    }
  },

  deleteComponent: (id: string) => {
    const { currentProject } = get();
    if (!currentProject) return;

    const deleteRecursive = (list: ComponentData[]): ComponentData[] => {
      return list
        .filter((item: ComponentData) => item.id !== id)
        .map((item: ComponentData) => ({
          ...item,
          children: item.children ? deleteRecursive(item.children) : []
        }));
    };

    const updatedPages = currentProject.pages.map((page) => ({
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
