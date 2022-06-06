export default async function init(el) {
  const p = el.querySelector('p');
  const heading = document.createElement('h2');
  heading.textContent = p.textContent;
  el.insertAdjacentElement('afterbegin', heading);

  const resp = await fetch('/drafts/echarts/bar-chart.json');
  if (resp.ok) {
    const json = await resp.json();
    json.data.forEach((metric) => {
      console.log(metric);
      const div = document.createElement('div');
      div.className = "metric";
      const h2 = document.createElement('h2');
      h2.textContent = metric.Browsers;
      
      const c = document.createElement('p');
      c.textContent = `Chrome: ${metric.Chrome}`;

      const ff = document.createElement('p');
      ff.textContent = `Firefox: ${metric.Firefox}`;

      div.append(h2, c, ff);
      el.append(div);
    });
  }

}
