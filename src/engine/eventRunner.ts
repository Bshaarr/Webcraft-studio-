import { VisualEvent } from '../types';

export const executeVisualEvent = (event: VisualEvent) => {
  switch (event.action) {
    case 'showAlert':
      alert(event.payload || 'Action triggered!');
      break;

    case 'openUrl':
      if (event.payload) {
        window.open(event.payload, '_blank');
      }
      break;

    case 'addClass':
      if (event.payload) {
        console.log(`[Event Engine] Added class: ${event.payload}`);
      }
      break;

    case 'toggleElement':
      console.log(`[Event Engine] Toggled element: ${event.payload}`);
      break;

    default:
      console.warn(`[Event Engine] Unhandled event action: ${event.action}`);
  }
};
