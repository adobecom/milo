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

    // Confirm
    const conf = document.createElement('button');
    conf.textContent = 'Confirm vote';

    card.append(input, label, description, conf);
    form.append(card);
  });

  form.addEventListener('click', (e) => {
    e.preventDefault();
    const currCard = e.target.closest('.vote-card');
    if (currCard) {
        const prevCard = form.querySelector('.vote-card.selected');
        if (prevCard !== currCard) {
            currCard.classList.add('selected');
            if (e.target.nodeName == 'BUTTON') {
            
            }
        }
        prevCard?.classList.remove('selected');
    }
  });

  document.body.addEventListener('click', (e) => {
    const currCard = e.target.closest('.vote-card');
    if (!currCard) {
      document.querySelector('.vote-card.selected')?.classList.remove('selected');
    }
  });

  el.append(form);
}