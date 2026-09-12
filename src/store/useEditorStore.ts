import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProjectData, ComponentData, ViewMode, ActiveLeftTab } from '../types';

interface EditorState {
  projects: ProjectData[];
  currentProject: ProjectData | null;
  activePageId: string;
  selectedComponentId: string | null;
  viewMode: ViewMode;
  activeLeftTab: ActiveLeftTab;
  isPreviewMode: boolean;

  createProject: (name: string) => void;
  selectProject: (id: string) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  setSelectedComponent: (id: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setActiveLeftTab: (tab: ActiveLeftTab) => void;
  setIsPreviewMode: (status: boolean) => void;

  addComponent: (parentId: string | null, type: string) => void;
  updateComponent: (id: string, updates: Partial<ComponentData>) => void;
  deleteComponent: (id: string) => void;
  loadTemplate: (templateType: 'landing' | 'portfolio') => void;
}

const defaultProject: ProjectData = {
  id: 'proj-1',
  name: 'مشروعك الأول',
  updatedAt: new Date().toLocaleDateString('ar-SA'),
  pages: [
    {
      id: 'page-1',
      name: 'الصفحة الرئيسية',
      components: [
        {
          id: 'comp-logo-1',
          type: 'logo',
          name: 'الشعار',
          styles: { fontSize: '24px', fontWeight: 'bold', color: '#0284c7' },
          attributes: {},
          events: [],
          children: [],
          content: 'WebCraft Studio',
        },
        {
          id: 'comp-1',
          type: 'heading',
          name: 'عنوان رئيسي',
          styles: { fontSize: '32px', color: '#0f172a', marginBottom: '12px' },
          attributes: {},
          events: [],
          children: [],
          content: 'مرحباً بك في WebCraft Studio',
        },
        {
          id: 'comp-2',
          type: 'paragraph',
          name: 'فقرة نصية',
          styles: { fontSize: '16px', color: '#64748b', marginBottom: '20px' },
          attributes: {},
          events: [],
          children: [],
          content: 'منصة التصميم المرئي وبناء الواجهات وسهلة الاستخدام.',
        },
      ],
    },
  ],
};

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      projects: [defaultProject],
      currentProject: defaultProject,
      activePageId: 'page-1',
      selectedComponentId: null,
      viewMode: 'desktop',
      activeLeftTab: 'components',
      isPreviewMode: false,

      createProject: (name) => {
        const newProj: ProjectData = {
          id: `proj-${Date.now()}`,
          name,
          updatedAt: new Date().toLocaleDateString('ar-SA'),
          pages: [{ id: `page-${Date.now()}`, name: 'الصفحة الرئيسية', components: [] }],
        };
        set((state) => ({
          projects: [...state.projects, newProj],
          currentProject: newProj,
          activePageId: newProj.pages[0].id,
        }));
      },

      selectProject: (id) => {
        set((state) => {
          const proj = state.projects.find((p) => p.id === id) || state.currentProject;
          return { currentProject: proj, activePageId: proj?.pages[0]?.id || 'page-1' };
        });
      },

      deleteProject: (id) => {
        set((state) => {
          const filtered = state.projects.filter((p) => p.id !== id);
          return {
            projects: filtered,
            currentProject: filtered[0] || null,
          };
        });
      },

      duplicateProject: (id) => {
        set((state) => {
          const proj = state.projects.find((p) => p.id === id);
          if (!proj) return state;
          const copy: ProjectData = {
            ...proj,
            id: `proj-${Date.now()}`,
            name: `${proj.name} (نسخة)`,
            updatedAt: new Date().toLocaleDateString('ar-SA'),
          };
          return { projects: [...state.projects, copy] };
        });
      },

      setSelectedComponent: (id) => set({ selectedComponentId: id }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setActiveLeftTab: (tab) => set({ activeLeftTab: tab }),
      setIsPreviewMode: (status) => set({ isPreviewMode: status }),

      addComponent: (parentId, type) => {
        set((state) => {
          if (!state.currentProject) return state;
          const newComp: ComponentData = {
            id: `comp-${Date.now()}`,
            type: type as any,
            name: type.toUpperCase(),
            styles: { padding: '8px', marginBottom: '12px' },
            attributes: {},
            events: [],
            children: [],
            content:
              type === 'heading'
                ? 'عنوان جديد'
                : type === 'paragraph'
                ? 'هذا نص فقرة تجريبية جديدة يمكنك تعديلها.'
                : type === 'button'
                ? 'اضغط هنا'
                : type === 'logo'
                ? 'شعار الماركة'
                : type === 'card'
                ? 'محتوى البطاقة التفاعلية'
                : 'عنصر جديد',
            src:
              type === 'image'
                ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop'
                : type === 'video'
                ? 'https://www.w3schools.com/html/mov_bbb.mp4'
                : undefined,
          };

          const updatedPages = state.currentProject.pages.map((page) => {
            if (page.id === state.activePageId) {
              return { ...page, components: [...page.components, newComp] };
            }
            return page;
          });

          return {
            currentProject: { ...state.currentProject, pages: updatedPages },
            selectedComponentId: newComp.id,
          };
        });
      },

      updateComponent: (id, updates) => {
        set((state) => {
          if (!state.currentProject) return state;

          const updateRecursive = (comps: ComponentData[]): ComponentData[] => {
            return comps.map((c) => {
              if (c.id === id) {
                return { ...c, ...updates, styles: { ...c.styles, ...(updates.styles || {}) } };
              }
              if (c.children?.length) {
                return { ...c, children: updateRecursive(c.children) };
              }
              return c;
            });
          };

          const updatedPages = state.currentProject.pages.map((p) => {
            if (p.id === state.activePageId) {
              return { ...p, components: updateRecursive(p.components) };
            }
            return p;
          });

          return { currentProject: { ...state.currentProject, pages: updatedPages } };
        });
      },

      deleteComponent: (id) => {
        set((state) => {
          if (!state.currentProject) return state;

          const deleteRecursive = (comps: ComponentData[]): ComponentData[] => {
            return comps
              .filter((c) => c.id !== id)
              .map((c) => ({ ...c, children: deleteRecursive(c.children) }));
          };

          const updatedPages = state.currentProject.pages.map((p) => {
            if (p.id === state.activePageId) {
              return { ...p, components: deleteRecursive(p.components) };
            }
            return p;
          });

          return {
            currentProject: { ...state.currentProject, pages: updatedPages },
            selectedComponentId: null,
          };
        });
      },

      loadTemplate: (templateType) => {
        set((state) => {
          if (!state.currentProject) return state;

          let newComponents: ComponentData[] = [];

          if (templateType === 'landing') {
            newComponents = [
              {
                id: `comp-${Date.now()}-1`,
                type: 'logo',
                name: 'شعار المنصة',
                styles: { fontSize: '28px', fontWeight: 'bold', color: '#0284c7', marginBottom: '16px' },
                attributes: {},
                events: [],
                children: [],
                content: 'MORAD Tech',
              },
              {
                id: `comp-${Date.now()}-2`,
                type: 'heading',
                name: 'العنوان الرئيسي',
                styles: { fontSize: '36px', color: '#0f172a', fontWeight: '800', marginBottom: '12px' },
                attributes: {},
                events: [],
                children: [],
                content: 'بناء الحلول البرمجية والهندسية المتكاملة',
              },
              {
                id: `comp-${Date.now()}-3`,
                type: 'paragraph',
                name: 'وصف الصفحة',
                styles: { fontSize: '18px', color: '#475569', marginBottom: '24px' },
                attributes: {},
                events: [],
                children: [],
                content: 'نقدم أحدث التقنيات وبناء الواجهات المبتكرة مع تنفيذ الحلول بسرعة واحترافية عالية.',
              },
              {
                id: `comp-${Date.now()}-4`,
                type: 'button',
                name: 'زر للتواصل',
                styles: { backgroundColor: '#0284c7', color: '#ffffff', padding: '12px 24px', borderRadius: '8px', fontSize: '16px' },
                attributes: {},
                events: [{ id: '1', trigger: 'click', action: 'showAlert', payload: 'أهلاً بك! يمكنك التواصل عبر رقم المهندس بشار عنيزان: 0930971491' }],
                children: [],
                content: 'تواصل معنا الآن',
              },
            ];
          } else {
            newComponents = [
              {
                id: `comp-${Date.now()}-1`,
                type: 'heading',
                name: 'اسم المطور',
                styles: { fontSize: '32px', color: '#0f172a', fontWeight: 'bold', marginBottom: '8px' },
                attributes: {},
                events: [],
                children: [],
                content: 'المهندس بشار عنيزان',
              },
              {
                id: `comp-${Date.now()}-2`,
                type: 'paragraph',
                name: 'التخصص',
                styles: { fontSize: '18px', color: '#0284c7', fontWeight: '600', marginBottom: '16px' },
                attributes: {},
                events: [],
                children: [],
                content: 'Full-Stack Developer & AI Engineer',
              },
              {
                id: `comp-${Date.now()}-3`,
                type: 'image',
                name: 'صورة شخصية',
                styles: { width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px' },
                attributes: {},
                events: [],
                children: [],
                src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop',
              },
            ];
          }

          const updatedPages = state.currentProject.pages.map((p) => {
            if (p.id === state.activePageId) {
              return { ...p, components: newComponents };
            }
            return p;
          });

          return { currentProject: { ...state.currentProject, pages: updatedPages } };
        });
      },
    }),
    { name: 'webcraft-studio-storage' }
  )
);
