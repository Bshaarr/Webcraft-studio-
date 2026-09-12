import { ComponentData, PageData, ProjectData } from '../types';

export const generateComponentHTML = (comp: ComponentData): string => {
  const styles = Object.entries(comp.styles || {})
    .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`)
    .join(';');

  const styleAttr = styles ? ` style="${styles}"` : '';

  switch (comp.type) {
    case 'heading':
      return `<h2${styleAttr}>${comp.content || ''}</h2>`;
    case 'paragraph':
      return `<p${styleAttr}>${comp.content || ''}</p>`;
    case 'button':
      return `<button${styleAttr}>${comp.content || ''}</button>`;
    case 'input':
      return `<input type="text" placeholder="${comp.content || ''}"${styleAttr} />`;
    case 'image':
      return `<img src="${comp.src || ''}" alt="${comp.content || ''}"${styleAttr} />`;
    case 'logo':
      return `<div${styleAttr}><span>🛡️</span> <span>${comp.content || ''}</span></div>`;
    case 'video':
      return `<video controls${styleAttr}><source src="${comp.src || ''}" type="video/mp4" /></video>`;
    case 'card':
      return `<div${styleAttr}><h3>${comp.content || ''}</h3></div>`;
    default:
      const childrenHTML = comp.children?.map(generateComponentHTML).join('') || '';
      return `<div${styleAttr}>${comp.content || ''}${childrenHTML}</div>`;
  }
};

export const generatePageHTML = (page: PageData): string => {
  return page.components.map(generateComponentHTML).join('\n');
};

export const generateProjectHTML = (project: ProjectData): string => {
  const page = project.pages[0];
  if (!page) return '';
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 text-slate-900 p-8">
  ${generatePageHTML(page)}
</body>
</html>`;
};
