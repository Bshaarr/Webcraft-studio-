import { ComponentData } from '../types';

export const generateHTML = (components: ComponentData[]): string => {
  return components.map(c => renderComponentToHTML(c)).join('\n');
};

const renderComponentToHTML = (comp: ComponentData): string => {
  const inlineStyles = Object.entries(comp.styles)
    .map(([k, v]) => `${camelToKebab(k)}:${v}`)
    .join('; ');

  const styleAttr = inlineStyles ? ` style="${inlineStyles}"` : '';
  const attrs = Object.entries(comp.attributes)
    .map(([k, v]) => ` ${k}="${v}"`)
    .join('');

  const eventAttrs = comp.events.map(ev => {
    if (ev.action === 'showAlert') return ` onclick="alert('${ev.payload}')"`;
    if (ev.action === 'openUrl') return ` onclick="window.open('${ev.payload}', '_blank')"`;
    return '';
  }).join('');

  const childrenHTML = comp.children.length > 0 ? comp.children.map(renderComponentToHTML).join('') : (comp.content || '');

  switch (comp.type) {
    case 'heading':
      return `<h2 id="${comp.id}"${styleAttr}${attrs}${eventAttrs}>${childrenHTML}</h2>`;
    case 'paragraph':
      return `<p id="${comp.id}"${styleAttr}${attrs}${eventAttrs}>${childrenHTML}</p>`;
    case 'button':
      return `<button id="${comp.id}"${styleAttr}${attrs}${eventAttrs}>${childrenHTML}</button>`;
    case 'input':
      return `<input id="${comp.id}" type="text" value="${comp.content \vert{}\vert{} ''}"${styleAttr}${attrs}${eventAttrs} />`;
    case 'hero':
      return `<section id="${comp.id}"${styleAttr}${attrs}${eventAttrs}>${childrenHTML}</section>`;
    default:
      return `<div id="${comp.id}"${styleAttr}${attrs}${eventAttrs}>${childrenHTML}</div>`;
  }
};

const camelToKebab = (str: string) => str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();

export const generateFullCode = (components: ComponentData[]) => {
  const bodyHTML = generateHTML(components);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WebCraft Output</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: sans-serif; }
  </style>
</head>
<body>
${bodyHTML}
</body>
</html>`;
};
