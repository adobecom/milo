import { findFragments, showFragments } from './index.js';
import { useEffect, useCallback, html, useState } from '../../../deps/htm-preact.js';
import { getUrls } from '../../locui/loc/index.js';

function Loader() {
  return html`<div class='locui-create-loader-container'>
  <div class='locui-create-loader'></div>
  <p>Loading</p>
  </div>`;
}

export default function FragmentsSection({ fragments, setFragments, urls }) {
  const [validFragments, setValidFragments] = useState([]);
  const [errorFragments, setErrorFragments] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const fetchFragments = useCallback(async () => {
    const inputUrls = urls.split(/[,\r\n]/g).map((url) => new URL(url));
    setLoading(true);
    const found = await findFragments(getUrls(inputUrls));
    setValidFragments(found.filter((frag) => !frag?.valid));
    setFragments(found.filter((frag) => !frag?.valid).map(({ pathname }) => pathname));
    const invalid = found.filter((frag) => typeof frag?.valid === 'string');
    setErrorFragments(invalid);
    setLoading(false);
  }, [setFragments, urls]);

  useEffect(() => {
    fetchFragments();
  }, []);

  const handleRefresh = () => {
    fetchFragments();
  };

  const handleClick = (event) => {
    const pathname = event.target?.value;
    if (!fragments.find((path) => path === pathname)) {
      setFragments([...fragments, pathname]);
    } else {
      const filterFrag = fragments.filter((path) => path !== pathname);
      setFragments(filterFrag);
    }
  };

  const locFragment = (fragment) => {
    const checked = fragments.find((pathname) => pathname === fragment.pathname);
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
    <button class="locui-create-refresh-button" onClick=${handleRefresh}/>
    <ul class='locui-create-fragments-list'>
   ${validFragments && validFragments.length > 0 && validFragments.map((fragment) => locFragment(fragment))}
   </ul>`
}
   <div>
    ${errorFragments && errorFragments.length > 0 && html`<p class='locui-create-error-text'>Invalid fragments <a href="#" onClick=${() => showFragments(errorFragments)}>view details</a></p>`}
    ${validFragments.length > 0 && fragments.length < 1 && html`<p class='locui-create-error-text'>Select atleast one fragment to proceed further</p>`}
   </div>
  </div>`;
}
