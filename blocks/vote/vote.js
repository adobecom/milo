export default async function init(el) {
  const form = document.createElement('form');
  const resp = await fetch('names.json');
  const json = await resp.json();

  const choices = json.data.map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  choices.forEach((choice) => {
    const { name, description } = choice;

    // Card
    const card = document.createElement('div');
    card.className = 'vote-card';

    // Radio
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'name';
    input.id = name;
    input.value = name;

    // Label
    const label = document.createElement('label');
    label.setAttribute('for', name);
    label.innerHTML = name;

    // Description
    const desc = document.createElement('p');
    desc.innerHTML = description;

    card.append(input, label, description);
    form.append(card);
  });
  el.append(form);
}