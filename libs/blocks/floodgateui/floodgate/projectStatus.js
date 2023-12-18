import { html, useEffect, useState } from '../../../deps/htm-preact.js';
import {
  allActionStatus,
  copyStatusCheck,
  deleteStatusCheck,
  promoteStatusCheck,
  cssStatusCopy,
  cssStatusPromote,
  cssStatusDelete,
  renderModal,
  shouldOpenModalOnMount,
} from '../utils/state.js';
import { fetchStatusAction } from '../utils/miloc.js';

function truncateMessage(message, maxLength = 105) {
  if (message && message.length > maxLength) {
    return message.slice(0, maxLength) + '...';
  }
  return message;
}

export function ProjectStatus(actionType) {
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

  function Badge() {
    return html`<div class="fgui-subproject-badge">${getCssStatus(actionType.action)}</div>`;
  }

  const [loading, setLoading] = useState(true);
  const action = actionType.action;
  const actionNameStatus = action + 'Status';

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
        }, 30000);
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
          ${actionType.action === 'promote'
            ? html`
                <div class="fgui-subproject-badge" style="
                  background: none;
                  bottom: -4px;
                  right: -4px;
                  position: absolute;
                ">
                  ${getCssStatus(actionType.action) !== 'NOT STARTED'
                    ? html`
                        <a href="#" onClick=${() => {
                          renderModal.value = renderModal.value + 1;
                          shouldOpenModalOnMount.value = true;
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="18"> 
                            <title>InfoMedium</title> 
                            <rect id="ToDelete" fill="#ff13dc" opacity="0" width="18" height="18"></rect>
                            <path d="M9,1a8,8,0,1,0,8,8A8,8,0,0,0,9,1ZM8.85,3.15a1.359,1.359,0,0,1,1.43109,1.28286q.00352.06452.00091.12914A1.332,1.332,0,0,1,8.85,5.994,1.353,1.353,0,0,1,7.418,4.561,1.359,1.359,0,0,1,8.72191,3.14905Q8.78595,3.14652,8.85,3.15ZM11,13.5a.5.5,0,0,1-.5.5h-3a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5H8V9H7.5A.5.5,0,0,1,7,8.5v-1A.5.5,0,0,1,7.5,7h2a.5.5,0,0,1,.5.5V12h.5a.5.5,0,0,1,.5.5Z"></path> 
                          </svg>
                        </a>
                      `
                    : ''}
                </div>
              `
            : ''}
          <p class="fgui-project-label">Action</p>
          <h3 class="fgui-subproject-name">${action.toUpperCase()}</h3>
          <p class="fgui-project-label">Last Run</p>
          <h3 class="fgui-subproject-name">
            ${allActionStatus.value[actionNameStatus]?.payload?.action?.startTime
              ? new Date(allActionStatus.value[actionNameStatus]?.payload?.action?.startTime).toLocaleString(undefined, { timeZoneName: 'short' })
              : '-'}
          </h3>
          <p class="fgui-project-label">Description</p>
          <h3 class="fgui-subproject-name" title=${allActionStatus.value[actionNameStatus]?.payload?.action?.message || '-'}>
            ${truncateMessage(allActionStatus.value[actionNameStatus]?.payload?.action?.message) || '-'}
          </h3>
        </li>
      `;
}
