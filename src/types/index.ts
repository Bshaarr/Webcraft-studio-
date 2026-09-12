export type ComponentType = 
  | 'container' | 'section' | 'row' | 'column' | 'card'
  | 'heading' | 'paragraph' | 'button' | 'image' | 'link'
  | 'input' | 'textarea' | 'select' | 'form'
  | 'navbar' | 'footer' | 'hero';

export interface VisualEvent {
  id: string;
  trigger: 'onClick' | 'onHover' | 'onSubmit';
  action: 'showAlert' | 'openUrl' | 'toggleElement' | 'addClass';
  payload: string;
}

export interface ComponentData {
  id: string;
  type: ComponentType;
  name: string;
  children: ComponentData[];
  content?: string;
  styles: Record<string, string>;
  attributes: Record<string, string>;
  events: VisualEvent[];
}

export interface ProjectPage {
  id: string;
  name: string;
  slug: string;
  components: ComponentData[];
}

export interface Project {
  id: string;
  name: string;
  updatedAt: string;
  pages: ProjectPage[];
  customCSS?: string;
  customJS?: string;
}

export type ViewMode = 'desktop' | 'tablet' | 'mobile';
export type ActiveTab = 'components' | 'layers' | 'settings';
export type BottomTab = 'visual' | 'code' | 'console';
