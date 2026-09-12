import { VisualEvent } from '../types';

export const runVisualEvent = (event: VisualEvent) => {
  switch (event.action) {
    case 'showAlert':
      alert(event.payload);
      break;
    case 'openUrl':
      window.open(event.payload, '_blank');
      break;
    case 'navigate':
      window.location.href = event.payload;
      break;
    case 'addClass':
      console.log('Add class action triggered:', event.payload);
      break;
    case 'toggleElement':
      console.log('Toggle element action triggered:', event.payload);
      break;
    default:
      console.log('Unknown event action:', event);
  }
};
