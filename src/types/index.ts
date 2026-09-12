export type ComponentType = 'heading' | 'paragraph' | 'button' | 'input' | 'hero' | 'container';

export type ViewMode = 'desktop' | 'tablet' | 'mobile';

export type ActiveTab = 'visual' | 'code' | 'layers' | 'components' | 'styles';

export type ActiveLeftTab = 'components' | 'layers' | 'templates';

export interface VisualEvent {
  id: string;
  trigger: 'click' | 'hover' | 'onClick' | 'onHover';
  action: 'showAlert' | 'openUrl' | 'navigate' | 'addClass' | 'toggleElement';
  payload: string;
}

export interface ComponentData {
  id: string;
  type: ComponentType;
  name: string;
  styles: Record<string, string>;
  attributes: Record<string, string>;
  events: VisualEvent[];
  children: ComponentData[];
  content?: string;
}

export interface PageData {
  id: string;
  name: string;
  components: ComponentData[];
}

export interface ProjectData {
  id: string;
  name: string;
  pages: PageData[];
  updatedAt?: string;
}
