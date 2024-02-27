/* eslint-disable class-methods-use-this */
import { createTag, getConfig } from '../../utils/utils.js';

const tasks = [
  { title: '1. Quick Introduction to commerce on adobe.com', completed: false },
  { title: '2. Milo Commerce', completed: false },
  { title: '3. Web Components', completed: false },
  { title: '4. Spectrum Web Components (SWC)', completed: false },
  { title: '5. Adding new components', completed: false },
  { title: '6. SWC in consumer projects', completed: false },
  { title: '7. Performance optimizations', completed: false },
];

async function getApp() {
  const { LitElement, html, css, repeat } = await import('../../deps/lit-all.min.js');
  class SwcDemo extends LitElement {
    static properties = { hideCompleted: { type: Boolean, attribute: 'hide-completed', reflect: true } };

    static styles = css`
  #todo-list {
    list-style: none;
    padding: 0;
  }

  #todo-app {
    width: 100%;
    min-height: 300px;
    margin: auto;
    padding: 20px;
  }  
  `;

    constructor() {
      super();
      this.hideCompleted = false;
    }

    onTaskChange(event, task) {
      const { target } = event;
      setTimeout(() => {
        task.completed = target.checked;
        this.requestUpdate();
      }, 2000);
    }

    onCompletedTasksChange(event) {
      this.hideCompleted = event.target.value === 'hide';
    }

    get tasks() {
      const filteredTasks = tasks.filter((task) => !this.hideCompleted || !task.completed);
      return html`${repeat(
        filteredTasks,
        (task) => task.title,
        (task) => html`<li><sp-checkbox
        ?checked=${task.completed}
        @change=${(event) => this.onTaskChange(event, task)}>
        ${task.title}
        </sp-checkbox></li>`,
      )}`;
    }

    get newTodoInput() {
      return this.shadowRoot.getElementById('new-todo');
    }

    addTask() {
      const taskText = this.newTodoInput.value.trim();
      if (taskText) {
        tasks.push({ title: taskText, completed: false });
        this.newTodoInput.value = '';
        this.requestUpdate();
      }
    }

    keypress(event) {
      if (event.key === 'Enter') {
        this.addTask();
      }
    }

    render() {
      return html`
    <sp-theme scale="medium" color="light">
    <div id="todo-app">
        <sp-textfield id="new-todo" placeholder="What needs to be done?" @keypress=${this.keypress}></sp-textfield>
        <sp-button variant="cta" id="add-todo" @click=${this.addTask}>Add</sp-button>
        <ul id="todo-list">
          ${this.tasks}
        </ul>
        <sp-field-label for="tasks">Completed tasks</sp-field-label>
        <sp-picker id="tasks" value="show" @change=${this.onCompletedTasksChange}>
            <sp-menu-item value="show">Show</sp-menu-item>
            <sp-menu-item value="hide">Hide</sp-menu-item>
        </sp-picker>
    </div>
  </sp-theme>`;
    }
  }

  customElements.define('swc-demo', SwcDemo);

  return createTag('swc-demo', {});
}

export default async function main(el) {
  performance.mark('swc-demo:start');
  const { base } = getConfig();
  const deps = Promise.all([
    import(`${base}/features/spectrum-web-components/dist/theme.js`),
    import(`${base}/features/spectrum-web-components/dist/base.js`),
    import(`${base}/features/spectrum-web-components/dist/shared.js`),
    import(`${base}/features/spectrum-web-components/dist/button.js`),
    import(`${base}/features/spectrum-web-components/dist/picker.js`),
    import(`${base}/features/spectrum-web-components/dist/checkbox.js`),
    import(`${base}/features/spectrum-web-components/dist/textfield.js`),
  ]);

  el.replaceWith(await getApp());

  await deps;
  performance.mark('swc-demo:end');
  performance.measure('swc-demo block', 'swc-demo:start', 'swc-demo:end');
  return el;
}
