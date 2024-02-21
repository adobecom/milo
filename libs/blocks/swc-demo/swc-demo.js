import { getConfig } from '../../utils/utils.js';

export default async function main(el) {
  performance.mark('swc-tbt-started');
  const { base } = getConfig();
  const deps = Promise.all([
    import(`${base}/deps/lit-all.min.js`),
    import(`${base}/features/spectrum-web-components/dist/theme.js`),
    import(`${base}/features/spectrum-web-components/dist/base.js`),
    import(`${base}/features/spectrum-web-components/dist/shared.js`),
    import(`${base}/features/spectrum-web-components/dist/button.js`),
    import(`${base}/features/spectrum-web-components/dist/checkbox.js`),
    import(`${base}/features/spectrum-web-components/dist/textfield.js`),
  ]);
  el.innerHTML = `
  <sp-theme scale="medium" color="light">
  <div id="todo-app">
      <sp-textfield id="new-todo" placeholder="What needs to be done?"></sp-textfield>
      <sp-button variant="cta" id="add-todo">Add</sp-button>
      <ul id="todo-list">
      <li><sp-checkbox>Quick Introduction to commerce on adobe.com</li></sp-checkbox>
      <li><sp-checkbox>Milo Commerce</li></sp-checkbox>
      <li><sp-checkbox>Web Components</li></sp-checkbox>
      <li><sp-checkbox>Spectrum Web Components (SWC)</li></sp-checkbox>
      <li><sp-checkbox>Adding new components</li></sp-checkbox>
      <li><sp-checkbox>SWC in consumer projects</li></sp-checkbox>
      <li><sp-checkbox>Performance optimizations</li></sp-checkbox>
      </ul>
  </div>
</sp-theme>
`;

  const addButton = document.getElementById('add-todo');
  const newTodoInput = document.getElementById('new-todo');
  const todoList = document.getElementById('todo-list');

  const addTask = () => {
    const taskText = newTodoInput.value.trim();
    if (taskText) {
      const listItem = document.createElement('li');
      const checkbox = document.createElement('sp-checkbox');
      checkbox.textContent = taskText;
      listItem.appendChild(checkbox);
      todoList.appendChild(listItem);
      newTodoInput.value = '';
    }
  };

  newTodoInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      addTask();
    }
  });

  addButton.addEventListener('click', addTask);
  performance.mark('swc-tbt-finished');
  performance.measure(
    'swc-tbt-duration',
    'swc-tbt-started',
    'swc-tbt-finished',
  );
  await deps;
  return el;
}
