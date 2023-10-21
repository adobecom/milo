import { html, useEffect, useState } from '../../../deps/htm-preact.js';
import {
  allActionStatus,
  copyStatusCheck,
  deleteStatusCheck,
  promoteStatusCheck,
  cssStatusCopy,
  cssStatusPromote,
  cssStatusDelete,
} from '../utils/state.js';
import { fetchStatusAction } from '../utils/miloc.js';

export function ProjectStatus(actionType) {
  function Badge() {
    return html`<div class="fgui-subproject-badge">${getCssStatus(actionType.action)}</div>`;
  }

  const [loading, setLoading] = useState(true);
  const action = actionType.action;
  const actionNameStatus = action + 'Status';

  const getCssStatus = (type) => {
    switch (type) {
      case 'copy':
        return cssStatusCopy.value;
      case 'promote':
        return cssStatusPromote.value;
      case 'delete':
        return cssStatusDelete.value;
      default:
        throw new Error('Invalid action type.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const newStatus = await fetchStatusAction();
      allActionStatus.value = newStatus;

      const actionStatusValue = newStatus[actionNameStatus]?.payload?.action?.status || 'NOT STARTED';
      switch (action) {
        case 'copy':
          copyStatusCheck.value = actionStatusValue;
          cssStatusCopy.value = actionStatusValue;
          break;
        case 'promote':
          promoteStatusCheck.value = actionStatusValue;
          cssStatusPromote.value = actionStatusValue;
          break;
        case 'delete':
          deleteStatusCheck.value = actionStatusValue;
          cssStatusDelete.value = actionStatusValue;
          break;
        default:
          throw new Error('Invalid action type.');
      }

      setLoading(false);

      // Check if initial status is IN PROGRESS and set up setInterval
      const initialStatus = allActionStatus.value[actionNameStatus];
      if (initialStatus && initialStatus?.payload?.action?.status === 'IN PROGRESS') {
        const intervalId = setInterval(async () => {
          const updatedStatus = await fetchStatusAction();

          // Update allActionStatus
          allActionStatus.value = updatedStatus;

          const intermediateCssStatus = updatedStatus[actionNameStatus]?.payload?.action?.status || 'NOT STARTED';

          switch (action) {
            case 'copy':
              copyStatusCheck.value = intermediateCssStatus;
              cssStatusCopy.value = intermediateCssStatus;
              break;
            case 'promote':
              promoteStatusCheck.value = intermediateCssStatus;
              cssStatusPromote.value = intermediateCssStatus;
              break;
            case 'delete':
              deleteStatusCheck.value = intermediateCssStatus;
              cssStatusDelete.value = intermediateCssStatus;
              break;
            default:
              throw new Error('Invalid action type.');
          }

          // Check if status is no longer IN PROGRESS and clear setInterval
          if (updatedStatus[actionNameStatus]?.payload?.action?.status === 'COMPLETED' || updatedStatus[actionNameStatus].payload.action.status === 'COMPLETED WITH ERROR') {
            clearInterval(intervalId);
          }
        }, 3000);
      }
    };

    fetchData();

    return () => {};
  }, [action]);

  return loading
    ? html`
        <li class="fgui-subproject fgui-subproject-NOT STARTED">
          <p class="fgui-project-label">Action</p>
          <h3 class="fgui-subproject-name">${action.toUpperCase()}</h3>
          <p class="fgui-project-label">Last Run</p>
          <h3 class="fgui-subproject-name">-</h3>
          <p class="fgui-project-label">Description</p>
          <h3 class="fgui-subproject-name">-</h3>
          <h3 class="fgui-subproject-name">
            <span class="loading-icon-container">
              <span class="loading-icon"></span>
            </span>
          </h3>
        </li>
      `
    : html`
        <li class="fgui-subproject fgui-subproject-${getCssStatus(action)}">
          ${html`<${Badge} />`}
          <p class="fgui-project-label">Action</p>
          <h3 class="fgui-subproject-name">${action.toUpperCase()}</h3>
          <p class="fgui-project-label">Last Run</p>
          <h3 class="fgui-subproject-name">
            ${new Date(allActionStatus.value[actionNameStatus]?.payload?.action?.startTime).toLocaleString() || '-'}
          </h3>
          <p class="fgui-project-label">Description</p>
          <h3 class="fgui-subproject-name">
            ${allActionStatus.value[actionNameStatus]?.payload?.action?.message || '-'}
          </h3>
        </li>
      `;
}
