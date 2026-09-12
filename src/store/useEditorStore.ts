import { create } from 'zustand';
import { ComponentData, Project, ViewMode, ActiveTab, BottomTab } from '../types';

interface EditorState {
  projects: Project[];
  currentProject: Project | null;
  activePageId: string;
  selectedComponentId: string | null;
  viewMode: ViewMode;
  activeLeftTab: ActiveTab;
  activeBottomTab: BottomTab;
  logs: Array<{ type: 'log' | 'error' | 'warn'; message: string }>;
  history: Project[];
  historyIndex: number;
  
  // Actions
  setProjects: (projects: Project[]) => void;
  createProject: (name: string) => void;
  selectProject: (id: string) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  
  setSelectedComponent: (id: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setActiveLeftTab: (tab: ActiveTab) => void;
  setActiveBottomTab: (tab: BottomTab) => void;
  
  addComponent: (parentId: string | null, type: any) => void;
  updateComponentStyle: (id: string, property: string, value: string) => void;
  updateComponentContent: (id: string, content: string) => void;
  updateComponentAttr: (id: string, attr: string, value: string) => void;
  addEventToComponent: (id: string, event: any) => void;
  deleteComponent: (id: string) => void;
  
  undo: () => void;
  redo: () => void;
  addLog: (type: 'log' | 'error' | 'warn', message: string) => void;
  clearLogs: () => void;
  saveCurrentState: () => void;
}

const initialProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Landing Page',
    updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    pages: [
      {
        id: 'page-1',
        name: 'Home',
        slug: 'index.html',
        components: [
          {
            id: 'c-hero',
            type: 'hero',
            name: 'Hero Section',
            styles: { padding: '40px 20px', backgroundColor: '#0f172a', color: '#ffffff', textAlign: 'center', borderRadius: '8px' },
            attributes: {},
            events: [],
            children: [
              {
                id: 'c-title',
                type: 'heading',
                name: 'Heading',
                content: 'Build Visually. Code Automatically.',
                styles: { fontSize: '32px', marginBottom: '12px', color: '#38bdf8' },
                attributes: {},
                events: [],
                children: []
              },
              {
                id: 'c-sub',
                type: 'paragraph',
                name: 'Paragraph',
                content: 'WebCraft Studio gives you full visual freedom with production-ready clean code.',
                styles: { fontSize: '16px', color: '#94a3b8', marginBottom: '20px' },
                attributes: {},
                events: [],
                children: []
              },
              {
                id: 'c-btn',
                type: 'button',
                name: 'CTA Button',
                content: 'Get Started Now',
                styles: { backgroundColor: '#0284c7', color: '#ffffff', padding: '10px 24px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '16px' },
                attributes: {},
                events: [{ id: 'ev-1', trigger: 'onClick', action: 'showAlert', payload: 'Welcome to WebCraft Studio!' }],
                children: []
              }
            ]
          }
        ]
      }
    ]
  }
];

export const useEditorStore = create<EditorState>((set, get) => ({
  projects: initialProjects,
  currentProject: initialProjects[0],
  activePageId: 'page-1',
  selectedComponentId: null,
  viewMode: 'desktop',
  activeLeftTab: 'components',
  activeBottomTab: 'visual',
  logs: [{ type: 'log', message: 'Engine initialized successfully.' }],
  history: [initialProjects[0]],
  historyIndex: 0,

  setProjects: (projects) => set({ projects }),
  
  createProject: (name) => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name,
      updatedAt: 'Just now',
      pages: [{ id: `p-${Date.now()}`, name: 'Home', slug: 'index.html', components: [] }]
    };
    const updated = [...get().projects, newProj];
    set({ projects: updated, currentProject: newProj, activePageId: newProj.pages[0].id });
  },

  selectProject: (id) => {
    const proj = get().projects.find(p => p.id === id);
    if (proj) {
      set({ currentProject: proj, activePageId: proj.pages[0].id, history: [proj], historyIndex: 0 });
    }
  },

  deleteProject: (id) => {
    const updated = get().projects.filter(p => p.id !== id);
    set({ projects: updated, currentProject: updated[0] || null });
  },

  duplicateProject: (id) => {
    const proj = get().projects.find(p => p.id === id);
    if (!proj) return;
    const duplicated: Project = {
      ...proj,
      id: `proj-${Date.now()}`,
      name: `${proj.name} (Copy)`,
      updatedAt: 'Just now'
    };
    set({ projects: [...get().projects, duplicated] });
  },

  setSelectedComponent: (id) => set({ selectedComponentId: id }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setActiveLeftTab: (tab) => set({ activeLeftTab: tab }),
  setActiveBottomTab: (tab) => set({ activeBottomTab: tab }),

  saveCurrentState: () => {
    const { currentProject, history, historyIndex } = get();
    if (!currentProject) return;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(currentProject)));
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

    addComponent: (parentId, type) => {
    const { currentProject, activePageId } = get();
    if (!currentProject) return;

    const newComp: ComponentData = {
      id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
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
        // إذا لم يتم تحديد عنصر أب، أضفه كعنصر رئيسي في الصفحة مباشرة
        if (!parentId) {
          return { ...page, components: [...page.components, newComp] };
        }
        // إذا تم تحديد عنصر أب (مثل Container)، أضفه داخله
        return { ...page, components: updateRecursive(page.components) };
      }
      return page;
    });

    const updatedProj = { ...currentProject, pages: updatedPages };
    set({ currentProject: updatedProj, selectedComponentId: newComp.id });
    get().saveCurrentState();
  },


    const updateRecursive = (list: ComponentData[]): ComponentData[] => {
      return list.map(item => {
        if (item.id === parentId) {
          return { ...item, children: [...item.children, newComp] };
        }
        if (item.children.length > 0) {
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

  updateComponentStyle: (id, property, value) => {
    const { currentProject, activePageId } = get();
    if (!currentProject) return;

    const updateRecursive = (list: ComponentData[]): ComponentData[] => {
      return list.map(item => {
        if (item.id === id) {
          return { ...item, styles: { ...item.styles, [property]: value } };
        }
        if (item.children.length > 0) {
          return { ...item, children: updateRecursive(item.children) };
        }
        return item;
      });
    };

    const updatedPages = currentProject.pages.map(page => {
      if (page.id === activePageId) {
        return { ...page, components: updateRecursive(page.components) };
      }
      return page;
    });

    set({ currentProject: { ...currentProject, pages: updatedPages } });
  },

  updateComponentContent: (id, content) => {
    const { currentProject, activePageId } = get();
    if (!currentProject) return;

    const updateRecursive = (list: ComponentData[]): ComponentData[] => {
      return list.map(item => {
        if (item.id === id) {
          return { ...item, content };
        }
        if (item.children.length > 0) {
          return { ...item, children: updateRecursive(item.children) };
        }
        return item;
      });
    };

    const updatedPages = currentProject.pages.map(page => {
      if (page.id === activePageId) {
        return { ...page, components: updateRecursive(page.components) };
      }
      return page;
    });

    set({ currentProject: { ...currentProject, pages: updatedPages } });
  },

  updateComponentAttr: (id, attr, value) => {
    const { currentProject, activePageId } = get();
    if (!currentProject) return;

    const updateRecursive = (list: ComponentData[]): ComponentData[] => {
      return list.map(item => {
        if (item.id === id) {
          return { ...item, attributes: { ...item.attributes, [attr]: value } };
        }
        if (item.children.length > 0) {
          return { ...item, children: updateRecursive(item.children) };
        }
        return item;
      });
    };

    const updatedPages = currentProject.pages.map(page => {
      if (page.id === activePageId) {
        return { ...page, components: updateRecursive(page.components) };
      }
      return page;
    });

    set({ currentProject: { ...currentProject, pages: updatedPages } });
  },

  addEventToComponent: (id, event) => {
    const { currentProject, activePageId } = get();
    if (!currentProject) return;

    const updateRecursive = (list: ComponentData[]): ComponentData[] => {
      return list.map(item => {
        if (item.id === id) {
          return { ...item, events: [...item.events, event] };
        }
        if (item.children.length > 0) {
          return { ...item, children: updateRecursive(item.children) };
        }
        return item;
      });
    };

    const updatedPages = currentProject.pages.map(page => {
      if (page.id === activePageId) {
        return { ...page, components: updateRecursive(page.components) };
      }
      return page;
    });

    set({ currentProject: { ...currentProject, pages: updatedPages } });
  },

  deleteComponent: (id) => {
    const { currentProject, activePageId } = get();
    if (!currentProject) return;

    const deleteRecursive = (list: ComponentData[]): ComponentData[] => {
      return list
        .filter(item => item.id !== id)
        .map(item => ({
          ...item,
          children: deleteRecursive(item.children)
        }));
    };

    const updatedPages = currentProject.pages.map(page => {
      if (page.id === activePageId) {
        return { ...page, components: deleteRecursive(page.components) };
      }
      return page;
    });

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
      set({ currentProject: history[prevIndex], historyIndex: prevIndex });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      set({ currentProject: history[nextIndex], historyIndex: nextIndex });
    }
  },

  addLog: (type, message) => set(state => ({ logs: [...state.logs, { type, message }] })),
  clearLogs: () => set({ logs: [] })
}));
