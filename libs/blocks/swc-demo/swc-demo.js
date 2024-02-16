import { getConfig } from '../../utils/utils.js';

export default async function main(el) {
  const { base } = getConfig();
  await Promise.all([
    import(`${base}/features/spectrum-web-components/dist/button.js`),
    import(`${base}/features/spectrum-web-components/dist/checkbox.js`),
    import(`${base}/features/spectrum-web-components/dist/textfield.js`),
    import(`${base}/features/spectrum-web-components/dist/theme.js`),
  ]);
  el.innerHTML = `
  <sp-theme scale="medium" color="light">
  <div id="todo-app">
      <sp-textfield id="new-todo" placeholder="What needs to be done?"></sp-textfield>
      <sp-button variant="cta" id="add-todo">Add</sp-button>
      <ul id="todo-list"></ul>
  </div>
</sp-theme>
`;

  const addButton = document.getElementById('add-todo');
  const newTodoInput = document.getElementById('new-todo');
  const todoList = document.getElementById('todo-list');

  addButton.addEventListener('click', () => {
    const taskText = newTodoInput.value.trim();
    if (taskText) {
      const listItem = document.createElement('li');
      const checkbox = document.createElement('sp-checkbox');
      checkbox.textContent = taskText;
      listItem.appendChild(checkbox);
      todoList.appendChild(listItem);
      newTodoInput.value = '';
    }
  });

  return el;
}
