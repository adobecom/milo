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
    const validFrag = allFragments.filter((frag) => !frag?.valid);
    setValidFragments(validFrag);
    setSelectedFragments(validFrag.map(({ pathname }) => pathname));
    const invalid = allFragments.filter((frag) => typeof frag?.valid === 'string');
    setErrorFragments(invalid);
  }, [allFragments, setSelectedFragments]);

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
    return html`
    <li class="locui-create-fragment">
    <div class="locui-create-fragment-input-container">
     <input name=${fragment.pathname} value=${fragment.pathname} id=${fragment.pathname} type="checkbox" checked=${checked} onClick=${handleClick}/>
     <label class='locui-create-fragment-label' for=${fragment.pathname}>${fragment.pathname}</label>
     </div>
     <ul class='locui-create-fragment-parent'>
      ${fragment.parentPages && fragment.parentPages.length > 0 && fragment.parentPages.map((parentPage) => html`<li>${parentPage}</li>`)}
     </ul>
    </div>`;
  };

  return html`
  <div class='locui-create-fragments-container'>
  ${isLoading ? html`<${Loader} />`
    : html`
    <ul class=${`locui-create-fragments-list ${validFragments.length > 0 && selectedFragments.length < 1 && 'error'}`}>
   ${validFragments && validFragments.length > 0 ? validFragments.map((fragment) => locFragment(fragment)) : html`<p>No Valid fragments</p>`}
   </ul>`
}
   <div>
    ${errorFragments && errorFragments.length > 0 && html`<div class='form-field-error'>Invalid fragments <a href="#" onClick=${() => showFragments(errorFragments)}>view details</a></div>`}
    ${validFragments.length > 0 && selectedFragments.length < 1 && html`<div class='form-field-error'>Select atleast one fragment to proceed further</div>`}
   </div>
  </div>`;
}
