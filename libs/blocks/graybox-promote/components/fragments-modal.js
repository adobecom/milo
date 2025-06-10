import { html } from '../../../deps/lit-all.min.js';

const renderFragmentsModal = (component) => {
  if (!component.showFragmentsModal) return '';
  return html`
    <div class="modal-overlay" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgb(0 0 0 / 50%);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    ">
      <div class="modal-content" style="
        background: var(--bg-secondary);
        border-radius: 8px;
        padding: 24px;
        width: 80%;
        max-width: 800px;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
      ">
        <button @click="${component.closeFragmentsModal}" style="
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 24px;
          cursor: pointer;
          padding: 4px;
          line-height: 1;
        ">×</button>
        
        <h3 style="
          margin: 0 0 16px 0;
          color: var(--text-primary);
          font-size: 20px;
        ">Found Fragments</h3>
        
        <div style="color: var(--text-secondary); margin-bottom: 16px;">
          ${component.foundFragments.length} fragments found
        </div>
        
        <div style="
          display: grid;
          gap: 8px;
          margin-bottom: 24px;
        ">
          ${component.foundFragments.map((fragment) => html`
            <div style="
              padding: 12px;
              background: var(--bg-primary);
              border-radius: 4px;
              border: 1px solid var(--border-color);
              display: flex;
              align-items: center;
              gap: 12px;
            ">
              <div style="
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: ${fragment[0].valid === 'not found' ? 'var(--error-color)' : 'var(--accent-color)'};
              "></div>
              <div style="
                flex: 1;
                font-family: 'Adobe Clean Mono', monospace;
                font-size: 14px;
                color: var(--text-primary);
                word-break: break-all;
              ">${fragment[0].pathname}</div>
            </div>
          `)}
        </div>

        <div style="
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        ">
          <button 
            @click="${component.closeFragmentsModal}"
            style="
              background: var(--bg-primary);
              color: var(--text-primary);
              border: 1px solid var(--border-color);
            "
          >Close</button>
          <button 
            @click="${component.addFragmentsToUrls}"
            style="
              background: var(--accent-color);
              color: var(--text-primary);
            "
          >Add to the list</button>
        </div>
      </div>
    </div>
  `;
};

export default renderFragmentsModal;
