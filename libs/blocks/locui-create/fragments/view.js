import showFragments from './index.js';
import { useEffect, html, useState } from '../../../deps/htm-preact.js';

function Loader() {
  return html`<div class='locui-create-loader-container'>
  <div class='locui-create-loader'></div>
  <p>Loading</p>
  </div>`;
}

export default function FragmentsSection({
  selectedFragments,
  setSelectedFragments,
  allFragments,
  isLoading,
}) {
  const [validFragments, setValidFragments] = useState([]);
  const [errorFragments, setErrorFragments] = useState([]);

  useEffect(() => {
    setValidFragments(allFragments.filter((frag) => !frag?.valid));
    const invalid = allFragments.filter((frag) => typeof frag?.valid === 'string');
    setErrorFragments(invalid);
  }, [allFragments]);

  const handleClick = (event) => {
    const pathname = event.target?.value;
    if (!selectedFragments.find((path) => path === pathname)) {
      setSelectedFragments([...selectedFragments, pathname]);
    } else {
      const filterFrag = selectedFragments.filter((path) => path !== pathname);
      setSelectedFragments(filterFrag);
    }
  };

  const locFragment = (fragment) => {
    const checked = selectedFragments.find((pathname) => pathname === fragment.pathname);
    const parentPages = fragment?.parentPages?.filter((page) => page) ?? [];
    return html`
    <li class="locui-create-fragment">
    <div class="locui-create-fragment-input-container">
     <input name=${fragment.pathname} value=${fragment.pathname} id=${fragment.pathname} type="checkbox" checked=${checked} onClick=${handleClick}/>
     <label class='locui-create-fragment-label' for=${fragment.pathname}>${fragment.pathname}</label>
     </div>
     <ul class='locui-create-fragment-parent'>
      ${parentPages.map((parentPage) => html`<li>${parentPage}</li>`)}
     </ul>
    </div>`;
  };

  return html`
  <div class='locui-create-fragments-container'>
  ${isLoading ? html`<${Loader} />`
    : html`
    <ul class=${`locui-create-fragments-list ${validFragments.length > 0 && selectedFragments.length < 1 && 'error'}`}>
   ${validFragments?.length > 0 ? validFragments.map((fragment) => locFragment(fragment)) : html`<p>No Valid fragments</p>`}
   </ul>`
}
   <div>
    ${errorFragments?.length > 0 && html`<div class='form-field-error'>Invalid fragments <button class='locui-invalid-fragments-btn' onClick=${() => {
    showFragments(errorFragments);
  }}>view details</button></div>`}
   </div>
  </div>`;
}
